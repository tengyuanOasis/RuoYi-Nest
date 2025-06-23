# RuoYi-Nest 项目代码架构与模块功能文档

## 一、项目概述
RuoYi-Nest 是一个基于 NestJS 构建的后端项目，结合 TypeORM 进行数据库操作，包含系统管理、代码生成、监控等多个功能模块。

## 二、技术栈
- **框架**：NestJS
- **数据库操作**：TypeORM
- **前端构建**：Vue.js（`ruoyi-ui` 目录）
- **代码检查**：ESLint
- **测试**：Jest、Supertest
- **缓存**：Redis

## 三、代码目录结构
```plaintext
RuoYi-Nest/
├── ruoyi-admin/          # 管理模块
│   ├── monitor/          # 监控模块
│   ├── share/            # 共享模块
│   └── system/           # 系统管理模块
├── ruoyi-framework/      # 框架核心模块
│   └── auth/             # 认证相关模块
├── ruoyi-generator/      # 代码生成模块
│   ├── gen/              # 生成核心逻辑
│   └── resources/        # 生成模板资源
├── ruoyi-share/          # 共享模块
│   ├── annotation/       # 自定义注解
│   ├── config/           # 配置文件
│   ├── exception/        # 自定义异常
│   ├── permission/       # 权限管理
│   ├── response/         # 响应处理
│   └── utils/            # 工具类
├── ruoyi-system/         # 系统功能模块
│   ├── sys-config/       # 系统配置
│   ├── sys-dept/         # 部门管理
│   ├── sys-dict-data/    # 字典数据
│   ├── sys-dict-type/    # 字典类型
│   ├── sys-logininfor/   # 登录日志
│   ├── sys-menu/         # 菜单管理
│   ├── sys-notice/       # 通知公告
│   ├── sys-operlog/      # 操作日志
│   ├── sys-post/         # 岗位管理
│   ├── sys-role/         # 角色管理
│   ├── sys-user/         # 用户管理
│   └── sys-user-role/    # 用户角色关联
├── ruoyi-ui/             # 前端项目
│   ├── src/              # 源代码
│   └── package.json      # 依赖配置
├── sql/                  # SQL 脚本
├── test/                 # 测试目录
├── .eslintrc.js          # ESLint 配置
├── nest-cli.json         # NestJS 命令行工具配置
├── tsconfig.json         # TypeScript 配置
└── tsconfig.build.json   # TypeScript 构建配置
