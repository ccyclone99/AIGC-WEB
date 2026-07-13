# AIGC Web

面向电商卖家的模板化 AI 短视频创作网站。`v0.1.0` 是可供客户体验与产品评审的前端演示版，覆盖模板发现、素材输入、模拟生成、作品管理、账号和积分流程。

> 默认使用 `prototype` 模式。登录、支付和 AI 生成均在浏览器内模拟，不会连接真实业务服务，也不会产生真实费用。

## 当前体验

- `首页`：产品入口、代表模板和开始创作入口。
- `创作`：先预览并选择模板，再上传或选择素材并提交生成。
- `全部模板`：独立的模板浏览与筛选页面。
- `作品`：统一管理生成中任务、已完成作品和用户上传素材。
- 顶部账号与积分入口：提供模拟登录、账号菜单、积分充值和流水展示。

当前产品和交互基线见 [`docs/template-first-creation-experience-spec.md`](docs/template-first-creation-experience-spec.md)。完整产品方向见 [`docs/SPEC.md`](docs/SPEC.md)。

## 环境要求

- Node.js 20.18 或更高版本
- npm 10 或更高版本

## 本地运行

```bash
npm install
npm run dev
```

默认开发地址由 Vite 输出，通常为 `http://127.0.0.1:5173/`。

## 常用命令

```bash
npm run lint     # 静态检查
npm run test     # 单元测试
npm run build    # 生产构建
npm run check    # 依次运行 lint、test 和 build
npm run preview  # 本地预览生产构建
```

## API 模式

复制 `.env.example` 为 `.env` 后可以配置 API 模式：

```env
VITE_AIGC_API_MODE=prototype
VITE_AIGC_API_BASE_URL=/api
```

切换到 `http` 模式前，需要完成 [`docs/backend-first-replacement-checklist.md`](docs/backend-first-replacement-checklist.md) 中的后端接口。本版本的重命名、删除、登录、支付和生成等交互仍以本地状态为准。

## 发布

推送 `master` 会触发 GitHub Actions，执行 `npm run check` 并部署到 GitHub Pages。版本发布前应确认工作区干净、检查通过，并完成桌面端和移动端核心流程验收。

版本变更见 [`CHANGELOG.md`](CHANGELOG.md)。
