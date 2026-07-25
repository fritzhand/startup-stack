# AGENTS.md — instructions for an AI working inside a startup stack

You are working inside a founder's knowledge base. Read this file before touching anything else.

*(If your tool looks for `CLAUDE.md`, `.cursorrules`, `GEMINI.md` or similar, that file points here. This is the single source.)*

---

## What this repo is

A **startup stack**: the working knowledge base for one company. Ten numbered sections in `stack/`, one markdown file each, every file carrying front matter that says what it is and whether it has been verified. `stack/INDEX.md` is the router. `stack/CONTEXT.md` is the one-page summary of the whole business.

The founder is not a developer. Write for someone who has never seen this company before and has to get up to speed in twenty minutes.

## Read in this order — always

1. **`stack/INDEX.md`** — the router. One line per file. Decide from here which sections you actually need.
2. **`stack/CONTEXT.md`** — the one-pager. Almost every task needs it.
3. **Only the sections the task requires.** Each file's front matter lists `reads:` and `feeds:` — follow those edges rather than opening everything.

Do not read the whole `stack/` on every request. The index exists so you don't have to, and reading everything is exactly the cost this system is designed to avoid. If the index does not tell you enough to route, say so and improve the index.

## The rules — non-negotiable

### 1. Never invent a number

Every figure, date, name, market size, margin, price, headcount and growth rate must trace to a source: a file in `_inbox/`, an existing entry in `stack/`, or something the founder told you in this conversation.

If you do not have a source, write `[TBD — <what specifically is needed and from where>]`. Do not estimate. Do not say "approximately." Do not fill a table cell with a plausible-looking number because the table looks bad empty.

An empty cell is information. A fabricated cell is damage that will surface in an investor meeting.

### 2. Tag every claim

Every fact carries one of these, either in front matter (whole file) or inline (individual claim):

| Tag | Means |
| --- | --- |
| `[SOURCE OF TRUTH]` | The founder has personally confirmed this. Only a human may apply this tag. |
| `[NEEDS VERIFICATION]` | Extracted from a source but not confirmed. **This is your default for anything you extract.** |
| `[TBD]` | Missing. Say what is missing and where it would come from. |
| `[CONFLICT]` | Two sources disagree. Show both and cite both. Never silently pick one. |

You may never promote something to `[SOURCE OF TRUTH]`. You may only propose it: *"You confirmed X in this session — shall I mark it source-of-truth?"*

**One more tag exists in the portfolio layer, because all four above assume a checkable claim.** "Their pricing is ₹450" can be verified. "They take feedback badly" cannot — it has no source to check, no action that resolves it, and two people disagreeing about it is a difference of judgement rather than a discrepancy.

| Tag | Means |
| --- | --- |
| `[ASSESSMENT — name, date]` | Somebody's judgement, attributed and dated. Never promoted, never merged with another person's, never presented as fact. |

Two assessments that disagree both stand, side by side, with their names on them. That is not a `[CONFLICT]` to resolve — it is two people who have met the same founder and read them differently, which is information.

### 3. Cite where things came from

When you write a fact into the stack, note its origin: `(src: _inbox/pitch-deck-v4.pdf p7)`, `(src: call transcript 2026-03-10)`, `(src: founder, 2026-07-24)`. This is what makes the base auditable later, when the number is being questioned in a room you are not in.

Anything under `_inbox/websites/` was fetched from a live site and carries its URL and fetch date in its front matter — cite both: `(src: https://example.com/pricing, fetched 2026-07-24)`. A website is a company's public claim about itself, **including your own**, so it is `[NEEDS VERIFICATION]` and never `[SOURCE OF TRUTH]`. When it contradicts something already in the stack, that is a `[CONFLICT]` to surface, not a discrepancy to quietly resolve — a founder's own site is out of date more often than not.

### 4. Update front matter when you edit a file

Change `updated:` to today. Re-check whether `status:` and `confidence:` still hold. Rewrite `summary:` if the file's substance changed — the index is built from those summary lines and a stale summary breaks routing for every future request.

### 5. Respect sensitivity

Every file declares `sensitivity: public | internal | restricted`.

- `public` — safe in a deck, a website, a pitch
- `internal` — team and coach only: margins, cap table, runway, salaries, customer names
- `restricted` — never leaves the founder's own machine: personal data, unsigned agreements, anything under a confidentiality obligation

When asked to produce something shareable — a deck, a one-pager, an investor update — **carve it**. Pull from `public` freely, from `internal` only with an explicit instruction, and never from `restricted`. State in your output what you excluded and why.

**In the portfolio layer only,** two further fields appear, because `sensitivity` measures one thing — how far from the owner a file may travel — and a programme needs to answer a second question it cannot: whether the person a file is *about* is among the people who may read it.

| Field | Values | Means |
| --- | --- | --- |
| `subject` | a company slug, or a person | Who this file is about |
| `audience` | `founder` · `coach-team` · `programme` | Who may read it |

A coach's read of a founder is `audience: coach-team`. It never travels to the founder's copy, and never into anything the founder receives. If you are producing something for a founder and a file says `coach-team`, it is not yours to include — say you excluded it, without quoting it.

**One rule governs everything written about a person: write it as though they will read it.** That is the posture the law takes in most places, and it is also the only way the note stays honest enough to be worth keeping. See [`docs/for-portfolios.md`](docs/for-portfolios.md). A founder working on their own company will never need either field.

### 6. Never delete without asking

You may add, restructure, and rewrite files. You may not delete a file, empty a section, or drop a historical recap without asking first and getting a clear yes. Recaps in `stack/10-pulse/recaps/` are an append-only record — they are not tidied, corrected or consolidated, ever.

### 7. Write in the founder's voice, not a consultant's

Factual, concrete, short sentences. No marketing language. No "leverage," "synergy," "unlock," "game-changing," "revolutionary." No emoji anywhere. The ballot and check glyphs used as structural markers in these templates (☐ ✓ ✗) are not emoji and stay. Never open a sentence with "In today's fast-paced world."

If the founder speaks about their business in a particular way — a phrase they use for their customer, a name they call a product — use their words, not better ones.

### 8. Numbers stay consistent across the stack

Before writing a headline figure anywhere, check whether it already appears elsewhere in `stack/`. If your new number disagrees with the old one, that is a `[CONFLICT]` to surface, not a discrepancy to quietly resolve. Inconsistent headline numbers across a deck, a website and a plan is the single most common way an otherwise good company loses credibility in diligence.

---

## Working with prompts

`prompts/` holds the task library. When the founder invokes one, follow it exactly — the prompts encode the sequence a coach would use, and skipping steps produces confident output built on nothing.

If a prompt asks for input the stack does not have, **stop and ask**. Do not proceed with an assumption and mention it in a footnote. The founder can answer in ten seconds; a wrong assumption propagates through every downstream document.

## Writing new sections

Use the front-matter schema in [`docs/front-matter.md`](docs/front-matter.md). Every new file needs:

- the full front-matter block, including a one-sentence `summary:` written for routing
- a row added to `stack/INDEX.md`
- correct `reads:` / `feeds:` edges to its neighbours

## The failure mode to avoid

The most damaging thing you can do here is produce a complete, polished, well-formatted stack in which a third of the content is invented. It will read as finished. The founder will trust it. They will put its numbers into a deck, quote them to an investor, and be caught out by someone who did the arithmetic.

An obviously incomplete stack full of honest `[TBD]` markers is a working tool. A beautifully complete stack full of quiet guesses is a liability.

Prefer the gap. Always.
