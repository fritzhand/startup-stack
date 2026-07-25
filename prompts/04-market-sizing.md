# Prompt 04 — Market sizing and beachhead

Builds TAM/SAM/SOM from countable units with every assumption on the page, and picks a beachhead you can actually walk into.

Replaces the nine-digit number from a market report that tells an investor nothing except that you read a report.

**Requires:** `02-customer` past `tbd`, and a price — from `07-money` or from you.

---

```
Read AGENTS.md first, then stack/CONTEXT.md, stack/02-customer/customer.md and
stack/03-market/market.md. Also read any market research in _inbox/.

## Step 0 — Check the ground

Bottom-up sizing needs two things: who the buyer is, and what they pay.

- stack/02-customer/customer.md past tbd. If it is still [TBD], stop and say so.
  03-customer-and-problem.md is the prompt that fills it. A market sized for a
  customer nobody can describe is arithmetic performed on a guess, and it is
  worse than the report headline it replaces because it looks rigorous.
- A price, from stack/07-money/money.md or from me. If neither has one, ask, and
  carry whatever I give you through the whole calculation as the founder's
  estimate.

## Step 1 — Audit what is there

Report on any market sizing currently in the stack or in the deck:

- Is it top-down (a number from a report) or bottom-up (units × price)?
- Is every assumption visible and contestable?
- Can you trace every figure to a source?
- Does the SOM reconcile with the capacity in 06-operations and the projections
  in 07-money?

If the current sizing is a headline figure from an industry report with no
arithmetic, say so plainly. It is the most common weak slide in early decks and
experienced readers discount it entirely.

## Step 2 — Build it bottom up

Work from countable units. For each of TAM, SAM and SOM, produce:

  [count of units] × [price] × [any capture or frequency factor] = [size]

with:
- The source for the count, and how reliable that source is
- The source for the price
- Every assumption stated as its own line so a reader can disagree with one
  number rather than dismissing the whole slide

TAM — everyone who could conceivably buy this
SAM — everyone you could serve with today's product, in your geography, given
      regulation, language and channel
SOM — what you can realistically win in year one, with a defended capture rate

Where a count does not exist in the sources, do NOT estimate it. Write
[TBD — needs X] and tell me exactly where that number could come from: a census
table, an industry association, a distributor, a competitor's filings, or an
afternoon counting.

The shape to aim for, as an illustration of the level of detail:

  "There are roughly 90,000 offices in this city (src: X). Of those, an
   estimated 15,000 are large enough to want a managed drinking-water contract
   — the segment I can reach through B2B sales (assumption: needs verification
   against a commercial property count). At ₹8,000 per office per year (src:
   our current pricing), that segment is ₹12 crore. Winning 3% in year one —
   450 offices — gives ₹36 lakh."

Every number contestable, every number visible.

## Step 3 — Sanity check against the rest of the stack

Explicitly check and report:

- Can the operation in 06-operations physically deliver the SOM? If the SOM
  implies 900 units a month and capacity is 60, say so — that is a different
  problem than a small market and it is the one an investor will spot.
- Does the SOM require more customers than the marketing budget and CAC in
  07-money can produce?
- Does the SOM match the revenue projection in 07-money? If they disagree, flag
  it as a [CONFLICT].

## Step 4 — The beachhead

Recommend a first niche, chosen on REACHABILITY rather than attractiveness.

Founders systematically pick a beachhead they find impressive and cannot
access. The best one is usually the one they can physically walk into this
week: their own neighbourhood, their last employer's industry, a community they
already belong to, the customers who already call them.

Give me:
- The beachhead, specifically
- Its size, and revenue if it were fully won
- Why here first — access, not appeal
- What winning it looks like, as a number and a date
- What it unlocks next
- Two alternatives you considered and why they lose

## Step 5 — Growth and structure

- What is changing structurally in this market — regulation, cost, behaviour,
  technology, demographics — and is it moving toward this company or away from
  it?
- Why has nobody else done this? The honest answer is usually one of: they have
  and it failed, they have and you did not find them, it is not actually
  valuable, or there is a real barrier. Which is it here?
- Is this market growing, flat or shrinking? Source it.

## Step 6 — Who matters in this space

List the people whose work should be known: leading researchers, operators,
publications, communities, or the person publicly running the definitive
experiment. Not competitors — the people who define what "informed" means here.

A pitch in a technical field that does not reference the people actually
advancing that field reads as underinformed, however good the product is.

## Output

Update stack/03-market/market.md. Keep the sources table current — every number
above must have a row in it. Update front matter and the INDEX row.

Finish by telling me which single number in this sizing is least defensible and
what it would take to firm it up.
```

---

## Notes

**Bottom-up beats top-down every time.** Not because the number is more accurate — it usually is not — but because it demonstrates you understand how the market is actually composed. A reader can argue with your capture rate. They cannot argue with a report headline; they can only dismiss it.

**Step 3 catches the mismatch that kills pitches.** A market sizing that implies volumes your operation cannot produce is spotted immediately, and it undermines every other number in the deck.
