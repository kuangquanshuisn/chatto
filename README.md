# Chatto Application

A full-stack chat application built with Vue 3 and Node.js.

## Project Structure

- `frontend/`: Vue 3 frontend application
- `backend/`: Node.js backend server

## Setup Instructions

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
npm install
npm run dev
```


添加登录接口和 JWT 认证：
在 auth.js 中添加登录接口
使用 JWT 生成和验证令牌
创建身份验证中间件：
创建 middleware/auth.js 来验证 JWT 令牌
在需要保护的路由上使用这个中间件
在 app.js 中正确引入和使用路由：
引入 chat 路由
在 chat 路由上添加身份验证中间件