# Backend Directory Structure

```
backend/
├── node_modules/           # 依赖包目录
├── src/                   # 源代码目录
│   ├── config/           # 配置文件目录
│   │   ├── database.js   # 数据库配置
│   │   └── config.js     # 应用配置
│   │
│   ├── controllers/      # 控制器目录
│   │   ├── authController.js    # 认证相关控制器
│   │   └── userController.js    # 用户相关控制器
│   │
│   ├── middleware/       # 中间件目录
│   │   ├── auth.js       # 认证中间件
│   │   ├── error.js      # 错误处理中间件
│   │   └── validate.js   # 数据验证中间件
│   │
│   ├── models/          # 数据模型目录
│   │   ├── User.js      # 用户模型
│   │   └── Message.js   # 消息模型
│   │
│   ├── routes/          # 路由目录
│   │   ├── auth.js      # 认证相关路由
│   │   ├── user.js      # 用户相关路由
│   │   └── index.js     # 路由主文件
│   │
│   ├── services/        # 服务层目录
│   │   ├── authService.js    # 认证相关服务
│   │   └── userService.js    # 用户相关服务
│   │
│   ├── utils/           # 工具函数目录
│   │   ├── logger.js    # 日志工具
│   │   └── helpers.js   # 辅助函数
│   │
│   └── index.js         # 应用入口文件
│
├── tests/               # 测试文件目录
│   ├── unit/           # 单元测试
│   └── integration/    # 集成测试
│
├── logs/               # 日志文件目录
│
├── .env                # 环境变量配置文件
├── .env.example        # 环境变量示例文件
├── .gitignore          # Git忽略文件
├── package.json        # 项目配置和依赖
├── package-lock.json   # 依赖版本锁定文件
└── README.md           # 项目说明文档
```

## 目录说明

### 1. src/ - 源代码目录
- **config/**: 配置文件目录
  - `database.js`: 数据库连接配置
  - `config.js`: 应用全局配置

- **controllers/**: 控制器目录
  - 处理HTTP请求
  - 调用相应的服务
  - 返回HTTP响应

- **middleware/**: 中间件目录
  - `auth.js`: 处理用户认证
  - `error.js`: 统一错误处理
  - `validate.js`: 请求数据验证

- **models/**: 数据模型目录
  - 定义数据库模型
  - 处理数据验证
  - 定义模型间关系

- **routes/**: 路由目录
  - 定义API端点
  - 关联中间件和控制器
  - 处理请求路由

- **services/**: 服务层目录
  - 实现业务逻辑
  - 与数据库交互
  - 处理数据转换

- **utils/**: 工具函数目录
  - `logger.js`: 日志记录工具
  - `helpers.js`: 通用辅助函数

### 2. tests/ - 测试目录
- **unit/**: 单元测试
  - 测试独立功能单元
  - 模拟依赖

- **integration/**: 集成测试
  - 测试多个组件的交互
  - 测试完整功能流程

### 3. 配置文件
- **.env**: 环境变量配置
  - 敏感信息
  - 环境特定配置

- **package.json**: 项目配置
  - 项目元数据
  - 依赖列表
  - 运行脚本

## 文件命名规范
- 使用驼峰命名法
- 控制器文件以 `Controller.js` 结尾
- 路由文件使用功能名称，如 `auth.js`
- 模型文件使用大写开头，如 `User.js`

## 开发规范
1. 所有新功能都应该有对应的测试
2. 使用异步/await处理异步操作
3. 使用统一的错误处理机制
4. 遵循RESTful API设计原则
5. 保持代码注释的完整性
