# Prompt 16 — Session to record

One coaching session in → the factual record, your attributed read, and the updated company record out.

**Run after every session, while you still remember what you thought.** Ten minutes. This is the prompt the whole [portfolio layer](../docs/for-portfolios.md) rests on — everything the programme knows is downstream of this one artifact.

**Requires:** a transcript or your own notes, and a company folder in `portfolio/`. If there is no folder yet, copy `portfolio/_company-template/` first.

**This is the coach's prompt.** A founder writing up their own meeting wants [`14-meeting-to-actions.md`](14-meeting-to-actions.md) instead.

---

```
Read AGENTS.md first, then portfolio/README.md and this company's record.md.

You are turning one coaching session into two files and a set of record updates.
I am the coach who ran it.

## Step 0 — Check the ground

I must give you two things: a transcript or my notes, and a company slug that
exists in portfolio/. If either is missing, ask for it and stop.

If portfolio/<slug>/record.md does not exist, say so and offer to create the
folder from portfolio/_company-template/ before going further.

## Step 1 — The basics

From the transcript, or by asking me: the date, who was there and in what role,
how long it ran, and what the session was for.

## Step 2 — The record, facts only

Write the factual half into the shape of
portfolio/_company-template/sessions/_template.md: what was discussed,
decisions, new information, advice given, commitments, open questions, anything
that needs to be in writing.

Every commitment gets an owner and a date. Not "soon" — a date. If a date was
not agreed, propose one and mark it proposed. Include commitments the programme
made, not only the founder's.

Two rules specific to this file:

- Nothing here describes how the founder is doing. If a sentence is about them
  rather than about what happened, it belongs in Step 4 — including the softened
  kind. "The founder seemed unsure about the costing" is an assessment wearing a
  fact's clothes. "The founder could not say what the unit cost was" is a fact.
  The exception is a judgement the coach said out loud: the founder heard it, so
  recording it is what makes the next session continuous. Said in the room goes
  in the record, attributed to whoever said it. Thought and not said goes in
  Step 4.
- Record the advice specifically, and who gave it. The next coach reads this
  line to avoid contradicting it, which is the most common failure in a
  multi-coach programme.

Cite as (src: session YYYY-MM-DD).

## Step 3 — Ask me for my read

Ask me these four, and wait. Do not answer them from the transcript.

1. How are they doing?
2. How did the advice land — pushed back, agreed and meant it, agreed and
   clearly did not, already knew it?
3. Anything you would not put in the record?
4. What should the next coach know before walking in?

If I have already said some of it, play it back in my words and ask only for
what is missing.

You may organise, tighten and quote what I tell you. You may not add a judgement
I did not make, and you may not infer one from the transcript. A read I did not
give you is worth nothing, and it follows this founder around the programme for
years.

## Step 4 — The read

Write my answers into the shape of
portfolio/_company-template/reads/_template.md. Front matter audience:
coach-team. Every judgement tagged [ASSESSMENT — my name, today's date].

Where the transcript supports what I said, quote the line. Where it does not,
say so plainly — that is information for me, not a criticism of me.

## Step 5 — Update the record

In portfolio/<slug>/record.md:

- close out commitments that were met; carry forward the rest, with the reason
  if one was given
- add this session's commitments
- add a row to "Who has met them"
- update focus, next milestone and what is in the way, if this session changed
  them
- update the summary: line, and the matching row in portfolio/INDEX.md

Levels: propose a change only where this session produced evidence for one, and
name the rubric line the evidence meets. Do not re-score the table from a single
session — that is a quarterly job, and a level that moves fortnightly is
measuring my mood.

## Step 6 — What the founder gets

Show me the session record as it will be sent, and wait for my yes.

Then check it before it goes: nothing tagged [ASSESSMENT], nothing carried over
from Step 4, no sentence about how the founder is doing. Tell me what you
checked and what, if anything, you moved.

## Output

  portfolio/<slug>/sessions/YYYY-MM-DD-<my surname>.md   the record
  portfolio/<slug>/reads/YYYY-MM-DD-<my surname>.md      the read
  portfolio/<slug>/record.md                             updated
  portfolio/INDEX.md                                     row updated

On my yes, copy the session record — that file only, ever — into the shared
folder at <company-slug>/from-programme/.

Leave the transcript where it is. It is evidence and nothing writes to it.
```

---

## Notes

**Do it while it is warm.** The factual half survives a week; your read does not. What the founder said is in the transcript, and what you thought while they said it is only in your head, for about a day.

**The read is the part that matters, and it is the part you have to write.** An AI can produce a competent summary of a transcript on its own. It cannot tell whether a founder agreed because they were convinced or because the session was nearly over — and a system that lets it guess produces confident, plausible, unattributable judgements about real people. Step 3 exists to stop that, which is why it asks and waits rather than proposing.

**Send the record the same day.** A record that arrives a week later is a document. One that arrives the same afternoon is a commitment the founder is still close enough to the conversation to correct — and a record they corrected is a record they agree with.

**Two coaches may disagree, and both reads stand.** Attributed, dated, side by side. That is not a `[CONFLICT]` — a conflict is two sources disagreeing about a checkable fact. This is two people reading the same founder differently, which is worth knowing.

**Before the first note exists,** decide who owns the record, how long reads are kept and what happens when a company leaves. [`docs/safety.md`](../docs/safety.md) has the section on writing about a named person; it is a ten-minute conversation now and an unpleasant afternoon later.
