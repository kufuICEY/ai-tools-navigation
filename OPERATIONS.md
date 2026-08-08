# 运营备忘 · AI 工具导航站

> 更新日期：2026-08-09
> 本文档记录站点的关键信息与日常运营步骤，部署、接广告、做 SEO 时对照操作即可。

## 一、站点关键信息

| 项目 | 地址 |
|---|---|
| 线上站点 | **https://ai-tools-navigation-ten.vercel.app** |
| GitHub 仓库 | https://github.com/kufuICEY/ai-tools-navigation |
| 站点地图 | https://ai-tools-navigation-ten.vercel.app/sitemap.xml |
| Vercel 后台 | https://vercel.com/dashboard （项目名：ai-tools-navigation） |

## 二、变现第一步：申请 Google AdSense

1. 打开 https://adsense.google.com 用 Google 账号登录
2. 输入你的站点地址：`https://ai-tools-navigation-ten.vercel.app`
3. 按提示提交网站信息，等待审核（通常 2-4 周，也可能几天）
4. **审核期间保持站点活跃**：可以每天新增 2-3 篇文章（改 `content/keywords.js` 后重新构建部署），有利于通过审核

## 三、审核通过后：一键启用广告

只改 **一个文件** 的 **两个地方**，然后重新部署即可：

文件：`public/js/ads.js`

```js
const AD_CONFIG = {
  enabled: true,                              // ← 1. 改成 true
  publisherId: "ca-pub-你的真实发布商ID",      // ← 2. 替换成你的发布商 ID
  ...
};
```

改完后：

```
npm run build          # 本地重新构建
git add -A && git commit -m "启用 AdSense"
git push origin main   # 推送到 GitHub，Vercel 自动重新部署
```

> 广告位说明：首页顶部 1 个 + 信息流 3 个、分类页顶部 1 个、文章页顶部/中间各 1 个。在 AdSense 后台创建"广告单元"后，可以把对应 slot ID 填到 `AD_CONFIG.slots` 里（不填则用自动广告兜底，同样能展示）。

## 四、SEO 收录：提交 Google Search Console

1. 打开 https://search.google.com/search-console
2. 添加资源 → 选"网址前缀" → 输入 `https://ai-tools-navigation-ten.vercel.app`
3. 按提示验证所有权（Vercel 域名可用"HTML 标记"或直接粘贴验证代码）
4. 左侧菜单"站点地图" → 提交 `https://ai-tools-navigation-ten.vercel.app/sitemap.xml`
5. 之后定期查看"效果"看关键词排名，用"网址检查"工具手动请求收录新页面

## 五、日常更新节奏（保持站点活跃，利于 SEO 与广告审核）

- **每天**：发布 2-3 篇新文章（在 `content/keywords.js` 里加 topic，`npm run build` 后 push）
- **每周**：检查 Search Console 看哪些关键词有曝光，优化对应文章标题
- **每月**：更新 `content/tools.js` 里的工具（新增热门工具、移除失效链接）
- **重要**：改完代码后执行 `npm run build` 验证无报错，再 push

## 六、常见操作速查

| 想做什么 | 怎么做 |
|---|---|
| 改站点名称/描述 | `scripts/generate.js` 顶部 `SITE` 配置 |
| 加一个工具 | `content/tools.js` 对应分类下加一行 |
| 加一篇新文章 | `content/keywords.js` 加一个 topic（slug 唯一） |
| 换配色 | `public/css/style.css` 的 `:root` CSS 变量 |
| 本地预览 | `npm run build && npm run serve` |
| 重新部署 | push 到 GitHub 即自动触发 Vercel 部署 |
| 查看部署日志 | Vercel 后台 → 项目 → Deployments |

## 七、安全提醒

- Vercel / GitHub 的 token 属于账号凭据，用完即删（在各自后台的 token 页面 Revoke）
- 不要在任何地方提交 `.env`、token、密码等敏感信息（`.gitignore` 已屏蔽）
- 广告不要堆太多：首页 2-3 个、文章页 2 个以内，避免影响体验被 Google 降权
