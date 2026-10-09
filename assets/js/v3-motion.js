/* ============================================================
   v3 MOTION — deterministic. Lenis + IO + one rAF loop.
============================================================ */
(function () {
  let started = false;
  const M = {};
  let lenis = null;
  let revealItems = [];
  const mouse = { x: innerWidth / 2, y: innerHeight / 2, has: false };
  const fine = matchMedia("(hover:hover) and (pointer:fine)").matches;
  addEventListener("pointermove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; mouse.has = true; }, { passive: true });

  M.init = function () {
    if (started) return; started = true;
    runLoader(() => {
      heroIntro();
      setupLenis();
      setupReveals();
      setupCounters();
      setupMagnetic();
      setupAurora();
      setupCursor();
      layout();
      loopStart();
      window.addEventListener("resize", layout);
      [200, 600, 1200].forEach((d) => setTimeout(layout, d));
      if (document.fonts) document.fonts.ready.then(layout);
    });
  };

  /* ---------- loader ---------- */
  function runLoader(done) {
    const loader = document.querySelector(".loader");
    const lines = document.querySelectorAll(".loader-name span");
    const bar = document.querySelector(".loader-bar i");
    const pct = document.querySelector(".loader-pct .num");
    if (!loader) { done(); return; }
    lines.forEach((l, i) => { l.style.transition = "transform .9s cubic-bezier(.16,1,.3,1)"; l.style.transitionDelay = (i * .08 + .1) + "s"; requestAnimationFrame(() => { l.style.transform = "none"; }); });
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 14 + 6; if (p >= 100) { p = 100; clearInterval(iv); setTimeout(exit, 380); }
      if (bar) bar.style.right = (100 - p) + "%";
      if (pct) pct.textContent = String(Math.floor(p)).padStart(3, "0");
    }, 95);
    function exit() {
      document.body.classList.remove("loading");
      done();                       // init reveals (hidden) while the loader still covers the screen
      loader.style.transition = "transform 1s cubic-bezier(.76,0,.24,1)";
      loader.style.transform = "translateY(-100%)";
      setTimeout(() => loader.remove(), 720);
    }
  }

  /* ---------- hero intro — force-show safety net only (reveals handled by loop) ---------- */
  function heroIntro() {
    setTimeout(() => document.body.classList.add("force-show"), 2600);
  }

  /* ---------- Lenis ---------- */
  function setupLenis() {
    lenis = new Lenis({ duration: 1.1, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    window.__lenis = lenis;
  }

  /* ---------- reveals — pure JS inline-style tweens (no CSS transitions) ---------- */
  function setHidden(it) {
    for (const t of it.targets) {
      if (it.mask) { t.style.transform = "translateY(112%)"; }
      else { t.style.opacity = "0"; t.style.transform = "translateY(42px)"; }
    }
  }
  function setProgress(it, p) {
    const e = 1 - Math.pow(1 - p, 3);          // easeOutCubic
    for (const t of it.targets) {
      if (it.mask) { t.style.transform = `translateY(${(1 - e) * 112}%)`; }
      else { t.style.opacity = String(e); t.style.transform = `translateY(${(1 - e) * 42}px)`; }
    }
  }
  function setShown(it) {
    for (const t of it.targets) { t.style.opacity = ""; t.style.transform = ""; }
  }
  function setupReveals() {
    const els = [...document.querySelectorAll("[data-rv], .mask")];
    revealItems = els.map((el) => {
      const mask = el.classList.contains("mask");
      return { el, mask, targets: mask ? [...el.children] : [el],
        delay: (parseInt(el.getAttribute("data-d"), 10) || 0) * 80, state: "hidden", start: 0 };
    });
    revealItems.forEach(setHidden);
    // safety: if anything is still hidden after 5s, show it outright
    setTimeout(() => revealItems.forEach((it) => { if (it.state !== "done") { setShown(it); it.state = "done"; } }), 5000);
  }

  /* ---------- counters ---------- */
  function setupCounters() {
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return; io.unobserve(e.target);
      const el = e.target, end = parseFloat(el.dataset.count), dec = (el.dataset.dec | 0);
      const t0 = performance.now(), dur = 1700;
      (function tick(now) { const k = Math.min(1, (now - t0) / dur); const v = end * (1 - Math.pow(1 - k, 3)); el.textContent = v.toFixed(dec); if (k < 1) requestAnimationFrame(tick); })(t0);
    }), { threshold: 0.6 });
    document.querySelectorAll("[data-count]").forEach((el) => io.observe(el));
  }

  /* ---------- magnetic ---------- */
  function setupMagnetic() {
    if (!matchMedia("(hover:hover) and (pointer:fine)").matches) return;
    document.querySelectorAll("[data-mag]").forEach((el) => {
      el.addEventListener("pointermove", (e) => { const r = el.getBoundingClientRect(); el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .3}px,${(e.clientY - r.top - r.height / 2) * .4}px)`; });
      el.addEventListener("pointerleave", () => { el.style.transition = "transform .5s cubic-bezier(.16,1,.3,1)"; el.style.transform = "none"; setTimeout(() => el.style.transition = "", 500); });
    });
  }

  /* ---------- aurora gradient-mesh background (rAF — keyframes are frozen here) ---------- */
  function setupAurora() {
    const c = document.querySelector(".aurora");
    if (!c) return;
    const ctx = c.getContext("2d");
    const SCALE = 0.42;                 // render small, upscale → free dreamy blur
    let w, h;
    function resize() { w = c.width = Math.max(2, Math.floor(innerWidth * SCALE)); h = c.height = Math.max(2, Math.floor(innerHeight * SCALE)); c.style.width = innerWidth + "px"; c.style.height = innerHeight + "px"; }
    resize(); addEventListener("resize", resize);

    function hexToHsl(hex) {
      const m = hex.replace("#", ""); let r = parseInt(m.substr(0,2),16)/255, g = parseInt(m.substr(2,2),16)/255, b = parseInt(m.substr(4,2),16)/255;
      const mx = Math.max(r,g,b), mn = Math.min(r,g,b); let hh = 0, s = 0, l = (mx+mn)/2;
      if (mx !== mn) { const d = mx-mn; s = l > .5 ? d/(2-mx-mn) : d/(mx+mn);
        if (mx===r) hh = (g-b)/d + (g<b?6:0); else if (mx===g) hh = (b-r)/d + 2; else hh = (r-g)/d + 4; hh *= 60; }
      return [hh, s*100, l*100];
    }
    const blobs = Array.from({ length: 5 }, (_, i) => ({
      bx: [.2,.8,.5,.15,.85][i], by: [.2,.3,.7,.8,.75][i],
      ax: .14 + Math.random()*.16, ay: .14 + Math.random()*.16,
      sx: .00006 + Math.random()*.00007, sy: .00006 + Math.random()*.00007,
      px: Math.random()*9, py: Math.random()*9,
      hueOff: [0, 36, -34, 150, -150][i], r: .52 + Math.random()*.30,
    }));

    function draw(now) {
      const dark = document.documentElement.dataset.theme === "dark";
      const [H, S0] = hexToHsl(getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#2b50e2");
      const S = Math.min(92, Math.max(55, S0));
      const L = dark ? 52 : 72;
      const a = dark ? 0.26 : 0.34;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = dark ? "lighter" : "source-over";
      for (const b of blobs) {
        const x = (b.bx + Math.sin(now * b.sx + b.px) * b.ax) * w;
        const y = (b.by + Math.cos(now * b.sy + b.py) * b.ay) * h;
        const rad = b.r * Math.max(w, h);
        const hue = (H + b.hueOff + 360) % 360;
        const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
        g.addColorStop(0, `hsla(${hue}, ${S}%, ${L}%, ${a})`);
        g.addColorStop(1, `hsla(${hue}, ${S}%, ${L}%, 0)`);
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, rad, 0, 7); ctx.fill();
      }
      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  }

  /* ---------- custom DevOps reticle cursor ---------- */
  const cur = { rx: innerWidth / 2, ry: innerHeight / 2, dx: innerWidth / 2, dy: innerHeight / 2, hot: false, mode: "" };
  function setupCursor() {
    if (!fine) return;
    document.body.classList.add("has-cursor");
    const root = document.querySelector(".cursor");
    if (!root) return;
    const HOT = "a,button,input,textarea,.chip,[data-mag],.net-canvas,.term,.soc,.work-panel,.rail a,.nav-links a";
    addEventListener("pointerover", (e) => {
      const el = e.target.closest(HOT);
      cur.hot = !!el;
      cur.mode = !el ? "" :
        (el.closest(".net-canvas") ? "INSPECT" :
         el.closest(".term") ? "SHELL" :
         (el.matches("a,.soc,.rail a,.nav-links a") || el.closest("a")) ? "OPEN" :
         el.matches("input,textarea") ? "TYPE" : "EXEC");
    });
    addEventListener("pointerout", (e) => { if (!e.relatedTarget || !e.relatedTarget.closest || !e.relatedTarget.closest(HOT)) { cur.hot = false; cur.mode = ""; } });
    addEventListener("pointerdown", () => root.classList.add("down"));
    addEventListener("pointerup", () => root.classList.remove("down"));
  }

  /* ---------- live ops monitor (animated dashboard) ---------- */
  function setupMonitor() {
    const c = document.querySelector(".mon-spark");
    if (!c) return;
    const ctx = c.getContext("2d");
    const dpr = Math.min(devicePixelRatio || 1, 2);
    let w, h, N = 120, data = [];
    function resize() { const r = c.getBoundingClientRect(); w = c.width = r.width * dpr; h = c.height = r.height * dpr; }
    resize(); addEventListener("resize", resize);
    let base = 60;
    for (let i = 0; i < N; i++) data.push(50 + Math.random() * 20);
    // ticking log
    const logEl = document.querySelector(".mon-log");
    const LOGS = [
      "deploy: efamilycourt build #1421 → <ok>OK</ok>",
      "ssl: renewed *.zohirrayhan.me → <ok>200</ok>",
      "cron: routine-scrape completed in 4.2s",
      "fw: imunify360 blocked 3 probes",
      "db: mysql replica lag 0.01s",
      "cache: litespeed purge → <ok>done</ok>",
      "fcm: pushed 1.2k notifications",
      "backup: snapshot ap-south-1 → <ok>OK</ok>",
      "health: all 4 services <ok>green</ok>",
    ];
    let li = 0;
    function pushLog() {
      if (!logEl) return;
      const row = document.createElement("div"); row.className = "mon-logrow";
      const t = new Date(); const ts = String(t.getHours()).padStart(2,"0")+":"+String(t.getMinutes()).padStart(2,"0")+":"+String(t.getSeconds()).padStart(2,"0");
      row.innerHTML = `<span class="ts">${ts}</span> ${LOGS[li % LOGS.length].replace(/<ok>/g,'<b class="ok">').replace(/<\/ok>/g,'</b>')}`;
      logEl.appendChild(row); li++;
      while (logEl.children.length > 7) logEl.removeChild(logEl.firstChild);
      logEl.scrollTop = logEl.scrollHeight;
    }
    for (let i = 0; i < 5; i++) pushLog();
    setInterval(pushLog, 2200);

    const accentOf = () => getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#2b50e2";
    let t = 0;
    function draw() {
      t += 1;
      if (t % 3 === 0) { base += (Math.random() - 0.5) * 8; base = Math.max(35, Math.min(78, base)); data.push(base + Math.random() * 14); if (data.length > N) data.shift(); }
      ctx.clearRect(0, 0, w, h);
      const A = accentOf();
      // grid
      ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--line").trim() || "rgba(0,0,0,.1)";
      ctx.lineWidth = 1;
      for (let gy = 0; gy <= 4; gy++) { const yy = (gy / 4) * h; ctx.globalAlpha = .5; ctx.beginPath(); ctx.moveTo(0, yy); ctx.lineTo(w, yy); ctx.stroke(); }
      ctx.globalAlpha = 1;
      // area + line
      const step = w / (N - 1);
      ctx.beginPath();
      data.forEach((v, i) => { const x = i * step, yy = h - (v / 100) * h; i ? ctx.lineTo(x, yy) : ctx.moveTo(x, yy); });
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, A + "55"); grad.addColorStop(1, A + "00");
      ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath(); ctx.fillStyle = grad; ctx.fill();
      ctx.beginPath();
      data.forEach((v, i) => { const x = i * step, yy = h - (v / 100) * h; i ? ctx.lineTo(x, yy) : ctx.moveTo(x, yy); });
      ctx.strokeStyle = A; ctx.lineWidth = 2 * dpr; ctx.stroke();
      // head dot
      const lx = (N - 1) * step, ly = h - (data[data.length - 1] / 100) * h;
      ctx.fillStyle = A; ctx.beginPath(); ctx.arc(lx, ly, 3 * dpr, 0, 7); ctx.fill();
      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  }

  /* ---------- layout (skills horizontal sizing) ---------- */
  let skills, skillsTrack, skillsMax = 0;
  function layout() {
    const root = document.documentElement;
    const mobileMarquee = document.querySelector(".hero + .marquee");
    skills = document.querySelector(".skills");
    skillsTrack = document.querySelector(".skills-track");
    if (skills && skillsTrack) {
      skillsMax = Math.max(0, skillsTrack.scrollWidth - innerWidth);
      skills.style.height = (innerHeight + skillsMax) + "px";
    }
    if (mobileMarquee) {
      root.style.setProperty("--mobile-marquee-height", mobileMarquee.offsetHeight + "px");
    }
  }

  /* ---------- main rAF loop ---------- */
  const marquee = { x: 0 };
  function loopStart() {
    const nav = document.querySelector(".nav");
    const sbar = document.querySelector(".sbar");
    const railLinks = [...document.querySelectorAll(".rail a")];
    const railSecs = railLinks.map((a) => document.getElementById(a.getAttribute("href").slice(1)));
    const hero = document.querySelector(".hero");
    const mTrack = document.querySelector(".marquee-track");
    let mHalf = 0;
    const skillsFoot = document.querySelector(".skills-foot .track i");
    const tl = document.querySelector(".tl");
    const tlFill = document.querySelector(".tl-fill");
    const bigs = [...document.querySelectorAll(".wv .big")];
    const workPanels = [...document.querySelectorAll(".work-panel")];
    const carets = [...document.querySelectorAll(".caret")];
    const liveDots = [...document.querySelectorAll(".live i")];
    // cursor
    const curRoot = document.querySelector(".cursor");
    const curReticle = document.querySelector(".cursor .reticle");
    const curCoords = document.querySelector(".cursor .co");
    const curLabel = document.querySelector(".cursor .lbl");
    // portrait
    const portStage = document.querySelector(".portrait .tilt");
    const portWrap = document.querySelector(".portrait");
    const portScan = document.querySelector(".portrait .scanbar");
    const portChips = [...document.querySelectorAll(".portrait .pchip")];
    let curRot = { x: 0, y: 0 };
    // monitor meters
    const meters = [...document.querySelectorAll(".mon-meter")].map((el) => ({ bar: el.querySelector("i"), val: el.querySelector(".v"), ph: Math.random() * 9, amp: 8 + Math.random() * 10, mid: 40 + Math.random() * 35, sp: 0.0011 + Math.random() * 0.0012 }));

    function frame(now) {
      if (lenis) lenis.raf(now);
      const y = scrollY, vh = innerHeight;
      const docH = document.documentElement.scrollHeight - vh;

      // decorative loops (CSS keyframes are frozen in this env — drive them here)
      const blink = (Math.floor(now / 530) % 2) ? 1 : 0;
      for (const cr of carets) cr.style.opacity = blink;
      const pulse = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(now * 0.0042));
      for (const ld of liveDots) { ld.style.opacity = pulse; ld.style.transform = `scale(${0.85 + pulse * 0.4})`; }

      // scroll reveals — JS inline-style tweens (CSS transitions don't progress here)
      for (const it of revealItems) {
        if (it.state === "done") continue;
        const r = it.el.getBoundingClientRect();
        if (it.state === "hidden") {
          if (r.top < vh * 0.9 && r.bottom > 0) { it.state = "run"; it.start = now + it.delay; }
          else continue;
        }
        const p = clamp((now - it.start) / 850, 0, 1);
        if (p <= 0) { setHidden(it); continue; }
        setProgress(it, p);
        if (p >= 1) { setShown(it); it.state = "done"; }
      }

      if (nav) nav.classList.toggle("shrink", y > 60);
      if (sbar) sbar.style.transform = `scaleX(${docH > 0 ? y / docH : 0})`;

      // rail active
      let act = -1;
      railSecs.forEach((s, i) => { if (s) { const r = s.getBoundingClientRect(); if (r.top <= vh * .5 && r.bottom >= vh * .5) act = i; } });
      railLinks.forEach((a, i) => a.classList.toggle("on", i === act));

      // ---- custom cursor follow (damped) ----
      if (curRoot && fine) {
        cur.dx = mouse.x; cur.dy = mouse.y;
        cur.rx += (cur.dx - cur.rx) * 0.22; cur.ry += (cur.dy - cur.ry) * 0.22;
        curRoot.style.transform = `translate(${cur.dx}px,${cur.dy}px)`;          // dot snaps
        if (curReticle) {
          curReticle.style.transform = `translate(${cur.rx - cur.dx}px,${cur.ry - cur.dy}px) scale(${cur.hot ? 1.7 : 1}) rotate(${(now * 0.02) % 360}deg)`;
          curReticle.style.borderColor = cur.hot ? "var(--accent)" : "var(--ink-3)";
        }
        if (curCoords) curCoords.textContent = `${String(Math.round(mouse.x)).padStart(4,"0")},${String(Math.round(mouse.y)).padStart(4,"0")}`;
        if (curLabel) { curLabel.textContent = cur.mode; curLabel.style.opacity = cur.mode ? 1 : 0; }
      }

      // ---- portrait: scroll parallax + 3D tilt toward cursor + float ----
      if (portWrap && hero) {
        const hr = hero.getBoundingClientRect();
        const prog = clamp(-hr.top / vh, 0, 1);
        portWrap.style.transform = `translateY(${prog * -40}px)`;
        if (portStage) {
          const r = portWrap.getBoundingClientRect();
          const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
          const tx = fine && mouse.has ? clamp((mouse.x - cx) / r.width, -1, 1) : 0;
          const ty = fine && mouse.has ? clamp((mouse.y - cy) / r.height, -1, 1) : 0;
          curRot.x += (-ty * 9 - curRot.x) * 0.08;
          curRot.y += (tx * 11 - curRot.y) * 0.08;
          const float = Math.sin(now * 0.0013) * 7;
          portStage.style.transform = `translateY(${float}px) rotateX(${curRot.x}deg) rotateY(${curRot.y}deg)`;
          portChips.forEach((ch, i) => { const d = (i % 2 ? 1 : -1); ch.style.transform = `translate(${curRot.y * d * 1.4}px, ${(-float + curRot.x * d) * 1.2}px)`; });
        }
        if (portScan) portScan.style.top = ((Math.sin(now * 0.0012) * 0.5 + 0.5) * 100) + "%";
      }

      // ---- monitor meters ----
      for (const m of meters) {
        const v = m.mid + Math.sin(now * m.sp + m.ph) * m.amp + Math.sin(now * m.sp * 2.3 + m.ph) * (m.amp * 0.3);
        const vv = clamp(v, 4, 99);
        if (m.bar) m.bar.style.width = vv.toFixed(0) + "%";
        if (m.val) m.val.textContent = vv.toFixed(0) + "%";
      }

      // marquee
      if (mTrack) {
        if (!mHalf) mHalf = mTrack.scrollWidth / 2;
        const v = lenis ? (lenis.velocity || 0) : 0;
        marquee.x -= 0.7 + Math.abs(v) * .4;
        if (mHalf && -marquee.x >= mHalf) marquee.x += mHalf;
        const skew = clamp(v * .5, -10, 10);
        mTrack.style.transform = `translateX(${marquee.x}px) skewX(${skew}deg)`;
      }

      // skills horizontal
      if (skills && skillsTrack) {
        const r = skills.getBoundingClientRect();
        const prog = clamp(-r.top / (skills.offsetHeight - vh), 0, 1);
        skillsTrack.style.transform = `translateX(${-prog * skillsMax}px)`;
        if (skillsFoot) skillsFoot.style.right = (100 - prog * 100) + "%";
      }

      // timeline fill
      if (tl && tlFill) {
        const r = tl.getBoundingClientRect();
        const prog = clamp((vh * .7 - r.top) / r.height, 0, 1);
        tlFill.style.height = (prog * 100) + "%";
      }

      // work visual parallax
      bigs.forEach((b) => {
        const r = b.getBoundingClientRect();
        const off = (r.top + r.height / 2 - vh / 2) / vh;
        b.style.transform = `translateY(${off * -46}px)`;
      });

      // work sticky-stack: smooth easeInOut scale + fade as the next covers it
      workPanels.forEach((panel, i) => {
        const card = panel.querySelector(".pcard");
        const next = workPanels[i + 1];
        if (!card) return;
        let cover = 0;
        if (next) { const nr = next.getBoundingClientRect(); cover = clamp(1 - nr.top / vh, 0, 1); }
        const e = cover < 0.5 ? 2 * cover * cover : 1 - Math.pow(-2 * cover + 2, 2) / 2;  // easeInOutQuad
        card.style.transform = `scale(${1 - e * 0.12}) translateY(${e * -34}px)`;
        card.style.opacity = String(1 - e * 0.55);
        card.style.filter = e > 0.01 ? `brightness(${1 - e * 0.28})` : "";
      });

      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  M.scrollTo = function (sel) {
    const el = typeof sel === "string" ? document.querySelector(sel) : sel;
    if (el && lenis) lenis.scrollTo(el, { offset: -4, duration: 1.3 });
    else if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  window.MOTION = M;
})();
