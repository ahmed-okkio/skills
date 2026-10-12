---
name: to-spec
description: "Turn the current conversation into a spec: no interview, just synthesis of what you've already discussed. Phased tracer-bullet stories with Gherkin acceptance criteria."
disable-model-invocation: true
---

This skill takes the current conversation context and codebase understanding and produces a spec. Do NOT interview the user; just synthesize what you already know. The decisions can come from anywhere — a `grilling` session, an ad-hoc conversation, a design doc, or the user stating them now. Anything genuinely unresolved goes under **Open Questions**, never guessed.

## Process

1. Explore the repo to understand the current state of the codebase, if you haven't already. Use the project's domain glossary vocabulary throughout the spec, and respect any ADRs in the area you're touching. Look for opportunities to prefactor the code to make the implementation easier. "Make the change easy, then make the easy change."

2. Sketch out the seams at which you're going to test the feature. Existing seams should be preferred to new ones. Use the highest seam possible. If new seams are needed, propose them at the highest point you can. The fewer seams across the codebase, the better - the ideal number is one.

   Check with the user that these seams match their expectations. This is the only check-in.

3. Draft the stories as **tracer bullets**.

   <vertical-slice-rules>

   - Each slice cuts a narrow but COMPLETE path through every layer (schema, API, UI, tests): vertical, NOT a horizontal slice of one layer
   - A completed slice is demoable or verifiable on its own
   - Each slice is sized to fit in a single fresh context window
   - Any prefactoring should be done first

   </vertical-slice-rules>

   Give each story its **blocking edges**: the other stories that must complete before it can start. A story with no blockers can start immediately. Order the list blockers-first so every story is grabbable the moment its blockers land.

   **Wide refactors are the exception to vertical slicing.** A **wide refactor** is one mechanical change (rename a column, retype a shared symbol) whose **blast radius** fans across the whole codebase, so a single edit breaks thousands of call sites at once and no vertical slice can land green. Don't force it into a tracer bullet; sequence it as **expand–contract**. First expand: add the new form beside the old so nothing breaks. Then migrate the call sites over in batches sized by blast radius (per package, per directory), each batch its own story blocked by the expand, keeping CI green batch to batch because the old form still exists. Finally contract: delete the old form once no caller remains, in a story blocked by every migrate batch.

4. Write the spec using the template below, as one markdown file. Put it where the repo already keeps specs (an existing `docs/specs/`, `docs/SPEC-*.md`, or equivalent). If no such place exists, ask the user for the path. Name it `SPEC-<feature-slug>.md`.

## Guardrails

- **Provenance.** Every requirement, decision and story traces to something said in the conversation or found in the code. A gap becomes an Open Question.
- **Size the spec to the decisions made.** Few decisions, small spec.
- **No file paths or code snippets** anywhere in the spec. They may end up being outdated very quickly. Exception: if a prototype produced a snippet that encodes a decision more precisely than prose can (state machine, reducer, schema, type shape), inline it within the relevant decision and note briefly that it came from a prototype. Trim to the decision-rich parts, not a working demo, just the important bits.
- **The story breakdown is a proposal.** The user reorders, merges or splits by editing the file.

<spec-template>

## Problem Statement

The problem that the user is facing, from the user's perspective.

## Solution

The solution to the problem, from the user's perspective.

## Constraints

Requirements that bind every story rather than any one of them: behaviour that must stay unchanged, promises that must hold on every platform, interfaces that must not move. Same format as a story requirement (below). Typically three to five; a constraint that only one story can break belongs in that story instead.

## Stories

Stories in dependency order, blockers first. Each story:

### S<N> — <Story title>

**What it delivers:** the end-to-end behaviour this story makes work, from the user's perspective, not a layer-by-layer implementation list.

**Blocked by:** S<n>, S<m> — or "None (can start immediately)".

**Requirements:** every requirement this story satisfies, one bullet each, in the format:

- As a <actor>, I want <feature>, so that <benefit>

<requirement-example>
- As a mobile bank customer, I want to see balance on my accounts, so that I can make better informed decisions about my spending
</requirement-example>

Be extremely extensive: every behaviour the conversation touched appears as a requirement on exactly one story, or under Constraints. A story carrying more than about ten requirements is a sign it should split.

**AC:**

```gherkin
Scenario: <title naming the outcome, e.g. "Balance shows after login">
  Given <starting state>
  When <the actor acts>
  Then <what the actor observes>
```

Every scenario carries a title naming its outcome. One scenario per observable outcome; several scenarios per story is normal. Use `Scenario Outline` with an `Examples` table when the same behaviour spans a set of inputs. A story is done when every scenario passes at the agreed seam.

## Out of Scope

A description of the things that are out of scope for this spec.

## Open Questions

Anything genuinely unresolved: questions the conversation never settled, testing the user has not decided, seams still in doubt. Each question names what decision is needed and who owns it.

## Implementation Decisions

A table of implementation decisions that were made, one row per decision:

| Decision | Choice | Why | Rejected |
|---|---|---|---|

Decisions can include:

- The modules that will be built/modified
- The interfaces of those modules that will be modified
- Technical clarifications from the developer
- Architectural decisions
- Schema changes
- API contracts
- Specific interactions

**Rejected** names the alternatives considered and the reason each lost, so nobody relitigates them. A decision that never had an alternative leaves the column blank.

## Testing Decisions

A list of testing decisions that were made. Include:

- A description of what makes a good test (only test external behavior, not implementation details)
- The agreed seams, and which modules will be tested at each
- Prior art for the tests (i.e. similar types of tests in the codebase)
- **Run location** per kind of test: laptop build-only vs VM / installed build
- **CI gates** the work must pass before merge

Requirements and acceptance criteria live on each story above; acceptance criteria are written in **Gherkin**. Scenarios describe observable behaviour: what the actor does and what they can then see or do, never which function was called.

## Further Notes

Any further notes about the feature.

</spec-template>
