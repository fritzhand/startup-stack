# Prompt 12 — The weekly recap

**The pulse.** Thirty minutes, every week, forever.

The only part of this system that compounds. Run it in week one, before anything impressive has happened — the discipline is what you are building, not the report.

**Requires:** `stack/10-pulse/pulse.md` with its metrics defined. Nothing else — this prompt is meant to run on a thin stack, and the first recap has no previous one to read.

---

```
Read AGENTS.md first, then stack/CONTEXT.md, stack/10-pulse/pulse.md and the
most recent file in stack/10-pulse/recaps/.

You are producing this week's recap. Fixed shape, one page, thirty minutes.

## Step 0 — Check the ground

If pulse.md has no metrics defined yet, stop and ask me to name three to six
first — a recap without metrics is a diary entry. An empty recaps/ folder is
fine and means this is the first one; say so and carry on.

## Step 1 — Set up

- What is the week ending date?
- If this is the first recap, help me define the 3-6 metrics first, using the
  rules and the starter table in stack/10-pulse/pulse.md. Every metric must fall
  out of records already kept — if gathering it needs special effort each week,
  it is the wrong metric and it will be abandoned by week four.
- Otherwise: pull last week's values and the open commitments from pulse.md and
  the last recap.

## Step 2 — Ask me for this week

Ask, and wait. Do not proceed on assumptions.

1. This week's value for each metric
2. Cash in bank
3. What actually happened — shipped, signed, launched, hired, fixed
4. Which of last week's commitments did NOT get done, and why
5. What did you learn? Objections heard, prices rejected, a channel that
   produced nothing, a competitor's move, why a deal died
6. What are you committing to next week?
7. What do you need help with?

If I give a vague answer to 3 or 6, push back once and ask for the number.

## Step 3 — Write the recap

Use worksheets/weekly-recap.md. Six sections, in order:

1. THE NUMBERS — table with this week, last week, delta. Runway in weeks always
   included.
2. WHAT MOVED — concrete and countable. "Website went live," not "made progress
   on the website."
3. WHAT DID NOT MOVE — last week's open commitments with honest reasons. If
   something has been here three weeks running, SAY SO explicitly: that is not
   a scheduling problem.
4. WHAT WE LEARNED — including an objections table. Flag any objection heard
   for the third time; that is a positioning problem surfacing.
5. NEXT WEEK — 3-5 commitments, EACH WITH A NUMBER. If I give you a commitment
   without a number, propose one and ask me to confirm.
     not "push on sales" but "visit 25 stores, place stock in at least 4"
     not "work on fundraising" but "add 40 investors to the CRM, send 20 requests"
   A commitment without a number cannot be graded, so it is always half-done and
   never failed.
6. WHERE I NEED HELP — specific and askable.

## Step 4 — Read the trend

Look across the last 4-6 recaps and tell me plainly:

- Which metrics are trending up, flat, down
- What has been committed to more than twice and not done
- Which objection keeps recurring
- Whether the runway trajectory is improving or worsening
- Anything that looks like a pattern rather than a bad week

BE HONEST ABOUT BAD WEEKS. The pattern that kills companies is not a bad month —
it is four bad months each narrated as "building momentum," so that nobody,
including the founder, notices in time. A recap saying "three of five metrics
went sideways and I don't yet know why" is doing its job.

Do not find something positive to say for the sake of it.

## Step 5 — Write back to the stack

- Add this week's row to the history table in stack/10-pulse/pulse.md
- Update current values on each metric
- Rewrite the "commitments carried" table
- Add any new objections to stack/02-customer/customer.md
- Update any other section this week's events changed — a price, a supplier, a
  competitor, a customer count
- Update front matter dates and INDEX rows on anything touched

Doing the recap IS the maintenance. There is no separate chore.

## Step 6 — Save

Write to stack/10-pulse/recaps/YYYY-MM-DD.md, dated to the week ending.

Add the row to the recaps table in pulse.md.

APPEND ONLY. Never edit, correct or consolidate a past recap. If a number in an
earlier recap turns out to have been wrong, note the correction in THIS week's
recap and leave the old one alone. The archive is a record of what was believed
at the time, and that is what makes it useful.

## Step 7 — Carve the shareable version

Ask whether I want a version to send. If yes:

  COACH / MENTOR   — everything, including runway and the bad weeks. Withholding
                     the bad weeks from a coach makes the relationship useless.
  TEAM             — everything except individual compensation
  INVESTORS        — numbers, moved, learned, the ask. Trim internal churn.
                     Monthly, as a roll-up of four recaps.
  PROGRAMME        — for an incubator or accelerator I am a member of. As COACH,
                     plus what I want help with this week and who I need
                     introduced to. Save it into the shared folder they gave me,
                     under from-founder/, as YYYY-MM-DD-recap.md.

Respect the sensitivity rules in AGENTS.md. State what you excluded.
```

---

## The habit

**Same day, same time, every week.** Put it in the calendar. Thirty minutes.

**Send it, unprompted, whether or not the week went well.** This is the single strongest signal a founder can send a coach or mentor — and the reason a good one keeps giving you time. Most mentoring relationships die because the founder shows up excited once and is never heard from again. Execution is the price of access; the recap is the receipt.

**Do not skip the bad weeks.** They are the ones worth writing.

**Do not let it grow.** One page. If it runs to three, it stops being read, including by you. Detail belongs in the stack; the recap points at it.

Full ritual: [docs/weekly-recap.md](../docs/weekly-recap.md).
