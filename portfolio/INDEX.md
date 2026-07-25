# Portfolio index

> **This is the router.** An AI working across the portfolio reads this file first, decides which companies a task needs, and opens only those. It is the same mechanism as [`stack/INDEX.md`](../stack/INDEX.md), one level up.
>
> **Maintenance rule:** edit a `record.md` → update its `summary:` → update its row here. Same pass, every time.

**Programme:** `[TBD — programme name]`
**Index owner:** `[TBD — one named person]`
**Last portfolio scan:** `[TBD — YYYY-MM-DD]`

---

## Companies

| Company | Advisor | Updated | Stage | Weakest function | Next milestone | Summary |
| --- | --- | --- | --- | --- | --- | --- |
| [example-co](_company-template/record.md) | `[TBD]` | — | `[TBD]` | `[TBD]` | `[TBD]` | One line, written for routing: what they do, what they are focused on now, and what is in the way. |

Copy that row per company. Keep the summary to one line — the moment it runs to three, this file stops being a router and becomes another document nobody reads.

**Stage** is your own vocabulary — idea, prototype, first revenue, scaling, whatever your programme already says. It is not a rubric level and should not be confused with one. **Weakest function** is the lowest score in [rubric.md](rubric.md), and it is what routes the company to a specialist.

## Levels across the portfolio

The same numbers, arranged the other way. This is the view that tells you what to teach rather than who to help.

| Function | Company A | Company B | Company C | Median |
| --- | --- | --- | --- | --- |
| 01 company | | | | |
| 02 customer | | | | |
| 03 market | | | | |
| 04 product | | | | |
| 05 gtm | | | | |
| 06 operations | | | | |
| 07 money | | | | |
| 08 capital | | | | |
| 09 brand | | | | |
| 10 pulse | | | | |

Read it down a column to see one company. Read it across a row to see the programme. A row where most of the portfolio sits at 1 or 2 is next month's workshop, and it is the only cohort-level signal you get for free — see [themes.md](themes.md).

## Attention

Not a ranking. A list of who needs something this month and what it is.

| Company | What is happening | What it needs | Who | By |
| --- | --- | --- | --- | --- |
| `[TBD]` | | | | |

Three things belong here and nothing else: a company that has gone quiet, a company that is about to hit something it is not ready for, and a company where two coaches have given contradictory advice.

## Health of the record itself

The honest check on this folder, run at each portfolio scan with [`prompts/18-portfolio-scan.md`](../prompts/18-portfolio-scan.md).

| | Count |
| --- | --- |
| Companies with a record | 0 |
| Records not updated in 30+ days | — |
| Companies with no session in 60+ days | — |
| Records with no named owner | — |
| Companies whose founder has sent nothing to the shared folder | — |

A record nobody has touched in a quarter is not a record of a company. It is a record of a company as it was in March, and treating it as current is exactly the failure this whole method exists to prevent.
