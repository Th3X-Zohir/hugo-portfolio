/* ============================================================
   ZOHIR RAYHAN — SHOWREEL  (timeline video, animations.jsx)
   Story: boot → roles → code → pipeline → work → stats → outro
============================================================ */
const C = {
  bg: "#0c0b08", ink: "#f4f1ea", ink2: "#a8a193", ink3: "#6d6757",
  accent: "#2b50e2", green: "#2bd576", line: "rgba(244,241,234,.14)",
  panel: "#16140f", panel2: "#1c1a13",
};
const FONT = { d: "'Bricolage Grotesque', system-ui, sans-serif", m: "'JetBrains Mono', monospace", s: "'Space Grotesk', system-ui, sans-serif" };
const E = window.Easing, clamp = window.clamp, interpolate = window.interpolate;
const typed = (txt, t, cps) => txt.slice(0, Math.max(0, Math.floor(t * cps)));

/* ---------- persistent cinematic HUD ---------- */
function HUD() {
  const t = useTime();
  const rec = Math.floor(t * 2) % 2 === 0;
  const tc = (() => { const m = Math.floor(t / 60), s = Math.floor(t % 60), f = Math.floor((t * 24) % 24); return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}:${String(f).padStart(2,"0")}`; })();
  const brk = (pos) => { const b = { position: "absolute", width: 22, height: 22, borderColor: C.ink3, borderStyle: "solid", borderWidth: 0 }; const m = 26;
    if (pos === "tl") Object.assign(b, { left: m, top: m, borderLeftWidth: 1.5, borderTopWidth: 1.5 });
    if (pos === "tr") Object.assign(b, { right: m, top: m, borderRightWidth: 1.5, borderTopWidth: 1.5 });
    if (pos === "bl") Object.assign(b, { left: m, bottom: m, borderLeftWidth: 1.5, borderBottomWidth: 1.5 });
    if (pos === "br") Object.assign(b, { right: m, bottom: m, borderRightWidth: 1.5, borderBottomWidth: 1.5 });
    return b; };
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 50 }}>
      {["tl","tr","bl","br"].map((p) => <div key={p} style={brk(p)} />)}
      <div style={{ position: "absolute", left: 56, top: 30, fontFamily: FONT.m, fontSize: 12, letterSpacing: ".2em", color: C.ink3 }}>ZOHIR_RAYHAN / SHOWREEL</div>
      <div style={{ position: "absolute", right: 56, top: 30, fontFamily: FONT.m, fontSize: 12, letterSpacing: ".15em", color: rec ? C.accent : C.ink3, display: "flex", alignItems: "center", gap: 7 }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: rec ? C.accent : C.ink3, display: "inline-block" }} />REC
      </div>
      <div style={{ position: "absolute", left: 56, bottom: 30, fontFamily: FONT.m, fontSize: 12, letterSpacing: ".1em", color: C.ink2 }}>{tc}</div>
      <div style={{ position: "absolute", right: 56, bottom: 30, fontFamily: FONT.m, fontSize: 12, letterSpacing: ".1em", color: C.ink3 }}>DHAKA · BD</div>
    </div>
  );
}

/* ---------- moving grid + grain + vignette backdrop ---------- */
function Backdrop() {
  const t = useTime();
  const off = (t * 14) % 46;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: C.bg }}>
      <div style={{ position: "absolute", inset: -2, opacity: .5,
        backgroundImage: `linear-gradient(${C.line} 1px, transparent 1px), linear-gradient(90deg, ${C.line} 1px, transparent 1px)`,
        backgroundSize: "46px 46px", backgroundPosition: `${off}px ${off}px`,
        maskImage: "radial-gradient(circle at 50% 45%, #000 10%, transparent 80%)", WebkitMaskImage: "radial-gradient(circle at 50% 45%, #000 10%, transparent 80%)" }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 120% at 50% 0%, transparent 55%, rgba(0,0,0,.55) 100%)" }} />
    </div>
  );
}

/* ---------- SCENE 1 — BOOT (0 → 3.6) ---------- */
function SceneBoot() {
  return (
    <Sprite start={0} end={3.6}>
      {({ localTime: lt }) => {
        const lines = [
          { t: 0.1, s: "$ ssh deploy@zohirrayhan.me" },
          { t: 0.6, s: "● authenticating ......... OK", ok: true },
          { t: 1.0, s: "● loading operator ....... OK", ok: true },
          { t: 1.4, s: "● interface .............. READY", ok: true },
        ];
        const wordIn = clamp((lt - 1.95) / 0.7, 0, 1);
        const ws = 1.45 - 0.45 * E.easeOutExpo(wordIn);
        const wo = E.easeOutQuad(clamp((lt - 1.95) / 0.4, 0, 1));
        const termFade = lt < 1.9 ? 1 : 1 - clamp((lt - 2.0) / 0.4, 0, 1);
        const exit = 1 - clamp((lt - 3.2) / 0.4, 0, 1);
        const uw = E.easeOutExpo(clamp((lt - 2.5) / 0.7, 0, 1));
        return (
          <div style={{ position: "absolute", inset: 0, opacity: exit }}>
            <div style={{ position: "absolute", left: "50%", top: 184, transform: "translateX(-50%)", width: 560, opacity: termFade, fontFamily: FONT.m, fontSize: 17, lineHeight: 1.9 }}>
              {lines.map((l, i) => lt > l.t ? (
                <div key={i} style={{ color: l.ok ? C.ink2 : C.ink }}>
                  {l.ok ? <span>{l.s.replace("OK","").replace("READY","")}<b style={{ color: l.s.includes("READY") ? C.accent : C.green }}>{l.s.includes("READY") ? "READY" : "OK"}</b></span> : l.s}
                </div>
              ) : null)}
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", opacity: wo }}>
              <div style={{ fontFamily: FONT.d, fontWeight: 700, fontSize: 124, letterSpacing: "-.045em", lineHeight: .9, color: C.ink, transform: `scale(${ws})`, transformOrigin: "center" }}>
                ZOHIR <span style={{ fontStyle: "italic", fontWeight: 500, color: C.accent }}>RAYHAN</span>
              </div>
              <div style={{ height: 2, background: C.accent, width: `${uw * 360}px`, margin: "18px auto 0", boxShadow: `0 0 16px ${C.accent}` }} />
              <div style={{ fontFamily: FONT.m, fontSize: 16, letterSpacing: ".28em", color: C.ink2, marginTop: 20, opacity: uw }}>TECH LEAD · DEVOPS · DEVSECOPS</div>
            </div>
          </div>
        );
      }}
    </Sprite>
  );
}

/* ---------- SCENE 2 — ROLES (3.6 → 7.2) ---------- */
function SceneRoles() {
  const words = ["TECH LEAD", "DEVOPS", "DEVSECOPS", "FULL-STACK"];
  return (
    <Sprite start={3.6} end={7.2}>
      {({ localTime: lt, duration }) => {
        const wd = 0.78, idx = Math.min(words.length - 1, Math.floor(lt / wd)), frac = (lt % wd) / wd;
        const inn = E.easeOutExpo(clamp(frac / 0.32, 0, 1));
        const ty = (1 - inn) * 80;
        const sceneOut = 1 - clamp((lt - (duration - 0.4)) / 0.4, 0, 1);
        const labOp = E.easeOutQuad(clamp(lt / 0.4, 0, 1));
        return (
          <div style={{ position: "absolute", inset: 0, opacity: sceneOut }}>
            <div style={{ position: "absolute", left: 120, top: 250, fontFamily: FONT.m, fontSize: 18, letterSpacing: ".24em", color: C.ink3, opacity: labOp }}>I AM A —</div>
            <div style={{ position: "absolute", left: 116, top: 286, height: 180, overflow: "hidden", width: 1000 }}>
              <div style={{ fontFamily: FONT.d, fontWeight: 700, fontSize: 150, letterSpacing: "-.04em", lineHeight: 1.1, color: C.accent, transform: `translateY(${ty}px)`, opacity: inn }}>{words[idx]}</div>
            </div>
            <div style={{ position: "absolute", left: 120, top: 486, fontFamily: FONT.s, fontSize: 26, color: C.ink2, opacity: labOp }}>I build, secure &amp; operate systems — end to end.</div>
          </div>
        );
      }}
    </Sprite>
  );
}

/* ---------- SCENE 3 — CODE (7.2 → 11.2) ---------- */
function SceneCode() {
  const code = `Route::post('/case/file', function (Request $r) {
    $case = Case::create($r->validated());
    Notify::sms($case->citizen, 'Filed ✓');
    Audit::log('case.created', $case->id);
    return response()->json($case, 201);
});`;
  return (
    <Sprite start={7.2} end={11.2}>
      {({ localTime: lt, duration }) => {
        const inn = E.easeOutExpo(clamp(lt / 0.6, 0, 1));
        const out = 1 - clamp((lt - (duration - 0.45)) / 0.45, 0, 1);
        const shown = typed(code, Math.max(0, lt - 0.5), 46);
        const caret = Math.floor(lt * 2) % 2 === 0;
        return (
          <div style={{ position: "absolute", inset: 0, opacity: out }}>
            <div style={{ position: "absolute", left: 120, top: 120, fontFamily: FONT.m, fontSize: 14, letterSpacing: ".22em", color: C.ink3, opacity: inn }}>FROM THE FIRST COMMIT…</div>
            <div style={{ position: "absolute", left: 120, top: 168, width: 1040, background: C.panel, border: `1px solid ${C.line}`, borderRadius: 8, overflow: "hidden", transform: `translateY(${(1-inn)*30}px) scale(${0.97+0.03*inn})`, opacity: inn, boxShadow: "0 40px 90px -30px #000" }}>
              <div style={{ height: 44, background: C.panel2, borderBottom: `1px solid ${C.line}`, display: "flex", alignItems: "center", gap: 8, padding: "0 18px" }}>
                {["#ff5f57","#febc2e","#28c840"].map((c) => <span key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />)}
                <span style={{ marginLeft: 12, fontFamily: FONT.m, fontSize: 13, color: C.ink3 }}>routes/api.php — efamilycourt</span>
              </div>
              <pre style={{ margin: 0, padding: "24px 26px", fontFamily: FONT.m, fontSize: 21, lineHeight: 1.6, color: C.ink, whiteSpace: "pre-wrap", minHeight: 230 }}>
                {shown}<span style={{ opacity: caret ? 1 : 0, color: C.accent }}>▋</span>
              </pre>
            </div>
          </div>
        );
      }}
    </Sprite>
  );
}

/* ---------- SCENE 4 — PIPELINE (11.2 → 15.8) ---------- */
function ScenePipeline() {
  const stages = ["SOURCE", "BUILD", "TEST", "DEPLOY", "LIVE"];
  return (
    <Sprite start={11.2} end={15.8}>
      {({ localTime: lt, duration }) => {
        const inn = E.easeOutQuad(clamp(lt / 0.5, 0, 1));
        const out = 1 - clamp((lt - (duration - 0.45)) / 0.45, 0, 1);
        const N = stages.length, gap = 230, startX = 640 - ((N - 1) * gap) / 2, y = 360;
        const lit = (lt - 0.8) / 0.62;                       // node lighting progress
        const packet = clamp((lt - 0.8) / ((N - 1) * 0.62), 0, 1);
        return (
          <div style={{ position: "absolute", inset: 0, opacity: out }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", fontFamily: FONT.m, fontSize: 14, letterSpacing: ".22em", color: C.ink3, opacity: inn }}>…TO PRODUCTION</div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 196, textAlign: "center", fontFamily: FONT.d, fontWeight: 700, fontSize: 52, letterSpacing: "-.03em", color: C.ink, opacity: inn }}>The pipeline, automated.</div>
            {/* connectors */}
            {stages.slice(0, -1).map((_, i) => {
              const x1 = startX + i * gap + 46, x2 = startX + (i + 1) * gap - 46;
              const fillP = clamp(lit - i, 0, 1);
              return (
                <div key={i} style={{ position: "absolute", left: x1, top: y - 1, width: x2 - x1, height: 2, background: C.line }}>
                  <div style={{ position: "absolute", inset: 0, width: `${fillP * 100}%`, background: C.accent }} />
                </div>
              );
            })}
            {/* packet */}
            <div style={{ position: "absolute", left: startX + packet * (N - 1) * gap, top: y, width: 12, height: 12, marginLeft: -6, marginTop: -6, borderRadius: "50%", background: C.accent, boxShadow: `0 0 16px ${C.accent}`, opacity: inn }} />
            {/* nodes */}
            {stages.map((s, i) => {
              const on = lit >= i;
              const isLive = i === N - 1;
              const pop = on ? E.easeOutBack(clamp((lt - 0.8 - i * 0.62) / 0.4, 0, 1)) : 0;
              const col = isLive && on ? C.green : (on ? C.accent : C.ink3);
              return (
                <div key={s} style={{ position: "absolute", left: startX + i * gap, top: y, transform: "translate(-50%,-50%)", textAlign: "center" }}>
                  <div style={{ width: 92, height: 92, margin: "0 auto", border: `2px solid ${on ? col : C.line}`, borderRadius: 14, background: on ? `${col}22` : "transparent", display: "grid", placeItems: "center", transform: `scale(${0.6 + 0.4 * (on ? 1 : inn)})`, boxShadow: on ? `0 0 28px ${col}55` : "none" }}>
                    <div style={{ width: 12, height: 12, borderRadius: "50%", background: on ? col : C.ink3, transform: `scale(${0.8 + pop * 0.6})` }} />
                  </div>
                  <div style={{ fontFamily: FONT.m, fontSize: 15, letterSpacing: ".12em", color: on ? C.ink : C.ink3, marginTop: 14 }}>{s}</div>
                </div>
              );
            })}
          </div>
        );
      }}
    </Sprite>
  );
}

/* ---------- SCENE 5 — WORK (15.8 → 20.6) ---------- */
function SceneWork() {
  const cards = [
    { n: "E-Family Court", t: "National e-Judiciary", s: "Laravel · MSSQL" },
    { n: "Routine Scrapper", t: "University Automation", s: "Python · Flask" },
    { n: "Student Hub", t: "Student Management", s: "Laravel · MySQL" },
    { n: "Blood Bridge", t: "Donor Finder", s: "Flask · Leaflet" },
  ];
  return (
    <Sprite start={15.8} end={20.6}>
      {({ localTime: lt, duration }) => {
        const inn = E.easeOutQuad(clamp(lt / 0.4, 0, 1));
        const out = 1 - clamp((lt - (duration - 0.45)) / 0.45, 0, 1);
        return (
          <div style={{ position: "absolute", inset: 0, opacity: out }}>
            <div style={{ position: "absolute", left: 120, top: 130, fontFamily: FONT.m, fontSize: 14, letterSpacing: ".22em", color: C.ink3, opacity: inn }}>SELECTED WORK — ALL LIVE</div>
            <div style={{ position: "absolute", left: 120, top: 166, fontFamily: FONT.d, fontWeight: 700, fontSize: 56, letterSpacing: "-.03em", color: C.ink, opacity: inn }}>Shipped for real users.</div>
            <div style={{ position: "absolute", left: 120, right: 120, top: 290, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
              {cards.map((c, i) => {
                const ci = E.easeOutExpo(clamp((lt - 0.4 - i * 0.22) / 0.6, 0, 1));
                return (
                  <div key={c.n} style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 8, padding: "26px 28px", transform: `translateY(${(1 - ci) * 60}px)`, opacity: ci, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontFamily: FONT.d, fontWeight: 700, fontSize: 32, letterSpacing: "-.02em", color: C.ink }}>{c.n}</div>
                      <div style={{ fontFamily: FONT.m, fontSize: 14, color: C.accent, marginTop: 8 }}>{c.t}</div>
                      <div style={{ fontFamily: FONT.m, fontSize: 13, color: C.ink3, marginTop: 6 }}>{c.s}</div>
                    </div>
                    <div style={{ fontFamily: FONT.m, fontSize: 12, letterSpacing: ".12em", color: C.green, display: "flex", alignItems: "center", gap: 7 }}>
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.green }} />LIVE
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }}
    </Sprite>
  );
}

/* ---------- SCENE 6 — STATS (20.6 → 24.2) ---------- */
function SceneStats() {
  const stats = [
    { end: 99.98, dec: 2, suf: "%", l: "UPTIME" },
    { end: 1.4, dec: 1, suf: "k+", l: "DEPLOYS" },
    { end: 4, dec: 0, suf: "", l: "LIVE PLATFORMS" },
  ];
  return (
    <Sprite start={20.6} end={24.2}>
      {({ localTime: lt, duration }) => {
        const out = 1 - clamp((lt - (duration - 0.45)) / 0.45, 0, 1);
        return (
          <div style={{ position: "absolute", inset: 0, opacity: out, display: "flex", alignItems: "center", justifyContent: "center", gap: 96 }}>
            {stats.map((s, i) => {
              const ci = clamp((lt - 0.2 - i * 0.25) / 1.2, 0, 1);
              const v = (s.end * E.easeOutExpo(ci)).toFixed(s.dec);
              const op = E.easeOutQuad(clamp((lt - 0.2 - i * 0.25) / 0.4, 0, 1));
              return (
                <div key={s.l} style={{ textAlign: "center", opacity: op, transform: `translateY(${(1 - op) * 30}px)` }}>
                  <div style={{ fontFamily: FONT.d, fontWeight: 700, fontSize: 110, letterSpacing: "-.04em", color: C.ink, lineHeight: 1 }}>{v}<span style={{ color: C.accent, fontSize: 56 }}>{s.suf}</span></div>
                  <div style={{ fontFamily: FONT.m, fontSize: 15, letterSpacing: ".2em", color: C.ink3, marginTop: 18 }}>{s.l}</div>
                </div>
              );
            })}
          </div>
        );
      }}
    </Sprite>
  );
}

/* ---------- SCENE 7 — OUTRO (24.2 → 28) ---------- */
function SceneOutro() {
  return (
    <Sprite start={24.2} end={28}>
      {({ localTime: lt }) => {
        const inn = E.easeOutExpo(clamp(lt / 0.7, 0, 1));
        const uw = E.easeOutExpo(clamp((lt - 0.5) / 0.8, 0, 1));
        const sub = E.easeOutQuad(clamp((lt - 0.8) / 0.6, 0, 1));
        return (
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontFamily: FONT.d, fontWeight: 700, fontSize: 150, letterSpacing: "-.045em", lineHeight: .92, color: C.ink, transform: `translateY(${(1 - inn) * 40}px)`, opacity: inn }}>
              Let's <span style={{ fontStyle: "italic", fontWeight: 500, color: C.accent }}>build.</span>
            </div>
            <div style={{ height: 2, background: C.accent, width: `${uw * 420}px`, margin: "26px 0", boxShadow: `0 0 16px ${C.accent}` }} />
            <div style={{ fontFamily: FONT.m, fontSize: 22, color: C.ink, opacity: sub, letterSpacing: ".02em" }}>admin@zohirrayhan.me</div>
            <div style={{ fontFamily: FONT.m, fontSize: 15, color: C.ink3, opacity: sub, marginTop: 14, letterSpacing: ".18em" }}>TECH LEAD · DEVOPS &amp; DEVSECOPS ENGINEER</div>
          </div>
        );
      }}
    </Sprite>
  );
}

function Showreel() {
  return (
    <Stage width={1280} height={720} duration={28} background={C.bg} persistKey="zr-reel">
      <Backdrop />
      <SceneBoot />
      <SceneRoles />
      <SceneCode />
      <ScenePipeline />
      <SceneWork />
      <SceneStats />
      <SceneOutro />
      <HUD />
    </Stage>
  );
}

ReactDOM.createRoot(document.getElementById("reel-root")).render(<Showreel />);
