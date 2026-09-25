# Ahmed Skills

Personal agent skills marketplace, shipped to Claude Code, Codex, and (via `npx skills`) every other Agent Skills harness.

## Adding a skill

1. Create `plugins/ahmed-skills/skills/<skill-name>/SKILL.md`. The folder name must equal the `name` field.

   ```markdown
   ---
   name: skill-name
   description: What it does and when to use it. The agent reads only this line to decide whether to load the skill, so name the triggers.
   ---

   Instructions for the agent.
   ```

   Keep `name` lowercase kebab-case. Only `name` and `description` are portable across agents; other frontmatter keys are harness-specific. Extra files (references, scripts, templates) go next to `SKILL.md` and are linked from it by relative path.

2. Optional, Codex display metadata: `plugins/ahmed-skills/skills/<skill-name>/agents/openai.yaml`

   ```yaml
   interface:
     display_name: "Skill Name"
     short_description: "One short line"
   ```

3. Add the skill to the **Skills** list in `README.md`, linked to its `SKILL.md`.

4. Bump `version` in both `plugins/ahmed-skills/.claude-plugin/plugin.json` and `plugins/ahmed-skills/.codex-plugin/plugin.json` (keep them equal). Installed users only get updates when the version changes.

5. Validate:

   ```bash
   claude plugin validate . --strict
   claude plugin validate plugins/ahmed-skills --strict
   npx skills@latest add . --list
   ```

## Rules

- Skills are auto-discovered from `plugins/ahmed-skills/skills/`; there is no list to maintain in the manifests.
- Do not use symlinks inside the plugin. Codex drops them when it copies the plugin into its cache.
- A second plugin (a separate installable bundle) goes in `plugins/<plugin-name>/` with its own two manifests, plus an entry in both marketplace files.
