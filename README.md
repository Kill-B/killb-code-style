# @killb/code-style

KillB's shared ESLint and Prettier configuration, used by every JavaScript/TypeScript repo.

## Install

```sh
npm i -D --save-exact @killb/code-style eslint @eslint/js prettier typescript
```

Next.js apps also need `eslint-config-next` (and `next`, which they already have).

| Peer                   | Versions                                                                                                                            |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `eslint`, `@eslint/js` | `^9.39 \|\| ^10` (same major for both). The `next` preset needs 9 until `eslint-plugin-react`, `-import` and `-jsx-a11y` support 10 |
| `prettier`             | `^3.9`                                                                                                                              |
| `typescript`           | `>=5`                                                                                                                               |

## Prettier

In `package.json`:

```json
{ "prettier": "@killb/code-style/prettier" }
```

Delete any `.prettierrc*` in the repo. Keep a `.prettierignore` for generated files.

Style: 120 columns, 2 spaces, single quotes, semicolons, trailing commas everywhere, no parens on single-arg arrows, LF.

## ESLint

`eslint.config.mjs`, one preset per repo:

```js
import { defineConfig } from 'eslint/config';
import { node } from '@killb/code-style/eslint';

export default defineConfig(node({ tsconfigRootDir: import.meta.dirname }));
```

| Preset | Import                          | For                                                                                                |
| ------ | ------------------------------- | -------------------------------------------------------------------------------------------------- |
| `node` | `@killb/code-style/eslint`      | services, Cloud Functions, MCP servers, agents (tarantino-v2, serveless, killb-agents, killb-mcps) |
| `base` | `@killb/code-style/eslint`      | runtime-agnostic libraries (sdk)                                                                   |
| `next` | `@killb/code-style/eslint/next` | Next.js apps (backoffice, platform)                                                                |

Options (all presets):

| Option                  | Default                                   | What                                                                                             |
| ----------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `tsconfigRootDir`       | required                                  | `import.meta.dirname`                                                                            |
| `ignores`               | `[]`                                      | extra globs, on top of `dist`, `build`, `coverage`, `.next` and `out` at any depth, and `*.d.ts` |
| `parserOptions`         | `{ projectService: true }`                | e.g. `{ projectService: false, project: './tsconfig.eslint.json' }`                              |
| `internalPattern`       | `['^src/', '^@/', '^~/']`                 | imports sorted as internal                                                                       |
| `allowConsole` (`node`) | `[]`                                      | console methods allowed in `src/`, e.g. `['error']` for MCP stdio servers                        |
| `appFiles` (`node`)     | `['**/src/**/*.{ts,mts,cts,js,mjs,cjs}']` | where `no-console` applies: any `src/`, so workspaces work too (tests and migrations excluded)   |

### What every preset enforces

- `@eslint/js` and `typescript-eslint` recommended.
- Async correctness, type-checked: `no-floating-promises`, `no-misused-promises`, `await-thenable`, `return-await` (error-handling only), `switch-exhaustiveness-check`. An unhandled promise in a money flow fails silently; fire-and-forget must be explicit with `void`.
- `eqeqeq` (except `== null`), `no-explicit-any`, `no-unnecessary-type-assertion`.
- Unused imports and variables are errors; prefix with `_` to keep one on purpose.
- Sorted imports and named imports/exports (autofixable).
- `eslint-config-prettier` last, so ESLint never fights Prettier.

`node` adds Node globals and `no-console` in `src/`. `next` adds `eslint-config-next/core-web-vitals` with `react-hooks/rules-of-hooks` and `exhaustive-deps` as errors.

### Repo-specific rules

Append them after the preset, each with a one-line reason:

```js
export default defineConfig(node({ tsconfigRootDir: import.meta.dirname }), {
  // NestJS DTOs extend empty classes.
  rules: { '@typescript-eslint/no-empty-object-type': 'off' },
});
```

Turning a standard rule off is debt: prefer a scoped `files` block over a global override, and open an issue here if the rule is wrong for everyone.

## Scripts and CI

Each repo has:

```json
{
  "lint": "eslint . --max-warnings 0",
  "lint:fix": "eslint . --fix",
  "format": "prettier --write .",
  "format:check": "prettier --check ."
}
```

and CI runs `npm run lint` and `npm run format:check`. Warnings fail CI: a rule is either an error or off.

## Adopting it in a repo

1. Install, replace the configs, delete `.prettierrc*`, `.eslintrc*`, airbnb, `eslint-plugin-prettier` and other plugins the preset now brings.
2. Commit the config change.
3. Run `npm run format` and `npm run lint:fix` and commit **only that**, as `style: apply @killb/code-style`. Add its hash to `.git-blame-ignore-revs`.
4. Fix what is left by hand, in its own commit.

## Releasing

Conventional commits on `main` are released by semantic-release to npm (`feat` → minor, `fix` → patch, `feat!`/`BREAKING CHANGE` → major). Turning a rule on or making it stricter is a `feat!`: it can break consumers' CI.

## Development

```sh
npm ci
npm test      # loads every preset against fixtures in test/fixtures
npm run lint
npm run format:check
```
