# EduSpark 智教星 - 国内直接可用部署指南

由于 Google Cloud Run 默认的 `*.run.app` 官方域名受到国内网络长城（GFW）阻断，国内普通网络无法直接解析打开。

本项目已经完成全栈打包（前端 React SPA + 后端 Express 代理），**只需以下几种极简方案之一，即可让国内用户/老师直接免翻墙打开访问**：

---

## 方案一：免费托管平台（推荐国内访问友好的平台）

### 1. Zeabur（对国内网络极佳，支持一键部署）
1. 注册登录 [Zeabur](https://zeabur.com/)（支持 GitHub 或邮箱登录）。
2. 点击 **Create Project** -> **Deploy from GitHub Repository**，选择本项目。
3. 在项目的 **Variables (环境变量)** 中添加：
   - `GEMINI_API_KEY`: 您的 Gemini API Key
4. 在 **Networking (网络)** 中绑定 Zeabur 提供的免费域名或您自己的自定义域名。
5. 国内网络即可直接秒开访问！

### 2. Vercel / Netlify（绑定自己的自定义域名）
1. 导入本项目到 Vercel。
2. 配置环境变量 `GEMINI_API_KEY`。
3. **重要**：在 Project Settings -> Domains 绑定一个您自己的域名（例如 `ai.yourdomain.com`），因为 `*.vercel.app` 默认域名在国内受限，绑定自己的域名后国内即可顺畅直连！

---

## 方案二：国内云服务器 / 宝塔面板 / 香港免备案 VPS (Docker 1分钟部署)

如果您有腾讯云、阿里云、华为云或香港/海外 VPS：

### 方式 A：Docker 快速启动
```bash
# 1. 克隆代码或上传项目
git clone <您的仓库地址>
cd eduspark

# 2. 设置您的 GEMINI_API_KEY 并启动
GEMINI_API_KEY="你的API_KEY" docker compose up -d --build
```
启动后，访问 `http://服务器公网IP:3000` 即可！

### 方式 B：宝塔面板一键部署
1. 进入宝塔面板 -> **网站** -> **Node 项目**。
2. 上传本项目文件，Node 版本选择 18 或 20。
3. 运行目录选择根目录，启动脚本选择 `npm run start`，端口设置为 `3000`。
4. 在项目根目录的 `.env` 文件中填入 `GEMINI_API_KEY=你的KEY`。
5. 开启反向代理或绑定域名与 SSL 证书，国内即刻全网畅通访问！

---

## 方案三：为现有的 Cloud Run 绑定国内直连的自定义域名 / CDN（如 Cloudflare）
如果您继续使用 Google Cloud Run 服务：
1. 登录 Cloudflare，将您自己的域名 DNS 解析接入 Cloudflare（免费）。
2. 在 Cloudflare 中配置 **Worker** 或 **Origin Rules / CNAME** 将请求反向代理转发至 `ais-pre-jf67bb2gfoqdlwjkmm27nn-245475483132.asia-northeast1.run.app`。
3. 国内访问您自己的域名，Cloudflare 会自动在全球边缘节点中转加速，国内直连无需额外软件。
