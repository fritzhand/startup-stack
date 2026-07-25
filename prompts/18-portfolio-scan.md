# Prompt 18 — Portfolio scan

Every company's record read at once → what is going wrong often enough to teach, who needs attention, and what actually moved.

**Monthly.** Half an hour. It is the only cohort-level signal a programme gets for free, and it is the one most often replaced by asking coaches how their companies are doing.

**Requires:** `portfolio/INDEX.md` with rows in it, and at least three companies whose `record.md` is filled in. Two companies cannot produce a pattern.

---

```
Read AGENTS.md first, then portfolio/README.md and portfolio/rubric.md.

You are scanning the whole portfolio for what repeats. Output is themes.md and
two tables in portfolio/INDEX.md.

## Step 0 — Check the ground

Read portfolio/INDEX.md and count the companies whose record.md exists and is
past [TBD]. If there are fewer than three, say so and stop — with two companies
there is nothing to find that a conversation would not find faster.

Ask me for the period if I have not given you one. Default to the last calendar
month.

## Step 1 — Read

Every record.md, and the "advice given" section of every session in the period.

Do not read anything in reads/. Aggregating attributed judgements across
companies produces a portfolio-level opinion about people that no one author
holds and no one can be asked about. Individual reads are for the coach meeting
that founder next, and that is prompt 17's job.

## Step 2 — The level matrix

Fill the levels table in portfolio/INDEX.md — one column per company, one row per
function, and the median across the row.

Use the level recorded in each record.md. Do not re-score anything here; you
have not read the evidence, and a scan that quietly re-scores is how a rubric
stops meaning anything.

## Step 3 — Patterns

A pattern needs three companies. Two is a coincidence.

For each, write the underlying gap rather than the symptom. "Nobody can answer
pricing questions" is a symptom. "Six companies have a cost per unit built from
estimates rather than invoices" is the gap, and it names the workshop.

If there are no patterns this month, say so. Do not assemble three unrelated
companies into a theme because the table looks bad empty.

## Step 4 — Advice given more than five times

From the sessions in the period. Anything a coach has now said to five different
founders belongs in writing rather than in a sixth session — name where it should
live instead.

## Step 5 — At risk

Only from what is observable in the record:

  gone quiet        no session and nothing sent in 60 days
  stalled           no level movement in two quarters on the named focus
  contradiction     two coaches gave advice that cannot both be followed
  reversed          a level went down
  exposed           a raise, large order, regulatory step or hire imminent,
                    with the relevant function at 1 or 2

Each row gets what it needs and who should do it. A flag with no owner is a
worry, not an action.

## Step 6 — What moved

Levels that went up in the period, and what caused each. The cause column is the
point: if several companies moved the same way for the same reason, that is
something the programme did that works.

## Step 7 — What to run next

Two or three, not ten. For each: the topic, why now, who it is for, and whether
it is a workshop, a clinic or something that should simply be written down once
and sent.

## Step 8 — The health of the record itself

Fill the health table in portfolio/INDEX.md — records not updated in 30 days,
companies with no session in 60, records with no named owner, founders who have
sent nothing.

Say plainly if the record is too thin for this scan to mean much. That finding
is more useful than the scan.

## Output

Write portfolio/themes.md for this period, and update both tables in
portfolio/INDEX.md.

Past months in themes.md are append-only. Add this month's row to the archive
table; never edit or consolidate an earlier month.
```

---

## Notes

**It reads records, never reads.** Step 1 is a hard boundary, not a performance choice. A judgement is worth something to the next coach who meets that founder and worth nothing averaged across ten companies — and the averaged version is what quietly turns into a programme's shared opinion about someone nobody can be asked to defend.

**The patterns are the deliverable, and three is the floor.** A programme that finds a theme in every pair of companies will schedule twelve workshops a year and run none of them well.

**Step 4 is the cheapest thing in this file.** Advice repeated five times is a document you have not written yet. Writing it once buys back an hour of specialist time every month, indefinitely.

**Step 6 is the half that gets skipped.** Programmes reliably record what is wrong and rarely record what moved, which leaves them unable to answer the one question a funder actually asks — and unable to tell which of their own interventions worked.

**If the scan is thin, do not fix the scan.** It is measuring the record, and the record is fixed by running [`16`](16-session-to-record.md) after every session.
