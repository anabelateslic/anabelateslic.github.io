(() => {
  const trigger = document.querySelector("[data-menu-trigger]");
  const menu = document.querySelector("#mobile-menu");

  if (trigger && menu) {
    const setOpen = (open) => {
      trigger.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("is-menu-open", open);
    };

    trigger.addEventListener("click", () => {
      const open = trigger.getAttribute("aria-expanded") !== "true";
      setOpen(open);
    });

    menu.addEventListener("click", (e) => {
      if (e.target.matches("a")) setOpen(false);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && trigger.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        trigger.focus();
      }
    });
  }

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const targets = document.querySelectorAll("[data-reveal]");

  if (reduced || !("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.1, rootMargin: "0px 0px -10% 0px" },
  );

  targets.forEach((el) => observer.observe(el));
})();
