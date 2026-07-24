# Prompt 07 — Unit economics, costing and runway

**The most valuable prompt in this library.** What one unit costs, what it costs at volume, how much cash you need to fulfil an order, and how many weeks until the money runs out.

Founders reach for capital when what they lack is a costed process map. Do this before any fundraising work.

---

```
Read AGENTS.md first, then stack/CONTEXT.md, stack/04-product/product.md,
stack/06-operations/operations.md and stack/07-money/money.md. Also read any
financial model, supplier quotes, invoices or rate cards in _inbox/.

## Step 1 — Can these questions be answered at all?

Report first, before calculating anything:

- What does one unit cost? Is that number traceable to invoices and measured
  time, or is it an estimate?
- What is it sold for?
- What is the gross margin?
- What does it cost to acquire a customer?
- What is the monthly burn?
- How many weeks of runway?

For each, say whether the stack contains a sourced answer, an estimate, or
nothing. Do not calculate anything yet.

## Step 2 — Build the unit cost from the process

Work from the process map in 06-operations. Every step that consumes money or
time becomes a cost line. Per SKU or service:

  Price to customer
  - Materials / inputs
  - Direct labour (hours × rate — an actual measured time, not a guess)
  - Processing or vendor charges
  - Packaging
  - Freight in
  - Freight out
  - Payment processing
  - Wastage / rework allowance
  - Warranty provision
  = Gross margin, and gross margin %

Every line cites its source. Where a cost is unknown, write
[TBD — needs quote from X / needs 10 jobs timed] and say specifically how to get
it. Do NOT estimate a cost to complete the table.

Then flag the costs founders routinely omit and check each one is in there:
freight both ways, payment gateway fees, units scrapped, warranty jobs serviced
for free, and the founder's own time at a realistic rate.

## Step 3 — Costing at volume

| Volume | Cost per unit | Price | Margin | What changes at this level |
|--------|---------------|-------|--------|----------------------------|
| Sample / 1
| 100
| 1,000
| 5,000
| 10,000

Say explicitly what changes at each band: bulk material pricing, a second shift,
a different freight mode, a vendor minimum, a machine that becomes worth buying.

If a buyer asks for a quote at 5,000 units and it gets calculated in the meeting,
it will be wrong. This table exists so it is not.

Where the bands are unknown, say what quotes are needed and from whom.

## Step 4 — Customer acquisition

- Total sales and marketing spend in a defined period
- Customers acquired in that period
- CAC = the first divided by the second
- Gross margin per customer
- Payback period — how many purchases before CAC is repaid
- Repeat rate, LTV, LTV : CAC

IF CAC IS UNKNOWN, say so as the single most urgent gap in this file. It cannot
be reconstructed retrospectively — it requires 30 days of tracked spend against
tracked signups, starting now. Give the founder the specific tracking setup.

Interpret the ratio with appropriate caution: under 1:1 loses money on every
customer; around 3:1 is often considered healthy; far above 3:1 frequently means
underspending on growth. These are orientation, not law, and payback period
matters as much as the ratio.

## Step 5 — Working capital

This is the question that catches out companies that are selling well.

- Biggest realistic single order
- Cash required to fulfil it — materials, labour, freight, paid BEFORE payment
  is received
- When suppliers get paid vs when the customer pays
- The gap, in days
- Cash currently available

Then state plainly whether the company could actually deliver its biggest
realistic order today. If not, say how much short it is and list the routes
through: deposit or advance, milestone billing, purchase-order financing,
negotiated supplier credit, or declining the order and saying why.

The largest order you can win is not the largest order you can afford. An order
that doubles revenue can be the thing that kills a company that pays on day 1
and gets paid on day 90.

## Step 6 — Burn and runway

Monthly overheads, line by line, INCLUDING founder compensation at a realistic
rate even if it is not currently being taken. A business that only works because
the founder is unpaid is not yet a business, and hiding that makes the
arithmetic worse.

  Cash in bank
  + confirmed receivables within 60 days
  ÷ net WEEKLY burn (net monthly burn ÷ 4.33)
  = RUNWAY IN WEEKS

(If you divide by monthly burn you get runway in MONTHS — do not then label it
weeks. Weeks is the more useful unit at this stage; make sure the divisor and the
label agree.)

## Step 7 — The decision points

Ask me, do not invent:

- What has to be true by what date for this to keep going?
- At what runway level does the plan change?
- What are the real options at that point?

Then write the table:

| If by this date | We have not reached | Then we will |

Name the options explicitly rather than avoiding them: cut overheads, raise on
worse terms, take on services work to extend runway, sell, merge, return to
salaried work and run this alongside, or stop.

Every founder eventually faces a hard decision. The ones who handle it well
decided the trigger in advance. Failure teaches a great deal; going broke
without a plan does not. This is not pessimism — it is what keeps the decision
theirs.

## Step 8 — Sanity-check the projections

If projections exist, check each and report failures:

- Does the unit volume fit the capacity ceiling in 06-operations?
- Does customer growth fit the CAC and the marketing budget?
- Does revenue reconcile with the SOM in 03-market?
- Does headcount cost match the team plan in 01-company?
- Is the growth curve explainable, or is it a smooth line nobody can justify?

An investor will not check the arithmetic. They will check whether the growth is
possible given capacity and CAC.

## Output

Update stack/07-money/money.md. Update front matter and the INDEX row. Flag any
number that changed a figure elsewhere in the stack.

Finish with:
1. The single most urgent thing to measure, and how to start on Monday
2. Whether this business, as costed, works at all — and if the margins do not
   support the current overhead, say so plainly rather than diplomatically
```

---

## Notes

**Step 1 before Step 2 is deliberate.** Knowing which numbers you do not have is the finding. A model that goes straight to a complete P&L has invented the inputs.

**Step 5 is the one nobody expects.** Profitable, growing companies fail on working capital. If your biggest order would break you, that is worth knowing before you win it.

**Step 8's last line matters.** Sometimes the honest answer is that the margins do not cover the overheads at any realistic volume. Better to hear it from a spreadsheet than from the bank.
