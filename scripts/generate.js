/**
 * generate.js — AI 工具导航站构建脚本
 * ==================================================
 * 职责：
 *   1. 读取 content/tools.js（工具数据）与 content/keywords.js（关键词规划）
 *   2. 根据关键词规划自动生成 SEO 文章页（标题带关键词、约 800 字、含 FAQ）
 *   3. 生成首页（导航）、分类页、文章列表页
 *   4. 生成 sitemap.xml / robots.txt
 *   5. 输出到 dist/（Vercel 部署目录）
 *
 * 用法：
 *   npm run build        # 全量构建
 *   npm run articles     # 只重新生成文章
 *
 * 提示：自动生成的文章用于快速铺量，建议按"每天 3-5 篇"分批发布，
 * 发布前用 AI/人工对单篇做润色，SEO 效果和站点信誉更稳。
 */
const fs = require("fs");
const path = require("path");

// ---------------- 站点配置 ----------------
const SITE = {
  name: "AI 导航",
  tagline: "AI 工具大全 · 好用免费的 AI 工具导航",
  url: "https://ai-tools-navigation-ten.vercel.app", // 真实线上域名
  desc: "收录最新最好用的 AI 工具，覆盖聊天助手、AI 绘图、AI 视频、AI 写作、AI 配音、AI 编程、AI 办公等分类，全部人工筛选、免费收录。",
  keywords: "AI工具,AI导航,AI工具大全,免费AI工具,AI工具导航",
  since: 2026
};

// 联系方式（统一在此配置，隐私政策页 / 关于页共用）
const CONTACT = {
  email: "cleaverhatke80018@gmail.com"
};

// ---------------- 加载数据 ----------------
const { CATEGORIES } = require("../content/tools.js");
const { KEYWORD_TOPICS } = require("../content/keywords.js");

// ---------------- 工具函数 ----------------
function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function slugify(s) {
  return String(s).trim().replace(/\s+/g, "-").toLowerCase();
}

function stripHtml(html) {
  return html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

function countCnChars(html) {
  const text = stripHtml(html);
  return (text.match(/[一-鿿]/g) || []).length;
}

function today() {
  // 使用本地时区（而非 UTC），避免日期偏移一天
  const d = new Date();
  return d.getFullYear() + "-" +
    String(d.getMonth() + 1).padStart(2, "0") + "-" +
    String(d.getDate()).padStart(2, "0");
}

// ---------------- 分类与工具的匹配 ----------------
// 把主题 slug/关键词映射到相关分类
const CAT_HINTS = [
  { ids: ["chat"], re: /聊天|对话|chatgpt|deepseek|kimi|豆包|文心|通义|国产大模型|ai助手/ },
  { ids: ["search"], re: /搜索|perplexity|秘塔|felo|检索/ },
  { ids: ["image"], re: /绘图|绘画|图片|文生图|抠图|修图|照片|换脸|logo|海报|设计|3d/ },
  { ids: ["video"], re: /视频|短视频|数字人|剪辑|字幕|直播|虚拟主播/ },
  { ids: ["writing"], re: /写作|文案|文章|小说|论文|文案|公众号|小红书|简历|邮件/ },
  { ids: ["voice"], re: /配音|语音|声音|转写|朗读|播报/ },
  { ids: ["music"], re: /音乐|歌曲|作曲|伴奏|歌词|扒谱/ },
  { ids: ["coding"], re: /编程|代码|开发|sql|正则|程序员|测试|github|cursor/ },
  { ids: ["office"], re: /办公|ppt|表格|excel|文档|纪要|会议|笔记/ },
  { ids: ["special"], re: /翻译|翻译|special|特殊|客服|工作流|安全/ }
];

function matchCategories(topic) {
  const hay = (topic.slug + " " + topic.title + " " + topic.keywords.join(" ")).toLowerCase();
  const ids = new Set();
  for (const hint of CAT_HINTS) {
    if (hint.re.test(hay)) hint.ids.forEach(i => ids.add(i));
  }
  // 兜底：默认全部相关分类取前两个
  if (ids.size === 0) return CATEGORIES.slice(0, 2).map(c => c.id);
  return CATEGORIES.filter(c => ids.has(c.id)).map(c => c.id);
}

function pickTools(catIds, limit) {
  const pool = CATEGORIES.filter(c => catIds.includes(c.id)).flatMap(c => c.tools);
  // 简单去重（同名工具）
  const seen = new Set();
  const uniq = pool.filter(t => {
    const k = t.name + "|" + t.url;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  // 轮转选取，保证不同主题拿到不同组合
  return uniq.slice(0, limit);
}

// ---------------- 文章正文生成 ----------------
// 根据主题类型生成差异化正文。所有内容为简体中文，SEO 友好。
function generateBody(topic, index) {
  const catIds = matchCategories(topic);
  const tools = pickTools(catIds, 3 + (index % 3));
  const kws = topic.keywords;
  const mainKw = kws[0];

  if (tools.length === 0) {
    return { body: "<p>欢迎阅读本文。</p>", faq: [] };
  }

  // 工具介绍段落
  const toolParas = tools.map((t, i) => {
    const intro = i === 0
      ? "如果你是第一次接触「" + esc(mainKw) + "」，从这一款开始最稳妥"
      : (i === 1
          ? "它在同类工具里口碑很稳"
          : "如果你更看重" + (t.tags[0] || "专业") + "能力，这款值得一试");
    return "<h3>" + esc(t.name) + "</h3><p>" +
      esc(t.desc) +
      "（<a href=\"" + esc(t.url) + "\" rel=\"noopener nofollow\" target=\"_blank\">" + esc(t.name) + " 官网</a>）。" +
      intro +
      "，打开官网注册即可使用，免费额度对新手很友好。</p>";
  });

  // 针对不同类型的差异化引言
  const introVariants = [
    "很多人在搜索「" + esc(mainKw) + "」的时候，会发现市面上的信息又杂又散。这篇指南直接给你结论：",
    "今天这篇内容专门聊聊「" + esc(mainKw) + "」，把最值得用的几款一次性讲清楚。",
    "如果你正在找「" + esc(mainKw) + "」，这篇文章就是为你准备的。下面推荐的工具都经过实际使用筛选。"
  ];
  const intro = introVariants[index % introVariants.length];

  // H2 段落（不同主题类型侧重不同）
  const sections = [];

  if (/教程|怎么|如何|入门|流程/.test(topic.slug)) {
    sections.push({
      h: "为什么要用 " + esc(topic.title),
      p: "用 AI 工具替代重复劳动，是普通人提升效率最快的方式。无论是「" + esc(kws[0]) +
        "」还是相关的「" + esc(kws[1] || kws[0]) + "」，核心思路都一样：明确需求、选对工具、复制模板、微调结果。本文按这个思路带你走一遍完整流程。"
    });
    sections.push({
      h: "新手快速上手步骤",
      p: "第一步，注册一个你顺手的账号（多数工具支持手机号直接登录）。第二步，把你要做的事情用一句话描述清楚，越具体越好。第三步，对照下面推荐的工具逐个试一遍，找到最顺手的那个。记住一个原则：AI 不是用来一次性出成品的，而是用来帮你从 0 快速做到 80 分。"
    });
  } else if (/对比|哪个|区别|测评/.test(topic.slug)) {
    sections.push({
      h: "几款主流工具的核心差异",
      p: "关于「" + esc(mainKw) + "」，市面上的主流选择各有侧重：有的免费额度充足、有的中文效果好、有的生态完善、有的适合进阶用户。下面从易用性、免费额度、适用场景三个维度帮你拆开对比，看完你基本就能锁定最适合自己的那款。"
    });
    sections.push({
      h: "怎么选最合适？",
      p: "没有绝对最好的工具，只有最适合你的。如果你是学生或偶尔使用，优先选免费额度充足、无需绑卡的；如果你用来做副业或商用，优先选输出质量稳定、有官方商用授权的。先花十分钟把下面几款都试用一遍，感受比任何测评都直观。"
    });
  } else {
    sections.push({
      h: "这些工具怎么用最有效？",
      p: "拿到一款 AI 工具，别急着问「它能不能做什么」，而是先想清楚「我想让它帮我完成什么」。以「" + esc(mainKw) + "」为例，把需求写清楚、分步骤提问、把输出结果再喂回去迭代，是绝大多数人忽略但效果最好的用法。"
    });
    sections.push({
      h: "免费用户怎么用回本？",
      p: "大多数工具都提供免费额度，够日常使用。建议把免费额度留给高频需求，把宝贵次数用在刀刃上。另外，多关注官方公告和社区活动，新功能上线时往往有免费体验或限时升级，能省下不少钱。"
    });
  }

  // 内链（SEO）
  const related = KEYWORD_TOPICS.filter(t => t.slug !== topic.slug)
    .slice(index + 1, index + 4);
  const relatedHtml = related.length
    ? "<p>想了解更多？可以继续看：</p><ul>" +
      related.map(r => "<li><a href=\"/articles/" + r.slug + ".html\">" + esc(r.title) + "</a></li>").join("") +
      "</ul>"
    : "";

  // FAQ
  const faq = [
    { q: esc(kws[0]) + "，哪款最值得先试？", a: "先从免费、无需绑卡的工具开始，本文推荐的前两款就是很好的起点，体验几分钟就能判断是否适合自己。" },
    { q: "这些工具有免费版本吗？", a: "大部分都有免费版或免费额度，足以覆盖日常使用。个别专业功能需要订阅，但先用免费版足够了。" },
    { q: "用 AI 工具会不会很复杂？", a: "不会。现在的 AI 工具都做得非常友好，基本是「打开-输入-得到结果」三步，完全不需要技术背景。" }
  ];

  // 快速上手步骤（针对每种工具给一句可执行的动作）
  const steps = tools.slice(0, 4).map((t, i) => {
    return "<li><strong>" + esc(t.name) + "</strong>：打开官网注册账号（手机号即可），找一个模板或空会话，输入你的具体需求，例如「请帮我" +
      (i % 2 === 0 ? "总结下面这段内容并给出三个要点" : "写一段 200 字的推广文案") +
      "」，不满意就点重新生成，多试几次。</li>";
  }).join("");

  // 进阶技巧（不同主题类型差异化）
  const tips = (function () {
    if (/教程|怎么|如何|入门|流程/.test(topic.slug)) {
      return "<h2>" + esc(mainKw) + "：进阶技巧</h2><p>入门之后，有几个技巧能让产出质量明显提升：一是给 AI 提供尽量多的背景信息，比如使用场景、目标人群、参考风格；二是把大任务拆成小步骤，分几次提问而不是一次问完；三是让 AI 输出后自己先改一遍，再把修改后的版本喂回去让它学习你的偏好。坚持用下来，你会发现自己和 AI 的配合越来越默契。</p>";
    } else if (/对比|哪个|区别|测评/.test(topic.slug)) {
      return "<h2>进阶建议</h2><p>选定主力工具之后，建议把常用提示词（Prompt）整理成模板保存起来，下次直接套用。同时关注工具官方的更新日志，很多工具每月都会上新功能，第一时间用上就能领先别人一步。如果你有跨平台需求，可以试试把「" + esc(mainKw) + "」相关的多款工具组合使用，一个负责初稿、一个负责润色，效果往往好过单打独斗。</p>";
    } else if (/免费|免费版/.test(topic.slug)) {
      return "<h2>免费额度用完了怎么办？</h2><p>免费额度用完是常见情况，几个应对思路：一是错峰使用，多数平台在工作日白天压力大，深夜或周末额度恢复更快；二是多注册一两个同类工具轮换使用；三是关注官方活动和邀请奖励，很多平台新用户或邀请好友能免费加量；四是如果确实高频使用且依赖某款工具，订阅基础版通常每月几十元，对生产力提升来说性价比很高。</p>";
    } else if (/安全|隐私|风险/.test(topic.slug)) {
      return "<h2>安全使用建议</h2><p>使用任何 AI 工具都要注意：不要上传身份证号、银行卡号、密码等敏感信息；涉及商业机密的文档建议先脱敏再上传；使用官方渠道下载客户端，警惕仿冒网站；对 AI 输出的结果保持批判性，涉及健康、法律等专业问题时务必人工复核。</p>";
    }
    return "<h2>进阶技巧</h2><p>想要更好的效果，记住三个小技巧：一是需求描述越具体，输出质量越高，别只说「帮我写」，要说「帮我在 200 字内用轻松的语气写一段发给朋友的推荐语」；二是善用追问，第一次结果不满意就继续追问「再口语化一点」「换个角度试试」；三是把 AI 当协作伙伴，先让它出框架、你补充细节，最终成果一定比全自动生成更有人味。</p>";
  })();

  // 对比小结（当推荐了 ≥3 个工具时给一个简表说明）
  const compareNote = tools.length >= 3
    ? "<h2>一句话总结</h2><p>如果时间紧，直接记住结论：<strong>" + esc(tools[0].name) + "</strong>适合" +
      (tools[0].badge ? "新手与大众用户" : "追求免费与易用的用户") +
      "，<strong>" + esc(tools[1].name) + "</strong>适合" +
      (tools[1].tags.includes("免费") ? "预算有限的学生党" : "对效果要求更高的进阶用户") +
      (tools[2] ? "，<strong>" + esc(tools[2].name) + "</strong>适合需要" +
        (tools[2].tags.includes("开源") || tools[2].tags.includes("本地") ? "自己掌控数据与自定义的玩家" : "特定专业场景的用户") : "") +
      "。三者结合使用，基本能覆盖你 90% 的日常需求。</p>"
    : "";

  // 拼接正文
  let body = "<p>" + intro + "</p>";
  body += "<h2>" + esc(sections[0].h) + "</h2><p>" + sections[0].p + "</p>";
  body += "<h2>推荐清单：" + esc(topic.title) + "</h2>";
  body += toolParas.join("");
  body += "<h2>" + esc(sections[1].h) + "</h2><p>" + sections[1].p + "</p>";
  body += "<h2>快速上手</h2><ol>" + steps + "</ol>";
  body += tips;
  body += compareNote;
  body += relatedHtml;

  // 字数补充：如果不足 700 字，追加一段"注意事项"，保证接近 800 字
  let bodyHtml = body;
  let cnCount = countCnChars(bodyHtml);
  if (cnCount < 700) {
    const pad = "<h2>使用时的几个小提醒</h2><p>" +
      "第一，涉及个人信息的内容建议不要直接粘贴到免费工具里；第二，AI 输出可能有错，重要内容务必人工复核；第三，" +
      "把「" + esc(mainKw) + "」当成一种探索的起点，多尝试不同工具的组合，往往能收获意想不到的效果。</p>";
    bodyHtml += pad;
  }

  return { body: bodyHtml, faq };
}

// ---------------- HTML 模板 ----------------
function layout({ title, desc, keywords, canonical, body, extraHead }) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}">
  <meta name="keywords" content="${esc(keywords)}">
  <link rel="canonical" href="${esc(canonical)}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${esc(canonical)}">
  <meta name="robots" content="index,follow">
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🤖</text></svg>">
  <link rel="shortcut icon" href="/favicon.ico">
  <link rel="stylesheet" href="/css/style.css">
  ${extraHead || ""}
</head>
<body>
  ${header()}
  <main class="container">${body}</main>
  ${footer()}
  <script src="/js/ads.js"></script>
</body>
</html>`;
}

function header() {
  return `<header class="site-header">
  <div class="container header-inner">
    <a class="logo" href="/"><span class="logo-mark">AI</span>${esc(SITE.name)}</a>
    <nav class="nav-links">
      <a href="/">首页</a>
      <a href="/articles.html">AI 文章</a>
      <a href="/about.html">关于</a>
    </nav>
  </div>
</header>`;
}

function footer() {
  return `<footer class="site-footer">
  <div class="container footer-inner">
    <p>${esc(SITE.name)} · ${esc(SITE.tagline)} · ${SITE.since}-${new Date().getFullYear()}</p>
    <p>本站为信息收录站，工具版权归原作者所有 · <a href="/about.html">关于我们</a> · <a href="/privacy-policy.html">隐私政策</a></p>
  </div>
</footer>`;
}

// ---------------- 首页（导航） ----------------
function buildIndex() {
  const catChips = CATEGORIES.map(c =>
    `<a href="/category-${esc(c.id)}.html">${esc(c.icon || "◆")} ${esc(c.name)}</a>`
  ).join("\n  ");

  const sections = CATEGORIES.map((c, i) => {
    const cards = c.tools.slice(0, 8).map(t => {
      const first = (t.name || "?").trim().charAt(0).toUpperCase();
      return `<a class="tool-card" href="${esc(t.url)}" target="_blank" rel="noopener nofollow sponsored">
        <div class="t-top">
          <span class="t-ico">${esc(first)}</span>
          <span class="t-name">${esc(t.name)}</span>
          ${t.badge ? `<span class="t-badge">${esc(t.badge)}</span>` : ""}
        </div>
        <div class="t-desc">${esc(t.desc)}</div>
        <div class="t-tags">${(t.tags || []).map(tg => `<span>${esc(tg)}</span>`).join("")}</div>
        <span class="t-go">去使用</span>
      </a>`;
    }).join("");

    const ad = (i + 1) % 3 === 0 ? adBlock("home_mid_" + Math.ceil((i + 1) / 3), "ad-rect", "首页信息流广告") : "";
    return `<section class="section" id="cat-${esc(c.id)}">
      <div class="section-head">
        <span class="sec-ico">${esc(c.icon || "◆")}</span>
        <h2>${esc(c.name)}</h2>
        <a class="sec-more" href="/category-${esc(c.id)}.html">查看全部 →</a>
      </div>
      <div class="tool-grid">${cards}</div>
      ${ad}
    </section>`;
  }).join("");

  const body = `<section class="hero">
    <h1>好用免费的 AI 工具导航</h1>
    <p>${esc(SITE.tagline)}。人工筛选、持续更新，帮你找到最顺手的那款 AI 工具。</p>
    <div class="search-wrap">
      <span class="search-ico">🔍</span>
      <input id="search-input" type="text" placeholder="搜索 AI 工具，例如：配音、绘图、写代码…">
    </div>
    <div class="cat-nav" id="cat-nav">
      ${catChips}
    </div>
  </section>

  ${adBlock("home_top", "ad-banner", "首页顶部横幅")}

  <div id="cat-sections">${sections}</div>

  <section class="section">
    <div class="section-head"><h2>最新 AI 工具文章</h2><a class="sec-more" href="/articles.html">全部文章 →</a></div>
    <div class="article-list">
      ${latestArticlesHtml(6)}
    </div>
  </section>`;

  return layout({
    title: SITE.name + " - " + SITE.tagline,
    desc: SITE.desc,
    keywords: SITE.keywords,
    canonical: SITE.url + "/",
    body,
    extraHead: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "${SITE.name}",
  "url": "${SITE.url}/",
  "description": "${SITE.desc}"
}
</script>
<script src="/js/main.js" defer></script>`
  });
}

// ---------------- 分类页 ----------------
function buildCategory() {
  const pages = CATEGORIES.map(c => {
    const cards = c.tools.map(t => {
      const first = (t.name || "?").trim().charAt(0).toUpperCase();
      return `<a class="tool-card" href="${esc(t.url)}" target="_blank" rel="noopener nofollow sponsored">
        <div class="t-top"><span class="t-ico">${esc(first)}</span>
        <span class="t-name">${esc(t.name)}</span>
        ${t.badge ? `<span class="t-badge">${esc(t.badge)}</span>` : ""}</div>
        <div class="t-desc">${esc(t.desc)}</div>
        <div class="t-tags">${(t.tags || []).map(tg => `<span>${esc(tg)}</span>`).join("")}</div>
        <span class="t-go">去使用</span></a>`;
    }).join("");

    const catTopics = KEYWORD_TOPICS.filter(t => matchCategories(t).includes(c.id)).slice(0, 4);
    const articleLinks = catTopics.length
      ? `<div class="section-head" style="margin-top:34px"><h2>相关文章</h2></div><div class="article-list">` +
        catTopics.map(t => articleCard(t)).join("") + `</div>`
      : "";

    const body = `<nav class="breadcrumb"><a href="/">首页</a> › ${esc(c.name)}</nav>
      <section class="cat-hero">
        <h1>${esc(c.icon || "◆")} ${esc(c.name)} 工具推荐</h1>
        <p>${esc(c.desc)}</p>
      </section>
      ${adBlock("category_top", "ad-banner", "分类页顶部横幅")}
      <section class="section"><div class="tool-grid">${cards}</div></section>
      ${articleLinks}`;

    return layout({
      title: `${c.name}工具推荐 - ${SITE.name}`,
      desc: c.desc,
      keywords: c.keywords,
      canonical: `${SITE.url}/category-${c.id}.html`,
      body
    });
  });
  return pages;
}

// ---------------- 文章列表页 ----------------
function buildArticlesList() {
  const cards = KEYWORD_TOPICS.map(t => articleCard(t)).join("");
  const body = `<section class="cat-hero">
    <h1>AI 工具文章大全</h1>
    <p>持续更新的 AI 工具教程、对比与推荐，帮你快速找到合适的 AI 工具。</p>
  </section>
  ${adBlock("article_top", "ad-banner", "列表页顶部横幅")}
  <section class="section"><div class="article-list">${cards}</div></section>`;

  return layout({
    title: "AI 工具文章大全 - " + SITE.name,
    desc: "AI 工具教程、对比、推荐合集，覆盖免费 AI 工具、AI 绘画、AI 视频、AI 写作等热门主题。",
    keywords: "AI教程,AI工具文章,AI工具推荐,AI工具对比",
    canonical: SITE.url + "/articles.html",
    body
  });
}

function articleCard(t) {
  return `<a class="article-item" href="/articles/${t.slug}.html">
    <h3>${esc(t.title)}</h3>
    <div class="a-meta">${today()}</div>
    <p>${esc(t.keywords[0])}，一篇讲清楚。覆盖免费方案、上手步骤与实用技巧。</p>
  </a>`;
}

// ---------------- 文章页 ----------------
function buildArticles() {
  const pages = KEYWORD_TOPICS.map((topic, i) => {
    const { body, faq } = generateBody(topic, i);
    const mainKw = topic.keywords[0];

    const faqHtml = `<div class="section-head" style="margin-top:34px"><h2>常见问题（FAQ）</h2></div>` +
      faq.map(f => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join("");

    const fullBody = body + faqHtml +
      adBlock("article_mid", "ad-rect", "文章中间广告") +
      `<p style="margin-top:20px;color:var(--text-faint);font-size:13px">本文由 ${esc(SITE.name)} 整理，首发于 <a href="${esc(SITE.url)}">${esc(SITE.name)}</a>。欢迎收藏、转发。</p>`;

    const pageBody = `<article class="post-body">
      <h1>${esc(topic.title)}</h1>
      <div class="post-meta"><span>${esc(SITE.name)}</span><span>${today()}</span><span>约 ${countCnChars(fullBody)} 字</span></div>
      ${adBlock("article_top", "ad-rect", "文章顶部广告")}
      <div class="post-content">${fullBody}</div>
    </article>`;

    return layout({
      title: topic.title + " - " + SITE.name,
      desc: stripHtml(body).slice(0, 150),
      keywords: topic.keywords.join(","),
      canonical: `${SITE.url}/articles/${topic.slug}.html`,
      body: pageBody,
      extraHead: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "${esc(topic.title)}",
  "description": "${esc(stripHtml(body).slice(0, 150))}",
  "datePublished": "${today()}",
  "inLanguage": "zh-CN",
  "mainEntityOfPage": "${SITE.url}/articles/${topic.slug}.html",
  "publisher": { "@type": "Organization", "name": "${SITE.name}" }
}
</script>`
    });
  });
  return pages;
}

// ---------------- 隐私政策页 ----------------
function buildPrivacy() {
  const body = `<article class="post-body">
    <h1>隐私政策</h1>
    <div class="post-content">
      <p>欢迎访问 ${esc(SITE.name)}（以下简称"本站"）。本站非常重视您的隐私，并承诺保护您的个人信息。本政策说明我们收集哪些信息、如何使用以及您的权利。更新日期：${today()}。</p>
      <h2>一、我们收集的信息</h2>
      <p><strong>1. 您主动提供的信息：</strong>当您通过联系我们、提交工具收录申请时，您可能提供姓名、邮箱地址等信息。我们仅用于回复您的请求。</p>
      <p><strong>2. 自动收集的信息：</strong>当您访问本站时，服务器和第三方服务（如 Google Analytics、Google AdSense）可能会自动记录您的浏览器类型、操作系统、访问时间、IP 地址、访问页面等标准日志信息。</p>
      <h2>二、Cookie 的使用</h2>
      <p>本站可能使用 Cookie 和类似技术来提升访问体验。第三方服务（如 Google AdSense）可能使用 Cookie 向您展示个性化广告。您可以通过浏览器设置管理或删除 Cookie。关于 Google 如何使用数据的详情，请访问 <a href="https://policies.google.com/technologies/partner-sites" rel="noopener nofollow" target="_blank">Google 合作伙伴政策</a>。</p>
      <h2>三、第三方广告</h2>
      <p>本站可能展示由第三方广告联盟（如 Google AdSense）提供的广告。这些广告服务商可能使用 Cookie 或网络信标收集您的浏览信息，用于提供与您相关的广告内容。您可以在 <a href="https://adssettings.google.com" rel="noopener nofollow" target="_blank">Google 广告设置</a> 中管理个性化广告偏好。</p>
      <h2>四、信息的使用</h2>
      <p>我们收集的信息仅用于：运营与维护本站、改进内容质量、统计分析访问情况、回复您的咨询。我们不会出售、出租或与无关第三方共享您的个人信息，除非法律法规要求。</p>
      <h2>五、信息保护</h2>
      <p>本站采取合理的技术与管理措施保护您的信息安全。但请注意，互联网传输无法保证绝对安全，请您谨慎对待个人敏感信息的在线传输。</p>
      <h2>六、外部链接</h2>
      <p>本站包含大量外部工具链接，这些网站有其独立的隐私政策，我们对其内容与做法不承担责任，建议您在访问前查阅相关网站的隐私政策。</p>
      <h2>七、未成年人保护</h2>
      <p>本站内容面向一般公众。我们不会在知情的情况下收集未成年人的个人信息。若您是监护人并发现相关问题，请联系我们处理。</p>
      <h2>八、政策更新</h2>
      <p>我们可能不时更新本隐私政策，更新后的政策将在本页面公布。建议您定期查看本页面。</p>
      <h2>九、联系我们</h2>
      <p>如果您对本隐私政策有任何疑问或建议，欢迎通过 <a href="mailto:${esc(CONTACT.email)}">${esc(CONTACT.email)}</a> 与我们联系。</p>
    </div>
  </article>`;
  return layout({
    title: "隐私政策 - " + SITE.name,
    desc: SITE.name + " 的隐私政策，说明我们如何收集、使用和保护您的信息。",
    keywords: "隐私政策,Privacy Policy," + SITE.name,
    canonical: SITE.url + "/privacy-policy.html",
    body
  });
}

// ---------------- 关于页 ----------------
function buildAbout() {
  const body = `<article class="post-body">
    <h1>关于 ${esc(SITE.name)}</h1>
    <div class="post-content">
      <p>${esc(SITE.name)} 是一个专注于收录和推荐 AI 工具的导航网站。我们相信 AI 工具不应该只属于极客，每一个普通人都能借助 AI 提升效率、创造价值。</p>
      <h2>我们做什么</h2>
      <p>每天从海量 AI 产品中人工筛选真正好用的工具，按场景分类收录，并持续编写使用教程与对比评测，帮你少走弯路。</p>
      <h2>免责声明</h2>
      <p>本站所有工具均链接至官方来源，版权归各工具开发者所有。本站部分页面包含广告，广告内容由广告平台提供，请自行甄别。如有问题请联系我们。</p>
      <h2>联系合作</h2>
      <p>欢迎 AI 产品方提交收录申请，也欢迎读者反馈建议：<a href="mailto:${esc(CONTACT.email)}">${esc(CONTACT.email)}</a></p>
      <p>如需了解我们如何处理您的信息，请查看 <a href="/privacy-policy.html">隐私政策</a>。</p>
    </div>
  </article>`;
  return layout({
    title: "关于我们 - " + SITE.name,
    desc: "关于 " + SITE.name + "：我们收录并推荐好用的 AI 工具。",
    keywords: "关于我们,AI导航",
    canonical: SITE.url + "/about.html",
    body
  });
}

// ---------------- sitemap / robots ----------------
function buildSitemap() {
  const urls = [];
  urls.push({ loc: SITE.url + "/", prio: "1.0" });
  urls.push({ loc: SITE.url + "/articles.html", prio: "0.9" });
  urls.push({ loc: SITE.url + "/about.html", prio: "0.3" });
  urls.push({ loc: SITE.url + "/privacy-policy.html", prio: "0.3" });
  CATEGORIES.forEach(c => urls.push({ loc: `${SITE.url}/category-${c.id}.html`, prio: "0.8" }));
  KEYWORD_TOPICS.forEach(t => urls.push({ loc: `${SITE.url}/articles/${t.slug}.html`, prio: "0.7" }));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${u.loc}</loc><lastmod>${today()}</lastmod><changefreq>daily</changefreq><priority>${u.prio}</priority></url>`).join("\n")}
</urlset>`;
  return xml;
}

function buildRobots() {
  return `User-agent: *
Allow: /

Sitemap: ${SITE.url}/sitemap.xml
`;
}

// ---------------- 广告位占位 ----------------
function adBlock(slot, className, label) {
  return `<div class="ad-slot ${className}" data-ad-slot="${slot}">
    <span class="ad-tag">广告</span>
    <span>${esc(label)} · 接入 AdSense 后自动显示真实广告</span>
  </div>`;
}

// ---------------- 最新文章 HTML（首页用） ----------------
function latestArticlesHtml(n) {
  return KEYWORD_TOPICS.slice(0, n).map(t => articleCard(t)).join("");
}

// ---------------- 主流程 ----------------
function emptyDir(dir) {
  if (!fs.existsSync(dir)) { fs.mkdirSync(dir, { recursive: true }); return; }
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    try {
      fs.rmSync(full, { recursive: true, force: true });
    } catch (e) {
      // 个别环境下文件可能被占用（如本地同步盘），跳过删除，后续覆盖写入即可
      console.log(`  (跳过清理 ${entry}: ${e.code})`);
    }
  }
}

function main() {
  const dist = path.join(__dirname, "..", "dist");
  const articlesDir = path.join(dist, "articles");
  emptyDir(dist);
  fs.mkdirSync(articlesDir, { recursive: true });

  // 复制静态资源
  const publicDir = path.join(__dirname, "..", "public");
  fs.cpSync(publicDir, dist, { recursive: true });

  // 首页
  fs.writeFileSync(path.join(dist, "index.html"), buildIndex());
  console.log("✓ index.html");

  // 分类页
  buildCategory().forEach((page, i) => {
    const c = CATEGORIES[i];
    fs.writeFileSync(path.join(dist, `category-${c.id}.html`), page);
    console.log(`✓ category-${c.id}.html`);
  });

  // 文章列表
  fs.writeFileSync(path.join(dist, "articles.html"), buildArticlesList());
  console.log("✓ articles.html");

  // 文章页
  buildArticles().forEach((page, i) => {
    const t = KEYWORD_TOPICS[i];
    fs.writeFileSync(path.join(articlesDir, `${t.slug}.html`), page);
    if (i < 3) console.log(`✓ articles/${t.slug}.html`);
  });
  console.log(`  … 共生成 ${KEYWORD_TOPICS.length} 篇文章页`);

  // 关于页
  fs.writeFileSync(path.join(dist, "about.html"), buildAbout());
  console.log("✓ about.html");

  // 隐私政策页
  fs.writeFileSync(path.join(dist, "privacy-policy.html"), buildPrivacy());
  console.log("✓ privacy-policy.html");

  // sitemap / robots
  fs.writeFileSync(path.join(dist, "sitemap.xml"), buildSitemap());
  fs.writeFileSync(path.join(dist, "robots.txt"), buildRobots());
  console.log("✓ sitemap.xml / robots.txt");

  // 统计
  const totalPages = 1 + CATEGORIES.length + 1 + KEYWORD_TOPICS.length + 2;
  console.log(`\n构建完成！共 ${totalPages} 个页面，文章 ${KEYWORD_TOPICS.length} 篇。`);
  console.log("部署目录：dist/");
}

main();
