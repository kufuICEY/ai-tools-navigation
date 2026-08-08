/**
 * 广告位配置与渲染
 * ==================================================
 * 【一键接入 AdSense】只需要改两处：
 *   1. enabled: true
 *   2. publisherId: "ca-pub-你的真实发布商ID"
 * 保存后重新构建部署即可。本脚本会自动：
 *   - 动态加载 adsbygoogle.js 广告加载器
 *   - 扫描页面中所有 [data-ad-slot] 占位块并替换为真实广告
 *   - 未启用/未配置时显示占位样式，不影响页面美观
 *
 * 广告位位置（已生成在 HTML 里）：
 *   - home_top       首页顶部
 *   - home_mid       首页中部（每 3 个分类后）
 *   - article_top    文章正文开头
 *   - article_mid    文章正文中间
 *   - category_top   分类页顶部
 *
 * 注意：广告单元（ad unit）需要在 AdSense 后台创建后获得 slot ID，
 * 把对应 slot ID 填入下方 slots 配置即可。不填 slot 时使用
 * data-ad-format="auto" 自动广告兜底。
 */
const AD_CONFIG = {
  // 是否启用真实 AdSense。填好下方发布商 ID 后改成 true。
  enabled: false,
  // Google AdSense 发布商 ID，形如 ca-pub-XXXXXXXXXXXXXXXX
  publisherId: "ca-pub-0000000000000000",
  // 广告位 slot 配置（在 AdSense 后台创建广告单元后填写）
  slots: {
    home_top:    { slot: "", type: "auto",       label: "首页顶部横幅" },
    home_mid_1:  { slot: "", type: "responsive", label: "首页信息流广告 1" },
    home_mid_2:  { slot: "", type: "responsive", label: "首页信息流广告 2" },
    home_mid_3:  { slot: "", type: "responsive", label: "首页信息流广告 3" },
    article_top: { slot: "", type: "responsive", label: "文章顶部" },
    article_mid: { slot: "", type: "responsive", label: "文章中间" },
    category_top:{ slot: "", type: "auto",       label: "分类页顶部" }
  }
};

/**
 * 动态加载 AdSense 加载器脚本（仅加载一次）
 * 返回 Promise，脚本加载完成后 resolve。
 */
function loadAdSenseLoader() {
  return new Promise(function (resolve, reject) {
    if (window.adsbygoogle) return resolve();
    const s = document.createElement("script");
    s.async = true;
    s.crossOrigin = "anonymous";
    s.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + encodeURIComponent(AD_CONFIG.publisherId);
    s.onload = resolve;
    s.onerror = function () { reject(new Error("AdSense 脚本加载失败")); };
    document.head.appendChild(s);
  });
}

/**
 * 渲染一个广告位元素。
 * - 未启用：返回占位块
 * - 已启用：返回 <ins class="adsbygoogle"> 并 push 到队列
 */
function renderAd(slotId, className) {
  const el = document.createElement("div");
  el.className = "ad-slot " + (className || "ad-rect");

  const cfg = AD_CONFIG.slots[slotId];
  if (!cfg) return el;

  if (AD_CONFIG.enabled && window.adsbygoogle) {
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
  } else {
    el.innerHTML =
      '<span class="ad-tag">广告位 · 申请 Google AdSense 后在此展示</span>' +
      '<span>' + cfg.label + '</span>' +
      '<span style="font-size:11px;opacity:.6">接入方法见 README 或 ads.js 顶部说明</span>';
  }
  return el;
}

/**
 * 扫描页面中所有 [data-ad-slot] 占位块，替换为真实/占位广告。
 * 在 DOMContentLoaded 后调用。
 */
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

/**
 * 初始化：启用时先加载 AdSense 脚本，再激活所有广告位。
 * 未启用时直接激活占位块。
 */
function initAds() {
  const doActivate = function () {
    activateAdSlots();
  };
  if (!AD_CONFIG.enabled) {
    // 占位模式：直接渲染占位块
    doActivate();
    return;
  }
  loadAdSenseLoader()
    .then(doActivate)
    .catch(function (e) {
      console.warn("[ads]", e.message, "广告位将保持占位。");
      doActivate();
    });
}

/* 暴露到全局 */
if (typeof window !== "undefined") {
  window.AD_CONFIG = AD_CONFIG;
  window.renderAd = renderAd;
  window.injectAd = injectAd;
  window.initAds = initAds;
  // 页面加载完成后自动初始化
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAds);
  } else {
    initAds();
  }
}

if (typeof module !== "undefined") {
  module.exports = { AD_CONFIG, renderAd, initAds };
}
