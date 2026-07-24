#!/usr/bin/env node
/* ============================================================
   build.mjs — generates the startup-stack site into _site/ from
   the repository's own markdown plus the skin in web/assets/.

   Zero dependencies. Node >= 18.   Usage:  node web/build.mjs

   Contract:
   - The markdown files ARE the content. There is no separate copy of
     the prose anywhere, so the site cannot drift from the repo.
   - _site/ is GENERATED — never hand-edit it, and never commit it.
   - The build FAILS LOUDLY on a broken internal link, a missing
     diagram, a prompt that is not routed to a group, or a page whose
     title cannot be found. A silently wrong site is worse than none.
   ============================================================ */
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, dirname, relative, resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const WEB = join(ROOT, "web");
const ASSETS = join(WEB, "assets");
const OUT = join(ROOT, "_site");

const CONFIG = existsSync(join(ROOT, "site.config.json"))
  ? JSON.parse(readFileSync(join(ROOT, "site.config.json"), "utf8"))
  : {};
const SITE_NAME = CONFIG.siteName || "startup-stack";
const TAGLINE = CONFIG.tagline || "";
const SITE_BASE = CONFIG.siteBase || "https://fritzhand.github.io/startup-stack/";
/* GitHub Pages serves 404.html for /anything/at/any/depth, so that one page
   cannot use the page-relative prefix every other page uses. */
const PATH_PREFIX = (() => { try { return new URL(SITE_BASE).pathname || "/"; } catch { return "/"; } })();
const REPO_URL = CONFIG.repo || "https://github.com/fritzhand/startup-stack";
const BLOB = `${REPO_URL}/blob/main/`;
const TREE = `${REPO_URL}/tree/main/`;

const errors = [];
const fail = (m) => errors.push(m);

/* ---------------- small helpers ---------------- */
const read = (rel) => readFileSync(join(ROOT, rel), "utf8");
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const slugify = (s) => String(s ?? "").toLowerCase()
  .replace(/`/g, "").replace(/&/g, " and ")
  .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const rootFor = (url) => "../".repeat(url.split("/").length - 1);
const clean = (s) => String(s ?? "").replace(/\s+/g, " ").trim();
/* strip markdown syntax down to plain text — for titles, summaries, search */
const plain = (s) => clean(String(s ?? "")
  .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
  .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
  .replace(/`([^`]*)`/g, "$1")
  .replace(/\*\*([^*]+)\*\*/g, "$1")
  .replace(/\*([^*]+)\*/g, "$1")
  .replace(/^#+\s*/, ""));
const truncate = (s, n) => (s.length <= n ? s : `${s.slice(0, n - 1).replace(/[\s,;.—-]+$/, "")}…`);

/* ---------------- front matter ---------------- */
/* Only as much YAML as this repo's schema uses: scalars, inline lists,
   and values folded across continuation lines. */
function frontmatter(src) {
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return [{}, src];
  const fm = {};
  let key = null;
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z_][\w-]*):\s?(.*)$/);
    if (kv) {
      key = kv[1];
      const raw = kv[2].trim();
      /* A quoted value is a string, always. Stripping the quotes first turned
         owner: "[TBD]" into the one-item list ["TBD"], which is a different
         type and silently broke every check that read it as text. */
      const quoted = /^".*"$/.test(raw) || /^'.*'$/.test(raw);
      const v = quoted ? raw.slice(1, -1) : raw;
      if (!quoted && /^\[.*\]$/.test(v)) {
        fm[key] = v.slice(1, -1).split(",").map((x) => x.trim()).filter(Boolean);
        key = null;
      } else fm[key] = v;
    } else if (key && /^\s+\S/.test(line) && typeof fm[key] === "string") {
      fm[key] = `${fm[key]} ${line.trim()}`.trim();
    }
  }
  return [fm, m[2]];
}

/* ============================================================
   THE PAGE MAP — repo-relative source path → generated page.
   Anything not in here that is linked to resolves to GitHub, so a
   link to a stack template or the licence still works.
   ============================================================ */
const PAGES = [];        /* {url, title, lede, src, kind, group, nav} */
const PAGE_BY_SRC = new Map();

const addPage = (p) => { PAGES.push(p); if (p.src) PAGE_BY_SRC.set(p.src, p.url); return p; };

/* ---- the markdown pages that come straight from docs/ and the root ---- */
const DOC_PAGES = [
  { src: "QUICKSTART.md", url: "quickstart.html", nav: "Start here", short: "Your first hour" },
  { src: "docs/ai-basics.md", url: "ai-basics.html", nav: "Start here", short: "New to working with AI" },
  { src: "docs/what-things-are.md", url: "what-things-are.html", nav: "Start here", short: "What the words mean" },
  { src: "docs/method.md", url: "method.html", nav: "The method", short: "The method" },
  { src: "docs/knowledge-base.md", url: "knowledge-base.html", nav: "The method", short: "Build the knowledge base" },
  { src: "docs/front-matter.md", url: "front-matter.html", nav: "The method", short: "Front matter schema" },
  { src: "AGENTS.md", url: "rules.html", nav: "The method", short: "Rules for the AI" },
  { src: "docs/scraping.md", url: "scraping.html", nav: "Tools", short: "Website to inbox" },
  { src: "docs/for-coaches.md", url: "for-coaches.html", nav: "Running it", short: "For coaches" },
  { src: "docs/weekly-recap.md", url: "weekly-recap.html", nav: "Running it", short: "The weekly recap" },
  { src: "docs/safety.md", url: "safety.html", nav: "Running it", short: "Safety rules" },
];

/* ---- prompts: the library, grouped the way prompts/INDEX.md groups them ---- */
const PROMPT_GROUPS = {
  "00": "Build and maintain", "01": "Build and maintain", "02": "Build and maintain",
  "03": "Sharpen a section", "04": "Sharpen a section", "05": "Sharpen a section",
  "06": "Sharpen a section", "07": "Sharpen a section", "08": "Sharpen a section",
  "09": "Sharpen a section",
  "10": "Produce something", "11": "Produce something", "12": "Produce something",
  "14": "Produce something", "15": "Produce something",
  "13": "Get told what is wrong",
};
const GROUP_ORDER = ["Build and maintain", "Sharpen a section", "Produce something", "Get told what is wrong"];

/* ============================================================
   MARKDOWN → HTML
   A deliberately small renderer covering exactly what this repo
   writes: headings, fenced code, GitHub tables, nested lists,
   blockquotes, rules, and inline emphasis / code / links / images.
   ============================================================ */

const CODE_TOKEN = "\u0000C";

function inline(text, ctx) {
  const codes = [];
  let s = String(text ?? "").replace(/`([^`]+)`/g, (_, c) => {
    codes.push(esc(c));
    return `${CODE_TOKEN}${codes.length - 1}\u0000`;
  });
  s = esc(s);
  /* The href inside the parentheses has just been escaped along with the rest
     of the line, so it has to be put back before it is resolved or compared
     against the filesystem — otherwise ?a=1&b=2 becomes ?a=1&amp;b=2, and the
     single esc() below would make it &amp;amp;. */
  const href = (h) => String(h)
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
  /* images before links — the syntax only differs by the leading bang */
  s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g,
    (_, alt, h) => `<img src="${esc(linkFor(href(h), ctx))}" alt="${alt}" loading="lazy">`);
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, (_, label, h) => {
    const to = linkFor(href(h), ctx);
    const ext = /^https?:/.test(to);
    return `<a href="${esc(to)}"${ext ? ' target="_blank" rel="noopener"' : ""}>${label}</a>`;
  });
  /* runs after esc(), so the URL may contain &amp; — stop at the closing &gt; */
  s = s.replace(/&lt;(https?:\/\/(?:(?!&gt;)\S)+)&gt;/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/(^|[\s(])\*([^*\s][^*]*?)\*(?=$|[\s).,;:!?])/g, "$1<em>$2</em>");
  s = s.replace(/(^|[\s(])_([^_\s][^_]*?)_(?=$|[\s).,;:!?])/g, "$1<em>$2</em>");
  s = s.replace(new RegExp(`${CODE_TOKEN}(\\d+)\\u0000`, "g"), (_, i) => `<code>${codes[+i]}</code>`);
  return s;
}

/* link rewriting: repo-relative markdown links become site URLs where a
   page exists, GitHub URLs where one does not, and are validated either way */
function linkFor(href, ctx) {
  const raw = String(href ?? "").trim();
  /* data: is deliberately absent — nothing here needs one, and letting it
     through would put unescaped author-controlled markup into an href */
  if (!raw || /^(https?:|mailto:|tel:|#)/i.test(raw)) return raw;
  if (/^[a-z][\w+.-]*:/i.test(raw)) { fail(`${ctx.src}: unsupported URL scheme — ${raw}`); return "#"; }

  const hashAt = raw.indexOf("#");
  const path = hashAt >= 0 ? raw.slice(0, hashAt) : raw;
  const hash = hashAt >= 0 ? raw.slice(hashAt) : "";
  if (!path) return raw;

  /* resolve against the directory of the source file, then make it repo-relative */
  /* a link may be percent-encoded; the filesystem is not */
  let decoded = path;
  try { decoded = decodeURIComponent(path); } catch { /* malformed escape: use it raw */ }
  const abs = resolve(join(ROOT, ctx.dir), decoded);
  const rel = relative(ROOT, abs).split("\\").join("/");

  if (rel.startsWith("..")) { fail(`${ctx.src}: link escapes the repo — ${raw}`); return raw; }
  if (!existsSync(abs)) { fail(`${ctx.src}: broken link — ${raw}`); return raw; }

  const page = PAGE_BY_SRC.get(rel);
  if (page) return `${ctx.root}${page}${hash}`;

  const isDir = statSync(abs).isDirectory();
  return `${isDir ? TREE : BLOB}${rel}${isDir ? "" : hash}`;
}

function tableRow(line) {
  /* split on unescaped pipes, dropping the leading and trailing empties */
  const cells = line.trim().replace(/^\|/, "").replace(/\|$/, "").split(/(?<!\\)\|/);
  return cells.map((c) => c.replace(/\\\|/g, "|").trim());
}

function renderList(lines, i, ctx, out) {
  /* one list, possibly nested; returns the index after it */
  const startIndent = lines[i].match(/^(\s*)/)[1].length;
  const ordered = /^\s*\d+[.)]\s/.test(lines[i]);
  out.push(ordered ? "<ol>" : "<ul>");
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      /* a blank line ends the list unless the next line continues it */
      const next = lines[i + 1] || "";
      if (!/^\s*([-*+]|\d+[.)])\s/.test(next) || next.match(/^(\s*)/)[1].length < startIndent) break;
      i++;
      continue;
    }
    const indent = line.match(/^(\s*)/)[1].length;
    if (indent < startIndent) break;
    const m = line.match(/^\s*([-*+]|\d+[.)])\s+(.*)$/);
    if (!m) break;
    if (indent > startIndent) {
      /* nested list — attach it inside the item we just opened */
      const sub = [];
      i = renderList(lines, i, ctx, sub);
      const last = out.length - 1;
      out[last] = out[last].replace(/<\/li>$/, `${sub.join("")}</li>`);
      continue;
    }
    let body = m[2];
    /* continuation lines of the same item */
    while (i + 1 < lines.length) {
      const n = lines[i + 1];
      if (!n.trim() || /^\s*([-*+]|\d+[.)])\s/.test(n)) break;
      if (n.match(/^(\s*)/)[1].length <= startIndent) break;
      body += ` ${n.trim()}`;
      i++;
    }
    const box = body.match(/^\[( |x|X)\]\s+(.*)$/);
    if (box) body = `${box[1] === " " ? "☐" : "✓"} ${box[2]}`;
    out.push(`<li>${inline(body, ctx)}</li>`);
    i++;
  }
  out.push(ordered ? "</ol>" : "</ul>");
  return i;
}

function mdToHtml(src, ctx) {
  const lines = String(src).replace(/\r\n/g, "\n").split("\n");
  const out = [];
  let i = 0;
  let firstFence = true;

  while (i < lines.length) {
    const line = lines[i];

    /* diagram marker — inlined so it re-skins with the page theme */
    const dia = line.match(/^<!--\s*DIAGRAM:\s*([a-z0-9-]+)\s*-->\s*$/i);
    if (dia) { out.push(diagram(dia[1], ctx)); i++; continue; }

    if (!line.trim()) { i++; continue; }

    /* fenced code */
    const fence = line.match(/^(\s*)(```+|~~~+)\s*([\w-]*)\s*$/);
    if (fence) {
      const [, , mark, lang] = fence;
      const body = [];
      const closer = new RegExp(`^\\s*${mark[0]}{${mark.length},}\\s*$`);
      i++;
      /* only a line that is nothing but fence characters closes the block, so a
         block demonstrating markdown can contain a fence of its own */
      while (i < lines.length && !closer.test(lines[i])) body.push(lines[i++]);
      i++;
      /* the first block on a prompt page is the prompt itself — make it copyable */
      const copyable = ctx.kind === "Prompt" && firstFence;
      firstFence = false;
      const pre = `<pre${copyable ? ' data-copy="this prompt"' : ""}${lang ? ` class="lang-${esc(lang)}"` : ""}><code>${esc(body.join("\n"))}</code></pre>`;
      /* the copy button is positioned against this wrapper, not against the
         <pre> — the <pre> scrolls sideways, and the button must not go with it */
      out.push(copyable ? `<div class="codeblock">${pre}</div>` : pre);
      continue;
    }

    /* heading */
    const h = line.match(/^(#{1,6})\s+(.*?)\s*#*$/);
    if (h) {
      const level = h[1].length;
      const text = h[2];
      /* two headings with the same words would otherwise emit the same id, and
         the second anchor in the rail would jump to the first section */
      const base = slugify(plain(text));
      let id = base, n = 1;
      while (ctx.ids.has(id)) id = `${base}-${++n}`;
      ctx.ids.add(id);
      if (level >= 2 && level <= 3) ctx.toc.push({ level, id, text: plain(text) });
      out.push(`<h${level} id="${esc(id)}">${inline(text, ctx)}</h${level}>`);
      i++;
      continue;
    }

    /* Horizontal rule. Setext headings are deliberately not supported: every
       `---` in this repo follows a paragraph and means a rule, so reading them
       as underlines would silently turn those rules into headings. */
    if (/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) { out.push("<hr>"); i++; continue; }

    /* table */
    if (/^\s*\|/.test(line) && /^\s*\|?[\s:|-]+\|[\s:|-]*$/.test(lines[i + 1] || "")) {
      const head = tableRow(line);
      const align = tableRow(lines[i + 1]).map((c) =>
        c.startsWith(":") && c.endsWith(":") ? "center" : c.endsWith(":") ? "right" : c.startsWith(":") ? "left" : "");
      i += 2;
      const rows = [];
      while (i < lines.length && /^\s*\|/.test(lines[i])) rows.push(tableRow(lines[i++]));
      const th = head.map((c, n) => `<th${align[n] ? ` style="text-align:${align[n]}"` : ""}>${inline(c, ctx)}</th>`).join("");
      const tb = rows.map((r) => `<tr>${head.map((_, n) =>
        `<td${align[n] ? ` style="text-align:${align[n]}"` : ""}>${inline(r[n] ?? "", ctx)}</td>`).join("")}</tr>`).join("\n");
      out.push(`<div class="table-wrap"><table class="data"><thead><tr>${th}</tr></thead><tbody>${tb}</tbody></table></div>`);
      continue;
    }

    /* blockquote — collect the run, strip the markers, render recursively */
    if (/^\s*>/.test(line)) {
      const body = [];
      while (i < lines.length && /^\s*>/.test(lines[i])) body.push(lines[i++].replace(/^\s*>\s?/, ""));
      const inner = mdToHtml(body.join("\n"), { ...ctx, toc: [] });
      out.push(`<blockquote>${inner}</blockquote>`);
      continue;
    }

    /* list */
    if (/^\s*([-*+]|\d+[.)])\s+/.test(line)) { i = renderList(lines, i, ctx, out); continue; }

    /* paragraph */
    const para = [];
    while (i < lines.length && lines[i].trim()
      && !/^\s*(#{1,6}\s|>|\||```|~~~|-{3,}$|\*{3,}$)/.test(lines[i])
      && !/^\s*([-*+]|\d+[.)])\s+/.test(lines[i])
      && !/^<!--\s*DIAGRAM:/i.test(lines[i])) para.push(lines[i++]);
    if (para.length) out.push(`<p>${inline(para.join(" ").trim(), ctx)}</p>`);
  }
  return out.join("\n");
}

/* ---------------- diagrams ----------------
   Each diagram paints itself with var(--dg-*, #literal). Inlined into a page
   the variables win, so the drawing re-skins with the theme; opened straight
   from GitHub, where no stylesheet applies, the literal is all there is.
   That literal therefore has to equal the light-theme token, or the same
   picture is two different colours in two places. Checked, not trusted. */
const DG_LIGHT = (() => {
  const css = readFileSync(join(ASSETS, "tokens.css"), "utf8");
  const light = css.slice(0, css.indexOf(':root[data-theme="dark"]'));
  return Object.fromEntries([...light.matchAll(/--(dg-[a-z-]+):\s*(#[0-9a-fA-F]{3,8})/g)]
    .map(([, k, v]) => [k, v.toLowerCase()]));
})();

const DIAGRAM_DIR = join(ASSETS, "diagrams");
function checkDiagramPalette(name, svg) {
  for (const [, token, literal] of svg.matchAll(/var\(--(dg-[a-z-]+),\s*(#[0-9a-fA-F]{3,8})\)/g)) {
    const want = DG_LIGHT[token];
    if (!want) { fail(`diagrams/${name}.svg: --${token} is not defined in tokens.css`); continue; }
    if (literal.toLowerCase() !== want) {
      fail(`diagrams/${name}.svg: --${token} falls back to ${literal}, but tokens.css says ${want}`);
      return;   /* one line per file is enough to act on */
    }
  }
}

function diagram(name, ctx) {
  const file = join(DIAGRAM_DIR, `${name}.svg`);
  if (!existsSync(file)) { fail(`${ctx.src}: missing diagram web/assets/diagrams/${name}.svg`); return ""; }
  const svg = readFileSync(file, "utf8").replace(/<\?xml[^>]*\?>\s*/i, "").trim();
  checkDiagramPalette(name, svg);
  if (/<style[\s>]/i.test(svg)) fail(`diagrams/${name}.svg: contains a <style> block — GitHub strips those, so it must use presentation attributes only`);
  const cap = clean((svg.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || "");
  /* these are dense enough that shrinking them to phone width makes the
     labels unreadable — let them keep their size and scroll instead */
  return `<figure class="figure figure-wide">${svg}${cap ? `<figcaption class="figure-cap">${esc(cap)}</figcaption>` : ""}</figure>`;
}

/* ============================================================
   PAGE SHELL
   ============================================================ */
const I = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const ICONS = {
  search: I('<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>'),
  sun: I('<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4m11.4-11.4 1.4-1.4"/>'),
  moon: I('<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>'),
  up: I('<path d="m18 15-6-6-6 6"/>'),
  arrow: I('<path d="M5 12h14m-6-6 6 6-6 6"/>'),
  github: I('<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.9a3.4 3.4 0 0 0-1-2.6c3-.3 6.2-1.5 6.2-6.8A5.3 5.3 0 0 0 19.8 5a4.9 4.9 0 0 0-.1-3.7S18.5.8 16 2.5a13 13 0 0 0-7 0C6.5.8 5.3 1.3 5.3 1.3A4.9 4.9 0 0 0 5.2 5a5.3 5.3 0 0 0-1.4 3.7c0 5.3 3.2 6.5 6.2 6.8a3.4 3.4 0 0 0-1 2.6V22"/>'),
  stack: I('<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/>'),
};

const NAV = [
  { group: "Start here", items: [{ url: "index.html", title: "What this is" }] },
  { group: "The method", items: [] },
  { group: "Do the work", items: [] },
  { group: "Tools", items: [] },
  { group: "Running it", items: [] },
];
const navPush = (group, url, title) => {
  const g = NAV.find((x) => x.group === group);
  if (!g) { fail(`unknown nav group ${group}`); return; }
  g.items.push({ url, title });
};

function sidebar(root, active) {
  const link = (url, title) =>
    `<a class="nav-link" href="${root}${url}"${active === url ? ' aria-current="page"' : ""}>${esc(title)}</a>`;
  return `<nav class="sidebar" id="sidebar" aria-label="Site navigation">
${NAV.filter((g) => g.items.length).map((g) =>
    `<div class="sidebar-group"><div class="sidebar-title">${esc(g.group)}</div>${g.items.map((it) => link(it.url, it.title)).join("\n")}</div>`).join("\n")}
  <div class="sidebar-group"><div class="sidebar-title">Source</div>
    <a class="nav-link" href="${REPO_URL}" target="_blank" rel="noopener">The repository</a>
  </div>
</nav>`;
}

function shell({ url, title, description, body, toc = [], active, rootOverride }) {
  const root = rootOverride ?? rootFor(url);
  const pageTitle = url === "index.html" ? `${SITE_NAME} — ${TAGLINE}` : `${title} · ${SITE_NAME}`;
  const canonical = `${SITE_BASE}${url === "index.html" ? "" : url}`;
  const tocHtml = toc.length >= 3
    ? `<aside class="toc" aria-label="On this page"><div class="toc-title">On this page</div>
${toc.map((t) => `<a href="#${esc(t.id)}" class="l${t.level}">${esc(t.text)}</a>`).join("\n")}</aside>`
    : "";

  return `<!doctype html>
<html lang="en" data-theme="light" data-root="${root}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(pageTitle)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(canonical)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(SITE_NAME)}">
<meta property="og:title" content="${esc(url === "index.html" ? SITE_NAME : title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(canonical)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(url === "index.html" ? SITE_NAME : title)}">
<meta name="twitter:description" content="${esc(description)}">
<link rel="icon" href="${root}assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400..700;1,400..700&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${root}assets/tokens.css">
<link rel="stylesheet" href="${root}assets/site.css">
<script>try{var d=document.documentElement,t=localStorage.getItem("ss-theme");if(t)d.setAttribute("data-theme",t);else if(matchMedia("(prefers-color-scheme: dark)").matches)d.setAttribute("data-theme","dark");if(localStorage.getItem("ss-rail-collapsed")==="1")d.classList.add("rail-collapsed");}catch(e){}</script>
<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org", "@type": "WebSite",
    name: SITE_NAME, url: SITE_BASE, description: TAGLINE,
  })}</script>
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
<header class="topbar">
  <button class="nav-toggle" id="nav-toggle" aria-label="Open navigation" aria-controls="sidebar" aria-expanded="false"><span class="hb"><span class="hb-t"></span><span class="hb-m"></span><span class="hb-b"></span></span></button>
  <a class="brand" href="${root}index.html"><span class="brand-mark">${ICONS.stack}</span><span class="brand-name">startup<span class="thin">-stack</span></span></a>
  <div class="topbar-spacer"></div>
  <button class="searchbtn" data-search-open aria-label="Search this site">${ICONS.search}<span class="searchbtn-label">Search</span><kbd>⌘K</kbd></button>
  <a class="icon-btn" href="${REPO_URL}" target="_blank" rel="noopener" aria-label="The repository on GitHub">${ICONS.github}</a>
  <button class="icon-btn theme-toggle" id="theme-toggle" aria-label="Switch theme"><span class="sun">${ICONS.sun}</span><span class="moon">${ICONS.moon}</span></button>
</header>
<div class="scrim" id="scrim"></div>
<div class="layout">
${sidebar(root, active || url)}
<main class="content" id="main">
${tocHtml ? `<div class="content-with-toc"><div>${body}</div>${tocHtml}</div>` : body}
</main>
</div>
<footer class="footer"><div class="footer-inner">
  <p class="footer-note">Every company, customer, metric and transcript used as an example in this repository is invented. Nothing here is drawn from any real client engagement.</p>
  <div class="f-links">
    <a href="${root}index.html">Home</a>
    <a href="${root}quickstart.html">Quickstart</a>
    <a href="${root}safety.html">Safety</a>
    <a href="${REPO_URL}" target="_blank" rel="noopener">Repository</a>
    <span>MIT licensed</span>
  </div>
</div></footer>
<button class="to-top" id="to-top" aria-label="Back to top">${ICONS.up}</button>
<div class="search-modal" id="search-modal" role="dialog" aria-modal="true" aria-label="Search">
  <div class="backdrop"></div>
  <div class="search-panel">
    <div class="search-head">${ICONS.search}<input id="search-input" type="search" placeholder="Search prompts, worksheets and pages…" autocomplete="off" spellcheck="false" aria-label="Search"></div>
    <div id="search-status" class="sr-only" aria-live="polite"></div>
    <div class="results" id="search-results"></div>
    <div class="search-foot"><span><kbd>↑</kbd><kbd>↓</kbd> to move</span><span><kbd>↵</kbd> to open</span><span><kbd>esc</kbd> to close</span></div>
  </div>
</div>
<script src="${root}assets/search-index.js"></script>
<script src="${root}assets/site.js"></script>
</body>
</html>`;
}

/* ============================================================
   BUILD
   ============================================================ */
rmSync(OUT, { recursive: true, force: true });
mkdirSync(join(OUT, "assets"), { recursive: true });

/* ---- 1. discover the content ---------------------------------- */
const promptFiles = readdirSync(join(ROOT, "prompts"))
  .filter((f) => /^\d\d-.*\.md$/.test(f)).sort();
const worksheetFiles = readdirSync(join(ROOT, "worksheets"))
  .filter((f) => f.endsWith(".md") && f !== "README.md").sort();
const stackSections = readdirSync(join(ROOT, "stack"), { withFileTypes: true })
  .filter((d) => d.isDirectory() && /^\d\d-/.test(d.name)).map((d) => d.name).sort();

/* The first heading is the title. The lede is the first paragraph after it —
   or, where a file opens with a framing quote instead (most worksheets do),
   the first line of that quote, which is the same sentence a summary needs. */
function titleAndLede(src) {
  const [, body] = frontmatter(src);
  const lines = body.split("\n");
  let title = "", lede = "";
  for (let i = 0; i < lines.length; i++) {
    const h = lines[i].match(/^#\s+(.*)$/);
    if (!h) continue;
    /* placeholders belong in the file, not in a card: "SOP — `[Name]`" → "SOP" */
    title = plain(h[1])
      .replace(/\s*—\s*\[[^\]]*\]/g, "")          /* "SOP — [Name]"                */
      .replace(/\s*—\s*[^—]*\bYYYY-MM-DD\b.*$/, "") /* "… — week ending YYYY-MM-DD" */
      .replace(/\s*—\s*$/, "").trim();
    for (let j = i + 1; j < lines.length; j++) {
      const l = lines[j].trim();
      if (!l) continue;
      if (/^(#|\||```|---)/.test(l)) break;
      lede = plain(l.replace(/^>\s?/, ""));
      if (lede) break;
    }
    break;
  }
  return { title, lede };
}

/* ---- 2. register every page before rendering, so links resolve ---- */
for (const d of DOC_PAGES) {
  if (!existsSync(join(ROOT, d.src))) { fail(`missing source ${d.src}`); continue; }
  const { title, lede } = titleAndLede(read(d.src));
  if (!title) fail(`${d.src}: no level-1 heading, so the page has no title`);
  const p = addPage({ ...d, title: title || d.short, lede, kind: "Page" });
  navPush(d.nav, p.url, d.short);
}

addPage({ src: "prompts/INDEX.md", url: "prompts/index.html", title: "Prompt library", kind: "Page", nav: "Do the work",
  lede: `${promptFiles.length} prompts that run on top of a filled-in stack. Copy one, paste it into an AI that can see your folder, and answer what it asks.` });
navPush("Do the work", "prompts/index.html", "Prompt library");

for (const f of promptFiles) {
  const src = `prompts/${f}`;
  const num = f.slice(0, 2);
  const { title, lede } = titleAndLede(read(src));
  if (!title) fail(`${src}: no level-1 heading, so the page has no title`);
  if (!PROMPT_GROUPS[num]) fail(`prompt ${f} is not routed to a group in PROMPT_GROUPS`);
  addPage({ src, url: `prompts/${f.replace(/\.md$/, ".html")}`, title, lede, kind: "Prompt", group: PROMPT_GROUPS[num], num });
}

addPage({ src: "worksheets/README.md", url: "worksheets/index.html", title: "Worksheets", kind: "Page", nav: "Do the work",
  lede: `The ${worksheetFiles.length} fill-in files you produce over and over — one per customer interview, competitor, experiment and recap.` });
navPush("Do the work", "worksheets/index.html", "Worksheets");

for (const f of worksheetFiles) {
  const src = `worksheets/${f}`;
  const { title, lede } = titleAndLede(read(src));
  if (!title) fail(`${src}: no level-1 heading, so the page has no title`);
  addPage({ src, url: `worksheets/${f.replace(/\.md$/, ".html")}`, title, lede, kind: "Worksheet" });
}

addPage({ src: "stack/INDEX.md", url: "stack.html", title: "The ten sections", kind: "Page", nav: "The method", lede: "What lives in each section of the stack, and how the router works." });
navPush("The method", "stack.html", "The ten sections");

/* ---- 3. render ------------------------------------------------- */
const written = [];
const write = (url, html) => {
  mkdirSync(dirname(join(OUT, url)), { recursive: true });
  writeFileSync(join(OUT, url), html);
  written.push(url);
};

/* The H1 becomes the page header and its first paragraph becomes the lede,
   so both are lifted out of the body rather than repeated inside it. */
function stripTitleAndLede(body, lede) {
  const lines = body.replace(/\r\n/g, "\n").split("\n");
  const h1 = lines.findIndex((l) => /^#\s+/.test(l));
  if (h1 < 0) return body;
  lines.splice(h1, 1);
  if (!lede) return lines.join("\n");
  let i = h1;
  while (i < lines.length && !lines[i].trim()) i++;
  const start = i;
  while (i < lines.length && lines[i].trim()) i++;
  if (start < lines.length && plain(lines.slice(start, i).join(" ")) === lede) lines.splice(start, i - start);
  return lines.join("\n");
}

function renderMarkdownPage(page, extra = {}) {
  const [, body] = frontmatter(read(page.src));
  const ctx = { src: page.src, dir: dirname(page.src), root: rootFor(page.url), toc: [], ids: new Set(), kind: page.kind };
  const html = mdToHtml(stripTitleAndLede(body, page.lede), ctx);
  const crumbs = extra.crumbs || "";
  const head = `<div class="page-head">${crumbs}<h1>${esc(page.title)}</h1>${page.lede ? `<p class="lede">${esc(page.lede)}</p>` : ""}</div>`;
  const source = `<p class="small muted section-gap">Generated from <a href="${BLOB}${page.src}" target="_blank" rel="noopener"><code>${esc(page.src)}</code></a> in the repository. Edit the markdown, not this page.</p>`;
  return shell({
    url: page.url, title: page.title,
    description: truncate(page.lede || TAGLINE, 160),
    body: `${head}<div class="prose">${html}</div>${source}`,
    toc: ctx.toc, active: extra.active,
  });
}

for (const page of PAGES) {
  if (!page.src || page.url === "index.html") continue;
  if (page.url === "prompts/index.html" || page.url === "worksheets/index.html" || page.url === "stack.html") continue;
  const crumbs = page.kind === "Prompt"
    ? `<nav class="crumbs"><a href="../prompts/index.html">Prompt library</a> <span>/</span> <span>${esc(page.num)}</span></nav>`
    : page.kind === "Worksheet"
      ? `<nav class="crumbs"><a href="../worksheets/index.html">Worksheets</a></nav>` : "";
  const active = page.kind === "Prompt" ? "prompts/index.html" : page.kind === "Worksheet" ? "worksheets/index.html" : page.url;
  write(page.url, renderMarkdownPage(page, { crumbs, active }));
}

/* ---- 4. the three index pages that are more than their markdown ---- */

/* prompt library — the markdown intro, then a filterable grid */
{
  const page = PAGES.find((p) => p.url === "prompts/index.html");
  const [, body] = frontmatter(read(page.src));
  const ctx = { src: page.src, dir: "prompts", root: "../", toc: [], ids: new Set(), kind: "Page" };
  /* The tables in INDEX.md are replaced here by the live grid, so only the
     prose before the first table and after the last one is carried over —
     and any sentence pointing at "the table below" goes with them. */
  const intro = body.split("\n## Build and maintain")[0]
    .replace(/^#\s+.*$/m, "")
    .split(/\n{2,}/).filter((p) => !/\b(column|table|list) below\b/i.test(p)).join("\n\n");
  /* The tables between intro and outro are not rendered here, so their links
     would escape validation. Render the whole file into a throwaway buffer for
     the side effect of checking every link in it. */
  mdToHtml(body, { src: page.src, dir: "prompts", root: "../", toc: [], ids: new Set(), kind: "Page" });
  const outro = body.includes("## Using them well") ? `## Using them well${body.split("## Using them well")[1]}` : "";

  const prompts = PAGES.filter((p) => p.kind === "Prompt")
    .sort((a, b) => a.num.localeCompare(b.num));
  /* the filter runtime matches data-group tokens, so the values are slugs;
     the "All" chip carries an empty value, which clears the group */
  const chips = [["", "All"], ...GROUP_ORDER.map((g) => [slugify(g), g])].map(([v, label]) =>
    `<button class="chip" type="button" data-filter-group="group" data-filter-value="${esc(v)}" aria-pressed="${v === ""}">${esc(label)}</button>`).join("");
  const cards = prompts.map((p) => `<a class="prompt-card" href="../${p.url}" data-group="${esc(slugify(p.group))}" data-search="${esc(`${p.num} ${p.title} ${p.lede} ${p.group}`.toLowerCase())}">
    <span class="pc-num">Prompt ${esc(p.num)}</span>
    <span class="pc-title">${esc(p.title.replace(/^Prompt \d+\s*—\s*/, ""))}</span>
    <span class="pc-desc">${esc(truncate(p.lede, 150))}</span>
    <span class="pc-meta"><span class="pc-chip">${esc(p.group)}</span></span>
  </a>`).join("\n");

  const grid = `<div class="toolbar">
  <div class="field">${ICONS.search}<input id="lib-q" type="search" placeholder="Filter prompts…" aria-label="Filter prompts"></div>
</div>
<div class="chip-row"><span class="chip-label">Group</span>${chips}</div>
<div class="result-count" id="lib-count"></div>
<div class="grid grid-2" id="lib-grid">${cards}</div>
<div class="empty-state" id="lib-empty" hidden><div class="big">No prompt matches that filter.</div>Clear the search box, or choose “All”.</div>`;

  write(page.url, shell({
    url: page.url, title: page.title, description: truncate(page.lede, 160),
    body: `<div class="page-head"><h1>${esc(page.title)}</h1><p class="lede">${esc(page.lede)}</p></div>
<div class="prose">${mdToHtml(intro, ctx)}</div>
${grid}
<div class="prose section-gap">${mdToHtml(outro, { ...ctx, toc: [] })}</div>`,
    toc: ctx.toc,
  }));
}

/* worksheets — the markdown, then a card per worksheet */
{
  const page = PAGES.find((p) => p.url === "worksheets/index.html");
  const [, body] = frontmatter(read(page.src));
  const ctx = { src: page.src, dir: "worksheets", root: "../", toc: [], ids: new Set(), kind: "Page" };
  const sheets = PAGES.filter((p) => p.kind === "Worksheet");
  const cards = sheets.map((w) => `<a class="card" href="../${w.url}">
    <h3>${esc(w.title.replace(/\s*—\s*`?\[[^\]]*\]`?$/, ""))}</h3>
    <p>${esc(truncate(w.lede, 140))}</p></a>`).join("\n");
  write(page.url, shell({
    url: page.url, title: page.title, description: truncate(page.lede, 160),
    body: `<div class="page-head"><h1>${esc(page.title)}</h1><p class="lede">${esc(page.lede)}</p></div>
<div class="grid grid-2">${cards}</div>
<div class="prose section-gap">${mdToHtml(body.replace(/^#\s+.*$/m, ""), ctx)}</div>`,
    toc: ctx.toc,
  }));
}

/* ============================================================
   THE CARVE RULE, IN CODE
   AGENTS.md rule 5: pull from `public` freely, from `internal` only on an
   explicit instruction, and never from `restricted`. A `summary:` line is
   exactly where a founder is told to put the routing facts — the margin, the
   runway, the customer name — so publishing every one of them onto a public
   web page would break that rule the moment anyone forks this repo and keeps
   web/. The README says to delete web/ when you fork; this does not depend on
   their having read it.

   A summary is published only when it is safe on its own terms: the file is
   declared public, or it is still the shipped template — status `tbd` with no
   owner named — in which case the line documents the template rather than
   describing anybody's company.
   ============================================================ */
const withheld = new Set();
const isUntouchedTemplate = (fm) => {
  const owner = Array.isArray(fm.owner) ? fm.owner.join(",") : String(fm.owner || "");
  return (fm.status || "").trim() === "tbd" && /^\s*\[?TBD\]?\s*$/.test(owner.trim());
};
function publishableSummary(rel, fm) {
  if ((fm.sensitivity || "").trim() === "public") return fm.summary || "";
  if (isUntouchedTemplate(fm)) return fm.summary || "";
  withheld.add(`${rel} (${fm.sensitivity || "no sensitivity"})`);
  return "";
}

/* the ten sections — the router, plus what each template declares about itself */
{
  const page = PAGES.find((p) => p.url === "stack.html");
  const [, body] = frontmatter(read(page.src));
  const ctx = { src: page.src, dir: "stack", root: "", toc: [], ids: new Set(), kind: "Page" };
  const rows = stackSections.map((dir) => {
    const files = readdirSync(join(ROOT, "stack", dir)).filter((f) => f.endsWith(".md"));
    if (!files.length) { fail(`stack/${dir} has no markdown file`); return ""; }
    const rel = `stack/${dir}/${files[0]}`;
    const [fm] = frontmatter(read(rel));
    if (!fm.summary) fail(`${rel} has no summary in its front matter`);
    const summary = publishableSummary(rel, fm);
    return `<tr>
      <td class="cell-tight"><a href="${BLOB}${rel}" target="_blank" rel="noopener"><code>${esc(dir)}</code></a></td>
      <td id="${esc(slugify(dir))}">${esc(fm.title || "")}</td>
      <td class="cell-tight"><span class="badge b-plain">${esc(fm.sensitivity || "—")}</span></td>
      <td class="cell-wide">${summary ? esc(summary) : `<span class="muted">Not published — this section is marked <code>${esc(fm.sensitivity || "internal")}</code> and has been filled in.</span>`}</td>
    </tr>`;
  }).join("\n");
  const table = `<div class="table-wrap"><table class="data">
<thead><tr><th class="cell-tight">Section</th><th>Title</th><th class="cell-tight">Sensitivity</th><th class="cell-wide">What it holds</th></tr></thead>
<tbody>${rows}</tbody></table></div>`;
  write(page.url, shell({
    url: page.url, title: page.title, description: truncate(page.lede, 160),
    body: `<div class="page-head"><h1>${esc(page.title)}</h1><p class="lede">${esc(page.lede)}</p></div>
<div class="prose"><p>These ten files are the knowledge base. The repository ships them empty, front matter and prompts in place — you fill them in, you do not copy them out. Each one declares who owns it, when it was last checked, how far it can be shared, and a one-line summary that the router reads.</p></div>
${table}
<div class="prose section-gap">${mdToHtml(body.replace(/^#\s+.*$/m, ""), ctx)}</div>`,
    toc: ctx.toc,
  }));
}

/* ---- 5. home --------------------------------------------------- */
{
  const counts = {
    sections: stackSections.length,
    prompts: promptFiles.length,
    worksheets: worksheetFiles.length,
    docs: DOC_PAGES.length,
  };
  const card = (href, title, text) => `<a class="card" href="${href}"><h3>${esc(title)}</h3><p>${esc(text)}</p></a>`;
  const body = `
<section class="hero">
  <div class="hero-copy">
    <h1>The documents every startup should have — compiled into a knowledge base an AI can actually read.</h1>
    <p>Drop your pitch deck, market research, business plan, competitor notes and call transcripts into one folder. An AI turns them into a structured, front-mattered knowledge base. Then a library of prompts runs on top of it to produce the work: the deck, the list of 100, the unit economics, the weekly recap.</p>
    <div class="hero-actions">
      <a class="btn btn-primary" href="quickstart.html">Start with your first hour ${ICONS.arrow}</a>
      <a class="btn btn-secondary" href="ai-basics.html">New to working with AI</a>
    </div>
  </div>
</section>

<div class="stats">
  <a class="stat" href="stack.html"><div class="n">${counts.sections}</div><div class="l">sections in the stack</div></a>
  <a class="stat" href="prompts/index.html"><div class="n">${counts.prompts}</div><div class="l">prompts in the library</div></a>
  <a class="stat" href="worksheets/index.html"><div class="n">${counts.worksheets}</div><div class="l">repeatable worksheets</div></a>
  <div class="stat"><div class="n">0</div><div class="l">lines of code you have to write</div></div>
</div>

<div class="prose section-gap">
<h2 id="the-problem">The problem this solves</h2>
<p>Most early founders are carrying their company in their head and in twelve unrelated files. The pitch deck says one number, the projections say another, the market research lives in a PDF nobody has opened since March, and every AI conversation starts from zero — so every answer is generic, and the founder pays for the model to re-read everything, every time.</p>
<p>Meanwhile the advice they need is not exotic. It is the same twenty things, asked in the same order, by every coach who has ever sat across from an early-stage founder: who exactly is the customer, what does a unit cost you, who else is doing this, how many prospects are on your list, and what happens when the money runs out.</p>
<h2 id="three-loops">The three loops</h2>
</div>

<div class="grid grid-3">
  <div class="card loop loop-build"><h3>Loop 1 · Build</h3><p>Raw material goes into <code>_inbox/</code>. One prompt reads it and writes the stack — ten sections, every fact tagged confirmed, unverified or missing. An afternoon. The output is deliberately incomplete, because a gap you can see is a task.</p></div>
  <div class="card loop loop-enrich"><h3>Loop 2 · Enrich</h3><p>Every real thing that happens — a customer call, a supplier quote, a rejected campaign, a new competitor — goes back in. The base is never finished. Each addition makes the next request cheaper and better.</p></div>
  <div class="card loop loop-pulse"><h3>Loop 3 · Pulse</h3><p>Once a week, one prompt reads the stack and what changed, and writes the recap: what moved, what did not, what you learned, and how many weeks of money are left. Thirty minutes.</p></div>
</div>

<div class="prose section-gap"><h2 id="start">Where to start</h2></div>
<div class="grid grid-2">
${card("ai-basics.html", "You have never pointed an AI at your own files", "What actually changed, what the terminal is, what the AI cannot see, and the one rule that never bends. Read this first if the rest of the site assumes something you have not done.")}
${card("quickstart.html", "You are ready to build", "The honest first hour: take a copy, fill the inbox, run the bootstrap prompt, and correct the one-pager by hand.")}
${card("prompts/index.html", "You have a stack and want the work done", "Sixteen prompts — unit economics, the list of 100, competitive intelligence, the deck, the weekly recap, and the adversarial review that tells you what an investor will attack.")}
${card("for-coaches.html", "You are running this with a cohort", "How the method works with a group, what to expect in week one, and where founders get stuck.")}
</div>

<div class="prose section-gap">
<h2 id="cost">The honest cost</h2>
<blockquote><p>Skeleton in an hour. A working v1 in a few focused sessions. A stack you actually trust in about a month, because the long pole is you correcting what the AI got wrong — not the AI writing it. Then roughly thirty minutes a week to keep it alive.</p></blockquote>
<p>Nobody should tell you this is free. The AI drafts; you validate. A stack you have not corrected is a confident-sounding guess about your own company, and that is worse than no stack at all.</p>
<h2 id="rules">The rules this runs on</h2>
<ol>
<li><strong>The document is the data.</strong> If a metric needs special effort to gather, it is the wrong metric.</li>
<li><strong>AI drafts, the founder validates.</strong> Nothing is true because the model wrote it.</li>
<li><strong>Tag honestly.</strong> <code>needs-verification</code> and <code>tbd</code> are the quality system, not failures.</li>
<li><strong>Enrich, do not perfect.</strong> Ship the skeleton. Add to it forever.</li>
<li><strong>One index, one summary line per file.</strong> This is what keeps the base cheap to run.</li>
<li><strong>Private master, shared derived.</strong> Every file declares a sensitivity; what you share is carved from the master.</li>
<li><strong>Scope the AI to one folder.</strong> Start narrow, widen as fast as your confidence and no faster.</li>
</ol>
<p>The full reasoning is in <a href="method.html">the method</a>; the rules the AI itself must follow are in <a href="rules.html">rules for the AI</a>.</p>
</div>`;
  write("index.html", shell({
    url: "index.html", title: SITE_NAME, description: TAGLINE, body,
  }));
}

/* ---- 6. 404 ---------------------------------------------------- */
write("404.html", shell({
  url: "404.html", title: "Page not found", description: "That page does not exist.",
  rootOverride: PATH_PREFIX,
  body: `<div class="page-head"><h1>Page not found</h1><p class="lede">That page does not exist, or it moved.</p></div>
<div class="prose"><p>Try the <a href="${PATH_PREFIX}index.html">home page</a>, the <a href="${PATH_PREFIX}prompts/index.html">prompt library</a>, or press <kbd>⌘K</kbd> to search.</p></div>`,
}));

/* ---- 7. search index, assets, sitemap -------------------------- */
/* the runtime's contract: { t: title, s: short label, d: description, k: kind, u: url },
   kinds lowercase — page | prompt | worksheet | section */
const searchIndex = PAGES.map((p) => ({
  t: p.title.replace(/^Prompt \d+\s*—\s*/, ""),
  s: p.kind === "Prompt" ? `Prompt ${p.num}` : "",
  d: truncate(p.lede || "", 120),
  k: p.kind.toLowerCase(),
  u: p.url,
}));
for (const dir of stackSections) {
  const files = readdirSync(join(ROOT, "stack", dir)).filter((f) => f.endsWith(".md"));
  if (!files.length) continue;
  const rel = `stack/${dir}/${files[0]}`;
  const [fm] = frontmatter(read(rel));
  searchIndex.push({
    t: fm.title || dir, s: dir,
    d: truncate(publishableSummary(rel, fm), 120),   /* same carve rule as the table */
    k: "section",
    u: `stack.html#${slugify(dir)}`,                 /* land on the row, not the page top */
  });
}

cpSync(ASSETS, join(OUT, "assets"), { recursive: true, filter: (src) => !src.includes("diagrams") });
writeFileSync(join(OUT, "assets", "search-index.js"), `window.SEARCH_INDEX=${JSON.stringify(searchIndex)};`);
writeFileSync(join(OUT, "assets", "favicon.svg"),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#0b5a86"/><g fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round"><path d="M18 24h28"/><path d="M18 34h28"/><path d="M18 44h18"/></g></svg>`);
writeFileSync(join(OUT, ".nojekyll"), "");
writeFileSync(join(OUT, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${SITE_BASE}sitemap.xml\n`);
writeFileSync(join(OUT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${written
    .filter((u) => u !== "404.html")
    .map((u) => `  <url><loc>${SITE_BASE}${u === "index.html" ? "" : u}</loc></url>`).join("\n")}\n</urlset>\n`);

/* ---- 8. report ------------------------------------------------- */
if (errors.length) {
  console.error(`\nBuild failed — ${errors.length} problem${errors.length === 1 ? "" : "s"}:\n`);
  for (const e of errors) console.error(`  · ${e}`);
  console.error("");
  process.exit(1);
}
if (withheld.size) {
  console.log(`\nWithheld ${withheld.size} summary line${withheld.size === 1 ? "" : "s"} from the site — not public, and filled in:`);
  for (const w of withheld) console.log(`  · ${w}`);
  console.log("  The section still appears; only the summary is held back. See AGENTS.md rule 5.\n");
}
console.log(`Built ${written.length} pages into _site/`);
console.log(`  ${PAGES.filter((p) => p.kind === "Prompt").length} prompts · ${PAGES.filter((p) => p.kind === "Worksheet").length} worksheets · ${searchIndex.length} search entries`);
