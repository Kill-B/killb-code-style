# killb-code-style

`@killb/code-style`: the ESLint and Prettier standard for KillB's JS/TS repos. Public npm package, released by semantic-release from `main`.

- `prettier.mjs`: the Prettier config. `eslint/core.mjs`: rules shared by every preset. `eslint/index.mjs`: `base` and `node`. `eslint/next.mjs`: `next` (kept apart so backends never load `eslint-config-next`).
- Every rule change needs a fixture in `test/fixtures` and an assertion in `test/eslint.test.mjs` that proves it fires.
- Turning a rule on, or making it stricter, breaks consumers' CI: commit it as `feat!` and say in the PR which repos it affects (run the preset against them first).
- Public package: no internal hostnames, repo internals, secrets or PII in code, README or commits.
- Checks: `npm run lint`, `npm run format:check`, `npm test`.
