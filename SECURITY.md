# Security Policy

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security vulnerability in @power-seo, please report it responsibly and not through public GitHub issues.

### Reporting Process

1. **Email**: Send a detailed report to `security@ccbd.dev` with:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if available)

2. **Timeline**:
   - We will acknowledge receipt within 48 hours
   - We will provide a status update within 5 business days
   - We aim to release a fix within 30 days for critical vulnerabilities

3. **Disclosure**:
   - We will credit you in the security advisory (unless you prefer anonymity)
   - We will work with you to coordinate responsible disclosure
   - We will provide a timeline for public disclosure

## Security Best Practices for Users

- **Keep dependencies updated**: Run `npm audit` regularly and update packages
- **Use npm ci in CI/CD**: Use `npm ci` instead of `npm install` for reproducible builds
- **Enable npm audit**: Keep npm security advisories enabled
- **Lock file management**: Commit `package-lock.json` / `pnpm-lock.yaml` to version control
- **Review supply chain**: Monitor the [@power-seo organization](https://www.npmjs.com/org/power-seo) for updates

## Security Features of @power-seo

- ✅ **No install scripts** — No `postinstall` or `preinstall` hooks
- ✅ **No runtime network access** — All packages are pure computation with no telemetry
- ✅ **No eval or dynamic code** — No `eval()` or `Function()` constructor usage
- ✅ **No prototype pollution** — Safe object handling with no `__proto__` manipulation
- ✅ **XSS prevention** — JSON-LD uses `JSON.stringify()` for safe escaping
- ✅ **No ReDoS vulnerabilities** — String-based parsing, no unsafe regex patterns
- ✅ **License compliance** — MIT Licensed with clear licensing across all packages
- ✅ **Minimal dependencies** — Zero runtime dependencies (TypeScript only)
- ✅ **CI-signed builds** — All releases published via verified GitHub Actions workflow

## Vulnerability Response

When a security vulnerability is reported:

1. **Investigation**: Our team will investigate and verify the vulnerability
2. **Patch Development**: We will develop and test a fix
3. **Release**: We will release a patched version with clear security advisory
4. **Announcement**: We will announce the fix through GitHub Security Advisories

## Previous Security Audits

- CodeQL static analysis on every pull request
- Socket.dev supply chain monitoring
- npm audit for dependency vulnerabilities
- Regular manual security code reviews

## Security Contact

For security inquiries, contact: `security@ccbd.dev` or via GitHub Security Advisory

---

Last Updated: 2026-03-01
