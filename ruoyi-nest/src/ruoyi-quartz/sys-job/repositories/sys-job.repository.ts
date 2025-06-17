import { Injectable } from '@nestjs/common';
import { Repository, DataSource, SelectQueryBuilder, EntityManager } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SysJob } from '~/ruoyi-quartz/sys-job/entities/sys-job.entity';
import { QueryUtils } from '~/ruoyi-share/utils/query.utils';
import { SensitiveUtils } from '~/ruoyi-share/utils/sensitive.utils';
import { DataScopeUtils } from '~/ruoyi-share/utils/data-scope.utils';
import { LoginUser } from '~/ruoyi-share/model/login-user';
import { SqlLoggerUtils } from '~/ruoyi-share/utils/sql-logger.utils';
import { SecurityUtils } from '~/ruoyi-share/utils/security.utils';
import { ContextHolderUtils } from '~/ruoyi-share/utils/context-holder.utils';
import { QueryBuilderUtils } from '~/ruoyi-share/utils/query-builder.utils';
@Injectable()
export class SysJobRepository {

    constructor(
        @InjectRepository(SysJob)
        private readonly jobRepository: Repository<SysJob>,
        private readonly queryUtils: QueryUtils,
        private readonly dataScopeUtils: DataScopeUtils,
        private readonly sqlLoggerUtils: SqlLoggerUtils,    
        private readonly securityUtils: SecurityUtils,
        private readonly contextHolderUtils: ContextHolderUtils,
        private readonly queryBuilderUtils: QueryBuilderUtils
    ) {}



    selectJobVo() {
        return this.queryBuilderUtils.createQueryBuilder(this.jobRepository,'job')
            .select([
                'job.jobId',
                'job.jobName',
                'job.jobGroup',
                'job.invokeTarget',
                'job.cronExpression',
                'job.misfirePolicy',
                'job.concurrent',
                'job.status',
                'job.createBy',
                'job.createTime',
                'job.remark'
            ])
    }
 
    async selectJobList(job: SysJob): Promise<[SysJob[],number]> {
        const queryBuilder = this.selectJobVo()

        if (job.jobName) {
            queryBuilder.andWhere('job.jobName LIKE :jobName', { jobName: `%${job.jobName}%` });
        }

        if (job.jobGroup) {
            queryBuilder.andWhere('job.jobGroup = :jobGroup', { jobGroup: job.jobGroup });
        }

        if (job.status) {
            queryBuilder.andWhere('job.status = :status', { status: job.status });
        }

        if (job.invokeTarget) {
            queryBuilder.andWhere('job.invokeTarget LIKE :invokeTarget', { invokeTarget: `%${job.invokeTarget}%` });
        }

        this.sqlLoggerUtils.log(queryBuilder,'selectJobList');
        
        const [rows, len] = await this.queryUtils.executeQuery(queryBuilder, job);
        return [rows, len];
    }

    async selectJobAll(): Promise<SysJob[]> {
        const queryBuilder = this.selectJobVo()

     
        
        const rows = await queryBuilder.getMany();
        return rows;
    }

    async selectJobById(jobId: number): Promise<SysJob> {
        const queryBuilder = this.selectJobVo()
            .where('job.jobId = :jobId', { jobId });

        this.sqlLoggerUtils.log(queryBuilder, 'selectJobById');
        
        return queryBuilder.getOne();
    }

    async deleteJobById(jobId: number): Promise<number> {
        const queryBuilder = this.queryBuilderUtils.createQueryBuilder(this.jobRepository)
            .delete()
            .from(SysJob)
            .where('jobId = :jobId', { jobId });

        this.sqlLoggerUtils.log(queryBuilder, 'deleteJobById');

        const result = await queryBuilder.execute();
        return result.affected;
    }

    async deleteJobByIds(jobIds: number[]): Promise<number> {
        const queryBuilder = this.queryBuilderUtils.createQueryBuilder(this.jobRepository)
            .delete()
            .from(SysJob)
            .whereInIds(jobIds);

        this.sqlLoggerUtils.log(queryBuilder, 'deleteJobByIds');

        const result = await queryBuilder.execute();
        return result.affected;
    }

    async updateJob(job: SysJob): Promise<number> {
        const updateData: any = {
            updateTime: new Date()
        };
        if (job.jobName != null && job.jobName != '') {
            updateData.jobName = job.jobName;
        }
        if (job.jobGroup != null && job.jobGroup != '') {
            updateData.jobGroup = job.jobGroup;
        }
        if (job.invokeTarget != null && job.invokeTarget != '') {
            updateData.invokeTarget = job.invokeTarget;
        }
        if (job.cronExpression != null && job.cronExpression != '') {
            updateData.cronExpression = job.cronExpression;
        }
        if (job.misfirePolicy != null && job.misfirePolicy != '') {
            updateData.misfirePolicy = job.misfirePolicy;
        }
        if (job.concurrent != null && job.concurrent != '') {
            updateData.concurrent = job.concurrent;
        }
        if (job.status != null) {
            updateData.status = job.status;
        }
        if (job.remark != null && job.remark != '') {
            updateData.remark = job.remark;
        }
        if (job.updateBy != null && job.updateBy != '') {
            updateData.updateBy = job.updateBy;
        }

        const queryBuilder = this.queryBuilderUtils.createQueryBuilder(this.jobRepository)
            .update(SysJob)
            .set(updateData)
            .where('jobId = :jobId', { jobId: job.jobId });

        this.sqlLoggerUtils.log(queryBuilder, 'updateJob');
        const result = await queryBuilder.execute();
        return result.affected;
    }

    async insertJob(job: SysJob): Promise<number> {
        const insertObject: any = {
            createTime: new Date()
        };

        if (job.jobId != null && job.jobId != 0) {
            insertObject.jobId = job.jobId;
        }
        if (job.jobName != null && job.jobName != '') {
            insertObject.jobName = job.jobName;
        }
        if (job.jobGroup != null && job.jobGroup != '') {
            insertObject.jobGroup = job.jobGroup;
        }
        if (job.invokeTarget != null && job.invokeTarget != '') {
            insertObject.invokeTarget = job.invokeTarget;
        }
        if (job.cronExpression != null && job.cronExpression != '') {
            insertObject.cronExpression = job.cronExpression;
        }
        if (job.misfirePolicy != null && job.misfirePolicy != '') {
            insertObject.misfirePolicy = job.misfirePolicy;
        }
        if (job.concurrent != null && job.concurrent != '') {
            insertObject.concurrent = job.concurrent;
        }
        if (job.status != null && job.status != '') {
            insertObject.status = job.status;
        }
        if (job.remark != null && job.remark != '') {
            insertObject.remark = job.remark;
        }
        if (job.createBy != null && job.createBy != '') {
            insertObject.createBy = job.createBy;
        }

        const queryBuilder = this.queryBuilderUtils.createQueryBuilder(this.jobRepository)    
            .insert()
            .into(SysJob)
            .values(insertObject);

        this.sqlLoggerUtils.log(queryBuilder, 'insertJob');

        const result = await queryBuilder.execute();
        return result.raw.insertId;
    }
}
