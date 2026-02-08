# Contributing to @ccbd-seo

Thanks for your interest in contributing! This guide covers everything you need to get started.

## Prerequisites

- [Node.js](https://nodejs.org/) >= 18.0.0
- [pnpm](https://pnpm.io/) >= 9.0.0

## Development Setup

```bash
# Clone the repository
git clone https://github.com/ccbd-seo/ccbd-seo.git
cd ccbd-seo

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Lint
pnpm lint

# Type-check
pnpm typecheck
```

## Branch Naming

Use the following prefixes for branches:

| Prefix | Use |
|--------|-----|
| `feat/` | New features |
| `fix/` | Bug fixes |
| `docs/` | Documentation changes |
| `refactor/` | Code refactoring |
| `test/` | Adding or updating tests |
| `chore/` | Maintenance tasks |

Example: `feat/add-recipe-schema`, `fix/sitemap-streaming-error`

## Commit Conventions

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]
```

**Types:** `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `perf`, `ci`

**Scope** is the package name without the `@ccbd-seo/` prefix:

```
feat(schema): add recipe schema builder
fix(sitemap): handle empty URL arrays
docs(core): update API reference
test(audit): add edge case tests for meta rules
```

## Pull Request Process

1. **Create a branch** from `main` using the naming conventions above
2. **Make your changes** — keep PRs focused on a single concern
3. **Add a changeset** — run `pnpm changeset` and follow the prompts to describe your changes for the changelog
4. **Ensure CI passes** — all of the following must pass:
   - `pnpm build` — builds all packages
   - `pnpm lint` — no lint errors
   - `pnpm typecheck` — no type errors
   - `pnpm test` — all tests pass
5. **Submit the PR** — fill in the PR template and request a review
6. **One approval required** — PRs need at least one approving review before merge

## Package Structure

Each package follows a consistent structure:

```
packages/<name>/
├── package.json       # Package metadata, exports, dependencies
├── tsconfig.json      # TypeScript config extending root
├── tsup.config.ts     # Bundle config (ESM + CJS + .d.ts)
├── vitest.config.ts   # Test config
└── src/
    ├── index.ts       # Public API exports
    ├── types.ts       # Type definitions
    ├── *.ts           # Implementation modules
    └── __tests__/     # Tests
```

### Key Patterns

- **Dual ESM/CJS output** via tsup — all packages ship both formats with type declarations
- **React components** use `createElement()` instead of JSX
- **Optional React peer dependency** — packages with `./react` exports list React as an optional `peerDependency`
- **Workspace dependencies** use `workspace:*` protocol
- **Tree-shakeable** — all packages set `"sideEffects": false`

## Adding a New Package

1. Create the directory under `packages/`
2. Add `package.json`, `tsconfig.json`, `tsup.config.ts`, `vitest.config.ts` following existing packages as templates
3. Implement the public API in `src/index.ts`
4. Add tests in `src/__tests__/`
5. Add a README.md to the package
6. Add the package to the root README table
7. Run `pnpm install` from the root to link the new workspace

## Running Tests for a Specific Package

```bash
# Run tests for a single package
pnpm --filter @ccbd-seo/schema test

# Run tests in watch mode
pnpm --filter @ccbd-seo/schema test:watch
```

## Code Style

- **Formatting** is handled by Prettier — run `pnpm format` before committing
- **Linting** uses ESLint v9 flat config — run `pnpm lint` to check
- Use `globalThis.URL` instead of bare `URL` (the `no-undef` rule is active)

## Questions?

Open an issue on GitHub if you have questions or need help getting started.
