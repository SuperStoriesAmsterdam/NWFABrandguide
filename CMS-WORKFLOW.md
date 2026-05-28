# NWFA — Content Workflow

A briefing for the project manager. How content gets onto the NWFA website, who owns what, and how we build the system together.

---

## What we're building

The NWFA site has three jobs that look the same to a visitor but are very different under the hood:

1. **Editorial content** — homepage, about page, dinner page, etc. The brand-shaped writing. Peter + designers + writers own this.
2. **Listed records** — winemakers and workshops. Structured data that grows each year. Distributors and workshop hosts submit it; you review and polish it.
3. **Ticket sales** — handled entirely by Eventix. We just link to it. Nothing for the site to manage.

For (2) we do NOT want you, distributors, or workshop hosts touching HTML, Sanity schemas, or any code. We want a form that anyone can fill in, including people who have never used a digital tool more complex than email. That's why the system has two pieces.

---

## The architecture in one picture

```
  DISTRIBUTOR / HOST                YOU (PM)                      THE SITE
  ──────────────────                ────────                      ────────

  fills Airtable form    →    triage in Airtable
                              fix typos, ask for
                              better photos
                                    │
                                    ▼
                              click "approve"
                                    │
                                    ▼
                              record lands in
                              Sanity as a draft
                                    │
                                    ▼
                              polish in Sanity Studio
                              - translate to Dutch
                              - set photo focal point
                              - link to host / workshop
                                    │
                                    ▼
                              hit publish              →    site rebuilds in ~60s
                                                            published in EN + NL
```

Two systems, one direction of flow. **Airtable is the inbox. Sanity is the truth.**

---

## The three layers

### 1. Airtable — the inbox

Where new content arrives. Two bases:

- **Winemakers** — a form for distributors. They fill in: producer name, country, region, farming style, importer, photo, short bio. One row per submission.
- **Workshops** — a form for hosts. They fill in: title, host name, time, duration, short description, photo, language.

**Key principle:** Airtable forms are designed for the least tool-literate person on the chain. Plain-language labels. Mobile-first. Drag-and-drop photo upload. Every field has help text. No login.

Your time in Airtable is mostly spent **triaging**: opening each submission, fixing typos, requesting better photos when needed, marking submissions as "ready" or "needs work."

### 2. Sanity — the source of truth

Where approved content lives. When you mark a row "ready" in Airtable and hit approve, a small automation pushes it into Sanity as a draft. From there:

- You polish in Sanity Studio (the editing dashboard).
- You add the Dutch translation alongside the English.
- You set the photo's focal point so it crops well on mobile and desktop.
- You link the workshop to its host winemaker, so the site can show "this workshop is led by Movia."
- You hit publish.

After this point, the Airtable row is **frozen**. The site never reads from Airtable. All future edits — even years later — happen in Sanity.

### 3. The site — Astro + Sanity

The visitor-facing website, built with Astro, reading from Sanity. Publishing in Sanity triggers a rebuild; the change is live in about 60 seconds.

You never edit the site directly. By design.

---

## Who does what

### Distributors

- Fill in the Airtable winemaker form. One submission per producer.
- That's it. No login, no account, no second visit unless we specifically ask for a better photo.

### Workshop hosts

- Fill in the Airtable workshop form. Same simplicity as the winemaker form.
- Photos optional but encouraged.

### You (project manager)

- **Triage Airtable submissions** — fix typos, request better photos when needed, mark "ready."
- **Approve to Sanity** — one click moves the row into Sanity as a draft.
- **Polish in Sanity Studio** — write or paste Dutch translations, set image focal points, link workshops to winemakers, hit publish.
- **Maintain the Airtable forms** — when a distributor says "I didn't understand the 'farming' question," update the help text.
- **Be the single point of contact** for distributors and hosts. They never get bounced to Sanity. Keep their experience simple.

### Peter

- Owns design and brand direction.
- Reviews finished pages, drops review notes via the annotate widget.
- Decides what content campaigns to run each edition.
- Approves the first published page per content type before it goes wide.

### Claude Code + Peter (engineering side)

- Build and maintain the codebase: the site itself, the Sanity schemas, the Airtable → Sanity sync.
- Set up deployment so changes in Sanity rebuild the site automatically.
- Adjust schemas when content needs change.
- Help when something doesn't work.

---

## How we work together via Claude Code

You will most likely never need to touch the code yourself. But the engineering happens through Claude Code, so understanding the rhythm helps.

**Most of the time, you don't need Claude Code at all.** Triaging Airtable, polishing in Sanity, publishing — all of that happens in those tools. Nothing technical.

**When you need to escalate to Peter:**

- A new field is needed (e.g. distributors keep mentioning "biodynamic certification body" and there's no field for it).
- A new content type needs to exist (e.g. we want "importer" as its own record type with its own pages).
- Something is broken — a row was approved but didn't appear in Sanity, a published page looks wrong, the sync hasn't fired.

When that happens:

1. You write a short, plain-language note to Peter describing what you need.
2. Peter opens a Claude Code session and makes the change with me.
3. We test, deploy, and tell you when it's live.
4. Most schema changes take less than an hour.

You should never feel like you're waiting weeks for engineering. This is a small system and Claude Code makes the iteration time fast.

---

## A typical content update — walked through

A distributor sends in a new winemaker submission via the Airtable form. Here's what happens:

1. **Submission arrives.** A new row appears in the Airtable Winemakers base.
2. **You triage.** You open the row. The bio is too short. The photo is sideways. You email the distributor: "Can you send us a portrait-orientation photo and three more sentences about how they farm?" Two days later, they reply.
3. **You update the row** with the new info and mark it "ready."
4. **You click "approve."** Automation pushes the row into Sanity as a draft.
5. **You open Sanity Studio.** The draft is waiting. You:
  - Translate the bio into Dutch (or paste the Dutch version the distributor already provided).
  - Set the focal point on the photo so the face stays in frame on mobile crops.
  - If this winemaker is hosting a workshop, link the workshop record to them.
6. **You hit publish.** The site rebuilds. ~60 seconds later, the new winemaker is live in both English and Dutch.
7. **Done.** Next submission.

Total time: 5–10 minutes per winemaker if the data is clean. Longer if you have to chase the distributor for better content.

---

## What NOT to do

- **Don't edit a published winemaker in Airtable.** Once it's in Sanity, Sanity is the truth. Old Airtable rows become archive — don't touch them.
- **Don't manually copy data from Airtable to Sanity.** Always use the "approve" button. Manual copy creates drift and inconsistency.
- **Don't ask distributors to log into Airtable or Sanity.** Ever. They submit via the public form URL. No account, no friction.
- **Don't change schemas in Sanity Studio yourself.** Sanity will let you add fields through its UI, but a field added there without a code change won't render on the website. Always escalate schema changes to Peter so they happen in code together.
- **Don't try to fix engineering problems by editing things directly.** Even if it looks like a small fix. Escalate. The cost of a wrong edit is much higher than the cost of waiting an hour for Peter and me.

---

## Timeline & sequencing

We build this in phases. The order matters.


| Phase                 | What happens                                                                                                                                                                                                       | Who                                                      |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------- |
| **1 — now**           | Finalize site design. CMS work has NOT started. We need to know what fields the pages need before we model the data.                                                                                               | Peter + Claude Code                                      |
| **2 — design locked** | Peter + Claude Code draft a single paired document containing **both** the Airtable form fields **and** the Sanity schemas, designed together so the mapping is obvious. You see this doc before any build starts. | Peter + Claude Code, reviewed by you                     |
| **3 — build**         | We rebuild the site as Astro + Sanity. You build the Airtable bases following the brief. We set up the sync. We test together with dummy submissions.                                                              | Peter + Claude Code build code; you build Airtable bases |
| **4 — go live**       | First real distributors get the form URL. You triage. Content goes live. We iterate from your feedback.                                                                                                            | You operate; Peter + Claude Code support                 |


**This is the first of a planned series of 2–3 sites built on Sanity.** Whatever we learn here makes the next project faster. Write down anything that confused you so we improve the brief for next time.

---

## Questions, escalations, what to do when stuck


| Situation                                                                             | What to do                                                                                         |
| ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Content question (a distributor is confused, a field isn't clear)                     | Email Peter                                                                                        |
| Something is broken (sync didn't fire, published page looks wrong, Studio won't load) | Email Peter — he'll open a Claude Code session                                                     |
| Wishlist item ("I wish the form did X")                                               | Write it down. Bring it up at your regular sync with Peter                                         |
| You're not sure if something is your job or engineering's                             | Default to asking Peter. The cost of one email is much less than the cost of doing the wrong thing |


Do not try to fix engineering issues by editing schemas or code yourself. That's not your job — it's ours.

---

## The principles, in one paragraph

Airtable is the inbox; Sanity is the truth; the site reads from Sanity. Sync is one-way only. Distributors never log in. The form is dead simple. You are the single point of contact for content submitters. Engineering is one Claude Code session away when you need it. Design comes before schemas. Schemas are always drafted as a paired Airtable + Sanity document, never one without the other.

That's the whole system.