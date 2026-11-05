import { defineConfig } from 'eslint/config';

import { node } from './eslint/index.mjs';

export default defineConfig(node({ tsconfigRootDir: import.meta.dirname, ignores: ['test/fixtures/**'] }));
