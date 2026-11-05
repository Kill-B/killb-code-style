import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

import { core, DEFAULT_IGNORES, prettierLast, TS_FILES } from './core.mjs';

export { DEFAULT_IGNORES };

/**
 * Next.js apps (backoffice, platform). Needs `eslint-config-next` installed in the app, and ESLint 9.
 * @param {import('./core.mjs').KillbOptions} options
 */
export function next(options) {
  return [
    ...core(options),
    ...nextCoreWebVitals,
    {
      name: 'killb/next',
      rules: {
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'error',
        'react/jsx-no-useless-fragment': ['error', { allowExpressions: true }],
        'react/self-closing-comp': 'error',
      },
    },
    {
      name: 'killb/next-typescript',
      files: TS_FILES,
      rules: {
        '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: { attributes: false } }],
      },
    },
    ...prettierLast(),
  ];
}
