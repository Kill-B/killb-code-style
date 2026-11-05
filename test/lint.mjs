import { ESLint } from 'eslint';
import assert from 'node:assert/strict';
import path from 'node:path';

const fixtures = path.join(import.meta.dirname, 'fixtures');

export async function lint(preset, dir, file) {
  const cwd = path.join(fixtures, dir);
  const eslint = new ESLint({ cwd, overrideConfigFile: true, overrideConfig: preset({ tsconfigRootDir: cwd }) });
  const [result] = await eslint.lintFiles([path.join(cwd, file)]);
  const fatal = result.messages.filter(m => m.fatal || !m.ruleId);
  assert.deepEqual(fatal, [], 'config must load and parse without fatal errors');
  return result.messages.map(m => m.ruleId);
}
