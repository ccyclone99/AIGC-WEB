# AIGC Web

面向电商卖家的模板化 AI 短视频创作原型，当前提供商品图创作、模板、任务进度、素材和积分等前端流程。

> 默认使用 `prototype` 模式：登录、支付和 AI 生成均为本地演示，不会连接真实服务。

## Requirements

- Node.js 20.18 or newer
- npm 10 or newer

## Scripts

```bash
npm install
npm run dev
npm run lint
npm run test
npm run build
npm run check
npm run preview
```

## Development

应用入口是 `src/main.tsx`，主组合组件是 `src/App.tsx`。API 模式通过 `.env` 配置：

```env
VITE_AIGC_API_MODE=prototype
VITE_AIGC_API_BASE_URL=/api
```

切换到 `http` 模式前，需要先完成 `docs/backend-first-replacement-checklist.md` 中的后端接口。
