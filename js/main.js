/**
 * Main JavaScript — Hamburger menu & sidebar toggle
 */
(function () {
  "use strict";

  const hamburger = document.getElementById("hamburger");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebarOverlay");

  if (!hamburger || !sidebar || !overlay) return;

  function openSidebar() {
    sidebar.classList.add("sidebar--open");
    overlay.classList.add("sidebar-overlay--visible");
    hamburger.classList.add("hamburger--open");
    hamburger.setAttribute("aria-expanded", "true");
  }

  function closeSidebar() {
    sidebar.classList.remove("sidebar--open");
    overlay.classList.remove("sidebar-overlay--visible");
    hamburger.classList.remove("hamburger--open");
    hamburger.setAttribute("aria-expanded", "false");
  }

  hamburger.addEventListener("click", function () {
    const isOpen = sidebar.classList.contains("sidebar--open");
    isOpen ? closeSidebar() : openSidebar();
  });

  overlay.addEventListener("click", closeSidebar);

  // Close sidebar when pressing Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeSidebar();
    }
  });

  // Close sidebar on navigation link click (mobile)
  sidebar.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      if (window.innerWidth <= 768) {
        closeSidebar();
      }
    });
  });
})();
