/* ============================================================
   Abdul Wahab — AI Portfolio :: behaviour
   ============================================================ */
(function () {
  "use strict";
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* ---------- Theme ---------- */
  const root = document.documentElement;
  const stored = localStorage.getItem("aw-theme");
  if (stored) root.setAttribute("data-theme", stored);
  $$("[data-theme-toggle]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      localStorage.setItem("aw-theme", next);
      window.dispatchEvent(new Event("themechange"));
    })
  );

  /* ---------- Scroll progress + nav state ---------- */
  const progress = $("#progress");
  const nav = $("header.nav");
  const onScroll = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    progress.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
    nav.classList.toggle("scrolled", h.scrollTop > 30);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile drawer ---------- */
  const drawer = $("#drawer");
  $("#hamburger").addEventListener("click", () => drawer.classList.add("open"));
  $("#drawer-close").addEventListener("click", () => drawer.classList.remove("open"));
  $$("#drawer a").forEach((a) => a.addEventListener("click", () => drawer.classList.remove("open")));

  /* ---------- Reveal on scroll ---------- */
  const revObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          revObserver.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );
  $$(".reveal").forEach((el) => revObserver.observe(el));

  /* ---------- Active nav link ---------- */
  const navLinks = $$(".nav-links a");
  const sections = navLinks.map((a) => $(a.getAttribute("href"))).filter(Boolean);
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const id = "#" + e.target.id;
          navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === id));
        }
      });
    },
    { threshold: 0.5, rootMargin: "-30% 0px -55% 0px" }
  );
  sections.forEach((s) => navObserver.observe(s));

  /* ---------- Count-up ---------- */
  function countUp(el) {
    const target = parseFloat(el.dataset.count);
    const dec = (el.dataset.count.split(".")[1] || "").length;
    if (prefersReduced) { el.textContent = target.toLocaleString(undefined, { minimumFractionDigits: dec }); return; }
    const dur = 1600;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = target * eased;
      el.textContent = (dec ? val.toFixed(dec) : Math.round(val)).toLocaleString
        ? (dec ? val.toFixed(dec) : Math.round(val).toLocaleString())
        : val;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = dec ? target.toFixed(dec) : Math.round(target).toLocaleString();
    }
    requestAnimationFrame(tick);
  }
  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { countUp(e.target); countObserver.unobserve(e.target); }
      });
    },
    { threshold: 0.6 }
  );
  $$("[data-count]").forEach((el) => countObserver.observe(el));

  /* ---------- Skill bars ---------- */
  const barObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.style.width = e.target.dataset.lvl + "%";
          barObserver.unobserve(e.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  $$(".bar > i").forEach((el) => barObserver.observe(el));

  /* ---------- Project modal ---------- */
  const scrim = $("#modal-scrim");
  const modalContent = $("#modal-content");
  function openModal(idx) {
    const p = window.PROJECTS[idx];
    if (!p) return;
    modalContent.innerHTML = `
      <button class="modal-close" id="modal-close" aria-label="Close">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
      <div class="modal-viz">${p.viz}</div>
      <div class="modal-body">
        <div class="role">${p.role}</div>
        <h3>${p.title}</h3>
        <p class="long">${p.long}</p>
        <div class="modal-metrics">
          ${p.metrics.map((m) => `<div class="m"><div class="mv">${m.v}</div><div class="ml">${m.l}</div></div>`).join("")}
        </div>
        <div class="modal-tech">
          <h5>Stack</h5>
          <div class="tech-row">${p.tech.map((t) => `<span class="tech">${t}</span>`).join("")}</div>
        </div>
        ${p.screens && p.screens.length ? `
        <div class="modal-screens">
          <h5>Screens</h5>
          <div class="screen-grid">
            ${p.screens.map((s) => `<a class="screen" href="${s.src}" target="_blank" rel="noopener"><img src="${s.src}" alt="${s.alt}" loading="lazy"></a>`).join("")}
          </div>
        </div>` : ""}
      </div>`;
    scrim.classList.add("open");
    document.body.style.overflow = "hidden";
    $("#modal-close").addEventListener("click", closeModal);
  }
  function closeModal() {
    scrim.classList.remove("open");
    document.body.style.overflow = "";
  }
  scrim.addEventListener("click", (e) => { if (e.target === scrim) closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });
  $$(".proj-card").forEach((card) => {
    card.addEventListener("click", () => openModal(+card.dataset.idx));
    card.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openModal(+card.dataset.idx); } });
  });

  /* ---------- Neural network canvas ---------- */
  const canvas = $("#neural");
  if (canvas) initNeural(canvas);

  function accentRGB() {
    return getComputedStyle(root).getPropertyValue("--accent").trim() || "#4F8CFF";
  }
  function hexToRgb(hex) {
    hex = hex.replace("#", "");
    if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
    const n = parseInt(hex, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  function initNeural(cv) {
    const ctx = cv.getContext("2d");
    let w, h, dpr, nodes = [], rgb = hexToRgb(accentRGB());
    const mouse = { x: -9999, y: -9999 };
    const COUNT = () => Math.min(72, Math.floor((w * h) / 22000));
    const LINK = 150;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = cv.clientWidth; h = cv.clientHeight;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    }
    function build() {
      const n = COUNT();
      nodes = [];
      for (let i = 0; i < n; i++) {
        nodes.push({
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.28, vy: (Math.random() - 0.5) * 0.28,
          r: Math.random() * 1.6 + 0.8,
          pulse: Math.random() * Math.PI * 2,
        });
      }
    }
    window.addEventListener("themechange", () => { rgb = hexToRgb(accentRGB()); });
    cv.addEventListener("pointermove", (e) => {
      const b = cv.getBoundingClientRect();
      mouse.x = e.clientX - b.left; mouse.y = e.clientY - b.top;
    });
    cv.addEventListener("pointerleave", () => { mouse.x = -9999; mouse.y = -9999; });

    let raf;
    function frame() {
      ctx.clearRect(0, 0, w, h);
      const [r, g, b] = rgb;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        a.x += a.vx; a.y += a.vy; a.pulse += 0.02;
        if (a.x < 0 || a.x > w) a.vx *= -1;
        if (a.y < 0 || a.y > h) a.vy *= -1;
        // mouse gentle attraction
        const mdx = mouse.x - a.x, mdy = mouse.y - a.y;
        const md = Math.hypot(mdx, mdy);
        if (md < 170) { a.x += (mdx / md) * 0.4; a.y += (mdy / md) * 0.4; }

        for (let j = i + 1; j < nodes.length; j++) {
          const c = nodes[j];
          const dx = a.x - c.x, dy = a.y - c.y;
          const d = Math.hypot(dx, dy);
          if (d < LINK) {
            const op = (1 - d / LINK) * 0.32;
            ctx.strokeStyle = `rgba(${r},${g},${b},${op})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(c.x, c.y); ctx.stroke();
          }
        }
      }
      for (const a of nodes) {
        const glow = 0.5 + Math.sin(a.pulse) * 0.3;
        const near = Math.hypot(mouse.x - a.x, mouse.y - a.y) < 170;
        ctx.fillStyle = `rgba(${r},${g},${b},${near ? 0.95 : glow})`;
        ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2); ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    }
    resize();
    window.addEventListener("resize", resize);
    if (!prefersReduced) frame();
    else {
      // static single paint
      ctx.clearRect(0, 0, w, h);
      const [r, g, b] = rgb;
      for (const a of nodes) { ctx.fillStyle = `rgba(${r},${g},${b},0.6)`; ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2); ctx.fill(); }
    }
  }

  /* ---------- Year ---------- */
  const yr = $("#year"); if (yr) yr.textContent = new Date().getFullYear();
})();
