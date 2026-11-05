import assert from 'node:assert/strict';
import path from 'node:path';
import { describe, it } from 'node:test';
import * as prettier from 'prettier';

import config from '../prettier.mjs';

describe('prettier', () => {
  it('formats with the KillB style', async () => {
    const source = 'const f = (x) => { return { a: "1", b: [1,2,3] } }\n';
    const output = await prettier.format(source, { ...config, parser: 'typescript' });
    assert.equal(output, "const f = x => {\n  return { a: '1', b: [1, 2, 3] };\n};\n");
  });

  it('is resolvable by package name, the way repos reference it', async () => {
    const file = path.join(import.meta.dirname, 'fixtures', 'shared', 'file.ts');
    const resolved = await prettier.resolveConfig(file);
    assert.equal(resolved?.printWidth, 120);
  });
});
