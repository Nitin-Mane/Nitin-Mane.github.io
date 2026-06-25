/* =============================================================
   MAIN.JS — navigation, reveal animations, HUD widgets,
   typing rotator, counters, filters, contact helpers
   ============================================================= */

(() => {
  "use strict";

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---------- Nav: scroll state ---------- */
  const nav = document.querySelector(".nav");
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Nav: mobile toggle ---------- */
  const navToggle = document.querySelector(".nav__toggle");
  const navLinks = document.querySelector(".nav__links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------- Nav: active link by current path ---------- */
  const normalizeRoute = (value) => {
    const path = (value || "").split("#")[0].split("?")[0].replace(/\/+$/g, "");
    const lastSegment = path.split("/").filter(Boolean).pop() || "index";
    return lastSegment.replace(/\.html$/i, "").toLowerCase() || "index";
  };
  const currentPath = normalizeRoute(location.pathname);
  document.querySelectorAll(".nav__link").forEach((link) => {
    const href = normalizeRoute(link.getAttribute("href"));
    if (href === currentPath) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    }
  });

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach((el, i) => {
      if (!el.style.getPropertyValue("--reveal-delay")) {
        el.style.setProperty("--reveal-delay", `${(i % 6) * 70}ms`);
      }
      io.observe(el);
    });
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Back to top ---------- */
  const toTop = document.querySelector(".to-top");
  if (toTop) {
    window.addEventListener(
      "scroll",
      () => toTop.classList.toggle("is-visible", window.scrollY > 480),
      { passive: true }
    );
    toTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Role / focus typing rotator ---------- */
  const rotator = document.querySelector("[data-rotator]");
  if (rotator) {
    let words;
    try {
      words = JSON.parse(rotator.getAttribute("data-rotator"));
    } catch (e) {
      words = [];
    }
    if (words.length) {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let wordIndex = 0;
      let charIndex = 0;
      let deleting = false;

      const tick = () => {
        const word = words[wordIndex];
        if (!deleting) {
          charIndex++;
          rotator.textContent = word.slice(0, charIndex);
          if (charIndex === word.length) {
            deleting = true;
            setTimeout(tick, 1800);
            return;
          }
        } else {
          charIndex--;
          rotator.textContent = word.slice(0, charIndex);
          if (charIndex === 0) {
            deleting = false;
            wordIndex = (wordIndex + 1) % words.length;
          }
        }
        setTimeout(tick, deleting ? 35 : 65);
      };

      if (reduceMotion) {
        rotator.textContent = words[0];
      } else {
        rotator.textContent = "";
        setTimeout(tick, 600);
      }
    }
  }

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll("[data-counter]");
  if (counters.length) {
    const animateCounter = (el) => {
      const target = parseFloat(el.getAttribute("data-counter"));
      const decimals = (el.getAttribute("data-counter").split(".")[1] || "").length;
      const duration = 1400;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = target * eased;
        el.textContent = decimals ? value.toFixed(decimals) : Math.round(value).toString();
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    if ("IntersectionObserver" in window) {
      const cio = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateCounter(entry.target);
              cio.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );
      counters.forEach((el) => cio.observe(el));
    } else {
      counters.forEach(animateCounter);
    }
  }

  /* ---------- HUD local time (Asia/Kolkata) ---------- */
  const clock = document.querySelector("[data-ist-clock]");
  if (clock) {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
    });
    const update = () => {
      clock.textContent = `${fmt.format(new Date())} IST · BHILAI, IN`;
    };
    update();
    setInterval(update, 30000);
  }

  /* ---------- Filter bar (projects / experience) ---------- */
  document.querySelectorAll("[data-filter-group]").forEach((group) => {
    const targetSelector = group.getAttribute("data-filter-group");
    const items = document.querySelectorAll(targetSelector);
    const buttons = group.querySelectorAll(".filter-btn");

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        buttons.forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        const filter = btn.getAttribute("data-filter");

        items.forEach((item) => {
          const tags = (item.getAttribute("data-tags") || "").split(",");
          const show = filter === "all" || tags.includes(filter);
          item.style.display = show ? "" : "none";
          if (show) {
            item.classList.remove("is-visible");
            requestAnimationFrame(() => item.classList.add("is-visible"));
          }
        });
      });
    });
  });

  /* ---------- Copy email to clipboard ---------- */
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const value = btn.getAttribute("data-copy");
      const label = btn.querySelector("[data-copy-label]");
      const original = label ? label.textContent : btn.textContent;
      try {
        await navigator.clipboard.writeText(value);
      } catch (e) {
        /* clipboard unavailable — ignore */
      }
      if (label) {
        label.textContent = "Copied!";
        setTimeout(() => (label.textContent = original), 1800);
      }
    });
  });

  /* ---------- Current year stamp for "experience since" ---------- */
  document.querySelectorAll("[data-years-since]").forEach((el) => {
    const since = parseInt(el.getAttribute("data-years-since"), 10);
    const years = new Date().getFullYear() - since;
    el.textContent = String(years);
  });

  /* ---------- Sliding photo galleries (speaking / workshop pages) ---------- */
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll(".gallery").forEach((gallery) => {
    const track = gallery.querySelector(".gallery__track");
    const slides = Array.from(gallery.querySelectorAll(".gallery__slide"));
    if (!track || slides.length < 2) return;

    let index = 0;

    const dots = document.createElement("div");
    dots.className = "gallery__dots";
    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "gallery__dot" + (i === 0 ? " is-active" : "");
      dot.setAttribute("aria-label", `Go to photo ${i + 1}`);
      dot.addEventListener("click", () => goTo(i));
      dots.appendChild(dot);
    });

    const makeArrow = (dir, label, points) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `gallery__arrow gallery__arrow--${dir}`;
      btn.setAttribute("aria-label", label);
      btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="${points}"/></svg>`;
      return btn;
    };
    const prevBtn = makeArrow("prev", "Previous photo", "15 18 9 12 15 6");
    const nextBtn = makeArrow("next", "Next photo", "9 18 15 12 9 6");

    const count = document.createElement("span");
    count.className = "gallery__count";

    gallery.append(prevBtn, nextBtn, dots, count);

    const dotEls = Array.from(dots.children);
    const render = () => {
      track.style.transform = `translateX(-${index * 100}%)`;
      dotEls.forEach((d, i) => d.classList.toggle("is-active", i === index));
      count.textContent = `${index + 1} / ${slides.length}`;
    };
    const goTo = (i) => {
      index = (i + slides.length) % slides.length;
      render();
    };

    prevBtn.addEventListener("click", () => goTo(index - 1));
    nextBtn.addEventListener("click", () => goTo(index + 1));
    render();

    if (!reduceMotion) {
      let timer = setInterval(() => goTo(index + 1), 4500);
      const restart = () => {
        clearInterval(timer);
        timer = setInterval(() => goTo(index + 1), 4500);
      };
      gallery.addEventListener("mouseenter", () => clearInterval(timer));
      gallery.addEventListener("mouseleave", restart);
      gallery.addEventListener("focusin", () => clearInterval(timer));
      gallery.addEventListener("focusout", restart);
    }

    let touchStartX = null;
    gallery.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.touches[0].clientX;
      },
      { passive: true }
    );
    gallery.addEventListener("touchend", (e) => {
      if (touchStartX === null) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) goTo(index + (dx < 0 ? 1 : -1));
      touchStartX = null;
    });
  });
})();
