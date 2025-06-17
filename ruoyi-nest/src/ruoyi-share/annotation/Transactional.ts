// transaction.decorator.ts
import { DataSource, QueryRunner } from 'typeorm';
import { ContextHolderUtils } from '~/ruoyi-share/utils/context-holder.utils';

export function Transactional() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const contextHolderUtils: ContextHolderUtils = ContextHolderUtils.getInstance(); // 获取上下文工具

      // 检查是否已存在事务
      const existingQueryRunner = contextHolderUtils?.getContext('transactionManager')?.queryRunner;
      if (existingQueryRunner?.isTransactionActive) {
          // 如果已存在事务，直接使用现有事务
          return await originalMethod.apply(this, args);
      }

      const dataSource: DataSource = contextHolderUtils?.getContext('dataSource');
      const queryRunner: QueryRunner = dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      // 保存当前上下文中的所有内容
      const currentContext = contextHolderUtils.getAllContext();

      try {
        // 恢复之前的上下文
        Object.entries(currentContext).forEach(([key, value]) => {
          contextHolderUtils.setContext(key, value);
        });

        // 设置上下文
        contextHolderUtils.setContext('transactionManager', queryRunner.manager);

        // 调用原始方法
        const result = await originalMethod.apply(this, args);
        await queryRunner.commitTransaction();
        return result;
      } catch (err) {
        await queryRunner.rollbackTransaction();
        throw err;
      } finally {
        await queryRunner.release();
      }
    };
  };
}