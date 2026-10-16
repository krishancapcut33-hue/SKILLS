/**
 * Skill discovery must search every directory the agents registry documents.
 *
 * `AGENT_PROJECT_SKILL_DIRS` used to be two hand-written lists that had drifted
 * from the agents registry: 30 documented agent dirs (Eve's `agent/skills/`,
 * Augment's `.augment/skills/`, …) were never searched, while 8 dirs no agent
 * installs to anymore still were. Both the local scan and the blob fast path
 * now read one list from `src/agent-project-dirs.ts`, which `sync-agents.ts`
 * and the last test here check against the registry.
 *
 * See: https://github.com/vercel-labs/skills/issues/2502
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdirSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { discoverSkills } from '../src/skills.ts';
import { findSkillMdPaths, type RepoTree, type TreeEntry } from '../src/blob.ts';
import { AGENT_PROJECT_SKILL_DIRS } from '../src/agent-project-dirs.ts';
import { agents } from '../src/agents.ts';

function writeSkill(dir: string, name: string): void {
  mkdirSync(dir, { recursive: true });
  writeFileSync(
    join(dir, 'SKILL.md'),
    `---\nname: ${name}\ndescription: ${name} description\n---\n\n# ${name}\n`
  );
}

function makeTree(paths: string[]): RepoTree {
  const entries: TreeEntry[] = paths.map((path) => ({
    path,
    type: path.toLowerCase().endsWith('skill.md') ? 'blob' : 'tree',
    sha: 'sha-' + path.replace(/[^a-z0-9]/gi, '_'),
  }));
  return { sha: 'root-sha', branch: 'main', tree: entries };
}

describe('agent-directory skill discovery', () => {
  let testDir: string;

  beforeEach(() => {
    testDir = join(tmpdir(), `skills-agent-dirs-${Date.now()}-${Math.random()}`);
    mkdirSync(testDir, { recursive: true });
  });

  afterEach(() => {
    rmSync(testDir, { recursive: true, force: true });
  });

  it('discovers skills in documented agent dirs next to a standard container', async () => {
    writeSkill(join(testDir, 'skills', 'foo'), 'foo');
    writeSkill(join(testDir, 'agent', 'skills', 'bar'), 'bar');
    writeSkill(join(testDir, '.augment', 'skills', 'baz'), 'baz');

    const skills = await discoverSkills(testDir);

    expect(skills.map((s) => s.name).sort()).toEqual(['bar', 'baz', 'foo']);
  });

  it('finds the same agent-dir skills on the blob fast path', () => {
    const tree = makeTree([
      'skills/foo/SKILL.md',
      'agent/skills/bar/SKILL.md',
      '.augment/skills/baz/SKILL.md',
    ]);

    const paths = findSkillMdPaths(tree).sort();

    expect(paths).toEqual([
      '.augment/skills/baz/SKILL.md',
      'agent/skills/bar/SKILL.md',
      'skills/foo/SKILL.md',
    ]);
  });

  it('searches exactly the dirs the agents registry documents', () => {
    const registered = [...new Set(Object.values(agents).map((a) => a.skillsDir))]
      .filter((dir) => dir !== 'skills')
      .sort();

    // Documented by agents in the registry (Eve, AstrBot, Augment) — these were
    // never searched before, so their skills were silently skipped.
    for (const dir of ['agent/skills', 'data/skills', '.augment/skills']) {
      expect(AGENT_PROJECT_SKILL_DIRS).toContain(dir);
    }
    // No agent installs to these anymore — the registry points them at
    // `.agents/skills` instead, so searching them can surface SKILL.md files the
    // owner never meant to publish (e.g. anything under `.github/skills/`).
    for (const dir of ['.github/skills', '.codex/skills', '.opencode/skills']) {
      expect(AGENT_PROJECT_SKILL_DIRS).not.toContain(dir);
    }

    // The list itself must stay in lockstep with the registry; `sync-agents.ts`
    // fails the same comparison when the README is regenerated.
    expect([...AGENT_PROJECT_SKILL_DIRS].sort()).toEqual(registered);
  });
});
