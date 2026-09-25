# The signable spec page

Built only when the user says yes to it (see step 6 of `SKILL.md`), never by default. The last page of a run. Not an exploration: one design, no alternatives, no radios. The user signs this off, and whoever implements works from it.

Build it with [`assets/build.js`](assets/build.js) from the last round's `tokens.css` and `data.js` — one option per axis, all locked — then run [`assets/spec-doc.js`](assets/spec-doc.js) over it to drop the picker chrome. The document keeps the light table, the same three faces and the ochre state tags, so it reads as the last page of the set rather than a different artifact.

## What it holds

1. **One sentence** stating the design. On a greenfield surface, a second sentence names the signature — the one element the design will be remembered by. On a redesign, say instead which of the app's existing idioms the design now shares.
2. **Every state of the surface**, one figure per state — per viewport, when `MOCKUP.viewports` is declared — each captioned with the keys that reach it. Work from `MOCKUP.states` — empty, populated, overflowing, no-optional-attribute, truncating, disabled, in-flight, error, hover, cursor — plus every mode the real surface has.
3. **Neighbouring surfaces the design touches**, at their real width.
4. **What changes in the code**: each visible change against the real file and the real element, class or control it touches, with styling-only changes marked separately from those needing behaviour or new structure (needs-JS on web; custom-drawn or new control natively). This is the copy-back recipe, expanded and verified against the sources rather than guessed. Say plainly where you are unsure.
5. **Capability accounting** — every capability from the inventory, marked kept, moved-where, or dropped-why. The one place it renders, because the signer is accepting the drops.
6. **Open questions this render exposed.** The most valuable section. Rendering a design in every state surfaces decisions the discussion never reached — what a control does in a state nobody discussed, which of two mechanisms owns a key, whether a word is doing double duty. Put each one to the user; they are the last round of the design tree.

## After sign-off

The page is a working artifact: it lives in the scratchpad (a temp folder outside the repo), is referenced by path from wherever the plan lives, and dies with the feature. Work found along the way but not done — a broken glyph, a missing empty state, a null-before-load tooltip — becomes an issue, never a committed document.
