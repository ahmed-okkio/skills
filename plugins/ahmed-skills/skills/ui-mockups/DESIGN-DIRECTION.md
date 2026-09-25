# Design direction

How the options on a mockup page get designed, as distinct from how they get rendered — the frontend-design discipline (distinctive, intentional choices instead of templated defaults) fitted to a page whose job is to let someone choose.

**Grounding fixes the frame, design fills it.** Platform chrome, neighbouring controls, geometry and shipped fonts are measured facts, reproduced exactly. The *delta under decision* — the control, row, dialog or treatment the axis asks about — is where design happens. On a greenfield surface the frame is the project's existing idiom and everything inside it is open.

## Pin the subject before drawing

Name, in one line each: what this surface is, who uses it and in what posture (a sysadmin triaging at 07:00 on a 1366×768 laptop is not a designer browsing on a 5K display), and the single job the surface has to do. Every option on the page is judged against that job. If the brief does not pin these down, pin them yourself, say so in the report, and use whatever the project already ships as the hint for palette, fonts and idioms.

## Every option has a premise

An option is a *premise*, not a restyle: one sentence naming what is different and why that difference might win. The premise is the `why`; the honest cost is the `whyNot`. Before drawing, write the premise and the token delta it needs (which colour, weight, size, shape, placement or wording changes — usually one or two). An option whose premise cannot be written in one sentence is two options or none.

Then run the genericness check on each: *would I have drawn this for any similar brief?* If yes, it is the baseline — allowed once per axis, chipped `cheap`, placed first. Sixteen baselines are one option drawn sixteen ways. Reach instead for: asymmetry of weight and rank; a different *shape* rather than a different colour; merging two controls; moving one somewhere else entirely (header, footer, into the input, onto each row); progressive disclosure; type hierarchy alone; wording alone; vertical for horizontal; deleting the control outright, offered honestly; and the cheapest possible fix, so the user can judge whether cheap wins.

## The defaults to refuse

Three looks appear in generated UI regardless of subject: a warm cream background with a high-contrast serif and a terracotta accent; near-black with a single acid-green or vermilion accent; a broadsheet of hairline rules, zero radius and dense columns. Each is legitimate for some brief. None is a choice unless the brief or the grounding demands it. Where the grounding leaves an axis free, do not spend that freedom on one of these. The same goes for the smaller tics: a gradient accent, `01 / 02 / 03` markers on content that is not a sequence, a big number with a small label, a card grid where a list was the honest shape.

## Typography is an axis too

Within the fonts the app ships, weight, size, width, tracking and case are design material. An option that changes only the type hierarchy — demotes a label, promotes the value, tightens a caption — is legitimate, cheap and often the winner. Offer one. Where the platform supplies a variable face (Segoe UI Variable, Bahnschrift, SF Pro), its axes are available; a stand-in glyph or face is declared once in the footer, never substituted silently.

## Structure must encode something true

A numbered marker means order matters. A divider means the two sides differ in kind. An eyebrow means the label is a category the reader navigates by. Use each only when the content makes it true; question every one before it goes in. A mockup that decorates with structure teaches the user to ignore structure in the real product.

## Words are design material

The sample content and every string on the mock — labels, hints, placeholders, empty states, errors, tooltips — follow one register:

- Name what the person controls and recognises, never how the system is built. *Notifications*, not *webhook config*.
- Controls say exactly what happens: *Save changes*, *Delete rule*, not *Submit*, *OK*. The same action keeps the same name through the flow: the button that says *Publish* produces a toast that says *Published*.
- Active voice, plain verbs, sentence case, no filler.
- An error says what happened and how to fix it, without apology or vagueness. An empty state says what to do next.
- One element, one job. A label labels; an example demonstrates; nothing quietly does both.

An option that differs from its neighbour by wording alone is a real option, and often the cheapest fix on the page. Offer one per axis where wording is doing work.

## Motion, if any, is one moment

Where the surface has an in-flight, transition or reveal state, a mock shows a frame of it and the recipe names the motion (duration, easing, what moves). One orchestrated moment beats scattered effects; no motion at all is often the right answer and never a failure. Every animation declared honours `prefers-reduced-motion`.

## One risk per page

At least one option on every page takes a real aesthetic risk that the agent can justify in its `why` — a bolder hierarchy, a shape the platform's stock controls do not offer, a control deleted, a layout inverted. Chip it `bold`. A page of sixteen safe options has spent its breadth on nothing; the user cannot judge whether the safe choice wins until they have seen it lose to something.

## Restraint, then critique

Spend boldness in one place per option and keep everything around it quiet. Before reporting, look at each rendered option as if it were the only one and remove one thing (Chanel's rule: one accessory off before leaving the house). Then check it against every hard state in `MOCKUP.states`: a design that survives only the tidy, three-item, idle state is not yet designed. Quality floor for the mock itself, never announced on the page: legible contrast, a visible focus ring where the real surface has one, truncation that truncates, the overflow state at roughly 3× the comfortable count.

## The signature, when the surface is greenfield

A surface being designed from nothing should end up with one element it will be remembered by, and the agreed design on the spec page should name it. A redesign of an existing surface usually should not: consistency with the app around it is the constraint, and the signature is the app's, not this screen's. Say which case applies in the report so the user knows what they are being asked to judge.
