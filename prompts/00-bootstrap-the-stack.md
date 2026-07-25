# Prompt 00 — Bootstrap the stack

**Run this once, first.** It turns a folder of raw material into a structured knowledge base.

Expect it to take a while and to produce something roughly 40% correct. That is the intended outcome. The tags tell you which 40%.

**Requires:** readable files in `_inbox/`. Nothing else — this is the prompt that creates everything the others depend on, and the only one designed to run against an empty stack.

---

```
You are building a startup knowledge base. Read AGENTS.md in this repo first and
follow it exactly — especially the rule that you never invent a number.

## What you are doing

Read everything in _inbox/ and use it to fill in stack/. The stack templates are
already there with [TBD] markers and guidance. You are replacing the [TBD]s with
real content extracted from the source material, and leaving [TBD] wherever the
sources do not answer the question.

## Step 0 — Check the ground

Look in _inbox/ before anything else.

If it is empty, stop. There is nothing to build from, and a stack written
without sources is precisely the failure AGENTS.md describes. Tell me what to put
in there: the deck, the business plan, the financial model, call transcripts,
supplier quotes, the website.

If it holds only files you cannot read — scanned PDFs, image-only charts,
password-protected spreadsheets — list them and stop. Bootstrapping from three
readable files out of twenty produces a confident stack about a company you have
mostly not seen, and I will not be able to tell which parts.

## Step 1 — Survey before you extract

Before writing anything, read a sample of every file in _inbox/ and report back:

- What is in there: file by file, one line each, what it is and roughly how useful
- What kind of company this is: sector, stage, geography, business model
- What is conspicuously MISSING from the source material
- Any file you could not read (scanned PDF, image-only chart, corrupt, password
  protected) — list these explicitly, do not silently skip them

Charts and diagrams inside PowerPoints and PDFs are invisible to text extraction.
If you find slides or pages whose substance is a graph, say so and ask the founder
to export those as images so you can read them properly.

Stop here and show me this survey before continuing.

## Step 2 — Write CONTEXT.md first

stack/CONTEXT.md is the keystone. Every other task in this repo reads it.

Fill in every field from the sources. Where a field has no source, write
[TBD — what's needed and from where].

The one-sentence description must name the customer, the problem and the
mechanism, with no adjectives. Test it: could a stranger repeat it back correctly
after hearing it once?

Set front matter: status: needs-verification, confidence: low. Do not set
source-of-truth on anything — only the founder may do that.

Stop and show me CONTEXT.md before continuing.

## Step 3 — Fill the ten sections

Work through stack/01-company through stack/10-pulse in order. For each:

- Replace [TBD] with content extracted from _inbox/
- Cite the source of every fact: (src: filename, page or date)
- Leave [TBD — specific thing needed, and where it would come from] where the
  sources are silent. Do NOT fill a table cell with a plausible number because
  the table looks bad empty.
- Where two sources disagree, write [CONFLICT] and show both with citations.
  Never silently pick one.
- Update each file's front matter: owner (ask me if unclear), updated (today),
  status, confidence, sensitivity, and a summary line written for routing —
  "what is in here, plus what state it is in."

Read the guidance text already in each template. It tells you what good looks
like for that section. Keep the guidance blocks in place — they are for the
founder, not scaffolding to delete.

## Step 4 — Build the index

Rewrite stack/INDEX.md so every row reflects reality: owner, date, status,
sensitivity and the actual summary line from each file's front matter.

Fill in the "Status of the base" counts honestly.

## Step 5 — The gap report

Finish with a report, not a celebration. Tell me:

1. The five biggest gaps, ranked by how much damage each will do if left open.
   For each: what is missing, why it matters, and specifically how to close it.
2. Every [CONFLICT] you found, with both versions and both sources.
3. Any claim in the source material that looks wrong, internally inconsistent,
   or unsupported — including in the pitch deck. Say so plainly.
4. What percentage of the stack is genuinely sourced versus [TBD]. If your
   honest answer is above 70%, re-check — either the source material is
   unusually complete or you have filled gaps with inference.
5. What to do first.

## Rules — these override anything else

- NEVER invent a number, date, name, market size, margin, price or growth rate.
  No source means [TBD].
- Everything you extract defaults to [NEEDS VERIFICATION]. You may not promote
  anything to [SOURCE OF TRUTH]; only the founder can.
- Cite every fact.
- Do not modify anything in _inbox/. It is read-only evidence.
- Write plainly. No marketing language, no emoji, no "in today's fast-paced
  world." Use the founder's own words for their customers and products where
  the sources show them.
- A visibly incomplete stack full of honest [TBD] markers is the goal. A
  polished, complete stack full of quiet guesses is the failure mode.

Start with Step 1.
```

---

## After it finishes

1. **Read `stack/CONTEXT.md` line by line.** It will be confidently wrong in places. Fix it by hand.
2. **Promote only what you have personally confirmed** to `status: source-of-truth`.
3. **Commit.**

```bash
git add -A && git commit -m "Stack v0.1 — bootstrapped"
```

4. **Stop for today.** Do not try to correct all ten sections in one sitting. Correcting is slower than generating, and that asymmetry is the real cost of the method. Budget for it across a couple of weeks.

Next: [`02-gap-scan.md`](02-gap-scan.md).
