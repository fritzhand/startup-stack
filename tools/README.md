# tools/

Optional scripts. The method does not need them, and nothing else in this repo imports them.

| Script | What it does |
| --- | --- |
| [`scrape-site.mjs`](scrape-site.mjs) | Fetches a website and writes it into `_inbox/` as clean markdown, one file per page, each carrying the URL it came from and the date it was fetched. |

## You never need this

Everything the scraper produces, you could produce by opening the pages in a browser and pasting the text into files by hand. That is the fallback whenever it does not work, and it is what you should do for a site rendered entirely in the browser or sitting behind a bot check.

It saves an hour of copy-and-paste. That is the whole claim, and the rest of the repo works exactly the same without it.

## Running it

Node 18 or newer. Nothing to install, no account, no key.

```bash
node tools/scrape-site.mjs https://example.com
```

Up to 40 pages, three links deep, one request at a time, into `_inbox/websites/example.com/`. For a competitor, less is usually better:

```bash
node tools/scrape-site.mjs https://example.com --max-pages 25 --depth 2 --delay 1000
```

`node tools/scrape-site.mjs --help` lists every flag.

You get one markdown file per page, plus three summary files: `index.md` (everything fetched, skipped or failed, with reasons — read this first), `signals.md` (meta tags, structured data, contact details, published prices) and `brand-signals.md` (colours, fonts, logo).

## Before you point it at anything

It obeys `robots.txt` — including `Crawl-delay`, which wins whenever it is longer than yours — crawls one page at a time with a pause between requests, and stays on the site you point it at. You can lengthen the delay; you cannot remove it. The refusal to fetch a disallowed path is not a bug to work around.

What it will not do is decide what you *should* fetch. Nothing behind a login or a paywall, nothing a site's terms forbid, and nothing that is a person rather than a company.

**[`docs/scraping.md`](../docs/scraping.md) is the full explanation** — the flags worth changing, how to read the output without drowning in it, what breaks, and the rules about what not to scrape. Read it before the first run.

## What comes out is not fact

Every file the tool writes is `[NEEDS VERIFICATION]`, and a scraped fact is never promoted to `[SOURCE OF TRUTH]`. A website is a company's published claim about itself — including your own, which is probably out of date in at least one place.

[`prompts/15-scrape-a-site.md`](../prompts/15-scrape-a-site.md) is the prompt that reads the output in the right order and routes it into the stack with its citations and conflicts intact.

## If you forked this repo as your own stack

Keep `tools/` if you want the scraper. Delete `web/` and `.github/` — those build and publish this project's own site and have nothing to do with your company.
