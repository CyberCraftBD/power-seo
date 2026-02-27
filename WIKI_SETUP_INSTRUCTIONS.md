# Power SEO Wiki Setup Instructions

Since the GitHub wiki repository needs to be initialized through the web interface, follow these steps to populate the wiki with our comprehensive documentation:

## Option 1: Manual Setup (Recommended for First Page)

1. **Visit the Wiki Page**
   - Go to: https://github.com/CyberCraftBD/power-seo/wiki
   - Click "Create the first page"

2. **Create Home Page**
   - Page title: `Home`
   - Copy content from: `docs/WIKI_HOME.md`
   - Click "Save Page"

3. **Create Remaining Pages**
   Once the wiki is initialized, click "New Page" and create:

   | Page Title | File to Copy From |
   |---|---|
   | Installation & Setup | `docs/wiki/01-installation-setup.md` |
   | Quick Start | `docs/wiki/02-quick-start.md` |
   | Package Selection | `docs/wiki/03-package-selection.md` |
   | Architecture | `docs/wiki/04-architecture.md` |
   | Core API | `docs/wiki/pkg-core.md` |
   | Schema API | `docs/wiki/pkg-schema.md` |
   | Troubleshooting | `docs/wiki/10-troubleshooting.md` |
   | CMS Blog Use Case | `docs/wiki/uc-cms-blog.md` |

## Option 2: Automated Setup (After First Page Exists)

Once you create the first page and the wiki.git repo is initialized, you can push remaining pages via git:

```bash
git clone https://github.com/CyberCraftBD/power-seo.wiki.git
cd power-seo.wiki

# Copy all markdown files
cp ../docs/wiki/*.md ./
cp ../docs/WIKI_HOME.md ./Home.md

# Commit and push
git add .
git commit -m "docs: populate wiki with guides"
git push origin main
```

## Current Documentation Files

All wiki content is ready in the repository:

```
docs/
├── WIKI_HOME.md (250 lines) — Wiki homepage
├── wiki/
│   ├── 01-installation-setup.md (400 lines)
│   ├── 02-quick-start.md (350 lines)
│   ├── 03-package-selection.md (500 lines)
│   ├── 04-architecture.md (500 lines)
│   ├── 10-troubleshooting.md (450 lines)
│   ├── pkg-core.md (400 lines)
│   ├── pkg-schema.md (500 lines)
│   └── uc-cms-blog.md (700 lines)
├── DISCUSSIONS.md (700 lines)
└── README.md (420 lines)
```

## GitHub Discussions (Already Created)

4 Q&A discussions are already live:
- #96: How do I install power-seo for Next.js?
- #97: Which packages do I need for my use case?
- #98: My meta tags aren't showing on social media. How do I debug?
- #99: Content analysis score seems too low. What affects the score?

Access at: https://github.com/CyberCraftBD/power-seo/discussions

## Support

- **Documentation in Repo**: https://github.com/CyberCraftBD/power-seo/tree/main/docs
- **README Links**: https://github.com/CyberCraftBD/power-seo#-documentation
- **Discussions**: https://github.com/CyberCraftBD/power-seo/discussions
