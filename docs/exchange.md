# The exchange — one folder between a founder and a programme

The connection between a founder's stack and a programme's record is a shared folder with two subfolders in it. That is the whole mechanism, and it is deliberately the dullest part of the design.

Read [for-portfolios.md](for-portfolios.md) first if you have not — this page is the contract, not the reasoning.

---

## Why a folder and not an integration

Because the alternative is worse in every way that matters.

A shared folder works on whatever the programme and the founder already run. It survives a founder leaving the programme, a programme changing tools, and a coach who will not learn a new system. It can be inspected by both sides at any time, which is the property that makes a data conversation possible at all — *here is the folder, that is everything we exchange, look at it.*

Most importantly, a folder can hold nothing more than it holds. An integration that reads a founder's drive is a permission that grows. This does not.

## The folder

One per member company. The programme creates it and adds the founder. Both sides can see all of it.

```
<company-slug>/
  README.md              what this is, who reads which side, how long it is kept
  from-founder/          the founder's carved brief — the programme reads, never writes
  from-programme/        session records — the founder reads, never writes
```

Three rules make it work, and all three are the same rule from different sides:

**Neither master lives here.** The founder's stack stays on the founder's storage. The programme's record stays in the programme's `portfolio/`. What lands in the shared folder is a copy, produced by a carve, sent deliberately.

**Each side treats the other's directory as read-only evidence.** Exactly as `_inbox/` already works in a founder's stack: you read it, you cite it, you never write into it. If you disagree with something in the other side's folder, you say so in your own — you do not edit theirs.

**Everything is markdown with front matter.** Same schema as everywhere else in this repo, so both sides' AI tools can route through it without being taught anything new.

## Going in — `from-founder/`

The founder's carved brief. Not their stack, not their `CONTEXT.md` verbatim — the version they chose to send.

It comes from the carve that already exists. [`prompts/12-weekly-recap.md`](../prompts/12-weekly-recap.md) Step 7 has presets for coach, team and investors; the `PROGRAMME` preset is the fourth. What it sends:

- the current one-pager: what the company is, who the customer is, what they are trying to do next
- this week's metrics and what moved
- what did not get done, and why
- what they are stuck on and what they want help with

`restricted` never travels, under any preset. `internal` travels only because the founder said so — and the carve output states what it withheld, so the founder can see the shape of what they are not sending.

```
<company-slug>/from-founder/
  context.md                 the one-pager, refreshed when it changes
  2026-07-24-recap.md        the weekly carve, dated, append-only
```

Front matter on anything the founder sends:

```yaml
---
doc: recap-carve
subject: acme-widgets
audience: programme
owner: "[the founder's name]"
updated: 2026-07-24
status: needs-verification
confidence: medium
sensitivity: internal
summary: Week ending 24 July. Metrics, what moved, what did not, the one thing
  they want help with.
---
```

## Coming out — `from-programme/`

The factual half of the session record. What was discussed, what was decided, what was committed to and by when — produced by [`prompts/16-session-to-record.md`](../prompts/16-session-to-record.md), which splits every session into two files precisely so this one can be sent.

```
<company-slug>/from-programme/
  2026-07-22-session.md      the record of one session
  2026-07-22-actions.md      or the actions inline in the record, if you prefer one file
```

```yaml
---
doc: session-record
subject: acme-widgets
audience: founder
owner: "[the coach who ran the session]"
updated: 2026-07-22
status: needs-verification
confidence: medium
sensitivity: internal
summary: Session with the operations specialist, 22 July. Costing walked
  through; founder committed to three supplier quotes by 5 August.
---
```

**Send it within a day.** A record that arrives a week later is a document. A record that arrives the same afternoon is a commitment, and the founder is still close enough to the conversation to correct it — which is the point, because a record they corrected is a record they agree with.

## What never travels

The coach's read — `audience: coach-team` — stays in the programme's own `portfolio/<company>/reads/`. It is never copied into `from-programme/`, never quoted in the record, never paraphrased into it.

This is the one rule in the exchange with a mechanical check, and it should be run rather than trusted:

```bash
grep -rl "audience: coach-team" <shared-folder>/*/from-programme/
```

That must return nothing. If it ever returns a file, the fix is not to edit the file — it is to find out how it got there, because a process that leaked once will leak again.

Note what this rule does *not* say. It does not say the founder must never learn what a coach thinks of them, which would be an odd thing for a coaching programme to promise. It says a judgement reaches the founder as a conversation, from the person who holds it, and not as a file they found in a folder. [safety.md](safety.md) covers the rest, including the part where they can ask to see it anyway.

## Making the folder, on whatever you already run

The folder is the same everywhere; only the provisioning differs.

| | Where the folder lives | Adding the founder |
| --- | --- | --- |
| **Microsoft 365** | A SharePoint document library, or the Files tab of a Teams channel | Guest access to that site or channel only |
| **Google Workspace** | A folder in a Shared Drive, or a plain Drive folder | Share with their address, editor on their own subfolder |
| **Dropbox, Box, similar** | A shared folder | Invite to the folder |
| **None of the above** | A folder in a repository the founder can push to | A collaborator on that repository |
| **Nothing at all** | Email attachments, in both directions | Nobody. It works, it is just manual. |

Scope the sharing to the one company's folder. A programme manager who shares the parent folder by accident has given every founder the entire portfolio, and will find out about it from the wrong person.

[automation.md](automation.md) covers what runs on a schedule once the folder exists. Do that second — a folder both sides fill by hand for a month is a working exchange, and it tells you what to automate.

## Retention, and what happens when a company leaves

Decide this when you create the folder, write it into its `README.md`, and say it out loud at onboarding. It takes five minutes then and is unpleasant to improvise later.

The version that covers most programmes:

> This folder holds material exchanged between `[company]` and `[programme]`. The programme keeps its own record of the sessions it ran, in its own system. The founder keeps their own stack, on their own storage. Neither is stored here.
>
> When the company leaves the programme, this folder is handed to the founder and the programme's copy is removed. The programme retains its session records for `[N]` years, for `[the reason]`. Anything tagged `[ASSESSMENT]` is deleted at that point.
>
> Questions about what is held: `[named person, contact]`.

Two things to get right in it. **Name a person**, not a role and not an address that forwards to four people — the same reason every file in this repo has one named owner. And **distinguish what is retained from what is deleted**: session records are ordinary programme business and there are usually good reasons to keep them; a coach's read of somebody, three years after they left, is not.

## Where to go next

- [for-portfolios.md](for-portfolios.md) — the method this contract serves
- [`prompts/16-session-to-record.md`](../prompts/16-session-to-record.md) — produces what goes in `from-programme/`
- [`prompts/12-weekly-recap.md`](../prompts/12-weekly-recap.md) — Step 7 produces what goes in `from-founder/`
- [automation.md](automation.md) — running both directions on a schedule
- [front-matter.md](front-matter.md) — the `subject` and `audience` fields used above
