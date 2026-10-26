---
description: "Generate a Playwright e2e spec for a described user flow, using data-testid selectors and extracting reusable setup into helper files"
agent: "Playwright E2E Expert"
argument-hint: "Describe the page/component/flow to test and whether the user is logged in or anonymous"
tools: [read, search, edit, execute, playwright/*]
---
Generate a new Playwright e2e test for the flow described by the user.

## 1. Place the spec correctly
- Anonymous/public flows → `e2e/anonym/`
- Logged-in flows → `e2e/eingeloggt/`
- Name the file `<nn>_<kebab-case-flow>.spec.ts` if siblings in the folder use numeric prefixes (see `e2e/anonym/`), otherwise `<kebab-case-flow>.spec.ts`.

## 2. Reuse existing helpers before writing new setup code
Check these files first and call into them instead of duplicating logic:
- [global-helper.object.ts](../../e2e/global-helper.object.ts) — `Global.login()`
- [hasura-helper.object.ts](../../e2e/hasura-helper.object.ts) — seeding/cleanup via GraphQL
- [firebase-auth-helper.object.ts](../../e2e/firebase-auth-helper.object.ts) — auth user setup

If the flow needs new repeated setup (API seeding, a new emulator call, GraphQL mutations, shared fixtures) that isn't covered by an existing helper, create a new `e2e/<name>-helper.object.ts` static-class helper and import it — never inline more than a few lines of boilerplate directly in the spec.

## 3. Selector priority (strict)
1. `page.getByTestId('...')` — always prefer this. If the target element in the component template has no `data-testid`, add a minimal one to the template instead of falling back to text/role.
2. `page.getByRole(...)` — only for native semantics with no sensible testid (e.g. a generic `dialog[open]` wrapper), and only when a testid genuinely doesn't fit.
3. Text or CSS locators — avoid; only acceptable for structural containers with no better anchor (e.g. `.card` combined with a testid inside it).

## 4. Test structure
- Wrap tests in `test.describe('<ComponentName>', ...)`.
- Use `test.beforeEach`/`test.afterEach` to clean up seeded data via `HasuraHelper` (e.g. `deleteNotificationsBySubjectPattern`), matching the pattern in [notifications.spec.ts](../../e2e/eingeloggt/notifications.spec.ts).
- Assert observable UI state (`toBeVisible`, `toHaveValue`, `toHaveURL`) rather than implementation details.
- Avoid `waitForTimeout`; prefer `waitForLoadState('networkidle')`, `expect(...).toBeVisible()`, or other deterministic waits. Only use a short timeout if no deterministic alternative exists.

## 5. Validate
Run the new spec file only, on the chromium project, and report the result:
`npx playwright test <path-to-new-spec> --project=chromium`

## Output
- List created/modified files (spec + any new helper).
- List the `data-testid` selectors used, and any new `data-testid` attributes added to component templates.
- Report the test run result.
