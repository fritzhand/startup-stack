# Building the knowledge base

How raw files become a structured base an AI can read cheaply. Seven parts. None of them require code.

---

## The shape of it

```
my-company-stack/
├── AGENTS.md              PART 7 · memory — how the AI should work here
├── _inbox/                PART 2 · your data — raw, unsorted, git-ignored
└── stack/
    ├── INDEX.md           PART 5 · the router
    ├── CONTEXT.md         the one-pager everything reads first
    ├── 01-company/        PART 3 · taxonomy ─┐
    ├── 02-customer/                          │  PART 4 · one summary
    ├── 03-market/                            │  .md per folder,
    ├── 04-product/                           │  with front matter
    ├── 05-gtm/                               │
    ├── 06-operations/                        │
    ├── 07-money/                             │
    ├── 08-capital/                           │
    ├── 09-brand/          PART 6 · design system
    └── 10-pulse/          the heartbeat
```

---

## Part 1 — The tools

Two things.

**A paid subscription to a capable model.** Free tiers cannot do this work. They run out, they truncate, and they cannot see your files.

**An application that works on top of your file system,** not just a chat window. You point it at a folder and it can read and organise what is inside. The Claude desktop app or ChatGPT's Codex app are the least technical entry points. Claude Code, Gemini CLI, Cursor and Windsurf are faster and cheaper if you are comfortable in a terminal or an editor.

They all do the same essential thing. Pick whichever you will actually open.

## Part 2 — Your data

You almost certainly have this already. It is scattered, out of date and inconsistent, and that is fine — imperfect existing folders are the head start, not the obstacle.

What to gather into `_inbox/`:

| Source | Why it matters |
| --- | --- |
| **Call and meeting transcripts** | The highest-value input by a distance. What people actually said, not what the deck claims. Record every customer call, every supplier call, every mentor session. |
| Pitch decks — current and dead | The dead ones show what you stopped believing, which is often the most useful signal in the folder |
| Business plan, financial model | Real numbers, even wrong ones, beat no numbers |
| Market and deep research reports | The PDFs you commissioned and never re-read |
| Competitive intelligence | Screenshots, price lists, competitor sites, the WhatsApp tip-off about a new entrant |
| Customer conversations | Email threads, WhatsApp exports, support tickets, interview notes |
| Supplier quotes, invoices, POs, rate cards | The only honest source of what things actually cost |
| Website export or URL | Your public claims, which need to match your private ones |
| Registration and legal docs | Incorporation, GST, trademark filings, shareholding, signed agreements |
| Brand and design references | Logo files, colour codes, fonts, screenshots of pages you like |

**Rescue the pictures.** Charts and diagrams inside PowerPoints and PDFs are invisible to text extraction — the AI reads the caption and misses the numbers in the graph. If a chart matters, export it as an image and drop the image in alongside. Then ask the AI to read the *picture*. This one habit is the difference between a stack that knows your growth curve and one that knows you have a growth slide.

**Prefer plain text where it is free.** `.md` and `.txt` are lighter and cheaper for the AI than `.docx` and `.pdf`, so answers come faster and cost less. Do not spend an hour converting — Word files are fine as they are — but keep text as text.

## Part 3 — A folder taxonomy

The AI reads a sample of everything in `_inbox/` and proposes a numbered folder structure. Everything has a place; every file is named for what it is; the numbers keep it ordered.

One limit on that proposal, which matters more than it looks. **Let it shape what goes inside a section; do not let it rename or renumber the sections themselves.** The ten are the part that has to look the same across every company for anything to be comparable — your own stack against itself six months from now, or ten companies against each other if you are running a programme. A section named for your business is a section nobody else can route through, including you, later.

`startup-stack` ships with ten sections that fit almost every early company:

| # | Section | Holds |
| --- | --- | --- |
| 01 | company | Entity, founders, team, cap table, legal, compliance, the origin story |
| 02 | customer | Who they are, the job to be done, interviews, ICP, the alternatives they use today |
| 03 | market | TAM/SAM/SOM, the beachhead, competitors, the industry map, who the influencers are |
| 04 | product | What exists, what is next, the PRD, the tech stack, the roadmap |
| 05 | gtm | Channels, pipeline, marketing engine, sales collateral, the list of 100 |
| 06 | operations | Process map, SOPs, suppliers, quality control, capacity, people |
| 07 | money | Unit economics, costing at scale, projections, runway, the tooling that tracks it |
| 08 | capital | Funding roadmap, dilution map, grants, pitch deck, investor CRM, data room |
| 09 | brand | Name, trademark, positioning, the design system |
| 10 | pulse | Metrics that matter, the weekly recap, the archive of past recaps |

Adjust the names if your business needs different ones. A deep-tech company might split `04-product` into research and engineering; a services business might not need `06-operations` in that form. The numbers matter more than the names — they force an order and stop the folder becoming a pile.

## Part 4 — One summary file per folder

Inside each folder sits a single markdown file that summarises that section in clean, factual language. **This is what the AI reads.** Supporting material lives beside it; the summary file is the interface.

At the top of every file goes **front matter** — a small block of tags that says what the file is, who owns it, when it was last touched, whether it is confirmed, and what it depends on. The full schema is in [front-matter.md](front-matter.md).

```markdown
---
doc: money
section: 07-money
title: Money — Unit Economics, Costing, Runway
owner: Priya
updated: 2026-07-24
status: needs-verification
confidence: low
sensitivity: internal
reads: [04-product, 05-gtm, 06-operations]
feeds: [08-capital, 10-pulse]
summary: Unit economics per SKU, costing at 1k/5k/10k volume, 18-month
  projections and current runway. COGS confirmed; CAC not yet measured.
---
```

That block is doing three jobs at once: it tells the AI what is in here without opening the file, it tells you how much to trust it, and it tells the carving logic whether this may leave the building.

## Part 5 — The index

One file at the top of `stack/` lists every section and what it holds — the table of contents for the whole base, built from the `summary:` lines.

When you ask a question, the AI reads the index, decides which section is relevant, and goes straight to it instead of re-reading everything. **This is what keeps the base fast and cheap as it grows,** and it is the single highest-leverage file in the repo.

Keep it accurate. A stale index is worse than no index, because it routes confidently to the wrong place. The rule in `AGENTS.md` is that any file edit updates the file's `summary:` and the corresponding index row in the same pass.

## Part 6 — A design system

One file records the look: fonts, colours, spacing, layout rules, the tone of voice. Once it exists, every deck, report and page the AI builds for you comes out consistent and on-brand without you specifying it each time.

If you have a website, do not invent this — **sample it.** The palette, the webfont and the logo are already specified to the hex digit on your own site, and a near-miss brand reads as a vendor template with your name on it. [`site2deck`](https://github.com/fritzhand/site2deck) automates the sampling and turns the result into branded, offline, single-file slide decks; `stack/09-brand/brand.md` is written to hand off to it cleanly.

If you have no site yet, fill in what you have decided and mark the rest `[TBD]`. A design system with four confirmed values beats an invented one with twenty.

## Part 7 — A memory

`AGENTS.md` at the repo root records how the AI should work here: the rules, the tone, the tags, what it may never do. Alongside it, most tools keep their own memory of your preferences between sessions — how you like documents structured, what you have decided before, what to avoid.

Over time this is what makes the AI feel like it knows you. It is just a handful of small notes, written down and re-read.

---

## The first hour, concretely

1. **Point the AI at this folder** — this folder only, not your whole drive.
2. **Let it propose the taxonomy.** Ten sections ship with the repo; let it tell you which ones do not fit your business and why.
3. **Extract from what you have.** It pulls real content out of your Excel, Word, PowerPoint and PDF files into the summary files — rescuing charts as images where they matter.
4. **Finish with the index and the design file.** That is a working knowledge base.
5. **Correct `CONTEXT.md`.** One page. Read every line. Fix what is wrong. Stop there for today.

From here you enrich, and you can start asking it to build.

---

## Two habits that pay off

**Everything real goes back in.** A supplier quote, a rejected campaign, a customer objection, a competitor's new price, the transcript of the call you just had. Use [`prompts/14-meeting-to-actions.md`](../prompts/14-meeting-to-actions.md) — it turns a raw transcript into a summary, owned action items with dates, and a set of stack updates in one pass. The habit takes ten minutes after a call and it is the whole difference between a living base and a snapshot.

**Enrich, don't perfect.** The base is never finished. Every report you build and every new dataset goes back in, and each addition makes the next task faster than the last. A base with gaps and honest `[TBD]` tags beats a perfect document that never shipped.

---

## What good looks like at three months

- `CONTEXT.md` is fully `source-of-truth` and you can hand it to a stranger
- Six to eight of the ten sections are mostly corrected; the rest are honestly tagged
- Twelve weekly recaps in `10-pulse/recaps/`, none of them skipped, including the bad weeks
- Every customer and supplier conversation since week one is in the base
- The numbers in your deck, your website and your stack agree — and you know exactly where each one came from
- Asking for a new document — an investor update, a trade sheet, a one-pager for a new channel — takes minutes, because the AI already knows the company

That is the whole promise. It is not glamorous and it is not automatic. It is one organised foundation that makes everything downstream cheap.
