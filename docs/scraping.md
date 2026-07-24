# Scraping a website into the inbox

`tools/scrape-site.mjs` fetches a website and writes it into `_inbox/` as clean markdown, one file per page, each carrying the URL it came from and the date it was fetched. It exists for the two sites worth the trouble: your own, and a competitor's.

**You never need it.** Everything it produces, you could produce by opening the pages in a browser and pasting the text into files by hand — which is what you should do when the tool cannot help. It saves an hour of copy-and-paste. That is the whole claim.

---

## What you get

One command produces four kinds of file in one folder.

| File | What is in it | What it is good for |
| --- | --- | --- |
| `<page>.md` | One file per page: the readable text, with front matter carrying `source_url`, `fetched`, `word_count` and `status: needs-verification` | The actual copy — how a company describes its product, its customers and its price, in its own words |
| `index.md` | Every URL fetched, skipped or failed, with the reason for each, plus the settings the crawl ran with | **Read this first.** It tells you what you have and, more usefully, what you do not |
| `signals.md` | Meta and og tags, JSON-LD, e-mail addresses, phone numbers, social links, price-like strings | The densest file in the folder. Structured data is where a company states plainly what its marketing copy talks around |
| `brand-signals.md` | CSS colour variables, font families, favicon, logo, share images | Filling `stack/09-brand/brand.md` from your own site instead of inventing a palette |

Everything in all four is `[NEEDS VERIFICATION]`. A script read the markup; it did not understand the business.

## How to run it

Node 18 or newer. Nothing to install, no account, no key.

```bash
node tools/scrape-site.mjs https://example.com
```

That fetches up to 40 pages, three links deep, one at a time, and writes them to `_inbox/websites/example.com/`. For a competitor you usually want less:

```bash
node tools/scrape-site.mjs https://example.com --max-pages 25 --depth 2 --delay 1000
```

The flags worth knowing:

| Flag | Default | When you would change it |
| --- | --- | --- |
| `--max-pages` | 40 | Lower it. Twenty pages of a competitor answers most questions; forty is already generous |
| `--depth` | 3 | `--depth 1` fetches the start page and what it links to directly — usually the whole marketing site |
| `--delay` | 700 ms | Raise it for a small site on cheap hosting. A `Crawl-delay` in their `robots.txt` wins if it is longer |
| `--same-path-only` | off | You want only `/products` or only `/pricing`, not the blog |

`node tools/scrape-site.mjs --help` lists the rest.

## Where the output goes

`_inbox/websites/<hostname>/` — one folder per site, so two different sites never mix.

A second run on the *same* site overwrites the files it fetches this time and leaves the rest where they are, so a page that has since been deleted stays in the folder from the earlier crawl. The tool says so when it finds files already there. If you want a clean picture, delete the folder before you re-run it.

`_inbox/` is git-ignored, deliberately. It fills up with customer names, prices, contracts and things people told you in confidence, and none of that belongs in a repository you might later share, fork or publish. The scraped pages sit there as evidence: `stack/` cites them, they never get committed, and nothing writes back to them. See [`_inbox/README.md`](../_inbox/README.md).

## Reading the output without drowning

Forty pages of a website is more than you or an AI should read, and reading all of it is the exact cost the index in this repo exists to avoid.

1. **`index.md` first.** How many pages came back. Whether the crawl hit its limit. What was skipped and why. If there is no pricing page in the list, you know something before you have read a word of copy.
2. **`signals.md` second.** Ten minutes here is worth an hour of reading marketing pages.
3. **Two or three pages, chosen deliberately.** Pricing, the product page, the about page. Pick them by title from `index.md`. Leave the rest alone.

[`prompts/15-scrape-a-site.md`](../prompts/15-scrape-a-site.md) makes an AI work in that order rather than opening everything.

## What not to scrape

This section is the one that matters. The tool is polite by design, but politeness in software does not decide what you should point it at.

**Anything behind a login.** Customer portals, member areas, a competitor's app, your own admin panel. The tool has no way to log in and you should not give it one — no session cookies, no credentials in a flag. If a page needs an account, it is not public.

**Anything behind a paywall.** A subscription bought you reading access, not a copy.

**Anything a site's terms of service forbid.** Many sites prohibit automated access in plain words on their terms page. Read it before you run the command on a site that matters. Deciding to proceed anyway is a decision, not a technicality.

**Personal data and individual profiles.** Staff pages, member lists, profile pages, comment threads, anything that is a person rather than a company. Researching an organisation and compiling a list of its people are different activities, and the second carries real legal duties in most jurisdictions — see [`safety.md`](safety.md). If what you want is a hundred named contacts, that is [`prompts/08-list-of-100.md`](../prompts/08-list-of-100.md) and it is built by hand for a reason.

**Pages the site's `robots.txt` disallows.** The tool reads `robots.txt`, obeys it, and refuses to fetch what it forbids. **That refusal is not a bug to work around.** There is no flag to disable it, and if you find yourself editing the tool to ignore it, stop — you have left research and gone somewhere else.

**Anything you would be uncomfortable explaining to the site's owner.** This is the test that catches whatever the rules above miss. Say it out loud: *"I fetched your twenty public product pages to compare them with mine."* Fine. *"I pulled every profile in your member area overnight."* Not fine, and you knew before you finished the sentence.

Public marketing pages of a company you are researching are ordinary competitive research; every advisor and every analyst does it. Harvesting people is not the same thing and never becomes the same thing because the tool made it easy.

## Rate and volume

The tool fetches one page at a time and waits between requests. That is not a performance limitation — it is the point. A small company's site runs on hosting that a fast crawler can visibly slow down for its real visitors, and the cost of your research should not land on them.

Volume is where research turns into something else. Forty pages of a competitor's site, read once, is what a competent analyst does before writing a competition grid. Four thousand pages, on a schedule, every week, is bulk data extraction — a different activity with a different name, a different legal exposure, and a bandwidth bill somebody else pays. The defaults here sit firmly on the research side and there is no reason to move them.

If you need a whole site rather than its marketing pages, ask the owner. People say yes more often than founders expect.

## Provenance

Every file the tool writes carries the URL it came from and the date it was fetched. That is not decoration — it is what makes a scraped fact usable at all.

[`AGENTS.md`](../AGENTS.md) requires every fact in the stack to cite its origin. A fact from a website cites both parts:

```
(src: https://example.com/pricing, fetched 2026-07-24)
```

The date matters as much as the URL, because the page will change and the claim you recorded will stop being on it.

And a scraped fact is `[NEEDS VERIFICATION]`, always. Never `[SOURCE OF TRUTH]`. **A website is a company's published claim about itself — including your own.** A price on a page is not what the company collects after discounts. "Trusted by 200 businesses" is a sentence someone wrote, not a customer count. When a scraped fact contradicts something already in the stack, that is a `[CONFLICT]` to put in front of the founder with both sources, not a discrepancy to quietly resolve — and on your own site, out of date more often than not, it will happen the first time you run this.

## What breaks

**Sites rendered entirely by JavaScript come back nearly empty.** The tool reads the HTML the server sends; if the text is assembled in the browser afterwards, there is nothing in that HTML to read. You will see it immediately in `index.md` — pages with word counts in single figures. The fix is manual and takes two minutes: open the page in a browser, save it or copy the text into a file, and drop it into `_inbox/websites/<hostname>/` with the URL and the date at the top.

**Sites behind a bot check refuse.** A challenge page or a `403` from a protection service will appear in the failed table in `index.md`. Treat it as the site saying no, and save the pages you need by hand.

**PDFs are skipped.** So are images, spreadsheets and every other non-page file — they are listed in `index.md` as assets and left alone. A PDF that matters belongs in `_inbox/` directly: download it and drop it in, where the bootstrap prompt reads it like any other source.

**A crawl that hits its limit says so.** `index.md` states plainly when `--max-pages` or `--depth` stopped it, and lists every URL it did not reach. There is more site than the folder shows; decide whether you care.

## Where it fits

The tool gathers. It does not think, and it writes nothing into `stack/`.

- [`prompts/15-scrape-a-site.md`](../prompts/15-scrape-a-site.md) — the prompt that runs it, reads the output in the right order, and routes the findings into the right sections with citations and conflicts intact.
- [`prompts/00-bootstrap-the-stack.md`](../prompts/00-bootstrap-the-stack.md) — if you scrape before your first bootstrap, the pages are simply more material in `_inbox/`, and the bootstrap reads them along with everything else.
