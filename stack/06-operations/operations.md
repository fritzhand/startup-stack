---
doc: operations
section: 06-operations
title: Operations — Process, Quality, Suppliers, Capacity, People
owner: "[TBD]"
updated: "[TBD]"
status: tbd
confidence: low
sensitivity: internal
reads: [04-product]
feeds: [05-gtm, 07-money, 10-pulse]
summary: The end-to-end process from raw input to delivered output, where quality
  is checked and by whom, supplier dependencies, the capacity ceiling, the SOP
  set, and how people are kept.
---

# Operations

> Founders reach for money when what they actually lack is a costed process map. You cannot price a job you have not mapped, you cannot scale a process nobody has written down, and you cannot tell an investor how you will spend their money if you do not know what one unit costs to produce.
>
> **Map the process. Then talk about money.**

---

## The process map

Every step from raw input to the customer having the thing. No step is too obvious to write down — the obvious ones are where the cost hides.

| # | Step | Who does it | Where | Time | Cost | Output |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `[TBD — e.g. source raw material]` | | | | | |
| 2 | `[TBD — e.g. aggregate and store]` | | | | | |
| 3 | `[TBD — e.g. process / manufacture]` | | | | | |
| 4 | `[TBD — quality check]` | | | | | |
| 5 | `[TBD — pack]` | | | | | |
| 6 | `[TBD — dispatch]` | | | | | |
| 7 | `[TBD — deliver]` | | | | | |
| 8 | `[TBD — follow up / feedback]` | | | | | |

For a service business the steps are different but the exercise is identical: enquiry → quote → schedule → assign → travel → perform → verify → invoice → collect → follow up.

**Total time from order to delivery:** `[TBD]`
**Total cost per unit through this process:** `[TBD]` → [07-money](../07-money/money.md)

### What you do versus what a vendor does

| Step | In-house | Vendor | Vendor name | What if they stop? |
| --- | --- | --- | --- | --- |
| `[TBD]` | ☐ | ☐ | | |

Founders are often unclear about the line between a supplier, a vendor doing job work, and a manufacturing partner. Be precise: who owns the input, who owns the process, who owns the output, and who carries the risk if a batch fails.

## Phase zero — no overheads

`[TBD]`

> Before you buy machinery, take an office, or hire full time: **prove the economics through vendors and job work, even at a worse margin.**
>
> A 10% margin with no capital expenditure beats a 50% margin against a loan and an unproven customer. The machine costs money, needs a place to live, needs maintenance, and locks you into one process — all before you know whether anyone will reorder.
>
> Buy the machine when demand is repeatable and the arithmetic clearly favours it. Record the trigger here so the decision is made on evidence rather than on a good week.

**Trigger for bringing production in-house:** `[TBD — e.g. "when we have had 3 consecutive months above X units and the payback on the machine is under Y months"]`

## Quality control

Where quality is checked, by whom, against what standard. This is the section institutional buyers, distributors and grant committees ask about, and the one most likely to be blank.

| Checkpoint | What is checked | Against what standard | Who | What happens on a fail |
| --- | --- | --- | --- | --- |
| Incoming material | `[TBD]` | | | |
| Mid-process | `[TBD]` | | | |
| Finished, pre-pack | `[TBD]` | | | |
| Random sample from packed boxes | `[TBD]` | | | |
| On delivery | `[TBD]` | | | |

| | |
| --- | --- |
| **Current defect / rework rate** | `[TBD]` |
| **Where failures get recorded** | `[TBD]` |
| **Warranty offered** | `[TBD]` |
| **Warranty actually costs** | `[TBD]` → [07-money](../07-money/money.md) |

"We check everything before it goes" is not a QC process. A process names the checkpoint, the standard, the person and the failure path.

## Suppliers and vendors

| Supplier | Supplies | Terms | Lead time | Price | Alternative source | Risk |
| --- | --- | --- | --- | --- | --- | --- |
| `[TBD]` | | | | | | |

**Single points of failure:** `[TBD]`

Any input with exactly one supplier is a risk with a name. Before tooling up or committing to a large order, know your second source — even if you never use it, knowing it exists changes your negotiating position.

**Informal suppliers.** If part of your supply chain is unregistered or operates informally, that is common and it is also a real exposure — tax and documentation liability often lands on the registered buyer rather than the informal seller. Name the exposure here and get professional advice on it; do not discover it during an audit.

## Capacity

| | |
| --- | --- |
| **Current maximum output** | `[TBD — per week or month, and be precise about whether that is per line or total across all products]` |
| **Currently running at** | `[TBD]` |
| **The bottleneck** | `[TBD — the one step that caps everything]` |
| **Cost to double capacity** | `[TBD]` |
| **Lead time to double it** | `[TBD]` |

### The scale path

| Level | Output | What it needs | Cost | Trigger |
| --- | --- | --- | --- | --- |
| Today | `[TBD]` | — | — | — |
| 2× | | | | |
| 4× | | | | |
| 10× | | | | |

> **Be exact about what your capacity number means.** "Ten a month" for four products usually means ten in total across all four — not forty. Founders and investors read that differently, and the gap surfaces when an order arrives.
>
> This table is the constraint on the marketing step-test in [05-gtm](../05-gtm/gtm.md). Never scale demand past the level you can serve at full quality on a bad day.

## SOPs

Written procedures for anything done repeatedly by more than one person. The set of them is what lets you hire someone in month nine without personally teaching them everything.

| # | SOP | Owner | Approver | Frequency | Output / record | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `[TBD]` | | | | | |

Each SOP uses a fixed shape — definition, owner, approver, frequency, trigger, numbered steps with who does each and who signs off, the record it produces. Template: [`worksheets/sop-entry.md`](../../worksheets/sop-entry.md).

**Two rules that make SOPs work rather than decorate a folder:**

**The record is the data.** Each SOP should produce a record as a by-product of doing the work — a log entry, a signed sheet, a row in a tracker. Then your metrics fall out of work you were doing anyway, instead of requiring a separate reporting exercise that stops happening in month three. This is what makes the weekly recap in [10-pulse](../10-pulse/pulse.md) sustainable.

**Review them with the people who do the work.** An SOP drafted from the top down, or by an AI, is wrong in specific ways that only the operator knows — a missing step, the wrong approver, a number that changed last year. Sit down monthly with the team, walk through them, and correct.

## People

| | |
| --- | --- |
| **Headcount** | `[TBD]` → [01-company](../01-company/company.md) |
| **Roles that exist** | `[TBD]` |
| **Roles that need to exist** | `[TBD]` |
| **Turnover in the last 12 months** | `[TBD]` |

### Keeping people

`[TBD]`

The retention problem in skilled early-stage operations is real and predictable: you train someone, they become good, they realise they can earn the same money working for themselves, and they leave — often taking customer relationships with them.

Pay alone rarely fixes it, because someone working independently can usually beat your salary. What works is the things independence cannot offer:

| Lever | Offered? | Detail |
| --- | --- | --- |
| **A career ladder** — a named path with titles and pay bands | ☐ | `[TBD — e.g. Technician → Senior → Supervisor → City Manager as we open new locations]` |
| Annual increment, stated up front | ☐ | |
| Performance bonus | ☐ | |
| Health cover for them and family | ☐ | |
| Per-job or per-outcome share | ☐ | |
| Training and certification | ☐ | |
| Equity or profit share for early staff | ☐ | |

> The strongest version of this is told at hiring, not discovered later: *"Our company is growing. Stay a year and here is the increment, the bonus, and the benefits. In two or three years, as we open the next city, the people who built this with us run it."* That is an offer someone cannot give themselves — and if you genuinely intend to expand, you will need people you trust who already know the work.

**When someone leaves, ask why and write it here.** Three exits with the same reason is a fixable problem you would otherwise experience as bad luck.

## Systems

What runs the back office. The app that serves customers is usually not the system that runs the company.

| Function | Tool | Cost | Who uses it | Adequate? |
| --- | --- | --- | --- | --- |
| Customer orders / CRM | `[TBD]` | | | |
| Invoicing | | | | |
| Accounting / bookkeeping | | | | |
| Inventory and parts | | | | |
| Purchase orders | | | | |
| Timesheets and attendance | | | | |
| Payroll | | | | |
| Expenses and petty cash | | | | |
| Customer feedback log | | | | |
| Document storage | | | | |

**Gaps:** `[TBD]`

Before choosing a system, write the list of what you need it to do — POs, parts in and out, timesheets, attendance, expense capture — then take that list to your accountant and ask what fits. Buying the well-known tool first and discovering it does half the job is the expensive order.

Keep the operational system and the accounting system connected but distinct. The app that takes bookings should not be where you track petty cash.
