# Stack index

> **This is the router.** An AI working in this stack reads this file first, decides which sections a task needs, and opens only those. Reading everything on every question is the cost this file exists to avoid.
>
> **Maintenance rule:** edit a file → update its `summary:` front matter → update its row here. Same pass, every time. A stale index routes confidently to the wrong place, which is worse than no index at all.

**Company:** `[TBD — company name]`
**Stack owner:** `[TBD — one named person]`
**Last full review:** `[TBD — YYYY-MM-DD]`

---

## Start here

| File | What it is |
| --- | --- |
| [CONTEXT.md](CONTEXT.md) | **The one-pager.** Everything the AI needs to not sound generic. Read this on almost every task. |

## Sections

| # | Section | Owner | Updated | Status | Sensitivity | Summary |
| --- | --- | --- | --- | --- | --- | --- |
| 01 | [company](01-company/company.md) | TBD | — | tbd | internal | Entity, incorporation, founders and team, cap table, advisors, legal and compliance obligations. |
| 02 | [customer](02-customer/customer.md) | TBD | — | tbd | internal | Who the customer is, the job to be done, what they use today, interview evidence, the ICP. |
| 03 | [market](03-market/market.md) | TBD | — | tbd | internal | Market sizing with stated assumptions, the beachhead, competitor grid, adjacent threats, industry structure. |
| 04 | [product](04-product/product.md) | TBD | — | tbd | internal | What exists today versus what is still a slide, the roadmap, technical approach, IP position. |
| 05 | [gtm](05-gtm/gtm.md) | TBD | — | tbd | internal | Channels tested and untested, the prospect pipeline, the marketing engine, sales collateral, outreach cadence. |
| 06 | [operations](06-operations/operations.md) | TBD | — | tbd | internal | End-to-end process map, quality control checkpoints, suppliers, capacity ceiling, SOPs, people and retention. |
| 07 | [money](07-money/money.md) | TBD | — | tbd | internal | Unit economics, costing at volume bands, working capital, projections, runway, the tools that track it. |
| 08 | [capital](08-capital/capital.md) | TBD | — | tbd | internal | Funding roadmap tied to milestones, dilution map, non-dilutive options, the deck, investor CRM, data room. |
| 09 | [brand](09-brand/brand.md) | TBD | — | tbd | public | Name and trademark position, positioning statement, voice, and the design system that everything is built against. |
| 10 | [pulse](10-pulse/pulse.md) | TBD | — | tbd | internal | The three to six metrics that matter, their current values, and the archive of weekly recaps. |

## Recaps

| Latest | Archive |
| --- | --- |
| `[TBD]` | [10-pulse/recaps/](10-pulse/recaps/) |

---

## Status of the base

Fill this in after each gap scan ([`prompts/02-gap-scan.md`](../prompts/02-gap-scan.md)). It is the honest health check on the stack itself.

| | Count |
| --- | --- |
| Sections at `source-of-truth` | 0 / 10 |
| Sections at `needs-verification` | 0 / 10 |
| Sections still `tbd` | 10 / 10 |
| Files not reviewed in 90+ days | — |
| Open `[CONFLICT]` markers | — |

**Biggest open gaps, in priority order:**

1. `[TBD]`
2. `[TBD]`
3. `[TBD]`

---

## Reading order for common tasks

Rather than opening everything, route:

| Task | Read |
| --- | --- |
| Pitch deck | CONTEXT · 02 · 03 · 04 · 07 · 08 · 09 |
| Investor update | CONTEXT · 07 · 10 · latest recaps |
| Unit economics | CONTEXT · 04 · 06 · 07 |
| Prospect list / outreach | CONTEXT · 02 · 05 |
| Competitive analysis | CONTEXT · 02 · 03 · 04 |
| Grant application | CONTEXT · 01 · 03 · 04 · 07 · 08 |
| Weekly recap | CONTEXT · 10 · last recap |
| Process or SOP work | CONTEXT · 06 · 07 |
| Website or brand work | CONTEXT · 02 · 09 |
