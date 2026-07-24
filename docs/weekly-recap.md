# The weekly recap — checking the pulse

Thirty minutes. One file. Same shape every week. Forever.

This is the only part of `startup-stack` that compounds, and it is the part founders skip. It feels like overhead in week one, when nothing has happened. Do it in week one *precisely because* nothing has happened — the discipline is what you are building, not the report.

---

## Why a fixed shape

Because comparability is the whole point.

A recap that changes shape each week is a diary. You cannot read six of them in a row and see anything. A recap with the same six headings every week means the trend is visible without doing any work: the same number, in the same place, week after week, and the direction jumps off the page.

The shape is deliberately small — six sections, one page. A recap that takes two hours does not get written in week nine.

---

## The six sections

### 1. The numbers

Three to six metrics, the same ones every week, with last week beside them.

Not a dashboard. Three to six. If you track fifteen numbers you are tracking none of them, because nobody reads fifteen numbers weekly and forms a view.

Pick metrics that **fall out of records you already keep.** If a metric needs special effort to gather every week, it is the wrong metric — you will stop gathering it by week four and then you will stop doing the recap. Orders are in your order book. Leads are in your inbox. Cash is in your bank app. Start there.

```
| Metric              | This week | Last week |  Δ  |
| ------------------- | --------- | --------- | --- |
| Paying customers    |        14 |        11 |  +3 |
| Revenue             |  ₹42,000  |  ₹31,000  | +35%|
| Leads               |        38 |        52 | -27%|
| Cost per lead       |     ₹158  |     ₹121  | +31%|
| Cash in bank        | ₹2.1L     | ₹2.4L     | -₹0.3L |
| Weeks of runway     |         7 |         8 |  -1 |
```

Runway in weeks belongs on every recap from day one. It is the number that determines which of your other problems is actually the problem.

### 2. What moved

Two to five things that actually happened. Shipped, signed, launched, hired, fixed. Concrete and countable.

Not "made progress on the website." Either the website went live or it did not.

### 3. What did not move

The commitments from last week's recap that are still open, with an honest reason.

This section is why the recap works and why it is uncomfortable. Anyone can write a week of wins. Naming the thing you said you would do and did not do, week after week, in a file your coach reads, changes behaviour in a way that a private to-do list never has.

If something has been in this section three weeks running, that is not a scheduling problem. Say so.

### 4. What we learned

The market told you something. Write down what.

Customer objections you heard for the first time. A price that turned out to be wrong. A channel that produced nothing. A competitor's move. The reason a deal died.

**Objections are data.** When someone says no, ask why, and put the answer here. Five recaps with the same objection in this section is your positioning problem, discovered for free.

### 5. Next week's commitments

Three to five things, each with a number attached.

- ✗ "Push on sales"
- ✓ "Visit 25 kirana stores, place stock in at least 4"
- ✗ "Work on fundraising"
- ✓ "Add 40 investors to the CRM, send 20 connection requests"
- ✗ "Improve the ads"
- ✓ "Double the daily ad budget for 5 days, log CPL daily"

Next week these become section 2 or section 3. That is the loop. Commitments without a number cannot be graded, so they are always half-done and never failed.

### 6. Where I need help

The ask. Introductions, a decision, an opinion, a hire, a supplier.

Be specific. "Any advice welcome" gets nothing. "Do you know anyone who has sold into hospital procurement in my region?" gets an introduction.

---

## Running it

```
prompts/12-weekly-recap.md
```

The prompt reads `stack/10-pulse/pulse.md` for your metric definitions and last week's figures, reads last week's recap for the open commitments, asks you for this week's numbers and events, and writes the file. Then it writes the new numbers back into `pulse.md`.

**Doing the recap is the maintenance.** There is no separate "update the knowledge base" chore, which is good, because that chore never gets done.

Output lands in `stack/10-pulse/recaps/YYYY-MM-DD.md`. It is **append-only** — recaps are never edited, corrected or consolidated after the fact. The record of what you believed at the time is more valuable than a tidy archive, and it is the only honest way to see whether your judgment is improving.

---

## Sending it

The recap is the natural artifact for three audiences, and the AI can carve each version from the same file using the `sensitivity` rules:

| Audience | Include | Cadence |
| --- | --- | --- |
| **Your coach / mentor** | Everything, including runway and the bad weeks. Withholding the bad weeks from a coach is the fastest way to make the relationship useless. | Weekly |
| **Co-founders / team** | Everything except individual compensation | Weekly |
| **Investors / advisors** | Numbers, moved, learned, the ask. Trim the internal churn. | Monthly — a roll-up of four recaps |

A word on coaches. Most mentoring relationships die because the founder shows up excited once, gets an hour of advice, and is never heard from again. Sending a recap every week, unprompted, whether or not the week went well, is the single strongest signal a founder can send — and the reason a good coach will keep giving you time. Execution is the price of access, and the recap is the receipt.

---

## The failure modes

**Skipping the bad weeks.** The pattern that kills companies is not a bad month. It is four bad months, each narrated as "building momentum," so that nobody — including the founder — notices until the cash is gone. A recap that says *three of five metrics went sideways and I do not yet know why* is doing its job.

**Adding metrics.** By month three you will want to track twelve things. Don't. Add a metric only by removing one.

**Letting it grow.** If the recap starts running to three pages it stops being read, including by you. One page. Detail belongs in the stack; the recap points at it.

**Editing history.** Do not go back and fix last month's recap because the number turned out to be wrong. Note the correction in this week's. The archive is a record of your judgment, not a record of the truth.
