/* =============================================================
   BLOG-POST.JS — reading progress, table-of-contents highlight
   and figure lightbox for the long-form article pages.
   ============================================================= */

(() => {
  "use strict";

  /* ---------- Reading progress ---------- */
  const article = document.querySelector("[data-post-body]");
  const bar = document.querySelector("[data-post-progress]");
  if (article && bar) {
    let ticking = false;
    const update = () => {
      const rect = article.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const done = total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 1;
      bar.style.setProperty("--progress", done.toFixed(4));
      ticking = false;
    };
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      },
      { passive: true },
    );
    update();
  }

  /* ---------- Table of contents: mark the section in view ---------- */
  const tocLinks = Array.from(document.querySelectorAll("[data-post-toc] a[href^='#']"));
  const sections = tocLinks
    .map((link) => document.getElementById(link.getAttribute("href").slice(1)))
    .filter(Boolean);
  if (sections.length && "IntersectionObserver" in window) {
    const setCurrent = (id) => {
      tocLinks.forEach((link) => {
        const on = link.getAttribute("href") === `#${id}`;
        link.classList.toggle("is-current", on);
        if (on) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    };
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setCurrent(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    sections.forEach((section) => io.observe(section));
  }

  /* ---------- Figure lightbox ---------- */
  const dialog = document.querySelector("[data-post-lightbox]");
  if (dialog && typeof dialog.showModal === "function") {
    const img = dialog.querySelector("img");
    const caption = dialog.querySelector("[data-lightbox-caption]");
    const closeBtn = dialog.querySelector("[data-lightbox-close]");
    let opener = null;

    document.querySelectorAll("[data-zoom]").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        opener = link;
        const source = link.querySelector("img");
        img.src = link.getAttribute("href");
        img.alt = source ? source.alt : "";
        const fig = link.closest("figure");
        const cap = fig && fig.querySelector("figcaption");
        caption.textContent = cap ? cap.textContent.trim() : img.alt;
        dialog.showModal();
      });
    });

    const close = () => dialog.close();
    if (closeBtn) closeBtn.addEventListener("click", close);
    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) close();
    });
    dialog.addEventListener("close", () => {
      img.removeAttribute("src");
      if (opener) opener.focus();
    });
  }
})();
