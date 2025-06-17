import { Injectable } from '@nestjs/common';
import { DataScope } from '~/ruoyi-share/constant/DataScope';
import { UserConstants } from '../constant/UserConstants';
import { SysUser } from '~/ruoyi-system/sys-user/entities/sys-user.entity';
import { SysDept } from '~/ruoyi-system/sys-dept/entities/sys-dept.entity';
import { SysRoleDept } from '~/ruoyi-system/sys-role-dept/entities/sys-role-dept.entity';
import { Brackets, SelectQueryBuilder } from 'typeorm';
import { SecurityUtils } from './security.utils';
import { LoginUser } from '../model/login-user';
import { ContextHolderUtils } from './context-holder.utils';
@Injectable()
export class DataScopeUtils {
  constructor(
    private readonly securityUtils: SecurityUtils,
    private readonly contextHolderUtils: ContextHolderUtils
  ) { }

  /**
   * 构建数据过滤条件
   */
  dataScopeFilter(queryBuilder: SelectQueryBuilder<any>) {

    const permission = this.contextHolderUtils.getContext('permission');
    const userAlias = this.contextHolderUtils.getContext('userAlias');
    const deptAlias = this.contextHolderUtils.getContext('deptAlias');

    const loginUser = this.securityUtils.getLoginUser();

    const user: SysUser = loginUser.user;

    // 如果是超级管理员则不过滤数据
    if (this.securityUtils.isAdmin(user.userId)) {
      return;
    }

    // 获取具有自定义数据权限的角色ID
    const scopeCustomIds: number[] = user.roles.filter(role => {
      return role.dataScope === DataScope.DATA_SCOPE_CUSTOM && role.status === UserConstants.ROLE_NORMAL
    }).map(role => role.roleId);




    const conditions: string[] = [];


    queryBuilder.andWhere(new Brackets(qb => {
      // 根据角色数据范围处理
      for (const role of user.roles) {
        if (conditions.includes(role.dataScope) || role.status === UserConstants.ROLE_DISABLE) {
          continue;
        }

        if (!role.permissions.some(p => permission.includes(p))) {
          continue;
        }

        if (DataScope.DATA_SCOPE_ALL === role.dataScope) {
          conditions.push(role.dataScope);
          break;
        } else if (DataScope.DATA_SCOPE_CUSTOM === role.dataScope) {

          if (scopeCustomIds.length > 1) {
            qb.orWhere(`${deptAlias}.dept_id IN (
              SELECT dept_id 
              FROM sys_role_dept 
              WHERE role_id IN (:...roleIds)
            )`, { roleIds: scopeCustomIds });
          } else {
            qb.orWhere(`${deptAlias}.dept_id IN (
              SELECT dept_id 
              FROM sys_role_dept 
              WHERE role_id = :roleId
            )`, { roleId: role.roleId });
          }
        } else if (DataScope.DATA_SCOPE_DEPT === role.dataScope) {
          qb.orWhere(`${deptAlias}.deptId = :deptId`, { deptId: user.deptId });
        } else if (DataScope.DATA_SCOPE_DEPT_AND_CHILD === role.dataScope) {
          qb.orWhere(qb => {
            const subQuery = qb.subQuery()
              .select(`${deptAlias}.deptId`)
              .from(SysDept, deptAlias)
              .where(`${deptAlias}.deptId = :deptId OR FIND_IN_SET(:deptId, ${deptAlias}.ancestors)`, { deptId: user.deptId })
              .getQuery();
            return `${deptAlias}.deptId IN ${subQuery}`;
          });
        } else if (DataScope.DATA_SCOPE_SELF === role.dataScope) {
          if (userAlias) {
            qb.orWhere(`${userAlias}.userId = :userId`, { userId: user.userId });
          } else {
            qb.orWhere(`${deptAlias}.deptId = 0`);
          }
        }
        conditions.push(role.dataScope);
      }

      // 如果没有任何数据权限限制,则不查询任何数据
      if (conditions.length === 0) {
        qb.orWhere(`${deptAlias}.deptId = 0`);
      }

    }))





  }



}
