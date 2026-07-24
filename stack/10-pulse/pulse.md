---
doc: pulse
section: 10-pulse
title: Pulse — The Metrics That Matter
owner: "[TBD]"
updated: "[TBD]"
status: tbd
confidence: low
sensitivity: internal
reads: [05-gtm, 06-operations, 07-money]
feeds: []
summary: The three to six metrics this business turns on, how each is defined and
  where it comes from, their current and historical values, and the archive of
  weekly recaps.
---

# Pulse

> The heartbeat of the stack. Three to six metrics, defined once, measured every week, forever.
>
> The full ritual is in [docs/weekly-recap.md](../../docs/weekly-recap.md). This file holds the definitions and the running history that the recap reads from and writes back to.

---

## The rules

**Three to six. Not fifteen.** Nobody reads fifteen numbers weekly and forms a view. If you want to add a metric, remove one.

**The document is the data.** Each metric should fall out of records you already keep — the order book, the bank app, the ad dashboard, the delivery log. **If a metric needs a special effort to gather every week, it is the wrong metric.** You will stop gathering it by week four, and then you will stop doing the recap.

**Define it once, precisely.** "Customers" means what, exactly? Anyone who has ever paid, or anyone who paid this month? Ambiguity here means your trend line is measuring your mood.

**Runway is always on the list.** From day one. It determines which of your other problems is actually the problem.

---

## The metrics

### 1. `[TBD — metric name]`

| | |
| --- | --- |
| **Definition** | `[TBD — precise enough that two people would compute the same number]` |
| **Source** | `[TBD — which record, which system, who pulls it]` |
| **Cadence** | Weekly |
| **Current** | `[TBD]` |
| **Target and date** | `[TBD]` |
| **Why this one** | `[TBD]` |

### 2. `[TBD]`

| | |
| --- | --- |
| **Definition** | |
| **Source** | |
| **Current** | |
| **Target and date** | |

### 3. `[TBD]`

| | |
| --- | --- |
| **Definition** | |
| **Source** | |
| **Current** | |
| **Target and date** | |

### 4. Runway (always)

| | |
| --- | --- |
| **Definition** | Cash in bank ÷ average weekly net burn, in weeks |
| **Source** | Bank balance + [07-money](../07-money/money.md) |
| **Current** | `[TBD]` |
| **Decision threshold** | `[TBD — the number of weeks at which you act, per 07-money]` |

### Starter metrics by business type

If you do not know where to begin, take three from your row.

| Type | Reasonable starting three |
| --- | --- |
| Physical product, D2C | Units sold · Repeat purchase rate · Cost per acquired customer |
| Physical product, B2B/trade | Active stockists · Reorder rate · Average order value |
| Service business | Jobs completed · Average job value · Time from booking to delivery |
| Marketplace | Paying suppliers · Transactions · Take rate realised |
| Software / subscription | Paying accounts · Monthly recurring revenue · Churn |
| Hardware, pre-revenue | Units shipped to pilots · Pilot-to-order conversion · Production yield |
| Deep tech / research stage | Milestones cleared · Pilot partners signed · Non-dilutive funding secured |

---

## History

Updated by the weekly recap. One row per week, never edited retrospectively.

| Week ending | `[M1]` | `[M2]` | `[M3]` | Cash | Runway (wks) | Note |
| --- | --- | --- | --- | --- | --- | --- |
| `[TBD]` | | | | | | |

## Quality signals

Not weekly headline metrics, but checked monthly. A business can grow its numbers while its quality collapses, and this is where you would see it first.

| | Current | Last month |
| --- | --- | --- |
| Would customers recommend you (NPS or equivalent) | `[TBD]` | |
| Repeat / retention rate | `[TBD]` | |
| Complaints or returns | `[TBD]` | |
| On-time delivery | `[TBD]` | |
| Defect or rework rate | `[TBD]` | |
| Reviews and average rating | `[TBD]` | |

**Where customer feedback is recorded:** `[TBD]`

> Every customer is a line in a sheet: date, what they bought, score, what they actually said, whether they came back. Ask "would you recommend us?" at the moment of delivery, when the answer is honest and the customer is present. This costs nothing to start on day one and cannot be reconstructed on day four hundred.

## Commitments carried

The open items from the last recap. The weekly recap reads this, grades it, and rewrites it.

| Commitment | Committed on | Target | Status |
| --- | --- | --- | --- |
| `[TBD]` | | | |

Anything here for three consecutive weeks is not a scheduling problem. Say so in the recap.

## Recaps

Archive: [recaps/](recaps/) — append-only. Never edited, corrected or consolidated after the fact.

| Week | File | Headline |
| --- | --- | --- |
| `[TBD]` | | |
