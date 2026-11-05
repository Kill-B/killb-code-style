import globals from 'globals';

import { core, DEFAULT_IGNORES, prettierLast } from './core.mjs';

export { DEFAULT_IGNORES };

/**
 * TypeScript code that is not tied to a runtime (libraries such as API client SDKs).
 * @param {import('./core.mjs').KillbOptions} options
 */
export function base(options) {
  return [...core(options), ...prettierLast()];
}

/**
 * Node.js services, functions and tools.
 * `console` is an error in `src/` (use the repo's logger); `allowConsole` lists the methods that stay allowed,
 * e.g. `['error']` for MCP stdio servers, where stdout belongs to the protocol.
 * @param {import('./core.mjs').KillbOptions & { allowConsole?: string[], appFiles?: string[] }} options
 */
export function node(options = {}) {
  const { allowConsole = [], appFiles = ['**/src/**/*.{ts,mts,cts,js,mjs,cjs}'] } = options;

  return [
    ...core(options),
    {
      name: 'killb/node',
      languageOptions: { globals: { ...globals.node } },
    },
    {
      name: 'killb/node-app',
      files: appFiles,
      ignores: ['**/*.{test,spec}.*', '**/__tests__/**', '**/migrations/**'],
      rules: {
        'no-console': allowConsole.length ? ['error', { allow: allowConsole }] : 'error',
      },
    },
    ...prettierLast(),
  ];
}
