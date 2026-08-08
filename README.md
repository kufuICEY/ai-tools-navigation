# AI 工具导航网站

深色简洁风格的 AI 工具导航站 + SEO 文章系统。**静态站点、零后端、零依赖**，一键部署到 Vercel，适合通过 Google 搜索流量 + AdSense 广告变现。

## ✨ 功能

- 🎨 深色简洁 UI，响应式，移动端友好
- 🗂️ 10 个分类、80+ 个 AI 工具，人工筛选收录
- 📄 内置文章生成系统，可一键生成 90+ 篇 SEO 文章页（标题带关键词、约 800 字、含 FAQ 与内链）
- 🕵️ SEO 优化：sitemap.xml、robots.txt、结构化数据（JSON-LD Article）、语义化 HTML
- 📢 广告位预留：首页顶部/中部、分类页、文章顶部/中部/底部，接入 AdSense 即自动替换
- 🔍 前端即时搜索过滤（无需后端）

## 🚀 快速开始（本地）

```bash
# 1. 构建站点（生成 dist/ 目录）
npm run build

# 2. 本地预览
npm run serve
# 打开 http://localhost:3000
```

## 🧪 一键部署到 Vercel（免费）

1. **把项目推到 GitHub**

   ```bash
   git init
   git add .
   git commit -m "init: AI 工具导航站"
   # 在 GitHub 新建仓库后：
   git remote add origin https://github.com/你的用户名/你的仓库名.git
   git push -u origin main
   ```

2. **Vercel 导入项目**

   - 打开 https://vercel.com/new
   - 用 GitHub 登录 → **Import** 你的仓库
   - Vercel 会自动识别 `vercel.json`：
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - 点击 **Deploy**，约 30 秒后即可上线 🎉

3. **绑定你自己的域名**（建议，提升信任度）
   - Vercel 项目 → Settings → Domains → 添加域名（如 `aitools.你的域名.com`）

## 📈 接入 Google AdSense 变现

1. 打开 https://adsense.google.com 注册，填入你的网站域名，提交审核
2. 通过审核后，在 `public/js/ads.js` 中填入你的发布商 ID 和广告位 slot：

   ```js
   const AD_CONFIG = {
     enabled: true,                                  // 改成 true 启用真实广告
     publisherId: "ca-pub-你的真实发布商ID",          // 替换
     slots: {
       home_top:    { slot: "你的slot", type: "auto", ... },
       article_mid: { slot: "你的slot", type: "responsive", ... },
       ...
     }
   };
   ```

3. 重新构建部署：`npm run build`，push 到 GitHub 即自动重新部署
4. **注意**：页面中预留的广告位会自动读取 `AD_CONFIG` 渲染真实广告；未配置时显示占位块，不影响页面美观

## 🖋️ 文章系统

所有文章由 `scripts/generate.js` 根据 `content/keywords.js` 的关键词规划自动生成：

- **选题**：`content/keywords.js` 里整理了 90 组低竞争长尾关键词主题（覆盖"免费工具/场景人群/教程/对比/答疑"五大类），每组 4 个关键词
- **生成**：`npm run build` 时会为每个主题生成一篇 SEO 文章页
- **建议**：自动生成的文章用于快速铺量。Google 更偏好有实质内容、人工润色过的页面。建议按 **每天发布 3-5 篇** 的节奏，发布前对单篇文章做一次人工润色，并**错开日期更新 sitemap 的 lastmod**，长期 SEO 更稳

### 新增一篇文章的步骤

1. 在 `content/keywords.js` 追加一个 topic（slug 唯一）
2. 运行 `npm run build`
3. 生成到 `dist/articles/你的slug.html`，提交并推送即可

## 📁 项目结构

```
├── content/
│   ├── tools.js          # AI 工具数据（10 分类、80+ 工具）
│   └── keywords.js       # 100 个低竞争关键词规划（90 组主题）
├── public/
│   ├── css/style.css     # 深色主题样式
│   └── js/
│       ├── ads.js        # 广告位配置与渲染
│       └── main.js       # 首页交互（渲染/搜索/广告注入）
├── scripts/
│   └── generate.js       # 构建脚本：生成全部页面 + sitemap
├── vercel.json           # Vercel 部署配置
├── package.json
└── .gitignore
```

## 🔧 自定义

| 想改什么 | 改哪里 |
|---|---|
| 站点名称/域名/描述 | `scripts/generate.js` 顶部 `SITE` 配置 |
| 工具列表 | `content/tools.js` |
| 文章主题/关键词 | `content/keywords.js` |
| 配色/样式 | `public/css/style.css` 的 CSS 变量 |
| 广告位位置 | 各 HTML 模板中的 `adBlock()` 调用 |

## ⚠️ 运营提示

- 提交 Google Search Console（https://search.google.com/search-console），提交 sitemap.xml
- 广告位不要塞太多，首页建议 2-3 个，文章页 2 个以内，避免影响阅读体验和 Google 处罚
- 定期更新工具数据（每月一次），保持站点活跃度
- 尊重版权：本站工具均链接官方来源，商用工具请在官方页面确认授权

## 许可证

MIT
