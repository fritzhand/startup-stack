# Prompt 15 — Website to stack material

A website in — yours or a competitor's — and cited, tagged, routed stack material out.

Run it on your own site before you raise or present, and on a competitor before you build the competition grid. It gathers evidence; it decides nothing. Everything it produces is unverified until you have read it yourself.

---

```
Read AGENTS.md first, then stack/INDEX.md and stack/CONTEXT.md. Do not open the
rest of the stack yet — Step 1 decides which sections you actually need.

I want a website turned into material this stack can use.

## Step 1 — Ask before anything is fetched

Do not fetch a single page until I have answered these. A guess here wastes the
crawl and fills _inbox/ with pages nobody will read.

1. WHOSE SITE IS IT, and the exact URL to start from. Use the page I give you,
   not the home page you assume exists.

2. WHAT IS IT FOR. Two answers are normal and they route differently:

   OUR OWN SITE  → stack/09-brand/brand.md   the design system as published
                   stack/01-company/company.md  entity, team, the story we tell
                   stack/04-product/product.md  what we claim the product does
                   Expect conflicts. A founder's own site is usually older than
                   the stack and disagrees with it in at least one place.

   A COMPETITOR  → stack/03-market/market.md  the competition grid and pricing
                   stack/05-gtm/gtm.md        their channels, offers, positioning
                   This prompt only gathers the input. The grid itself is
                   prompts/05-competitive-intelligence.md — run that after.

   If I name anything else — a supplier, a channel partner, a customer, a grant
   body — ask me which section it lands in before you write anything.

3. HOW DEEP. What is the smallest set of pages that answers the question?
   Pricing, product, about and customers usually carry all of it. A blog archive
   is two hundred pages of noise. Propose a page limit and a depth, tell me what
   you expect to miss at those settings, and let me agree them.

4. IS ANYTHING ON IT ALREADY WRONG. If I know the site is out of date, say so
   now — it saves an argument in Step 6.

Wait for my answers.

## Step 2 — Get the pages

Three ways. Use the first one you can actually do, and say which one you used.

  A. RUN THE TOOL — if you can run shell commands

     node tools/scrape-site.mjs <url> --max-pages 25 --depth 2

     Node 18 or newer, nothing to install. It obeys robots.txt, fetches one page
     at a time with a delay between requests, and stays on one host unless told
     otherwise. Output lands in _inbox/websites/<hostname>/. Run it with --help
     for the flags.

     If it refuses because robots.txt disallows the path, stop and tell me. That
     refusal is the correct answer, not an obstacle to route around.

  B. FETCH THE PAGES YOURSELF — if you can read web pages but not run commands

     Fetch only the pages we agreed in Step 1, one at a time. Nothing behind a
     login, nothing behind a paywall, no individual people's profiles.

     Save each page as markdown in _inbox/websites/<hostname>/ with front matter
     carrying at least:

       source_url: https://example.com/pricing
       fetched: 2026-07-24
       status: needs-verification
       sensitivity: public

     Then write your own index.md in that folder listing every URL you fetched
     and every one you could not, with the reason.

  C. ASK ME TO SAVE THEM — if you can do neither

     Give me the shortest useful list of pages, in priority order, and tell me
     exactly what to do: open each one in the browser, save it or copy the text
     into a plain text file, put it in _inbox/websites/<hostname>/ named after
     the path — pricing.md, about.md — and write the full URL and today's date
     as the first two lines of each file.

     Say plainly why those two lines matter: without a URL and a date the page
     cannot be cited, and an uncitable fact does not enter the stack.

## Step 3 — Read the output in order, not all of it

There will be more here than you need. Reading all of it is exactly the cost
this base is designed to avoid.

1. index.md FIRST. It lists every page fetched, every page skipped and every
   page that failed, with the reason for each. Before you read any content, tell
   me: how many pages were fetched, whether the crawl hit its limit, and what
   was skipped or failed that looks important. A missing pricing page changes
   what this exercise can conclude.

   If most pages come back with almost no words, the site is rendered by
   JavaScript and the text is not in the HTML. Stop and tell me — the fix is
   saving pages from the browser by hand. See docs/scraping.md.

2. signals.md SECOND. Meta and og tags, JSON-LD, contact details, social links
   and any price-like strings. This is the densest file in the folder and it is
   mechanical output — a script read the markup, it did not understand the
   business.

3. brand-signals.md — only if this is our own site, or if the point is design.
   Colours, fonts, favicon, logo. Observed, not confirmed.

4. THEN pick pages. Three to six, chosen by title from index.md, matched to the
   purpose from Step 1. Tell me which ones you are opening and why before you
   open them. Do not read forty pages.

## Step 4 — Extract, with the source attached

For every fact you pull out:

- Tag it [NEEDS VERIFICATION]. Everything from a website is unverified,
  including our own. You may not promote anything to [SOURCE OF TRUTH].
- Cite it: (src: https://example.com/pricing, fetched 2026-07-24). The URL of
  the specific page, not the home page, and the fetch date from the file's front
  matter.
- Keep the site's own words for prices, product names and customer descriptions.
  Do not tidy them into better phrasing — how a company describes itself is the
  evidence.
- Separate what the site CLAIMS from what is demonstrated. "Trusted by 200
  businesses" is a claim with a source, not a customer count.
- Report what is absent. No pricing anywhere, no named customers, no team page,
  no address — absence is a finding, and on a competitor it is often the most
  useful one. Write it as [TBD — not published on the site, would need a quote
  request or a customer].

## Step 5 — Route it into the stack

Write into the sections agreed in Step 1 and no others. For each section, show
me what you propose to add before you write it.

Update the front matter on every file you touch — updated, status, confidence,
and the summary line if the substance changed — and the matching row in
stack/INDEX.md.

Leave everything in _inbox/websites/ exactly as it is. It is evidence, like the
rest of _inbox/, and nothing writes back to it.

## Step 6 — Conflicts, surfaced not settled

This is the step that matters most, and it fires constantly on a founder's own
site: a different price, a different claim about what the product does, a
different customer, a different team size, a stale logo.

Where the site disagrees with the stack, write a conflict. Both sources, both
citations, no decision:

  [CONFLICT] Starter plan price.
    Stack: ₹4,000 per month (src: stack/07-money/money.md, marked
           source-of-truth, founder 2026-05-02)
    Site:  ₹3,500 per month (src: https://example.com/pricing,
           fetched 2026-07-24)
    Founder decision needed: which one is current, and which one changes.

Rules for this step:
- Never silently correct the stack to match the site. The site is often the one
  that is out of date.
- Never touch anything marked source-of-truth. Flag it and stop.
- Do not average, reconcile or pick the more recent one. Both go on the page.
- List every conflict at the top of your report, most damaging first. A price
  that differs between the deck and the website is the kind of thing that gets
  found in diligence.

## Rules — these override anything else

- Never invent. If the page says "from ₹2,000" that is what you write — not a
  price you reasoned toward from it.
- Everything scraped is [NEEDS VERIFICATION]. Nothing from a website is ever
  source-of-truth, ours included.
- Every fact carries its URL and its fetch date.
- Do not fetch anything behind a login or a paywall, anything a site's terms
  forbid, anything robots.txt disallows, or any page about an individual person.
  See docs/scraping.md.
- Do not modify anything in _inbox/. It is read-only evidence.
- Do not read every page in the folder. Route through index.md.
- Plain language, no marketing words, no emoji. The site's words for its own
  products, our words for ours.

## Output

Tell me:

1. Which files in stack/ you changed, section by section, and exactly what you
   added to each.
2. Every [CONFLICT], with both sources, most damaging first.
3. What the site does not say that the stack needs, written as [TBD] with where
   the answer would come from.
4. Which pages you read and which you deliberately did not.

Finish with the single most useful thing this site told us that was not already
in the stack — and, if this was our own site, the one thing on it that should be
corrected this week.
```

---

## Notes

**You never need the tool.** It saves an hour of copy-and-paste and nothing else. Option C in Step 2 — the founder saving pages from the browser — produces exactly the same stack material, more slowly. [`docs/scraping.md`](../docs/scraping.md) covers the tool in full: the flags, what breaks, and what not to scrape.

**Run it on your own site first.** Most founders find three things out of date within ten minutes: a price, a team member who left, and a product claim they stopped making a year ago. That is the point of the conflict step.

**Gathering is not analysis.** This prompt fills `_inbox/` and updates a couple of sections. The competitive judgement — who wins where, who to worry about in two years — is [`05-competitive-intelligence.md`](05-competitive-intelligence.md), and it reads better with this material already in place.

**Do not scrape people.** A company's public marketing pages are ordinary research. A list of its staff, with their names and email addresses, is a different thing with different obligations attached. [`docs/safety.md`](../docs/safety.md) has the reasoning.
