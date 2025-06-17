import { Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SysLogininfor } from '../entities/sys-logininfor.entity';
import { QueryUtils } from '~/ruoyi-share/utils/query.utils';
import { SqlLoggerUtils } from '~/ruoyi-share/utils/sql-logger.utils';
import { QueryBuilderUtils } from '~/ruoyi-share/utils/query-builder.utils';
@Injectable()
export class SysLogininforRepository {

    constructor(
        @InjectRepository(SysLogininfor)
        private readonly logininforRepository: Repository<SysLogininfor>,
        private readonly queryUtils: QueryUtils,
        private readonly sqlLoggerUtils: SqlLoggerUtils,
        private readonly queryBuilderUtils: QueryBuilderUtils
    ) {}

    /**
     * 新增登录日志
     */
    async insertLogininfor(logininfor: SysLogininfor): Promise<void> {
        const insertObj: any = {};
        if (logininfor.userName != null && logininfor.userName != '') insertObj.userName = logininfor.userName;
        if (logininfor.status != null && logininfor.status != '') insertObj.status = logininfor.status;
        if (logininfor.ipaddr != null && logininfor.ipaddr != '') insertObj.ipaddr = logininfor.ipaddr;
        if (logininfor.loginLocation != null && logininfor.loginLocation != '') insertObj.loginLocation = logininfor.loginLocation;
        if (logininfor.browser != null && logininfor.browser != '') insertObj.browser = logininfor.browser;
        if (logininfor.os != null && logininfor.os != '') insertObj.os = logininfor.os;
        if (logininfor.msg != null && logininfor.msg != '') insertObj.msg = logininfor.msg;
        insertObj.loginTime = new Date();

        const queryBuilder = this.queryBuilderUtils.createQueryBuilder(this.logininforRepository)
            .insert()
            .into(SysLogininfor,Object.keys(insertObj))
            .values(insertObj);

        this.sqlLoggerUtils.log(queryBuilder, 'insertLogininfor');
        await queryBuilder.execute();
    }

    async selectLogininforList(query: SysLogininfor): Promise<[SysLogininfor[], number]> {
        const queryBuilder = this.queryBuilderUtils.createQueryBuilder(this.logininforRepository,'l')
            .select([
                'l.infoId',
                'l.userName',
                'l.ipaddr',
                'l.loginLocation',
                'l.browser',
                'l.os',
                'l.status',
                'l.msg',
                'l.loginTime'
            ])

        if (query.ipaddr) {
            queryBuilder.andWhere('l.ipaddr LIKE :ipaddr', { ipaddr: `%${query.ipaddr}%` });
        }
        if (query.status) {
            queryBuilder.andWhere('l.status = :status', { status: query.status });
        }
        if (query.userName) {
            queryBuilder.andWhere('l.userName LIKE :userName', { userName: `%${query.userName}%` });
        }
        if (query.params?.beginTime && query.params?.endTime) {
            queryBuilder.andWhere('l.loginTime BETWEEN :beginTime AND :endTime', {
                beginTime: query.params.beginTime,
                endTime: query.params.endTime   
            });
        }

        queryBuilder.orderBy('l.infoId', 'DESC');

        this.sqlLoggerUtils.log(queryBuilder, 'selectLogininforList');
        return this.queryUtils.executeQuery(queryBuilder,query);
    }

    /**
     * 批量删除登录日志
     */
    async deleteLogininforByIds(infoIds: number[]): Promise<number> {
        const queryBuilder = this.queryBuilderUtils.createQueryBuilder(this.logininforRepository)
            .delete()
            .where('infoId IN (:...infoIds)', { infoIds });

        this.sqlLoggerUtils.log(queryBuilder, 'deleteLogininforByIds');
        const result = await queryBuilder.execute();
        return result.affected;
    }

    /**
     * 清空登录日志
     */
    async cleanLogininfor(): Promise<void> {
        const queryBuilder = this.queryBuilderUtils.createQueryBuilder(this.logininforRepository)
            .delete();

        this.sqlLoggerUtils.log(queryBuilder, 'cleanLogininfor');
        await queryBuilder.execute();
    }
}
