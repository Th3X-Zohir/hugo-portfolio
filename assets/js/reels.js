/* PROJECT REELS — multi-scene animated canvas mockups.
   Drawing code is the original v3 engine, verbatim; only the React wrapper
   was replaced by the vanilla initializer at the bottom of this file. */
(function () {
/* ============================================================
   PROJECT REELS — detailed multi-scene animated mockups (canvas + rAF).
   Each project plays a 4-scene mini-walkthrough of its real flow.
============================================================ */

/* ---- small canvas-draw helpers, bound per frame via `g` ---- */
function makeHelpers(ctx) {
  const rr = (x, y, w, h, r) => { r = Math.max(0, Math.min(r, w / 2, h / 2)); ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); };
  const T = (s, x, y, sz, col, align = "left", weight = 400, fam = "m") => { ctx.fillStyle = col; ctx.textAlign = align; ctx.textBaseline = "alphabetic"; ctx.font = `${weight !== 400 ? weight + " " : ""}${sz}px ${fam === "d" ? "'Bricolage Grotesque',system-ui,sans-serif" : "'JetBrains Mono',ui-monospace,monospace"}`; ctx.fillText(s, x, y); };
  const dot = (x, y, r, col) => { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); };
  return { rr, T, dot };
}

/* dispatch table */
const REEL_DRAW = {};

/* scene controller: returns body region + slide + sets dots */
function scenes(g, n, dur) {
  const tt = g.t % (n * dur), idx = Math.floor(tt / dur), lo = tt % dur;
  g._N = n; g._idx = idx;
  const sl = (1 - g.easeIO(g.clamp(lo / 0.45, 0, 1))) * g.w * 0.1;
  return { idx, lo, sl };
}
function bodyClip(g, x, y, w, h) { g.ctx.save(); g.ctx.beginPath(); g.rr(x, y, w, h, 6); g.ctx.clip(); }

/* ============================================================
   1 · E-FAMILY COURT — national e-judiciary case filing
============================================================ */
REEL_DRAW.court = function (g) {
  const { ctx, w, h, t, PAD, A, INK, INK2, INK3, LINE, SURF, green, amber, T, rr, dot, clamp, ease } = g;
  // gov header (persistent)
  ctx.fillStyle = A; rr(PAD, PAD, w - 2 * PAD, h * 0.135, 5); ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,.7)"; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(PAD + 14, PAD + h * 0.067, 6, 0, 7); ctx.stroke();
  T("E-FAMILY COURT", PAD + 26, PAD + h * 0.092, Math.round(w * 0.034), "#fff", "left", 600);
  T("CASE BFC-2025-0142", w - PAD - 8, PAD + h * 0.092, Math.round(w * 0.026), "rgba(255,255,255,.85)", "right");
  const { idx, lo, sl } = scenes(g, 4, 2.3);
  const bx = PAD, by = PAD + h * 0.18, bw = w - 2 * PAD, bh = h - by - h * 0.1;
  ctx.save(); ctx.translate(sl, 0);
  if (idx === 0) { // filing form
    T("// new case — family court, dhaka", bx, by + h * 0.04, Math.round(w * 0.026), INK3);
    const fields = ["Case type · Maintenance", "Petitioner · Ayesha R.", "Respondent · Karim H.", "District · Dhaka"];
    fields.forEach((f, i) => { const fy = by + h * 0.12 + i * h * 0.17; ctx.fillStyle = SURF; ctx.strokeStyle = LINE; ctx.lineWidth = 1; rr(bx, fy, bw, h * 0.13, 4); ctx.fill(); ctx.stroke();
      const p = clamp((lo - i * 0.28) / 0.5, 0, 1); ctx.save(); ctx.beginPath(); rr(bx, fy, bw, h * 0.13, 4); ctx.clip();
      T(f, bx + 8, fy + h * 0.088, Math.round(w * 0.03), p > 0.05 ? INK : INK3); if (p < 1 && p > 0) dot(bx + 8 + ctx.measureText(f).width + 3, fy + h * 0.065, 1.5, A); ctx.restore(); });
  } else if (idx === 1) { // document upload + submit
    T("// attach documents", bx, by + h * 0.04, Math.round(w * 0.026), INK3);
    const docs = ["nid_petitioner.pdf", "marriage_cert.pdf", "affidavit.pdf"];
    docs.forEach((d, i) => { const fy = by + h * 0.12 + i * h * 0.15; const p = clamp((lo - 0.2 - i * 0.3) / 0.4, 0, 1);
      ctx.fillStyle = SURF; ctx.strokeStyle = LINE; rr(bx, fy, bw, h * 0.12, 4); ctx.fill(); ctx.stroke();
      ctx.fillStyle = A; rr(bx + 7, fy + h * 0.03, h * 0.06, h * 0.06, 2); ctx.fill();
      T(d, bx + 7 + h * 0.09, fy + h * 0.082, Math.round(w * 0.028), INK);
      if (p >= 1) { dot(bx + bw - 12, fy + h * 0.06, 6, green); ctx.strokeStyle = "#fff"; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(bx + bw - 15, fy + h * 0.06); ctx.lineTo(bx + bw - 13, fy + h * 0.078); ctx.lineTo(bx + bw - 9, fy + h * 0.042); ctx.stroke(); }
      else { ctx.strokeStyle = LINE; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(bx + bw - 12, fy + h * 0.06, 6, 0, 7 * p); ctx.stroke(); } });
    const sp = clamp((lo - 1.4) / 0.5, 0, 1); ctx.fillStyle = sp > 0 ? A : LINE; rr(bx, by + bh - h * 0.02, bw, h * 0.13, 4); ctx.fill();
    T(sp >= 1 ? "SUBMITTED ✓" : "SUBMIT FILING", w / 2, by + bh + h * 0.065, Math.round(w * 0.03), "#fff", "center", 600);
  } else if (idx === 2) { // payment
    T("// secure court fee payment", bx, by + h * 0.04, Math.round(w * 0.026), INK3);
    ctx.fillStyle = SURF; ctx.strokeStyle = LINE; rr(bx, by + h * 0.1, bw, h * 0.34, 6); ctx.fill(); ctx.stroke();
    T("Court fee", bx + 10, by + h * 0.2, Math.round(w * 0.028), INK3);
    T("৳ 1,200", bx + 10, by + h * 0.33, Math.round(w * 0.075), INK, "left", 700, "d");
    const pay = clamp((lo - 0.8) / 1, 0, 1); const done = lo > 1.9;
    T("via bKash", bx + bw - 10, by + h * 0.2, Math.round(w * 0.026), A, "right");
    ctx.fillStyle = done ? green : A; rr(bx, by + h * 0.5, bw, h * 0.12, 4); ctx.fill();
    T(done ? "PAYMENT CONFIRMED ✓" : "PROCESSING…", w / 2, by + h * 0.585, Math.round(w * 0.03), "#fff", "center", 600);
    if (!done) { ctx.strokeStyle = "rgba(255,255,255,.5)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(bx + 16, by + h * 0.56, 6, t * 5, t * 5 + 4); ctx.stroke(); }
  } else { // case status pipeline + judge
    T("// case status — live", bx, by + h * 0.04, Math.round(w * 0.026), INK3);
    const steps = ["Filed", "Verified", "Hearing", "Order"]; const prog = clamp(lo / 1.6, 0, 1) * (steps.length - 1);
    const sy = by + h * 0.2, sx = bx + 6, gap = (bw - 12) / (steps.length - 1);
    ctx.strokeStyle = LINE; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + gap * 3, sy); ctx.stroke();
    ctx.strokeStyle = A; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + gap * clamp(prog, 0, 3), sy); ctx.stroke();
    steps.forEach((s, i) => { const on = prog >= i - 0.1; const cx = sx + gap * i; dot(cx, sy, 8, on ? A : SURF); if (!on) { ctx.strokeStyle = LINE; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, sy, 8, 0, 7); ctx.stroke(); }
      if (on) { ctx.strokeStyle = "#fff"; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(cx - 3, sy); ctx.lineTo(cx - 1, sy + 2.5); ctx.lineTo(cx + 3.5, sy - 3); ctx.stroke(); }
      T(s, cx, sy + h * 0.11, Math.round(w * 0.024), on ? INK : INK3, "center"); });
    // hearing card
    ctx.fillStyle = SURF; ctx.strokeStyle = LINE; rr(bx, by + h * 0.42, bw, h * 0.26, 5); ctx.fill(); ctx.stroke();
    dot(bx + 16, by + h * 0.55, 9, A); T("⚖", bx + 16, by + h * 0.585, Math.round(w * 0.03), "#fff", "center");
    T("Hearing scheduled", bx + 32, by + h * 0.51, Math.round(w * 0.028), INK, "left", 600);
    T("12 Jun 2025 · Court 4 · Judge Rahman", bx + 32, by + h * 0.61, Math.round(w * 0.024), INK3);
  }
  ctx.restore();
};

/* ============================================================
   2 · ROUTINE SCRAPPER — university routine automation
============================================================ */
REEL_DRAW.schedule = function (g) {
  const { ctx, w, h, t, PAD, A, INK, INK2, INK3, LINE, SURF, green, T, rr, dot, clamp, ease } = g;
  T("ROUTINE SCRAPPER", PAD, PAD + h * 0.06, Math.round(w * 0.032), INK, "left", 700, "d");
  dot(w - PAD - 6, PAD + h * 0.04, 4, green); T("live", w - PAD - 14, PAD + h * 0.055, Math.round(w * 0.024), green, "right");
  const { idx, lo, sl } = scenes(g, 4, 2.2);
  const bx = PAD, by = PAD + h * 0.13, bw = w - 2 * PAD, bh = h - by - h * 0.1;
  ctx.save(); ctx.translate(sl, 0);
  if (idx === 0) { // scraping logs
    T("$ scrape diu.edu.bd/routine", bx, by + h * 0.1, Math.round(w * 0.028), A);
    const logs = ["→ fetching routine.pdf …", "→ parsing 1,240 rows", "→ matching CSE batches", "→ building schedule db ✓"];
    logs.forEach((l, i) => { const p = clamp((lo - 0.2 - i * 0.35) / 0.3, 0, 1); if (p <= 0) return; ctx.globalAlpha = p; T(l, bx, by + h * 0.26 + i * h * 0.14, Math.round(w * 0.027), i === 3 ? green : INK2); ctx.globalAlpha = 1; });
    const pb = clamp(lo / 1.8, 0, 1); ctx.fillStyle = LINE; rr(bx, by + bh - h * 0.04, bw, 6, 3); ctx.fill(); ctx.fillStyle = A; rr(bx, by + bh - h * 0.04, bw * pb, 6, 3); ctx.fill();
  } else if (idx === 1 || idx === 2) { // timetable grid
    const tabs = ["Batch", "Teacher", "Room"]; tabs.forEach((tb, i) => { const tw = bw / 3; const on = i === (idx === 1 ? 0 : 2); ctx.fillStyle = on ? A : SURF; ctx.strokeStyle = LINE; rr(bx + i * tw, by, tw - 4, h * 0.1, 3); ctx.fill(); if (!on) ctx.stroke(); T(tb, bx + i * tw + (tw - 4) / 2, by + h * 0.066, Math.round(w * 0.026), on ? "#fff" : INK2, "center"); });
    const gy = by + h * 0.14, cols = 5, rows = 4, cw = bw / cols, ch = (bh - h * 0.14) / rows;
    const codes = ["CSE321", "MAT203", "PHY101", "ENG102", "CSE412", "EEE201"]; const total = cols * rows; const filled = Math.floor(clamp(lo / 1.6, 0, 1) * total);
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const i = r * cols + c; const x = bx + c * cw, y = gy + r * ch; ctx.strokeStyle = LINE; ctx.lineWidth = 1; ctx.strokeRect(x + 1, y + 1, cw - 2, ch - 2);
      if (i < filled) { const sd = Math.sin(i * 17.3) * 1000, v = sd - Math.floor(sd); if (v > 0.45) { ctx.fillStyle = v > 0.8 ? A : SURF; ctx.strokeStyle = v > 0.8 ? A : LINE; rr(x + 2, y + 2, cw - 4, ch - 4, 2); ctx.fill(); if (v <= 0.8) ctx.stroke(); T(codes[i % codes.length], x + cw / 2, y + ch / 2 + 3, Math.round(w * 0.018), v > 0.8 ? "#fff" : INK2, "center"); } } }
    const scanY = gy + ((t * 70) % ((bh - h * 0.14))); ctx.strokeStyle = A; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.5; ctx.beginPath(); ctx.moveTo(bx, scanY); ctx.lineTo(bx + bw, scanY); ctx.stroke(); ctx.globalAlpha = 1;
  } else { // room booking + push
    T("// real-time room booking", bx, by + h * 0.08, Math.round(w * 0.026), INK3);
    const rooms = ["504", "601", "AB-2", "Lab-3"]; rooms.forEach((rm, i) => { const ry = by + h * 0.16 + i * h * 0.15; const booked = lo > 0.6 + i * 0.25; ctx.fillStyle = SURF; ctx.strokeStyle = booked ? green : LINE; ctx.lineWidth = 1; rr(bx, ry, bw, h * 0.12, 4); ctx.fill(); ctx.stroke();
      T("Room " + rm, bx + 10, ry + h * 0.078, Math.round(w * 0.028), INK); dot(bx + bw - 14, ry + h * 0.06, 5, booked ? green : LINE); T(booked ? "booked" : "free", bx + bw - 26, ry + h * 0.082, Math.round(w * 0.024), booked ? green : INK3, "right"); });
    if (lo > 1.7) { ctx.fillStyle = INK; rr(bx, by + bh - h * 0.04, bw, h * 0.13, 5); ctx.fill(); dot(bx + 14, by + bh + h * 0.025, 4, A); T("Class moved → Room 504", bx + 26, by + bh + h * 0.045, Math.round(w * 0.026), "#fff"); }
  }
  ctx.restore();
};

/* ============================================================
   3 · STUDENT HUB — official student services platform
============================================================ */
REEL_DRAW.dashboard = function (g) {
  const { ctx, w, h, t, PAD, A, INK, INK2, INK3, LINE, SURF, green, T, rr, dot, clamp, ease, easeIO } = g;
  // sidebar
  const sbw = w * 0.22; ctx.fillStyle = SURF; ctx.strokeStyle = LINE; rr(PAD, PAD, sbw, h - 2 * PAD - h * 0.06, 5); ctx.fill(); ctx.stroke();
  const nav = ["▦", "◎", "✎", "⚑"]; const { idx, lo, sl } = scenes(g, 4, 2.2);
  nav.forEach((nv, i) => { const ny = PAD + h * 0.1 + i * h * 0.18; if (i === idx) { ctx.fillStyle = A; rr(PAD + 5, ny - h * 0.06, sbw - 10, h * 0.13, 3); ctx.fill(); } T(nv, PAD + sbw / 2, ny + h * 0.02, Math.round(w * 0.035), i === idx ? "#fff" : INK3, "center"); });
  const bx = PAD + sbw + 8, by = PAD, bw = w - bx - PAD, bh = h - 2 * PAD - h * 0.06;
  ctx.save(); ctx.translate(sl, 0);
  if (idx === 0) { // overview stats
    const stats = [["Students", 1240], ["Clubs", 38], ["Events", 12]]; const cw = (bw - 12) / 3;
    stats.forEach((s, i) => { const x = bx + i * (cw + 6); ctx.fillStyle = SURF; ctx.strokeStyle = LINE; rr(x, by, cw, h * 0.34, 5); ctx.fill(); ctx.stroke();
      const p = easeIO(clamp(lo / 1.4, 0, 1)); T(Math.round(s[1] * p).toLocaleString(), x + 8, by + h * 0.2, Math.round(w * 0.05), A, "left", 700, "d"); T(s[0], x + 8, by + h * 0.29, Math.round(w * 0.022), INK3); });
    for (let i = 0; i < 3; i++) { const p = clamp((lo - 0.4 - i * 0.3) / 0.4, 0, 1); if (p <= 0) continue; const y = by + h * 0.42 + i * h * 0.16; ctx.globalAlpha = p; ctx.fillStyle = SURF; ctx.strokeStyle = LINE; rr(bx, y, bw, h * 0.12, 4); ctx.fill(); ctx.stroke(); dot(bx + 14, y + h * 0.06, 5, green); ctx.fillStyle = LINE; rr(bx + 26, y + h * 0.04, bw * 0.45, 5, 2); ctx.fill(); T("active", bx + bw - 10, y + h * 0.08, Math.round(w * 0.022), green, "right"); ctx.globalAlpha = 1; }
  } else if (idx === 1) { // orientation food token (QR)
    T("Orientation · Food Token", bx, by + h * 0.08, Math.round(w * 0.03), INK, "left", 600);
    const qs = w * 0.26, qx = bx + bw / 2 - qs / 2, qy = by + h * 0.16; ctx.fillStyle = SURF; ctx.strokeStyle = LINE; rr(qx - 8, qy - 8, qs + 16, qs + 16, 6); ctx.fill(); ctx.stroke();
    ctx.fillStyle = INK; const cells = 7, cs = qs / cells; for (let r = 0; r < cells; r++) for (let c = 0; c < cells; c++) { const sd = Math.sin((r * 7 + c) * 12.9 + Math.floor(t)) * 1000; if ((sd - Math.floor(sd)) > 0.5 || r < 1 || c < 1 || r > 5 || c > 5) ctx.fillRect(qx + c * cs, qy + r * cs, cs - 1, cs - 1); }
    if (lo > 1.2) { dot(bx + bw / 2, qy + qs + h * 0.12, 8, green); ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(bx + bw / 2 - 4, qy + qs + h * 0.12); ctx.lineTo(bx + bw / 2 - 1, qy + qs + h * 0.14); ctx.lineTo(bx + bw / 2 + 4, qy + qs + h * 0.1); ctx.stroke(); T("Token #A-114 issued", bx + bw / 2 + 16, qy + qs + h * 0.135, Math.round(w * 0.026), green, "left"); }
  } else if (idx === 2) { // club panel
    T("Club Management · Robotics", bx, by + h * 0.08, Math.round(w * 0.028), INK, "left", 600);
    const rows = ["Issue certificate", "Collect dues ৳500", "Approve member", "Fund report"]; rows.forEach((r, i) => { const y = by + h * 0.16 + i * h * 0.16; const done = lo > 0.5 + i * 0.35; ctx.fillStyle = SURF; ctx.strokeStyle = LINE; rr(bx, y, bw, h * 0.12, 4); ctx.fill(); ctx.stroke(); T(r, bx + 10, y + h * 0.078, Math.round(w * 0.026), INK); if (done) { dot(bx + bw - 13, y + h * 0.06, 5.5, green); ctx.strokeStyle = "#fff"; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(bx + bw - 16, y + h * 0.06); ctx.lineTo(bx + bw - 13.5, y + h * 0.078); ctx.lineTo(bx + bw - 10, y + h * 0.042); ctx.stroke(); } });
  } else { // enrollment sync
    T("Course Enrollment · sync GoEdu", bx, by + h * 0.08, Math.round(w * 0.026), INK, "left", 600);
    ctx.strokeStyle = A; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(bx + bw / 2, by + h * 0.26, h * 0.07, t * 4, t * 4 + 4.6); ctx.stroke();
    T("syncing…", bx + bw / 2, by + h * 0.4, Math.round(w * 0.026), INK3, "center");
    const courses = ["CSE321 · enrolled", "CSE412 · enrolled", "MAT203 · enrolled"]; courses.forEach((c, i) => { const p = clamp((lo - 0.7 - i * 0.35) / 0.3, 0, 1); if (p <= 0) return; const y = by + h * 0.5 + i * h * 0.15; ctx.globalAlpha = p; ctx.fillStyle = SURF; ctx.strokeStyle = LINE; rr(bx, y, bw, h * 0.12, 4); ctx.fill(); ctx.stroke(); dot(bx + 13, y + h * 0.06, 4.5, green); T(c, bx + 26, y + h * 0.08, Math.round(w * 0.024), INK); ctx.globalAlpha = 1; });
  }
  ctx.restore();
};

/* ============================================================
   4 · BLOOD BRIDGE — real-time donor finder
============================================================ */
REEL_DRAW.map = function (g) {
  const { ctx, w, h, t, PAD, A, INK, INK2, INK3, LINE, SURF, PAPER, green, red, T, rr, dot, clamp, ease } = g;
  const { idx, lo, sl } = scenes(g, 4, 2.2);
  // search bar (persistent)
  ctx.fillStyle = SURF; ctx.strokeStyle = LINE; rr(PAD, PAD, w - 2 * PAD, h * 0.13, 20); ctx.fill(); ctx.stroke();
  dot(PAD + 14, PAD + h * 0.065, 4, red);
  const q = "Find O+ donors · 5 km"; T(idx === 0 ? q.slice(0, Math.max(0, Math.floor(lo * 14))) : q, PAD + 26, PAD + h * 0.088, Math.round(w * 0.028), INK);
  const mx = PAD, my = PAD + h * 0.17, mw = w - 2 * PAD, mh = h - my - h * 0.1;
  bodyClip(g, mx, my, mw, mh);
  ctx.fillStyle = PAPER; ctx.fillRect(mx, my, mw, mh);
  ctx.strokeStyle = LINE; ctx.lineWidth = 5; for (let i = 1; i < 4; i++) { ctx.beginPath(); ctx.moveTo(mx, my + mh * i / 4); ctx.lineTo(mx + mw, my + mh * i / 4); ctx.stroke(); } for (let i = 1; i < 5; i++) { ctx.beginPath(); ctx.moveTo(mx + mw * i / 5, my); ctx.lineTo(mx + mw * i / 5, my + mh); ctx.stroke(); }
  const cx = mx + mw / 2, cy = my + mh / 2;
  const pins = [[0.22, 0.3, "A+"], [0.72, 0.28, "O+"], [0.78, 0.7, "O+"], [0.3, 0.72, "B+"]];
  if (idx >= 1) { const pr = (t % 2.4) / 2.4; ctx.strokeStyle = A; ctx.globalAlpha = 1 - pr; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, pr * mw * 0.5, 0, 7); ctx.stroke(); ctx.globalAlpha = 1; }
  pins.forEach((p, i) => { const appear = idx === 1 ? clamp((lo - i * 0.25) / 0.3, 0, 1) : 1; if (appear <= 0) return; const x = mx + mw * p[0], y = my + mh * p[1]; const s = ease(appear);
    ctx.fillStyle = p[2] === "O+" ? A : red; ctx.beginPath(); ctx.moveTo(x, y + 6 * s); ctx.arc(x, y - 4 * s, 6 * s, 0.15 * Math.PI, 0.85 * Math.PI, true); ctx.closePath(); ctx.fill(); dot(x, y - 5 * s, 2.2 * s, "#fff"); });
  if (idx === 2 || idx === 3) { const tx = mx + mw * 0.72, ty = my + mh * 0.28; const rp = clamp(lo / 1, 0, 1); ctx.strokeStyle = A; ctx.lineWidth = 2.4; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + (tx - cx) * ease(rp), cy + (ty - cy) * ease(rp)); ctx.stroke(); ctx.setLineDash([]); }
  dot(cx, cy, 5, A); ctx.strokeStyle = "#fff"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx, cy, 5, 0, 7); ctx.stroke();
  ctx.restore();
  // overlays per scene
  if (idx === 0) { const chips = ["A+", "B+", "O+", "AB+"]; chips.forEach((c, i) => { const cwd = w * 0.12; const x = mx + 6 + i * (cwd + 4); ctx.fillStyle = c === "O+" ? A : SURF; ctx.strokeStyle = c === "O+" ? A : LINE; rr(x, my + 6, cwd, h * 0.1, 10); ctx.fill(); if (c !== "O+") ctx.stroke(); T(c, x + cwd / 2, my + h * 0.072, Math.round(w * 0.024), c === "O+" ? "#fff" : INK2, "center"); }); }
  if (idx === 3) { // ETA + donor card + urgent feed
    ctx.fillStyle = INK; rr(mx + 8, my + mh - h * 0.2, mw - 16, h * 0.17, 6); ctx.fill();
    dot(mx + 24, my + mh - h * 0.115, 11, A); T("O+", mx + 24, my + mh - h * 0.1, Math.round(w * 0.022), "#fff", "center", 600);
    T("Rahim · O+ donor", mx + 42, my + mh - h * 0.14, Math.round(w * 0.026), "#fff", "left", 600);
    T("2.1 km · ETA 8 min", mx + 42, my + mh - h * 0.075, Math.round(w * 0.024), "rgba(255,255,255,.7)");
    T("REQUEST →", mx + mw - 16, my + mh - h * 0.1, Math.round(w * 0.024), A, "right", 600);
  }
};

/* ============================================================
   5 · CORTEX — self-hosted OpenAI-compatible AI gateway
============================================================ */
REEL_DRAW.ai = function (g) {
  const { ctx, w, h, t, PAD, A, INK, INK2, INK3, LINE, SURF, green, T, rr, dot, clamp, ease, easeIO } = g;
  T("CORTEX", PAD, PAD + h * 0.06, Math.round(w * 0.032), INK, "left", 700, "d");
  T("AI GATEWAY", w - PAD, PAD + h * 0.055, Math.round(w * 0.024), INK3, "right");
  const { idx, lo, sl } = scenes(g, 4, 2.2);
  const bx = PAD, by = PAD + h * 0.13, bw = w - 2 * PAD, bh = h - by - h * 0.1;
  ctx.save(); ctx.translate(sl, 0);
  if (idx === 0) { // incoming request
    T("// incoming request", bx, by + h * 0.06, Math.round(w * 0.026), INK3);
    ctx.fillStyle = "#0e1220"; rr(bx, by + h * 0.12, bw, bh - h * 0.1, 6); ctx.fill();
    const lines = ["POST /v1/chat/completions", '{ "model": "gpt-4o",', '  "messages": [...],', '  "stream": true }'];
    lines.forEach((l, i) => { const p = clamp((lo - 0.2 - i * 0.3) / 0.25, 0, 1); if (p <= 0) return; const shown = l.slice(0, Math.floor(l.length * p)); T(shown, bx + 12, by + h * 0.26 + i * h * 0.16, Math.round(w * 0.026), i === 0 ? A : "#9fe7b8"); });
  } else if (idx === 1) { // multi-account routing
    T("// multi-account routing", bx, by + h * 0.06, Math.round(w * 0.026), INK3);
    ctx.fillStyle = A; rr(bx + bw / 2 - w * 0.13, by + h * 0.14, w * 0.26, h * 0.16, 6); ctx.fill(); T("GATEWAY", bx + bw / 2, by + h * 0.245, Math.round(w * 0.028), "#fff", "center", 600);
    const accts = ["acct·A", "acct·B", "acct·C"]; const pick = Math.floor(t) % 3; accts.forEach((a, i) => { const x = bx + i * (bw / 3) + bw / 6; const y = by + h * 0.55; const on = i === pick; ctx.strokeStyle = on ? A : LINE; ctx.lineWidth = on ? 2 : 1; ctx.beginPath(); ctx.moveTo(bx + bw / 2, by + h * 0.3); ctx.lineTo(x, y - h * 0.07); ctx.stroke(); dot(x, y, 11, on ? A : SURF); if (!on) { ctx.strokeStyle = LINE; ctx.beginPath(); ctx.arc(x, y, 11, 0, 7); ctx.stroke(); } T("◉", x, y + h * 0.02, Math.round(w * 0.026), on ? "#fff" : INK3, "center"); T(a, x, y + h * 0.13, Math.round(w * 0.022), on ? INK : INK3, "center"); }); T("ChatGPT accounts · load-balanced", bx + bw / 2, by + bh + h * 0.02, Math.round(w * 0.022), INK3, "center");
  } else if (idx === 2) { // providers + token stream
    const provs = [["GPT-4o", A], ["Claude", "#c96442"], ["Llama", green]]; const on = Math.floor(t) % 3;
    provs.forEach((p, i) => { const y = by + h * 0.1 + i * h * 0.18; const act = i === on; ctx.fillStyle = SURF; ctx.strokeStyle = act ? p[1] : LINE; ctx.lineWidth = act ? 2 : 1; rr(bx, y, bw * 0.42, h * 0.14, 5); ctx.fill(); ctx.stroke(); dot(bx + 14, y + h * 0.07, 4, p[1]); T(p[0], bx + 26, y + h * 0.092, Math.round(w * 0.026), INK); });
    // token stream
    ctx.fillStyle = "#0e1220"; rr(bx + bw * 0.46, by + h * 0.1, bw * 0.54, bh - h * 0.06, 5); ctx.fill();
    const reply = "Hello! I can help with that…"; const shown = reply.slice(0, Math.floor((lo * 16) % (reply.length + 4)));
    T("streaming ▌", bx + bw * 0.46 + 8, by + h * 0.2, Math.round(w * 0.022), INK3);
    T(shown, bx + bw * 0.46 + 8, by + h * 0.33, Math.round(w * 0.024), "#9fe7b8");
  } else { // admin metrics
    T("// admin · observability", bx, by + h * 0.06, Math.round(w * 0.026), INK3);
    const stats = [["req/s", String(40 + Math.floor((t * 7) % 30))], ["uptime", "99.9%"]]; const cw = (bw - 8) / 2;
    stats.forEach((s, i) => { const x = bx + i * (cw + 8); ctx.fillStyle = SURF; ctx.strokeStyle = LINE; rr(x, by + h * 0.12, cw, h * 0.2, 5); ctx.fill(); ctx.stroke(); T(s[1], x + 8, by + h * 0.255, Math.round(w * 0.04), A, "left", 700, "d"); T(s[0], x + 8, by + h * 0.31, Math.round(w * 0.02), INK3); });
    T("quota", bx, by + h * 0.42, Math.round(w * 0.022), INK3); const qp = 0.4 + 0.3 * (0.5 + 0.5 * Math.sin(t)); ctx.fillStyle = LINE; rr(bx, by + h * 0.45, bw, 7, 3); ctx.fill(); ctx.fillStyle = A; rr(bx, by + h * 0.45, bw * qp, 7, 3); ctx.fill();
    for (let i = 0; i < 2; i++) { const y = by + h * 0.56 + i * h * 0.12; T(["200 · gpt-4o · 412ms", "200 · claude · 388ms"][i], bx, y, Math.round(w * 0.022), INK2); dot(bx + bw - 6, y - h * 0.02, 3, green); }
    T("noVNC · 3 provider sessions", bx, by + bh + h * 0.02, Math.round(w * 0.022), INK3);
  }
  ctx.restore();
};

/* ============================================================
   6 · ECOMAI — multi-tenant SaaS e-commerce
============================================================ */
REEL_DRAW.shop = function (g) {
  const { ctx, w, h, t, PAD, A, INK, INK2, INK3, LINE, SURF, green, T, rr, dot, clamp, ease, easeIO } = g;
  T("ECOMAI", PAD, PAD + h * 0.06, Math.round(w * 0.032), INK, "left", 700, "d");
  T("SAAS COMMERCE", w - PAD, PAD + h * 0.055, Math.round(w * 0.024), INK3, "right");
  const { idx, lo, sl } = scenes(g, 4, 2.2);
  const bx = PAD, by = PAD + h * 0.13, bw = w - 2 * PAD, bh = h - by - h * 0.1;
  ctx.save(); ctx.translate(sl, 0);
  if (idx === 0) { // pick plan
    T("// merchant signup · choose plan", bx, by + h * 0.06, Math.round(w * 0.026), INK3);
    const plans = [["Free", "৳0"], ["Pro", "৳990"], ["Business", "৳2.9k"]]; const sel = 1; const cw = (bw - 12) / 3;
    plans.forEach((p, i) => { const x = bx + i * (cw + 6); const on = i === sel && lo > 0.5; ctx.fillStyle = SURF; ctx.strokeStyle = on ? A : LINE; ctx.lineWidth = on ? 2 : 1; rr(x, by + h * 0.14, cw, h * 0.42, 6); ctx.fill(); ctx.stroke(); T(p[0], x + cw / 2, by + h * 0.27, Math.round(w * 0.026), on ? A : INK, "center", 600); T(p[1], x + cw / 2, by + h * 0.4, Math.round(w * 0.034), INK, "center", 700, "d"); if (on) { dot(x + cw - 12, by + h * 0.17, 5, A); } });
    if (lo > 1.4) T("→ store created · shop.ecomai.io", bx, by + bh + h * 0.02, Math.round(w * 0.024), green);
  } else if (idx === 1 || idx === 2) { // storefront + cart
    T("shop.ecomai.io", bx, by + h * 0.07, Math.round(w * 0.026), INK2);
    const cart = idx === 1 ? Math.min(3, Math.floor(lo / 0.6)) : 3; dot(bx + bw - 16, by + h * 0.04, 9, A); T(String(cart), bx + bw - 16, by + h * 0.072, Math.round(w * 0.024), "#fff", "center", 600);
    const prods = [["Tee", "৳450"], ["Mug", "৳300"], ["Cap", "৳520"]]; const cw = (bw - 12) / 3;
    prods.forEach((p, i) => { const x = bx + i * (cw + 6); const popping = idx === 1 && i === Math.floor(lo / 0.6) % 3; ctx.fillStyle = SURF; ctx.strokeStyle = popping ? A : LINE; ctx.lineWidth = popping ? 2 : 1; rr(x, by + h * 0.13, cw, h * 0.36, 5); ctx.fill(); ctx.stroke(); ctx.fillStyle = popping ? A : LINE; ctx.globalAlpha = popping ? 0.3 : 1; rr(x + 6, by + h * 0.17, cw - 12, h * 0.16, 3); ctx.fill(); ctx.globalAlpha = 1; T(p[0], x + 8, by + h * 0.4, Math.round(w * 0.024), INK); T(p[1], x + cw - 8, by + h * 0.4, Math.round(w * 0.024), A, "right", 600); });
    if (idx === 2) { const done = lo > 1.4; ctx.fillStyle = done ? green : A; rr(bx, by + h * 0.56, bw, h * 0.13, 4); ctx.fill(); T(done ? "ORDER #1042 PLACED ✓" : "CHECKOUT · ৳1,250", w / 2, by + h * 0.645, Math.round(w * 0.028), "#fff", "center", 600); }
    else { T("tap to add → cart", bx, by + bh + h * 0.02, Math.round(w * 0.022), INK3); }
  } else { // admin revenue
    T("// admin · revenue (7d)", bx, by + h * 0.06, Math.round(w * 0.026), INK3);
    const bars = 7, gw = bw / bars; for (let i = 0; i < bars; i++) { const sd = Math.sin(i * 3.1) * 1000, v = 0.35 + (sd - Math.floor(sd)) * 0.6; const bp = ease(clamp((lo - i * 0.08) / 0.6, 0, 1)); const bh2 = (bh * 0.55) * v * bp; ctx.fillStyle = i === bars - 1 ? A : LINE; rr(bx + i * gw + 3, by + h * 0.6 - bh2, gw - 6, bh2, 2); ctx.fill(); }
    T("৳ 84,200", bx, by + h * 0.2, Math.round(w * 0.055), INK, "left", 700, "d"); T("+18% this week", bx, by + h * 0.28, Math.round(w * 0.024), green);
  }
  ctx.restore();
};

/* ============================================================
   7 · LINKPAY BD — freelancer payment links
============================================================ */
REEL_DRAW.pay = function (g) {
  const { ctx, w, h, t, PAD, A, INK, INK2, INK3, LINE, SURF, green, T, rr, dot, clamp, ease } = g;
  T("LINKPAY BD", PAD, PAD + h * 0.06, Math.round(w * 0.032), INK, "left", 700, "d");
  T("PAYMENT LINKS", w - PAD, PAD + h * 0.055, Math.round(w * 0.024), INK3, "right");
  const { idx, lo, sl } = scenes(g, 4, 2.2);
  const bx = PAD, by = PAD + h * 0.13, bw = w - 2 * PAD, bh = h - by - h * 0.1;
  ctx.save(); ctx.translate(sl, 0);
  if (idx === 0) { // create link
    T("// create payment link", bx, by + h * 0.06, Math.round(w * 0.026), INK3);
    ctx.fillStyle = SURF; ctx.strokeStyle = LINE; rr(bx, by + h * 0.12, bw, h * 0.22, 5); ctx.fill(); ctx.stroke(); T("Amount", bx + 10, by + h * 0.21, Math.round(w * 0.024), INK3);
    const amt = "$ 250.00".slice(0, Math.max(0, Math.floor(lo * 6))); T(amt || "$ ", bx + 10, by + h * 0.31, Math.round(w * 0.055), INK, "left", 700, "d");
    ctx.fillStyle = SURF; ctx.strokeStyle = LINE; rr(bx, by + h * 0.38, bw, h * 0.16, 5); ctx.fill(); ctx.stroke(); T("For · Logo design — final", bx + 10, by + h * 0.475, Math.round(w * 0.024), lo > 1 ? INK : INK3);
    if (lo > 1.5) { ctx.fillStyle = A; rr(bx, by + h * 0.58, bw, h * 0.12, 4); ctx.fill(); T("GENERATE LINK", w / 2, by + h * 0.66, Math.round(w * 0.026), "#fff", "center", 600); }
  } else if (idx === 1) { // link card
    T("// link ready · share", bx, by + h * 0.06, Math.round(w * 0.026), INK3);
    ctx.fillStyle = SURF; ctx.strokeStyle = A; ctx.lineWidth = 1.4; rr(bx, by + h * 0.14, bw, h * 0.2, 6); ctx.fill(); ctx.stroke(); T("🔗 linkpay.bd/p/x8f2", bx + 10, by + h * 0.25, Math.round(w * 0.028), A);
    const cp = lo > 1; T(cp ? "copied ✓" : "tap to copy", bx + bw - 10, by + h * 0.25, Math.round(w * 0.022), cp ? green : INK3, "right");
    ["WhatsApp", "Email", "QR"].forEach((s, i) => { const cw = (bw - 16) / 3; const x = bx + i * (cw + 8); ctx.fillStyle = SURF; ctx.strokeStyle = LINE; rr(x, by + h * 0.42, cw, h * 0.14, 4); ctx.fill(); ctx.stroke(); T(s, x + cw / 2, by + h * 0.51, Math.round(w * 0.022), INK2, "center"); });
  } else if (idx === 2) { // client pays
    T("// client checkout", bx, by + h * 0.06, Math.round(w * 0.026), INK3);
    ctx.fillStyle = SURF; ctx.strokeStyle = LINE; rr(bx, by + h * 0.12, bw, h * 0.16, 5); ctx.fill(); ctx.stroke(); T("VISA  ····  ····  ····  4242", bx + 10, by + h * 0.215, Math.round(w * 0.026), INK);
    const exp = ["MM/YY", "CVC"]; exp.forEach((e, i) => { const cw = (bw - 8) / 2; const x = bx + i * (cw + 8); ctx.fillStyle = SURF; ctx.strokeStyle = LINE; rr(x, by + h * 0.32, cw, h * 0.13, 4); ctx.fill(); ctx.stroke(); T(i === 0 ? "08 / 27" : "•••", x + 10, by + h * 0.405, Math.round(w * 0.024), INK2); });
    const done = lo > 1.5; ctx.fillStyle = done ? green : A; rr(bx, by + h * 0.5, bw, h * 0.13, 4); ctx.fill(); T(done ? "PAID ✓" : "PAY $250.00", w / 2, by + h * 0.585, Math.round(w * 0.028), "#fff", "center", 600); if (!done && lo > 0.8) { ctx.strokeStyle = "rgba(255,255,255,.6)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(bx + 16, by + h * 0.563, 6, t * 5, t * 5 + 4); ctx.stroke(); }
  } else { // settlement
    dot(bx + bw / 2, by + h * 0.18, 16, green); ctx.strokeStyle = "#fff"; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(bx + bw / 2 - 7, by + h * 0.18); ctx.lineTo(bx + bw / 2 - 2, by + h * 0.21); ctx.lineTo(bx + bw / 2 + 7, by + h * 0.14); ctx.stroke();
    T("Payment received", bx + bw / 2, by + h * 0.33, Math.round(w * 0.03), INK, "center", 600);
    ctx.fillStyle = SURF; ctx.strokeStyle = LINE; rr(bx, by + h * 0.4, bw, h * 0.26, 6); ctx.fill(); ctx.stroke();
    T("auto-settled to", bx + 12, by + h * 0.49, Math.round(w * 0.024), INK3); T("bKash ····1234", bx + 12, by + h * 0.59, Math.round(w * 0.03), INK, "left", 600);
    T("৳ 24,500", bx + bw - 12, by + h * 0.56, Math.round(w * 0.04), green, "right", 700, "d");
  }
  ctx.restore();
};

/* ============================================================
   8 · BANGLABRIDGE — real-time chat platform
============================================================ */
REEL_DRAW.chat = function (g) {
  const { ctx, w, h, t, PAD, A, INK, INK2, INK3, LINE, SURF, green, T, rr, dot, clamp, ease } = g;
  T("BANGLABRIDGE", PAD, PAD + h * 0.06, Math.round(w * 0.03), INK, "left", 700, "d");
  dot(w - PAD - 30, PAD + h * 0.04, 4, green); T("12 online", w - PAD, PAD + h * 0.055, Math.round(w * 0.024), green, "right");
  const { idx, lo, sl } = scenes(g, 4, 2.2);
  const bx = PAD, by = PAD + h * 0.13, bw = w - 2 * PAD, bh = h - by - h * 0.1;
  ctx.save(); ctx.translate(sl, 0);
  if (idx === 0) { // room list
    T("// rooms", bx, by + h * 0.07, Math.round(w * 0.026), INK3);
    const rooms = [["# general", "8"], ["# dhaka", "23"], ["# tech-talk", "11"], ["# random", "5"]]; rooms.forEach((r, i) => { const p = clamp((lo - i * 0.2) / 0.3, 0, 1); if (p <= 0) return; const y = by + h * 0.14 + i * h * 0.15; ctx.globalAlpha = p; const active = i === 1; ctx.fillStyle = active ? A : SURF; ctx.strokeStyle = LINE; rr(bx, y, bw, h * 0.12, 4); ctx.fill(); if (!active) ctx.stroke(); T(r[0], bx + 12, y + h * 0.078, Math.round(w * 0.027), active ? "#fff" : INK); dot(bx + bw - 30, y + h * 0.06, 3, active ? "#fff" : green); T(r[1], bx + bw - 12, y + h * 0.082, Math.round(w * 0.024), active ? "#fff" : INK3, "right"); ctx.globalAlpha = 1; });
  } else if (idx === 1 || idx === 2) { // chat bubbles
    T("# dhaka", bx, by + h * 0.07, Math.round(w * 0.026), INK2);
    const msgs = [["Rayhan", 0, "Anyone up for the meetup?"], ["You", 1, "Yes! 7pm works"], ["Sneha", 0, "Count me in 🎉"]]; const showN = idx === 1 ? Math.min(3, Math.floor(lo / 0.6) + 1) : 3;
    for (let i = 0; i < showN; i++) { const m = msgs[i]; const y = by + h * 0.14 + i * h * 0.18; const right = m[1] === 1; const bw2 = bw * 0.66; const x = right ? bx + bw - bw2 : bx;
      ctx.fillStyle = right ? A : SURF; ctx.strokeStyle = LINE; rr(x, y, bw2, h * 0.15, 8); ctx.fill(); if (!right) ctx.stroke();
      T(m[0], x + 10, y + h * 0.055, Math.round(w * 0.02), right ? "rgba(255,255,255,.7)" : INK3); T(m[2], x + 10, y + h * 0.115, Math.round(w * 0.024), right ? "#fff" : INK); }
    if (idx === 2 || showN >= 3) { const ty = by + h * 0.14 + showN * h * 0.18; T("Sneha is typing", bx + 10, ty + h * 0.05, Math.round(w * 0.022), INK3); for (let d = 0; d < 3; d++) dot(bx + 10 + ctx.measureText("Sneha is typing ").width + d * 7, ty + h * 0.03, 2, (Math.floor(t * 3) % 3 === d) ? A : LINE); }
  } else { // admin monitor
    T("// admin · live rooms", bx, by + h * 0.07, Math.round(w * 0.026), INK3);
    const rows = [["# general", 8, 0.5], ["# dhaka", 23, 0.9], ["# tech-talk", 11, 0.45], ["# random", 5, 0.25]]; rows.forEach((r, i) => { const y = by + h * 0.15 + i * h * 0.15; ctx.fillStyle = SURF; ctx.strokeStyle = LINE; rr(bx, y, bw, h * 0.12, 4); ctx.fill(); ctx.stroke(); T(r[0], bx + 10, y + h * 0.078, Math.round(w * 0.024), INK); const barW = bw * 0.4; ctx.fillStyle = LINE; rr(bx + bw - barW - 40, y + h * 0.045, barW, 5, 2); ctx.fill(); ctx.fillStyle = A; rr(bx + bw - barW - 40, y + h * 0.045, barW * r[2], 5, 2); ctx.fill(); T(String(r[1]), bx + bw - 10, y + h * 0.082, Math.round(w * 0.024), INK2, "right"); });
  }
  ctx.restore();
};

/* ============================================================
   9 · SPLITEASY — group expense splitter
============================================================ */
REEL_DRAW.split = function (g) {
  const { ctx, w, h, t, PAD, A, INK, INK2, INK3, LINE, SURF, green, red, T, rr, dot, clamp, ease, easeIO } = g;
  T("SPLITEASY", PAD, PAD + h * 0.06, Math.round(w * 0.032), INK, "left", 700, "d");
  T("EXPENSE SPLITTER", w - PAD, PAD + h * 0.055, Math.round(w * 0.024), INK3, "right");
  const { idx, lo, sl } = scenes(g, 4, 2.2);
  const bx = PAD, by = PAD + h * 0.13, bw = w - 2 * PAD, bh = h - by - h * 0.1;
  const avatarCols = [A, "#c96442", green, "#7a3be2"];
  ctx.save(); ctx.translate(sl, 0);
  if (idx === 0) { // group + members
    T("Group · Goa Trip", bx, by + h * 0.1, Math.round(w * 0.032), INK, "left", 700, "d");
    T("// inviting members", bx, by + h * 0.2, Math.round(w * 0.024), INK3);
    const names = ["Zohir", "Rayhan", "Sneha", "Jihan"]; names.forEach((n, i) => { const p = clamp((lo - 0.3 - i * 0.3) / 0.35, 0, 1); if (p <= 0) return; const y = by + h * 0.28 + i * h * 0.14; ctx.globalAlpha = p; dot(bx + 12, y + h * 0.04, 9, avatarCols[i]); T(n[0], bx + 12, y + h * 0.07, Math.round(w * 0.024), "#fff", "center", 600); T(n, bx + 28, y + h * 0.07, Math.round(w * 0.026), INK); if (p >= 1) { dot(bx + bw - 14, y + h * 0.04, 5, green); T("joined", bx + bw - 26, y + h * 0.06, Math.round(w * 0.02), green, "right"); } ctx.globalAlpha = 1; });
  } else if (idx === 1) { // add expense
    T("// add expense", bx, by + h * 0.08, Math.round(w * 0.026), INK3);
    ctx.fillStyle = SURF; ctx.strokeStyle = LINE; rr(bx, by + h * 0.14, bw, h * 0.24, 6); ctx.fill(); ctx.stroke(); T("Hotel — 2 nights", bx + 12, by + h * 0.24, Math.round(w * 0.028), INK); T("৳ 12,000", bx + 12, by + h * 0.34, Math.round(w * 0.045), INK, "left", 700, "d"); T("paid by Zohir", bx + bw - 12, by + h * 0.24, Math.round(w * 0.022), INK3, "right");
    T("split equally · 4 ways", bx, by + h * 0.46, Math.round(w * 0.024), INK3);
    for (let i = 0; i < 4; i++) { const p = clamp((lo - 0.8 - i * 0.2) / 0.3, 0, 1); if (p <= 0) continue; const cw = (bw - 18) / 4; const x = bx + i * (cw + 6); ctx.globalAlpha = ease(p); ctx.fillStyle = SURF; ctx.strokeStyle = LINE; rr(x, by + h * 0.52, cw, h * 0.16, 5); ctx.fill(); ctx.stroke(); dot(x + cw / 2, by + h * 0.57, 6, avatarCols[i]); T("৳3k", x + cw / 2, by + h * 0.655, Math.round(w * 0.022), INK, "center"); ctx.globalAlpha = 1; }
  } else if (idx === 2) { // balances
    T("// balances", bx, by + h * 0.08, Math.round(w * 0.026), INK3);
    const bal = [["Rayhan", "owes you", "৳3,000", red], ["Sneha", "owes you", "৳3,000", red], ["Jihan", "owes you", "৳3,000", red]]; bal.forEach((b, i) => { const y = by + h * 0.16 + i * h * 0.17; ctx.fillStyle = SURF; ctx.strokeStyle = LINE; rr(bx, y, bw, h * 0.14, 5); ctx.fill(); ctx.stroke(); dot(bx + 16, y + h * 0.07, 9, avatarCols[i + 1]); T(b[0], bx + 32, y + h * 0.06, Math.round(w * 0.026), INK, "left", 600); T(b[1], bx + 32, y + h * 0.11, Math.round(w * 0.02), INK3); T(b[2], bx + bw - 12, y + h * 0.09, Math.round(w * 0.03), b[3], "right", 700, "d"); });
  } else { // settle up
    dot(bx + bw / 2, by + h * 0.22, 18, green); ctx.strokeStyle = "#fff"; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.moveTo(bx + bw / 2 - 8, by + h * 0.22); ctx.lineTo(bx + bw / 2 - 2, by + h * 0.255); ctx.lineTo(bx + bw / 2 + 8, by + h * 0.17); ctx.stroke();
    T("All settled up", bx + bw / 2, by + h * 0.42, Math.round(w * 0.034), INK, "center", 700, "d"); T("Goa Trip · ৳12,000 split 4 ways", bx + bw / 2, by + h * 0.52, Math.round(w * 0.024), INK3, "center"); T("everyone's even 🎉", bx + bw / 2, by + h * 0.62, Math.round(w * 0.024), green, "center");
  }
  ctx.restore();
};

/* ============================================================
   10 · DUBAICLEANUPCARE — Laravel cleaning-service platform
============================================================ */
REEL_DRAW.booking = function (g) {
  const { ctx, w, h, t, PAD, A, INK, INK2, INK3, LINE, SURF, green, amber, T, rr, dot, clamp, ease } = g;
  T("CLEANUPCARE", PAD, PAD + h * 0.06, Math.round(w * 0.03), INK, "left", 700, "d");
  T("BOOKINGS", w - PAD, PAD + h * 0.055, Math.round(w * 0.024), INK3, "right");
  const { idx, lo, sl } = scenes(g, 4, 2.2);
  const bx = PAD, by = PAD + h * 0.13, bw = w - 2 * PAD, bh = h - by - h * 0.1;
  ctx.save(); ctx.translate(sl, 0);
  if (idx === 0) { // service select
    T("// choose a service", bx, by + h * 0.07, Math.round(w * 0.026), INK3);
    const svc = ["Deep Clean", "Office", "Move-out"]; svc.forEach((s, i) => { const y = by + h * 0.15 + i * h * 0.17; const on = i === 0 && lo > 0.5; ctx.fillStyle = SURF; ctx.strokeStyle = on ? A : LINE; ctx.lineWidth = on ? 2 : 1; rr(bx, y, bw, h * 0.13, 5); ctx.fill(); ctx.stroke(); ctx.fillStyle = on ? A : LINE; rr(bx + 8, y + h * 0.03, h * 0.07, h * 0.07, 3); ctx.fill(); T(s, bx + 8 + h * 0.1, y + h * 0.085, Math.round(w * 0.028), INK); T(["৳1,500", "৳2,200", "৳3,000"][i], bx + bw - 12, y + h * 0.085, Math.round(w * 0.026), on ? A : INK2, "right", 600); });
  } else if (idx === 1) { // calendar + time
    T("// pick date & time", bx, by + h * 0.07, Math.round(w * 0.026), INK3);
    const days = ["M", "T", "W", "T", "F", "S", "S"]; const cw = bw / 7; const sel = 3; days.forEach((d, i) => { const x = bx + i * cw; const on = i === sel && lo > 0.4; ctx.fillStyle = on ? A : SURF; ctx.strokeStyle = LINE; rr(x + 2, by + h * 0.13, cw - 4, h * 0.16, 4); ctx.fill(); if (!on) ctx.stroke(); T(d, x + cw / 2, by + h * 0.21, Math.round(w * 0.024), on ? "#fff" : INK2, "center", 600); T(String(12 + i), x + cw / 2, by + h * 0.27, Math.round(w * 0.018), on ? "rgba(255,255,255,.7)" : INK3, "center"); });
    const slots = ["9:00", "11:00", "14:00", "16:00"]; slots.forEach((s, i) => { const swc = (bw - 18) / 4; const x = bx + i * (swc + 6); const on = i === 2 && lo > 1; ctx.fillStyle = on ? A : SURF; ctx.strokeStyle = on ? A : LINE; rr(x, by + h * 0.36, swc, h * 0.13, 4); ctx.fill(); if (!on) ctx.stroke(); T(s, x + swc / 2, by + h * 0.445, Math.round(w * 0.022), on ? "#fff" : INK2, "center"); });
    if (lo > 1.5) { ctx.fillStyle = green; rr(bx, by + h * 0.54, bw, h * 0.13, 4); ctx.fill(); T("CONFIRM BOOKING", w / 2, by + h * 0.625, Math.round(w * 0.026), "#fff", "center", 600); }
  } else if (idx === 2) { // cleaner assigned
    T("// cleaner assigned", bx, by + h * 0.07, Math.round(w * 0.026), INK3);
    ctx.fillStyle = SURF; ctx.strokeStyle = LINE; rr(bx, by + h * 0.14, bw, h * 0.28, 6); ctx.fill(); ctx.stroke(); dot(bx + 30, by + h * 0.28, 18, A); T("👤", bx + 30, by + h * 0.3, Math.round(w * 0.04), "#fff", "center");
    T("Imran H.", bx + 56, by + h * 0.24, Math.round(w * 0.03), INK, "left", 600); T("★ 4.9 · 320 jobs", bx + 56, by + h * 0.33, Math.round(w * 0.024), amber); T("verified ✓", bx + bw - 12, by + h * 0.24, Math.round(w * 0.022), green, "right");
    const prog = clamp(lo / 1.6, 0, 1); ctx.fillStyle = LINE; rr(bx, by + h * 0.52, bw, 6, 3); ctx.fill(); ctx.fillStyle = A; rr(bx, by + h * 0.52, bw * prog, 6, 3); ctx.fill(); dot(bx + bw * prog, by + h * 0.525, 5, A); T("On the way · 12 min", bx, by + h * 0.62, Math.round(w * 0.024), INK2);
  } else { // done
    dot(bx + bw / 2, by + h * 0.24, 18, green); ctx.strokeStyle = "#fff"; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.moveTo(bx + bw / 2 - 8, by + h * 0.24); ctx.lineTo(bx + bw / 2 - 2, by + h * 0.275); ctx.lineTo(bx + bw / 2 + 8, by + h * 0.19); ctx.stroke();
    T("Booking #4821 confirmed", bx + bw / 2, by + h * 0.45, Math.round(w * 0.028), INK, "center", 600); T("Deep Clean · Thu 14:00", bx + bw / 2, by + h * 0.55, Math.round(w * 0.024), INK3, "center"); T("Imran H. · ★4.9", bx + bw / 2, by + h * 0.64, Math.round(w * 0.024), amber, "center");
  }
  ctx.restore();
};


/* ---- vanilla initializer: drives every <canvas data-reel="kind"> ---- */
function mountReel(canvas) {
  const kind = canvas.dataset.reel;
  const ctx = canvas.getContext("2d");
  const _arc = ctx.arc.bind(ctx); ctx.arc = (x, y, r, a, b, c) => _arc(x, y, Math.max(0, r || 0), a, b, c || false);
  const _rg = ctx.createRadialGradient.bind(ctx); ctx.createRadialGradient = (x0, y0, r0, x1, y1, r1) => _rg(x0, y0, Math.max(0, r0 || 0), x1, y1, Math.max(0, r1 || 0));
  const dpr = Math.min(devicePixelRatio || 1, 2);
  let raf = 0, W = 0, H = 0, t0 = performance.now(), visible = true;

  function size() { const r = canvas.getBoundingClientRect(); if (r.width > 0) { W = canvas.width = Math.max(2, Math.round(r.width * dpr)); H = canvas.height = Math.max(2, Math.round(r.height * dpr)); } }
  addEventListener("resize", size);

  const V = (v, f) => getComputedStyle(document.documentElement).getPropertyValue(v).trim() || f;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const ease = (x) => 1 - Math.pow(1 - x, 3);
  const easeIO = (x) => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
  const H2 = makeHelpers(ctx);

  function sceneDots(g) {
    if (g._N == null) return;
    const { ctx, w, h, A, LINE } = g; const n = g._N, gap = 9, tot = (n - 1) * gap, x0 = w / 2 - tot / 2, y = h - 8;
    for (let i = 0; i < n; i++) { ctx.fillStyle = i === g._idx ? A : LINE; ctx.beginPath(); ctx.arc(x0 + i * gap, y, i === g._idx ? 2.6 : 2, 0, 7); ctx.fill(); }
    g._N = null;
  }

  function frame(now) {
    if (!visible) return;
    size();
    if (W < 2 || H < 2) { raf = requestAnimationFrame(frame); return; }
    const t = (now - t0) / 1000;
    const g = {
      ctx, t, clamp, ease, easeIO, ...H2,
      A: V("--accent", "#2b50e2"), INK: V("--ink", "#16140f"), INK2: V("--ink-2", "#524e48"),
      INK3: V("--ink-3", "#6e695e"), LINE: V("--line-2", "rgba(0,0,0,.18)"), SURF: V("--surface", "#fff"),
      PAPER: V("--paper", "#f4f1ea"), green: "#1f9d57", red: "#e23b5a", amber: "#e0922b",
    };
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const w = W / dpr, h = H / dpr;
    g.w = w; g.h = h; g.PAD = Math.round(w * 0.045);
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = g.PAPER; ctx.fillRect(0, 0, w, h);
    try { (REEL_DRAW[kind] || REEL_DRAW.dashboard)(g); } catch (e) { /* never break the loop */ }
    sceneDots(g);
    raf = requestAnimationFrame(frame);
  }

  size(); raf = requestAnimationFrame(frame);
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting && !visible) { visible = true; t0 = performance.now(); raf = requestAnimationFrame(frame); }
    else if (!e.isIntersecting && visible) { visible = false; cancelAnimationFrame(raf); }
  }), { rootMargin: "200px" });
  io.observe(canvas);
}

function initReels() { document.querySelectorAll("canvas[data-reel]").forEach(mountReel); }
if (document.readyState === "loading") addEventListener("DOMContentLoaded", initReels);
else initReels();

window.REEL_DRAW = REEL_DRAW;
})();
