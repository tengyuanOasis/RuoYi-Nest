// // 创建 base.repository.ts
// import { Repository, SelectQueryBuilder, EntityManager } from 'typeorm';
// import { QueryBuilderFactory } from '~/ruoyi-share/factory/query-builder.factory';
// import { ContextHolderUtils } from '~/ruoyi-share/utils/context-holder.utils';
// import { Injectable } from '@nestjs/common';

// export abstract class BaseRepository<Entity> {
//   constructor(
//     protected readonly repository: Repository<Entity>,
//     protected readonly queryBuilderFactory: QueryBuilderFactory,
//     protected readonly contextHolderUtils: ContextHolderUtils
//   ) {}

//   // 创建增强的 QueryBuilder
//   createQueryBuilder(alias?: string): SelectQueryBuilder<Entity> {
//     return this.queryBuilderFactory.createQueryBuilder(this.repository, alias);
//   }

//   // 使用事务管理器创建 QueryBuilder
//   createQueryBuilderWithManager(alias?: string): SelectQueryBuilder<Entity> {
//     const transactionManager = this.contextHolderUtils.getContext('transactionManager');
    
//     if (transactionManager instanceof EntityManager) {
//       return this.queryBuilderFactory.createQueryBuilder(
//         transactionManager,
//         this.repository.target as new () => Entity,
//         alias
//       );
//     }
    
//     return this.createQueryBuilder(alias);
//   }

//   // 其他常用方法也可以在这里封装
//   async findById(id: any): Promise<Entity | null> {
//     return this.createQueryBuilder('entity')
//       .where('entity.id = :id', { id })
//       .getOne();
//   }
// }