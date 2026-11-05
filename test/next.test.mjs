import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { next, REACT_COMPILER_RULES } from '../eslint/next.mjs';
import { lint } from './lint.mjs';

describe('next', () => {
  it('reports hooks violations', async () => {
    const rules = await lint(next, 'next', 'src/Hooks.tsx');
    assert.ok(rules.includes('react-hooks/rules-of-hooks'), rules.join(', '));
    assert.ok(rules.includes('react-hooks/exhaustive-deps'), rules.join(', '));
  });

  it('keeps the React Compiler rules off by default', async () => {
    assert.ok(REACT_COMPILER_RULES.includes('react-hooks/set-state-in-effect'), REACT_COMPILER_RULES.join(', '));
    assert.ok(!REACT_COMPILER_RULES.includes('react-hooks/rules-of-hooks'));
    assert.deepEqual(await lint(next, 'next', 'src/Compiler.tsx'), []);
  });

  it('turns the React Compiler rules on with reactCompiler: true', async () => {
    const rules = await lint(o => next({ ...o, reactCompiler: true }), 'next', 'src/Compiler.tsx');
    assert.ok(rules.includes('react-hooks/set-state-in-effect'), rules.join(', '));
  });
});
