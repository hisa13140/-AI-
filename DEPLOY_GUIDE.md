# EduSpark 智教星 · Cloudflare Pages 部署指南（国内访问友好）

本项目已重构为：**前端 React SPA + 后端 Cloudflare Pages Functions**，
全部托管在 Cloudflare 边缘节点，国内普通网络可直接访问，无需翻墙。

---

## 为什么选 Cloudflare Pages

| 优势 | 说明 |
|---|---|
| **完全免费** | 静态托管 + Functions 都在免费额度内（每天 10 万次请求） |
| **国内访问友好** | Cloudflare 在国内有合作节点（部分省份直连），比 Vercel/GitHub Pages 稳 |
| **免备案** | 用 Cloudflare 自带域名 `*.pages.dev` 不需要 ICP 备案 |
| **支持自定义域名** | 想用自己的域名也可以（同样免备案，CNAME 到 Cloudflare 即可） |
| **HTTPS 自动** | 证书自动签发、自动续期 |

---

## 部署步骤（约 5 分钟）

### 1. 准备 Gemini API Key

如果还没有：
- 打开 https://aistudio.google.com/apikey
- 点 **Create API key** → 复制（形如 `AIzaSy...`）

⚠️ 注意事项：
- Google Gemini API 本身在国内**直接调用较慢甚至不通**
- 但**通过 Cloudflare Workers 转发**后，Cloudflare 的出口 IP 走境外，可以正常调通
- 如果你也担心，备一个 API key 兜底（不同账号有独立额度）

### 2. 把代码推到 GitHub

如果是新仓库（或者你已有 `hisa13140/-AI-`）：
```bash
cd 项目根目录
git init  # 如果还没有
git add .
git commit -m "feat: Cloudflare Pages 适配"
git branch -M main
git remote add origin https://github.com/hisa13140/-AI-.git
git push -u origin main
```

### 3. 在 Cloudflare 创建 Pages 项目

1. 打开 https://dash.cloudflare.com → 登录（没有账号先注册）
2. 左侧菜单 **Workers 和 Pages** → **Pages** → 点 **连接到 Git**
3. 选择你的 GitHub 账号和仓库（`hisa13140/-AI-`）
4. 配置构建设置：

| 字段 | 填什么 |
|---|---|
| **Project name** | `eduspark-zhijiaoxing`（这就是你的子域名） |
| **Production branch** | `main` |
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |
| **Root directory (advanced)** | 留空 |

5. 点 **Save and Deploy** —— 第一次会跑构建，可能需要 2-3 分钟

### 4. 配置环境变量（关键！）

构建完成后（无论成功失败），进入项目页面：

1. 顶部 **Settings** → **Environment variables**
2. 在 **Production** 标签下点 **Add variable**：
   - **Variable name**: `GEMINI_API_KEY`
   - **Value**: 粘贴你刚才复制的 API key
   - **Type**: 选 **Secret**（加密存储，不会在前端暴露）
3. 点 **Save**

### 5. 重新部署（让环境变量生效）

回到 **Deployments** 标签 → 找到最新那次部署 → 右侧三个点 → **Retry deployment**

这次构建完，你的网站就上线了！

### 6. 访问你的网站

- 默认域名：`https://eduspark-zhijiaoxing.pages.dev`
- （或你 Project name 改了什么就是什么）

---

## 绑定自定义域名（可选）

如果你有自己的域名（比如 `ai.yourdomain.com`），且不想用 `*.pages.dev`：

### A. 域名 DNS 托管在 Cloudflare（最简单）
1. 在 Cloudflare 控制台添加你的域名
2. 把域名的 NS 记录改成 Cloudflare 提供的
3. 等 DNS 生效后，在 Pages 项目里 **Custom domains** → **Set up a custom domain** → 输入你想用的子域名
4. 自动签发证书，几分钟搞定

### B. 域名 DNS 在其他地方（阿里云/腾讯云等）
1. 在 Cloudflare Pages 项目里 **Custom domains** 添加子域名
2. Cloudflare 会给你一条 CNAME 记录
3. 到你的 DNS 服务商那里，添加这条 CNAME
4. 等生效（10 分钟 - 24 小时）

---

## 项目结构（关键文件）

```
.
├── index.html              # Vite 入口
├── src/
│   ├── App.tsx             # React 主应用
│   ├── components/         # UI 组件
│   ├── services/aiService.ts  # 前端调用 /api/gemini/* 的封装
│   └── server/
│       ├── geminiCore.ts   # Gemini 调用核心（无 Web 框架依赖）
│       └── geminiApi.ts    # Express 适配层（仅本地 dev 用）
├── functions/              # Cloudflare Pages Functions
│   ├── _types.ts           # PagesFunction 类型定义
│   └── api/
│       └── gemini/
│           ├── generate.ts # /api/gemini/generate
│           └── stream.ts   # /api/gemini/stream（SSE 流式）
├── public/
│   └── _routes.json        # 路由配置：/api/* 走函数，其他走静态
├── wrangler.toml           # Cloudflare 配置文件
├── vite.config.ts          # Vite + Tailwind 配置
└── package.json
```

---

## 本地开发（依然能用）

```bash
# 1. 安装依赖
npm install

# 2. 复制环境变量模板
cp .env.example .env
# 编辑 .env，填入 GEMINI_API_KEY

# 3. 启动 dev server（端口 3000）
npm run dev
```

打开 http://localhost:3000 即可。

---

## 故障排查

| 症状 | 原因 | 解决 |
|---|---|---|
| 部署成功但 AI 报错 "未配置 GEMINI_API_KEY" | 环境变量没生效 | 检查 Settings → Environment variables，重试部署 |
| AI 报 500 错误 | Gemini API 配额用完 / Key 失效 | 重新生成 Key 替换 |
| 国内访问很慢 | Cloudflare 节点未命中 | 绑定自定义域名（CNAME 到 cf 节点更快）|
| 部署失败 "Build failed" | 依赖装不上 | 删 `node_modules` + `package-lock.json` 重试；或在 Build command 加 `npm install --legacy-peer-deps` |
| `nodejs_compat` 相关警告 | 配置没生效 | 确认 `wrangler.toml` 里有 `compatibility_flags = ["nodejs_compat"]` |

---

## 关于国内访问速度的实话

Cloudflare 在国内的实际体验：
- **电信 / 联通** 用户：通常 200-500ms，比 Vercel 快很多
- **移动** 用户：部分地区会绕路，偶尔慢
- **想最快**：绑一个自己的域名（CNAME 模式），Cloudflare 会用更优的路由

如果未来需要更极致速度，可以叠一层**腾讯云/阿里云 CDN** 把静态资源（JS/CSS/图片）缓存到国内，只让 API 请求走 Cloudflare Functions。

---

## 旧 Vercel 部署怎么办？

1. 打开 Vercel 控制台：https://vercel.com/dashboard
2. 选中这个项目 → Settings → 删除项目（Domain 别解绑，自动失效）
3. 这样 `ai-6fuh.vercel.app` 就不再指向你的代码了
4. 以后新用户用 Cloudflare Pages 的域名即可
