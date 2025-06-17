import { NestMiddleware } from "@nestjs/common";

import { NextFunction, Request, Response, } from "express";
import { ContextHolderUtils } from "../utils/context-holder.utils";
import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

// 1. 创建全局上下文中间件
@Injectable()
export class GlobalContextMiddleware implements NestMiddleware {
  constructor(private readonly contextHolderUtils: ContextHolderUtils, private readonly dataSource: DataSource ) { }

  use(req: Request, res: Response, next: NextFunction): void {
    // 在中间件层面创建上下文，整个请求生命周期共享
    this.contextHolderUtils.runWithContext(() => {
      this.contextHolderUtils.setContext('dataSource', this.dataSource);
      const requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      this.contextHolderUtils.setContext('requestId', requestId);
      const startTime = Date.now();
      // 监听响应完成事件
      const cleanup = () => {
        const duration = Date.now() - startTime;
        console.log(`请求完成，耗时: ${duration}ms,${req.originalUrl}`);

        // 清理上下文
        this.contextHolderUtils.clearContext();
      };

      // 监听事件
      res.once('finish', cleanup);
      res.once('close', cleanup);
      res.once('error', cleanup);
      // 继续执行后续的处理
      next();
    });
  }
}