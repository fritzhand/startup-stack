#!/usr/bin/env node
/* ============================================================
   scrape-site.mjs — turn a website into clean, citable markdown in
   _inbox/, ready for prompts/00-bootstrap-the-stack.md to read.

   Zero dependencies. Node >= 18.   node tools/scrape-site.mjs <url> [options]

   Written for the founder's own site and for competitors' sites — two of
   the highest-value inputs to a stack, and the most tedious to gather by
   hand. What it writes into the output directory:

     <slug>.md          one file per page, front-mattered with the URL it
                        came from and the date it was fetched
     index.md           every URL fetched, skipped or failed, with reasons
     signals.md         what the site says about the business: meta tags,
                        JSON-LD, contact details, published prices
     brand-signals.md   the observable design system: colours, fonts, logo

   The real job here is provenance, not text. AGENTS.md requires every fact
   in the stack to cite where it came from, so every page file carries its
   source URL and fetch date, and everything written defaults to
   [NEEDS VERIFICATION]. A website is a company's published claim about
   itself, which is not the same thing as a fact.

   Politeness is not a setting. robots.txt is fetched and obeyed for the
   user agent this tool presents, requests are serial with a delay between
   them, and a Crawl-delay longer than --delay wins. No flag turns that off.
   ============================================================ */
import { mkdirSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { dirname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { setTimeout as sleep } from "node:timers/promises";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const UA = "startup-stack-scraper/1.0 (+https://github.com/fritzhand/startup-stack)";
const MAX_HTML_BYTES = 2_000_000, MAX_CSS_BYTES = 400_000, MAX_STYLESHEETS = 6;
const MIN_DELAY_MS = 200;                /* a floor, so a typo cannot hammer a small site */
const HTML_TYPE = /^(text\/html|application\/xhtml\+xml)$/;
const TODAY = new Date().toISOString().slice(0, 10);

const USAGE = `
scrape-site.mjs — turn a website into citable markdown in _inbox/

  node tools/scrape-site.mjs <url> [options]

  --out <dir>            where to write (default _inbox/websites/<hostname>)
  --max-pages <n>        stop after n pages (default 40)
  --depth <n>            how many links deep from the start URL (default 3)
  --delay <ms>           wait between requests (default 700; a robots.txt
                         Crawl-delay wins when it is longer)
  --include-subdomains   also follow blog.example.com from example.com
  --same-path-only       stay under the start URL's path
  --timeout <ms>         per-request timeout (default 20000)
  --user-agent <string>  override the user agent (robots.txt is still obeyed)
  --quiet                print only the final summary
  --help                 this text

  Example:
    node tools/scrape-site.mjs https://example.com --max-pages 25 --delay 1000
`;

const die = (msg, usage) => { console.error(`scrape-site: ${msg}`); if (usage) console.error(USAGE); process.exit(1); };
const clean = (s) => String(s ?? "").replace(/\s+/g, " ").trim();
const lower = (s) => String(s ?? "").toLowerCase();
const uniq = (a) => [...new Set(a)].filter(Boolean);

/* ---------------- CLI ---------------- */

function parseArgs(argv) {
  const o = { url: "", out: "", maxPages: 40, depth: 3, delay: 700, timeout: 20000,
    userAgent: UA, includeSubdomains: false, samePathOnly: false, quiet: false };
  const NUM = { "--max-pages": "maxPages", "--depth": "depth", "--delay": "delay", "--timeout": "timeout" };
  const STR = { "--out": "out", "--user-agent": "userAgent" };
  const BOOL = { "--include-subdomains": "includeSubdomains", "--same-path-only": "samePathOnly", "--quiet": "quiet" };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const value = () => { const v = argv[++i]; if (v === undefined) die(`option ${a} needs a value`, true); return v; };
    if (a === "--help" || a === "-h") { console.log(USAGE); process.exit(0); }
    else if (NUM[a]) { const n = Number(value()); if (!Number.isFinite(n) || n < 0) die(`option ${a} needs a whole number`, true); o[NUM[a]] = Math.floor(n); }
    else if (STR[a]) o[STR[a]] = value();
    else if (BOOL[a]) o[BOOL[a]] = true;
    else if (a.startsWith("-")) die(`unknown option ${a}`, true);
    else if (!o.url) o.url = a;
    else die(`one start URL at a time (got "${o.url}" and "${a}")`, true);
  }
  if (!o.url) die("no URL given", true);
  o.maxPages = Math.max(1, o.maxPages);
  o.timeout = Math.max(1000, o.timeout);
  o.delay = Math.max(MIN_DELAY_MS, o.delay);            /* politeness floor */
  return o;
}

/* ---------------- URLs ---------------- */

const TRACKING = /^(utm_[\w-]*|gclid|fbclid|ref|mc_cid|mc_eid)$/i;
const ASSET_EXT = /\.(pdf|docx?|xlsx?|pptx?|csv|zip|gz|tar|rar|7z|dmg|exe|apk|jpe?g|png|gif|webp|avif|svg|ico|bmp|tiff?|mp[34]|m4a|wav|mov|webm|avi|mkv|css|js|mjs|json|xml|rss|atom|woff2?|ttf|otf|eot)$/i;

function normalise(href, base) {
  let u;
  try { u = new URL(href, base); } catch { return null; }
  if (u.protocol !== "http:" && u.protocol !== "https:") return null;
  u.hash = "";
  for (const k of [...u.searchParams.keys()]) if (TRACKING.test(k)) u.searchParams.delete(k);
  u.hostname = lower(u.hostname);
  /* /index.html and / are the same page on almost every server, and a site
     that links to both would otherwise be fetched — and filed — twice. The
     index rewrite has to happen BEFORE the trailing slash is stripped, or
     /a/ and /a/index.html normalise to two different URLs. */
  u.pathname = u.pathname.replace(/\/(index|default)\.(html?|php|aspx?)$/i, "/");
  if (u.pathname.length > 1) u.pathname = u.pathname.replace(/\/+$/, "");
  if (u.pathname === "") u.pathname = "/";
  if ((u.protocol === "http:" && u.port === "80") || (u.protocol === "https:" && u.port === "443")) u.port = "";
  return u.toString();
}

/* A function rather than a host comparison, because --include-subdomains and
   --same-path-only both change what counts as "this site", and a redirect can
   land somewhere the crawl was never allowed to go. */
function inScope(url, start, opts) {
  let u, s;
  try { u = new URL(url); s = new URL(start); } catch { return false; }
  if (u.protocol !== s.protocol && !(u.protocol === "https:" && s.protocol === "http:")) return false;
  if (u.port !== s.port) return false;
  const root = s.hostname.replace(/^www\./, ""), host = u.hostname.replace(/^www\./, "");
  if (!(opts.includeSubdomains ? host === root || host.endsWith(`.${root}`) : host === root)) return false;
  const base = opts.samePathOnly ? s.pathname.replace(/\/+$/, "") : "";
  return !base || u.pathname === base || u.pathname.startsWith(`${base}/`);
}

/* ---------------- robots.txt ---------------- */

function robotsRule(value, allow) {
  const anchored = value.endsWith("$");
  const raw = anchored ? value.slice(0, -1) : value;
  const body = raw.split("*").map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join(".*");
  return { allow, len: value.length, re: new RegExp(`^${body}${anchored ? "$" : ""}`) };
}

/* Groups, longest match wins, Allow beats Disallow on a tie — the behaviour
   every crawler is expected to implement, written out here because we cannot
   install a library that already does it. */
function parseRobots(txt, userAgent) {
  const ua = lower(userAgent), groups = [];
  let cur = null, openGroup = false;
  for (const line of txt.split(/\r?\n/)) {
    const bare = line.replace(/#.*$/, "").trim(), i = bare.indexOf(":");
    if (i < 0) continue;
    const field = lower(bare.slice(0, i)).trim(), value = bare.slice(i + 1).trim();
    if (field === "user-agent") {
      if (!openGroup) { cur = { agents: [], rules: [], delay: null }; groups.push(cur); openGroup = true; }
      cur.agents.push(lower(value));
    } else if (cur) {
      openGroup = false;
      if ((field === "disallow" || field === "allow") && value) cur.rules.push(robotsRule(value, field === "allow"));
      else if (field === "crawl-delay" && Number(value) > 0) cur.delay = Number(value);
    }
  }
  /* Records sharing a user-agent are one group, so every "*" block has to be
     merged — keeping only the first would drop the rules in the others. */
  let best = null, bestLen = -1;
  const star = { rules: [], delay: null };
  for (const g of groups) for (const a of g.agents) {
    if (a === "*") { star.rules.push(...g.rules); star.delay = Math.max(star.delay || 0, g.delay || 0) || null; }
    else if (a && ua.includes(a) && a.length > bestLen) { best = g; bestLen = a.length; }
  }
  const g = best || star;
  return {
    crawlDelayMs: g.delay ? Math.round(g.delay * 1000) : 0,
    allows(pathAndQuery) {
      let verdict = true, len = -1;
      for (const r of g.rules) {
        if (!r.re.test(pathAndQuery)) continue;
        if (r.len > len || (r.len === len && r.allow)) { verdict = r.allow; len = r.len; }
      }
      return verdict;
    },
  };
}

/* ---------------- fetching ---------------- */

function retryAfterMs(header) {
  if (!header) return 0;
  const secs = Number(header);
  if (Number.isFinite(secs)) return Math.min(secs * 1000, 60000);
  const when = Date.parse(header);
  return Number.isFinite(when) ? Math.max(0, Math.min(when - Date.now(), 60000)) : 0;
}

async function readCapped(res, maxBytes) {
  const chunks = [];
  let n = 0;
  for await (const chunk of res.body) { chunks.push(chunk); n += chunk.length; if (n >= maxBytes) break; }
  const buf = Buffer.concat(chunks).subarray(0, maxBytes);
  const charset = (res.headers.get("content-type") || "").match(/charset=["']?([\w-]+)/i);
  try { return new TextDecoder(charset ? charset[1] : "utf-8").decode(buf); } catch { return buf.toString("utf8"); }
}

/* One URL, up to three attempts. A 429 or a 5xx is retried with backoff and
   honours Retry-After; anything else is reported once and the crawl moves on. */
async function get(url, opts, accept, maxBytes) {
  for (let attempt = 0; ; attempt++) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), opts.timeout);
    let res = null, err = null;
    try {
      res = await fetch(url, { redirect: "follow", signal: ctrl.signal, headers: { "user-agent": opts.userAgent, accept } });
    } catch (e) {
      err = e && e.name === "AbortError" ? `no response within ${opts.timeout}ms` : clean(e && e.message ? e.message : String(e));
    } finally { clearTimeout(timer); }
    if (err) return { error: err };
    if ((res.status === 429 || res.status >= 500) && attempt < 2) {
      await sleep(Math.max(retryAfterMs(res.headers.get("retry-after")), 1000 * 2 ** attempt));
      continue;
    }
    if (!res.ok) return { error: `HTTP ${res.status}${attempt ? ` after ${attempt + 1} attempts` : ""}` };
    return { status: res.status, type: lower(res.headers.get("content-type") || "").split(";")[0].trim(),
      finalUrl: res.url || url, body: await readCapped(res, maxBytes) };
  }
}

/* ---------------- HTML to markdown ---------------- */

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", ensp: " ", emsp: " ", thinsp: " ",
  ndash: "–", mdash: "—", hellip: "…", lsquo: "‘", rsquo: "’", ldquo: "“", rdquo: "”", bull: "•", middot: "·",
  times: "×", deg: "°", copy: "©", reg: "®", trade: "™", pound: "£", euro: "€", yen: "¥", cent: "¢", rupee: "₹",
  frac12: "½", laquo: "«", raquo: "»", larr: "←", rarr: "→", shy: "", zwj: "", zwnj: "" };

const decode = (s) => String(s ?? "").replace(/&(#x?[0-9a-f]+|[a-z][a-z0-9]*);/gi, (m, e) => {
  if (e[0] === "#") {
    const n = /^#x/i.test(e) ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
    return Number.isFinite(n) && n > 0 && n <= 0x10ffff ? String.fromCodePoint(n) : m;
  }
  return Object.prototype.hasOwnProperty.call(ENTITIES, lower(e)) ? ENTITIES[lower(e)] : m;
});

function attrs(text) {
  const out = {}, re = /([\w:.-]+)\s*=\s*("([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/g;
  let m;
  while ((m = re.exec(text))) out[lower(m[1])] = decode(m[3] ?? m[4] ?? m[5] ?? "");
  return out;
}

const dropBlocks = (s, tags) => tags.reduce((acc, t) => acc.replace(new RegExp(`<${t}\\b[^>]*>[\\s\\S]*?</${t}>`, "gi"), " "), s);
/* A tag must start with a letter and its '>' must sit outside quotes — a bare
   "<" in prose or code, or a ">" inside an attribute value, is not a tag end.
   The naive /<[^>]*>/ ate half a sentence either way. */
const TAG_RE = /<\/?[a-zA-Z][^>"']*(?:"[^"]*"[^>"']*|'[^']*'[^>"']*)*>/g;
const stripTags = (s) => clean(decode(String(s).replace(TAG_RE, " ")));
const stripNoise = (html) => dropBlocks(html.replace(/<!--[\s\S]*?-->/g, " "), ["script", "style", "noscript", "svg", "template", "iframe", "canvas"]);

/* <main> is the author telling us where the content is. Trust it, then
   <article>, then fall back to the body with the furniture removed. */
function pickContent(html) {
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  if (main) return main[1];
  const article = html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i);
  if (article) return article[1];
  const body = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);
  return dropBlocks(body ? body[1] : html, ["nav", "header", "footer", "aside"]);
}

function tableToLines(raw) {
  const rows = [...raw.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)]
    .map((m) => [...m[1].matchAll(/<(t[hd])\b[^>]*>([\s\S]*?)<\/\1>/gi)].map((c) => stripTags(c[2]).replace(/\|/g, "\\|")))
    .filter((r) => r.length);
  if (!rows.length) return [];
  const head = rows[0], body = rows.slice(1);
  /* A ragged table is a layout table or a rowspan. Degrade to a list rather
     than emit markdown that renders as garbage. */
  if (body.some((r) => r.length !== head.length)) return ["", ...rows.map((r) => `- ${r.join(" — ")}`), ""];
  return ["", `| ${head.join(" | ")} |`, `| ${head.map(() => "---").join(" | ")} |`, ...body.map((r) => `| ${r.join(" | ")} |`), ""];
}

const BLOCK = new Set(["p", "div", "section", "article", "main", "header", "footer", "aside", "figure", "figcaption",
  "form", "fieldset", "dl", "dt", "dd", "address", "details", "summary", "label", "tr", "td", "th"]);
const MARKS = { strong: "**", b: "**", em: "*", i: "*", code: "`" };
const BR = "\u0001";                   /* stands in for <br> until the line is flushed */

/* A tolerant linear scan, not a parser. It never throws on bad markup, and it
   only knows the tags that carry meaning for a founder reading the output. */
function htmlToMarkdown(html, base) {
  const lines = [], lists = [], links = [], marks = [];
  let text = "", heading = 0, quote = 0, item = null;
  const push = (line) => lines.push(quote && line ? `> ${line}` : line);
  const flush = () => {
    const t = text.replace(/[^\S\u0001]+/g, " ").trim();
    text = "";
    if (!t) { item = null; return; }
    const body = t.split(BR).map((x) => clean(x)).filter(Boolean).join("  \n");
    /* Headings are demoted one level: the file's H1 is its title, so the
       page's own H1 becomes an H2 and the document keeps a single top level. */
    if (heading) { push(""); push(`${"#".repeat(Math.min(heading + 1, 6))} ${clean(body)}`); push(""); }
    else if (item) { push(`${item.indent}${item.marker}${body.replace(/\n/g, " ")}`); item = null; }
    else if (lists.length) push(`${"  ".repeat(lists.length)}${body.replace(/\n/g, " ")}`);
    else { push(""); push(body); push(""); }
  };
  const abs = (href) => normalise(href, base) || href;

  const re = /<(\/?)([a-zA-Z][\w:-]*)((?:'[^']*'|"[^"]*"|[^'">])*)>/g;
  let last = 0, m;
  while ((m = re.exec(html))) {
    text += decode(html.slice(last, m.index)).replace(/[^\S\u0001]+/g, " ");
    last = re.lastIndex;
    const close = m[1] === "/", tag = lower(m[2]), a = close ? {} : attrs(m[3]);

    if (!close && (tag === "pre" || tag === "table")) {           /* taken whole, not walked */
      const closer = tag === "pre" ? "</pre>" : "</table>";
      /* the matching close, not the first one — tables nest */
      const low = lower(html);
      let depth = 1, scan = re.lastIndex, end = html.length;
      while (depth > 0) {
        const nc = low.indexOf(closer, scan);
        if (nc < 0) break;
        const no = low.indexOf(`<${tag}`, scan);
        if (no >= 0 && no < nc) { depth++; scan = no + tag.length + 1; }
        else { depth--; scan = nc + closer.length; if (depth === 0) end = nc; }
      }
      const raw = html.slice(re.lastIndex, end);
      flush();
      if (tag === "table") for (const l of tableToLines(raw)) push(l);
      else { push(""); push("```"); for (const l of decode(raw.replace(TAG_RE, "")).split("\n")) push(l.replace(/\s+$/, "")); push("```"); push(""); }
      re.lastIndex = Math.min(end + closer.length, html.length);
      last = re.lastIndex;
      continue;
    }
    /* heading state is cleared by any block that follows, not only by the
       closing tag — one unclosed <h2> would otherwise swallow the whole page */
    if (/^h[1-6]$/.test(tag)) { flush(); heading = close ? 0 : Number(tag[1]); }
    else if (!close && /^(p|div|section|article|ul|ol|li|table|pre|blockquote|main|footer|header)$/.test(tag) && heading) { flush(); heading = 0; }
    else if (tag === "ul" || tag === "ol") {
      flush();
      if (close) { lists.pop(); if (!lists.length) push(""); }
      else { if (!lists.length) push(""); lists.push({ ordered: tag === "ol", n: 0 }); }
    } else if (tag === "li") {
      flush();
      if (!close) {
        const top = lists[lists.length - 1] || { ordered: false, n: 0 };
        top.n += 1;
        item = { indent: "  ".repeat(Math.max(0, lists.length - 1)), marker: top.ordered ? `${top.n}. ` : "- " };
      }
    } else if (tag === "blockquote") { flush(); if (close) quote = Math.max(0, quote - 1); else { push(""); quote += 1; } }
    else if (tag === "br") text += BR;
    else if (tag === "hr") { flush(); push(""); push("---"); push(""); }
    else if (tag === "a") {
      if (close) {
        const open = links.pop();
        if (open) { if (text.length === open.at + 1) text = text.slice(0, open.at); else text += `](${open.href})`; }
      } else if (a.href && !/^(javascript:|#)/i.test(a.href.trim())) {
        links.push({ at: text.length, href: /^(mailto|tel):/i.test(a.href) ? a.href : abs(a.href) });
        text += "[";
      }
    } else if (tag === "img") { if (a.src) text += ` ![${clean(a.alt || "")}](${abs(a.src)}) `; }
    else if (MARKS[tag]) {
      /* Paired like links: an empty <strong> or <em> gives back its opening
         mark rather than leaving a pair of asterisks around nothing. */
      if (!close) { marks.push({ at: text.length, mark: MARKS[tag] }); text += MARKS[tag]; }
      else {
        const open = marks.pop();
        if (open) { if (text.length === open.at + open.mark.length) text = text.slice(0, open.at); else text += open.mark; }
      }
    } else if (BLOCK.has(tag)) flush();
  }
  text += decode(html.slice(last)).replace(/[^\S\u0001]+/g, " ");
  flush();
  return lines.join("\n").replace(/[^\S\n]+$/gm, "").replace(/\n{3,}/g, "\n\n").trim();
}

/* ---------------- what the page says about the business ---------------- */

const SOCIAL = /(linkedin\.com|twitter\.com|x\.com\/|facebook\.com|instagram\.com|youtube\.com|youtu\.be|github\.com|medium\.com|tiktok\.com|threads\.net|bsky\.app|mastodon|t\.me|wa\.me|crunchbase\.com|wellfound\.com|angel\.co|pinterest\.com|substack\.com)/i;
const PRICE = /(?:₹|Rs\.?|INR|US\$|\$|USD|€|EUR|£|GBP|¥|AED|SGD|CHF)\s?\d[\d,]*(?:\.\d+)?\s*(?:k\b|lakhs?\b|crores?\b|cr\b|mn\b|million\b|bn\b|billion\b)?/gi;
const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
const LD_TYPES = /^(Organization|Corporation|LocalBusiness|Product|Service|Offer|FAQPage|BreadcrumbList|WebSite)$/i;
const LD_FIELDS = ["name", "legalName", "description", "url", "email", "telephone", "foundingDate", "numberOfEmployees", "price", "priceRange", "brand", "slogan"];

function sentenceAround(text, i, len) {
  let start = 0, end = text.length;
  for (const p of [". ", "! ", "? ", "\n", "; "]) { const k = text.lastIndexOf(p, i); if (k > start) start = k + p.length; }
  for (const p of [". ", "! ", "? ", "\n"]) { const k = text.indexOf(p, i + len); if (k >= 0 && k < end) end = k + 1; }
  return clean(text.slice(start, end)).replace(/^\|\s*|\s*\|$/g, "").replace(/\s*\|\s*/g, " — ").slice(0, 240);
}

function readMeta(html) {
  const out = [];
  for (const m of html.matchAll(/<meta\b((?:'[^']*'|"[^"]*"|[^'">])*)>/gi)) {
    const a = attrs(m[1]), key = lower(a.property || a.name || a.itemprop || "");
    if (key && a.content) out.push([key, clean(a.content)]);
  }
  return out;
}

function readJsonLd(html) {
  const out = [];
  for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (!/ld\+json/i.test(attrs(m[1]).type || "")) continue;
    const raw = m[2].replace(/^\s*<!\[CDATA\[/, "").replace(/\]\]>\s*$/, "").trim();
    try { out.push({ ok: true, data: JSON.parse(raw) }); } catch (e) { out.push({ ok: false, data: raw.slice(0, 400), why: clean(e.message) }); }
  }
  return out;
}

function flattenLd(node, acc = []) {
  if (Array.isArray(node)) { for (const n of node) flattenLd(n, acc); return acc; }
  if (node && typeof node === "object") { acc.push(node); if (node["@graph"]) flattenLd(node["@graph"], acc); }
  return acc;
}

/* Everything gathered here is mechanical: it is what the markup says, with no
   interpretation added. Reading it is the founder's job. */
function pageSignals(rawHtml, contentHtml, pageUrl) {
  const s = { url: pageUrl, meta: readMeta(rawHtml), jsonld: readJsonLd(rawHtml),
    emails: [], phones: [], addresses: [], social: [], prices: [] };
  const canonical = rawHtml.match(/<link\b[^>]*rel=["']?canonical["']?[^>]*>/i);
  s.canonical = canonical ? normalise(attrs(canonical[0]).href || "", pageUrl) || "" : "";
  const htmlTag = rawHtml.match(/<html\b([^>]*)>/i);
  s.lang = htmlTag ? clean(attrs(htmlTag[1]).lang || "") : "";

  for (const m of rawHtml.matchAll(/<a\b((?:"[^"]*"|'[^']*'|[^'">])*)>/gi)) {
    const h = (attrs(m[1]).href || "").trim();
    if (/^mailto:/i.test(h)) s.emails.push(clean(h.slice(7).split("?")[0]));
    else if (/^tel:/i.test(h)) s.phones.push(clean(h.slice(4)));
    else if (h && SOCIAL.test(h)) { const u = normalise(h, pageUrl); if (u) s.social.push(u); }
  }

  /* The whole document, headers and footers included — the footer is where
     the registered address and the switchboard number live. Block boundaries
     become sentence breaks so the quoted context stays readable. */
  const text = clean(decode(String(contentHtml)
    .replace(/<(?:br|\/p|\/div|\/li|\/td|\/th|\/h[1-6]|\/section|\/footer|\/header|\/address)\b[^>]*>/gi, " . ")
    .replace(TAG_RE, " ")))
    .replace(/(\s\.\s*)+/g, ". ");
  for (const m of text.matchAll(EMAIL)) if (!ASSET_EXT.test(m[0])) s.emails.push(m[0]);
  /* Loose digit runs also match dates and order numbers, so a bare number only
     counts as a phone when the page itself says that is what it is. */
  for (const m of text.matchAll(/(?<![\w+])(?:\+\d{1,3}[\s.-]?)?(?:\(\d{2,6}\)|\d{2,6})(?:[\s.-]\d{2,6}){1,3}(?!\d)/g)) {
    const digits = m[0].replace(/\D/g, "");
    const before = lower(text.slice(Math.max(0, m.index - 40), m.index));
    if (digits.length < 8 || digits.length > 15) continue;
    if (m[0].trim().startsWith("+") || /(phone|tel|call|mobile|whatsapp|contact)/.test(before)) s.phones.push(clean(m[0]));
  }
  for (const m of text.matchAll(PRICE)) s.prices.push({ value: clean(m[0]), sentence: sentenceAround(text, m.index, m[0].length) });

  for (const m of contentHtml.matchAll(/<address\b[^>]*>([\s\S]*?)<\/address>/gi)) s.addresses.push(stripTags(m[1]));
  const micro = ["streetaddress", "addresslocality", "addressregion", "postalcode", "addresscountry"]
    .map((k) => { const m = rawHtml.match(new RegExp(`itemprop=["']?${k}["']?[^>]*>([^<]*)<`, "i")); return m ? clean(m[1]) : ""; }).filter(Boolean);
  if (micro.length) s.addresses.push(micro.join(", "));
  for (const block of s.jsonld) {
    if (!block.ok) continue;
    for (const node of flattenLd(block.data)) {
      for (const a of [].concat(node.address || [])) {
        if (a && typeof a === "object") {
          const parts = [a.streetAddress, a.addressLocality, a.addressRegion, a.postalCode, a.addressCountry].filter(Boolean);
          if (parts.length) s.addresses.push(parts.join(", "));
        } else if (typeof a === "string") s.addresses.push(clean(a));
      }
      for (const p of [].concat(node.sameAs || [])) if (typeof p === "string" && SOCIAL.test(p)) s.social.push(p);
      if (typeof node.email === "string") s.emails.push(clean(node.email.replace(/^mailto:/i, "")));
      if (typeof node.telephone === "string") s.phones.push(clean(node.telephone));
    }
  }
  return s;
}

/* ---------------- brand signals ---------------- */

const COLOURISH = /^(#[0-9a-f]{3,8}\b|(rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\s*\(|(black|white|red|blue|green|orange|yellow|purple|pink|grey|gray|navy|teal|cyan|magenta|brown|beige|gold|silver|ivory|coral|olive|maroon|indigo|violet|salmon|khaki|plum|tan)\b)/i;

function mineCss(css, where, brand) {
  for (const m of css.matchAll(/(--[\w-]+)\s*:\s*([^;{}]+)/g)) {
    const name = m[1], value = clean(m[2]);
    if (COLOURISH.test(value) && !brand.colours.has(`${name}|${value}`)) brand.colours.set(`${name}|${value}`, { name, value, where });
  }
  for (const m of css.matchAll(/font-family\s*:\s*([^;{}!]+)/gi)) {
    const value = clean(m[1]).replace(/["']/g, "");
    if (value && !brand.fonts.has(value)) brand.fonts.set(value, where);
  }
}

function pageBrand(rawHtml, pageUrl, brand) {
  for (const m of rawHtml.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) mineCss(m[1], pageUrl, brand);
  for (const m of rawHtml.matchAll(/style=["']([^"']*)["']/gi)) mineCss(m[1], pageUrl, brand);
  for (const m of rawHtml.matchAll(/<link\b([^>]*)>/gi)) {
    const a = attrs(m[1]), rel = lower(a.rel || ""), href = a.href ? normalise(a.href, pageUrl) : null;
    if (!href) continue;
    if (rel.includes("stylesheet")) brand.sheets.add(href);
    if (rel.includes("icon")) brand.icons.set(href, `${rel} on ${pageUrl}`);
  }
  for (const m of rawHtml.matchAll(/<img\b([^>]*)>/gi)) {
    const a = attrs(m[1]);
    if (!a.src || !lower(`${a.src} ${a.alt || ""} ${a.class || ""} ${a.id || ""}`).includes("logo")) continue;
    const src = normalise(a.src, pageUrl);
    if (src && !brand.logos.has(src)) brand.logos.set(src, `alt="${clean(a.alt || "")}" on ${pageUrl}`);
  }
}

/* ---------------- file names, front matter, tables ---------------- */

const RESERVED = new Set(["index", "signals", "brand-signals", "readme"]);
const hash = (s) => { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h.toString(36).slice(0, 5); };

function slugFor(url, taken) {
  const u = new URL(url);
  let decoded = u.pathname;
  try { decoded = decodeURIComponent(u.pathname); } catch { /* malformed escape: use it raw */ }
  const path = decoded.replace(/^\/+|\/+$/g, "");
  let base = lower(path).replace(/\.(html?|php|aspx?)$/i, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  if (u.search) base += `-${hash(u.search)}`;
  if (!base) base = "index-home";
  if (RESERVED.has(base)) base = `${base}-page`;
  base = base.slice(0, 70).replace(/-+$/, "");
  let name = base, n = 1;
  while (taken.has(name)) name = `${base}-${++n}`;
  taken.add(name);
  return name;
}

/* Never write outside the output directory. A path that came off the web must
   not be able to steer a write into the repo. */
function safePath(dir, name) {
  const full = resolve(dir, `${name}.md`);
  if (!full.startsWith(resolve(dir) + sep)) die(`refusing to write outside ${dir}`);
  return full;
}

const yamlValue = (v) => {
  const s = clean(v);
  return /^[\w][\w .,\/@()'+-]*$/.test(s) && !/^(true|false|null|yes|no|on|off)$/i.test(s) ? s : JSON.stringify(s);
};

/* An empty value is still written out — a page with no meta description should
   say so with an empty field, not by quietly dropping the field. */
const frontMatter = (fields) => ["---",
  ...Object.entries(fields).filter(([, v]) => v !== undefined).map(([k, v]) => `${k}: ${yamlValue(v)}`),
  "---"].join("\n");

const table = (head, rows) => [`| ${head.join(" | ")} |`, `| ${head.map(() => "---").join(" | ")} |`,
  ...rows.map((r) => `| ${r.map((c) => clean(c).replace(/\|/g, "\\|") || "—").join(" | ")} |`)].join("\n");

const section = (lines, title, body) => lines.push(`## ${title}`, "", body, "");

const fileHead = (doc, r, title, description, summary) => frontMatter({
  doc, section: "_inbox/websites", title, description, source_url: r.start, source_host: r.host,
  fetched: TODAY, updated: TODAY, status: "needs-verification", confidence: "low", sensitivity: "public", summary });

/* ---------------- the crawl ---------------- */

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  /* "example.com" is what people type. Resolved against a base it would become
     a path on a host nobody named, and fail with a message about that host. */
  const typed = /^[a-z][\w+.-]*:\/\//i.test(opts.url) ? opts.url : `https://${opts.url.replace(/^\/+/, "")}`;
  const start = normalise(typed, "https://example.invalid");
  const startHost = start ? new URL(start).hostname : "";
  const plausibleHost = startHost.includes(".") || startHost === "localhost"
    || /^\d+(\.\d+){3}$/.test(startHost) || startHost.startsWith("[");
  if (!start || !plausibleHost) die(`"${opts.url}" is not a website address — try https://example.com`);
  const { origin, hostname: host } = new URL(start);
  const outDir = opts.out ? resolve(process.cwd(), opts.out) : join(ROOT, "_inbox", "websites", host);
  const say = (line) => { if (!opts.quiet) console.log(line); };

  /* Preflight before anything is written, so a failed start leaves no
     half-made output directory behind. */
  const robotsRes = await get(`${origin}/robots.txt`, opts, "text/plain", 200_000);
  if (robotsRes.error && /HTTP 5\d\d/.test(robotsRes.error)) die(`${origin}/robots.txt returned a server error (${robotsRes.error}) — treating the site as closed to crawlers`);
  const robots = parseRobots(robotsRes.error ? "" : robotsRes.body, opts.userAgent);
  const delay = Math.max(opts.delay, robots.crawlDelayMs);
  const allowed = (url) => { const u = new URL(url); return robots.allows(u.pathname + u.search); };
  if (!allowed(start)) die(`robots.txt disallows ${start} for this user agent — nothing fetched`);
  say(`scrape-site: ${start}`);
  say(`  robots.txt: ${robotsRes.error ? `not read (${robotsRes.error}) — crawling as allowed` : "read and obeyed"}${robots.crawlDelayMs ? `, Crawl-delay ${robots.crawlDelayMs}ms` : ""}, ${delay}ms between requests`);
  const first = await get(start, opts, "text/html,application/xhtml+xml", MAX_HTML_BYTES);
  if (first.error) die(`could not fetch ${start} — ${first.error}`);
  if (!HTML_TYPE.test(first.type)) die(`${start} is ${first.type || "of unknown type"}, not HTML`);
  /* Nothing is deleted here — the folder may hold pages saved by hand, and a
     tool that quietly removes a founder's evidence is worse than one that
     leaves a stale file behind. Say what is there and let them decide. */
  const priorPages = existsSync(outDir)
    ? readdirSync(outDir).filter((f) => f.endsWith(".md") && f !== "index.md")
    : [];
  mkdirSync(outDir, { recursive: true });
  if (priorPages.length) {
    say(`  note: ${priorPages.length} markdown file${priorPages.length === 1 ? "" : "s"} already in this folder.`);
    say("        Files this crawl fetches are overwritten; the rest stay as they are.");
    say("        Delete the folder first if you want only what is on the site today.");
  }

  const queue = [{ url: start, depth: 0 }], seen = new Set([start]), taken = new Set(), written = new Set();
  const pages = [], signals = [], skipped = new Map(), failed = new Map();
  const brand = { colours: new Map(), fonts: new Map(), icons: new Map(), logos: new Map(), sheets: new Set(), read: [] };
  const noteSkip = (url, why) => { if (!skipped.has(url) && !seen.has(url)) skipped.set(url, why); };
  const depthCapped = new Set();
  let prefetched = first;

  while (queue.length && pages.length < opts.maxPages) {
    const { url, depth } = queue.shift();
    let res = prefetched;
    if (res) prefetched = null;
    else { await sleep(delay); res = await get(url, opts, "text/html,application/xhtml+xml", MAX_HTML_BYTES); }
    if (res.error) { failed.set(url, res.error); say(`  failed  ${url} — ${res.error}`); continue; }
    if (!HTML_TYPE.test(res.type)) { skipped.set(url, `not HTML (${res.type || "no content-type"})`); continue; }
    const landed = normalise(res.finalUrl, url) || url;
    if (!inScope(landed, start, opts)) { skipped.set(url, `redirected off this site to ${res.finalUrl}`); continue; }
    /* robots was checked against the URL we asked for; a redirect can land
       somewhere it forbids, so it is checked again against where we arrived */
    if (landed !== url && !allowed(landed)) { skipped.set(url, `redirected to ${res.finalUrl}, which robots.txt disallows`); continue; }
    /* a legacy URL that redirects to a page also linked directly must not
       file the same content twice or spend two of --max-pages on it */
    if (written.has(landed)) { skipped.set(url, `redirects to ${res.finalUrl || landed}, already fetched`); continue; }
    written.add(landed);
    /* Relative links resolve against the address the server actually served,
       trailing slash and all — normalise() strips that slash, and resolving
       "post.html" against "/blog" instead of "/blog/" climbs a level. */
    let resolveBase = res.finalUrl || url;
    if (landed !== url) seen.add(landed);

    const raw = res.body, cleaned = stripNoise(raw), content = pickContent(cleaned);
    /* a <base href> re-points every relative link on the page */
    const baseTag = raw.match(/<base\b((?:"[^"]*"|'[^']*'|[^'">])*)>/i);
    const baseHref = baseTag ? (attrs(baseTag[1]).href || "").trim() : "";
    if (baseHref) { try { resolveBase = new URL(baseHref, resolveBase).toString(); } catch { /* bad base: ignore it */ } }
    const markdown = htmlToMarkdown(content, resolveBase);
    const titleTag = raw.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
    const h1 = content.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
    const title = (titleTag && stripTags(titleTag[1])) || (h1 && stripTags(h1[1])) || new URL(url).pathname;
    const description = clean((readMeta(raw).find(([k]) => k === "description") || [])[1] || "");
    const words = markdown.split(/\s+/).filter(Boolean).length;
    const name = slugFor(landed, taken);

    signals.push(pageSignals(raw, cleaned, landed));
    pageBrand(raw, url, brand);
    const head = frontMatter({
      doc: `web-${name}`, section: "_inbox/websites", title, description, source_url: landed, source_host: host,
      fetched: TODAY, updated: TODAY, status: "needs-verification", confidence: "low", sensitivity: "public",
      crawl_depth: String(depth), word_count: String(words),
      summary: `Page scraped from ${url} on ${TODAY}. ${description || `${words} words of published copy.`}`,
    });
    writeFileSync(safePath(outDir, name), `${head}\n\n# ${title}\n\n> Fetched from ${landed} on ${TODAY} by tools/scrape-site.mjs.\n> This is what the site published, not confirmed fact. [NEEDS VERIFICATION]\n\n${markdown}\n`, "utf8");
    pages.push({ url: landed, name, title, words, depth });
    say(`  [${String(pages.length).padStart(3)}/${opts.maxPages}] ${res.status}  ${new URL(url).pathname}  ${words} words  -> ${name}.md`);

    /* Links come from the whole document, not just the content block — the
       navigation is usually where the rest of the site is. */
    for (const m of cleaned.matchAll(/<a\b((?:"[^"]*"|'[^']*'|[^'">])*)>/gi)) {
      const href = (attrs(m[1]).href || "").trim();
      if (!href) continue;
      if (/^(mailto|tel|javascript|sms|whatsapp):/i.test(href)) { noteSkip(href, "not a web page (mailto:, tel: or similar)"); continue; }
      const next = normalise(href, resolveBase);
      if (!next || seen.has(next)) continue;
      const ext = new URL(next).pathname.match(ASSET_EXT);
      if (ext) { noteSkip(next, `asset file (${ext[0]}), not a page`); continue; }
      const offPath = opts.samePathOnly && new URL(next).hostname === new URL(start).hostname;
      if (!inScope(next, start, opts)) { noteSkip(next, offPath ? "outside the start URL's path (--same-path-only)" : "off this site"); continue; }
      if (!allowed(next)) { noteSkip(next, "disallowed by robots.txt"); continue; }
      if (depth + 1 > opts.depth) { noteSkip(next, `deeper than --depth ${opts.depth}`); depthCapped.add(next); continue; }
      seen.add(next);
      queue.push({ url: next, depth: depth + 1 });
    }
  }
  const capped = queue.length > 0;
  for (const q of queue) skipped.set(q.url, `not fetched — the --max-pages limit of ${opts.maxPages} was reached`);

  /* Stylesheets last, and only a handful: they are read for colours and fonts,
     and they do not count against --max-pages. */
  for (const sheet of [...brand.sheets].slice(0, MAX_STYLESHEETS)) {
    if (!inScope(sheet, start, opts) || !allowed(sheet)) { brand.read.push({ url: sheet, note: "not read (off this site, or disallowed by robots.txt)" }); continue; }
    await sleep(delay);
    const css = await get(sheet, opts, "text/css", MAX_CSS_BYTES);
    if (css.error) { brand.read.push({ url: sheet, note: css.error }); continue; }
    const colours = brand.colours.size, fonts = brand.fonts.size;
    mineCss(css.body, sheet, brand);
    brand.read.push({ url: sheet, note: `${brand.colours.size - colours} colour properties, ${brand.fonts.size - fonts} font declarations` });
  }

  writeIndex(outDir, { start, host, opts, delay, robots: robotsRes, pages, skipped, failed, capped, depthCapped });
  writeSignals(outDir, { start, host, signals });
  writeBrand(outDir, { start, host, brand, signals });

  const where = outDir.startsWith(resolve(ROOT)) ? `.${outDir.slice(resolve(ROOT).length)}` : outDir;
  console.log("");
  console.log(`Done. ${pages.length} page${pages.length === 1 ? "" : "s"} written, ${skipped.size} skipped, ${failed.size} failed.`);
  console.log(`Output: ${where}`);
  console.log("  index.md          every URL fetched, skipped or failed, with the reason");
  console.log("  signals.md        what the site says about the business");
  console.log("  brand-signals.md  colours, fonts, favicon, logo");
  if (capped) console.log(`Note: the crawl stopped at --max-pages ${opts.maxPages}. There is more site than this.`);
  console.log("");
  console.log("Next step: run prompts/00-bootstrap-the-stack.md with your AI tool pointed at");
  console.log("this repo. It reads _inbox/ and writes stack/. Everything scraped here is");
  console.log("[NEEDS VERIFICATION] until you have read it yourself.");
}

/* ---------------- the three summary files ---------------- */

function writeIndex(outDir, r) {
  const lines = [fileHead(`web-index-${r.host}`, r, `Website scrape — ${r.host}`,
    `Every page fetched from ${r.host}, with what was skipped or failed and why.`,
    `Crawl log for ${r.host}: ${r.pages.length} pages fetched, ${r.skipped.size} skipped, ${r.failed.size} failed on ${TODAY}.`),
    "", `# Website scrape — ${r.host}`, ""];
  if (r.capped || r.depthCapped.size) lines.push("## This crawl is incomplete", "");
  if (r.capped) lines.push(`The page limit stopped it. \`--max-pages\` was ${r.opts.maxPages} and the queue still had pages in it, so this site has more pages than this file lists. Every URL that was never fetched is in the skipped table below, marked as such. Re-run with a higher \`--max-pages\` if the rest matters.`, "");
  if (r.depthCapped.size) lines.push(`${r.depthCapped.size} link${r.depthCapped.size === 1 ? " was" : "s were"} not followed because \`--depth\` was ${r.opts.depth}. Those URLs are in the skipped table too.`, "");
  section(lines, "Pages fetched", r.pages.length ? table(["Title", "File", "URL", "Words", "Fetched"],
    r.pages.map((p) => [p.title, `[${p.name}.md](${p.name}.md)`, p.url, String(p.words), TODAY])) : "None.");
  section(lines, "The run", table(["Setting", "Value"], [
    ["Start URL", r.start], ["Output directory", outDir], ["Fetched on", TODAY],
    ["--max-pages", String(r.opts.maxPages)], ["--depth", String(r.opts.depth)],
    ["Delay between requests", `${r.delay} ms`], ["--include-subdomains", r.opts.includeSubdomains ? "yes" : "no"],
    ["--same-path-only", r.opts.samePathOnly ? "yes" : "no"], ["--timeout", `${r.opts.timeout} ms`], ["User agent", r.opts.userAgent],
    ["robots.txt", r.robots.error ? `not read (${r.robots.error}) — crawled as allowed` : "read and obeyed"]]));
  section(lines, "Counts", table(["", "Count"],
    [["Fetched", String(r.pages.length)], ["Skipped", String(r.skipped.size)], ["Failed", String(r.failed.size)]]));
  section(lines, "Skipped, and why", r.skipped.size ? table(["URL", "Reason"], [...r.skipped]) : "Nothing was skipped.");
  section(lines, "Failed, and why", r.failed.size ? table(["URL", "Reason"], [...r.failed]) : "Nothing failed.");
  lines.push("A failure is recorded and left alone rather than retried forever. If one of these pages matters, open it in a browser and save it into `_inbox/` by hand.", "");
  writeFileSync(join(outDir, "index.md"), `${lines.join("\n")}\n`, "utf8");
}

function writeSignals(outDir, r) {
  const found = new Map();             /* "kind|value" -> {v, url}, so every item cites one page */
  for (const s of r.signals) for (const kind of ["emails", "phones", "addresses", "social", "prices"]) {
    for (const v of uniq(s[kind])) {
      const key = `${kind}|${typeof v === "string" ? v : v.value}`;
      if (!found.has(key)) found.set(key, { v, url: s.url });
    }
  }
  const of = (kind) => [...found].filter(([k]) => k.startsWith(`${kind}|`)).map(([, x]) => x);

  const lines = [fileHead(`web-signals-${r.host}`, r, `Website signals — ${r.host}`,
    `Meta tags, structured data, contact details and published prices read out of ${r.host}.`,
    `What ${r.host} publishes about itself in its own markup: descriptions, social cards, JSON-LD, contacts and price strings. Gathered mechanically on ${TODAY}; nothing interpreted.`),
    "", `# Website signals — ${r.host}`, "",
    "**Everything on this page is [NEEDS VERIFICATION].** It was read out of the site's markup by a script that does not understand the business, and none of it has been checked against reality.", "",
    "A price on a website is what the company publishes. It is not necessarily what it charges, what it collects after discounts, or what it costs to deliver. Treat every figure below as a claim with a source, and confirm it before it reaches `stack/`.", ""];

  const metaRows = [];
  for (const s of r.signals) for (const [k, v] of s.meta) {
    if (k === "description" || k === "author" || k === "keywords" || k.startsWith("og:") || k.startsWith("twitter:")) metaRows.push([k, v, s.url]);
  }
  section(lines, "Descriptions and social cards", metaRows.length ? table(["Tag", "Value", "Page"], metaRows) : "No description, og: or twitter: tags found.");
  const declared = r.signals.filter((s) => s.canonical || s.lang).map((s) => [s.url, s.canonical, s.lang]);
  section(lines, "Canonical URLs and declared language", declared.length ? table(["Page", "Canonical", "lang"], declared) : "None declared.");

  lines.push("## Structured data (JSON-LD)", "");
  let blocks = 0;
  for (const s of r.signals) for (const block of s.jsonld) {
    blocks += 1;
    if (!block.ok) { lines.push(`Unreadable JSON-LD block on ${s.url} — ${block.why}`, "", "```", block.data, "```", ""); continue; }
    const nodes = flattenLd(block.data);
    lines.push(`### ${uniq(nodes.map((n) => [].concat(n["@type"] || []).join(", "))).join(" / ") || "Untyped block"} — from ${s.url}`, "");
    for (const n of nodes) {
      const type = [].concat(n["@type"] || []).join(", ");
      const kv = LD_TYPES.test(type) ? LD_FIELDS.filter((k) => n[k] !== undefined).map((k) => [k, typeof n[k] === "object" ? JSON.stringify(n[k]) : String(n[k])]) : [];
      if (kv.length) lines.push(`**${type}**`, "", table(["Field", "Value"], kv), "");
    }
    lines.push("```json", JSON.stringify(block.data, null, 2).slice(0, 4000), "```", "");
  }
  if (!blocks) lines.push("No JSON-LD blocks found.", "");

  const list = (heading, kind, note) => lines.push(`### ${heading}`, "", of(kind).length
    ? table(["Value", "Found on"], of(kind).map((x) => [String(x.v), x.url])) : `None found.${note ? ` ${note}` : ""}`, "");
  lines.push("## Contact details", "");
  list("E-mail addresses", "emails");
  list("Telephone numbers", "phones", "A number is only listed when it was a tel: link or the surrounding text called it a phone number.");
  list("Addresses", "addresses", "Only marked-up addresses are picked up. An address in a picture, or loose in body text, will not appear.");
  section(lines, "Social profiles", of("social").length
    ? table(["Profile", "Linked from"], of("social").map((x) => [String(x.v), x.url])) : "None found.");
  section(lines, "Prices published on the site", of("prices").length
    ? table(["Price", "Sentence it appeared in", "Page"], of("prices").map((x) => [x.v.value, x.v.sentence, x.url]))
    : "No price-like strings found. That is common — plenty of sites keep pricing behind a form.");
  lines.push("Correct anything wrong here before the bootstrap prompt reads it. A wrong number is cheapest to fix now.", "");
  writeFileSync(join(outDir, "signals.md"), `${lines.join("\n")}\n`, "utf8");
}

function writeBrand(outDir, r) {
  const b = r.brand, shareImages = new Map();
  for (const s of r.signals) for (const [k, v] of s.meta) if (k === "og:image" || k === "twitter:image") shareImages.set(normalise(v, s.url) || v, s.url);
  /* A site may only declare its logo in structured data, never as an <img> */
  for (const s of r.signals) for (const block of s.jsonld) {
    for (const n of block.ok ? flattenLd(block.data) : []) {
      const logo = typeof n.logo === "string" ? n.logo : n.logo && n.logo.url;
      const url = logo ? normalise(logo, s.url) : null;
      if (url && !b.logos.has(url)) b.logos.set(url, `JSON-LD ${[].concat(n["@type"] || []).join(", ")} on ${s.url}`);
    }
  }
  const lines = [fileHead(`web-brand-${r.host}`, r, `Brand signals — ${r.host}`,
    `Colours, fonts, favicon and logo as declared in the markup and stylesheets of ${r.host}.`,
    `The design system ${r.host} shows in public: CSS colour variables, font families, favicon, og:image and logo. Read on ${TODAY}; to be confirmed against stack/09-brand/brand.md.`),
    "", `# Brand signals — ${r.host}`, "",
    "This is what the site shows, not what the brand is. Check it against `stack/09-brand/brand.md` and correct whichever of the two is wrong.", "",
    "**Colours lifted off a live site are [NEEDS VERIFICATION] until the founder says otherwise.** A stylesheet holds the theme, the hover states, the third-party widgets and whatever a previous developer left behind. Being in the CSS does not make a colour part of the brand.", ""];
  section(lines, "Colour custom properties", b.colours.size
    ? table(["Property", "Value", "Declared in"], [...b.colours.values()].map((c) => [c.name, c.value, c.where]))
    : "No CSS custom properties with colour values were found. The site may set its colours directly rather than through variables.");
  section(lines, "Font families declared", b.fonts.size
    ? table(["font-family", "Declared in"], [...b.fonts]) : "No font-family declarations were found.");
  const images = [...[...b.icons].map(([url, where]) => ["favicon", url, where]),
    ...[...b.logos].map(([url, where]) => ["logo", url, where]),
    ...[...shareImages].map(([url, where]) => ["og:image", url, where])];
  section(lines, "Icons, logo and share images", images.length
    ? table(["What", "URL", "Where"], images) : "No favicon, logo or share image was identifiable.");
  lines.push("A logo is only listed when the word \"logo\" appears in the image's file name, alt text, class or id, or when the site declares one in JSON-LD. A logo drawn as an inline SVG will not be here.", "");
  section(lines, "Stylesheets read", b.read.length
    ? table(["Stylesheet", "Result"], b.read.map((s) => [s.url, s.note])) : "No stylesheets were read.");
  if (b.sheets.size > MAX_STYLESHEETS) lines.push(`The site links ${b.sheets.size} stylesheets; the first ${MAX_STYLESHEETS} were read.`, "");
  writeFileSync(join(outDir, "brand-signals.md"), `${lines.join("\n")}\n`, "utf8");
}

main().catch((err) => die(clean(err && err.message ? err.message : String(err))));
