/**
 * 首页交互脚本：分类渲染、搜索过滤、广告注入
 * ==================================================
 * 依赖：
 *   - ../content/tools.js（CATEGORIES）
 *   - ./ads.js（renderAd）
 */
(function () {
  "use strict";

  if (typeof window === "undefined") return;

  const ROOT = document.documentElement.getAttribute("data-base") || "";

  // ---------------- 渲染工具卡片 ----------------
  function renderCard(tool, cat) {
    const first = (tool.name || "?").trim().charAt(0).toUpperCase();
    const card = document.createElement("a");
    card.className = "tool-card";
    card.href = tool.url;
    card.target = "_blank";
    card.rel = "noopener nofollow sponsored";
    card.innerHTML =
      '<div class="t-top">' +
      '<span class="t-ico">' + esc(first) + '</span>' +
      '<span class="t-name">' + esc(tool.name) + '</span>' +
      (tool.badge ? '<span class="t-badge">' + esc(tool.badge) + "</span>" : "") +
      "</div>" +
      '<div class="t-desc">' + esc(tool.desc) + "</div>" +
      '<div class="t-tags">' + (tool.tags || []).map(function (t) {
        return "<span>" + esc(t) + "</span>";
      }).join("") + "</div>" +
      '<span class="t-go">去使用</span>';
    return card;
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  /** 广告注入（使用 ads.js 的 renderAd；未加载时静默跳过） */
  function injectAd(container, slotId, className) {
    if (!container || typeof window.renderAd !== "function") return;
    container.appendChild(window.renderAd(slotId, className));
  }

  // ---------------- 渲染分类区块 + 分类导航 ----------------
  function renderHome() {
    const cats = window.CATEGORIES || [];
    const nav = document.getElementById("cat-nav");
    const list = document.getElementById("cat-sections");

    if (!list) return;

    // 分类导航
    if (nav) {
      cats.forEach(function (cat) {
        const a = document.createElement("a");
        a.href = "category-" + encodeURIComponent(cat.id) + ".html";
        a.textContent = (cat.icon ? cat.icon + " " : "") + cat.name;
        nav.appendChild(a);
      });
    }

    // 分类区块
    cats.forEach(function (cat, i) {
      const sec = document.createElement("section");
      sec.className = "section";
      sec.id = "cat-" + cat.id;
      const head =
        '<div class="section-head">' +
        '<span class="sec-ico">' + esc(cat.icon || "◆") + "</span>" +
        "<h2>" + esc(cat.name) + "</h2>" +
        '<a href="category-' + encodeURIComponent(cat.id) +
        '.html" style="margin-left:auto;color:var(--accent);font-size:13.5px">查看全部 →</a>' +
        "</div>";
      sec.innerHTML = head + '<div class="tool-grid" data-grid></div>';
      list.appendChild(sec);

      const grid = sec.querySelector("[data-grid]");
      cat.tools.slice(0, 6).forEach(function (tool) {
        grid.appendChild(renderCard(tool, cat));
      });

      // 首页中部广告：每 3 个分类之后插一个
      if ((i + 1) % 3 === 0) {
        injectAd(list, "home_mid", "ad-rect");
      }
    });
  }

  // ---------------- 搜索过滤 ----------------
  function initSearch() {
    const input = document.getElementById("search-input");
    if (!input) return;

    input.addEventListener("input", function () {
      const q = input.value.trim().toLowerCase();
      document.querySelectorAll(".section").forEach(function (sec) {
        let visible = 0;
        sec.querySelectorAll(".tool-card").forEach(function (card) {
          const hay = (card.textContent || "").toLowerCase();
          const show = !q || hay.indexOf(q) !== -1;
          card.style.display = show ? "" : "none";
          if (show) visible++;
        });
        sec.style.display = visible ? "" : "none";
      });
    });
  }

  // ---------------- 初始化 ----------------
  document.addEventListener("DOMContentLoaded", function () {
    renderHome();
    initSearch();
    // 首页顶部广告
    const topAd = document.getElementById("ad-home-top");
    if (topAd) injectAd(topAd, "home_top", "ad-banner");
  });
})();
