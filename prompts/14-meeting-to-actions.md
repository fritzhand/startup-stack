# Prompt 14 — Meeting to actions

Transcript in → summary, minutes, owned action items with dates, and stack updates out.

**Run after every meeting that matters.** Ten minutes. It is the habit that turns a knowledge base from a snapshot into a living thing, and it is the single highest-return process in this repo.

**Requires:** a transcript or notes, and nothing else. This is one of the few prompts that works on an empty stack — it is how a stack starts to fill.

---

```
Read AGENTS.md first, then stack/CONTEXT.md.

I am giving you a transcript or notes from a meeting. Produce a structured
record and update the stack.

## Step 0 — Check the ground

If I have not given you a transcript or notes, ask for them and stop. If
CONTEXT.md is still empty, carry on anyway — say so, and write the record
without assuming anything about the company.

## Step 1 — Establish the basics

From the transcript, or by asking me:

- Date, time, duration
- Who was there, and their role relative to this company
- What kind of meeting: customer / supplier / mentor or coach / investor /
  partner / team / regulator
- What it was for

## Step 2 — Summary

Six to ten bullets. What was actually discussed, in plain language. Written so
that someone who was not there understands the substance, not just the topics.

Not "we discussed pricing." Rather: "They pushed back on the ₹450 price point
and said ₹350 would move volume in their store."

## Step 3 — Minutes

Structured, in this order:

  DECISIONS AND AGREEMENTS
  What was actually agreed. Distinguish firmly between a decision and a
  discussion — most meetings produce far fewer decisions than they feel like
  they did.

  NEW INFORMATION
  Facts learned that were not previously in the stack. Prices, names, timelines,
  capacities, competitors, regulations, objections.

  RISKS AND CONCERNS RAISED
  By anyone in the room.

  OPEN QUESTIONS
  What was raised and not resolved.

## Step 4 — Action items

A table. Every item needs an owner and a date. Not "soon," not "next week" — a
date.

| # | Action | Owner | Due | Depends on |

Rules:
- If a date was not agreed in the meeting, propose one and mark it as proposed
- If an owner was not named, mark it [OWNER TBD] and flag it — an action without
  an owner does not happen
- Split anything vague into concrete steps. "Sort out the GST issue" becomes
  three actions with three owners.
- Include actions for the other party too, not just for us

## Step 5 — Extract by meeting type

Only the branch that matches applies. The verbatim instructions are not
stylistic — a paraphrased objection is a lost objection.

CUSTOMER MEETING
- Their pain, in their exact words
- What they use today and what it costs them
- Price mentioned or reacted to
- Objections raised — verbatim
- Did they commit to anything? Money, a trial, a next meeting?
- Referrals offered
→ stack/02-customer/customer.md, plus the objections table

SUPPLIER OR VENDOR MEETING
- Prices quoted, at what volumes
- Lead times, minimum orders, payment terms
- What is committed versus discussed
- Anything promised verbally that needs to be in writing
→ stack/06-operations/operations.md, stack/07-money/money.md

MENTOR OR COACH SESSION
- The advice given, specifically
- What was committed to before the next session
- Any introduction offered, and to whom
- What the founder was told they were getting wrong
→ relevant sections, plus commitments into stack/10-pulse/pulse.md

INVESTOR MEETING
- Questions asked — especially the ones with no good answer
- Concerns raised
- Next step and by when
- If they passed: the stated reason, and your read on the real one
→ stack/08-capital/capital.md history table

PARTNER OR CHANNEL MEETING
- Terms discussed: margin, volume, exclusivity, territory
- What they need from us before they can proceed
- Anything requiring a written agreement
→ stack/05-gtm/gtm.md, and flag if a scope letter is needed

## Step 6 — Update the stack

Write the new information into the right sections, citing each as
(src: meeting with X, YYYY-MM-DD). Where it contradicts what is already there,
mark [CONFLICT] and show both — never silently overwrite.

Tell me exactly which files you changed and what you added.

## Step 7 — Anything that needs paper

Flag explicitly if the meeting produced anything that should be in writing and
is not:

- An equity or commission promise → worksheets/advisor-scope.md
- A supplier commitment on price, volume or exclusivity
- A maintenance or support promise from a vendor
- A partnership term
- A customer commitment worth holding someone to

A verbal agreement is a future dispute with a good mood attached. Say so.

## Step 8 — The follow-up

Draft the follow-up message to send to the other party: thanks, the agreed
actions with owners and dates, the next step. Short. Send it within 24 hours —
it confirms the record while everyone still remembers, and it makes the
commitments real.

## Output

Save the record to stack/10-pulse/meetings/ as YYYY-MM-DD-meeting-<who>.md
(create the folder if it does not exist). Leave the original transcript in
_inbox/ untouched — _inbox/ is read-only evidence and nothing writes to it.
Then apply the stack updates.
```

---

## Notes

**Record your meetings.** With consent, obviously. A transcript in `_inbox/` is worth ten remembered summaries, and it is what lets an AI find the pattern across twenty conversations that you could not hold in your head.

**Ten minutes after a call, every time.** This is the habit. It does three things at once: makes advice durable rather than half-remembered, creates a shared record of what was agreed, and means the next session opens on "you committed to visiting 100 canteens — how many?" rather than "remind me where we got to."

**Step 7 catches the expensive ones.** Most equity disputes, supplier arguments and partnership breakdowns start as a warm conversation nobody wrote down.

**For coaches:** run this after every session and send the founder the record. It costs you ten minutes and roughly doubles the durable value of the hour you just spent.
