# AI basics — for a founder who has only ever used a chat window

This page is for someone who pays for an AI, types questions into it the way they would type into a search box, and has never pointed one at their own files. After reading it you will know what "an AI that can read your folder" actually means, how to direct it, how to check it, what it cannot see, and enough of the vocabulary to run the rest of this repo without a developer.

---

## What actually changed

The chat window you have been using cannot see anything. You paste text in, it answers, it forgets. Every question starts from nothing, so every answer is general — competent, fluent, and about companies in general rather than about yours.

The change is that the same model can now be pointed at a folder on your computer. It opens the files. It runs real commands. It writes files back. It can tell you what it changed and why. Your pitch deck, your supplier quotes, your call transcripts and your half-finished plan stop being things you paste in one at a time and become the material it works from.

What this asks of you is not technical. You write a clear instruction, you read what came back, and you decide whether it is right. That is briefing and checking — the same two things you do with a new hire, a designer or an accountant. The syntax is the AI's problem.

The difference is easier to see side by side than to describe.

<!-- DIAGRAM: chat-vs-folder -->

## The loop everything runs on

Every piece of work in this repo — bootstrapping the stack, writing a recap, building a one-pager — runs the same four steps.

| Step | What happens | What you do |
| --- | --- | --- |
| **Brief** | You say what you want, and what "done" looks like | Be specific about the output and the source material. Name the folder. |
| **Plan** | It says what it intends to do, in order, before doing it | Read it. Correct it. This is the cheapest place to catch a wrong assumption. |
| **Build** | It writes files, runs commands, shows the output | Watch. Approve individual actions rather than batches. |
| **Review** | It summarises what changed; you open the files | Read every line that will leave the folder. Open the source for every number. |

You approve every step. The loop only fails in one way, and it is always the same way: the founder stops reading at the review step because the last six outputs were fine.

Repeat the loop rather than trying to get a large task right in one instruction. Four small passes you checked beat one large pass you skimmed.

<!-- DIAGRAM: the-loop -->

## The terminal, in plain language

A terminal is a text window. You type one line, press enter, and something happens — a folder is listed, a file is copied, a tool starts. Whatever happened prints back as text underneath. That is the whole idea.

It looks severe because it has no buttons and no icons, and because most of what you have seen of it was somebody else's screen during an incident. In practice it is a receipt printer: everything that happened is written down, in order, which is exactly the property you want when an AI is working in your files.

**You will not memorise commands, and you will rarely type them.** The agentic tool types them. Your job is to read the line it proposes, understand roughly what it is about to do, and approve or refuse. Anything that mentions deleting, or a path outside your folder, deserves a second look. Most of the rest is reading, listing or writing inside the folder you scoped.

This section exists so the screen is not a mystery, not so you become fluent. Knowing that a blinking cursor means "waiting for you" and a wall of scrolling text means "working" removes most of the discomfort.

## What makes an editor "agentic"

An editor — sometimes called an IDE — is a window that shows your folder on the left and the contents of a file on the right. On its own it is a text editor with a file tree, no more remarkable than a word processor.

An agentic one adds a chat panel wired into that folder. Four things separate it from the chat window you already pay for:

- It **reads** files in the folder without you pasting them
- It **writes** files back, creating and editing them
- It **runs** commands, and shows you the output
- It **explains** what it changed, file by file, line by line

If a tool does those four, it will run this repo. If it only does the first, it is a chat window with an upload button, and you will spend your evenings copying text back and forth.

## The lanes are interchangeable

Each major model comes paired with an agentic tool from the same maker. The pairings look like this:

| Model family | Paired agentic tool |
| --- | --- |
| Anthropic's Claude | Claude Code in a terminal; the Claude desktop app for a folder without a terminal |
| OpenAI's GPT | Codex, as an app and in a terminal |
| Google's Gemini | Gemini CLI in a terminal |

Separately, editor-based tools such as Cursor and Windsurf let you choose which model sits behind them.

**Pick the one you already pay for.** The four-step loop is identical in all of them, the prompts in this repo are plain English and run anywhere, and the differences people argue about online will not decide whether your stack gets built. Choosing a lane should take ten minutes, not a week.

## Tiers, and the effort dial

Within a lane, models come in tiers. They share the same skills. What differs is how deeply the model reasons and how fast it answers — a small tier is quick and cheap and perfectly good at extraction and formatting; a large tier is slower and better where being wrong costs you something.

Separately from the tier, most tools let you ask for more thinking on a single question. Telling it to think carefully before answering, or turning on an extended-reasoning setting, buys depth on that one task without changing your subscription.

| Task | Tier | Thinking |
| --- | --- | --- |
| Renaming files, extracting text, reformatting a table | Small | Low |
| Drafting a document from material already in the stack | Middle | Low to medium |
| A decision you will act on — pricing, positioning, what to say to an investor | Top | High |
| Anything producing a number you will repeat in public | Any | High, and demand the source |

Spend the thinking where the decision matters. Running everything at maximum effort is slow and expensive. Running a pricing decision at minimum effort is worse.

## Connectors, and the standard behind them

Your business does not live only in a folder. It is also in your mail, your drive, your calendar, your task tracker and — once you follow the quickstart — a repository.

The Model Context Protocol is a single standard for plugging those into an AI tool: one adapter shape, instead of custom wiring per tool per vendor. In practice a connector shows up in your tool as something you switch on, authorise once, and then refer to in plain English — *find the supplier thread from March and summarise what was agreed*.

Three habits, and they are not optional:

- **Read-only first.** Grant reading before you grant writing or sending. A misfired draft email is a bad first week.
- **Scoped.** Connect the mailbox or the drive folder the task needs, not the whole account.
- **With permission.** Yours, and your company's. Personal data, and anything under a confidentiality obligation, stays out until the policy question has an answer — see [safety.md](safety.md).

Setting one up, and the rule that keeps connector-found material citable, is covered in [getting-material-in.md](getting-material-in.md).

Put together, the pieces you are assembling are few.

<!-- DIAGRAM: your-toolkit -->

## What it genuinely cannot see

This is where founders get burned, so it is worth being blunt. The failure is never that the AI refuses. It answers anyway, fluently, in your own vocabulary, and the gap is invisible in the output.

| It cannot see | Why | Do this instead |
| --- | --- | --- |
| Numbers that exist only as pixels in a chart | Text extraction reads the caption and the axis labels, never the plotted values | Export the chart as an image and ask it to read the picture, or type the underlying numbers into a text file |
| The formula behind a spreadsheet cell | It sees the displayed value, not the calculation that produced it | Paste the formula in, or export a version of the sheet with formulas shown |
| Anything behind a login | Bank portals, your CRM, analytics dashboards, paid research | Export what you need, or connect it deliberately through a connector |
| A file you did not put in the folder | No access is not the same as no answer | Put it in the folder, and ask it what it could not find |
| Everything you know and never wrote down | The verbal supplier agreement, why you dropped the second product, what the customer actually meant | Write it down. This is most of the value of building a stack. |

The last row is the expensive one. A stack assembled only from documents describes the company you have written up, not the company you are running. That difference is usually why a plausible-looking plan does not survive contact with your own operations.

<!-- DIAGRAM: what-it-cannot-see -->

## Context and cost, in founder terms

Context is everything the AI is holding in mind for this one question: your instruction, the files it opened, and what it has produced so far. It is finite, and it is what you pay for.

A token is a fragment of text — usually a word, or a piece of one — and everything the AI reads and everything it writes is counted in tokens.

Two things follow, and the second matters more than the first.

**Cost.** If every question makes it re-read your whole folder, you pay for your whole folder on every question. That charge grows every time you add a file, which is to say every week.

**Quality.** A context filled with material irrelevant to the question produces vaguer answers. The model is not concentrating on your unit economics; it is holding your brand fonts and your incorporation certificate at the same time.

The fix is the whole reason this repo is shaped the way it is. Every file carries a one-sentence summary in its front matter. `stack/INDEX.md` collects those summaries into one short table. The AI reads the index, decides which one or two files are relevant, and opens only those. The base gets cheaper and sharper as it grows, instead of heavier.

<!-- DIAGRAM: index-not-everything -->

## The one rule

A named human owns every output. Never ship unread.

Before anything leaves the folder — a deck, an investor update, a supplier quote, a page of your website — one person has read every line, opened the source behind every number, and put their name on it. Not skimmed. Read.

*The AI did it* is not an answer that works with a customer, an investor, a regulator, a co-founder or a court. The output carries your name the moment you send it, and the fact that a model drafted it changes nothing about who is accountable for it.

This is also the practical test of whether you are working correctly. If you cannot follow what the AI did well enough to check it, the task was too large, the plan step was skipped, or you have automated something you do not yet understand.

<!-- DIAGRAM: stay-in-the-loop -->

## Safety habits

Five habits. They cost no time, and they are what separates a bad afternoon from a lost file.

- **Scope it to one folder** — your stack, not your Desktop, not your whole drive.
- **Keep approval prompts on, and read them.** The dangerous week is the sixth one, when approving has become reflex.
- **Keep regulated and personal data out** until you have a clear answer on whether it may be processed at all.
- **Treat every draft as wrong until you have checked it.** Confident and correct look identical on the page.
- **Keep an undo.** Version history, or a copy of the folder taken before you start. Never point it at the only copy of anything.

The longer version — including which material should never go in the folder at all, and why your account tier matters — is in [safety.md](safety.md).

## Where it pays off in an ordinary week

- **Drafting.** An investor update, a supplier email, a job description — built from material already in the folder rather than from a blank page.
- **Summarising.** A forty-message thread, a sixty-page research PDF, a recorded call. Into the shape you need: decisions, owners, dates.
- **Organising.** Four years of files with names like `final_v3_REAL.docx` sorted, renamed and filed against a structure you agreed first.
- **First drafts of process.** An SOP for the thing only you know how to do, a monthly report, a checklist — drafted in minutes, then corrected by the person who does the work.
- **Research and comparison.** Competitor grids, supplier options, compliance requirements — with the sources named so that you can check them.
- **Small internal tools.** A tracker, a calculator for your unit costs, a page that renders your weekly numbers. Small, private, yours.

## Two ways to run these tools

**On your own machine.** You install the tool, point it at a folder, and everything happens on your computer. The files are the ones you already recognise, you can open them in the ordinary way, and you can see exactly what changed.

**In the browser, from a repository.** Your material lives in a repository, the AI works on a copy of it in the browser, and it hands back changes for you to accept or reject. Nothing to install, and you can work from any machine.

If you are starting out, start on your own machine, with a folder you have copied first. The mental model is simpler — there is one folder, it is on your desk, you can look at it — and everything in the [quickstart](../QUICKSTART.md) assumes exactly that. The browser route is worth having later, once your stack is in a repository and you want to work from somewhere else.

## Teach it once, and it repeats

The second time you explain a task, stop and write the explanation into a file instead. From then on you run the file.

That is precisely what [`prompts/`](../prompts/INDEX.md) is in this repo: tasks written down once — bootstrap the stack, run the gap scan, write the weekly recap — so they come out the same way every time, in the same shape, under the same rules about what may not be invented. `AGENTS.md` does the same job for the standing rules that apply to every task.

The benefit is not only speed. A task you have written down is a task you can correct. When an output comes back wrong in the same way twice, you fix the file, rather than the mood you were in when you asked.

## Eight prompts for your first week

A starter set, not a library — the real work is in [`prompts/INDEX.md`](../prompts/INDEX.md).

```
Before you change anything, tell me what you are about to do, which files
you will touch, and what could go wrong. Wait for my go-ahead.
```

```
Read this folder and give me a plan as a numbered list. Do not write any
files yet.
```

```
List everything you could not find. Do not fill a gap with a plausible
answer — write [TBD] and say what would be needed, and where it would
come from.
```

```
For every number, cite the file and page it came from. If there is no
source, mark it [TBD] rather than estimating.
```

```
Read only. Do not create, edit or delete anything in this folder. Answer
from what is already there.
```

```
Summarise what you changed, one line per file, and tell me what you left
untouched.
```

```
Explain what this file is for in plain language, as if I have never seen
it. I am not a developer.
```

```
If you need information that is not in this folder, stop and ask me. Do
not assume, and do not proceed.
```

## Later, not now

**Wide research with citations.** You can send an AI to read many sources — sites, filings, reports, a stack of PDFs — and return one synthesis with a citation against each claim. It is genuinely useful for a competitor scan, or a first pass at a regulation you have to comply with. The habit that makes it safe is simple and tedious: open the citations. A confident summary built on a weak source reads exactly like a confident summary built on a good one, and the citation is the only place that difference shows.

**Several agents at once.** You can run multiple agents in parallel — one per section, one per source — with a further agent checking each finding independently against the original material. It is fast and it scales. It is also easy to lose track of, and everything in this method depends on your being able to follow what happened well enough to check it. Come back to this when the four-step loop is second nature, not before.

## The two worries

**"I would have to learn to code."** You would not. You write instructions in English and read results in English. The files in this repo are prose, with a small block of tags at the top. The scarce skill here is judgement about your own business — who the customer is, what a unit costs, which number is wrong — and you already have it. The habit you need to build is checking, not programming.

**"I will break something."** What you are working on is a copy of your own files, in plain text, in one folder. Keep an undo — version history, or a copy of the folder taken before you start — and the worst outcome is that you throw away an afternoon's edits and run it again. Point it at a copy, never at the only copy, and there is nothing here to break.

## A note on websites — a separate project

If what you want is a public site rather than a knowledge base, the same four moves apply: compile the material, agree the design, agree the plan, then let the agent build. You review at each step, exactly as you do here. Once it lives in a repository, publishing is automatic — you accept a change, and the host rebuilds the site.

That is where the similarity ends. A public site is its own project, with its own requirements document, its own approvals, and its own decisions about what may be said in public. It is not a chapter of this one.

This repo's job is the knowledge base such a project would read from — the positioning, the numbers, the proof points and the design notes, each tagged with whether it is confirmed and whether it may leave the building. Build that first. A site assembled from an uncorrected stack publishes your guesses at your own domain.

## Where to go next

- [../QUICKSTART.md](../QUICKSTART.md) — the first hour, honestly, including what not to try to finish today
- [method.md](method.md) — the six ideas the whole system is built on
- [knowledge-base.md](knowledge-base.md) — how raw files become a base an AI can read cheaply
- [safety.md](safety.md) — read this before you give any tool write access to your files
- [../prompts/INDEX.md](../prompts/INDEX.md) — the task library, and the order to run it in
