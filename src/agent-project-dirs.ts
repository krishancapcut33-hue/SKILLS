/**
 * Project-relative directories the agents registry installs skills into, in the
 * order discovery searches them. `skills/` is the standard container and is
 * searched on its own, so it is not repeated here.
 *
 * This list is checked against the `agents` registry in scripts/sync-agents.ts
 * and in tests/agent-dir-discovery.test.ts, so a new agent's directory cannot
 * drift out of discovery the way a hand-maintained copy did.
 *
 * See: https://github.com/vercel-labs/skills/issues/2502
 */
export const AGENT_PROJECT_SKILL_DIRS: readonly string[] = [
  '.adal/skills',
  '.agents/skills',
  '.aider-desk/skills',
  '.augment/skills',
  '.autohand/skills',
  '.bob/skills',
  '.claude/skills',
  '.codeartsdoer/skills',
  '.codebuddy/skills',
  '.codemaker/skills',
  '.codestudio/skills',
  '.commandcode/skills',
  '.continue/skills',
  '.cortex/skills',
  '.crush/skills',
  '.devin/skills',
  '.forge/skills',
  '.goose/skills',
  '.grok/skills',
  '.hermes/skills',
  '.iflow/skills',
  '.inferencesh/skills',
  '.jazz/skills',
  '.junie/skills',
  '.kimchi/skills',
  '.kiro/skills',
  '.kode/skills',
  '.lingma/skills',
  '.mcpjam/skills',
  '.minimax/skills',
  '.moxby/skills',
  '.mux/skills',
  '.neovate/skills',
  '.ona/skills',
  '.openhands/skills',
  '.pochi/skills',
  '.posit/assistant/skills',
  '.qoder/skills',
  '.qwen/skills',
  '.reasonix/skills',
  '.roo/skills',
  '.rovodev/skills',
  '.tabnine/agent/skills',
  '.terramind/skills',
  '.tinycloud/skills',
  '.trae/skills',
  '.vibe/skills',
  '.windsurf/skills',
  '.zcode/skills',
  '.zencoder/skills',
  'agent/skills',
  'data/skills',
];
