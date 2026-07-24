# What things are — a plain-English reference

This page is for a founder who has hit a word — terminal, commit, connector, host — and wants a straight answer rather than a tutorial. Skim the headings, read the one you need, and leave; nothing here has to be read in order, and none of it has to be memorised.

For the narrative version — what changed, how to direct an AI, what it cannot see — read [ai-basics.md](ai-basics.md) once, start to finish. This page is the lookup you come back to.

---

## How does all of this fit together?

Four layers, stacked. You at the top, then the AI tool, then the command line, then your own files at the bottom. Your instruction travels down through them, and the result comes back up.

You write the instruction in plain English and point at the folder it may work in. The tool reads what is in that folder, works out what to do and in what order, and writes the commands that would do it. Those commands run in the command line. The files that change are the ordinary files on your computer — the ones you can open in the usual way. Between you and everything below sits an approval gate: the tool proposes, and nothing crosses that line without your yes.

What beginners get wrong is treating what comes back as a preview. It is not. Files are created, edited and saved for real, which is why [safety.md](safety.md) asks for an undo before you start and why the four steps you approve — brief, plan, build, review — are worth reading in [ai-basics.md](ai-basics.md).

The whole arrangement fits in one picture.

<!-- DIAGRAM: how-it-fits-together -->

## What is the terminal?

A text window. You type one line, press enter, and what happened prints back underneath, in order, under the line that caused it.

It is bare on purpose: no buttons, no icons, just a running record of everything that ran. That record is exactly the property you want when something is changing your files. [QUICKSTART.md](../QUICKSTART.md) has you paste a few lines into one to take your own copy of this repo. After that, the tool types the lines and you read them.

The mistake is assuming you have to learn commands. You will rarely type one. Your job is to read the line the tool proposes and approve or refuse it, and two things deserve a second look before you do: anything that removes or overwrites a file, and any path pointing outside the folder you scoped.

Seeing one laid out removes most of the discomfort.

<!-- DIAGRAM: what-is-the-terminal -->

## What is an editor, and what makes one "agentic"?

An editor is a window showing your folder on one side and the contents of one file on the other. Agentic means it also carries a chat panel wired into that folder.

Four things separate that panel from a chat window with an upload button. It opens the files itself, so you paste nothing in. It writes changes back into them, not just into a reply. It carries out the commands the work needs, with the result printed where you can see it. And it accounts for what it changed, file by file, before you decide to keep it. Any tool that does all four can run everything in this repo; [QUICKSTART.md](../QUICKSTART.md) lists the common ones.

The mistake is expecting to be looking at code. In this repo the file you open is nearly always prose — a page of notes, a draft, a summary. The only part that looks technical is the short list of labels at the head of each file, and [front-matter.md](front-matter.md) explains it field by field.

An editor is easier to recognise on sight than to describe.

<!-- DIAGRAM: what-is-an-editor -->

## What is Git?

Git is a save point for a whole folder, the way a save game is a save point for a game. Each save point holds every file as it stood, not one file's history.

Three words cover it. A **commit** saves the folder as it stands, with a line saying what changed. A **diff** is the view of what is different between two save points. A **clone** takes your own copy of a folder that already has a history behind it. That is why [QUICKSTART.md](../QUICKSTART.md) has you commit the empty stack before you run anything, and why [safety.md](safety.md) calls Git the actual undo button: you can read line by line what the AI changed, keep it, or put the folder back and brief it better.

The mistake is thinking Git means putting your files online. It does not. Git runs on your computer, needs no account and no internet, and nothing leaves your machine unless you send it somewhere deliberately.

Four save points in a row make the idea obvious.

<!-- DIAGRAM: what-is-git -->

## What is GitHub, and how is it different?

GitHub is a copy of that history kept online, in an account. Git is the history; GitHub is where a second copy of it lives.

Two moves connect them. You **push** to send your saved points up, and you **clone** or **pull** to bring the copy down. The second copy is what survives a lost laptop, what lets you give a coach or a co-founder access instead of emailing files about, and what allows a repository to serve a page on the web. Other services do the same job; this repo happens to live on that one, which is where the clone command in [QUICKSTART.md](../QUICKSTART.md) points.

The mistake is not checking which kind of repository you made. A private one is private; a public one is public, to everyone, immediately. A stack holds customer names, prices and contracts — check which one you have before you push, and read [safety.md](safety.md) on what should not be in the folder at all.

The two-places arrangement is worth one look.

<!-- DIAGRAM: what-is-github -->

## What is a connector?

A connector is a switch that lets your AI tool reach a system outside your folder: your mail, your document drive, your calendar, your task tracker, a repository. You turn it on, authorise it once, and then refer to it in plain English.

The standard underneath is the Model Context Protocol — one adapter shape for every system, instead of custom wiring per tool. What matters to you is not the standard but the scope. A connector is an offer of access, and you choose which one and how much of it.

Three habits, and they are where the risk sits: read-only before you grant writing or sending; one mailbox, or one drive folder, rather than the whole account behind it; and only with permission, yours and your company's. The mistake is granting write or send access at the start, when read access would have answered the question. Nothing in this repo requires a connector — the stack is files in a folder — so treat each one you add as a deliberate widening of access, and read [safety.md](safety.md) first.

The tangle a single standard replaces is easier to see than to explain.

<!-- DIAGRAM: what-is-a-connector -->

## Which model should I use, and what is "effort"?

Two controls, not one. The tier is which model you pick. The effort is how hard you ask it to think about the one question in front of you. Beginners set the first and never notice the second.

Pick the tier by the kind of work, not by the name. Routine reformatting — extraction, renaming, filing, turning a page of notes into a table — sits at the bottom. Everyday drafting and research from material you already have is next, and most of the work is there. Ambiguous, high-stakes analysis, where being wrong costs you, sits above that. Every provider publishes its own names for these tiers, and the names change; the ladder does not. A larger tier also does not know more about your company — that comes from the folder, not from the model.

Effort is set per question. Keep it low for a lookup, a rename or a reformat, where you can check the answer at a glance. Turn it up for a decision you will act on, ask to see the reasoning, and then read it. Across [`prompts/`](../prompts/INDEX.md) that is the difference between filing what has landed in your inbox folder and [working out what one unit actually costs](../prompts/07-unit-economics.md) — same material, different setting.

Side by side, the two controls are obviously separate.

<!-- DIAGRAM: model-tiers-and-effort -->

## What about hosts, domains and databases?

**A knowledge base needs none of them. No host, no domain, no database, no framework.** It is a folder of text files on your computer, and it stays that way however large it grows. These words are explained here only so they are not a mystery the first time somebody says one to you.

A **host** takes a repository and serves it to the public as a website, rebuilt whenever the repository changes. A **domain** is the address people type into a browser; it points at the host so your pages answer at a name you chose. A **database** is a separate service that remembers what people type in — accounts, orders, bookings, messages. A **framework** is a set of ready-made parts a developer assembles an application from.

The one people get wrong is assuming a host includes a database. It does not: a host serves pages and keeps nothing, so publishing a site gives you nowhere to put what a visitor typed. You need a database only when strangers are typing into your product and what they type has to be kept. Building a public site or a product is a separate project. It carries its own requirements document, its own sign-offs and its own judgement calls about what may go out under your name. This page does not teach any of that, and neither does the rest of this repo.

The chain from a folder to a published page, and the place a database does not sit in it, is worth one look.

<!-- DIAGRAM: beyond-the-knowledge-base -->

---

## Words you will hear, in one line each

| Word | What it means |
| --- | --- |
| **repository** | A folder whose whole history is kept, so any earlier version can be brought back. Often shortened to "repo". |
| **commit** | One save point: the folder exactly as it stood, with a line saying what changed and why. |
| **branch** | A separate line of changes you can work on without disturbing the main one, until you fold it back in. |
| **clone** | Take your own copy of a repository, history and all, onto your computer. |
| **push** | Send the save points on your computer up to the online copy. |
| **pull request** | A proposed set of changes, shown against what is there now, for someone to read and accept or reject. |
| **markdown** | Plain text with a few punctuation marks that mean headings, lists and links. Every file in this repo is markdown. |
| **front matter** | The small block of tags at the top of a file: what it is, when it was updated, whether it is confirmed. |
| **plain text** | A file with no hidden formatting — what you see is all there is. Cheap to read, and openable by anything. |
| **token** | The unit text is counted in, roughly a word or a piece of one. Everything read and everything written is counted this way. |
| **context** | The working memory for a single question — your instruction plus every file it opened — and it is finite. |
| **prompt** | The instruction you give it. A written-down instruction you reuse is also called a prompt — that is what `prompts/` holds. |
| **agent** | An AI that does more than answer: it reads, decides an order, runs steps and reports back, stopping for your approval. |
| **model** | The AI itself. The tool is the window you drive it through; the model does the reading and the writing. |
| **API** | A way for one piece of software to talk to another directly, with no person in the middle. |
| **open source** | Files anyone may read, copy and change, under a stated licence. This repo is open source. |
| **local versus cloud** | Local means it runs on your computer and your files stay there. Cloud means it runs on someone else's, over the internet. |

---

## Where to go next

- [ai-basics.md](ai-basics.md) — the same ground as a narrative, read once, start to finish
- [../QUICKSTART.md](../QUICKSTART.md) — the first hour, with the words on this page put to use
- [method.md](method.md) — why the system is shaped this way, in six ideas
- [safety.md](safety.md) — the guardrails, before any tool gets write access to your files
- [../prompts/INDEX.md](../prompts/INDEX.md) — the tasks themselves, and the order to run them in
