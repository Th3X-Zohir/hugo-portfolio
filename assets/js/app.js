/* APP — vanilla replacements for what React used to render.
   Theme, command palette, typewriter, terminal, skill graph, GitHub panel.
   Markup is rendered server-side by Hugo; this only adds behaviour. */
(function () {
  "use strict";

  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => [...(r || document).querySelectorAll(s)];
  const D = window.DATA || {};

  /* ---------------- theme ---------------- */
  const THEME_KEY = "zr-theme-v3";
  const root = document.documentElement;
  function applyTheme(t) {
    root.setAttribute("data-theme", t);
    try { localStorage.setItem(THEME_KEY, t); } catch (e) {}
    $$("[data-theme-icon]").forEach((el) => { el.dataset.mode = t; });
  }
  function currentTheme() { return root.getAttribute("data-theme") || "light"; }
  function toggleTheme() { applyTheme(currentTheme() === "light" ? "dark" : "light"); }
  (function initTheme() {
    let saved = null;
    try { saved = localStorage.getItem(THEME_KEY); } catch (e) {}
    applyTheme(saved || "light");
  })();
  $$("[data-act='theme']").forEach((b) => b.addEventListener("click", toggleTheme));

  /* ---------------- smooth in-page nav ---------------- */
  const go = (id) => {
    const sel = id.charAt(0) === "#" ? id : "#" + id;
    if (window.MOTION && window.MOTION.scrollTo) window.MOTION.scrollTo(sel);
    else { const el = $(sel); if (el) el.scrollIntoView({ behavior: "smooth" }); }
  };
  $$("a[data-go]").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); go(a.getAttribute("href")); }));
  $$("button[data-go]").forEach((b) => b.addEventListener("click", () => go(b.dataset.go)));

  /* ---------------- typewriter (hero roles) ---------------- */
  (function typewriter() {
    const host = $("[data-typewriter]");
    if (!host) return;
    const words = (host.dataset.typewriter || "").split("|").filter(Boolean);
    if (!words.length) return;
    const out = document.createElement("span");
    const caret = document.createElement("span");
    caret.className = "caret";
    caret.innerHTML = "&nbsp;";
    host.textContent = "";
    host.append(out, caret);
    let i = 0, txt = "", del = false;
    (function step() {
      const full = words[i % words.length];
      if (!del && txt === full) { setTimeout(() => { del = true; step(); }, 1500); return; }
      if (del && txt === "") { del = false; i++; step(); return; }
      txt = del ? full.slice(0, txt.length - 1) : full.slice(0, txt.length + 1);
      out.textContent = txt;
      setTimeout(step, del ? 45 : 80);
    })();
  })();

  /* ---------------- command palette (⌘K) ---------------- */
  (function palette() {
    const ov = $(".cmdk-ov");
    if (!ov) return;
    const input = $(".cmdk-s input", ov);
    const list = $(".cmdk-list", ov);
    const sections = [
      ["home", "Top", "⌂", "go"], ["profile", "Profile", "01", "section"], ["skills", "Capabilities", "02", "section"],
      ["network", "Skill graph", "03", "section"], ["github", "GitHub activity", "04", "section"], ["work", "Selected work", "05", "section"],
      ["reel", "Motion reel", "06", "section"], ["experience", "Experience", "07", "section"], ["console", "Console", "08", "section"],
      ["credentials", "Credentials", "09", "section"], ["cv", "CV PDF", "10", "section"], ["contact", "Contact", "11", "section"],
    ];
    const cvFile = (D.cv && D.cv.file) || "Zohir_Rayhan.pdf";
    const social = (k) => (D.socials || []).find((s) => s.key === k);
    const items = sections.map(([id, label, ic, desc]) => ({ id, label, ic, desc, act: () => go(id) })).concat([
      { id: "cv-open", label: "Open CV PDF", ic: "↗", desc: "file", act: () => window.open(cvFile, "_blank") },
      { id: "theme", label: "Toggle light / dark", ic: "◐", desc: "action", act: toggleTheme },
      { id: "email", label: "Copy email", ic: "@", desc: "action", act: () => navigator.clipboard && navigator.clipboard.writeText(D.identity.email) },
      { id: "gh-open", label: "Open GitHub", ic: "↗", desc: "link", act: () => { const s = social("github"); if (s) window.open(s.url, "_blank"); } },
      { id: "linkedin", label: "Open LinkedIn", ic: "↗", desc: "link", act: () => { const s = social("linkedin"); if (s) window.open(s.url, "_blank"); } },
    ]);

    let open = false, active = 0, shown = items;

    function render() {
      const q = input.value.toLowerCase();
      shown = items.filter((it) => it.label.toLowerCase().includes(q) || it.id.includes(q));
      if (active >= shown.length) active = Math.max(0, shown.length - 1);
      list.innerHTML = shown.length
        ? shown.map((it, i) => `<div class="cmdk-item${i === active ? " active" : ""}" data-i="${i}"><span class="ic">${it.ic}</span><span>${it.label}</span><span class="desc">${it.desc}</span></div>`).join("")
        : '<div class="cmdk-item">no matches.</div>';
    }
    function setOpen(v) {
      open = v;
      ov.classList.toggle("open", v);
      if (v) { input.value = ""; active = 0; render(); setTimeout(() => input.focus(), 30); }
    }
    input.addEventListener("input", () => { active = 0; render(); });
    list.addEventListener("mousemove", (e) => {
      const it = e.target.closest(".cmdk-item[data-i]"); if (!it) return;
      const i = +it.dataset.i; if (i !== active) { active = i; render(); }
    });
    list.addEventListener("mousedown", (e) => {
      const it = e.target.closest(".cmdk-item[data-i]"); if (!it) return;
      e.preventDefault(); const item = shown[+it.dataset.i]; if (item) { item.act(); setOpen(false); }
    });
    ov.addEventListener("mousedown", (e) => { if (e.target === ov) setOpen(false); });
    ov.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") { e.preventDefault(); active = Math.min(active + 1, shown.length - 1); render(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); active = Math.max(active - 1, 0); render(); }
      else if (e.key === "Enter") { e.preventDefault(); const it = shown[active]; if (it) { it.act(); setOpen(false); } }
      else if (e.key === "Escape") setOpen(false);
    });
    addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOpen(!open); }
    });
    $$("[data-act='palette']").forEach((b) => b.addEventListener("click", () => setOpen(true)));
  })();

  /* ---------------- interactive terminal ---------------- */
  (function terminal() {
    const term = $(".term");
    if (!term) return;
    const body = $(".term-body", term);
    const input = $(".term-input", term);
    const rowEl = $(".term-input-row", term);
    const hist = [];
    let hi = -1;

    const esc = (s) => String(s).replace(/</g, "&lt;");
    function out(lines) {
      lines.forEach((l) => {
        const div = document.createElement("div");
        div.className = "term-line " + (l.t === "err" ? "term-err" : l.t === "cmd" ? "" : "term-out");
        div.innerHTML = l.html;
        body.insertBefore(div, rowEl);
      });
      body.scrollTop = body.scrollHeight;
    }

    const CMD = {
      help: () => ([
        { t: "out", html: "Available commands:" },
        { t: "out", html: "  <span class='term-key'>whoami</span>    short bio &amp; current roles" },
        { t: "out", html: "  <span class='term-key'>skills</span>    technical stack inventory" },
        { t: "out", html: "  <span class='term-key'>projects</span>  featured work + links" },
        { t: "out", html: "  <span class='term-key'>experience</span> work history" },
        { t: "out", html: "  <span class='term-key'>contact</span>   how to reach me" },
        { t: "out", html: "  <span class='term-key'>social</span>    github / linkedin / facebook" },
        { t: "out", html: "  <span class='term-key'>neofetch</span>  system summary" },
        { t: "out", html: "  <span class='term-key'>theme</span>     toggle dark / light" },
        { t: "out", html: "  <span class='term-key'>goto</span> &lt;section&gt;  scroll to a section" },
        { t: "out", html: "  <span class='term-key'>clear</span>     wipe the screen" },
      ]),
      whoami: () => ([
        { t: "out", html: `<span class="u">${D.identity.name.toLowerCase()}</span> — ${D.identity.roles.slice(0, 3).join(" · ")}` },
        { t: "out", html: D.identity.summary },
      ]),
      skills: () => D.skills.flatMap((s) => ([
        { t: "out", html: `<span class="accent">${s.cmd}</span>` },
        { t: "out", html: "  " + s.items.join("  ·  ") },
      ])),
      projects: () => ([{ t: "out", html: "Featured projects:" }]
        .concat(D.projects.map((p, i) => ({ t: "out", html: `  [${i + 1}] <span class="term-key">${p.name}</span> — ${p.tag}  <a href="${p.url}" target="_blank" rel="noopener">↗ open</a>` })))
        .concat([{ t: "out", html: "type <span class='term-key'>goto projects</span> to view them." }])),
      experience: () => D.experience.map((e) => ({ t: "out", html: `<span class="accent">${e.period}</span>  ${e.role} @ ${e.org}` })),
      contact: () => ([
        { t: "out", html: `email   <a href="mailto:${D.identity.email}">${D.identity.email}</a>` },
        { t: "out", html: `site    <a href="${D.identity.site}" target="_blank" rel="noopener">${D.identity.site}</a>` },
        { t: "out", html: `phone   ${D.identity.phone}` },
        { t: "out", html: `region  ${D.identity.location}` },
      ]),
      social: () => D.socials.map((s) => ({ t: "out", html: `${s.label.padEnd(9)} <a href="${s.url}" target="_blank" rel="noopener">${s.url}</a>` })),
      neofetch: () => ([
        { t: "out", html: `<span class="accent">      ╔═╗      </span>  <span class="u">${D.identity.name.toLowerCase()}</span>@portfolio` },
        { t: "out", html: `<span class="accent">      ╚═╝      </span>  roles    ${D.identity.roles.slice(0, 3).join(", ")}` },
        { t: "out", html: `<span class="accent">    ▄▄▄▄▄▄▄    </span>  location ${D.identity.location}` },
        { t: "out", html: `<span class="accent">   █ ops █ █   </span>  uptime   99.98%` },
        { t: "out", html: `<span class="accent">    ▀▀▀▀▀▀▀    </span>  stack    Laravel · Python · Linux` },
      ]),
      clear: () => { $$(".term-line", body).forEach((n) => n.remove()); return null; },
      theme: () => { toggleTheme(); return [{ t: "out", html: "theme toggled." }]; },
      ls: () => ([{ t: "out", html: "about/  skills/  projects/  experience/  education/  contact/" }]),
      sudo: () => ([{ t: "err", html: "nice try. permission denied — but I admire the hustle. 🙂" }]),
      goto: (arg) => {
        const map = { about: "profile", profile: "profile", skills: "skills", projects: "work", work: "work", experience: "experience", exp: "experience", education: "credentials", edu: "credentials", credentials: "credentials", contact: "contact", home: "home", top: "home", github: "github", cv: "cv", network: "network", reel: "reel" };
        const key = map[(arg || "").toLowerCase()];
        if (!key) return [{ t: "err", html: `unknown section: ${esc(arg || "(none)")} — try profile|skills|projects|experience|credentials|contact` }];
        go(key);
        return [{ t: "out", html: `→ navigating to ${key} …` }];
      },
    };

    function run(raw) {
      const cmd = raw.trim();
      const echo = { t: "cmd", html: `<span class="p">zohir@portfolio</span>:<span class="u">~</span>$ ${esc(cmd)}` };
      if (!cmd) { out([echo]); return; }
      hist.unshift(cmd); hi = -1;
      const parts = cmd.split(/\s+/);
      const fn = CMD[parts[0].toLowerCase()];
      if (!fn) { out([echo, { t: "err", html: `command not found: ${esc(parts[0])} — type <span class='term-key'>help</span>` }]); return; }
      const res = fn(parts.slice(1).join(" "));
      if (res === null) return;
      out([echo].concat(res));
    }

    term.addEventListener("click", () => input.focus());
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") { run(input.value); input.value = ""; }
      else if (e.key === "ArrowUp") { e.preventDefault(); if (hist.length) { hi = Math.min(hi + 1, hist.length - 1); input.value = hist[hi]; } }
      else if (e.key === "ArrowDown") { e.preventDefault(); hi = Math.max(hi - 1, -1); input.value = hi === -1 ? "" : hist[hi]; }
      else if (e.key === "l" && e.ctrlKey) { e.preventDefault(); CMD.clear(); }
    });
  })();

  /* ---------------- CV preview ---------------- */
  (function cvPreview() {
    const box = $("[data-cv-preview]");
    if (!box) return;
    const frame = $("iframe", box);
    if (!frame) return;
    const ready = () => box.classList.add("ready");
    frame.addEventListener("load", ready);
    frame.addEventListener("error", () => {
      box.classList.remove("ready");
      const st = $(".cv-preview-state", box);
      if (st) { st.classList.add("fail"); st.innerHTML = '<span class="cv-state-k">Preview unavailable</span><strong>The PDF file is not reachable.</strong>'; }
    });
    if (frame.contentDocument && frame.contentDocument.readyState === "complete") ready();
  })();

  /* ---------------- copy-on-click email ---------------- */
  $$("[data-copy]").forEach((a) => {
    a.addEventListener("click", () => {
      if (!navigator.clipboard) return;
      navigator.clipboard.writeText(a.dataset.copy);
      const was = a.textContent;
      a.textContent = "copied to clipboard ✓";
      setTimeout(() => { a.textContent = was; }, 1600);
    });
  });

  /* ---------------- skill graph (force-directed canvas) ---------------- */
  (function network() {
    const wrap = $(".net-wrap");
    const canvas = $(".net-canvas");
    const panelEl = $(".net-panel");
    if (!wrap || !canvas || !panelEl) return;

    const NET_CATS = [
      { key: "app", label: "Backend / Frontend", color: "#e2622b", cats: ["Backend & Frontend"] },
      { key: "ops", label: "Server / Infra", color: "#1f9d57", cats: ["Server & Infrastructure"] },
      { key: "api", label: "APIs / Integration", color: "#7a3be2", cats: ["APIs & Integration"] },
      { key: "mob", label: "Mobile", color: "#2f9bd6", cats: ["Mobile"] },
    ];
    const NET_ETC = { key: "etc", label: "Other", color: "#8a8276" };
    const itemCat = {};
    (D.skills || []).forEach((s) => s.items.forEach((it) => { itemCat[it.toLowerCase()] = s.cat; }));
    const catOf = (name) => NET_CATS.find((c) => c.cats.includes(itemCat[name.toLowerCase()])) || NET_ETC;

    const ctx = canvas.getContext("2d");
    const dpr = Math.min(devicePixelRatio || 1, 2);
    let W = 0, H = 0, raf = 0, hoverId = null, pinId = null, filterCat = null;

    const allProjects = [].concat(D.projects || [], (D.ghProjects || [])).map((p) => ({ ...p, url: p.url || ("https://github.com/Th3X-Zohir/" + p.gh) }));
    const projects = allProjects.map((p, i) => ({ id: "p" + i, type: "project", label: p.name, short: p.short || p.name.split(" ")[0], idx: i, stack: p.stack, url: p.url }));
    const techMap = {};
    allProjects.forEach((p, i) => p.stack.forEach((tn) => {
      const key = tn.trim();
      if (!techMap[key]) { const c = catOf(key); techMap[key] = { id: "t" + Object.keys(techMap).length, type: "tech", label: key, projects: [], cat: c.key, color: c.color }; }
      if (!techMap[key].projects.includes("p" + i)) techMap[key].projects.push("p" + i);
    }));
    const techs = Object.values(techMap);
    const nodes = projects.concat(techs);
    const byId = {}; nodes.forEach((n) => (byId[n.id] = n));
    const edges = [];
    techs.forEach((t) => { t.shared = t.projects.length > 1; t.projects.forEach((pid) => edges.push({ a: t.id, b: pid })); });
    const topTech = techs.slice().sort((a, b) => b.projects.length - a.projects.length)[0];

    const stat = (sel, v) => { const el = $(sel); if (el) el.textContent = v; };
    stat("[data-net='techs']", techs.length);
    stat("[data-net='projects']", projects.length);
    stat("[data-net='links']", edges.length);
    stat("[data-net='top']", topTech ? topTech.label : "—");

    function place() {
      const r = wrap.getBoundingClientRect(); W = r.width; H = r.height;
      canvas.width = W * dpr; canvas.height = H * dpr; canvas.style.width = W + "px"; canvas.style.height = H + "px";
      const cx = W / 2, cy = H / 2;
      projects.forEach((p, i) => { const a = (i / projects.length) * Math.PI * 2 - Math.PI / 2; p.x = cx + Math.cos(a) * Math.min(W, H) * 0.16; p.y = cy + Math.sin(a) * Math.min(W, H) * 0.16; p.vx = p.vy = 0; p.r = Math.min(27, Math.max(17, W * 0.018)); p.m = 6; });
      techs.forEach((t, i) => { const a = (i / techs.length) * Math.PI * 2; const rad = Math.min(W, H) * (0.34 + (i % 3) * 0.04); t.x = cx + Math.cos(a) * rad; t.y = cy + Math.sin(a) * rad; t.vx = t.vy = 0; t.r = t.shared ? 9 : 6.5; t.m = 1; });
    }

    function tick() {
      const cx = W / 2, cy = H / 2;
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.vx += (cx - n.x) * 0.0016; n.vy += (cy - n.y) * 0.0016;
        for (let j = i + 1; j < nodes.length; j++) {
          const o = nodes[j]; const dx = n.x - o.x, dy = n.y - o.y; let d2 = dx * dx + dy * dy; if (d2 < 1) d2 = 1;
          const d = Math.sqrt(d2), force = Math.min(2600 / d2, 2.2);
          const fx = (dx / d) * force, fy = (dy / d) * force;
          n.vx += fx / n.m; n.vy += fy / n.m; o.vx -= fx / o.m; o.vy -= fy / o.m;
        }
      }
      const rest = Math.min(W, H) * 0.16;
      for (const e of edges) {
        const a = byId[e.a], b = byId[e.b]; const dx = b.x - a.x, dy = b.y - a.y; const d = Math.hypot(dx, dy) || 1;
        const f = (d - rest) * 0.012, fx = (dx / d) * f, fy = (dy / d) * f;
        a.vx += fx / a.m; a.vy += fy / a.m; b.vx -= fx / b.m; b.vy -= fy / b.m;
      }
      for (const n of nodes) {
        n.vx *= 0.86; n.vy *= 0.86;
        n.vx = Math.max(-6, Math.min(6, n.vx)); n.vy = Math.max(-6, Math.min(6, n.vy));
        n.x += n.vx; n.y += n.vy;
        const pad = n.r + 6; n.x = Math.max(pad, Math.min(W - pad, n.x)); n.y = Math.max(pad, Math.min(H - pad, n.y));
      }
    }

    const cssVar = (v, f) => getComputedStyle(document.documentElement).getPropertyValue(v).trim() || f;
    const activeId = () => pinId || hoverId;
    function relatedSet(id) {
      const set = new Set(); if (!id) return set; set.add(id); const n = byId[id]; if (!n) return set;
      if (n.type === "tech") n.projects.forEach((p) => set.add(p));
      else techs.forEach((t) => { if (t.projects.includes(id)) set.add(t.id); });
      return set;
    }
    function highlight() {
      const act = activeId();
      if (act) return relatedSet(act);
      if (filterCat) { const set = new Set(); techs.forEach((t) => { if (t.cat === filterCat) { set.add(t.id); t.projects.forEach((p) => set.add(p)); } }); return set; }
      return null;
    }

    let flow = 0;
    function draw() {
      flow += 0.6;
      const accent = cssVar("--accent", "#2b50e2");
      const ink = cssVar("--ink", "#16140f"), ink2 = cssVar("--ink-2", "#5a5650"), ink3 = cssVar("--ink-3", "#948e82");
      const line = cssVar("--line-2", "rgba(0,0,0,.2)"), paper = cssVar("--surface", "#fff");
      const act = activeId(), hi = highlight();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      for (const e of edges) {
        const a = byId[e.a], b = byId[e.b];
        const both = hi && hi.has(e.a) && hi.has(e.b);
        const onActive = act && both && (e.a === act || e.b === act);
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
        if (both) { ctx.strokeStyle = byId[e.a].color || accent; ctx.lineWidth = 1.6; ctx.globalAlpha = 0.85; }
        else { ctx.strokeStyle = line; ctx.lineWidth = 1; ctx.globalAlpha = hi ? 0.08 : 0.3; }
        ctx.stroke();
        if (onActive || (both && !act)) {
          const tt = ((flow * 0.012 + (e.a.charCodeAt(1) || 0) * 0.07) % 1);
          const px = a.x + (b.x - a.x) * tt, py = a.y + (b.y - a.y) * tt;
          ctx.globalAlpha = 1; ctx.fillStyle = byId[e.a].color || accent; ctx.beginPath(); ctx.arc(px, py, 2.6, 0, 7); ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      for (const n of nodes) {
        const dim = hi && !hi.has(n.id);
        const isActive = n.id === act;
        const pulse = isActive ? 1 + Math.sin(flow * 0.12) * 0.06 : 1;
        ctx.globalAlpha = dim ? 0.2 : 1;
        if (n.type === "project") {
          if (!dim) { ctx.globalAlpha = 0.25; ctx.fillStyle = accent; ctx.beginPath(); ctx.arc(n.x, n.y, n.r * 1.5, 0, 7); ctx.fill(); ctx.globalAlpha = 1; }
          ctx.beginPath(); ctx.arc(n.x, n.y, n.r * (isActive ? 1.18 : 1) * pulse, 0, 7);
          ctx.fillStyle = accent; ctx.fill();
          ctx.lineWidth = 2; ctx.strokeStyle = paper; ctx.stroke();
          ctx.globalAlpha = dim ? 0.3 : 1; ctx.fillStyle = "#fff"; ctx.font = "600 11px 'JetBrains Mono', monospace"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
          ctx.fillText(String(n.idx + 1).padStart(2, "0"), n.x, n.y);
          ctx.fillStyle = dim ? ink3 : ink; ctx.font = "600 12px 'JetBrains Mono', monospace"; ctx.fillText(n.short, n.x, n.y + n.r + 14);
        } else {
          const col = n.color || ink3;
          if (isActive || (!dim && act && hi && hi.has(n.id))) { ctx.globalAlpha = 0.3; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(n.x, n.y, n.r * 2.4, 0, 7); ctx.fill(); ctx.globalAlpha = 1; }
          ctx.beginPath(); ctx.arc(n.x, n.y, n.r * (isActive ? 1.5 : 1) * pulse, 0, 7);
          ctx.fillStyle = col; ctx.fill();
          ctx.lineWidth = 1.4; ctx.strokeStyle = isActive ? paper : col; ctx.stroke();
          ctx.globalAlpha = dim ? 0.22 : (act && !isActive && hi && hi.has(n.id) ? 1 : (act ? 0.45 : 0.9));
          ctx.fillStyle = isActive ? ink : ink2; ctx.font = (isActive ? "600 " : "") + "11px 'JetBrains Mono', monospace"; ctx.textAlign = "left"; ctx.textBaseline = "middle";
          ctx.fillText(n.label, n.x + n.r + 6, n.y);
        }
        ctx.globalAlpha = 1;
      }
    }

    function loop() { tick(); draw(); raf = requestAnimationFrame(loop); }

    /* ---- side panel ---- */
    const chip = (s) => `<span class="chip">${s}</span>`;
    function defaultPanel() {
      return `<div class="net-default">
        <div class="k">interactive map</div>
        <p>Hover or tap any <span class="accent">technology</span> to trace the projects it powers. Tap a <b>project</b> to light up its full stack — or filter by discipline below.</p>
        <div class="net-legend">
          ${NET_CATS.map((c) => `<button class="net-leg${filterCat === c.key ? " on" : ""}" data-cat="${c.key}"><i style="background:${c.color}"></i>${c.label}</button>`).join("")}
          <span class="net-leg static"><i style="background:var(--accent);border-radius:50%"></i> project</span>
        </div>
      </div>`;
    }
    function nodePanel(n) {
      if (n.type === "tech") {
        const ps = n.projects.map((pid) => byId[pid]).filter(Boolean);
        const cat = NET_CATS.find((c) => c.key === n.cat) || NET_ETC;
        return `<div class="net-detail">
          <div class="k" style="color:${cat.color}">${cat.label}</div>
          <h4>${n.label}</h4>
          <div class="cnt">powers <span class="accent">${ps.length}</span> project${ps.length > 1 ? "s" : ""}</div>
          <ul>${ps.map((p) => `<li><a href="${p.url}" target="_blank" rel="noopener"><span class="live"><i></i></span>${p.label}<span class="ar">↗</span></a></li>`).join("")}</ul>
        </div>`;
      }
      return `<div class="net-detail">
        <div class="k">project</div>
        <h4>${n.label}</h4>
        <div class="cnt">${n.stack.length} technologies</div>
        <div class="net-chips">${n.stack.map(chip).join("")}</div>
        <a class="wi-open" href="${n.url}" target="_blank" rel="noopener" style="margin-top:14px;display:inline-flex;gap:8px;font-family:var(--font-mono);font-size:13px;color:var(--accent)">open ↗</a>
      </div>`;
    }
    function renderPanel() {
      const id = pinId || hoverId;
      const n = id ? byId[id] : null;
      panelEl.innerHTML = n ? nodePanel(n) : defaultPanel();
    }
    panelEl.addEventListener("click", (e) => {
      const b = e.target.closest(".net-leg[data-cat]"); if (!b) return;
      filterCat = filterCat === b.dataset.cat ? null : b.dataset.cat;
      renderPanel();
    });

    /* ---- pointer ---- */
    let tip = $(".net-tip");
    if (!tip) { tip = document.createElement("div"); tip.className = "net-tip"; tip.style.display = "none"; document.body.appendChild(tip); }
    function pick(clientX, clientY) {
      const r = canvas.getBoundingClientRect(); const x = clientX - r.left, y = clientY - r.top;
      let best = null, bestD = 1e9;
      for (const n of nodes) { const d = Math.hypot(n.x - x, n.y - y); const hit = n.r + (n.type === "project" ? 10 : 26); if (d < hit && d < bestD) { bestD = d; best = n; } }
      return best;
    }
    canvas.addEventListener("pointermove", (e) => {
      const n = pick(e.clientX, e.clientY);
      hoverId = n ? n.id : null;
      if (!pinId) renderPanel();
      if (n) {
        tip.innerHTML = `<b>${n.label}</b><span>${n.type === "tech" ? n.projects.length + " project" + (n.projects.length > 1 ? "s" : "") : n.stack.length + " technologies"}</span>`;
        tip.style.display = ""; tip.style.left = e.clientX + "px"; tip.style.top = e.clientY + "px";
      } else tip.style.display = "none";
    });
    canvas.addEventListener("pointerdown", (e) => {
      const n = pick(e.clientX, e.clientY);
      pinId = !n ? null : (pinId === n.id ? null : n.id);
      renderPanel();
    });
    canvas.addEventListener("pointerleave", () => { hoverId = null; tip.style.display = "none"; if (!pinId) renderPanel(); });
    addEventListener("resize", place);

    place();
    for (let i = 0; i < 240; i++) tick();
    renderPanel();
    raf = requestAnimationFrame(loop);
  })();

  /* ---------------- GitHub: live stats + contribution heatmap ---------------- */
  (function github() {
    const band = $("#github");
    if (!band) return;
    const GH_USER = "Th3X-Zohir";
    const LANG_COLORS = {
      JavaScript: "#f1e05a", TypeScript: "#3178c6", Python: "#3572A5", PHP: "#4F5D95",
      HTML: "#e34c26", CSS: "#563d7c", Java: "#b07219", Blade: "#f7523f", Shell: "#89e051",
      Dart: "#00B4AB", "C++": "#f34b7d", C: "#555555", Vue: "#41b883", Go: "#00ADD8",
    };
    const langColor = (l) => LANG_COLORS[l] || "var(--accent)";
    const lvlBg = (l) => (l === 0 ? "var(--line)" : "var(--accent)");
    const lvlOpacity = (l) => [1, 0.34, 0.56, 0.78, 1][l];
    const fmt = (v) => (v === null || v === undefined ? "—" : (typeof v === "number" && v >= 1000 ? (v / 1000).toFixed(1) + "k" : v));
    const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const statusEl = $(".gh-status", band);
    const setStatus = (s) => {
      if (!statusEl) return;
      statusEl.innerHTML = `<i class="${s === "live" ? "ok" : ""}"></i>${s === "live" ? "live · github.com/" + GH_USER : s === "loading" ? "connecting…" : "github.com/" + GH_USER}`;
    };

    let tip = $(".gh-tip");
    if (!tip) { tip = document.createElement("div"); tip.className = "gh-tip"; tip.style.display = "none"; document.body.appendChild(tip); }

    function paintCal(cal) {
      const grid = $(".gh-cal-grid", band), months = $(".gh-months", band), total = $(".gh-contrib b", band);
      if (total && cal.total != null) total.textContent = cal.total.toLocaleString();
      if (months) {
        let lastM = -1; const out = [];
        cal.cells.forEach((c, i) => { const col = Math.floor(i / 7); const m = new Date(c.date + "T00:00").getMonth(); if (m !== lastM && c.wd <= 1) { out.push(`<span style="grid-column:${col + 1}">${MONTHS[m]}</span>`); lastM = m; } });
        months.innerHTML = out.join("");
      }
      if (grid) {
        grid.innerHTML = cal.cells.map((c) => `<i class="gh-cell" style="grid-row:${c.wd + 1};background:${lvlBg(c.level)};opacity:${lvlOpacity(c.level)}" data-c="${c.count} contribution${c.count === 1 ? "" : "s"} · ${c.date}"></i>`).join("");
        grid.addEventListener("mouseover", (e) => {
          const cell = e.target.closest(".gh-cell"); if (!cell) return;
          const r = cell.getBoundingClientRect();
          tip.textContent = cell.dataset.c; tip.style.display = "";
          tip.style.left = (r.left + r.width / 2) + "px"; tip.style.top = r.top + "px";
        });
        grid.addEventListener("mouseleave", () => { tip.style.display = "none"; });
      }
    }

    function paintLangs(langs) {
      const bar = $(".gh-langbar", band), list = $(".gh-langlist", band);
      if (bar) bar.innerHTML = langs.map((l) => `<span style="width:${l.pct}%;background:${langColor(l.k)}" title="${l.k} ${l.pct}%"></span>`).join("");
      if (list) list.innerHTML = langs.map((l) => `<span class="gh-langtag"><i style="background:${langColor(l.k)}"></i>${l.k} <em>${l.pct}%</em></span>`).join("");
    }

    function syntheticCal() {
      const cells = []; const today = new Date();
      for (let i = 363; i >= 0; i--) {
        const d = new Date(today); d.setDate(today.getDate() - i);
        const seed = Math.sin(i * 12.9898) * 43758.5; const r = seed - Math.floor(seed);
        const level = r > 0.8 ? 4 : r > 0.62 ? 3 : r > 0.42 ? 2 : r > 0.2 ? 1 : 0;
        cells.push({ date: d.toISOString().slice(0, 10), count: level * 3, level, wd: d.getDay() });
      }
      return { cells, total: null };
    }

    setStatus("loading");
    (async function load() {
      const [pf, rp, cc] = await Promise.allSettled([
        fetch(`https://api.github.com/users/${GH_USER}`).then((r) => (r.ok ? r.json() : Promise.reject())),
        fetch(`https://api.github.com/users/${GH_USER}/repos?per_page=100&sort=pushed`).then((r) => (r.ok ? r.json() : Promise.reject())),
        fetch(`https://github-contributions-api.jogruber.de/v4/${GH_USER}?y=last`).then((r) => (r.ok ? r.json() : Promise.reject())),
      ]);
      let ok = false;

      if (pf.status === "fulfilled" && pf.value && pf.value.login) {
        const p = pf.value; ok = true;
        const repos = $("[data-gh='repositories'] b", band), fol = $("[data-gh='followers'] b", band);
        if (repos && p.public_repos != null) repos.textContent = fmt(p.public_repos);
        if (fol && p.followers != null) fol.textContent = fmt(p.followers);
      }

      if (rp.status === "fulfilled" && Array.isArray(rp.value)) {
        ok = true;
        const real = rp.value.filter((r) => !r.fork);
        const starEl = $("[data-gh='stars'] b", band);
        if (starEl) starEl.textContent = fmt(real.reduce((s, r) => s + (r.stargazers_count || 0), 0));
        const sm = {}; rp.value.forEach((r) => { sm[r.name.toLowerCase()] = { stars: r.stargazers_count || 0, forks: r.forks_count || 0 }; });
        $$("[data-repo]", band).forEach((el) => {
          const info = sm[el.dataset.repo.toLowerCase()]; if (!info) return;
          const st = $("[data-stars]", el), fk = $("[data-forks]", el);
          if (st) { st.textContent = "★ " + info.stars; st.style.display = ""; }
          if (fk) { if (info.forks > 0) { fk.textContent = "⑂ " + info.forks; fk.style.display = ""; } else fk.remove(); }
        });
        const counts = {}; real.forEach((r) => { if (r.language) counts[r.language] = (counts[r.language] || 0) + 1; });
        const tot = Object.values(counts).reduce((a, b) => a + b, 0);
        if (tot) paintLangs(Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([k, v]) => ({ k, pct: Math.round((v / tot) * 100) })));
      }

      if (cc.status === "fulfilled" && cc.value && cc.value.contributions) {
        ok = true;
        const v = cc.value;
        const total = (v.total && (v.total.lastYear || Object.values(v.total)[0])) || v.contributions.reduce((s, d) => s + d.count, 0);
        paintCal({ cells: v.contributions.map((d) => ({ ...d, wd: new Date(d.date + "T00:00").getDay() })), total });
      } else {
        paintCal(syntheticCal());
      }

      setStatus(ok ? "live" : "fallback");
    })();
  })();
})();
