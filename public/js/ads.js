/**
 * 通用广告位系统（支持 Adsterra / AdSense / 任意 HTML 广告代码）
 * ==================================================
 * 用法说明：
 *
 * 【接入 Adsterra（推荐，门槛低）】
 *   1. 在 https://adsterra.com 注册发布商账号（只需邮箱验证）
 *   2. 后台创建广告位（选 "Social Bar" / "Native Banner" / "Banner" 等），
 *      复制生成的广告代码（是一段 <script>...</script>）
 *   3. 把广告代码粘到下方 AD_CONFIG.slots 对应位置的 `code` 字段里
 *   4. 保存后重新构建部署即可
 *
 *   示例：
 *     slots: {
 *       home_top: {
 *         type: "adsterra",
 *         code: '<script src="https://a.adorika.net/xxx"></script>'
 *       }
 *     }
 *
 * 【接入 AdSense（备选，门槛高）】
 *   1. 填 enabled:true 和 publisherId:"ca-pub-你的ID"
 *   2. 可选：在 AdSense 后台创建广告单元，把 slot ID 填入 slots 配置
 *   3. 保存后重新构建部署
 *
 * 两种方式可以并存：优先用 Adsterra code，未配置 code 的广告位才走 AdSense。
 */
const AD_CONFIG = {
  // AdSense 发布商 ID（用 AdSense 方案时填，形如 ca-pub-XXXX）
  publisherId: "ca-pub-0000000000000000",

  // 广告位配置。给任意广告位填上 `code` 字段即可展示自定义广告（Adsterra 等）
  slots: {
    home_top: {
      type: "adsterra",
      label: "首页顶部横幅",
      code: `<script async="async" data-cfasync="false" src="https://pl30757937.effectivecpmnetwork.com/7ac11b8c3c412a2eadb8be6b82ac2ce2/invoke.js"></script><div id="container-7ac11b8c3c412a2eadb8be6b82ac2ce2"></div>`
    },
    home_mid_1: {
      type: "responsive",
      label: "首页信息流广告 1",
      code: ""
    },
    home_mid_2: {
      type: "responsive",
      label: "首页信息流广告 2",
      code: ""
    },
    home_mid_3: {
      type: "responsive",
      label: "首页信息流广告 3",
      code: ""
    },
    article_top: {
      type: "responsive",
      label: "文章顶部",
      code: ""
    },
    article_mid: {
      type: "responsive",
      label: "文章中间",
      code: ""
    },
    category_top: {
      type: "auto",
      label: "分类页顶部",
      code: ""
    }
  }
};

/** 动态加载 AdSense 加载器脚本（仅加载一次） */
function loadAdSenseLoader() {
  return new Promise(function (resolve, reject) {
    if (window.adsbygoogle) return resolve();
    const s = document.createElement("script");
    s.async = true;
    s.crossOrigin = "anonymous";
    s.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" +
      encodeURIComponent(AD_CONFIG.publisherId);
    s.onload = resolve;
    s.onerror = function () { reject(new Error("AdSense 脚本加载失败")); };
    document.head.appendChild(s);
  });
}

/**
 * 渲染一个广告位。
 * 优先级：自定义 code（Adsterra 等）> AdSense > 占位块。
 */
function renderAd(slotId, className) {
  const el = document.createElement("div");
  el.className = "ad-slot " + (className || "ad-rect");

  const cfg = AD_CONFIG.slots[slotId];
  if (!cfg) return el;

  // 1) 自定义广告代码（Adsterra 等）
  if (cfg.code && cfg.code.trim()) {
    const code = cfg.code.trim();
    // 支持 script 片段或纯 HTML 片段
    if (code.indexOf("<script") === 0) {
      // 动态执行外部 script 或内联 script
      const wrap = document.createElement("div");
      wrap.innerHTML = code;
      // script 需要手动重建才能执行
      const scripts = wrap.querySelectorAll("script");
      scripts.forEach(function (s) {
        const ns = document.createElement("script");
        if (s.src) { ns.src = s.src; ns.async = true; }
        else { ns.text = s.text; }
        s.parentNode.replaceChild(ns, s);
      });
      el.appendChild(wrap);
    } else {
      el.innerHTML = '<span class="ad-tag">广告</span>' + code;
    }
    return el;
  }

  // 2) AdSense
  if (window.adsbygoogle) {
    const ins = document.createElement("ins");
    ins.className = "adsbygoogle";
    ins.style.display = "block";
    ins.setAttribute("data-ad-client", AD_CONFIG.publisherId);
    if (cfg.slot) ins.setAttribute("data-ad-slot", cfg.slot);
    if (cfg.type === "auto") {
      ins.setAttribute("data-ad-format", "auto");
    } else {
      ins.setAttribute("data-ad-format", "rectangle");
      ins.setAttribute("data-full-width-responsive", "true");
    }
    el.innerHTML = '<span class="ad-tag">广告</span>';
    el.appendChild(ins);
    (window.adsbygoogle = window.adsbygoogle || []).push({});
    return el;
  }

  // 3) 占位块
  el.innerHTML =
    '<span class="ad-tag">广告位 · 待接入</span>' +
    '<span>' + cfg.label + '</span>' +
    '<span style="font-size:11px;opacity:.6">把 Adsterra 广告代码填到 ads.js 对应位置即可</span>';
  return el;
}

/** 激活页面中所有 [data-ad-slot] 占位块 */
function activateAdSlots() {
  const hosts = document.querySelectorAll("[data-ad-slot]");
  hosts.forEach(function (host) {
    const slotId = host.getAttribute("data-ad-slot");
    if (!slotId) return;
    const className = host.className.replace(/ad-slot/, "").trim();
    const fresh = renderAd(slotId, className);
    host.parentNode.replaceChild(fresh, host);
  });
}

/** 将广告注入到指定容器（供动态场景使用） */
function injectAd(container, slotId, className) {
  if (!container) return;
  container.appendChild(renderAd(slotId, className));
}

/** 初始化广告位 */
function initAds() {
  // 若有自定义广告代码或 AdSense 已启用，尝试加载 AdSense 加载器（对自定义代码非必需，静默处理）
  activateAdSlots();
}

/* 暴露到全局 */
if (typeof window !== "undefined") {
  window.AD_CONFIG = AD_CONFIG;
  window.renderAd = renderAd;
  window.injectAd = injectAd;
  window.initAds = initAds;
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAds);
  } else {
    initAds();
  }
}

if (typeof module !== "undefined") {
  module.exports = { AD_CONFIG, renderAd, initAds };
}
