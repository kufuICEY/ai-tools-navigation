/**
 * 首页交互脚本：搜索过滤
 * ==================================================
 * 说明：
 *   - 首页的分类区块、工具卡片、广告位已由构建脚本服务端渲染，
 *     本脚本只负责【搜索过滤】等交互功能，避免重复渲染。
 *   - 依赖 ./ads.js（广告位激活由 ads.js 自启动处理）。
 */
(function () {
  "use strict";

  if (typeof window === "undefined") return;

  // ---------------- 搜索过滤 ----------------
  function initSearch() {
    const input = document.getElementById("search-input");
    if (!input) return;

    // 分类区块本身来自服务端渲染，直接过滤即可
    const sections = document.querySelectorAll(".section");

    input.addEventListener("input", function () {
      const q = input.value.trim().toLowerCase();

      sections.forEach(function (sec) {
        // 排除纯广告区块（没有工具卡片）
        const cards = sec.querySelectorAll(".tool-card");
        if (!cards.length) return;

        let visible = 0;
        cards.forEach(function (card) {
          const hay = (card.textContent || "").toLowerCase();
          const show = !q || hay.indexOf(q) !== -1;
          card.style.display = show ? "" : "none";
          if (show) visible++;
        });
        sec.style.display = visible ? "" : "none";
      });

      // 隐藏没有结果的分类区块后，如果全空则提示
      const anyVisible = Array.from(sections).some(function (s) {
        return s.style.display !== "none";
      });
      let emptyTip = document.getElementById("search-empty");
      if (!anyVisible && q) {
        if (!emptyTip) {
          emptyTip = document.createElement("p");
          emptyTip.id = "search-empty";
          emptyTip.style.cssText =
            "text-align:center;color:var(--text-faint);padding:30px 0;font-size:15px";
          document.querySelector(".hero").appendChild(emptyTip);
        }
        emptyTip.textContent = "没有找到匹配「" + q + "」的工具，换个关键词试试";
        emptyTip.style.display = "";
      } else if (emptyTip) {
        emptyTip.style.display = "none";
      }
    });
  }

  // ---------------- 初始化 ----------------
  document.addEventListener("DOMContentLoaded", function () {
    initSearch();
  });
})();
