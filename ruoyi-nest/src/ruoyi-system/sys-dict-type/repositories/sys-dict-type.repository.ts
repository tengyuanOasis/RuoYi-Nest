import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SysDictType } from '~/ruoyi-system/sys-dict-type/entities/sys-dict-type.entity';
import { DictUtils } from '~/ruoyi-share/utils/dict.utils';
import { SqlLoggerUtils } from '~/ruoyi-share/utils/sql-logger.utils';
import { ContextHolderUtils } from '~/ruoyi-share/utils/context-holder.utils';
import { QueryUtils } from '~/ruoyi-share/utils/query.utils';
import { QueryBuilderUtils } from '~/ruoyi-share/utils/query-builder.utils';
@Injectable()
export class SysDictTypeRepository {
    constructor(
        @InjectRepository(SysDictType)
        private readonly dictTypeRepository: Repository<SysDictType>,
        private readonly sqlLoggerUtils: SqlLoggerUtils,
        private readonly contextHolderUtils: ContextHolderUtils,
        private readonly dictUtils: DictUtils,
        private readonly queryUtils: QueryUtils,
        private readonly queryBuilderUtils: QueryBuilderUtils
    ) {}

    selectDictTypeVo() {
        return this.queryBuilderUtils.createQueryBuilder(this.dictTypeRepository,'d')
            .select([
                'd.dictId',
                'd.dictName',
                'd.dictType',
                'd.status',
                'd.createBy',
                'd.createTime',
                'd.updateBy',
                'd.updateTime',
                'd.remark'
            ]);
    }

    /**
     * 根据条件分页查询字典类型
     */
    async selectDictTypeList(query: SysDictType): Promise<[SysDictType[], number]> {
        const queryBuilder = this.selectDictTypeVo()

        if (query.dictName) {
            queryBuilder.andWhere('d.dictName LIKE :dictName', { dictName: `%${query.dictName}%` });
        }
        if (query.status) {
            queryBuilder.andWhere('d.status = :status', { status: query.status });
        }
        if (query.dictType) {
            queryBuilder.andWhere('d.dictType LIKE :dictType', { dictType: `%${query.dictType}%` });
        }
        if (query.params?.beginTime && query.params?.endTime) {
            queryBuilder.andWhere('DATE_FORMAT(d.createTime, "%Y%m%d") BETWEEN DATE_FORMAT(:beginTime, "%Y%m%d") AND DATE_FORMAT(:endTime, "%Y%m%d")', { beginTime: query.params.beginTime, endTime: query.params.endTime });
        }

        queryBuilder.orderBy('d.dictId', 'ASC');
        this.sqlLoggerUtils.log(queryBuilder, 'selectDictTypeList');
        return this.queryUtils.executeQuery(queryBuilder, query);
    }

    /**
     * 查询所有字典类型
     */
    async selectDictTypeAll(): Promise<SysDictType[]> {
        const queryBuilder = this.selectDictTypeVo();
        this.sqlLoggerUtils.log(queryBuilder, 'selectDictTypeAll');
        return queryBuilder.getMany();
    }

    /**
     * 根据字典类型ID查询信息
     */
    async selectDictTypeById(dictId: number): Promise<SysDictType> {
        const queryBuilder = this.selectDictTypeVo()
            .where('d.dictId = :dictId', { dictId });
        this.sqlLoggerUtils.log(queryBuilder, 'selectDictTypeById');
        return queryBuilder.getOne();
    }

    /**
     * 根据字典类型查询信息
     */
    async selectDictTypeByType(dictType: string): Promise<SysDictType> {
        const queryBuilder = this.queryBuilderUtils.createQueryBuilder(this.dictTypeRepository,'d')
            .where('d.dictType = :dictType', { dictType });
        this.sqlLoggerUtils.log(queryBuilder, 'selectDictTypeByType');
        return queryBuilder.getOne();
    }

    /**
     * 通过字典ID删除字典类型信息
     */
    async deleteDictTypeById(dictId: number): Promise<void> {
        const queryBuilder = this.queryBuilderUtils.createQueryBuilder(this.dictTypeRepository)
            .delete()
            .from(SysDictType)
            .where('dictId = :dictId', { dictId });

        this.sqlLoggerUtils.log(queryBuilder, 'deleteDictTypeById');
        await queryBuilder.execute();
    }

    /**
     * 批量删除字典类型信息
     */
    async deleteDictTypeByIds(dictIds: number[]): Promise<void> {
        const queryBuilder = this.queryBuilderUtils.createQueryBuilder(this.dictTypeRepository)
            .delete()
            .from(SysDictType)
            .whereInIds(dictIds);

        this.sqlLoggerUtils.log(queryBuilder, 'deleteDictTypeByIds');
        await queryBuilder.execute();
    }

    /**
     * 新增字典类型信息
     */
    async insertDictType(dictType: SysDictType): Promise<number> {
        const insertObj: any = {};
        
        if (dictType.dictName != null && dictType.dictName != '') insertObj.dictName = dictType.dictName;
        if (dictType.dictType != null && dictType.dictType != '') insertObj.dictType = dictType.dictType;
        if (dictType.status != null) insertObj.status = dictType.status;
        if (dictType.remark != null && dictType.remark != '') insertObj.remark = dictType.remark;
        if (dictType.createBy != null && dictType.createBy != '') insertObj.createBy = dictType.createBy;
        insertObj.createTime = new Date();

        const queryBuilder = this.queryBuilderUtils.createQueryBuilder(this.dictTypeRepository)
            .insert()
            .into(SysDictType)
            .values(insertObj);

        this.sqlLoggerUtils.log(queryBuilder, 'insertDictType');
        const result = await queryBuilder.execute();
        return result.identifiers[0].dictId;
    }

    /**
     * 修改字典类型信息
     */
    async updateDictType(dictType: SysDictType): Promise<number> {
        const updateData: any = {
            updateTime: new Date()
        };

        if (dictType.dictName != null && dictType.dictName != '') updateData.dictName = dictType.dictName;
        if (dictType.dictType != null && dictType.dictType != '') updateData.dictType = dictType.dictType;
        if (dictType.status != null) updateData.status = dictType.status;
        if (dictType.remark != null) updateData.remark = dictType.remark;
        if (dictType.updateBy != null && dictType.updateBy != '') updateData.updateBy = dictType.updateBy;

        const result = await this.dictTypeRepository.update(dictType.dictId, updateData);
        return result.affected;
    }

    /**
     * 校验字典类型是否唯一
     */
    async checkDictTypeUnique(dictType: string): Promise<SysDictType> {
        const queryBuilder = this.queryBuilderUtils.createQueryBuilder(this.dictTypeRepository,'d')
            .where('d.dictType = :dictType', { dictType });
        this.sqlLoggerUtils.log(queryBuilder, 'checkDictTypeUnique');
        return queryBuilder.getOne();
    }
}
