# portfolio/

**Optional. If you are a founder building your own stack, delete this folder.** It belongs to the other reader of this repo: a programme — an incubator, accelerator, studio or university venture programme — running the method across many companies at once.

The method is in [docs/for-portfolios.md](../docs/for-portfolios.md). This folder is the templates.

---

## The shape

```
portfolio/
├── INDEX.md              the router — one row per company
├── rubric.md             levels 1-5 per function, and what each score routes to
├── themes.md             what is going wrong across the portfolio → what to teach next
└── <company-slug>/       one per member company, copied from _company-template/
    ├── record.md         the living picture: stage, focus, levels, next milestone
    ├── profile.md        how this founder works       ·  coach-team only
    ├── sessions/         the factual record of each session, append-only
    └── reads/            the coach's read of each session  ·  coach-team only
```

`_company-template/` is the thing you copy. Rename it to the company's slug — lowercase, hyphenated, the same slug used in the shared folder and in every `subject:` field that refers to them.

## What goes where, and why the split

Every session produces **two files, not one.** They have different owners, different readers and different lifespans, and the split is the load-bearing part of this design:

| | `sessions/` | `reads/` |
| --- | --- | --- |
| Holds | What was discussed, decided and committed to, and by when | How the founder is doing, how the advice landed, what worries you |
| `audience:` | `founder` | `coach-team` |
| Also goes to | The founder, via the shared folder | Nowhere |
| Tagged | Facts, cited and dated as normal | `[ASSESSMENT — name, date]` |
| Lifespan | Permanent, append-only | Kept only as long as it is useful |

A factual record that quietly contains a judgement is unfair to the person it is about. A judgement recorded as though it were a fact is worse — it hardens, gets repeated by people who never met them, and outlives the thing it described.

[`prompts/16-session-to-record.md`](../prompts/16-session-to-record.md) produces both from one transcript plus the coach's own impressions. It does not invent the second one.

## Two rules that are not optional

**`audience: coach-team` never travels to the founder.** Not in a record, not quoted, not paraphrased. The check is mechanical and belongs in whatever sends the record out:

```bash
grep -rl "audience: coach-team" <shared-folder>/*/from-programme/
```

**Everything about a person is written as though that person will read it.** In most jurisdictions they can ask to. More usefully: a judgement you would not put in front of someone is one you have not finished thinking about. [docs/safety.md](../docs/safety.md) has the rest — retention, deletion, who answers an access request.

## Adding a company

1. Copy `_company-template/` to `<company-slug>/`.
2. Fill in the front matter of `record.md`: `subject`, `owner` — one named person on your team — and a `summary:` line written for routing.
3. Add one row to [INDEX.md](INDEX.md).
4. Provision the shared folder and add the founder. [docs/exchange.md](../docs/exchange.md) covers it on whichever platform you already run.
5. Send the founder [`worksheets/startup-prep.md`](../worksheets/startup-prep.md) as pre-session homework. It already carries a `programme` field, and it is the whole intake.

Score the rubric after the first session, not before. A level assigned from an application form is a guess wearing a number.

## What this folder is not

It is not a copy of anybody's stack. The programme never holds a founder's master — see [docs/for-coaches.md](../docs/for-coaches.md), which has said so since before this folder existed. What is here is what your own coaches wrote, plus what founders chose to send.
