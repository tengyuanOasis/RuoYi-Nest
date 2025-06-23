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
```
## 四 、内置功能

1.  用户管理：用户是系统操作者，该功能主要完成系统用户配置。
2.  部门管理：配置系统组织机构（公司、部门、小组），树结构展现支持数据权限。
3.  岗位管理：配置系统用户所属担任职务。
4.  菜单管理：配置系统菜单，操作权限，按钮权限标识等。
5.  角色管理：角色菜单权限分配、设置角色按机构进行数据范围权限划分。
6.  字典管理：对系统中经常使用的一些较为固定的数据进行维护。
7.  参数管理：对系统动态配置常用参数。
8.  通知公告：系统通知公告信息发布维护。
9.  操作日志：系统正常操作日志记录和查询；系统异常信息日志记录和查询。
10. 登录日志：系统登录日志记录查询包含登录异常。
11. 在线用户：当前系统中活跃用户状态监控。
12. 定时任务：在线（添加、修改、删除)任务调度包含执行结果日志。
13. 代码生成：前后端代码的生成（vue、module、controller、service、repository、entity、sql）支持CRUD下载 。
14. 系统接口：根据业务代码自动生成相关的api接口文档。
15. 服务监控：监视当前系统CPU、内存、磁盘、堆栈等相关信息。
16. 缓存监控：对系统的缓存信息查询，命令统计等。
17. 在线构建器：拖动表单元素生成相应的HTML代码。
