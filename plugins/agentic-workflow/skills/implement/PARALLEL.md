# /implement --parallel

The parallel branch of [`implement`](SKILL.md). Everything in `SKILL.md` still holds; this file adds
what running more than one Worker at once requires.

## Footprints

A story's **footprint** is the set of files and modules it will touch. Read it from What it delivers
and Requirements at preflight, and record it on the story's task.

Two stories run concurrently only when their footprints are disjoint and neither is blocked by the
other. Overlapping or uncertain footprints run one after the other. Two Workers in one file produce
phantom failures that exist nowhere in the source.

## Lanes

- Every Worker gets its **own worktree**, made by you with `git worktree add` at
  the user's configured worktree location (default: `../<repo-name>-worktrees/<branch-with-slashes-as-underscores>`), cut from the current
  integration tip. A tree cut from a stale base edits files the feature has not added yet. Never the
  Agent tool's `isolation` option: it nests a worktree inside whatever checkout you are already in.
- The Validator commits nothing, so it runs **concurrently with the next story's Worker**. A lane never
  idles on a verdict.
- **Dispatch before you report.** Every completion notification ends in a dispatch decision, taken
  before you write anything up. Holding a lane on purpose gets one line with its release condition;
  releasing it is the first action once met.
- Keep the next two or three picks **with their footprints** on the task list, so choosing is
  mechanical.
- A single-fresh-context Worker still owns one story. Trivial stories with a shared footprint may be
  batched into one Worker, one commit each, so any can be dropped alone.

## Merging

Merges are serial and the merge queue is the critical path.

- **In order of PASS**, merge each branch into the integration branch, then run the full suite and
  lint **on the merge result**. Two stories that each pass alone can fail together; git will not
  warn you.
- **A suite failure after merge** means two stories collided. Revert the merge, brief the later
  story's Worker with the collision, re-validate. Never patch the other story to make the merge pass.
- Batch disjoint branches into one suite run; overlapping branches get a run each.
- Reclaim a worktree only after its branch has merged and the tree is clean. An unmerged tree is
  sometimes the only copy of that work.

## Recovering from a dead agent

Inventory **by branch, never by worktree name**:

```
git for-each-ref --format='%(refname:short)' refs/heads/    # candidates
git rev-list --count <integration-tip>..<branch>            # commits not yet integrated
git cherry <integration-tip> <branch>                       # '-' = patch already in
git -C <worktree> status --porcelain                        # uncommitted work
```

Ancestry says no for a cherry-pick whose content is fully in, so ask patch-equivalence second.
Doubt resolves to "not integrated". Discarding a tree is the one irreversible step; it goes
through `AskUserQuestion`.
