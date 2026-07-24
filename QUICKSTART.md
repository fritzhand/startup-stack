# Quickstart — your first hour

The goal of your first session is a **skeleton, not a cathedral**. Folders, a summary file in each, an index, and a context page. Everything after that is enrichment, and enrichment never ends.

If you try to finish the stack today you will not finish it, and you will conclude the method does not work. It works. It just does not work in one sitting.

---

## What you need before you start

**A paid AI subscription.** Free tiers cannot do this. The work is long-context and file-heavy, and it will exhaust a free allowance in the first twenty minutes. Budget for a paid plan on the order of a normal monthly software subscription — the exact figure depends on the provider and tier, and heavy bootstrap sessions can use more than an entry tier allows, so check before you rely on it.

**A tool that can see your files.** A chat window in a browser is not enough — you need the AI working on top of a folder on your computer. Any of these work:

| Tool | Good for |
| --- | --- |
| Claude desktop app | Non-technical founders. Point it at a folder, talk to it. |
| ChatGPT Codex app | Same, if you are already in the OpenAI ecosystem. |
| Claude Code / Gemini CLI | Faster and cheaper at scale; comfortable in a terminal. |
| Cursor / Windsurf | If you already live in a code editor. |

**A folder of raw material.** Imperfect is fine. Imperfect is the head start.

**Thirty minutes of reading first.** [docs/safety.md](docs/safety.md). Handing an AI write access to your files is powerful and it is exactly where things go wrong. Four rules, one page, read them.

---

## Step 1 — Take a copy (5 min)

```bash
git clone https://github.com/fritzhand/startup-stack my-company-stack && \
  cd my-company-stack && \
  rm -rf .git && git init && \
  git add -A && git commit -m "Empty stack"
```

The commands are chained with `&&` so that if the clone fails, nothing after it runs — in particular `rm -rf .git` never fires in the wrong directory. Committing the empty state first means you can always see what the AI changed.

If `git` is not part of your life, downloading the ZIP and unzipping it to your Desktop is genuinely fine. You lose the ability to undo a bad AI edit cleanly, so back the folder up before Step 3.

Two folders in the copy belong to this project rather than to your company — `web/`, which builds this project's own website, and `.github/`, which publishes it. Delete both. `tools/` is optional and worth keeping: one script that turns a website into material for your inbox.

```bash
rm -rf web .github
```

## Step 2 — Fill the inbox (20 min)

Put everything that describes the business into `_inbox/`. Do not sort it. Do not clean it. Sorting is the AI's job. If you are not sure how to get something out of your mail, your drive or a chat app, [docs/getting-material-in.md](docs/getting-material-in.md) covers it source by source.

Good raw material, roughly in order of how much it is worth:

- **Call transcripts and meeting notes** — the single highest-value input. They contain what people actually said, not what a deck claims.
- **The pitch deck**, current and every dead version
- **Business plan**, financial model, any spreadsheet with real numbers in it
- **Market research and deep-research reports** — the ones you commissioned or generated and then never re-read
- **Competitive intelligence** — screenshots, price lists, competitor sites, that WhatsApp message where someone told you about a new entrant
- **Customer conversations** — emails, WhatsApp exports, support threads, interview notes
- **Supplier quotes, invoices, purchase orders, rate cards**
- **Your website**, exported or just its URL — and your competitors'. [`tools/scrape-site.mjs`](tools/) will fetch a site into `_inbox/` as citable markdown if you would rather not copy pages by hand; see [docs/scraping.md](docs/scraping.md).
- **Brand and design references** — logo files, colour codes, a screenshot of a page you like
- **Registration documents** — incorporation certificate, GST, trademark filings, shareholding

Two things worth doing while you gather:

**Rescue the pictures.** A chart inside a PowerPoint or a PDF is invisible to text extraction — the AI reads the words around the graph and misses the numbers *in* it. If a chart matters, export it as an image and drop the image in `_inbox/` alongside the file. Ask the AI to read the picture.

**Prefer plain text where it is free.** `.md` and `.txt` are lighter and cheaper for the AI to read than `.docx` and `.pdf`. Do not spend an hour converting things — Word documents are fine as they are — but if something is already text, keep it text.

## Step 3 — Run the bootstrap prompt (20 min of AI time, 0 of yours)

First, point your AI at this folder — *this folder only*. How you do that depends on the tool:

- **Claude desktop app / ChatGPT Codex app:** open the app, start a new project or chat, and add this folder as the working directory or project files (look for "add folder", "project", or a folder icon). Grant access when it asks.
- **Claude Code / Gemini CLI:** open a terminal, `cd` into `my-company-stack`, and start the tool there. It works in whatever directory you launch it from.
- **Cursor / Windsurf:** File → Open Folder → choose `my-company-stack`.

If the tool offers a permission or allow-list, scope it to this folder and nothing wider. See [docs/safety.md](docs/safety.md).

Then paste [`prompts/00-bootstrap-the-stack.md`](prompts/00-bootstrap-the-stack.md) as your message.

It will:

1. Read a sample of everything in `_inbox/`
2. Write `stack/CONTEXT.md` — the one page that describes your company
3. Fill in each of the ten `stack/` sections from what it found
4. Tag every claim `needs-verification` or `tbd` — never `source-of-truth`, which only you can set
5. Write `stack/INDEX.md` — the router that makes the whole thing cheap to use
6. Hand you a list of the biggest gaps

Watch what it does. Read the prompts it shows you before approving them. This is not a moment to click through.

## Step 4 — Correct it (15 min today, more later)

Open `stack/CONTEXT.md` first. It is one page. Read every line.

The AI will have got things wrong. Not slightly wrong — confidently, specifically wrong, in your own voice, with a plausible number attached. This is normal and it is why the status tags exist.

Today, fix only `CONTEXT.md`. Change `status: needs-verification` to `status: source-of-truth` on the lines you have personally confirmed. Leave everything else tagged.

Then commit:

```bash
git add -A && git commit -m "Stack v0.1 — bootstrapped and context page corrected"
```

**You are done with hour one.** You now have a working knowledge base. It is 40% right, and it knows which 40%.

---

## What comes next, and in what order

| When | Do this | Prompt |
| --- | --- | --- |
| This week | Find out what is missing and how bad the gaps are | [`02-gap-scan.md`](prompts/02-gap-scan.md) |
| This week | Correct the two or three sections that matter most for what you are doing right now | — |
| Week 1 | First weekly recap. Establish the rhythm before you have anything impressive to report. | [`12-weekly-recap.md`](prompts/12-weekly-recap.md) |
| Week 2 | Whatever the gap scan said was your biggest hole — usually unit economics or competition | [`07-unit-economics.md`](prompts/07-unit-economics.md), [`05-competitive-intelligence.md`](prompts/05-competitive-intelligence.md) |
| Ongoing | Every meeting transcript goes through this and lands back in the stack | [`14-meeting-to-actions.md`](prompts/14-meeting-to-actions.md) |
| Before you raise | The adversarial pass — what an investor will attack | [`13-mentor-review.md`](prompts/13-mentor-review.md) |

---

## Four ways people get this wrong

**Trying to finish it.** The stack is a living document. `needs-verification` tags are not debt; they are the map of what you do not yet know about your own company. Founders who treat the stack as a document to complete abandon it in week two.

**Letting the AI invent numbers.** If the model produces a market size, a CAC, or a margin that did not come from a file in `_inbox/` or from your mouth, it is a guess wearing a number's clothes. Every number in the stack must be traceable to a source or marked `tbd`. The prompts enforce this; do not override them.

**Building the deck first.** A pitch deck built on an uncorrected stack is a very fast way to produce a very confident wrong document. Correct the stack. Then build the deck — it takes an hour.

**Skipping the pulse.** The weekly recap feels like overhead in week one, when nothing has happened. It is the only part of this system that compounds. Do it in week one precisely *because* nothing has happened — the discipline is what you are building, not the report.

---

Next: [docs/method.md](docs/method.md) — why this works, in enough detail that you could rebuild it from scratch.
