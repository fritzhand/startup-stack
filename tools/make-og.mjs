/* ============================================================
   make-og.mjs — regenerate the social card at web/assets/og.png

   Run it when the tagline, the site name or the four counts on the
   card change:

     node tools/make-og.mjs

   It writes web/assets/og.svg (the source) and rasterises it to
   web/assets/og.png at 1200x630, which is what Open Graph and
   Twitter actually read — neither renders SVG.

   Rasterising needs a headless Chromium, which is why this is a
   separate script and not part of `node web/build.mjs`: the site
   build stays dependency-free and runs anywhere, and the card is
   a committed artifact that changes a few times a year.

   web/build.mjs asserts that the counts written here still match
   the repository, and fails the build if they have drifted. That
   check is the reason a stale card cannot ship quietly.

   Only system fonts are used. A webfont would need network access
   at rasterise time and would render differently depending on
   whether it arrived.
   ============================================================ */
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdtempSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import { execFileSync } from "node:child_process";
import { inflateSync, deflateSync } from "node:zlib";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const ASSETS = join(ROOT, "web", "assets");
const CONFIG = JSON.parse(readFileSync(join(ROOT, "site.config.json"), "utf8"));

const md = (dir, re = /\.md$/) => readdirSync(join(ROOT, dir)).filter((f) => re.test(f));
const counts = {
  sections: readdirSync(join(ROOT, "stack")).filter((f) => /^\d\d-/.test(f)).length,
  prompts: md("prompts").filter((f) => /^\d\d-/.test(f)).length,
  worksheets: md("worksheets").filter((f) => f !== "README.md").length,
  infographics: readdirSync(join(ROOT, "web", "infographics")).filter((f) => f.endsWith(".webp")).length,
};

const SITE_URL = new URL(CONFIG.siteBase);
const SITE_HOST = (SITE_URL.host + SITE_URL.pathname).replace(/\/$/, "");

const FONT = "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

/* the stack glyph, same three strokes as the header mark and the favicon */
const GLYPH = '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/>';

const chip = (x, label) => {
  const w = label.length * 11.4 + 40;
  return { w, svg: `<g transform="translate(${x} 452)">
    <rect width="${w}" height="52" rx="26" fill="#ffffff" fill-opacity="0.10" stroke="#ffffff" stroke-opacity="0.28"/>
    <text x="${w / 2}" y="33" text-anchor="middle" font-family="${FONT}" font-size="20" font-weight="600" fill="#eaf4f8">${esc(label)}</text>
  </g>` };
};

let x = 72;
const chips = [
  `${counts.sections} sections`,
  `${counts.prompts} prompts`,
  `${counts.worksheets} worksheets`,
  `${counts.infographics} infographics`,
].map((label) => { const c = chip(x, label); x += c.w + 14; return c.svg; }).join("\n");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0a3d5c"/><stop offset=".52" stop-color="#0b5a86"/><stop offset="1" stop-color="#0c5f6b"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- the mark, at the same proportion inside its square as the header -->
  <g transform="translate(72 66)">
    <rect width="76" height="76" rx="18" fill="#ffffff" fill-opacity="0.12" stroke="#ffffff" stroke-opacity="0.26"/>
    <g transform="translate(14 14) scale(2)" fill="none" stroke="#ffffff" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">${GLYPH}</g>
  </g>
  <text x="168" y="116" font-family="${FONT}" font-size="38" font-weight="700" fill="#ffffff">startup<tspan fill="#9fd0e2">-stack</tspan></text>

  <text x="72" y="258" font-family="${FONT}" font-size="52" font-weight="700" fill="#ffffff">The documents every startup</text>
  <text x="72" y="322" font-family="${FONT}" font-size="52" font-weight="700" fill="#ffffff">should have — as a knowledge base</text>
  <text x="72" y="386" font-family="${FONT}" font-size="52" font-weight="700" fill="#9fd0e2">an AI can actually read.</text>

${chips}

  <text x="72" y="570" font-family="${FONT}" font-size="21" fill="#ffffff" fill-opacity="0.72">${esc(SITE_HOST)}</text>
  <text x="1128" y="570" text-anchor="end" font-family="${FONT}" font-size="21" fill="#ffffff" fill-opacity="0.55">Open source · MIT</text>
</svg>
`;

writeFileSync(join(ASSETS, "og.svg"), svg);

/* Rasterise through an HTML wrapper rather than pointing Chromium at the SVG
   directly: a bare SVG document inherits the browser's 8px body margin, which
   shifts the card down and clips the last two lines off the bottom. */
writeFileSync(join(ASSETS, "og.html"),
  `<!doctype html><meta charset="utf-8"><style>html,body{margin:0;padding:0;overflow:hidden}svg{display:block}</style>${svg}`);

const chromes = [
  process.env.CHROME_PATH,
  ...(existsSync("/opt/pw-browsers") ? readdirSync("/opt/pw-browsers")
    .filter((d) => d.startsWith("chromium-"))
    .map((d) => join("/opt/pw-browsers", d, "chrome-linux", "chrome")) : []),
  "/usr/bin/chromium", "/usr/bin/google-chrome",
].filter((p) => p && existsSync(p));

if (!chromes.length) {
  console.error("og.svg written, but no Chromium found to rasterise it.\nSet CHROME_PATH and run again.");
  process.exit(1);
}

/* ---- a minimal PNG crop, on zlib alone ----
   Only ever fed Chromium's own screenshots, so it handles the two shapes those
   come in: 8-bit RGB or RGBA, no interlacing, no palette. Anything else is
   refused rather than silently mangled. */
function cropPNG(buf, w, h) {
  const SIG = "89504e470d0a1a0a";
  if (buf.subarray(0, 8).toString("hex") !== SIG) throw new Error("not a PNG");

  const chunks = [];
  for (let i = 8; i < buf.length;) {
    const len = buf.readUInt32BE(i);
    chunks.push({ type: buf.subarray(i + 4, i + 8).toString("ascii"), data: buf.subarray(i + 8, i + 8 + len) });
    i += 12 + len;
  }
  const ihdr = chunks.find((c) => c.type === "IHDR").data;
  const srcW = ihdr.readUInt32BE(0), srcH = ihdr.readUInt32BE(4);
  const [depth, colour, , , interlace] = [ihdr[8], ihdr[9], ihdr[10], ihdr[11], ihdr[12]];
  if (depth !== 8 || (colour !== 2 && colour !== 6) || interlace !== 0) throw new Error(`unexpected PNG format: depth ${depth}, colour ${colour}, interlace ${interlace}`);
  if (srcW < w || srcH < h) throw new Error(`screenshot is ${srcW}x${srcH}, smaller than the ${w}x${h} card`);

  const bpp = colour === 6 ? 4 : 3, srcStride = srcW * bpp;
  const raw = inflateSync(Buffer.concat(chunks.filter((c) => c.type === "IDAT").map((c) => c.data)));

  /* undo the per-scanline filters, keeping only the rows and columns wanted */
  const prev = Buffer.alloc(srcStride), line = Buffer.alloc(srcStride);
  const out = Buffer.alloc(h * (w * bpp + 1));
  for (let y = 0, p = 0; y < srcH; y++) {
    const filter = raw[p++];
    raw.copy(line, 0, p, p + srcStride);
    p += srcStride;
    for (let i = 0; i < srcStride; i++) {
      const a = i >= bpp ? line[i - bpp] : 0, b = prev[i], c = i >= bpp ? prev[i - bpp] : 0;
      let v = line[i];
      if (filter === 1) v += a;
      else if (filter === 2) v += b;
      else if (filter === 3) v += (a + b) >> 1;
      else if (filter === 4) {
        const pa = Math.abs(b - c), pb = Math.abs(a - c), pc = Math.abs(a + b - 2 * c);
        v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      } else if (filter !== 0) throw new Error(`unknown PNG filter ${filter}`);
      line[i] = v & 0xff;
    }
    if (y < h) {
      const at = y * (w * bpp + 1);
      out[at] = 0;                                  // write every row back unfiltered
      line.copy(out, at + 1, 0, w * bpp);
    }
    line.copy(prev);
  }

  const chunk = (type, data) => {
    const b = Buffer.alloc(data.length + 12);
    b.writeUInt32BE(data.length, 0);
    b.write(type, 4, "ascii");
    data.copy(b, 8);
    b.writeInt32BE(crc32(b.subarray(4, 8 + data.length)), 8 + data.length);
    return b;
  };
  const newIhdr = Buffer.from(ihdr);
  newIhdr.writeUInt32BE(w, 0); newIhdr.writeUInt32BE(h, 4);
  return Buffer.concat([
    Buffer.from(SIG, "hex"),
    chunk("IHDR", newIhdr),
    chunk("IDAT", deflateSync(out, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc32 = (b) => {
  let c = 0xffffffff;
  for (const byte of b) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) | 0;
};

const W = 1200, H = 630;
const profile = mkdtempSync(join(tmpdir(), "og-"));
const chrome = (args) => execFileSync(chromes[0], [
  "--headless", "--disable-gpu", "--no-sandbox", "--hide-scrollbars",
  `--user-data-dir=${profile}`, "--force-device-scale-factor=1", ...args,
], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });

try {
  /* --window-size is the window, not the viewport, and how much of it the
     window keeps for itself differs by Chromium build — this one reserves 87
     vertical pixels even headless. Guessing that number bakes a white band
     into the bottom of the card. Measure it instead: render a probe, read the
     viewport it actually got, and add the shortfall back. */
  const probe = join(profile, "probe.html");
  writeFileSync(probe, `<!doctype html><body><p id="o"></p><script>o.textContent="VP:"+innerWidth+"x"+innerHeight<\/script>`);
  const dom = chrome([`--window-size=${W},${H}`, "--dump-dom", `file://${probe}`]);
  const m = dom.match(/VP:(\d+)x(\d+)/);
  if (!m) throw new Error("could not measure the headless viewport");
  const winW = W + (W - Number(m[1]));
  const winH = H + (H - Number(m[2]));

  /* The screenshot comes out at --window-size, while only the viewport within
     it is painted — so the card is the top-left W x H of a larger image, and
     the rest is unpainted white. Crop it back. */
  const shot = join(profile, "shot.png");
  chrome([`--window-size=${winW},${winH}`, `--screenshot=${shot}`, `file://${join(ASSETS, "og.html")}`]);
  writeFileSync(join(ASSETS, "og.png"), cropPNG(readFileSync(shot), W, H));
} finally {
  rmSync(profile, { recursive: true, force: true });
  rmSync(join(ASSETS, "og.html"), { force: true });   // a scaffold, not an asset
}

console.log(`og.png written — ${JSON.stringify(counts)}`);
