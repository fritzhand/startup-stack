# Prompt 10 — Pitch deck

Slide-by-slide content in the order investors expect, drawn only from what is in the stack, with every gap marked rather than filled.

**Run [`13-mentor-review.md`](13-mentor-review.md) first and fix what it finds.** A deck built on an uncorrected stack is a very fast way to produce a very confident wrong document.

**Requires:** a stack whose headline sections hold real content — `02-customer`, `03-market`, `04-product`, `07-money`, `08-capital`.

---

```
Read AGENTS.md first, then stack/INDEX.md, stack/CONTEXT.md, and sections
01-company, 02-customer, 03-market, 04-product, 05-gtm, 07-money, 08-capital and
09-brand.

## Step 0 — Check the ground

If stack/INDEX.md is missing, or the sections above are all still status: tbd,
stop. There is nothing to build a deck from, and what you would produce is a
well-formatted invention — the exact artifact AGENTS.md ends by warning about.
00-bootstrap-the-stack.md comes first.

Otherwise, before writing a single slide, report:

- Which sections are still status: tbd or needs-verification?
- Is the market sizing bottom-up with visible arithmetic, or a report headline?
- Are the unit economics sourced?
- Does the competitive grid have more than three entries, including a
  non-obvious one?
- Do the headline numbers agree across CONTEXT.md, every section, and any
  existing deck?

If the deck would be built substantially on unverified content, SAY SO FIRST and
list what to fix. Then ask whether to proceed anyway.

## Step 1 — Confirm the audience

Ask me: who is this for?

  a) An investor — the standard sequence below
  b) A specific programme, grant, competition or accelerator — I will need the
     evaluation criteria; the deck must map to them explicitly
  c) An institutional customer or partner — a different document; see
     worksheets/one-pager.md

For (b), add an explicit ELIGIBILITY AND FIT slide as slide 2, mapping the
application point by point to the programme's stated criteria. It feels
redundant and it is not — a reviewer working through fifty applications against
a rubric will thank you, and yours becomes the easy one to score.

## Step 2 — Write the deck

Seven to twelve core slides, everything else in an appendix. A reviewer gives a
deck sixty seconds on the first pass. If the story is not clear by then, the
depth on slide fourteen never gets read.

Use the sequence investors are used to seeing — most funded decks follow it, and
matching the expected shape removes friction for free.

For EACH slide give me:
- The headline (one line, the takeaway — not a label like "Market")
- The body content, in full
- Which stack section each fact came from
- Any [TBD] that must be filled before this slide can be shown
- What visual belongs here

  1  TITLE — company, one line, contact. The one line names the customer, the
     problem and the mechanism, with no adjectives.
  2  PROBLEM — for whom, how often, what it costs them. Use the customer's own
     words from 02-customer.
  3  SOLUTION — what was built. Show, do not describe.
  4  WHY NOW — what changed that makes this possible today and not three years
     ago.
  5  MARKET — bottom-up, arithmetic visible, beachhead named.
  6  PRODUCT — how it works. Real screens, real photographs.
  7  BUSINESS MODEL — who pays, how much, unit economics, margin.
  8  TRACTION — numbers, however small, honestly labelled. Include the
     credibility markers: years of work, conversations held, partners, pilots,
     filings, named advisors. Concrete counts, not adjectives.
  9  COMPETITION — including the ones you might lose to. A grid with no losses
     is not believed.
  10 TEAM — why these people specifically. Founder-market fit is often the most
     compelling thing on the page.
  11 ASK — amount, instrument, use of funds broken down, the milestone it
     unlocks, and the exit path.

APPENDIX: detailed financials, full competitive grid, technical architecture,
research depth, pilot plan, regulatory position, references, letters of intent.

## Step 3 — Rules while writing

- NOTHING that is not in the stack. If a slide needs a number that does not
  exist, write [TBD — needed for slide N: <what, and where to get it>]. Do not
  produce a plausible figure to complete the story.
- Every number carries its source in a note for the founder — not on the slide,
  but so they know where each came from when challenged.
- Every number must MATCH the rest of the stack. Flag any that would create a
  discrepancy with the website, the plan or a previous deck.
- Stage described honestly. "Prototype, in pilot with two customers" is a fine
  thing to be. Describing a prototype as a platform gets discovered in the
  second meeting and costs the third.
- No marketing language, no emoji, no "revolutionary," no "disrupting."
- Text that fits comfortably at a readable size. Dense slides read on a phone or
  across a room do not communicate — this is the most common fixable problem in
  early decks.

## Step 4 — The questions this deck invites

For each slide, name the question a sharp reader will ask, and whether the stack
can answer it. Two the founder must be ready for on the ask slide:

  "Why haven't you grown more with the traction you already have?"
  "Exactly how does this money change the trajectory?"

And on the exit: who realistically buys this company, or how else does an
investor get their money back? If the honest answer is that this is a
cash-flow business rather than an exit-driven one, say so — that is legitimate,
and it is a reason some investors will correctly pass.

## Step 5 — Design notes

Pull from stack/09-brand/brand.md: fonts, colours, logo, layout rules. If it is
incomplete, say what is missing.

Note that site2deck (github.com/fritzhand/site2deck) can sample the brand from
the company's live website and turn this content into a branded, offline,
single-file HTML deck that opens from file:// and prints to PDF.

Flag: no generic AI-generated hero images. Reviewers see hundreds. Real product,
real screens, real photographs of the work being done.

## Output

Write the deck content to a new file. Do not modify stack sections.

Finish with:
1. Every [TBD] blocking the deck, ranked
2. The weakest slide and why
3. Whether this deck is ready to send, and if not, what has to happen first
```

---

## Notes

**Step 0 exists because founders skip it.** The temptation to build the deck before the stack is corrected is strong, and it produces a document that is internally consistent and externally wrong.

**Read teardowns of funded decks in your sector.** They are widely published. An hour on them is worth more than a week of redesigning your own.

**Readability is the single most common fixable problem.** Text sized to fit everything the founder wants to say, read on a phone by someone giving it thirty seconds. Cut the content, not the type size.
