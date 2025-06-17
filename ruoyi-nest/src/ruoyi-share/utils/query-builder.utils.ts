import { Injectable, Logger } from '@nestjs/common';
import { DataSource, EntityManager, Repository, SelectQueryBuilder, DeleteQueryBuilder, InsertQueryBuilder, UpdateQueryBuilder } from 'typeorm';
import { ContextHolderUtils } from '~/ruoyi-share/utils/context-holder.utils';

@Injectable()
export class QueryBuilderUtils {
  private readonly logger = new Logger(QueryBuilderUtils.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly contextHolderUtils: ContextHolderUtils,
  ) {}

  // 修正方法签名，返回标准的 SelectQueryBuilder
  createQueryBuilder<Entity>(
    repository: Repository<Entity>,
    alias?: string
  ): SelectQueryBuilder<Entity>;
  createQueryBuilder<Entity>(
    entityClass: new () => Entity,
    alias?: string
  ): SelectQueryBuilder<Entity>;
  createQueryBuilder<Entity>(
    entityManager: EntityManager,
    entityClass: new () => Entity,
    alias?: string
  ): SelectQueryBuilder<Entity>;
  createQueryBuilder(): SelectQueryBuilder<any>;
  createQueryBuilder<Entity>(
    repositoryOrEntityClassOrManager?: Repository<Entity> | (new () => Entity) | EntityManager,
    aliasOrEntityClass?: string | (new () => Entity),
    alias?: string
  ): SelectQueryBuilder<Entity> {
    let queryBuilder: SelectQueryBuilder<Entity>;
    let entityName: string;
    let repository: Repository<Entity> | null = null;

    // 获取当前事务管理器
    const transactionManager = this.contextHolderUtils.getContext('transactionManager');
    const entityManager = transactionManager || this.dataSource.manager;

    if (!repositoryOrEntityClassOrManager) {
      queryBuilder = entityManager.createQueryBuilder();
      entityName = `${transactionManager ? '事务' : '普通'}-原生查询`;
      
      return this.enhanceSelectQueryBuilder(queryBuilder, entityName, repository, entityManager);
    }

    if (repositoryOrEntityClassOrManager instanceof Repository) {
      repository = repositoryOrEntityClassOrManager;
      if (aliasOrEntityClass) {
        queryBuilder = entityManager.createQueryBuilder(
          repositoryOrEntityClassOrManager.target as new () => Entity,
          aliasOrEntityClass as string
        );
      } else {
        queryBuilder = entityManager.createQueryBuilder(
          repositoryOrEntityClassOrManager.target as new () => Entity
        );
      }
      entityName = `${transactionManager ? '事务' : '普通'}-${repositoryOrEntityClassOrManager.metadata.tableName}`;
    } else if (repositoryOrEntityClassOrManager instanceof EntityManager) {
      queryBuilder = repositoryOrEntityClassOrManager.createQueryBuilder(
        aliasOrEntityClass as new () => Entity,
        alias
      );
      entityName = `指定管理器-${(aliasOrEntityClass as any).name}`;
    } else {
      if (aliasOrEntityClass) {
        queryBuilder = entityManager.createQueryBuilder(
          repositoryOrEntityClassOrManager,
          aliasOrEntityClass as string
        );
      } else {
        queryBuilder = entityManager.createQueryBuilder(repositoryOrEntityClassOrManager);
      }
      entityName = `${transactionManager ? '事务' : '普通'}-${repositoryOrEntityClassOrManager.name}`;
    }

    return this.enhanceSelectQueryBuilder(queryBuilder, entityName, repository, entityManager);
  }



  private enhanceSelectQueryBuilder<Entity>(
    queryBuilder: SelectQueryBuilder<Entity>,
    entityName: string,
    repository: Repository<Entity> | null,
    entityManager: EntityManager
  ): SelectQueryBuilder<Entity> {
    // 保存原始方法
    const originalGetMany = queryBuilder.getMany?.bind(queryBuilder);
    const originalGetOne = queryBuilder.getOne?.bind(queryBuilder);
    const originalGetCount = queryBuilder.getCount?.bind(queryBuilder);
    const originalGetRawMany = queryBuilder.getRawMany?.bind(queryBuilder);
    const originalGetRawOne = queryBuilder.getRawOne?.bind(queryBuilder);
    const originalExecute = queryBuilder.execute?.bind(queryBuilder);
    const originalGetManyAndCount = queryBuilder.getManyAndCount?.bind(queryBuilder);

    // 增强 SELECT 相关方法
    if (originalGetMany) {
      queryBuilder.getMany = async () => {
        this.logger.log(queryBuilder, 'getMany');
        return this.executeWithTiming('getMany', entityName, originalGetMany);
      };
    }

    if (originalGetOne) {
      queryBuilder.getOne = async () => {
        this.logger.log(queryBuilder, 'getOne');
        return this.executeWithTiming('getOne', entityName, originalGetOne);
      };
    }

    if (originalGetCount) {
      queryBuilder.getCount = async () => {
        this.logger.log(queryBuilder, 'getCount');
        return this.executeWithTiming('getCount', entityName, originalGetCount);
      };
    }

    if (originalGetManyAndCount) {
      queryBuilder.getManyAndCount = async () => {
        this.logger.log(queryBuilder, 'getManyAndCount');
        return this.executeWithTiming('getManyAndCount', entityName, originalGetManyAndCount);
      };
    }

    if (originalGetRawMany) {
      queryBuilder.getRawMany = async () => {
        this.logger.log(queryBuilder, 'getRawMany');
        return this.executeWithTiming('getRawMany', entityName, originalGetRawMany);
      };
    }

    if (originalGetRawOne) {
      queryBuilder.getRawOne = async () => {
        this.logger.log(queryBuilder, 'getRawOne');
        return this.executeWithTiming('getRawOne', entityName, originalGetRawOne);
      };
    }

    if (originalExecute) {
      queryBuilder.execute = async () => {
        this.logger.log(queryBuilder, 'execute');
        return this.executeWithTiming('execute', entityName, originalExecute);
      };
    }

    // 修复链式方法 - 使用正确的 EntityManager 创建新的 QueryBuilder
    const originalDelete = queryBuilder.delete?.bind(queryBuilder);
    const originalInsert = queryBuilder.insert?.bind(queryBuilder);
    const originalUpdate = queryBuilder.update?.bind(queryBuilder);

    if (originalDelete) {
      queryBuilder.delete = (...args: any[]): DeleteQueryBuilder<Entity> => {
        // 使用当前的 EntityManager 创建新的 DeleteQueryBuilder
        const deleteBuilder = entityManager.createQueryBuilder().delete();
        // 复制必要的配置
        if (args.length > 0) {
          deleteBuilder.from(args[0]);
        }
        return this.enhanceDeleteQueryBuilder(deleteBuilder, `${entityName}-DELETE`);
      };
    }

    if (originalInsert) {
      queryBuilder.insert = (...args: any[]): InsertQueryBuilder<Entity> => {
        // 使用当前的 EntityManager 创建新的 InsertQueryBuilder
        const insertBuilder = entityManager.createQueryBuilder().insert();
        if (args.length > 0) {
          insertBuilder.into(args[0]);
        }
        return this.enhanceInsertQueryBuilder(insertBuilder, `${entityName}-INSERT`);
      };
    }

    if (originalUpdate) {
      queryBuilder.update = (...args: any[]): UpdateQueryBuilder<Entity> => {
        // 使用当前的 EntityManager 创建新的 UpdateQueryBuilder
        const updateBuilder = entityManager.createQueryBuilder().update(args[0]);
        return this.enhanceUpdateQueryBuilder(updateBuilder, `${entityName}-UPDATE`);
      };
    }

    return queryBuilder;
  }

  private enhanceDeleteQueryBuilder<Entity>(
    queryBuilder: DeleteQueryBuilder<Entity>,
    entityName: string
  ): DeleteQueryBuilder<Entity> {
    const originalExecute = queryBuilder.execute?.bind(queryBuilder);

    if (originalExecute) {
      queryBuilder.execute = async () => {
        this.logger.log(queryBuilder, 'execute');
        return this.executeWithTiming('execute', entityName, originalExecute);
      };
    }

    return queryBuilder;
  }

  private enhanceInsertQueryBuilder<Entity>(
    queryBuilder: InsertQueryBuilder<Entity>,
    entityName: string
  ): InsertQueryBuilder<Entity> {
    const originalExecute = queryBuilder.execute?.bind(queryBuilder);

    if (originalExecute) {
      queryBuilder.execute = async () => {
        this.logger.log(queryBuilder, 'execute');
        return this.executeWithTiming('execute', entityName, originalExecute);
      };
    }

    return queryBuilder;
  }

  private enhanceUpdateQueryBuilder<Entity>(
    queryBuilder: UpdateQueryBuilder<Entity>,
    entityName: string
  ): UpdateQueryBuilder<Entity> {
    const originalExecute = queryBuilder.execute?.bind(queryBuilder);

    if (originalExecute) {
      queryBuilder.execute = async () => {
        this.logger.log(queryBuilder, 'execute');
        return this.executeWithTiming('execute', entityName, originalExecute);
      };
    }

    return queryBuilder;
  }

  private async executeWithTiming<T>(
    operation: string,
    entityName: string,
    executor: () => Promise<T>
  ): Promise<T> {
    const requestId = this.contextHolderUtils.getContext('requestId') || 'unknown';
    const startTime = Date.now();
    
    try {
      const result = await executor();
      const duration = Date.now() - startTime;
      
      this.logger.log(`[${requestId}] 查询完成: ${operation} ${entityName} - ${duration}ms`);
      
      if (duration > 1000) {
        this.logger.warn(`[${requestId}] 慢查询: ${operation} ${entityName} - ${duration}ms`);
      }

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error(
        `[${requestId}] 查询失败: ${operation} ${entityName} - ${duration}ms - ${error.message}`
      );
      throw error;
    }
  }
}