# Prompt library

Copy a prompt, paste it into an AI that can see this folder, answer what it asks. Each one reads only the sections it needs and writes back into the stack.

They assume [`AGENTS.md`](../AGENTS.md) is loaded. If your tool does not pick it up automatically, paste it first — it carries the rules that stop the model inventing numbers.

Numbers in the *Reads* column below are `stack/` sections, not prompt numbers — `stack/07` is money; prompt 07 is unit economics.

---

## Build and maintain

| | Prompt | What it does | Reads | Writes |
| --- | --- | --- | --- | --- |
| 00 | [bootstrap-the-stack](00-bootstrap-the-stack.md) | Reads `_inbox/`, writes the whole stack, tags every claim, hands you a gap list. **Run this first.** | `_inbox/` | all of `stack/` |
| 01 | [refresh-the-stack](01-refresh-the-stack.md) | Folds new material in without flattening your corrections. Run monthly, or after anything big. | `_inbox/`, all | changed sections |
| 02 | [gap-scan](02-gap-scan.md) | What is missing, unverified, stale or contradictory — ranked by how much it will hurt. | all | `INDEX.md` |

## Sharpen a section

| | Prompt | What it does | Reads (stack sections) |
| --- | --- | --- | --- |
| 03 | [customer-and-problem](03-customer-and-problem.md) | Job-to-be-done, ICP, the pattern across interviews, an interview guide for the next ten. | 02 |
| 04 | [market-sizing](04-market-sizing.md) | Bottom-up TAM/SAM/SOM with every assumption named, and a beachhead you can actually reach. | 02, 03 |
| 05 | [competitive-intelligence](05-competitive-intelligence.md) | The full grid — including the incumbent, the adjacent platform and the informal alternative you left off. | 02, 03, 04 |
| 06 | [product-and-roadmap](06-product-and-roadmap.md) | Splits what exists from what is a slide. Roadmap with dates, IP position, human-in-the-loop check. | 02, 04 |
| 07 | [unit-economics](07-unit-economics.md) | Cost per unit, costing at volume bands, working capital, CAC, runway. **The most valuable prompt here.** | 04, 06, 07 |
| 08 | [list-of-100](08-list-of-100.md) | Builds a real prospect list for one channel, plus the outreach cadence and the pitch. | 02, 03, 05 |
| 09 | [marketing-engine](09-marketing-engine.md) | Paid-media step-test plan, creative tests, agency accountability brief, digital hygiene audit. | 02, 05, 07 |

## Produce something

| | Prompt | What it does | Reads (stack sections) |
| --- | --- | --- | --- |
| 10 | [pitch-deck](10-pitch-deck.md) | Slide-by-slide deck content in the expected order, gaps marked, nothing invented. | most |
| 11 | [fundraise-readiness](11-fundraise-readiness.md) | Staged funding roadmap, dilution map, non-dilutive options, data-room checklist, investor CRM. | 01, 03, 04, 07 |
| 12 | [weekly-recap](12-weekly-recap.md) | **The pulse.** Thirty minutes, every week. Reads the stack, writes the recap, updates the metrics. | 10, last recap |
| 14 | [meeting-to-actions](14-meeting-to-actions.md) | Transcript → summary, minutes, owned actions with dates, and stack updates. **Run after every call.** | CONTEXT |
| 15 | [scrape-a-site](15-scrape-a-site.md) | A website — yours or a competitor's — turned into cited, tagged stack material. Surfaces where the site and the stack disagree. | 01, 03, 04, 05, 09 |

## Get told what is wrong

| | Prompt | What it does |
| --- | --- | --- |
| 13 | [mentor-review](13-mentor-review.md) | An adversarial pass. What an experienced coach or investor would attack, in the order they would attack it. **Uncomfortable on purpose.** |

## Run a portfolio

For a programme running the method across many companies — an incubator, accelerator, studio or university venture programme. **A founder building their own stack will never need these three.** They read and write [`portfolio/`](../portfolio/), never a founder's stack. The method is in [docs/for-portfolios.md](../docs/for-portfolios.md).

| | Prompt | What it does | Reads | Writes |
| --- | --- | --- | --- | --- |
| 16 | [session-to-record](16-session-to-record.md) | One session → the factual record the founder gets, your attributed read, and the updated company record. **Run after every session.** | transcript, `record.md` | `sessions/`, `reads/`, `record.md` |
| 17 | [pre-session-brief](17-pre-session-brief.md) | Half a page before you walk in — including what the last three coaches advised, so you do not contradict them. **The shortest prompt here.** | `record.md`, recent sessions | nothing |
| 18 | [portfolio-scan](18-portfolio-scan.md) | What is going wrong in enough companies to be worth teaching, who needs attention, and what actually moved. Monthly. | every `record.md` | `themes.md`, `INDEX.md` |

---

## Suggested order

**Week 1** — `00` bootstrap · correct `CONTEXT.md` by hand · `02` gap scan · `12` first recap

**Weeks 2–4** — the two or three sections the gap scan flagged. Usually `07` unit economics and `05` competition. Keep running `12` weekly and `14` after every meeting.

**Month 2** — `08` and `09` if you are selling; `03` and `04` if you are still finding the customer. Run `15` on your own site and on the competitor you actually lose to, then `05`.

**Before you raise or present** — `13` mentor review, then fix what it finds, then `10` and `11`.

**Forever** — `12` every week. `14` after every meeting. `01` monthly. `02` quarterly.

**If you run a programme** — `17` before every session, `16` after every one, `18` monthly. Nothing else on this page changes; the founders still run their own.

---

## Using them well

**Answer the questions.** These prompts stop and ask rather than assuming. That is the feature. A ten-second answer from you beats an assumption that propagates into six documents.

**Do not skip steps.** The sequence inside each prompt is the sequence a good coach uses. Jumping to the output produces something confident and unfounded.

**Correct the output.** The AI drafts; you validate. Nothing it writes is true because it wrote it.

**Commit before and after.**

```bash
git add -A && git commit -m "before: unit economics prompt"
# run the prompt
git diff                 # see exactly what changed
git add -A && git commit -m "07-money: unit economics from supplier invoices"
```

## Writing your own

Every prompt in here follows the same shape, and yours should too:

1. **Role and scope** — what the AI is doing, which sections to read, which to leave alone
2. **Read first** — the specific files, in order
3. **Ask before assuming** — the questions it must put to the founder rather than guess
4. **The work** — numbered steps, in the order a practitioner would do them
5. **Rules** — no invented numbers, tag everything, cite sources, ask before deleting
6. **Output** — exactly which files change and what goes in them
