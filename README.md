# Ahmed Skills

My personal agent skills. They follow the open [Agent Skills](https://agentskills.io) format (`SKILL.md`), so they work with Claude Code, Codex, and any other agent that supports skills.

## Install

### Claude Code

```bash
claude plugin marketplace add ahmed-okkio/skills
claude plugin install ahmed-skills@ahmed
```

Or from inside a session: `/plugin marketplace add ahmed-okkio/skills`, then `/plugin install ahmed-skills@ahmed`.

### Codex

```bash
codex plugin marketplace add ahmed-okkio/skills
codex plugin add ahmed-skills@ahmed
```

### Cursor, Gemini CLI, GitHub Copilot, and other agents

```bash
npx skills@latest add ahmed-okkio/skills
```

Copies the skills into your project or home directory as editable files, and lets you pick which skills and which agents.

## Skills

- [ui-mockups](plugins/ahmed-skills/skills/ui-mockups/SKILL.md): mock up UI options for any surface (web, desktop, TUI, mobile) as standalone HTML decks, then narrow to one agreed design and a signable spec.

## Layout

```
.claude-plugin/marketplace.json     Claude Code marketplace
.agents/plugins/marketplace.json    Codex marketplace
plugins/ahmed-skills/
  .claude-plugin/plugin.json        Claude Code plugin manifest
  .codex-plugin/plugin.json         Codex plugin manifest
  skills/<name>/SKILL.md            the skills (one folder each)
```

See [AGENTS.md](./AGENTS.md) for how to add a skill.
