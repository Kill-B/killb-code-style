import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { base, node } from '../eslint/index.mjs';
import { lint } from './lint.mjs';

describe('base', () => {
  it('throws without tsconfigRootDir', () => {
    assert.throws(() => base(), /tsconfigRootDir/);
  });

  it('accepts clean code', async () => {
    assert.deepEqual(await lint(base, 'node', 'src/clean.ts'), []);
  });
});

describe('node', () => {
  it('accepts clean code', async () => {
    assert.deepEqual(await lint(node, 'node', 'src/clean.ts'), []);
  });

  it('reports the rules the standard exists for', async () => {
    const rules = await lint(node, 'node', 'src/dirty.ts');
    for (const rule of [
      'eqeqeq',
      'no-console',
      '@typescript-eslint/no-floating-promises',
      '@typescript-eslint/switch-exhaustiveness-check',
      'unused-imports/no-unused-imports',
      'perfectionist/sort-named-imports',
    ]) {
      assert.ok(rules.includes(rule), `expected ${rule}, got ${rules.join(', ')}`);
    }
  });

  it('allows the console methods listed in allowConsole', async () => {
    const rules = await lint(o => node({ ...o, allowConsole: ['log'] }), 'node', 'src/dirty.ts');
    assert.ok(!rules.includes('no-console'));
  });
});
