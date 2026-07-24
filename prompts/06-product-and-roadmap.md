# Prompt 06 — Product and roadmap

Draws a hard line between what exists and what is a slide, builds a roadmap with dates and definitions of done, and checks the things that surface awkwardly in diligence: IP ownership, vendor dependencies, and whether an automated system is making decisions no human validates.

---

```
Read AGENTS.md first, then stack/CONTEXT.md, stack/02-customer/customer.md and
stack/04-product/product.md. Also read any product material, specs, PRDs or
demos referenced in _inbox/.

## Step 1 — Separate what exists from what is described

Go through everything the sources say about the product and sort it into two
lists:

  EXISTS — a real customer could use this today
  DESCRIBED — spoken about in the future tense, or exists only as a mockup,
              a slide, or an intention

Be strict. A demo that only works with the founder driving it, a screen that is
not connected to anything, an integration that is "planned" — all go in the
second list.

Then check the vocabulary is being used correctly, because using it loosely in a
pitch is a small thing that reads as a large one:

  Prototype           — demonstrates the idea, not for real users
  Proof of concept    — proves the hard technical thing is possible
  MVP                 — smallest thing a real customer gets real value from
  Pilot               — a structured TEST of a PoC or MVP with real users, over
                        a defined period, against defined success criteria.
                        A PILOT IS NOT A PRODUCT.
  Commercial product  — sold, supported, works without the founder in the room

Report any place in the stack or the deck where these are used wrongly.

## Step 2 — Product lines

For each SKU or service: what it is, its status, its price, its cost, its
primary customer. Cost feeds 07-money — if it is unknown, mark it [TBD] and flag
it as urgent.

Then answer: which line actually makes money?

Multi-product early companies almost always have one line quietly funding the
rest. Naming it changes how the founder should spend their time, and it is the
honest answer to "what is the business?"

## Step 3 — The roadmap

Build it as milestones with dates and definitions of done, not a wish list:

| When | What ships | "Done" means | Depends on | Cost |

Horizons: next 30 days, 31–90, 3–6 months, 6–12 months.

Then — and this is the more useful half — write the NOT DOING list. Everything
consciously deferred, so that a good idea in month four gets weighed against a
decision instead of slipped in.

Flag any roadmap item that:
- depends on funding that has not been raised
- depends on a person who has not been hired
- depends on capacity that does not exist (check 06-operations)
- has no clear customer asking for it

## Step 4 — Ownership and dependencies

Ask directly, and do not accept a vague answer:

- Who built this? In-house, agency, freelancer, a friend?
- IS THE INTELLECTUAL PROPERTY ASSIGNED TO THE COMPANY IN WRITING?
  If an agency built the app, an intern designed the logo, or a friend wrote
  the code, the IP may not be the company's by default. Assignment has to be
  written down. This surfaces in diligence at the worst possible moment and is
  cheap to fix now.
- Who can change it? What happens if that person leaves?
- Where does the source or design file live? Who has access?

Then map vendor dependencies:

| Vendor | Provides | Written contract? | Ends | If they vanish tomorrow |

A verbal maintenance promise is not a maintenance agreement. If a vendor has
committed to supporting what they built, flag that it needs to be in writing
with a response time, an uptime expectation, source access, and a handover
clause.

## Step 5 — IP position

What is genuinely worth protecting, and what would it cost? Patents, design
registrations, trademarks, copyright, trade secrets.

Record the DECISION and the REASONING, not just the decision. "Not filing
because the design changes every quarter and the money is better spent on
customers, accepting the copying risk" is a defensible position. Having no
position is not.

For trade secrets: is the thing actually protected? A formula everyone in the
workshop knows, with nobody having signed anything, is not a trade secret.

## Step 6 — Safety, claims and human-in-the-loop

If the product touches health, finance, safety, education, children or personal
data, work through:

- What can go wrong for a user?
- What may legally be claimed? What must not be?
- What certifications are required, and which are held?

IF ANY PART OF THE PRODUCT MAKES OR RECOMMENDS A DECISION AUTOMATICALLY —
especially using AI — answer explicitly:

- What does the system decide on its own?
- What must a qualified human validate before it reaches the user?
- Who is that human?
- What is the user told about the limits?

Treat any automated system as capable of being confidently wrong regardless of
how well it has been trained or guarded. If an output could harm someone, there
must be a named point where a qualified person validates it. Buyers, regulators
and serious investors all ask this, and "the model is very accurate" is not an
answer.

If there is currently no human in the loop and the product outputs consequential
recommendations, say so as a top-priority finding.

## Step 7 — Sustainability and impact claims

If the company makes environmental, ethical or social claims, check each one:

| Claim | True today? | Evidence | What is aspirational |

The route through overclaiming is not to go quiet — it is transparency about
the stage. A company does not have to disclose its formulation; it does have to
be clear about what the material is, what is still synthetic, and what the
actual goal is. Customers forgive a company that is honestly 60% of the way
there. They do not forgive one that claimed 100% and got checked.

Flag any claim that would not survive a knowledgeable customer, a journalist or
a regulator asking one follow-up question.

## Output

Update stack/04-product/product.md. Update front matter and the INDEX row.

Finish with the three things in this product section that would cause the most
trouble in a diligence process, in order.
```

---

## Notes

**Step 4 is the one that saves people.** "Who owns the code your agency wrote?" has a default answer in most jurisdictions and it is frequently not "you." It costs a short letter to fix now and a deal to discover later.

**Step 6 is not optional if you are building anything with AI in it.** A product that outputs a health, financial or safety recommendation with no validation step is a liability regardless of accuracy, and it will be the first question a serious buyer asks.
