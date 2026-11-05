import js from '@eslint/js';
import prettier from 'eslint-config-prettier/flat';
import perfectionist from 'eslint-plugin-perfectionist';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export const TS_FILES = ['**/*.{ts,tsx,mts,cts}'];
export const JS_FILES = ['**/*.{js,jsx,mjs,cjs}'];

export const DEFAULT_IGNORES = ['**/dist/**', '**/build/**', '**/coverage/**', '**/.next/**', '**/out/**', '**/*.d.ts'];

/**
 * @typedef {object} KillbOptions
 * @property {string} tsconfigRootDir Directory of the eslint.config.mjs; pass `import.meta.dirname`.
 * @property {string[]} [ignores] Extra glob patterns to ignore, on top of DEFAULT_IGNORES.
 * @property {Record<string, unknown>} [parserOptions] Overrides for the typed parser (e.g. `project` instead of `projectService`).
 * @property {string[]} [internalPattern] Import paths sorted as internal (default `^src/`, `^@/`, `^~/`).
 */

/** @param {KillbOptions} options */
export function core(options) {
  const {
    tsconfigRootDir,
    ignores = [],
    parserOptions = {},
    internalPattern = ['^src/', '^@/', '^~/'],
  } = options ?? {};

  if (!tsconfigRootDir) {
    throw new Error('@killb/code-style: pass `tsconfigRootDir: import.meta.dirname` to the config function');
  }

  return [
    { name: 'killb/ignores', ignores: [...DEFAULT_IGNORES, ...ignores] },

    { name: 'killb/js-recommended', ...js.configs.recommended },
    ...tseslint.configs.recommended,

    {
      name: 'killb/js-files',
      files: JS_FILES,
      languageOptions: { globals: { ...globals.node } },
    },

    {
      name: 'killb/common',
      plugins: { perfectionist, 'unused-imports': unusedImports },
      rules: {
        eqeqeq: ['error', 'always', { null: 'ignore' }],
        'no-var': 'error',
        'prefer-const': 'error',
        'object-shorthand': ['error', 'always'],

        '@typescript-eslint/no-explicit-any': 'error',

        '@typescript-eslint/no-unused-vars': 'off',
        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': [
          'error',
          {
            vars: 'all',
            args: 'after-used',
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_',
            caughtErrors: 'all',
            caughtErrorsIgnorePattern: '^_',
            destructuredArrayIgnorePattern: '^_',
            ignoreRestSiblings: true,
          },
        ],

        'perfectionist/sort-imports': ['error', { type: 'natural', order: 'asc', internalPattern }],
        'perfectionist/sort-named-imports': ['error', { type: 'natural', order: 'asc' }],
        'perfectionist/sort-named-exports': ['error', { type: 'natural', order: 'asc' }],
      },
    },

    {
      name: 'killb/typescript-type-checked',
      files: TS_FILES,
      languageOptions: {
        parserOptions: { projectService: true, tsconfigRootDir, ...parserOptions },
      },
      rules: {
        '@typescript-eslint/no-floating-promises': 'error',
        '@typescript-eslint/no-misused-promises': 'error',
        '@typescript-eslint/await-thenable': 'error',
        '@typescript-eslint/return-await': ['error', 'error-handling-correctness-only'],
        '@typescript-eslint/switch-exhaustiveness-check': ['error', { considerDefaultExhaustiveForUnions: true }],
        '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      },
    },
  ];
}

export function prettierLast() {
  return [{ name: 'killb/prettier', ...prettier }];
}
