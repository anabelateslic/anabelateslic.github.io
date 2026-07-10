(() => {
  const NEXT_PAGE = "ux-ui-design.html";
  const hero = document.querySelector(".home-hero");
  if (!hero) return;

  const picture = hero.querySelector("picture");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let leaving = false;

  const leave = () => {
    if (leaving || document.body.classList.contains("is-menu-open")) return;
    leaving = true;

    if (reduced || !picture) {
      window.location.href = NEXT_PAGE;
      return;
    }

    let done = false;
    const go = () => {
      if (done) return;
      done = true;
      window.location.href = NEXT_PAGE;
    };

    document.body.classList.add("is-exiting");
    picture.addEventListener("transitionend", go, { once: true });
    setTimeout(go, 900);
  };

  window.addEventListener(
    "wheel",
    (e) => {
      if (e.deltaY > 0) leave();
    },
    { passive: true },
  );

  let touchStartY = null;
  window.addEventListener(
    "touchstart",
    (e) => {
      touchStartY = e.touches[0].clientY;
    },
    { passive: true },
  );
  window.addEventListener(
    "touchmove",
    (e) => {
      if (touchStartY !== null && touchStartY - e.touches[0].clientY > 30) leave();
    },
    { passive: true },
  );

  window.addEventListener("keydown", (e) => {
    if (e.target instanceof Element && e.target.closest("button, a, input, textarea, select")) return;
    const forward = ["ArrowDown", "PageDown", "End"].includes(e.key) || (e.key === " " && !e.shiftKey);
    if (forward) leave();
  });
})();
