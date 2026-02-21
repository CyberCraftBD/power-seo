# Publishing @power-seo Packages to npm

> Step-by-step guide to publishing all 17 `@power-seo/*` packages to [npmjs.com](https://www.npmjs.com/).

---

## Prerequisites

Before publishing, you need:

- [Node.js](https://nodejs.org/) >= 18.0.0
- [pnpm](https://pnpm.io/) >= 9.0.0
- An [npm account](https://www.npmjs.com/signup)
- A [GitHub account](https://github.com/) with a repository for this project

---

## Part 1: One-Time Setup

### Step 1 — Create an npm Account

1. Go to [npmjs.com/signup](https://www.npmjs.com/signup)
2. Create an account (or sign in if you already have one)
3. Verify your email address

### Step 2 — Create the `@power-seo` npm Organization

Scoped packages (`@power-seo/*`) require an npm organization.

1. Sign in to [npmjs.com](https://www.npmjs.com/)
2. Click your profile icon (top right) -> **Add an Organization**
3. Organization name: `power-seo`
4. Choose the **free** (Unlimited public packages) plan
5. Click **Create**

> **Note:** The org name must match the scope in your package names (`@power-seo/core`, etc.)

### Step 3 — Generate an npm Access Token

You need a token for both local publishing and GitHub Actions automation.

1. Go to [npmjs.com](https://www.npmjs.com/) -> click your profile icon -> **Access Tokens**
2. Click **Generate New Token** -> **Classic Token**
3. Select type: **Automation** (this bypasses 2FA for CI/CD)
4. Give it a name (e.g., `power-seo-publish`)
5. Click **Generate Token**
6. **Copy the token immediately** — you won't see it again

### Step 4 — Log in to npm Locally

```bash
npm login
```

Enter your npm username, password, and email when prompted. This creates a local auth token in `~/.npmrc`.

Verify you're logged in:

```bash
npm whoami
# Should print your npm username
```

### Step 5 — Create a GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `power-seo` (or your preferred name)
3. Visibility: **Public** (required for free npm org)
4. Do NOT initialize with README (you already have one)
5. Click **Create repository**

Then push your local code:

```bash
git remote add origin https://github.com/YOUR-USERNAME/power-seo.git
git branch -M main
git push -u origin main
```

### Step 6 — Add the npm Token to GitHub Secrets

This allows GitHub Actions to publish packages automatically.

1. Go to your GitHub repository -> **Settings** -> **Secrets and variables** -> **Actions**
2. Click **New repository secret**
3. Name: `NPM_TOKEN`
4. Value: paste the npm access token from Step 3
5. Click **Add secret**

---

## Part 2: First Publish (Manual)

For the initial v1.0.0 release, publish all packages manually.

### Step 1 — Build All Packages

```bash
pnpm install
pnpm build
```

Verify the build succeeded — every package should have a `dist/` folder.

### Step 2 — Verify Package Contents

Check what will be published for a few packages:

```bash
cd packages/core
npm pack --dry-run
```

You should see only files from the `dist/` folder plus `package.json` and `README.md`. No source code or test files should be included.

### Step 3 — Publish All Packages

From the repository root, publish every package:

```bash
pnpm -r publish --access public --no-git-checks
```

**Flags explained:**

- `-r` — Run across all workspace packages
- `--access public` — Required for scoped packages on free npm orgs
- `--no-git-checks` — Skip git status checks (useful for first publish)

**Important:** Packages must be published in dependency order. pnpm handles this automatically with `-r`, but if you get errors about missing dependencies, publish in this order:

```
1. @power-seo/core           (no dependencies)
2. @power-seo/react           (depends on core)
3. @power-seo/schema          (depends on core)
4. @power-seo/content-analysis (depends on core)
5. @power-seo/preview         (depends on core)
6. @power-seo/readability     (depends on core)
7. @power-seo/sitemap         (depends on core)
8. @power-seo/redirects       (depends on core)
9. @power-seo/links           (depends on core)
10. @power-seo/images          (depends on core)
11. @power-seo/ai              (depends on core)
12. @power-seo/search-console  (depends on core)
13. @power-seo/integrations    (depends on core)
14. @power-seo/tracking        (depends on core)
15. @power-seo/audit           (depends on core + content-analysis + readability + schema)
16. @power-seo/analytics       (depends on core + audit)
17. @power-seo/meta            (depends on core)
```

To publish a single package manually:

```bash
cd packages/core
npm publish --access public
```

### Step 4 — Verify on npm

After publishing, verify each package is live:

```bash
npm view @power-seo/core
npm view @power-seo/react
npm view @power-seo/schema
# ... etc.
```

Or visit: `https://www.npmjs.com/package/@power-seo/core`

---

## Part 3: Ongoing Releases (Automated via Changesets)

After the initial publish, all future releases are managed by **Changesets** and **GitHub Actions**.

### How It Works

```
Developer makes changes
    ↓
Developer creates a changeset (describes what changed)
    ↓
Developer pushes to main (via PR)
    ↓
GitHub Actions detects changesets
    ↓
Changesets bot creates a "Version Packages" PR
    ↓
Maintainer merges the Version PR
    ↓
GitHub Actions publishes updated packages to npm
```

### Step 1 — Make Your Code Changes

Edit files, add features, fix bugs, etc.

### Step 2 — Create a Changeset

After making changes, describe them for the changelog:

```bash
pnpm changeset
```

This interactive CLI will ask:

1. **Which packages changed?** — Select the affected packages (space to toggle, enter to confirm)
2. **What type of change?** — Choose the semver bump:
   - `patch` — Bug fixes (1.0.0 -> 1.0.1)
   - `minor` — New features, backwards-compatible (1.0.0 -> 1.1.0)
   - `major` — Breaking changes (1.0.0 -> 2.0.0)
3. **Summary** — Write a short description of the change

This creates a markdown file in `.changeset/` (e.g., `.changeset/happy-cats-dance.md`).

**Example changeset file:**

```md
---
'@power-seo/core': patch
'@power-seo/content-analysis': patch
---

Fix keyword density calculation for multi-word keyphrases
```

### Step 3 — Commit and Push

```bash
git add .
git commit -m "fix: keyword density for multi-word keyphrases"
git push origin main
```

Or create a pull request and merge it.

### Step 4 — Merge the Version PR

After pushing to `main`, the GitHub Actions release workflow will:

1. Detect the changeset files
2. Create a **"chore: version packages"** pull request that:
   - Bumps version numbers in `package.json` files
   - Updates `CHANGELOG.md` files
   - Removes the changeset files
3. **Merge this PR** to trigger the actual npm publish

### Step 5 — Automatic Publish

When you merge the version PR, GitHub Actions will:

1. Build all packages (`pnpm build`)
2. Run `changeset publish` to publish only the changed packages to npm
3. Create a GitHub release with tags

---

## Part 4: Manual Publishing Without Changesets

If you need to publish without the Changesets workflow (e.g., hotfix):

### Bump Versions Manually

```bash
# Bump a single package
cd packages/core
npm version patch  # or minor, major

# Or bump all packages at once
pnpm -r exec npm version patch
```

### Build and Publish

```bash
pnpm build
pnpm -r publish --access public
```

---

## Troubleshooting

### "You must be logged in to publish packages"

```bash
npm login
npm whoami  # Verify you're logged in
```

### "You do not have permission to publish"

Make sure:

1. The `@power-seo` org exists on npm
2. Your account is a member of the org
3. You're using `--access public`

### "Package name already exists"

Someone else owns the package name. You'll need to either:

- Use a different scope (e.g., `@your-username/core`)
- Contact npm support

### "Cannot publish over previously published version"

You're trying to publish a version that already exists. Bump the version first:

```bash
npm version patch
```

### "402 Payment Required"

Scoped packages require `--access public` flag on free npm accounts:

```bash
npm publish --access public
```

### Workspace Dependencies Show "workspace:\*" on npm

This is expected. When pnpm publishes, it automatically replaces `workspace:*` with the actual version number (e.g., `^1.0.0`). If you see literal `workspace:*` on npm, you published without pnpm — always use `pnpm publish` or `pnpm -r publish`.

### Build Fails Before Publish

Packages must build in dependency order. Run from root:

```bash
pnpm build
```

Turborepo handles the correct build order automatically.

---

## npm Organization Management

### Add Team Members

```bash
npm org set power-seo USERNAME developer
```

Roles:

- `owner` — Full admin access
- `admin` — Can manage team members and packages
- `developer` — Can publish packages

### Remove Team Members

```bash
npm org rm power-seo USERNAME
```

### Check Organization Members

```bash
npm org ls power-seo
```

---

## Security Best Practices

1. **Never commit npm tokens** to git — use environment variables or GitHub Secrets
2. **Enable 2FA** on your npm account: [npmjs.com/settings/two-factor-authentication](https://www.npmjs.com/settings/two-factor-authentication)
3. **Use Automation tokens** for CI/CD (they bypass 2FA for publishing)
4. **Audit dependencies** before publishing: `pnpm audit`
5. **Review `npm pack --dry-run`** before first publish to ensure no secrets are included
6. **Rotate tokens** periodically — delete old tokens and create new ones

---

## Quick Reference

| Task                      | Command                                                   |
| ------------------------- | --------------------------------------------------------- |
| Login to npm              | `npm login`                                               |
| Check login               | `npm whoami`                                              |
| Build all packages        | `pnpm build`                                              |
| Create a changeset        | `pnpm changeset`                                          |
| Version packages (manual) | `pnpm version-packages`                                   |
| Publish all packages      | `pnpm release`                                            |
| Publish single package    | `cd packages/core && npm publish --access public`         |
| Preview package contents  | `npm pack --dry-run`                                      |
| Check package on npm      | `npm view @power-seo/core`                                |
| Unpublish (within 72h)    | `npm unpublish @power-seo/core@1.0.0`                     |
| Deprecate a version       | `npm deprecate @power-seo/core@1.0.0 "Use 1.0.1 instead"` |

---

## Checklist: First Publish

- [ ] npm account created and email verified
- [ ] `@power-seo` organization created on npm
- [ ] npm access token generated (Automation type)
- [ ] `npm login` successful locally
- [ ] GitHub repository created and code pushed
- [ ] `NPM_TOKEN` secret added to GitHub repository
- [ ] `pnpm install` completed
- [ ] `pnpm build` succeeded (all packages have `dist/`)
- [ ] `npm pack --dry-run` reviewed (no secrets in output)
- [ ] `pnpm -r publish --access public --no-git-checks` succeeded
- [ ] Packages visible on npmjs.com
- [ ] `npm install @power-seo/core` works in a test project
