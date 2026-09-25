# Grounding

Extract the real surface **verbatim** before any mockup is drawn. A mockup built from a summary looks wrong in ways the user notices immediately and cannot articulate, and the whole page gets rejected.

Dispatch this as its own subagent; it is slow and its output is reused by every later page.

Take **one branch** below matching the source, then the shared tail.

## Read the right ref

Confirm which git ref actually holds the feature before reading a line of it. A checkout can sit on a branch predating the work, and mapping code that has since moved wastes the whole extraction. `git log --oneline --all -i --grep=<feature>` finds where it landed; read that ref with `git show <ref>:<path>` rather than switching branches.

## Branch: web (live CSS/DOM)

Three files, into the scratchpad (a temp folder outside the repo):

**`<surface>.css`** — every rule that applies to the surface and anything inside it, copied without rewriting, tidying or renaming: the container, each child, every state class, scrollbars, plus the whole `:root`/token block and the font declarations. Include rules from other stylesheets and any injected at runtime, noting each source path. Missing rules are what makes a mockup look wrong, so err toward more.

**`<surface>.html`** — the static DOM verbatim, plus, as a comment beside each dynamic container, the exact markup the JS injects: real tags, class lists, `role`/`aria-*`/`data-*`/`title`, real text content, every variant (selected, disabled, warned, empty), and the real glyph characters. Reproduce inline SVG exactly.

**Fidelity rule:** every later brief pastes this CSS into `<style>` **unchanged**; additions go in one clearly-marked EXTRA block. Real ids, classes, roles, strings and box metrics throughout. Bundled fonts will not load from a scratch folder — declare the stand-in glyphs once at the top of the page rather than silently substituting.

## Branch: native (WPF, WinForms, mac, TUI, mobile)

There is no CSS to paste; fidelity comes from **measurement**. Three artefacts, into the scratchpad (a temp folder outside the repo):

**Screenshots** — every state of the surface at 100% scale (default, selected, disabled, warned, empty, overflow, hover, focus). These are the fidelity check: the mockup sits beside them and must be hard to tell apart.

Getting them is the user's cheapest contribution and your most expensive gap, so **ask for them before deciding you cannot have them**. A native app that ships inside an installed product is not launchable from the repo — that is a reason to ask, not a reason to assume. Without them, every colour and every stock-control chrome value is a platform reference guess: say so once on the page and once when you relay it, so nobody mistakes a guess for a measurement.

**Accessibility tree** — the control structure as the platform reports it: UIA3 on Windows (Accessibility Insights / `inspect.exe` / FlaUI), Accessibility Inspector on mac, the widget tree for a TUI. This gives real control types, names, order and states — the native equivalent of the DOM.

**`tokens.md`** — the design constants from source (XAML resource dictionaries, SwiftUI/AppKit constants, theme files): exact colors, font faces and sizes, spacing and corner-radius values, control heights. Measure from the screenshots anything the source does not state.

**Fidelity rule:** every later brief reproduces the measured geometry, colors and fonts in the mock tokens block, cites `tokens.md` values by name, and renders the surface at its real pixel dimensions. Stock platform chrome (title bars, scrollbars, focus rings) is reproduced, not approximated with browser defaults.

**Measure the container, not only the controls.** The content area a design must fit inside — window size minus nav pane minus frame insets — is what decides whether an option is buildable at all. Record that number in `notes.md`, and flag any part of it the repo does not state (a pane width supplied by the platform default) as an assumption rather than a fact.

## Shared tail — every branch

**`notes.md`** — the facts a renderer needs and a summary would lose: real width/height and how many rows fit before scrolling; the order of sections top to bottom; every keybinding the surface handles with `path:line`; every real string (labels, placeholders, hints, empty states); what each mode changes; and which token resolves to which font stack.

**Report what you could not resolve.** Glyphs absent from the font, icons supplied by the host at runtime, anything that renders empty in the real app: name them. A mockup that reproduces a real emptiness is telling the truth, and these findings are often bugs worth raising separately.

**Feed it forward.** Every later brief carries the branch's fidelity rule plus `notes.md`, so no mockup agent re-derives the surface from scratch.
