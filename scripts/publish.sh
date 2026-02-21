#!/usr/bin/env bash
# publish.sh — Publish only packages not yet on npm
# Usage: NPM_TOKEN=<token> bash scripts/publish.sh
# Or:    npm login && bash scripts/publish.sh

set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PACKAGES=(meta preview react readability redirects schema search-console sitemap tracking)

# If NPM_TOKEN is provided, use it; otherwise rely on npm login session
if [ -n "$NPM_TOKEN" ]; then
  echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > "$ROOT/.npmrc.publish"
  export NPM_CONFIG_USERCONFIG="$ROOT/.npmrc.publish"
fi

# Verify auth
echo "Checking npm auth..."
npm whoami --registry https://registry.npmjs.org
echo ""

PUBLISHED=()
SKIPPED=()
FAILED=()

for pkg in "${PACKAGES[@]}"; do
  dir="$ROOT/packages/$pkg"
  name=$(node -p "require('$dir/package.json').name")
  version=$(node -p "require('$dir/package.json').version")

  existing=$(npm view "$name@$version" version 2>/dev/null || echo "")
  if [ -n "$existing" ]; then
    echo "SKIP: $name@$version (already on npm)"
    SKIPPED+=("$name@$version")
    continue
  fi

  echo "Publishing $name@$version..."
  if (cd "$dir" && npm publish --access public); then
    echo "OK:   $name@$version"
    PUBLISHED+=("$name@$version")
  else
    echo "FAIL: $name@$version"
    FAILED+=("$name@$version")
  fi
  echo ""
done

# Cleanup temp npmrc if created
[ -f "$ROOT/.npmrc.publish" ] && rm -f "$ROOT/.npmrc.publish"

echo "=============================="
echo "Published:  ${#PUBLISHED[@]} packages"
for p in "${PUBLISHED[@]}"; do echo "  ✓ $p"; done
echo "Skipped:    ${#SKIPPED[@]} packages (already on npm)"
echo "Failed:     ${#FAILED[@]} packages"
for p in "${FAILED[@]}"; do echo "  ✗ $p"; done
echo "=============================="

[ ${#FAILED[@]} -eq 0 ] && exit 0 || exit 1
