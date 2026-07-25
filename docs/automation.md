# Automation — running it on a schedule

How to stop copying and pasting: getting a transcript into a prompt without fetching it, getting new mail and documents into `_inbox/` without exporting them, and getting a finished record into the right folder without attaching it to anything.

Written for whichever platform you already run. Nothing here needs a developer, and none of it is required — the method works entirely by hand, which is exactly how it should start.

---

## Do it by hand first

Run the loop manually until you are bored of it. Ten sessions, or a month of weekly recaps.

The reason is not caution. It is that automating a workflow freezes it, and a workflow you have run twice is not yet the one you want frozen. Programmes that build the pipeline first end up with a beautifully scheduled flow producing a note their coaches quietly stop reading, and nobody can say when that started.

**The test to pass before you automate anything:** the person who ran it by hand thinks the output is better than what they wrote before. If it is not, a scheduler produces the same output faster, which is not the goal.

## The two loops worth automating

Only two, and they belong to different people.

**The founder's loop, weekly.** New material out of mail and drive into `_inbox/`, folded into the stack, recapped, and the carve sent to whoever they report to. Runs on the founder's own storage, under the founder's own AI subscription. The programme pays for none of it and sees none of it.

```
weekly  →  pull what is new from mail and drive into _inbox/
        →  prompts/01-refresh-the-stack.md   folds it in without flattening corrections
        →  prompts/12-weekly-recap.md        the pulse
        →  Step 7, PROGRAMME preset          into the shared folder
```

**The programme's loop, per session.** A transcript appears, the coach is asked for their read, the two files get written, the record updates, the founder's copy goes out.

```
session ends  →  transcript lands somewhere
              →  prompts/16-session-to-record.md
              →  the coach is asked for their read, and answers
              →  the coach approves the record
              →  it copies into <company>/from-programme/
```

Note where the human is in the second loop. That position is not negotiable, and it is the subject of the second honest note below.

## Recipes by platform

| Need | Microsoft 365 | Google Workspace | Zoom | Slack | None of these |
| --- | --- | --- | --- | --- | --- |
| **Shared folder per company** | SharePoint library, or a Teams channel Files tab | Shared Drive folder | — | — | Any synced folder, or a repo |
| **Session transcript** | Teams transcription | Meet transcription | Zoom cloud transcript | — | Export from whatever recorded it |
| **Notice a new transcript** | Power Automate file-created trigger on the recordings folder; or poll the transcript API | Apps Script time-driven trigger, or a Drive change watch | Zoom webhook on recording completed | — | Look in the folder |
| **Run the prompt** | Whichever AI tool holds `portfolio/` | same | same | same | same |
| **Ask the coach for their read** | Adaptive card in Teams | Chat message or mail with a link to the draft | — | Message with buttons, via Workflow Builder | Open the file and type into it |
| **Approve before anything sends** | The card's confirm action | Reply, or a checkbox in the doc | — | The message's button | Save the file |
| **Fan out on approval** | Teams post, Outlook mail, file copy | Chat post, Gmail, file copy | — | Channel post | Email, or copy the file |
| **Founder's weekly pull** | A recurring task in the founder's own AI tool, with mail and drive connectors | same | — | — | A calendar reminder and ten minutes |

Read the columns as alternatives, not as a stack. A programme on Microsoft does the whole thing in the first column; one with nothing but a shared folder and a calendar does it in the last, and gets the same records at the end of the month.

The connector side — what a connector is, how to authorise one, and what to grant it — is in [getting-material-in.md](getting-material-in.md). Nothing on this page changes those rules.

## The three fiddly parts

**There is no clean "the meeting ended" trigger anywhere.** Every route is a poll, a webhook, or a file-created event on a recordings folder, and each has a lag that is not documented and not stable. Transcripts also appear some minutes after the recording does, so a flow triggered by the recording will often find no transcript and needs to retry rather than fail. Budget most of your build time here; it is the least interesting part and the one that breaks.

**The approval step is not optional.** It is where the coach's judgement enters the record. A flow that writes an assessment about a person without a named human confirming it has automated the one thing in this system that must not be automated — and it produces exactly the artifact [safety.md](safety.md) exists to prevent: a confident, plausible, unattributable judgement about somebody, in a file, with nobody to ask about it.

If you build only one guard, build this one: **nothing reaches a founder, and nothing enters `reads/`, without a person saying yes.**

**Recording needs consent, and a founder needs to know what happens to it.** Say at intake that sessions are recorded, what the transcript is used for, where it is kept, and for how long. Platform transcription makes this easy to switch on and easy to forget to mention. [exchange.md](exchange.md) covers what to write down; the point of writing it once is that nobody has to improvise it in the first minute of a session.

## The founder's weekly pull, concretely

Most AI tools with connectors can hold a recurring instruction. This is the one worth setting, and the wording matters more than the schedule:

```
Every Monday, search my mail and my drive for anything new since last Monday
that is about the business: customer conversations, supplier quotes and
invoices, investor correspondence, anything signed, anything with a number in
it.

Save what you find into _inbox/ as markdown files — one per thread or
document, named with the date and what it is, each noting where it came from
and when you pulled it.

Do not copy in anything personal, anything a third party sent in confidence,
or bulk contact data. If you are unsure, list it and ask me.

Then stop. I will run the refresh prompt myself.
```

Two constraints in that, both already repo rules and both load-bearing:

**What a connector finds still lands in `_inbox/` as a file.** A live connection is not a citation. [AGENTS.md](../AGENTS.md) requires every fact in the stack to trace to something that can be opened again later, and a search that ran once in a chat window cannot be.

**Scope the pull. Never mirror a mailbox.** This is the highest-risk instruction on this page. An AI-readable folder containing an entire inbox holds other people's personal data, material sent in confidence, and things that are simply nobody's business — and it holds them permanently, having been assembled by a schedule nobody was watching. Filter to what matters, and read the section on what stays out of the folder in [safety.md](safety.md) before switching anything on.

Note also where that instruction stops. It gathers; it does not fold anything into the stack. Refreshing the stack changes files a human has corrected, and that stays a decision rather than a schedule.

## What a programme can ask for, and what it cannot

A programme cannot compel a founder to maintain anything, and any design that assumes otherwise will be accurate for about three weeks. What it can do is make the setup a condition of membership, at the point where a founder is most willing to agree to things:

- a company email domain and a business drive, rather than personal accounts
- a paid AI subscription with connectors to both — any vendor; nothing in this repo depends on which
- the shared folder accepted, and the first weekly recap sent before the first session

That is the prerequisite pattern, and it is [for-coaches.md](for-coaches.md)'s existing argument moved to onboarding: the leverage a programme has is access, not equity. Specialist time, introductions, a demo-day slot and capital are all things founders want, and a corrected stack is a reasonable price for them.

What it is not is a way to see more. The founder's subscription runs on the founder's data on the founder's storage. The programme still sees only what is carved into the shared folder — which is the arrangement that makes the honest version of a recap possible at all.

## What to check, once a month

Automation fails quietly, and the failure mode is a folder that looks fine.

- **Did every session produce two files?** One is a sign the read step is being skipped, which is the whole point going missing.
- **Did anything reach a founder without an approval?** Check the shared folder against your approvals for the month.
- **Run the leak check.** `grep -rl "audience: coach-team" <shared-folder>/*/from-programme/` must return nothing. If it ever returns something, the fix is finding out how it got there — a process that leaked once will leak again.
- **Is anything in `_inbox/` that should not be there?** Scheduled pulls widen over time as mail changes shape.
- **Is the loop still worth running?** If the coaches have gone back to writing their own notes beside the generated ones, the automation is producing something nobody wants, faster.
