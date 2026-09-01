# Kacific-SVNO

> Placeholder: replace this line with the repo's one-line purpose and its **north star** (the product end-state this repo builds toward).

<!-- BEGIN kacific:concurrency-coordination (managed, do not edit by hand) -->
## Concurrency and git coordination

This repo may be worked by more than one agent or person at once. Assume a peer may be editing shared
files or moving branches at any moment. The rules below exist because a shared checkout was seen to
shuffle a branch ref mid-commit.

- **Worktree-per-session (mandatory).** Never edit in a shared main checkout. Create your own linked
  worktree **under the repo**, at a gitignored path, and work there:
  ```
  git -C <repo> fetch --prune origin main
  git -C <repo> worktree add .claude/worktrees/<task> -b <area>/<task> origin/main
  # edit in that worktree, commit, push, open the PR, then:
  git -C <repo> worktree remove .claude/worktrees/<task>
  ```
  A worktree has its own HEAD and index, so a peer's checkout cannot move your branch under you.
  **Place it under the repo, never beside it as `../wt-<task>`.** A sibling inherits the PARENT
  directory's treatment rather than the repo's, so it silently escapes every protection scoped to the
  repo path at once: backup roots and sync excludes that name the repo, ignore rules, and anything else
  keyed on that path. This is not hypothetical, it cost a live incident. Under the repo it inherits all
  of them, and being gitignored keeps it out of the index. Full reasoning in the `using-git-worktrees`
  and `multi-agent-repo-coordination` vault skills.
  **This repo's tracked `.gitignore` must carry `.claude/worktrees/`.** A local `.git/info/exclude` entry
  is not enough: it never travels, so on a fresh clone the worktree shows as untracked and a nested
  working copy can be committed by accident. Add the line if it is missing.
- **Pull before dev.** `fetch --prune` then `pull --ff-only` (or branch straight off `origin/main`)
  before the first edit. Fast-forward only, never force. If `--ff-only` refuses (diverged) or a dirty
  tree would conflict, stop and surface it.
- **Branch per task off `main`; commit immediately; verify the pushed ref.** After pushing, confirm
  `git rev-parse --short origin/<branch>` equals your commit before relying on it. If a commit lands on
  the wrong branch (ref shuffle), recover by pushing the SHA explicitly:
  `git push origin <sha>:refs/heads/<branch>`.
- **Append, do not rewrite** shared docs where a peer may be mid-edit. Prefer small targeted edits over
  wholesale rewrites; on a conflict, reconcile rather than clobber.
- **Clone, do not assume.** If this repo, or a referenced repo, is not present locally, clone it from
  the `Kacific` GitHub org and keep it synced. Do not assume a stale local copy is current.
- **Canonical working copy.** Edit in your dedicated checkout. An incidental copy produced by an
  all-org-repos clone (for example a `~/Documents/Programming/<repo>` mirror) is **read-only**; do not
  edit it, it drifts.
<!-- END kacific:concurrency-coordination -->

<!-- BEGIN kacific:agent-practices (managed, do not edit by hand) -->
## Mandatory practices for agents

These apply to every session in this repo, on top of the concurrency rules above. They are the estate
default, not optional, and hold even where a task prompt does not restate them.

- **Use the skills vault.** Before non-trivial work, check which `~/.claude/skills/` vault skills fire
  for the task (per `plan-time-tooling`) and use them; do not re-derive from memory what a skill already
  encodes. If a relevant skill is missing, propose one (`author-skill`) rather than working around it.
- **Run the boundary-check at every boundary.** Invoke the `boundary-check` skill before proposing a
  compact, before a park / standdown / restart, and at every chunk close or shift (before offering the
  next chunk). It does the fresh-disk re-read of standing instructions and memory, reconciles the
  session, and emits the visible stamp.
- **Plan at every kickoff.** Enter plan mode at the start of each task or chunk (per
  `reread-memory-before-planning`): re-read memory and this `AGENTS.md` from disk, enumerate the tooling
  that fires, and surface scope decisions before acting. Plan mode is the default cadence; action is the
  exception that needs alignment first.
<!-- END kacific:agent-practices -->
