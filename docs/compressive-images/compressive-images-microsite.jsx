import { useState, useEffect, useRef, useCallback, useMemo } from "react";

/* ------------------------------------------------------------------ *
 * Compressive Images, Revisited — a performance-judgment microsite
 * Sibling to the disability-models piece: same DNA (Source Serif + Sans,
 * editorial column, sticky header, reading progress, accessible by default)
 * but a distinct accent — slate/ink with a signal-amber highlight instead
 * of the violet justice palette.
 * ------------------------------------------------------------------ */

const INK = "#1C1B19";
const BODY = "#3A3833";
const MUTE = "#6E6B63";
const FAINT = "#9A968C";
const LINE = "#E8E4DA";
const PAPER = "#FBFAF6";
const AMBER = "#B45309";       // signal accent
const AMBER_SOFT = "#FBEBD3";
const GOOD = "#1F7A5C";
const BAD = "#A23B3B";

/* Offline-measured benchmark numbers (Python/Pillow, photographic test image).
   Live demos compute JPEG/WebP in-browser; AVIF can't be encoded via canvas,
   so AVIF is shown here as measured-offline and labeled as such.
   one = @1x baseline, accepted = full-quality @2x, trick = compressive @2x,
   trick4x = compressive @4x (the density-ladder test). */
const BENCH = [
  { fmt: "JPEG", one: 26.3, accepted: 86.6, trick: 34.7, trick4x: 71.9, full4x: 264.0 },
  { fmt: "WebP", one: 21.3, accepted: 60.2, trick: 25.4, trick4x: 67.2, full4x: 157.1 },
  { fmt: "AVIF", one: 23.1, accepted: 73.5, trick: 20.1, trick4x: 51.9, full4x: 172.1 },
];

/* ----------------------------- primitives ----------------------------- */

function SkipLink() {
  return (
    <a
      href="#main"
      style={{
        position: "absolute", left: "-9999px", top: "auto", width: 1, height: 1,
        overflow: "hidden", zIndex: 100, padding: "1rem", background: INK,
        color: "#fff", fontWeight: 600, textDecoration: "none", borderRadius: "0 0 8px 0",
      }}
      onFocus={(e) => { e.target.style.left = "0"; e.target.style.width = "auto"; e.target.style.height = "auto"; }}
      onBlur={(e) => { e.target.style.left = "-9999px"; e.target.style.width = "1px"; e.target.style.height = "1px"; }}
    >
      Skip to main content
    </a>
  );
}

function ReadingProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const t = document.documentElement.scrollTop || document.body.scrollTop;
      const h = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setP(h > 0 ? (t / h) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div
      role="progressbar" aria-valuenow={Math.round(p)} aria-valuemin={0} aria-valuemax={100}
      aria-label="Reading progress"
      style={{ position: "fixed", top: 0, left: 0, height: 3, width: `${p}%`, background: AMBER, zIndex: 50, transition: "width 0.1s linear" }}
    />
  );
}

/* Draw a richly-textured, photographic-style scene at a given scale.
   Photographic detail is exactly where compression artifacts hide — that's
   the honest reason the technique works, so the demo uses real texture. */
function paintScene(ctx, w, h) {
  // sky gradient
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, "#244b6b");
  sky.addColorStop(0.55, "#6f93ad");
  sky.addColorStop(0.75, "#d9c9a6");
  sky.addColorStop(1, "#b89b72");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  // soft sun glow
  const glow = ctx.createRadialGradient(w * 0.72, h * 0.32, 0, w * 0.72, h * 0.32, w * 0.4);
  glow.addColorStop(0, "rgba(255,243,214,0.9)");
  glow.addColorStop(1, "rgba(255,243,214,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  // distant ridge (hard-ish edge -> shows ringing at low q on 1:1)
  ctx.fillStyle = "#4a5d63";
  ctx.beginPath();
  ctx.moveTo(0, h * 0.62);
  let rng = 2461;
  const rand = () => { rng = (rng * 9301 + 49297) % 233280; return rng / 233280; };
  for (let x = 0; x <= w; x += w / 40) ctx.lineTo(x, h * 0.62 - rand() * h * 0.08);
  ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath(); ctx.fill();

  // foliage / foreground texture (mid-frequency detail = artifact camouflage)
  for (let i = 0; i < Math.floor(w * h / 90); i++) {
    const x = rand() * w;
    const y = h * 0.6 + rand() * h * 0.4;
    const s = 1 + rand() * (w / 130);
    const g = 60 + rand() * 90;
    ctx.fillStyle = `rgba(${20 + rand() * 30},${g},${30 + rand() * 40},${0.5 + rand() * 0.4})`;
    ctx.beginPath(); ctx.ellipse(x, y, s, s * 0.8, rand() * 3, 0, 7); ctx.fill();
  }
  // a couple of crisp verticals (reeds) — high-contrast edges
  ctx.strokeStyle = "rgba(245,245,235,0.85)";
  ctx.lineWidth = Math.max(1, w / 400);
  for (let i = 0; i < 6; i++) {
    const x = w * (0.1 + rand() * 0.8);
    ctx.beginPath(); ctx.moveTo(x, h); ctx.lineTo(x + (rand() - 0.5) * 20, h * 0.55); ctx.stroke();
  }
}

/* Build the default procedural scene onto a fresh canvas at the given size. */
function buildDefaultCanvas(w2, h2) {
  const c = document.createElement("canvas");
  c.width = w2; c.height = h2;
  paintScene(c.getContext("2d"), w2, h2);
  return c;
}

/* Draw an uploaded <img> into a canvas at the target size, cover-cropping
   so aspect ratio is preserved (no squashing). */
function imageToCanvas(img, w2, h2) {
  const c = document.createElement("canvas");
  c.width = w2; c.height = h2;
  const ctx = c.getContext("2d");
  ctx.imageSmoothingQuality = "high";
  const ir = img.width / img.height, br = w2 / h2;
  let sw, sh, sx, sy;
  if (ir > br) { sh = img.height; sw = sh * br; sx = (img.width - sw) / 2; sy = 0; }
  else { sw = img.width; sh = sw / br; sx = 0; sy = (img.height - sh) / 2; }
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w2, h2);
  return c;
}

/* encode a source canvas at a given output dimension + quality, return {url,bytes} */
function encode(srcCanvas, outW, outH, mime, quality) {
  return new Promise((resolve) => {
    const c = document.createElement("canvas");
    c.width = outW; c.height = outH;
    const ctx = c.getContext("2d");
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(srcCanvas, 0, 0, outW, outH);
    c.toBlob((blob) => {
      if (!blob) return resolve(null);
      resolve({ url: URL.createObjectURL(blob), bytes: blob.size });
    }, mime, quality);
  });
}

function kb(bytes) { return (bytes / 1024).toFixed(1); }

/* ----------------------------- DEMO 1: live slider ----------------------------- */

function QualitySliderDemo({ source }) {
  const DISP = 360, DH = 270;             // display box
  const srcCanvas = useMemo(
    () => (source ? imageToCanvas(source, DISP * 2, DH * 2) : buildDefaultCanvas(DISP * 2, DH * 2)),
    [source]
  );
  const [quality, setQuality] = useState(20);
  const [mime, setMime] = useState("image/jpeg");
  const [out, setOut] = useState(null);
  const [baseline, setBaseline] = useState(null); // accepted 2x @ q0.75
  const [ready, setReady] = useState(false);

  const recompute = useCallback(async () => {
    if (!srcCanvas) return;
    const trick = await encode(srcCanvas, DISP * 2, DH * 2, mime, quality / 100);
    const acc = await encode(srcCanvas, DISP * 2, DH * 2, mime, 0.75);
    setOut((p) => { if (p?.url) URL.revokeObjectURL(p.url); return trick; });
    setBaseline((p) => { if (p?.url) URL.revokeObjectURL(p.url); return acc; });
    setReady(true);
  }, [srcCanvas, mime, quality]);

  useEffect(() => { const t = setTimeout(recompute, 60); return () => clearTimeout(t); }, [recompute]);

  const savings = out && baseline ? Math.round((1 - out.bytes / baseline.bytes) * 100) : 0;

  return (
    <figure style={card()}>
      <figcaption style={demoLabel()}>Demo 1 — Live encoder - drag the quality down</figcaption>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "flex-start" }}>
        <div style={{ flex: "0 0 auto" }}>
          <div style={{ width: DISP, height: DH, borderRadius: 10, overflow: "hidden", background: "#ddd", border: `1px solid ${LINE}` }}>
            {out?.url && (
              <img src={out.url} alt="Compressed oversized image scaled into its display box"
                width={DISP} height={DH} style={{ display: "block", width: DISP, height: DH, objectFit: "cover" }} />
            )}
          </div>
          <div style={{ fontSize: 12, color: FAINT, marginTop: 8, textAlign: "center" }}>
            shown at {DISP}×{DH} - encoded at {DISP * 2}×{DH * 2}
          </div>
        </div>

        <div style={{ flex: "1 1 240px", minWidth: 240 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
            {[["image/jpeg", "JPEG"], ["image/webp", "WebP"]].map(([m, label]) => (
              <button key={m} onClick={() => setMime(m)} aria-pressed={mime === m}
                style={pill(mime === m)}>{label}</button>
            ))}
          </div>

          <label htmlFor="q" style={{ fontSize: 13, fontWeight: 600, color: INK, display: "block", marginBottom: 6 }}>
            Compression quality: <span style={{ color: AMBER, fontVariantNumeric: "tabular-nums" }}>{quality}%</span>
          </label>
          <input id="q" type="range" min={5} max={95} value={quality}
            onChange={(e) => setQuality(+e.target.value)}
            aria-valuetext={`${quality} percent quality`}
            style={{ width: "100%", accentColor: AMBER }} />

          <div style={{ marginTop: 22, display: "grid", gap: 10 }}>
            <Stat label={`Accepted Retina (@2x @ 75%)`} value={baseline ? `${kb(baseline.bytes)} KB` : "…"} muted />
            <Stat label={`Compressive (@2x @ ${quality}%)`} value={out ? `${kb(out.bytes)} KB` : "…"} accent />
            <div role="status" aria-live="polite" style={{
              marginTop: 4, padding: "10px 14px", borderRadius: 8,
              background: savings > 0 ? "#E6F4EE" : "#F6E9E9",
              color: savings > 0 ? GOOD : BAD, fontSize: 14, fontWeight: 600,
            }}>
              {ready ? (savings > 0
                ? `${savings}% smaller than the accepted method`
                : `${Math.abs(savings)}% larger - quality too high to win`) : "Encoding…"}
            </div>
          </div>
          <p style={{ fontSize: 12.5, color: MUTE, lineHeight: 1.6, marginTop: 16 }}>
            Every number is encoded live in your browser with <code style={codeInline()}>canvas.toBlob()</code> -
            these are real bytes, not asserted figures. Watch the file size collapse while the scaled-down
            image stays sharp.
          </p>
        </div>
      </div>
    </figure>
  );
}

/* ----------------------------- DEMO 2: can you tell? ----------------------------- */

function CanYouTellDemo({ source }) {
  const DISP = 300, DH = 225;
  const srcCanvas = useMemo(
    () => (source ? imageToCanvas(source, DISP * 2, DH * 2) : buildDefaultCanvas(DISP * 2, DH * 2)),
    [source]
  );
  const [accepted, setAccepted] = useState(null);
  const [compressive, setCompressive] = useState(null);
  const [fullSize, setFullSize] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!srcCanvas) return;
      const a = await encode(srcCanvas, DISP * 2, DH * 2, "image/jpeg", 0.75);
      const c = await encode(srcCanvas, DISP * 2, DH * 2, "image/jpeg", 0.2);
      if (!alive) return;
      setAccepted((p) => { if (p?.url) URL.revokeObjectURL(p.url); return a; });
      setCompressive((p) => { if (p?.url) URL.revokeObjectURL(p.url); return c; });
    })();
    return () => { alive = false; };
  }, [srcCanvas]);

  const panel = (data, title, sub, tone) => (
    <div style={{ flex: "1 1 240px", minWidth: 240 }}>
      <div style={{
        width: fullSize ? DISP * 2 : DISP, maxWidth: "100%",
        height: fullSize ? "auto" : DH, borderRadius: 10, overflow: "hidden",
        border: `1px solid ${LINE}`, background: "#ddd", transition: "width 0.35s ease",
      }}>
        {data?.url && (
          <img src={data.url}
            alt={`${title}, ${fullSize ? "shown at full encoded size" : "scaled into display box"}`}
            style={{ display: "block", width: "100%", height: "auto" }} />
        )}
      </div>
      <div style={{ marginTop: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: INK }}>{title}</div>
        <div style={{ fontSize: 12.5, color: MUTE }}>{sub}</div>
        <div style={{ fontSize: 13, fontWeight: 700, marginTop: 2, color: tone }}>
          {data ? `${kb(data.bytes)} KB` : "…"}
        </div>
      </div>
    </div>
  );

  return (
    <figure style={card()}>
      <figcaption style={demoLabel()}>Demo 2 — Can you actually tell?</figcaption>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
        {panel(accepted, "Accepted Retina", "@2x at 75% quality", BODY)}
        {panel(compressive, "Compressive", "@2x at 20% quality", AMBER)}
      </div>
      <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <button onClick={() => setFullSize((v) => !v)} aria-pressed={fullSize} style={pill(fullSize)}>
          {fullSize ? "↩ Scale back into the box" : "🔍 Reveal at full encoded size"}
        </button>
        <p style={{ fontSize: 12.5, color: MUTE, lineHeight: 1.6, margin: 0, flex: "1 1 220px" }}>
          At display size they're hard to separate. Hit reveal: the compressive version's artifacts
          appear at 1:1 - then vanish the moment the browser scales it back down. That gap is the
          whole technique.
        </p>
      </div>
    </figure>
  );
}

/* ----------------------------- DEMO 3: format table ----------------------------- */

/* Quality settings mirror the offline benchmark so live numbers are comparable. */
const Q = {
  "image/jpeg": { accepted: 0.75, trick2x: 0.20, trick4x: 0.10 },
  "image/webp": { accepted: 0.75, trick2x: 0.20, trick4x: 0.18 },
};
const AVIF_STATIC = { fmt: "AVIF", one: 23.1, accepted: 73.5, trick: 20.1, trick4x: 51.9, full4x: 172.1 };

function FormatBars({ source }) {
  const BW = 400, BH = 300;
  const srcCanvas = useMemo(
    () => (source ? imageToCanvas(source, BW * 4, BH * 4) : buildDefaultCanvas(BW * 4, BH * 4)),
    [source]
  );
  const [shown, setShown] = useState(false);
  const [density, setDensity] = useState("2x");
  const [live, setLive] = useState(null);   // [{fmt, one, accepted, trick, trick4x, full4x}]
  const ref = useRef(null);

  useEffect(() => {
    const ob = new IntersectionObserver(([e]) => e.isIntersecting && setShown(true), { threshold: 0.3 });
    if (ref.current) ob.observe(ref.current);
    return () => ob.disconnect();
  }, []);

  // recompute JPEG + WebP live whenever the source changes
  useEffect(() => {
    let alive = true;
    (async () => {
      if (!srcCanvas) return;
      const out = [];
      for (const [mime, name] of [["image/jpeg", "JPEG"], ["image/webp", "WebP"]]) {
        const q = Q[mime];
        const enc = async (scale, quality) => {
          const r = await encode(srcCanvas, BW * scale, BH * scale, mime, quality);
          return r ? r.bytes / 1024 : 0;
        };
        out.push({
          fmt: name,
          one: +(await enc(1, q.accepted)).toFixed(1),
          accepted: +(await enc(2, q.accepted)).toFixed(1),
          trick: +(await enc(2, q.trick2x)).toFixed(1),
          trick4x: +(await enc(4, q.trick4x)).toFixed(1),
          full4x: +(await enc(4, q.accepted)).toFixed(1),
        });
      }
      if (alive) setLive(out);
    })();
    return () => { alive = false; };
  }, [srcCanvas]);

  const data = live ? [...live, AVIF_STATIC] : BENCH;
  const is4x = density === "4x";
  const max = is4x ? Math.max(...data.map((b) => b.full4x)) : Math.max(...data.map((b) => b.accepted));

  const bar = (val, color) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ flex: 1, height: 22, background: "#F0ECE2", borderRadius: 5, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: shown ? `${(val / max) * 100}%` : 0, background: color,
          borderRadius: 5, transition: "width 0.9s cubic-bezier(.2,.7,.2,1)",
        }} />
      </div>
      <span style={{ fontSize: 12.5, fontWeight: 600, color: INK, width: 64, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
        {val} KB
      </span>
    </div>
  );

  return (
    <figure style={card()} ref={ref}>
      <figcaption style={demoLabel()}>Demo 3 — Does it survive modern formats &amp; densities?</figcaption>

      <div style={{ display: "flex", gap: 8, marginBottom: 22, flexWrap: "wrap" }}>
        {[["2x", "@2x screens"], ["4x", "@4x screens"]].map(([k, label]) => (
          <button key={k} onClick={() => setDensity(k)} aria-pressed={density === k} style={pill(density === k)}>
            {label}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gap: 22 }}>
        {data.map((b) => {
          const isAvif = b.fmt === "AVIF";
          const trickVal = is4x ? b.trick4x : b.trick;
          const cut = Math.round((1 - trickVal / b.accepted) * 100);
          const vs1x = Math.round((1 - trickVal / b.one) * 100);
          return (
            <div key={b.fmt}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: INK }}>
                  {b.fmt}
                  <span style={{ fontSize: 11, fontWeight: 500, color: FAINT }}>
                    {isAvif ? " — measured offline" : " — live in your browser"}
                  </span>
                </span>
                <span style={{ fontSize: 12.5, color: cut > 0 ? GOOD : BAD, fontWeight: 600 }}>
                  {cut > 0 ? `−${cut}%` : `+${Math.abs(cut)}%`} vs accepted @2x
                </span>
              </div>
              <div style={{ display: "grid", gap: 6 }}>
                {bar(b.one, FAINT)}
                {bar(b.accepted, BAD)}
                {is4x && bar(b.full4x, "#C98A8A")}
                {bar(trickVal, AMBER)}
              </div>
              <div style={{ fontSize: 12, color: MUTE, marginTop: 6 }}>
                vs the plain @1x baseline: {vs1x > 0
                  ? <span style={{ color: GOOD, fontWeight: 600 }}>{vs1x}% smaller</span>
                  : <span style={{ color: BAD, fontWeight: 600 }}>{Math.abs(vs1x)}% larger</span>}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 18, display: "flex", gap: 16, flexWrap: "wrap", fontSize: 12, color: MUTE }}>
        <Legend c={FAINT} t="@1x baseline (not Retina)" />
        <Legend c={BAD} t="Accepted @2x @ full quality" />
        {is4x && <Legend c="#C98A8A" t="Full-quality @4x (the naive way)" />}
        <Legend c={AMBER} t={is4x ? "Compressive @4x @ low quality" : "Compressive @2x @ low quality"} />
      </div>

      <p style={{ fontSize: 12.5, color: MUTE, lineHeight: 1.6, marginTop: 14 }}>
        {source
          ? "JPEG and WebP bars are encoded live from your uploaded image; AVIF can't be encoded in-browser, so its row stays at the offline-measured figures. Upload a flatter graphic or a text-heavy image and watch the win shrink — that's the boundary."
          : (is4x
            ? "For @4x screens, the naive \"serve a full-quality @4x asset\" approach is brutal. A compressive @4x file pushed to lower quality lands competitive with or below the accepted @2x, and AVIF wins outright. The denser the screen, the harder you can compress."
            : "The headline holds in every format: a large cut off the accepted Retina method. The honest part — against a plain @1x image, the win is image-dependent. JPEG and WebP here are computed live; AVIF is offline-measured.")}
      </p>
    </figure>
  );
}

/* ----------------------------- DEMO 4: next/image tension ----------------------------- */

function NextImageDemo() {
  const [pipeline, setPipeline] = useState("legacy");
  const scenarios = {
    legacy: {
      label: "Legacy / constrained",
      examples: "HTML email - a CMS that rewrites markup - a Shopify theme you can't fully control",
      verdict: "Compressive images win",
      tone: GOOD,
      detail: "No reliable srcset, no format negotiation, often a single fixed asset. One oversized low-quality file is the most robust lever you have - it needs no server, no <picture>, no build step.",
    },
    nextimg: {
      label: "next/image pipeline",
      examples: "A greenfield Next.js app using <Image> with automatic optimization",
      verdict: "Let the framework lead — mostly",
      tone: AMBER,
      detail: "next/image already negotiates AVIF/WebP and generates a srcset per device. Hand-feeding it a pre-compressed oversized asset can double-compress or fight its resizer. Feed it a clean high-quality source and turn the quality prop down instead (e.g. quality={45}) - same perceptual logic, applied through the tool rather than around it.",
    },
  };
  const s = scenarios[pipeline];
  return (
    <figure style={card()}>
      <figcaption style={demoLabel()}>Demo 4 — When does it still earn its place?</figcaption>
      <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
        {Object.entries(scenarios).map(([k, v]) => (
          <button key={k} onClick={() => setPipeline(k)} aria-pressed={pipeline === k} style={pill(pipeline === k)}>
            {v.label}
          </button>
        ))}
      </div>
      <div style={{ background: PAPER, border: `1px solid ${LINE}`, borderRadius: 10, padding: 20 }}>
        <div style={{ fontSize: 12, color: FAINT, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>
          You're working in
        </div>
        <div style={{ fontSize: 15, color: BODY, margin: "4px 0 14px" }}>{s.examples}</div>
        <div style={{
          display: "inline-block", padding: "6px 14px", borderRadius: 20, fontSize: 13, fontWeight: 700,
          background: s.tone === GOOD ? "#E6F4EE" : AMBER_SOFT, color: s.tone,
        }}>
          {s.verdict}
        </div>
        <p style={{ fontSize: 14, color: BODY, lineHeight: 1.7, margin: "14px 0 0" }}>{s.detail}</p>
      </div>
    </figure>
  );
}

/* ----------------------------- small UI helpers ----------------------------- */

function Uploader({ img, onImage, onReset }) {
  const inputRef = useRef(null);
  const [err, setErr] = useState("");

  const handleFile = (file) => {
    setErr("");
    if (!file) return;
    if (/heic|heif/i.test(file.type) || /\.hei[cf]$/i.test(file.name)) {
      setErr("HEIC/HEIF images can't be decoded in the browser — please use a JPG, PNG, or WebP.");
      return;
    }
    if (!file.type.startsWith("image/")) { setErr("That doesn't look like an image file."); return; }
    // Use a base64 data URL (FileReader) rather than a blob: URL — blob URLs are
    // blocked by some sandbox CSPs, which surfaces as a false "decode" failure.
    const reader = new FileReader();
    reader.onload = () => {
      const im = new Image();
      im.onload = () => onImage(im, file);
      im.onerror = () => setErr("Couldn't decode that image — try a different JPG or PNG.");
      im.src = reader.result;
    };
    reader.onerror = () => setErr("Couldn't read that file — try another image.");
    reader.readAsDataURL(file);
  };

  return (
    <div style={{
      border: `1.5px dashed ${LINE}`, borderRadius: 14, padding: "20px 22px",
      background: "#fff", display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap",
    }}>
      <div style={{ flex: "1 1 260px" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: INK, marginBottom: 4 }}>
          {img ? "Using your image" : "Test it on your own photo"}
        </div>
        <p style={{ fontSize: 13, color: MUTE, lineHeight: 1.6, margin: 0 }}>
          {img
            ? "Every demo below now re-encodes your uploaded image, live, in your browser. Nothing is sent anywhere."
            : "The demos use a built-in test scene by default. Upload a real photograph and every number below recomputes on it. Photographs work best; flat graphics and text compress differently."}
        </p>
        {err && <p role="alert" style={{ fontSize: 12.5, color: BAD, margin: "8px 0 0" }}>{err}</p>}
      </div>
      <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
        <button onClick={() => inputRef.current?.click()} style={{ ...pill(true), padding: "9px 18px" }}>
          {img ? "Choose another" : "Upload an image"}
        </button>
        {img && (
          <button onClick={onReset} style={{ ...pill(false), padding: "9px 18px" }}>
            Reset to demo image
          </button>
        )}
        <input
          ref={inputRef} type="file" accept="image/*"
          aria-label="Upload an image to test the compression demos"
          onChange={(e) => handleFile(e.target.files?.[0])}
          style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0 0 0 0)", border: 0 }}
        />
      </div>
    </div>
  );
}

function Stat({ label, value, accent, muted }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "8px 12px", borderRadius: 8, background: accent ? AMBER_SOFT : "#F4F1E9" }}>
      <span style={{ fontSize: 13, color: muted ? MUTE : INK }}>{label}</span>
      <span style={{ fontSize: 15, fontWeight: 700, color: accent ? AMBER : INK, fontVariantNumeric: "tabular-nums" }}>{value}</span>
    </div>
  );
}
function Legend({ c, t }) {
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
    <span style={{ width: 11, height: 11, borderRadius: 3, background: c, display: "inline-block" }} />{t}
  </span>;
}
const card = () => ({ background: "#fff", border: `1px solid ${LINE}`, borderRadius: 16, padding: 28, margin: "2.5rem 0", boxShadow: "0 1px 3px rgba(28,27,25,0.04), 0 8px 24px rgba(28,27,25,0.04)" });
const demoLabel = () => ({ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: AMBER, fontWeight: 700, marginBottom: 18 });
const pill = (active) => ({ padding: "7px 16px", borderRadius: 8, border: `1.5px solid ${active ? AMBER : LINE}`, background: active ? AMBER_SOFT : "#fff", color: active ? AMBER : BODY, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all .2s ease" });
const codeInline = () => ({ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.86em", background: "#F1EFE8", padding: "1px 6px", borderRadius: 4, color: AMBER });

/* ----------------------------- density shift visual ----------------------------- */

function DensityShift() {
  const [shown, setShown] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const ob = new IntersectionObserver(([e]) => e.isIntersecting && setShown(true), { threshold: 0.4 });
    if (ref.current) ob.observe(ref.current);
    return () => ob.disconnect();
  }, []);

  // Illustrative split of traffic by display density, 2015 vs 2026.
  const eras = [
    {
      year: "~2015", caption: "High-density was a premium exception",
      segs: [
        { label: "Standard (1×)", pct: 70, color: FAINT },
        { label: "High-density (2×+)", pct: 30, color: AMBER },
      ],
    },
    {
      year: "2026", caption: "High-density is the baseline for most traffic",
      segs: [
        { label: "Standard (1×)", pct: 25, color: FAINT },
        { label: "High-density (2×+)", pct: 75, color: AMBER },
      ],
    },
  ];

  return (
    <figure style={card()} ref={ref}>
      <figcaption style={demoLabel()}>The landscape moved — display density, 2015 → 2026</figcaption>
      <div style={{ display: "grid", gap: 24 }}>
        {eras.map((era) => (
          <div key={era.year}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: INK, fontVariantNumeric: "tabular-nums" }}>{era.year}</span>
              <span style={{ fontSize: 12.5, color: MUTE }}>{era.caption}</span>
            </div>
            <div
              role="img"
              aria-label={`${era.year}: ${era.segs.map((s) => `${s.pct} percent ${s.label}`).join(", ")}`}
              style={{ display: "flex", height: 34, borderRadius: 7, overflow: "hidden", border: `1px solid ${LINE}` }}
            >
              {era.segs.map((s, i) => (
                <div key={i} style={{
                  width: shown ? `${s.pct}%` : "0%",
                  background: s.color,
                  transition: `width 0.9s cubic-bezier(.2,.7,.2,1) ${i * 0.12}s`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: s.color === AMBER ? "#fff" : INK, fontSize: 12, fontWeight: 600,
                  whiteSpace: "nowrap", overflow: "hidden",
                }}>
                  {s.pct >= 20 ? `${s.pct}%` : ""}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16, display: "flex", gap: 16, flexWrap: "wrap", fontSize: 12, color: MUTE }}>
        <Legend c={FAINT} t="Standard-density (1×) displays" />
        <Legend c={AMBER} t="High-density (2×, 3×, 4×) displays" />
      </div>
      <p style={{ fontSize: 12.5, color: MUTE, lineHeight: 1.6, marginTop: 14 }}>
        Illustrative, not a single sourced dataset - density splits vary by region, device class, and how
        you count desktop OS scaling. The direction is the point: in 2015 high-density screens were mostly
        premium iPhones and a few laptops; today nearly every smartphone reports a device pixel ratio of
        2× or more, and mobile is the majority of web traffic. The spare pixels this technique relies on
        used to be rare. Now they're everywhere.
      </p>
    </figure>
  );
}

/* ----------------------------- page ----------------------------- */

export default function CompressiveImages() {
  const [source, setSource] = useState(null);   // uploaded HTMLImageElement, or null = demo scene
  const [fileName, setFileName] = useState("");
  const handleImage = (img, file) => { setSource(img); setFileName(file?.name || ""); };
  const handleReset = () => { setSource(null); setFileName(""); };

  return (
    <div style={{ fontFamily: "'Source Sans 3', -apple-system, BlinkMacSystemFont, sans-serif", color: INK, background: PAPER, maxWidth: "100%", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;500;600;700&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&family=JetBrains+Mono:wght@400;500&display=swap');
        @keyframes fadeSlideIn { from { opacity:0; transform:translateY(14px);} to {opacity:1; transform:translateY(0);} }
        * { box-sizing:border-box; margin:0; padding:0; }
        .prose p { font-size:17px; line-height:1.8; color:${BODY}; margin-bottom:1.5rem; font-family:'Source Serif 4', Georgia, serif; }
        .prose h2 { font-size:25px; font-weight:600; color:${INK}; margin:3.25rem 0 1rem; font-family:'Source Sans 3', sans-serif; letter-spacing:-0.01em; }
        .prose h2 .marker { color:${AMBER}; font-family:'JetBrains Mono', monospace; font-size:15px; font-weight:500; display:block; margin-bottom:4px; letter-spacing:0; }
        .prose strong { color:${INK}; font-weight:600; }
        .prose em { color:${AMBER}; font-style:italic; }
        .prose code { font-family:'JetBrains Mono', monospace; font-size:14px; background:#F1EFE8; padding:2px 8px; border-radius:4px; color:${AMBER}; }
        .prose blockquote { border-left:3px solid ${AMBER}; padding-left:24px; margin:2rem 0; }
        .prose blockquote p { font-style:italic; color:${INK}; font-size:19px; line-height:1.6; }
        .credit { background:#fff; border:1px solid ${LINE}; border-radius:12px; padding:20px 24px; margin:2rem 0; }
        .credit p { font-size:14.5px !important; line-height:1.7 !important; color:${MUTE} !important; margin:0 !important; font-family:'Source Sans 3', sans-serif !important; }
        a.ref { color:${AMBER}; text-decoration:none; border-bottom:1px solid ${AMBER}55; }
        button:focus-visible, a:focus-visible, input:focus-visible { outline:3px solid ${AMBER}; outline-offset:2px; }
      `}</style>

      <SkipLink />
      <ReadingProgress />

      <header style={{ padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${LINE}`, position: "sticky", top: 0, background: "rgba(251,250,246,0.9)", backdropFilter: "blur(8px)", zIndex: 40 }}>
        <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.01em" }}>Calley Nye</span>
        <nav aria-label="Main navigation">
          <div style={{ display: "flex", gap: 24 }}>
            {["Writing", "Projects", "About"].map((i) => (
              <a key={i} href="#" style={{ fontSize: 14, color: MUTE, textDecoration: "none", fontWeight: 500 }}>{i}</a>
            ))}
          </div>
        </nav>
      </header>

      <main id="main">
        <article>
          <div style={{ padding: "80px 24px 40px", maxWidth: 720, margin: "0 auto", animation: "fadeSlideIn 0.6s ease forwards" }}>
            <div style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: AMBER, fontWeight: 600, marginBottom: 16 }}>
              Performance &middot; Image delivery &middot; Engineering judgment
            </div>
            <h1 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: "clamp(32px,5vw,46px)", fontWeight: 600, lineHeight: 1.18, color: INK, marginBottom: 20, letterSpacing: "-0.02em" }}>
              The retina image trick everyone forgot — and whether it still holds up in 2026
            </h1>
            <p style={{ fontSize: 18, lineHeight: 1.7, color: MUTE, fontFamily: "'Source Serif 4', Georgia, serif", marginBottom: 32 }}>
              A decade ago I started using a counterintuitive way to serve sharp Retina images from a
              single file - encode it at double the resolution and crush the quality. It still works in
              2026. The more interesting question is why, and where it stops working.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 16, borderTop: `1px solid ${LINE}` }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg,#D9923F 0%,${AMBER} 100%)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14, fontWeight: 700 }}>CN</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>Calley Nye</div>
                <div style={{ fontSize: 13, color: FAINT }}>Senior Software Engineer &middot; Performance &amp; Accessibility</div>
              </div>
            </div>
          </div>

          <div className="prose" style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px 80px" }}>
            <p>
              In 2015 I built a CodePen to settle an argument with my team. We needed Retina images at
              Crowdrise, and everyone "knew" how to do it: keep two copies of every asset, an @1x and a
              full-quality @2x, and hand the browser the heavy one on high-density screens. It worked, but
              it meant maintaining a doubled asset pipeline for every image on the site - and I was
              convinced there was a better way. I'd read you could cheat. Before arguing to roll it out
              sitewide, I wanted proof, so I built the demo. It convinced me - and I shipped the technique
              across Crowdrise.
            </p>

            <p>
              The cheat: save the image at <strong>twice</strong> the display dimensions - an @2x source -
              then drop the JPEG quality to something that looks frankly broken at full size - 20%. When
              the browser scales that oversized, low-quality image down into its actual display box, the
              compression artifacts shrink below the threshold your eye can resolve. What's left looks
              crisp. And the file is smaller than a conventional full-quality @2x - in my original test,
              smaller than the non-Retina @1x too.
            </p>

            <div className="credit">
              <p>
                <strong style={{ color: INK }}>Where this comes from.</strong> The technique has a name -
                <em style={{ color: AMBER, fontStyle: "italic" }}> compressive images</em> - coined by
                Daan Jobsis in his "Retina Revolution" experiments and popularized by Filament Group
                around 2012. I picked it up early and have reached for it ever since; the work here is
                re-testing it against the formats and tooling that have appeared in the decade since.
              </p>
            </div>

            <h2><span className="marker">01</span>The assumption hiding inside the best practice</h2>
            <p>
              The accepted Retina workflow wasn't wrong - it was built on an assumption nobody stated out
              loud: that per-pixel quality has to stay high. Compressive images show that assumption is
              conditional. At Retina density the display packs so many pixels into so little physical space
              that the eye <strong>can't resolve</strong> the lost fidelity. You were spending bytes on a
              quality no one could actually see.
            </p>

            <h2><span className="marker">02</span>See it work — live, in your browser</h2>
            <p>
              Numbers in a blog post are easy to fudge, so I'm not going to ask you to trust mine. The
              demos below encode a real image in your browser and report the actual bytes the encoder
              produced. They run on a built-in test scene by default - or upload your own photograph and
              every figure on this page recomputes on it.
            </p>

            <div style={{ margin: "2rem 0" }}>
              <Uploader img={source} onImage={handleImage} onReset={handleReset} />
              {fileName && (
                <div style={{ fontSize: 12, color: FAINT, marginTop: 8 }}>
                  Loaded: {fileName} - processed entirely on your device.
                </div>
              )}
            </div>

            <p>
              Push the quality down and watch what happens to the file size - and to the picture.
            </p>

            <QualitySliderDemo source={source} />

            <p>
              The discomfort is the point: it feels wrong to ship a 20% JPEG. So here's the side-by-side
              that resolves it. Two versions of the same image - the accepted full-quality @2x, and the
              compressive @2x - both scaled into their display box. Then reveal them at full size.
            </p>

            <CanYouTellDemo source={source} />

            <h2><span className="marker">03</span>Why the bet is safer now than in 2015</h2>
            <p>
              The technique makes a wager: that the screen has spare device pixels to hide artifacts
              behind. In 2015 that wager only paid off for a minority - mostly premium phones and a few
              high-end laptops. Ship a compressive image to someone on a standard display back then and you
              were just sending a needlessly large file. What changed isn't the technique. It's who's on
              the other end of it.
            </p>

            <DensityShift />

            <p>
              High-density rendering went from novelty to default. Today almost no smartphone reports a
              device pixel ratio of 1, ratios of 2× and 3× are routine, some Android flagships hit 4×, and
              phones are the majority of traffic on the web. The conditions that make compressive images
              work quietly became the common case - the opposite trajectory from most decade-old
              front-end tricks.
            </p>

            <h2><span className="marker">04</span>Does a 2015 trick survive the 2026 stack?</h2>
            <p>
              This is where most "clever trick" posts quietly date themselves. The real modern baseline
              isn't a full-quality @2x JPEG anymore - it's <code>srcset</code> plus AVIF or WebP, formats
              that are dramatically more efficient than JPEG ever was. So the technique deserves a re-test
              against them, not a victory lap on decade-old numbers.
            </p>

            <FormatBars source={source} />

            <p>
              The result is split. The headline survives everywhere: at @2x, compressive encoding cuts the
              accepted Retina method by roughly <strong>60% across JPEG, WebP, and AVIF</strong>. But the
              bolder claim from the original 2015 pen - "smaller than even the @1x image" - is
              <em> image-dependent</em>. On this photographic test image it cleared @1x in AVIF and fell
              short in JPEG and WebP. Anyone claiming the trick always beats a plain @1x is overselling it;
              careful testers found the same wobble back in 2013.
            </p>
            <p>
              Toggle the demo to <strong>@4x</strong> and the more striking story appears. The naive answer
              to ultra-dense screens - ship a full-quality @4x asset - is punishing: a quarter-megabyte in
              JPEG, triple the accepted @2x. But a compressive @4x file, pushed to a lower quality, lands
              competitive with the accepted @2x and beats it outright in AVIF. This is the technique's own
              logic taken to its limit: the denser the display, the more aggressively you can compress,
              because each artifact occupies a smaller slice of physical space. @4x is where the idea is
              arguably most valuable, precisely because the conventional alternative is so heavy.
            </p>

            <h2><span className="marker">05</span>So when should you actually reach for it?</h2>
            <p>
              An optimization is only worth as much as your sense of where it stops paying off. Compressive
              images have a clear boundary, and it falls right along the line between the pipeline you
              control and the one you don't.
            </p>

            <NextImageDemo />

            <p>
              For anyone not deep in the framework: <code>next/image</code> is the image component built
              into Next.js, and it automates most of what you used to hand-build. You give it one
              high-quality source; at request time it reads what the browser can display and serves AVIF,
              WebP, or JPEG accordingly, generates a per-device <code>srcset</code> so each screen
              downloads roughly the size it needs, lazy-loads below-the-fold images, and reserves their
              layout space so the page doesn't lurch as they arrive. The thing I hated at Crowdrise -
              hand-maintaining a doubled asset pipeline - it simply does for you.
            </p>
            <p>
              Which leads to the genuinely current point. <code>next/image</code> already implements half
              of the compressive idea (smaller, format-negotiated, right-sized images) and actively
              <em> fights</em> the other half. Hand it a pre-baked compressive asset - already oversized
              and crushed - and it treats your degraded file as a pristine source and re-encodes it
              <em> again</em>: compression on top of compression, artifacts on top of artifacts, fed
              through a resizer that doesn't expect the dimension-to-quality relationship you engineered.
              You'd be fighting the framework instead of using it.
            </p>
            <p>
              So in a modern Next pipeline you don't rebuild the trick by hand - you express its
              <em> insight</em> through the framework's own controls. Feed <code>next/image</code> a clean
              high-quality source and turn the <code>quality</code> prop down (something like
              <code>quality=&#123;45&#125;</code>), because the same perceptual logic still holds: on the
              high-density variants it generates, aggressive quality is invisible. Same idea I shipped at
              Crowdrise in 2015 - now applied through the tool rather than around it. The hand-built
              version stays in your pocket for the places <code>next/image</code> can't reach: email, a
              CMS that rewrites your markup, a Shopify Liquid theme you don't fully own.
            </p>

            <blockquote>
              <p>
                The trick was never the valuable part. The valuable part is re-checking an inherited
                assumption against current conditions instead of carrying it forward on faith.
              </p>
            </blockquote>

            <h2><span className="marker">06</span>Why this still matters</h2>
            <p>
              It would be easy to file compressive images under "obsolete - we have AVIF now." That's the
              mistake. An enormous amount of the web still runs on JPEG pipelines, locked-down CMSs, and
              email clients where you cannot serve a modern format or reliably control <code>srcset</code>
              even if you wanted to. Optimizing for the greenfield demo is easy. Optimizing for the messy
              systems people are actually stuck maintaining is the harder, more common job - and there,
              one oversized low-quality asset with no switching logic still reaches where modern tooling
              can't.
            </p>
            <p>
              And the ground has shifted in the technique's favor. In 2015, the device density it depends
              on was a premium-phone novelty. In 2026 it's the default for most of the traffic on the web.
              The bet compressive images quietly makes - that there are spare device pixels to hide
              artifacts behind - is now a safe bet far more often than it was when the idea was new.
            </p>

            <div style={{ marginTop: "4rem", paddingTop: "2rem", borderTop: `1px solid ${LINE}` }}>
              <p style={{ fontSize: 14, color: FAINT, fontFamily: "'Source Sans 3', sans-serif" }}>
                Benchmark figures were measured offline with Pillow on a photographic test image at @1x,
                @2x, and @4x (JPEG, WebP, AVIF). The live demos encode in-browser via
                <code style={{ fontSize: 12 }}>canvas.toBlob()</code>; AVIF can't be encoded in-canvas, so
                its figures are the offline-measured ones, labeled as such. Prior art: Daan Jobsis,
                "Retina Revolution"; Filament Group, "Compressive Images" (2012).
              </p>
            </div>
          </div>
        </article>
      </main>

      <footer style={{ padding: "40px 24px", borderTop: `1px solid ${LINE}`, maxWidth: 720, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 13, color: FAINT }}>&copy; 2026 Calley Nye</span>
        <div style={{ display: "flex", gap: 20 }}>
          {["LinkedIn", "GitHub"].map((l) => (
            <a key={l} href="#" style={{ fontSize: 13, color: MUTE, textDecoration: "none" }}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
