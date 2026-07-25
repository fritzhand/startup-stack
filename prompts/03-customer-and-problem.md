# Prompt 03 — Customer and problem

Sharpens who the customer is, what job they are hiring you for, and what they do today instead. Extracts the pattern across every interview you have logged, and writes the guide for the next ten.

Run early. Almost every downstream problem — positioning, channel choice, pricing — is a customer-definition problem wearing a costume.

**Requires:** either `02-customer` past `tbd`, or interview material in `_inbox/` — or, at the very least, your own answer given in the session. It sharpens a customer definition; it cannot invent one.

---

```
Read AGENTS.md first, then stack/CONTEXT.md and stack/02-customer/customer.md.
Also read any interview notes, call transcripts, support threads or customer
emails in _inbox/.

## Step 0 — Check the ground

Check stack/02-customer/customer.md, and check _inbox/ for interview notes,
transcripts or customer threads.

If both are empty, do not infer a customer from the product description — that
is how a company ends up selling to the buyer its own deck invented. Ask me to
describe the customer in my own words, and use that as the starting material,
tagged as the founder's belief rather than as evidence. If I will not answer,
stop.

## Step 1 — Count the evidence

Before anything else, tell me:

- How many actual conversations with actual potential customers are recorded
  anywhere in this stack or in _inbox/?
- How many were recorded or transcribed versus remembered?
- How many are with people who have PAID versus people who said they would?

Then tell me honestly what the current customer definition rests on: evidence,
or the founder thinking hard. Both are legitimate at different stages. Only one
can be tagged source-of-truth.

## Step 2 — The customer as a person

Rewrite the customer description as a person in a situation, not a segment.

  Not: "urban millennials interested in wellness"
  But: "a 32-year-old consultant in a large city who works late, has been told
       by a doctor to fix her gut health, has tried three supplements, and
       doesn't have a routine she can keep"

If the sources support more than one customer type, write each separately and
ask me which is primary. Do not merge them into a composite — a composite
customer is one nobody recognises.

For B2B, split into user / buyer / blocker. Deals stall because a founder
pitched to one and needed three.

## Step 3 — The job to be done

Complete this sentence from the evidence:

  "When [context], [customer] needs to [job] so they can [outcome]."

If the sources do not support it, say so and tell me what question to ask on the
next three calls to complete it.

## Step 4 — What they do today

Every customer already solves this somehow. From the evidence, fill in:

| Current alternative | What it costs them | Why they stick with it |

Include "doing nothing" as a row — it is usually the largest competitor and it
is almost never on a competition slide.

Then answer: is this a painkiller or a vitamin? How often does the pain recur?
What actually happens if it is never solved? Be honest — a mild annoyance
recurring daily can be a great business, and a severe problem occurring once a
year is a hard one. Say which this is.

## Step 5 — The pattern across interviews

If there are three or more interviews, extract:

- The top five pains, ranked by how many people raised them unprompted, with a
  verbatim quote for each
- Pains the founder expected that nobody mentioned
- Pains nobody expected that keep coming up
- Language patterns: the actual words customers use for the problem, the
  product and the category. These belong in the website copy, the ads and the
  deck — they are always better than the founder's words.
- Where interviews contradict each other, and what would resolve it

If there are fewer than three interviews, say clearly that no pattern can be
extracted and that this is the most urgent gap in the stack.

## Step 6 — Willingness to pay

From the evidence only:

- What do they currently pay for the alternative?
- Who holds the budget?
- What price has actually been tested?
- Has anyone paid? How many, how much, when?

Distinguish sharply between money that moved and someone saying they would buy
it. Stated willingness to pay is close to worthless — people are being polite to
a founder standing in front of them.

## Step 7 — The ICP

Write the targeting filter: segment, geography, size or income band, the trigger
that makes them start looking, where they can be reached, and — importantly —
the disqualifiers. Who should you say no to?

Then estimate how many match this profile in the beachhead geography, showing
the arithmetic. If you cannot, say what count would be needed and where to get it.

## Step 8 — Objections

Compile every objection appearing anywhere in the sources: what it was, how many
times, and the best response so far. Flag any objection appearing three or more
times — that is a positioning problem, discovered for free.

## Step 9 — The next ten interviews

Produce:
- A ranked list of the five things that most need to be learned next
- An interview guide of 8–12 questions to learn them, ordered context → problem
  → money, all asking about past behaviour rather than future intention
- Who specifically to interview and where to find them
- What result would change the plan

## Output

Update stack/02-customer/customer.md. Update front matter and the INDEX row.
Leave [TBD] wherever the evidence does not reach — do not fill gaps with
plausible-sounding customer psychology.

Finish by telling me the one thing about this customer the founder appears to
believe without evidence.
```

---

## Notes

**Step 1 is the whole prompt in miniature.** If the answer is "two conversations, both remembered," everything else in this file is speculation and the honest output is an interview plan.

**Step 5's language extraction is quietly the highest-value part.** Founders write their copy in founder language. Customers use different words. Copying the customer's words into your website usually outperforms anything you would have written.

Log interviews with [`worksheets/customer-interview.md`](../worksheets/customer-interview.md).
