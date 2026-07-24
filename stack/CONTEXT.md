---
doc: context
section: root
title: Company Context — the one-pager
owner: "[TBD]"
updated: "[TBD]"
status: tbd
confidence: low
sensitivity: internal
reads: [01-company, 02-customer, 03-market, 04-product, 05-gtm, 07-money]
feeds: [all]
summary: One-page description of the company — what it does, for whom, how it
  makes money, where it is today, and what it is trying to prove next. Read on
  almost every task.
---

# Company Context

> **This is the most important file in the stack.** It is read on almost every task, and it is the difference between an AI that knows your company and one that produces generic output with your name on it.
>
> **Keep it to one page.** If it grows past that, the detail belongs in a section and this file should point at it.
>
> **This is the first thing you correct after bootstrapping, and the first thing you promote to `source-of-truth`.** Everything downstream inherits its errors.

---

## In one sentence

`[TBD]`

> The test: could a stranger repeat this back correctly after hearing it once? Name the customer, the problem and the mechanism. No adjectives.
>
> Good: *"We repair and service home appliances through an app, with in-house technicians and annual maintenance contracts."*
> Bad: *"We are revolutionising the home services experience through a technology-first platform."*

## What we actually do

`[TBD]`

Two or three sentences. What a customer receives, in physical or literal terms.

## Who it is for

`[TBD]`

The primary customer, described as a person in a situation — not a segment. See [02-customer](02-customer/customer.md) for the full picture.

## How we make money

`[TBD]`

The revenue mechanism in one line. Who pays, for what, how often, at what price. If there is more than one, say which is the majority today and which you expect to matter in a year.

## Where we are today

| | |
| --- | --- |
| **Stage** | `[TBD — idea / prototype / pilot / early revenue / scaling]` |
| **Founded** | `[TBD]` |
| **Entity** | `[TBD — proprietorship / LLP / Pvt Ltd / other, and jurisdiction]` |
| **Team** | `[TBD — headcount, split full-time / part-time / interns]` |
| **Customers** | `[TBD — number, and how many are paying]` |
| **Revenue** | `[TBD — last month and last 12 months]` |
| **Capital raised** | `[TBD — amount, type, from whom]` |
| **Cash position** | `[TBD — in the bank]` |
| **Runway** | `[TBD — in weeks]` |

Every number here needs a source. If you cannot source it, mark it `[TBD]` — a wrong number in `CONTEXT.md` propagates into everything the AI writes for you.

## The three numbers that matter

The metrics this business actually turns on. Not a dashboard — three. Full definitions in [10-pulse](10-pulse/pulse.md).

1. `[TBD]` — currently `[TBD]`
2. `[TBD]` — currently `[TBD]`
3. `[TBD]` — currently `[TBD]`

## What we are trying to prove in the next 90 days

`[TBD]`

One thing. The riskiest assumption you are currently testing, and what result would count as proof.

> Good: *"That a kirana store that stocks us once reorders. Proof = 8 of 25 stores place a second order within six weeks."*
> Bad: *"Achieve product-market fit."*

## The three biggest risks

1. `[TBD]` → mitigation: `[TBD]`
2. `[TBD]` → mitigation: `[TBD]`
3. `[TBD]` → mitigation: `[TBD]`

Be honest here. A risk you have not written down is one you are not managing. If a risk has no plausible mitigation, say that too — knowing you are exposed is worth more than a comforting sentence.

## What we need help with right now

`[TBD]`

Specific and askable. "Introductions to hospital procurement teams in my region" gets an introduction. "Advice on growth" gets nothing.

---

## Facts an AI keeps getting wrong about us

Add to this list every time you have to correct the same misunderstanding twice. It is cheaper than re-explaining.

- `[TBD]`

## Words we use, and words we don't

| We say | Not |
| --- | --- |
| `[TBD]` | `[TBD]` |

The AI should write in your language, not a better one. If your customers are "societies" and not "residential communities," say so here.
