# Prompt 01 — Refresh the stack

Folds new material into an existing stack **without flattening the corrections you have made by hand.**

Run monthly, or after anything significant: a batch of customer calls, a new financial model, a pivot, a supplier change, a round of interviews.

**Requires:** a bootstrapped stack, and something in `_inbox/` that was not there last time.

---

```
Read AGENTS.md first.

You are updating an existing startup knowledge base with new material. The
critical constraint: THE FOUNDER HAS CORRECTED PARTS OF THIS STACK BY HAND. Your
job is to add, not to overwrite.

## Step 0 — Check the ground

Two things must hold. If either does not, name it and stop.

- stack/INDEX.md exists and its sections hold real content. If all ten are still
  status: tbd, there is nothing to refresh — 00-bootstrap-the-stack.md is the
  prompt that runs first.
- _inbox/ holds something added since the "Last full review" date in INDEX.md.
  If it does not, say so and stop rather than re-reading what has already been
  folded in. A refresh with no new material touches corrected files for no
  reason, which is the one thing this prompt exists to avoid.

## Step 1 — Find what is new

- List everything in _inbox/ added or modified since the date in stack/INDEX.md
  "Last full review"
- If that date is missing or you cannot tell, ask me which files are new
- Summarise each new file in one line

Show me this list and wait.

## Step 2 — Route it

For each new file, say which stack sections it affects, and whether it:

  ADDS      — new information, no conflict with what is there
  CONFIRMS  — corroborates something currently needs-verification
  CONFLICTS — disagrees with something already in the stack
  SUPERSEDES— an updated version of something already recorded

Show me this routing table and wait for approval before writing.

## Step 3 — Apply, carefully

Rules, in priority order:

1. NEVER overwrite anything marked [SOURCE OF TRUTH] or status:
   source-of-truth. If new material contradicts a founder-confirmed fact, do
   NOT change it. Flag it prominently:
   [CONFLICT — <new source> says X, but this is marked source-of-truth as Y.
   Founder decision needed.]

2. For CONFIRMS: leave the fact but note the corroboration. Then ask me whether
   to promote it to source-of-truth. Do not promote it yourself.

3. For SUPERSEDES: add the new version, keep the old one with its date, and mark
   which is current. History matters — a price that changed tells you something.

4. For ADDS: write it in with a citation, tagged [NEEDS VERIFICATION].

5. For CONFLICTS with unverified content: show both, cite both, flag it. Do not
   pick.

## Step 4 — Check for drift

Now scan the whole stack for internal inconsistency, whether or not it came from
the new material:

- Do headline numbers agree across every section? (Customer count, revenue,
  units, funds raised, team size, market size.) These drift silently and get
  caught by an investor doing arithmetic.
- Does the projection in 07-money still fit the capacity ceiling in
  06-operations and the CAC in 05-gtm?
- Does CONTEXT.md still describe the company accurately, or has the business
  moved since it was written?
- Any section not reviewed in over 90 days? List them.

## Step 5 — Update front matter and index

Every file you touched: updated date, re-check status and confidence, rewrite
summary if the substance changed. Then update the matching row in INDEX.md and
the "Status of the base" counts.

## Step 6 — Report

- What changed, by section
- Every conflict needing a founder decision, most important first
- Anything that has drifted or gone stale
- What the new material means: has anything you learned this month changed the
  picture? Say so plainly, even if it is unwelcome.

Start with Step 1.
```

---

## Notes

**Approve the routing table before it writes.** This is the step that protects your corrections. Ten seconds of reading here saves an hour of recovering hand-written content.

**Conflicts with `source-of-truth` are yours to resolve.** The AI is correctly forbidden from touching them. Usually the new source is right and your confirmation is stale — but sometimes the new source is a badly transcribed call, and only you know that.

**Commit first.**

```bash
git add -A && git commit -m "before refresh"
```
