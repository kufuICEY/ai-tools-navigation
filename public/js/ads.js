/**
 * 广告位配置与渲染
 * ==================================================
 * 变现接入说明：
 *   1. 申请 Google AdSense（https://adsense.google.com）并通过审核后，
 *      在 adsbygoogle.js 一行填入你的发布商 ID（ca-pub-XXXX）。
 *   2. 在 AD_CONFIG 里为每个广告位设定 slot id 与格式。
 *   3. 填好配置后，页面会自动用真实广告替换占位块；未配置时显示占位样式。
 *
 * 广告位位置（已在页面中预留）：
 *   - home_top      首页顶部（分类导航下方）
 *   - home_mid      首页中部（每 3 个分类后）
 *   - article_top   文章正文开头
 *   - article_mid   文章正文中间（约 500 字处）
 *   - article_bottom 文章底部
 *   - category_top  分类页顶部
 */
const AD_CONFIG = {
  // 是否启用真实 AdSense。填好下方发布商 ID 后改成 true。
  enabled: false,
  // Google AdSense 发布商 ID，形如 ca-pub-XXXXXXXXXXXXXXXX
  publisherId: "ca-pub-0000000000000000",
  slots: {
    home_top:   { slot: "0000000000", type: "auto",      label: "首页顶部横幅" },
    home_mid:   { slot: "0000000001", type: "responsive", label: "首页信息流广告" },
    article_top:{ slot: "0000000002", type: "responsive", label: "文章顶部" },
    article_mid:{ slot: "0000000003", type: "responsive", label: "文章中间" },
    article_bottom:{ slot: "0000000004", type: "responsive", label: "文章底部" },
    category_top:{ slot: "0000000005", type: "auto",      label: "分类页顶部" }
  }
};

/** 渲染一个广告位。未启用真实广告时显示占位块。 */
function renderAd(slotId, className) {
  const el = document.createElement("div");
  el.className = "ad-slot " + (className || "ad-rect");

  const cfg = AD_CONFIG.slots[slotId];
  if (!cfg) return el;

  if (AD_CONFIG.enabled && window.adsbygoogle) {
    el.innerHTML =
      '<span class="ad-tag">广告</span>' +
      '<div class="ad-real">' +
      '<ins class="adsbygoogle" style="display:block" ' +
      'data-ad-client="' + AD_CONFIG.publisherId + '" ' +
      'data-ad-slot="' + cfg.slot + '" ' +
      'data-ad-format="' + (cfg.type === "auto" ? "auto" : "rectangle") + '" ' +
      (cfg.type === "responsive" ? 'data-full-width-responsive="true"' : "") +
      '></ins></div>';
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  } else {
    el.innerHTML =
      '<span class="ad-tag">广告位 · 申请 Google AdSense 后在此展示广告</span>' +
      '<span>' + cfg.label + '</span>' +
      '<span style="font-size:11px;opacity:.6">' + (AD_CONFIG.enabled ? "" : "当前为占位模式，接入方法见 README") + '</span>';
  }
  return el;
}

/** 将广告注入到页面中指定元素之后 */
function injectAd(container, slotId, className) {
  if (!container) return;
  container.appendChild(renderAd(slotId, className));
}

/* 暴露到全局，供 main.js 等页面脚本使用 */
if (typeof window !== "undefined") {
  window.AD_CONFIG = AD_CONFIG;
  window.renderAd = renderAd;
}

if (typeof module !== "undefined") {
  module.exports = { AD_CONFIG, renderAd };
}
