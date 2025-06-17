import { ContextHolderUtils } from "~/ruoyi-share/utils/context-holder.utils";

export function DataScope(options: { deptAlias?: string; userAlias?: string, permission?: string }) {
  return function (
      target: any,
      propertyKey: string,
      descriptor: PropertyDescriptor
  ) {
      const originalMethod = descriptor.value;

      descriptor.value = async function (...args: any[]) {
          // 获取 query 参数 (假设是第一个参数)
          const query = args[0] || {};

        //   // 添加数据权限参数
          query.params = query.params || {};


        const contextHolderUtils = ContextHolderUtils.getInstance();
        

          contextHolderUtils.setContext('params', query.params);
          contextHolderUtils.setContext('deptAlias', options.deptAlias);
          contextHolderUtils.setContext('userAlias', options.userAlias);


          // 调用原始方法
          return await originalMethod.apply(this, args);
      };

      return descriptor;
  };
}