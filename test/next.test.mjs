import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { next } from '../eslint/next.mjs';
import { lint } from './lint.mjs';

describe('next', () => {
  it('reports hooks violations', async () => {
    const rules = await lint(next, 'next', 'src/Hooks.tsx');
    assert.ok(rules.includes('react-hooks/rules-of-hooks'), rules.join(', '));
    assert.ok(rules.includes('react-hooks/exhaustive-deps'), rules.join(', '));
  });
});
