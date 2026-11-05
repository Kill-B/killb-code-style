import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

import { core, DEFAULT_IGNORES, prettierLast, TS_FILES } from './core.mjs';

export { DEFAULT_IGNORES };

const CLASSIC_HOOKS_RULES = new Set(['react-hooks/rules-of-hooks', 'react-hooks/exhaustive-deps']);

export const REACT_COMPILER_RULES = [
  ...new Set(
    nextCoreWebVitals.flatMap(config =>
      Object.keys(config.rules ?? {}).filter(rule => rule.startsWith('react-hooks/') && !CLASSIC_HOOKS_RULES.has(rule)),
    ),
  ),
].sort();

/**
 * Next.js apps. Needs `eslint-config-next` installed in the app, and ESLint 9.
 * The React Compiler rules that eslint-config-next enables stay off unless the app uses the compiler.
 * @param {import('./core.mjs').KillbOptions & { reactCompiler?: boolean }} options
 */
export function next(options) {
  const { reactCompiler = false } = options ?? {};

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
    ...(reactCompiler
      ? []
      : [
          {
            name: 'killb/next-without-react-compiler',
            rules: Object.fromEntries(REACT_COMPILER_RULES.map(rule => [rule, 'off'])),
          },
        ]),
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
