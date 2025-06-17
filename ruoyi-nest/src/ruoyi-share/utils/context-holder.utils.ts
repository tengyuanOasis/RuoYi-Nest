// context-holder.service.ts
import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class ContextHolderUtils{
  private asyncLocalStorage = new AsyncLocalStorage<Map<string, any>>();

   // 静态实例，用于静态方法调用
   private static globalInstance: ContextHolderUtils;


   constructor() {
    // 设置全局实例
    ContextHolderUtils.globalInstance = this;
  }

  setContext(key: string, value: any) {
    const store = this.asyncLocalStorage.getStore();
    if (store) {
      store.set(key, value);
    }
  }

  clearContext() {
    const store = this.asyncLocalStorage.getStore();
    if (store) {
      store.clear();
    }
  }
  /**
   * 获取所有上下文
   */
  getAllContext(): Record<string, any> {
    const store = this.asyncLocalStorage.getStore();
    if (!store) {
      return {};
    }
    const context = {};
    store.forEach((value, key) => {
      context[key] = value;
    });
    return context;
  }
  getContext(key: string) {
    const store = this.asyncLocalStorage.getStore();
    return store ? store.get(key) : null;
  }
  runWithContext<T>(callback: () => T): T {
    return this.asyncLocalStorage.run(new Map(), callback);
  }



    // 静态方法 - 使用全局实例
  
    // 获取静态实例（用于调试或特殊情况）
    static getInstance(): ContextHolderUtils | null {
      return this.globalInstance;
    }
}