---
name: ui-mockups
description: Mock up UI options as standalone HTML the user opens in a browser, for any surface (web, WPF/WinForms, mac, TUI, mobile), then narrow to one agreed design. Use when the user asks to "mock it up", wants to see or compare UI options, asks what a screen/dialog/menu should look like, dislikes how something looks, or when another skill needs a mockup so a design question can be answered by looking.
---

Mock up **every** viable option, let the user look, then narrow. The user decides by seeing, not by reading your description of what they would see.

HTML is always the **medium** — the browser is the universal picture viewer. The **surface** being mocked can be anything: a web page, a WPF dialog, a mac menu, a TUI. A native surface mocked in HTML at its real geometry, colors and fonts is judged exactly like a web one.

The page is for **looking and selecting**. A user who wanted prose would talk to you instead — they already are. Every word on the page is a labelling aid; the pictures carry the meaning, and the copy-back block at the end carries the build.

Four failure modes govern everything here, all learned the hard way:

- A mockup that does not match the real UI gets rejected wholesale — the user cannot map it to what they have.
- A mockup that silently drops a capability gets rejected too — "where did the thing I use go?".
- A page that reads as a document gets skimmed, not answered.
- A page of sixteen restyles of one idea gets answered in one second and teaches nothing — the user cannot tell whether the safe option wins until they have seen it lose to something.

## The shell owns the page

[`assets/shell.html`](assets/shell.html) is a working, debugged slide-deck harness: one option per near-full-viewport slide, picking, rule-out, notes, compare-with-today, state and viewport toggles, the copy-back block, and `?selftest`. Its header comment is the data contract. Every viewer bug is one the shell already fixed, and its chrome is deliberately quiet so the slides are judged, not the deck.

Pages are **built, never hand-copied**: an agent writes only the author-owned tokens and `MOCKUP` data, and [`assets/build.js`](assets/build.js) splices them into the shell (steps in [`MOCKUP-BRIEF.md`](MOCKUP-BRIEF.md)). Nobody reads or rewrites the shell's viewer code to make a page.

When a run exposes a shell bug, **fix the shell**. A workaround in a generated page fixes one file and leaves the next run to rediscover it.

## Design the options like a designer

Every option carries a one-sentence premise, survives the genericness check, and one per page takes a justified risk. [`DESIGN-DIRECTION.md`](DESIGN-DIRECTION.md) holds the discipline; read it before writing a brief.

## The loop

**1. Ground yourself in the real surface.** If the thing being redesigned exists, extract it verbatim before drawing anything, once — the pack is cached and reused by every page, round and session: read [`GROUNDING.md`](GROUNDING.md) and take the branch matching the source — web (live CSS/DOM) or native (screenshots + accessibility tree + toolkit source). A surface that ships at more than one form factor (desktop + mobile web, a responsive app) is grounded at each geometry; they become `MOCKUP.viewports`. Greenfield — nothing implemented yet — skips this step and takes its palette, fonts and idioms from whatever the project already ships.

**2. Inventory the capabilities — for yourself, not for the page.** List everything the surface does today: every mode, key, row type, badge, empty state, and every automation id a test depends on. Check each design against every item so none silently drops one. This never renders. Where a drop is a real cost of choosing a design, it surfaces as a chip on that option (`breaks test id`, `no manual refresh`) and in that option's recipe deltas.

**3. Fan out wide.** Dispatch subagents in the background, one per surface, each building one page of genuinely different premises — not restyles of one idea. How many is the agent's call: as many as the question has real premises. Write each brief per [`MOCKUP-BRIEF.md`](MOCKUP-BRIEF.md): surface-specific facts only, with the agent told to read `MOCKUP-BRIEF.md` and `DESIGN-DIRECTION.md` itself.

**4. Open each file as it lands** and relay the option list in one short message — the map, not a description of each slide. Name the one option that took the page's risk and the one that is the cheapest fix. The user is looking at the page.

**5. Narrow in rounds — resume, don't respawn.** The user pastes the copy-back block; you restate their picks as **locks** and never offer them again. Send the next round to the agent that built the page (`SendMessage` to its id) with the locks, the copy-back and the axes still open — one page for every remaining decision. It already holds the docs, the contract and its own `data.js`, so it edits, rebuilds and retests instead of starting over. Spawn a fresh agent only when that one cannot be resumed (a new session) or the round needs a different surface. Treat a note as an amendment to the choice it sits on: it may change that option's meaning, and it may apply beyond the axis it was typed on. A block headed `mode: refine (multi-select)` is a shortlist, not a decision: every id it lists per axis stays in the next round, everything else is dropped. A `RULED OUT:` line names options the user has eliminated: they never appear again, and a note beside one (`A3 (note: no, but keep the footer time)`) is a requirement carried forward to the survivors. An `OVERALL NOTES:` block is free text: apply each line to the question or option it names, or to the whole round when it names none.

**6. Offer the signable spec — ask, never default.** Once every axis is locked, ask the user whether they want a spec page; build it only on a yes, by resuming the same agent. It is one page, the one agreed design, every state, a code-change list pinned to real files, and the open questions the render exposed. See [`SPEC-PAGE.md`](SPEC-PAGE.md).

Done when no design question is still open and, if the user asked for a spec page, it is approved.

## Rules that hold at every step

**Reuse beats invention.** A variant built from an idiom the app already ships — its menu surface, its row shell, its form rows — wins on cost and on consistency. Say which idiom an option reuses, in a chip.

**Only buildable options.** Gather the structural constraints first — what the target platform allows: on web, what the DOM permits and what CSS a neighbouring element already claims; natively, what the toolkit's stock controls ship versus what would be custom-drawn. Chip any option needing new structure, so cost is visible while choosing rather than after. An option whose premise the plumbing forbids — a per-row action when the service call fetches the whole list — is a picture that cannot be built: say so when you relay it.

**Open every question in its state.** A question that is only answerable in one state (in-flight feedback, error wording, the empty state) sets `state` on its axis, or on the one option that needs it, and the shell selects that state on entry. The user can still toggle away.

**Never show an invalid slide.** A slide drawn in a state it cannot be in (crossed out, blank, "n/a") wastes a look and reads as broken. Either the state is valid and gets drawn properly, or it is declared `unavailable` (on the axis for the whole question, on the option for one design) and the shell disables that toggle and switches to a valid state automatically. `?selftest` fails a slide drawn in an unavailable state, a pinned state that is unknown or unavailable, and a question that does not open in its pinned state.

**Verify with `?selftest`.** You have no browser. Open the generated page with `?selftest` appended and read its report before relaying, then state plainly what remains unverified. The text-overlap scan ignores text an opaque later layer covers (a scrim, a modal box), so a modal over a busy surface is not a failure; two texts colliding in the same layer is. Headless, in one call: `node <skill>/assets/selftest.js <page>.html` prints the report and exits 1 on FAIL (it finds Chrome or Edge itself; `--dump-dom` prints nothing on Windows, so do not use it). What it cannot check — colours taken from platform reference values rather than a screenshot are the usual one — you state.

**Diagnose with a readout, not a guess.** When the user reports something visually wrong you cannot see, add a temporary on-page readout of the real numbers, ask for one line back, and strip it after. Three rounds of guessing cost more than one round of measurement.

**Artifacts live in the scratchpad (a temp folder outside the repo), never the repo.** Working design files die with the feature. Open them with `start "" "<path>"` on Windows, `open` on macOS, `xdg-open` on Linux.

**Subagents run in the background** as `subagent_type: "ahmed-skills:mockup-builder"` (file tools and Bash only, 1-hour cache so later rounds resume warm; `general-purpose` where that agent does not exist), one per surface, in a single message when independent, on the session's model: never pass a `model` override. Keep each agent's id: it owns its page for every later round. Relay their conclusions; never paste their transcripts.
