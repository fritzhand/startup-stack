# Prompt 02 — Gap scan

What is missing, unverified, stale or contradictory — ranked by how much damage it will do.

Run after bootstrapping, then quarterly. It is the honest health check on the stack itself, and it converts vague founder anxiety into a task list.

**Requires:** a stack with something in it. A partly filled one is exactly what this is for.

---

```
Read AGENTS.md first.

You are auditing this startup knowledge base for completeness and reliability.
You are not filling anything in. You are only reporting.

## Step 0 — Check the ground

If stack/INDEX.md is missing, or all ten sections are still status: tbd, stop.
The finding would be "everything is missing", which I already know and which no
report improves. 00-bootstrap-the-stack.md comes first.

Anything past that is fair game. A half-filled stack is what this prompt is for.

## Step 1 — Count

Read stack/INDEX.md and every section file. Report:

- Sections by status: source-of-truth / needs-verification / draft / tbd
- Sections by confidence: high / medium / low
- Files not reviewed in 90+ days
- Files with no named owner
- Total [TBD] markers, by section
- Total [CONFLICT] markers
- Facts with no citation

## Step 2 — The critical gaps

Some blanks matter far more than others. Check these specifically and report
which are missing:

CANNOT OPERATE WITHOUT
- Cost per unit (07-money)
- Price per unit (04-product / 07-money)
- Gross margin (07-money)
- Monthly burn (07-money)
- Runway in weeks (07-money)
- Capacity ceiling (06-operations)

CANNOT SELL WITHOUT
- A customer described as a person, not a segment (02-customer)
- Number of customer conversations actually held (02-customer)
- What customers use today instead (02-customer)
- Prospect list size per channel (05-gtm)
- Cost to acquire a customer (07-money)
- A trade sheet or order form, if selling through a channel (05-gtm)

CANNOT RAISE WITHOUT
- Entity type, and whether it suits the raise (01-company)
- Cap table, complete (01-company)
- Every equity promise in writing (01-company)
- Bottom-up market sizing with visible arithmetic (03-market)
- A competitive grid with more than three entries (03-market)
- Staged funding roadmap tied to milestones (08-capital)
- A named exit path (08-capital)

WILL HURT LATER
- Trademark and domain position (09-brand)
- IP ownership — do you own what an agency or freelancer built? (04-product)
- Quality control checkpoints (06-operations)
- Second source for any single-supplier input (06-operations)
- Human-in-the-loop, if the product outputs consequential recommendations
  (04-product)
- Compliance calendar (01-company)
- Where customer feedback is recorded (02-customer / 10-pulse)

## Step 3 — Rank them

Produce a ranked list. For each gap:

| Rank | Gap | Section | Why it hurts | How to close it | Effort |

Rank by DAMAGE IF LEFT OPEN, not by ease of closing. Something that will cost
them a funding round outranks something that is merely untidy.

"How to close it" must be an action, not a restatement. Not "determine CAC" but
"track total marketing spend and signups daily for 30 days; CAC is not
retrospectively recoverable, so start Monday."

## Step 4 — Consistency check

- Do headline numbers agree across CONTEXT.md, every section, and any deck in
  _inbox/? List every discrepancy.
- Does the revenue projection fit the capacity ceiling?
- Does the customer growth fit the CAC and the marketing budget?
- Does the SOM reconcile with the projections?
- Does the team plan cost match the burn?

## Step 5 — The honest read

Three or four paragraphs, written as a coach who has read the whole stack:

- What is genuinely strong here
- What is being avoided — the question this founder has not asked themselves
- The single most important thing to fix in the next 30 days, and why
- Anything in this stack you would not believe if you were an investor

Be direct. Vague encouragement is worse than useless.

## Step 6 — Update the index

Fill in the "Status of the base" table and the "Biggest open gaps" list in
stack/INDEX.md. Change nothing else.
```

---

## Reading the result

**The ranked list is your roadmap.** Work down it. Do not work across the stack evenly — the top three gaps matter more than the remaining thirty combined.

**Step 5 is the one to sit with.** "What is being avoided" is where a good scan earns its keep, and it is usually correct in a way that is annoying.

**Expect this to be uncomfortable the first time.** A first scan on a real company typically finds no CAC, no unit economics, a competitor grid with two names, and at least one equity promise nobody wrote down. That is normal. It is also exactly why running it is worth an hour.
