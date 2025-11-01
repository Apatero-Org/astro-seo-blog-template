# Architecture Documentation

## Overview

The Astro SEO Blog Template is built on **Astro 5** with a focus on performance, SEO, and developer experience. It uses a **static-first approach** with optional server-side rendering for dynamic features.

## Core Technologies

| Technology | Purpose | Version |
|------------|---------|---------|
| **Astro** | Framework | 5.x |
| **TypeScript** | Type Safety | 5.x |
| **Tailwind CSS** | Styling | 3.x |
| **MDX** | Content Format | 3.x |
| **Node.js** | Runtime | 18+ |

---

## Architecture Principles

### 1. **Static-First**
- Most pages are pre-rendered at build time
- Generates pure HTML/CSS with minimal JavaScript
- Fast load times and excellent SEO

### 2. **File-Based Content**
- No database required
- Content stored as MDX files
- Git-friendly workflow
- Easy backup and migration

### 3. **Partial Hydration**
- Interactive components hydrate on demand
- Rest of the page remains static
- Minimal JavaScript footprint

### 4. **Type Safety**
- TypeScript throughout
- Compile-time error checking
- Better IDE support

---

## Project Structure

```
astro-seo-blog-template/
│
├── public/                      # Static assets (served as-is)
│   ├── data/
│   │   ├── posts/               # Blog posts (MDX files)
│   │   │   ├── *.mdx           # English posts
│   │   │   ├── es/             # Spanish posts
│   │   │   ├── fr/             # French posts
│   │   │   └── ...             # Other languages
│   │   ├── authors/
│   │   │   └── authors.json    # Author profiles
│   │   └── settings/
│   │       ├── site-config.json    # Site configuration
│   │       └── seo-settings.json   # SEO settings
│   │
│   ├── blog-images/            # Post images
│   ├── robots.txt              # Search engine directives
│   └── favicon.svg             # Site icon
│
├── src/
│   ├── assets/                 # Build-time processed assets
│   │   └── styles/
│   │       └── global.css      # Global styles
│   │
│   ├── components/             # Reusable UI components
│   │   ├── blog/               # Blog-specific components
│   │   │   ├── AuthorSidebar.astro
│   │   │   ├── BlogCTA.astro
│   │   │   ├── BlogSidebar.astro
│   │   │   ├── PostCard.astro
│   │   │   ├── SocialShare.astro
│   │   │   ├── TableOfContents.astro
│   │   │   └── ...
│   │   │
│   │   ├── common/             # Shared components
│   │   │   ├── Header.astro
│   │   │   ├── Footer.astro
│   │   │   ├── ThemeToggle.astro
│   │   │   └── LanguageSwitcher.astro
│   │   │
│   │   ├── landing/            # Landing page sections
│   │   │   ├── HeroSection.astro
│   │   │   ├── ShowcaseSection.astro
│   │   │   ├── ProcessSection.astro
│   │   │   ├── FAQSection.astro
│   │   │   └── BlogSection.astro
│   │   │
│   │   ├── search/             # Search functionality
│   │   │   └── SearchModal.astro
│   │   │
│   │   └── seo/                # SEO components
│   │       └── SEOHead.astro
│   │
│   ├── layouts/                # Page layouts
│   │   ├── BaseLayout.astro    # Base wrapper (head, scripts)
│   │   └── AdminLayout.astro   # Admin panel layout
│   │
│   ├── pages/                  # File-based routing
│   │   ├── blog/               # Blog routes
│   │   │   ├── index.astro     # /blog (list all posts)
│   │   │   ├── [slug].astro    # /blog/[slug] (single post)
│   │   │   ├── category/
│   │   │   │   └── [category].astro  # /blog/category/[category]
│   │   │   └── tag/
│   │   │       └── [tag].astro       # /blog/tag/[tag]
│   │   │
│   │   ├── [lang]/             # Multi-language routes
│   │   │   └── blog/           # Same structure as /blog
│   │   │
│   │   ├── admin/              # Admin panel
│   │   │   ├── index.astro     # Dashboard
│   │   │   ├── posts.astro     # Manage posts
│   │   │   ├── new.astro       # Create new post
│   │   │   ├── edit/
│   │   │   │   └── [slug].astro # Edit post
│   │   │   ├── categories.astro
│   │   │   ├── tags.astro
│   │   │   ├── authors.astro
│   │   │   ├── images.astro
│   │   │   ├── settings.astro
│   │   │   ├── login.astro
│   │   │   └── logout.astro
│   │   │
│   │   ├── api/                # API endpoints
│   │   │   ├── search-index.json.ts  # Search index
│   │   │   ├── authors/
│   │   │   ├── categories/
│   │   │   ├── tags/
│   │   │   ├── settings.ts
│   │   │   ├── upload.ts
│   │   │   └── ...
│   │   │
│   │   ├── author/
│   │   │   └── [author].astro  # Author archive
│   │   │
│   │   ├── page/
│   │   │   └── [page].astro    # Pagination
│   │   │
│   │   ├── index.astro         # Homepage
│   │   ├── about.astro         # About page
│   │   ├── 404.astro           # Not found page
│   │   ├── [...slug].astro     # Catch-all route
│   │   ├── rss.xml.ts          # RSS feed
│   │   └── sitemap.xml.ts      # Sitemap
│   │
│   ├── lib/                    # Utility functions
│   │   ├── posts.ts            # Post fetching and processing
│   │   ├── data.ts             # Data fetching (categories, tags, authors)
│   │   ├── utils.ts            # Helper functions
│   │   └── tags.ts             # Tag normalization
│   │
│   ├── config/                 # Configuration
│   │   ├── i18n.ts             # Translations
│   │   ├── languages.ts        # Language settings
│   │   └── site-config.ts      # Site configuration (from JSON)
│   │
│   └── env.d.ts                # TypeScript environment types
│
├── scripts/                    # Build and maintenance scripts
│   ├── update-posts.js         # Update sitemap/search after new posts
│   ├── pre-commit-hook.sh      # Git pre-commit hook
│   └── README.md               # Scripts documentation
│
├── .github/                    # GitHub-specific files
│   ├── workflows/
│   │   └── deploy.yml          # CI/CD workflow
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   └── PULL_REQUEST_TEMPLATE.md
│
├── astro.config.mjs            # Astro configuration
├── tailwind.config.mjs         # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies and scripts
│
├── README.md                   # Main documentation
├── FEATURES.md                 # Feature documentation
├── ARCHITECTURE.md             # This file
├── CONTRIBUTING.md             # Contribution guidelines
├── CHANGELOG.md                # Version history
├── CODE_OF_CONDUCT.md          # Community guidelines
└── LICENSE                     # MIT License
```

---

## Data Flow

### Blog Post Rendering

```
1. User requests /blog/my-post

2. Astro matches route: /blog/[slug].astro

3. getStaticPaths() runs at build time:
   - Scans public/data/posts/ for .mdx files
   - Parses frontmatter (title, date, author, etc.)
   - Returns array of posts with paths

4. Page renders:
   - Loads post content
   - Processes MDX to HTML
   - Injects metadata (author, category, tags)
   - Renders with BaseLayout

5. Static HTML output saved to dist/
```

### Category/Tag Pages

```
1. Dynamic categories/tags extracted at build time:
   - src/lib/data.ts reads all .mdx files
   - Extracts unique categories and tags from frontmatter
   - Returns arrays of Category/Tag objects

2. Archive pages generated:
   - /blog/category/[category].astro creates page per category
   - /blog/tag/[tag].astro creates page per tag
   - Filters posts matching category/tag

3. Sidebar displays:
   - Components call getCategories() / getTags()
   - Show counts and links
```

### Search System

```
1. Build time:
   - /api/search-index.json.ts generates search index
   - Includes all published posts
   - Outputs JSON with title, description, content, slug

2. Runtime:
   - SearchModal.astro loads index on demand
   - Client-side search with Fuse.js
   - Instant results as user types
   - No server requests needed
```

### Multi-Language

```
1. URL structure:
   - English (default): /blog/my-post
   - Other languages: /[lang]/blog/my-post

2. Content organization:
   - English: public/data/posts/my-post.mdx
   - Spanish: public/data/posts/es/my-post.mdx
   - Routes auto-generated for each language

3. UI translations:
   - src/config/i18n.ts contains translations
   - getTranslations(lang) returns translated strings
   - Components use translated text
```

---

## Key Components

### 1. **BaseLayout.astro**
**Purpose**: Wrapper for all pages
- Sets up `<head>` with meta tags
- Includes Header and Footer
- Handles dark mode
- Loads global styles
- Injects analytics (if configured)

### 2. **SEOHead.astro**
**Purpose**: SEO meta tags
- Open Graph tags
- Twitter Cards
- Schema.org structured data
- Canonical URLs
- Custom per-page metadata

### 3. **BlogSidebar.astro**
**Purpose**: Blog post sidebar
- Categories (with counts)
- Popular tags
- Related posts
- Featured post
- Author info
- "Back to blog" link

### 4. **SearchModal.astro**
**Purpose**: Search interface
- Modal overlay
- Search input
- Keyboard shortcuts (Cmd+K)
- Result list
- Highlights matches

### 5. **ThemeToggle.astro**
**Purpose**: Dark mode toggle
- Detects system preference
- Manual toggle button
- Saves to localStorage
- CSS class updates

---

## API Endpoints

### `/api/search-index.json`
**Method**: GET
**Returns**: JSON search index
```json
{
  "posts": [
    {
      "title": "Post Title",
      "description": "Description",
      "slug": "post-slug",
      "content": "Full text content...",
      "category": "technology",
      "tags": ["astro", "tutorial"]
    }
  ]
}
```

### `/api/categories/index`
**Method**: GET
**Returns**: Array of categories (dynamically extracted)

### `/api/tags/index`
**Method**: GET
**Returns**: Array of tags (dynamically extracted)

### `/api/authors/index`
**Method**: GET
**Returns**: Array of authors from authors.json

### `/api/settings`
**Method**: GET/POST
**Returns**: Site configuration
**Used by**: Admin panel

---

## Build Process

### Development (`npm run dev`)
```
1. Astro dev server starts on port 4321
2. Hot module replacement enabled
3. Files watched for changes
4. Instant browser updates
```

### Production (`npm run build`)
```
1. TypeScript compilation
2. Astro build process:
   - Pre-render static pages
   - Generate routes from getStaticPaths()
   - Process MDX to HTML
   - Optimize images
   - Bundle JavaScript
   - Minify CSS
   - Generate sitemap
   - Create RSS feed
3. Output to dist/ directory
4. Ready for deployment
```

### Deployment
```
1. Build artifacts in dist/
2. Deploy to hosting platform:
   - Vercel: Automatic detection
   - Netlify: astro.config.mjs used
   - Railway: Dockerfile or npm start
   - Static hosting: Serve dist/ folder
```

---

## Performance Optimizations

### 1. **Static Site Generation**
- Pages pre-rendered at build time
- No server processing on request
- Fast CDN delivery

### 2. **Partial Hydration**
- Only interactive components load JS
- Search, theme toggle, etc.
- Rest is pure HTML/CSS

### 3. **Image Optimization**
- Astro's `<Image>` component
- Automatic WebP conversion
- Responsive images (srcset)
- Lazy loading

### 4. **Code Splitting**
- JavaScript split by route
- Load only what's needed
- Smaller initial bundle

### 5. **CSS Purging**
- Tailwind purges unused CSS
- Production builds are minimal
- Fast stylesheet loads

### 6. **Caching**
- Static assets cached forever
- Cache-busting with hashes
- HTML cached with validation

---

## Security Considerations

### 1. **No Database**
- No SQL injection risk
- File-based content
- Git for version control

### 2. **Static Files**
- Minimal attack surface
- No server-side execution (default)
- CDN distribution

### 3. **Environment Variables**
- Secrets in `.env` (not committed)
- Build-time injection
- Never exposed to client

### 4. **Content Security**
- Input sanitization in admin panel
- MDX processed safely
- XSS prevention

### 5. **HTTPS**
- Enforced in production
- Automatic with modern hosts
- Redirect HTTP to HTTPS

---

## Extending the Template

### Add a New Page
1. Create `src/pages/new-page.astro`
2. Use BaseLayout
3. Add to navigation if needed

### Add a New Component
1. Create component in `src/components/`
2. Import where needed
3. Use TypeScript props interface

### Add a New API Endpoint
1. Create `src/pages/api/endpoint.ts`
2. Export GET/POST functions
3. Return JSON response

### Custom Post Type
1. Define schema in `src/content/config.ts`
2. Create collection folder
3. Add pages for rendering

### Integrate CMS
1. Replace file reading with CMS API
2. Keep frontmatter structure
3. Rebuild site on content changes

---

## Testing

### Manual Testing
- `npm run build` - Ensure no errors
- `npm run preview` - Test production build
- Check all routes
- Test dark mode
- Test search
- Verify SEO tags

### Automated Testing (Optional)
- Add Playwright for E2E tests
- Add Vitest for unit tests
- CI/CD runs tests on PR

---

## Deployment Checklist

- [ ] Update `site-config.json` with your info
- [ ] Add your Google Analytics ID (if using)
- [ ] Replace example blog post
- [ ] Update `about.astro` with your info
- [ ] Add your author to `authors.json`
- [ ] Customize colors in `tailwind.config.mjs`
- [ ] Update `LICENSE` if needed
- [ ] Set up domain
- [ ] Configure DNS
- [ ] Enable HTTPS
- [ ] Test all pages
- [ ] Submit sitemap to Google Search Console

---

## Maintenance

### Adding Posts
1. Create MDX file in `public/data/posts/`
2. Add frontmatter
3. Write content
4. Run `npm run build`
5. Deploy

### Updating Categories/Tags
- Automatic! Just use them in posts

### Updating Theme
- Edit `tailwind.config.mjs`
- Customize colors, fonts, etc.
- Rebuild

### Updating Dependencies
```bash
npm update
npm outdated  # Check for major updates
```

---

## Troubleshooting

### Build Fails
- Check TypeScript errors
- Verify all MDX files have valid frontmatter
- Ensure no syntax errors in components

### Images Not Loading
- Ensure images are in `public/blog-images/`
- Use paths starting with `/`
- Check file names match references

### Search Not Working
- Check `/api/search-index.json` endpoint
- Verify posts have content
- Check browser console for errors

### Dark Mode Issues
- Check localStorage
- Verify Tailwind dark mode config
- Inspect CSS classes

---

**Built with ❤️ by [Kevin Gabeci](https://kevingabeci.com) at [Apatero](https://apatero.com)**
