<div align="center">

# startup-stack

**The documents every startup should have — compiled into a knowledge base an AI can actually read.**

Drop your pitch deck, market research, business plan, competitor notes and call transcripts into one folder → an AI turns them into a structured, front-mattered knowledge base → then a library of prompts runs on top of it to produce the work: the deck, the list of 100, the unit economics, the weekly recap.

> Every company, customer, metric and transcript used as an example in this repo is invented. Nothing here is drawn from any real client engagement.

[**The method**](docs/method.md) · [**Build the knowledge base**](docs/knowledge-base.md) · [**Prompt library**](prompts/INDEX.md) · [**For coaches**](docs/for-coaches.md) · [**Quickstart**](QUICKSTART.md)

![No code required](https://img.shields.io/badge/code%20required-none-0E6B63?style=flat-square)
![Plain markdown](https://img.shields.io/badge/format-plain%20markdown-44518F?style=flat-square)
![Works with any AI](https://img.shields.io/badge/works%20with-any%20file--aware%20AI-B4562B?style=flat-square)
![License: MIT](https://img.shields.io/badge/license-MIT-238636?style=flat-square)

</div>

---

## The problem this solves

Most early founders are carrying their company in their head and in twelve unrelated files. The pitch deck says one number, the projections say another, the market research lives in a PDF nobody has opened since March, and every AI conversation starts from zero — so every answer is generic, and the founder pays for the model to re-read everything, every time.

Meanwhile the advice they need is not exotic. It is the same twenty things, asked in the same order, by every coach who has ever sat across from an early-stage founder: *Who exactly is the customer? What does a unit cost you? Who else is doing this? How many prospects are on your list — five, or a hundred? What happens when the money runs out?*

`startup-stack` makes those questions answerable from one place.

## The three loops

```
                    ┌──────────────────────────────────────────┐
                    │                                          │
   _inbox/          │            stack/                        │        work
   ───────          │            ──────                        │        ────
   pitch deck       │   INDEX.md  ← the router                 │   pitch deck v2
   business plan  ──┼─▶ CONTEXT.md ← the one-pager             ├─▶ list of 100
   market research  │   01-company … 10-pulse                  │   unit economics
   competitor notes │   ↑ one .md per section, front-mattered  │   investor one-pager
   call transcripts │   ↑ tagged: confirmed / unverified / TBD │   weekly recap
   spreadsheets     │                                          │
   design refs      │                                          │
                    └──────────────────────────────────────────┘
        LOOP 1 · BUILD          LOOP 2 · ENRICH          LOOP 3 · PULSE
        (one afternoon)         (every time something     (30 minutes,
                                 real happens)             every week)
```

**Loop 1 — Build.** You put raw material in `_inbox/`. One prompt reads it and writes the stack: ten numbered sections, one markdown file each, every fact tagged as confirmed, unverified or missing. Takes an afternoon. The output is deliberately incomplete — the gaps are the point, because a gap you can see is a task.

**Loop 2 — Enrich.** Every real thing that happens — a customer call, a supplier quote, a rejected ad campaign, a new competitor — goes back into the stack. The base is never finished. Each addition makes the next request cheaper and better, because the AI stops guessing about your business.

**Loop 3 — Pulse.** Once a week, one prompt reads the stack, reads what changed, and produces a recap: what moved, what did not, what you learned, what you are doing next, and how many weeks of money you have left. That recap is the file you send your coach, your co-founder, or your investors — and it is also the file that gets read back into the stack next week.

## What is in here

| Folder | What it is |
| --- | --- |
| [`stack/`](stack/) | **The templates.** Ten numbered sections — company, customer, market, product, GTM, operations, money, capital, brand, pulse — one markdown file each, with front matter. This *becomes* your knowledge base; you fill it in, you do not copy it out. |
| [`prompts/`](prompts/INDEX.md) | **The prompt library.** 15 prompts that run on top of a filled-in stack: bootstrap, gap scan, competitive intelligence, unit economics, list of 100, pitch deck, fundraise readiness, weekly recap, and the adversarial review that tells you what an investor will attack. |
| [`worksheets/`](worksheets/) | **The repeatable artifacts.** Fill-in files you produce over and over: startup-prep, customer interview, competitor profile, two-week experiment, SOP entry, trade/order sheet, advisor scope letter, one-pager, list of 100, weekly recap. |
| [`docs/`](docs/) | **The method.** Why front matter and an index make the base cheap to run; how to build it in your first hour; how a coach runs this with a cohort; and the safety rules for giving an AI access to your files. |
| [`_inbox/`](_inbox/) | Where raw material lands before it is processed. Git-ignored by default. |

## Quickstart

Requirements: a **paid** AI subscription and a tool that can see your file system — the Claude desktop app, Claude Code, ChatGPT's Codex app, or any equivalent. Free chat tiers cannot do this work; they cannot read your folder.

```bash
# 1. Take a copy. This is a template, not a dependency — you own what you make.
git clone https://github.com/fritzhand/startup-stack my-company-stack
cd my-company-stack && rm -rf .git && git init

# 2. Fill the inbox. Anything that describes the business.
#    Pitch deck, business plan, market research, competitor notes, financial model,
#    call transcripts, WhatsApp exports, supplier quotes, the website.
cp ~/Downloads/*.pdf _inbox/

# 3. Point your AI at the folder and run the bootstrap prompt.
#    prompts/00-bootstrap-the-stack.md
```

Then read [QUICKSTART.md](QUICKSTART.md) — it walks the first hour honestly, including what *not* to try to finish today.

## The honest cost

This is what it costs, measured on a real base rather than a demo:

> **Skeleton in an hour. A working v1 in a few focused sessions. A stack you actually trust in about a month, because the long pole is you correcting what the AI got wrong — not the AI writing it. Then roughly thirty minutes a week to keep it alive.**

Nobody should tell you this is free. The AI drafts; you validate. A stack you have not corrected is a confident-sounding guess about your own company, and that is worse than no stack at all.

## The rules this system runs on

1. **The document is the data.** If a metric needs special effort to gather, it is the wrong metric. Your numbers should fall out of records you already keep.
2. **AI drafts, the founder validates.** Nothing in the stack is true because the model wrote it. Every section carries a status tag until a human has confirmed it.
3. **Tag honestly.** `needs-verification` and `tbd` are not failures — they are the quality system. A stack with visible gaps beats a polished one that quietly invents numbers.
4. **Enrich, don't perfect.** Ship the skeleton. Add to it forever.
5. **One index, one summary line per file.** This is what keeps the base cheap: the AI reads a small router and opens one section, instead of re-reading everything you own on every question.
6. **Private master, shared derived.** Every file declares a sensitivity. What you share with a coach, an investor or a customer is carved from the master — never the master itself.
7. **Scope the AI to one folder.** Start narrow. Widen only as fast as your confidence. See [docs/safety.md](docs/safety.md).

## Where this came from

The knowledge-base method is not theoretical. It is adapted from the working practice of an incubator that runs its own operations — decks, reports, SOPs and monthly metrics — out of one structured folder of plain markdown files, rather than out of software.

The founder-advice content is standard early-stage curriculum: the questions an experienced coach asks, roughly in the order they get asked, and the answers that hold up. No client work, session material or client data is reproduced here. Every company, customer and number used as an example is invented for illustration.

A companion project, [site2deck](https://github.com/fritzhand/site2deck), does the last mile — it samples a company's real design system off its website and turns a filled-in stack into a branded, offline, single-file slide deck. `stack/09-brand/brand.md` is written to hand off to it cleanly.

## License

MIT. Take it, fork it, rename it, run it with your cohort, sell coaching on top of it. Attribution appreciated, not required.
