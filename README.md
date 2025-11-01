# Astro SEO Blog Template

A modern, feature-rich, and SEO-optimized blog template built with [Astro](https://astro.build). Perfect for developers, writers, and content creators who want a fast, scalable, and easily customizable blogging platform with a built-in CMS.

## 🎯 Why Choose This Template?

- **Zero Configuration** - Works out of the box with sensible defaults
- **Built-in CMS** - No external CMS needed, manage everything from the dashboard
- **File-Based** - No database required, all content stored as files
- **Production Ready** - Pre-commit hooks, ENV authentication, and security best practices
- **100 Lighthouse Score** - Optimized for performance, SEO, accessibility, and best practices
- **Fully Customizable** - Modern monochromatic design that's easy to brand

## 📸 Screenshots

### Single Blog Page
![Single Blog Page](./public/Single%20Blog%20Page.png)

### Search Component
![Search Component](./public/Search%20Component.png)

### Dark Mode
![Dark Mode](./public/Dark%20Mode.png)

### Language Switcher
![Language Switcher Component](./public/Language%20Switcher%20Component.png)

### Admin CMS Dashboard
![CMS Dashboard](./public/CMS%20Dashboard.png)

### Author Page
![Author Page](./public/Author%20Page.png)

## ✨ Features

### Core Features
- **SEO Optimized**: Built-in SEO best practices with meta tags, Open Graph, Twitter Cards, and JSON-LD structured data
- **Dark Mode**: Automatic dark mode support with user preference persistence and system detection
- **Multi-language Support**: Full i18n support with 12+ languages (English, Spanish, French, German, Japanese, Korean, Chinese, Portuguese, Hebrew, Hindi, Indonesian, Vietnamese)
- **MDX Support**: Write blog posts with MDX for enhanced content capabilities and React components
- **Search Functionality**: Fast client-side search to help readers find content instantly
- **RSS Feed**: Automatic RSS feed generation for subscribers
- **Sitemap**: Automatically generated sitemap for better SEO crawling
- **Category & Tag System**: Organize posts with categories and tags with dedicated archive pages
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Performance Focused**: Lightning-fast page loads with Astro's static-first approach (<1s load time)
- **Reading Time**: Automatic reading time calculation
- **Table of Contents**: Auto-generated TOC for long-form content
- **Social Sharing**: Built-in social sharing buttons

### Admin CMS Dashboard
- **Custom Admin Panel**: Built-in CMS dashboard at `/admin`
- **ENV Authentication**: Secure login with environment variable credentials (no database needed)
- **Posts Management**: Create, edit, delete, and manage all blog posts
- **Media Library**: Upload and manage images with metadata (alt text, captions, titles)
- **Authors Management**: Add and manage multiple authors with profiles
- **Categories & Tags**: Create and organize content taxonomy
- **Settings Panel**: Configure site settings from the dashboard
- **Draft Mode**: Save posts as drafts before publishing
- **Featured Posts**: Mark posts as featured for homepage display

### Developer Features
- **Pre-commit Hooks**: Automatic code formatting and linting before commits
- **TypeScript**: Full TypeScript support for type safety
- **Hot Module Replacement**: Instant updates during development
- **Server-Side Rendering**: Built with Node.js adapter for dynamic features
- **View Transitions**: Smooth page transitions with Astro's View Transitions API
- **Image Optimization**: Automatic image optimization and lazy loading
- **Code Syntax Highlighting**: Beautiful code blocks with syntax highlighting

## Tech Stack

- **Framework**: [Astro 5.x](https://astro.build)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Content**: MDX & Markdoc
- **Deployment**: Node.js standalone server
- **TypeScript**: Full TypeScript support

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/Apatero-Org/astro-seo-blog-template.git
   cd astro-seo-blog-template
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:
   ```env
   # Admin Authentication (Required for /admin access)
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=your-secure-password

   # Site Configuration
   PUBLIC_SITE_URL=http://localhost:4321

   # Analytics (Optional)
   PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

4. **Configure your site**

   Edit `public/data/settings/site-config.json` to customize your blog:
   ```json
   {
     "title": "Your Blog Title",
     "description": "Your blog description",
     "url": "https://yourdomain.com",
     "author": "Your Name",
     "authorEmail": "your.email@example.com"
   }
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Access your blog**
   - **Frontend**: `http://localhost:4321`
   - **Admin Dashboard**: `http://localhost:4321/admin` (use credentials from `.env`)

## 🔐 Admin Dashboard Access

The admin CMS is protected by environment variable authentication:

1. Set `ADMIN_USERNAME` and `ADMIN_PASSWORD` in your `.env` file
2. Navigate to `/admin` or `/admin/login`
3. Enter your credentials
4. Manage posts, media, authors, categories, tags, and settings

**Security Notes:**
- Admin credentials are stored in environment variables (not in the database)
- Session-based authentication with HTTP-only cookies
- All admin routes are protected and redirect to login if not authenticated
- Pre-commit hooks ensure no sensitive data is committed

## 📁 Project Structure

```
/
├── public/
│   ├── data/
│   │   ├── posts/              # Blog posts in MDX format
│   │   │   ├── *.mdx          # English posts (default)
│   │   │   ├── de/            # German translations
│   │   │   ├── es/            # Spanish translations
│   │   │   ├── fr/            # French translations
│   │   │   ├── ja/            # Japanese translations
│   │   │   ├── ko/            # Korean translations
│   │   │   └── ...            # Other languages
│   │   ├── settings/           # Site configuration JSON
│   │   ├── authors/            # Author profiles
│   │   ├── categories/         # Category definitions
│   │   └── tags/              # Tag definitions
│   ├── blog-images/            # Blog post images
│   │   └── metadata/          # Image metadata (alt text, captions)
│   └── Favicon.png            # Site favicon
├── src/
│   ├── components/
│   │   ├── blog/              # Blog-specific components
│   │   ├── common/            # Shared components (Header, Footer)
│   │   ├── landing/           # Landing page sections
│   │   ├── search/            # Search functionality
│   │   └── seo/               # SEO components
│   ├── layouts/
│   │   ├── BaseLayout.astro   # Main site layout
│   │   └── AdminLayout.astro  # Admin dashboard layout
│   ├── pages/
│   │   ├── admin/             # Admin CMS pages
│   │   ├── api/               # API endpoints
│   │   ├── blog/              # Blog pages (English)
│   │   ├── [lang]/            # Language-specific routes
│   │   ├── author/            # Author archive pages
│   │   ├── about.astro        # About page
│   │   └── index.astro        # Landing page
│   ├── lib/                   # Utility functions
│   ├── config/                # Configuration files
│   │   ├── languages.ts       # Language definitions
│   │   └── i18n.ts           # Internationalization
│   └── data/
│       └── site-config.ts     # Site configuration
├── .husky/                     # Pre-commit hooks
├── astro.config.mjs           # Astro configuration
├── tailwind.config.mjs        # Tailwind CSS configuration
└── package.json
```

## ✍️ Creating Blog Posts

### Option 1: Using the Admin Dashboard (Recommended)

1. Go to `/admin/posts`
2. Click "NEW POST"
3. Fill in post details (title, description, category, tags)
4. Write content using the markdown editor
5. Upload featured image
6. Save as draft or publish immediately

### Option 2: Manual File Creation

Create a new MDX file in `public/data/posts/`:

```mdx
---
title: "Your Post Title"
description: "A brief description of your post"
publishDate: 2025-01-15T10:00:00.000Z
updateDate: 2025-01-15T10:00:00.000Z
author: "your-author-id"
category: "technology"
tags: ["astro", "web-development"]
featured: false
draft: false
heroImage: "/blog-images/your-image.jpg"
heroImageAlt: "Description of your image"
seoTitle: "SEO-optimized title"
seoDescription: "SEO-optimized description"
ogImage: "/blog-images/your-image.jpg"
---

# Your Post Title

Your post content goes here using MDX/Markdown...

## Headings
### Subheadings

**Bold text** and *italic text*

- Bullet points
- More items

```javascript
// Code blocks with syntax highlighting
console.log("Hello World!");
```

### For Multilingual Posts

Create the same file structure in language subdirectories:
- English: `public/data/posts/your-post.mdx`
- German: `public/data/posts/de/your-post.mdx`
- Spanish: `public/data/posts/es/your-post.mdx`

## Configuration

### Site Settings

Edit `public/data/settings/site-config.json`:

- **Site Information**: Title, description, URL
- **Author Information**: Name, email, avatar
- **Navigation**: Custom navigation items
- **Social Links**: Twitter, GitHub, LinkedIn, etc.
- **Features**: Enable/disable dark mode, search, comments, RSS
- **Analytics**: Add Google Analytics ID
- **Blog CTA**: Configure call-to-action sections

### Astro Config

Edit `astro.config.mjs` for build and deployment settings:

- Site URL
- Trailing slash behavior
- Server configuration
- Image optimization

## 🛠️ Commands

| Command | Action |
| :------ | :----- |
| `npm install` | Install dependencies and set up pre-commit hooks |
| `npm run dev` | Start dev server at `localhost:4321` |
| `npm run build` | Build production site to `./dist/` |
| `npm run preview` | Preview production build locally |
| `npm run start` | Start production server |
| `npm run astro ...` | Run Astro CLI commands |
| `npm run format` | Format code with Prettier |
| `npm run lint` | Lint code with ESLint |

## 🔒 Pre-commit Hooks

This template includes pre-commit hooks powered by [Husky](https://typicode.github.io/husky/) to ensure code quality:

### Automatic Actions on Commit
- **Code Formatting**: Automatically formats staged files with Prettier
- **Linting**: Runs ESLint to catch errors
- **Type Checking**: Validates TypeScript types
- **Security**: Prevents committing sensitive data (`.env` files, secrets)

### Setup
Pre-commit hooks are automatically installed when you run `npm install`. If you need to reinstall them:

```bash
npm run prepare
```

### Bypassing Hooks (Not Recommended)
In rare cases where you need to bypass hooks:

```bash
git commit --no-verify -m "Your commit message"
```

**Note**: This should only be used in exceptional circumstances.

## 🚀 Deployment

This template uses the Node.js adapter for server-side rendering. Deploy to any platform that supports Node.js:

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on every push

### Netlify
1. Build command: `npm run build`
2. Publish directory: `dist`
3. Add environment variables in Netlify dashboard
4. Deploy

### Railway / Render / DigitalOcean
1. Connect your repository
2. Set environment variables
3. Build command: `npm run build`
4. Start command: `npm run start`

### Custom Server
```bash
npm run build
npm run start
```

### Environment Variables (Required for Production)

**IMPORTANT**: Set these environment variables in your hosting platform:

```env
# Admin Authentication (REQUIRED)
ADMIN_USERNAME=your-admin-username
ADMIN_PASSWORD=your-secure-password

# Site Configuration (REQUIRED)
PUBLIC_SITE_URL=https://yourdomain.com

# Analytics (Optional)
PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Node Environment
NODE_ENV=production
```

**Security Checklist:**
- ✅ Change default admin credentials
- ✅ Use strong passwords (16+ characters)
- ✅ Set `PUBLIC_SITE_URL` to your actual domain
- ✅ Enable HTTPS on your hosting platform
- ✅ Never commit `.env` files to version control
- ✅ Use different credentials for staging and production

## Customization

### Styling

This template uses Tailwind CSS. Customize your theme in `tailwind.config.mjs`:

- Colors
- Fonts
- Spacing
- Breakpoints

### Components

All components are in `src/components/`. Customize or create new ones to match your design.

### Layouts

Page layouts are in `src/layouts/`. Modify the base layout to change the overall structure.

## 🌍 Multi-language Support

This template supports **all major languages** out of the box with automatic routing and language switching. The i18n system is fully extensible and ready for any language you need.

### Adding Translations

1. **Create language-specific post directories:**
   ```
   public/data/posts/
   ├── your-post.mdx          # English (default)
   ├── es/
   │   └── your-post.mdx      # Spanish translation
   ├── de/
   │   └── your-post.mdx      # German translation
   └── fr/
       └── your-post.mdx      # French translation
   ```

2. **Access translated posts:**
   - English: `/blog/your-post`
   - Spanish: `/es/blog/your-post`
   - German: `/de/blog/your-post`

3. **Language switcher:**
   Automatically appears in the header when translations are available for the current post.

### Adding New Languages

Edit `src/config/languages.ts` to add more languages:

```typescript
export const LANGUAGES: Record<string, Language> = {
  // ... existing languages
  it: {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    flag: '🇮🇹',
    dir: 'ltr',
  },
};
```

## ⚡ Performance

This template is built for speed and achieves exceptional performance scores:

### Lighthouse Scores
- **Performance**: 100
- **Accessibility**: 100
- **Best Practices**: 100
- **SEO**: 100

### Key Optimizations
- **Static-First**: Astro generates static HTML for fast initial loads
- **Partial Hydration**: Only hydrate interactive components
- **Image Optimization**: Automatic image optimization and lazy loading
- **Code Splitting**: Automatic code splitting per route
- **Minimal JavaScript**: Ships minimal JS to the browser
- **Critical CSS**: Inlines critical CSS for faster rendering
- **Font Optimization**: Preconnect to Google Fonts, async loading
- **Prefetching**: Intelligent link prefetching for instant navigation

### Load Times
- **First Contentful Paint (FCP)**: <0.5s
- **Largest Contentful Paint (LCP)**: <1.0s
- **Time to Interactive (TTI)**: <1.5s
- **Total Blocking Time (TBT)**: <100ms

## 📚 FAQ

### How do I change the admin password?
Update the `ADMIN_PASSWORD` environment variable in your `.env` file or hosting platform settings.

### Can I use a different CMS?
Yes! While this template has a built-in CMS, you can integrate any headless CMS (Sanity, Contentful, etc.) by modifying the data fetching functions in `src/lib/posts.ts`.

### Does this work without a database?
Yes! All content is stored as files (MDX for posts, JSON for settings). No database required.

### How do I add Google Analytics?
Set the `PUBLIC_GA_MEASUREMENT_ID` environment variable with your Google Analytics measurement ID (e.g., `G-XXXXXXXXXX`).

### Can I customize the design?
Absolutely! The template uses Tailwind CSS. Customize colors, fonts, and styles in `tailwind.config.mjs` and component files.

### How do I add more languages?
Edit `src/config/languages.ts` to add language definitions, then create translation files in `public/data/posts/[lang]/`.

### Is this SEO-friendly?
Yes! Built-in SEO features include:
- Meta tags (title, description, keywords)
- Open Graph tags for social sharing
- Twitter Cards
- JSON-LD structured data
- Automatic sitemap generation
- RSS feed
- Semantic HTML

### How do I deploy to production?
See the [Deployment](#-deployment) section above. Most platforms (Vercel, Netlify) offer one-click deployment.

### Can I monetize my blog?
Yes! The template includes built-in blog CTA sections where you can add affiliate links, course promotions, or other monetization methods.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💬 Support

- **Documentation**: [Astro Documentation](https://docs.astro.build)
- **Issues**: [GitHub Issues](https://github.com/Apatero-Org/astro-seo-blog-template/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Apatero-Org/astro-seo-blog-template/discussions)

## ⭐ Show Your Support

If you find this template useful, please consider:
- ⭐ **Starring the repository**
- 🐛 **Reporting bugs or issues**
- 💡 **Suggesting new features**
- 🔀 **Contributing to the codebase**

## 🙏 Acknowledgments

Built with:
- [Astro](https://astro.build) - The web framework for content-driven websites
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [MDX](https://mdxjs.com) - Markdown for the component era

Special thanks to the Astro and open-source community.

---

Made with ❤️ by [Kevin Gabeci](https://kevingabeci.com) · Part of the [Apatero](https://github.com/Apatero-Org) organization
