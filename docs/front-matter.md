# Front matter — the schema

Every file in `stack/` opens with a YAML block. It is eleven fields, it takes thirty seconds to write, and it is what turns a folder of notes into a knowledge base an AI can route through cheaply.

```yaml
---
doc: money
section: 07-money
title: Money — Unit Economics, Costing, Runway
owner: Priya Shah
updated: 2026-07-24
status: needs-verification
confidence: low
sensitivity: internal
reads: [04-product, 05-gtm, 06-operations]
feeds: [08-capital, 10-pulse]
summary: Unit economics per SKU, costing at 1k/5k/10k volume bands,
  18-month projections and current runway. COGS confirmed from supplier
  invoices; CAC not yet measured.
---
```

---

## The fields

### `doc`
Short machine name, lowercase, hyphenated. Unique within the stack. Used for cross-references.

### `section`
The numbered folder this lives in — `07-money`. Redundant with the path on purpose: it survives copy-paste into a chat window, where the path does not.

### `title`
Human title. Shows up in the index. Write it for someone who has never seen your company.

### `owner`
**One named person.** Not "the team," not "founders," not blank.

A file without an owner decays. This is the single most reliable finding from every organisation that has tried to run a knowledge base: the parts with a named maintainer stay true, and the parts without one become confidently wrong within a quarter. If you are a solo founder, put your own name — the point is not delegation, it is that the field can never be empty.

### `updated`
`YYYY-MM-DD`. The date a human last checked this file, not the date an AI last touched it.

Anything more than 90 days old should be treated as suspect regardless of its status tag. The gap-scan prompt flags these.

### `status`

| Value | Meaning | Who may set it |
| --- | --- | --- |
| `source-of-truth` | A human has personally confirmed everything in this file | **Founder only** |
| `needs-verification` | Extracted from a real source but not yet confirmed | AI default |
| `draft` | Partially written, actively being worked on | Anyone |
| `tbd` | Placeholder. The section exists; the content does not. | Anyone |
| `conflict` | Two sources disagree and the disagreement is unresolved | Anyone |

An AI may never write `source-of-truth`. It may only propose it: *"You confirmed the COGS figure in this session — shall I promote this file?"* That asymmetry is the reason the tags mean anything.

### `confidence`
`high` / `medium` / `low`. How much weight this file should carry in a decision.

Distinct from `status` and worth keeping separate. A file can be `source-of-truth` and `low` confidence — you have confirmed that this is genuinely your best current estimate, and your best current estimate is a guess. That is honest and useful. Conflating the two loses the distinction between *unverified* and *uncertain*.

### `sensitivity`

| Value | May appear in |
| --- | --- |
| `public` | Website, pitch deck, flyer, press, anything |
| `internal` | Team, coach, investors under NDA. Margins, cap table, runway, salaries, named customers. |
| `restricted` | Nowhere. Never leaves the founder's machine. Personal data, unsigned agreements, anything under a confidentiality obligation, anything about a specific employee. |

This field is what makes carving mechanical. When you ask for something shareable, the AI pulls `public` freely, `internal` only on an explicit instruction, and `restricted` never — and it tells you what it left out.

Set it once, when you are calm. Re-deciding it per document, at 11pm, before a deadline, is how confidential paragraphs end up in investor decks.

### `subject` / `audience` — portfolio layer only

Skip this section if you are a founder building your own stack. These two fields exist only in [`portfolio/`](../portfolio/), and they solve a problem `sensitivity` cannot.

`sensitivity` measures one dimension: how far from the owner a file may travel. That works while the founder is the author and everyone else is a reader. It breaks the moment a coach writes something *about* a founder — because the file was never on the founder's machine, and the people who must read it are the ones who wrote it. `restricted` would say "nowhere", which is wrong; `internal` would say "team and coach", which does not say whether the founder is included.

| Field | Values | Means |
| --- | --- | --- |
| `subject` | a company slug, or a person | Who the file is about |
| `audience` | `founder` · `coach-team` · `programme` | Who may read it |

They compose with `sensitivity` rather than replacing it. A session record is `sensitivity: internal, audience: founder` — the founder gets it, the wider world does not. A coach's read of that same session is `sensitivity: internal, audience: coach-team` — same distance from the outside world, different answer to whether its subject is a reader.

Portfolio files also drop three fields that only mean something inside a stack: `section`, `reads` and `feeds` describe a position in the ten-section router, and a company record has none. The rest of the block is unchanged, which is the point — the same parser, the same index rows, the same habits.

The rule that makes this safe to write down at all: **anything about a person is written as though that person will read it.** In most jurisdictions they can ask to, and a note you would not show them was not worth keeping.

### `reads` / `feeds`
The dependency edges. `reads:` lists the sections this file depends on; `feeds:` lists the sections that depend on it.

They do two useful things. They let the AI open the right neighbours without being told — ask for a fundraising narrative and it knows to pull `07-money` because `08-capital` declares it. And they tell you what breaks when something changes: if your COGS moves, `feeds: [08-capital, 10-pulse]` says the pitch deck and the weekly metrics are now stale.

### `summary`
**One or two sentences. This is the most important field in the block.**

`INDEX.md` is built from these lines. It is what the AI reads to decide which file to open, so a vague summary means the model either opens the wrong file or opens all of them — and opening all of them is the exact cost this system exists to avoid.

Write it as: *what is in here, plus what state it is in.*

Good:
> Unit economics per SKU, costing at 1k/5k/10k volume bands, 18-month projections and current runway. COGS confirmed from supplier invoices; CAC not yet measured.

Bad:
> Financial information about the company.

The first tells a router "open this for cost questions, don't open it for CAC." The second tells it nothing, so it opens the file to find out — which is the whole failure mode.

---

## Inline tags

Front matter describes a whole file. Individual claims inside a file carry their own tag when they differ from the file's overall status.

```markdown
Monthly production capacity is 60 units across all product lines combined —
not 60 per line. [SOURCE OF TRUTH — confirmed 2026-07-24]

The city has roughly 40,000 small retailers.
[NEEDS VERIFICATION — founder's estimate, no source. Cross-check against
a municipal business registry or a trade association's member count.]

Customer acquisition cost: [TBD — needs 30 days of tracked ad spend
against tracked signups. Cannot be estimated before that.]

Monthly recurring revenue is either ₹4.2L or ₹3.8L. [CONFLICT — the deck
says one, the accounting export for the same month says the other. Likely
a different treatment of refunds. Resolve before this number goes in front
of anyone outside the company.]
```

Four rules for inline tags:

1. **Say what would resolve it.** `[TBD]` alone is a shrug. `[TBD — needs 30 days of tracked spend]` is a task with a start date.
2. **Show both sides of a conflict.** Never silently pick the number you prefer. Inconsistent headline figures across a deck, a website and a plan are the fastest way to lose a room, and they are always discovered by the one person doing arithmetic.
3. **Cite the source.** `(src: _inbox/supplier-quote-mar26.pdf)`, `(src: call transcript 2026-03-10)`, `(src: founder, 2026-07-24)`. Six months from now, when the number is challenged, this is the only thing that helps.
4. **Never delete a tag to make a document look finished.** Promote it because a human checked it, or leave it.

---

## The index row

Every file has exactly one row in `stack/INDEX.md`:

```markdown
| [07-money](../stack/07-money/money.md) | Priya | 2026-07-24 | needs-verification | internal | Unit economics per SKU, costing at 1k/5k/10k bands, 18-month projections and runway. COGS confirmed; CAC not yet measured. |
```

Edit a file, update its row in the same pass. This is the one piece of housekeeping the whole system depends on, and it is the one the AI is instructed never to skip.
