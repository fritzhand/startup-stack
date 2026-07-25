/* ============================================================
   site.js — client runtime for the startup-stack site.

   Zero dependencies, one IIFE, no build step. Every feature looks
   for its root element first and does nothing if the page does not
   have one, so the same file is safe to load on every page.

   Search reads window.SEARCH_INDEX — an array of
   { t: title, s: short label, d: description, k: kind, u: url }
   entries written out by the build alongside the pages.

   Two things are remembered between visits, both in localStorage:
     ss-theme            "light" | "dark"
     ss-rail-collapsed   "1" | "0"  (desktop sidebar collapsed)
   The small script in each page's <head> reads ss-theme before the
   first paint; this file only writes it.
   ============================================================ */
(() => {
  "use strict";

  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const ROOT = document.documentElement.getAttribute("data-root") || "";

  const KIND_LABEL = { page: "Page", prompt: "Prompt", worksheet: "Worksheet", section: "Section", term: "Term" };

  const motionOK = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const scrollBehavior = motionOK ? "smooth" : "auto";

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch {} },
  };

  /* ---------- theme ---------- */
  const themeBtn = $("#theme-toggle");
  if (themeBtn) {
    const syncLabel = () => {
      const dark = document.documentElement.getAttribute("data-theme") === "dark";
      themeBtn.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
    };
    syncLabel();
    themeBtn.addEventListener("click", () => {
      const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      store.set("ss-theme", next);
      syncLabel();
    });
  }

  /* ---------- nav: mobile drawer, desktop rail collapse ---------- */
  // no-op when the head script has already applied the stored state
  if (store.get("ss-rail-collapsed") === "1") document.documentElement.classList.add("rail-collapsed");

  const navToggle = $("#nav-toggle");
  const scrim = $("#scrim");
  const openNav = () => {
    const y = window.scrollY || 0;
    document.body.dataset.lockY = String(y);
    document.body.style.top = `-${y}px`;          // freeze the page at its scroll offset
    document.body.classList.add("nav-open");
    document.documentElement.classList.add("nav-open");
    const sb = $("#sidebar"); if (sb) sb.scrollTop = 0;
    navToggle && navToggle.setAttribute("aria-expanded", "true");
  };
  const closeNav = () => {
    if (!document.body.classList.contains("nav-open")) return;
    document.body.classList.remove("nav-open");
    document.documentElement.classList.remove("nav-open");
    const y = parseInt(document.body.dataset.lockY || "0", 10);
    document.body.style.top = "";
    // restore the pre-open position instantly (html has scroll-behavior:smooth),
    // then once more next frame to win against the browser's scroll anchoring
    window.scrollTo({ top: y, left: 0, behavior: "instant" });
    requestAnimationFrame(() => window.scrollTo({ top: y, left: 0, behavior: "instant" }));
    navToggle && navToggle.setAttribute("aria-expanded", "false");
  };
  if (navToggle) {
    // one button, two jobs: off-canvas drawer on mobile, rail collapse on desktop
    const desktop = window.matchMedia("(min-width: 1024px)");
    const syncToggle = () => {
      if (desktop.matches) {
        const open = !document.documentElement.classList.contains("rail-collapsed");
        navToggle.setAttribute("aria-expanded", String(open));
        navToggle.setAttribute("aria-label", open ? "Collapse sidebar" : "Expand sidebar");
      } else {
        const open = document.body.classList.contains("nav-open");
        navToggle.setAttribute("aria-expanded", String(open));
        navToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
      }
    };
    syncToggle();
    desktop.addEventListener && desktop.addEventListener("change", syncToggle);
    navToggle.addEventListener("click", () => {
      if (desktop.matches) {
        const collapsed = document.documentElement.classList.toggle("rail-collapsed");
        store.set("ss-rail-collapsed", collapsed ? "1" : "0");
      } else {
        document.body.classList.contains("nav-open") ? closeNav() : openNav();
      }
      syncToggle();
    });
    scrim && scrim.addEventListener("click", closeNav);
    window.addEventListener("keydown", (e) => { if (e.key === "Escape") closeNav(); });
  }

  /* ---------- sidebar: open the group holding the current page ---------- */
  const current = $('.sidebar a[aria-current="page"]');
  if (current) {
    let el = current.parentElement;
    while (el && !el.classList.contains("sidebar")) {
      if (el.tagName === "DETAILS") el.open = true;
      el = el.parentElement;
    }
    current.scrollIntoView({ block: "nearest" });
  }

  /* ---------- sidebar: collapse and expand a group ----------
     The build ships every group correct for the page you asked for, so this
     only handles what someone does afterwards. Choices are remembered per
     group; the group holding the current page is never remembered as closed,
     because reopening a page and finding its own section shut is worse than
     forgetting a preference. */
  {
    const KEY = "ss-nav-closed";
    const read = () => { try { return new Set(JSON.parse(store.get(KEY) || "[]")); } catch { return new Set(); } };
    const closed = read();

    $$(".sidebar [data-group]").forEach((g) => {
      const btn = $(".sidebar-caret", g);
      const title = $(".sidebar-title", g);
      if (!btn || !title) return;
      const name = title.textContent.trim();
      const holdsCurrent = !!$('[aria-current="page"]', g);

      if (!holdsCurrent && closed.has(name)) {
        g.classList.add("is-collapsed");
        btn.setAttribute("aria-expanded", "false");
      }

      const sync = () => {
        const open = !g.classList.contains("is-collapsed");
        btn.setAttribute("aria-expanded", String(open));
        btn.setAttribute("aria-label", `${open ? "Collapse" : "Expand"} ${name}`);
      };
      sync();

      btn.addEventListener("click", () => {
        const nowClosed = g.classList.toggle("is-collapsed");
        nowClosed ? closed.add(name) : closed.delete(name);
        store.set(KEY, JSON.stringify([...closed]));
        sync();
      });
    });
  }

  /* ---------- back to top ---------- */
  const toTop = $("#to-top");
  if (toTop) {
    const onScroll = () => toTop.classList.toggle("show", window.scrollY > 700);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: scrollBehavior }));
  }

  /* ---------- toc scroll-spy ---------- */
  const tocLinks = $$(".toc a");
  if (tocLinks.length) {
    const map = new Map();
    tocLinks.forEach((a) => {
      const id = decodeURIComponent(a.getAttribute("href").slice(1));
      const target = document.getElementById(id);
      if (target) map.set(target, a);
    });
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          tocLinks.forEach((a) => a.classList.remove("active"));
          const link = map.get(en.target);
          link && link.classList.add("active");
        }
      });
    }, { rootMargin: "-70px 0px -70% 0px" });
    map.forEach((_, target) => spy.observe(target));
  }

  /* ---------- copy to clipboard ----------
     Every <pre data-copy> gets a real button, so it is reachable by keyboard
     and announced. The result is spoken through one shared live region rather
     than the button itself, which a screen reader is already reading. */
  const copyBlocks = $$("pre[data-copy]");
  if (copyBlocks.length) {
    const live = document.createElement("span");
    live.className = "sr-only";
    live.setAttribute("aria-live", "polite");
    document.body.appendChild(live);

    const writeText = async (text) => {
      if (navigator.clipboard && window.isSecureContext) {
        try { await navigator.clipboard.writeText(text); return true; } catch {}
      }
      // fallback for pages served over http or older browsers
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.top = "-1000px";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try { ok = document.execCommand("copy"); } catch {}
      ta.remove();
      return ok;
    };

    copyBlocks.forEach((pre) => {
      const text = pre.textContent;               // read before the button goes in
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "copy-btn";
      btn.textContent = "Copy";
      btn.setAttribute("aria-label", pre.dataset.copy ? `Copy ${pre.dataset.copy}` : "Copy to clipboard");
      /* prefer the non-scrolling wrapper; fall back to the pre itself */
      const host = pre.parentElement && pre.parentElement.classList.contains("codeblock") ? pre.parentElement : pre;
      host.appendChild(btn);

      let timer = null;
      btn.addEventListener("click", async () => {
        const ok = await writeText(text);
        clearTimeout(timer);
        btn.textContent = ok ? "Copied" : "Copy failed";
        btn.classList.toggle("is-done", ok);
        btn.classList.toggle("is-failed", !ok);
        live.textContent = ok ? "Copied to clipboard" : "Copy failed — select the text and copy it by hand";
        timer = setTimeout(() => {
          btn.textContent = "Copy";
          btn.classList.remove("is-done", "is-failed");
          live.textContent = "";
        }, 1500);
      });
    });
  }

  /* ---------- search modal ---------- */
  const modal = $("#search-modal");
  if (modal) {
    const input = $("#search-input");
    const results = $("#search-results");
    const status = $("#search-status");
    let sel = -1;
    let lastTrigger = null;

    input.setAttribute("role", "combobox");
    input.setAttribute("aria-controls", "search-results");
    input.setAttribute("aria-expanded", "true");
    input.setAttribute("aria-autocomplete", "list");
    results.setAttribute("role", "listbox");

    const open = () => {
      lastTrigger = document.activeElement;
      modal.classList.add("open");
      document.body.style.overflow = "hidden";
      input.value = ""; render(""); input.focus();
    };
    const close = () => {
      modal.classList.remove("open"); sel = -1;
      document.body.style.overflow = "";
      if (lastTrigger && lastTrigger.focus) lastTrigger.focus();
    };

    // keep Tab inside the dialog while it is open
    modal.addEventListener("keydown", (e) => {
      if (e.key !== "Tab") return;
      const focusables = [input, ...$$(".hit", results)];
      const first = focusables[0], last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    $$("[data-search-open]").forEach((b) => b.addEventListener("click", open));
    $(".backdrop", modal).addEventListener("click", close);
    window.addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); modal.classList.contains("open") ? close() : open(); }
      else if (e.key === "/" && !modal.classList.contains("open") && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) { e.preventDefault(); open(); }
      else if (e.key === "Escape" && modal.classList.contains("open")) close();
    });

    const score = (item, q) => {
      const hay = `${item.t} ${item.s || ""} ${item.d || ""} ${item.g || ""}`.toLowerCase();
      if (!hay.includes(q)) return -1;
      let sc = 0;
      const tl = item.t.toLowerCase(), sn = (item.s || "").toLowerCase();
      if (sn === q || tl === q) sc += 100;
      if (sn.startsWith(q)) sc += 60;
      if (tl.startsWith(q)) sc += 40;
      if (tl.includes(q)) sc += 20;
      if (item.k === "page") sc += 8;
      if (item.k === "prompt" || item.k === "section") sc += 6;
      return sc;
    };

    const mark = (text, q) => {
      if (!q) return esc(text);
      const i = text.toLowerCase().indexOf(q);
      if (i < 0) return esc(text);
      return `${esc(text.slice(0, i))}<mark>${esc(text.slice(i, i + q.length))}</mark>${esc(text.slice(i + q.length))}`;
    };

    const render = (qRaw) => {
      const q = qRaw.trim().toLowerCase();
      const index = window.SEARCH_INDEX || [];
      let hits;
      if (!q) {
        hits = index.filter((x) => x.k === "page").slice(0, 8);
      } else {
        hits = index.map((x) => [score(x, q), x]).filter(([s]) => s >= 0)
          .sort((a, b) => b[0] - a[0]).slice(0, 12).map(([, x]) => x);
      }
      sel = -1;
      input.removeAttribute("aria-activedescendant");
      if (status) status.textContent = q ? `${hits.length} result${hits.length === 1 ? "" : "s"}` : "";
      if (!hits.length) {
        results.innerHTML = `<div class="none">No matches for &ldquo;${esc(qRaw)}&rdquo;. Try a prompt name, a stack section, or a worksheet.</div>`;
        return;
      }
      results.innerHTML = hits.map((h, i) => `
        <a class="hit" role="option" id="hit-${i}" href="${ROOT}${esc(h.u)}">
          <div class="h-name">${mark(h.t, q)}${h.s ? ` <span class="muted">&middot; ${mark(h.s, q)}</span>` : ""}${h.k && KIND_LABEL[h.k] && h.k !== "page" ? ` <span class="h-kind">${esc(KIND_LABEL[h.k])}</span>` : ""}</div>
          ${h.d ? `<div class="h-sub">${mark(h.d, q)}</div>` : ""}
        </a>`).join("");
    };

    input.addEventListener("input", () => render(input.value));
    input.addEventListener("keydown", (e) => {
      const hits = $$(".hit", results);
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        sel = e.key === "ArrowDown" ? Math.min(sel + 1, hits.length - 1) : Math.max(sel - 1, 0);
        hits.forEach((h, i) => h.classList.toggle("sel", i === sel));
        if (hits[sel]) {
          hits[sel].scrollIntoView({ block: "nearest" });
          input.setAttribute("aria-activedescendant", hits[sel].id);
        }
      } else if (e.key === "Enter" && sel >= 0 && hits[sel]) {
        window.location.href = hits[sel].href;
      }
    });
  }

  /* ---------- filter grid ----------
     Filters a grid of cards already in the HTML — no data island, no
     rendering. A card declares what it is in data attributes; a chip
     declares which group it belongs to and which value it selects:

       <button class="chip" data-filter-group="stage" data-filter-value="build">
       <article class="prompt-card" data-stage="build gtm" data-search="...">

     A chip with no data-filter-value is the "all" chip for its group.
     Values are space-separated, so a card can sit in several at once.
     Text typed in the input is matched against data-search when present,
     and against the card's own text when it is not. */
  const mountFilterGrid = (opts) => {
    const grid = $(opts.grid);
    if (!grid) return;
    const cards = $$(opts.cards);
    if (!cards.length) return;

    const input = $(opts.input);
    const chips = $$(opts.chips, grid.closest(opts.scope || "body") || document);
    const countEl = $(opts.count);
    const emptyEl = $(opts.empty);
    const one = opts.one || "item";
    const many = opts.many || "items";

    const groups = {};
    chips.forEach((c) => { groups[c.dataset.filterGroup] = ""; });
    let q = "";

    // data-filter-group="time-cost" reads data-time-cost off the card
    const camel = (s) => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    const cache = new Map();
    const haystack = (card) => {
      if (!cache.has(card)) cache.set(card, (card.dataset.search || card.textContent || "").toLowerCase());
      return cache.get(card);
    };
    const inGroup = (card, group, value) => {
      if (!value) return true;
      return (card.dataset[camel(group)] || "").split(/\s+/).includes(value);
    };

    const apply = () => {
      let shown = 0;
      cards.forEach((card) => {
        const hit = Object.keys(groups).every((g) => inGroup(card, g, groups[g])) && (!q || haystack(card).includes(q));
        card.hidden = !hit;
        if (hit) shown++;
      });
      chips.forEach((c) => {
        const on = (c.dataset.filterValue || "") === groups[c.dataset.filterGroup];
        c.setAttribute("aria-pressed", String(on));
      });
      if (countEl) countEl.innerHTML = `Showing <b>${shown}</b> of ${cards.length} ${cards.length === 1 ? one : many}`;
      if (emptyEl) emptyEl.hidden = shown > 0;
    };

    const reset = () => {
      Object.keys(groups).forEach((g) => { groups[g] = ""; });
      q = "";
      if (input) input.value = "";
      apply();
    };

    input && input.addEventListener("input", () => { q = input.value.trim().toLowerCase(); apply(); });
    chips.forEach((c) => c.addEventListener("click", () => {
      const g = c.dataset.filterGroup;
      const v = c.dataset.filterValue || "";
      groups[g] = groups[g] === v ? "" : v;   // clicking the live chip clears its group
      apply();
    }));
    $$("[data-filter-reset]").forEach((b) => b.addEventListener("click", reset));

    // deep link, e.g. library.html?q=recap&stage=build
    const params = new URLSearchParams(location.search);
    Object.keys(groups).forEach((g) => {
      const v = params.get(g);
      if (v && chips.some((c) => c.dataset.filterGroup === g && c.dataset.filterValue === v)) groups[g] = v;
    });
    if (params.get("q")) { q = params.get("q").trim().toLowerCase(); if (input) input.value = params.get("q"); }

    apply();
  };

  /* ----------------------------------------------------------
     lightbox — an infographic opens over the page rather than
     navigating away from the prose that explains it.

     The markup is a plain <a href="the-image">, so with no
     JavaScript the click still works and simply opens the file.
     Everything below is an upgrade on that, never a prerequisite.
     ---------------------------------------------------------- */
  (() => {
    const zooms = $$("a.figure-zoom");
    if (!zooms.length) return;

    let box, img, cap, opener;

    const build = () => {
      box = document.createElement("div");
      box.className = "lightbox";
      box.setAttribute("role", "dialog");
      box.setAttribute("aria-modal", "true");
      box.innerHTML =
        '<div class="backdrop"></div>' +
        '<div class="lightbox-inner">' +
        '<button class="lightbox-close icon-btn" type="button" aria-label="Close">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>' +
        "</button>" +
        '<img alt=""><p class="lightbox-cap"></p></div>';
      document.body.appendChild(box);
      img = $("img", box);
      cap = $(".lightbox-cap", box);
      $(".backdrop", box).addEventListener("click", close);
      $(".lightbox-close", box).addEventListener("click", close);
    };

    function close() {
      if (!box) return;
      box.classList.remove("open");
      document.body.style.overflow = "";
      /* send focus back where it came from, or a keyboard user is
         dropped at the top of the document with no idea why */
      if (opener) opener.focus();
      opener = null;
    }

    function open(a) {
      if (!box) build();
      opener = a;
      img.src = a.getAttribute("href");
      const figcap = a.parentElement && $(".figure-cap", a.parentElement);
      const alt = $("img", a);
      img.alt = alt ? alt.alt : "";
      cap.textContent = figcap ? figcap.textContent.trim() : (alt ? alt.alt : "");
      cap.hidden = !cap.textContent;
      box.classList.add("open");
      document.body.style.overflow = "hidden";
      $(".lightbox-close", box).focus();
    }

    zooms.forEach((a) => {
      a.addEventListener("click", (e) => {
        /* leave the modifier clicks alone — someone asking for a new
           tab has asked for a new tab */
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        open(a);
      });
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && box && box.classList.contains("open")) close();
    });
  })();

  /* the prompt library is the one grid using it today */
  mountFilterGrid({
    grid: "#lib-grid",
    cards: "#lib-grid > .prompt-card",
    input: "#lib-q",
    chips: "[data-filter-group]",
    count: "#lib-count",
    empty: "#lib-empty",
    one: "prompt",
    many: "prompts",
  });
})();
