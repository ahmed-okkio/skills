# Briefing a mockup agent

One subagent, one surface, one page built from [`assets/shell.html`](assets/shell.html).

**The brief you write carries only what is specific to this surface:** the subject line from `DESIGN-DIRECTION.md` (what, who, the one job), the grounding pack paths and its fidelity rule, the exact constant sample content, the axes with their questions, the directions you already see per axis, locks from earlier rounds, and the output path. Tell the agent to read this file and [`DESIGN-DIRECTION.md`](DESIGN-DIRECTION.md) itself. Never paste either into the brief.

**One axis per independent decision.** If the user could want option X of one choice with option Y of another (an icon, and separately how the read-only state shows), those are two axes. Never make them combinations within one axis. Each axis's options vary only that axis and draw the others at today's look.

## Build the page

The shell's viewer code is never read, copied or rewritten. The agent owns two files:

1. `node <skill>/assets/build.js <workdir>` (`<skill>` is this skill's folder) — writes `tokens.css` and `data.js` (the built-in demo) into `<workdir>` and prints the data contract. The contract and the demo are the whole API.
2. Replace both files wholesale for the real surface: grounded tokens and mock CSS in `tokens.css`; `var MOCKUP={...}` in `data.js`.
3. `node <skill>/assets/build.js <workdir>/tokens.css <workdir>/data.js <page>.html` — splices them into a copy of the shell.
4. Run `?selftest` (see `SKILL.md`), fix `data.js` / `tokens.css`, rebuild. Repeat until green.

A viewer bug is a shell bug: report it back rather than patching the generated page.

## The text budget

The page is looked at, not read. Enforce these literally — "less text" without a number gets ignored:

- **Option title: max ~6 words**, plain, self-explanatory. The shell prints the id (`P1`, `C05`) beside it; the id is how the user names the slide back.
- **Chips: 1-3 words each, max 3 per option** — the whole cost vocabulary: `cheap`, `stock control`, `custom-drawn`, `breaks test id`, `+1 keystroke`, `bold`, `wording only`, and the reused idiom.
- **Axis question: max ~8 words** — "How does it show it's working?".
- **`why` is the premise, one sentence; `whyNot` is the honest cost, one sentence.**
- **No paragraphs in the selection area**, nothing that repeats the picture. A fact needing a sentence goes in `why`/`whyNot` or `MOCKUP.footer`.

The build recipe (`recipeFor`) is the one place detail runs full: the concrete build for that option only — control or style used, exact new or changed strings, new glyphs, files to touch, automation-id consequence, capability kept/moved/dropped. Never a restatement of unchanged grounded constants.

## What every design obeys

**One root.** `renderSurface()` returns a single `.surf` element filling the declared width and height; the selftest finds the surface through it. A page whose axes draw different surfaces branches on `probe.axis`, never on guesses from `optionIds`.

**Grounded.** Measured tokens, geometry, platform chrome, real control names, ids, roles, strings, section order and box metrics, exactly. Anything the grounding pack could not resolve is declared once in `MOCKUP.footer`, never silently substituted.

**Constant sample content** — the same rows, paths and labels in every design, so designs differ only by design.

**Identical geometry.** Every design renders at today's box metrics, so compare-with-today shows the real delta. The affordance under decision may change size — that *is* the delta — everything around it holds still.

**Every hard state** in `MOCKUP.states`, driven for all designs at once: empty, populated, overflow at ~3× the comfortable count, no optional attribute set, a name long enough to truncate, disabled, in-flight, error, hover, keyboard cursor. A design that only changes when something is pending still has a resting look, and that look is valid. Only a state that truly cannot exist goes in an `unavailable` map, on the axis when it holds for the whole question, on the option when it holds for one design; the shell then never offers it. A question judged in one state sets `state` on its axis (or option), so it opens there.

**Every form factor.** A surface used at more than one geometry declares `MOCKUP.viewports`. Branch `renderSurface` on the viewport id only where a form factor genuinely rearranges.

**Future things greyed** — planned but unbuilt parts appear present and plainly unavailable, so the design is judged at its eventual size.

## The deck

**10-16 options per page**, per the premises in `DESIGN-DIRECTION.md`. Invent beyond the directions in the brief.

**Cheapest first** within each axis — smallest change, least rebinding at the front.

**One `recommended` per axis.** Nothing is pre-selected; the user chooses.

**Declare foreclosure.** An option that moots another axis (deleting a control moots its placement and feedback) lists those axis ids in `forecloses` with a `foreclosedReason`.

**Locks are not axes.** Decisions settled in earlier rounds are drawn fixed and named in `intro`; offering one as a choice reopens closed work. An axis explored on an earlier page and still open is rendered here, so one page holds every remaining decision.

**Refine rounds** set `MOCKUP.multi: true` (or `multi: true` on one axis) when the brief asks for a shortlist.

**Rule-out, notes, compare and picking are the shell's.** Build no second mechanism for any of them.

**Headless screenshots:** `?zoom=<optionId>&st=<stateId>&vp=<viewportId>`; `__today` for the baseline, `__combo` for the picks panel.

## Report back

File path; the option list in order; which options actually solve the problem; the bold one and what its risk buys; the baseline; greenfield or redesign; any option the plumbing forbids; the `?selftest` result and what remains unverified. Not the transcript.
