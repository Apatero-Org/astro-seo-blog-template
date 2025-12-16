# Astro SEO Blog Template - Developer Guide

This document provides guidance for AI assistants and developers working on this codebase.

## Project Overview

An Astro-based, SEO-optimized multilingual blog template with an admin dashboard for content management.

## Project Architecture

```
src/
├── assets/styles/       # Global CSS and Tailwind styles
├── components/
│   ├── common/          # Reusable UI components (Footer, ThemeToggle, etc.)
│   ├── search/          # Search modal and functionality
│   └── seo/             # SEO-related components (SEOHead, StructuredData)
├── config/
│   └── languages.ts     # Multilingual configuration (12 languages supported)
├── data/
│   └── site-config.ts   # Site configuration loader
├── layouts/
│   ├── AdminLayout.astro  # Admin dashboard layout
│   └── BaseLayout.astro   # Public pages layout
├── lib/
│   ├── data.ts          # Data loading utilities (categories, tags, metadata)
│   ├── posts.ts         # Blog post loading and parsing
│   └── session.ts       # Session management (authentication)
├── middleware.ts        # Route protection for admin pages
└── pages/
    ├── admin/           # Admin dashboard pages
    ├── api/             # API endpoints
    │   ├── images/      # Image management APIs
    │   ├── posts/       # Post management APIs
    │   └── upload.ts    # File upload API
    ├── blog/            # Blog listing and posts
    └── [lang]/          # Localized routes

public/
├── blog-images/         # Uploaded images
└── data/
    ├── posts/           # Blog post MDX files
    │   ├── *.mdx        # English posts (default)
    │   └── [lang]/      # Translated posts (es/, fr/, etc.)
    └── settings/        # Configuration JSON files
```

## Coding Standards

### TypeScript

- Use explicit TypeScript interfaces for all data structures
- Export interfaces that might be used elsewhere
- Use type assertions sparingly and only when necessary

### Session Management

All authentication uses centralized session management via `src/lib/session.ts`:

```typescript
import { isValidSession, generateSessionToken, addSession, removeSession } from '../lib/session';

// Validate session
if (!isValidSession(sessionToken?.value)) {
  return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
}

// Create session on login
const token = generateSessionToken();
addSession(token);

// Remove session on logout
removeSession(sessionToken.value);
```

### API Endpoint Pattern

All API endpoints should follow this pattern:

```typescript
import type { APIRoute } from 'astro';
import { isValidSession } from '../../lib/session';

export const POST: APIRoute = async ({ request, cookies }) => {
  // 1. Authentication check
  const sessionToken = cookies.get('admin-session');
  if (!isValidSession(sessionToken?.value)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 2. Input validation
  const { param } = await request.json();
  if (!param || !isValid(param)) {
    return new Response(JSON.stringify({ error: 'Invalid input' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 3. Business logic with try/catch
  try {
    // ... implementation
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Operation failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
```

## Security Guidelines

### Authentication

- Never use static strings like `'authenticated'` for session tokens
- Always use `generateSessionToken()` from `src/lib/session.ts`
- Session tokens are 64-character cryptographically secure hex strings
- Sessions expire after 24 hours

### Input Validation

- **Slugs**: Validate with `/^[a-zA-Z0-9_-]+$/` pattern
- **File uploads**: Check both MIME type and file extension
- **Path traversal**: Never construct file paths from user input without validation

### File Uploads

- Maximum file size: 10MB
- Allowed extensions: jpg, jpeg, png, gif, webp, svg, avif
- Allowed MIME types: image/jpeg, image/png, image/gif, image/webp, image/svg+xml, image/avif

## Common Patterns

### Adding a New Language

1. Add language configuration to `src/config/languages.ts`:
```typescript
export const LANGUAGES: Record<string, Language> = {
  // ... existing languages
  newlang: {
    code: 'newlang',
    name: 'New Language',
    nativeName: 'Native Name',
    flag: '🏳️',
    dir: 'ltr', // or 'rtl' for right-to-left languages
  },
};
```

2. Add OG locale mapping in `getOGLocale()` function

3. Create translated posts in `public/data/posts/newlang/`

### Creating Blog Posts

Posts are MDX files in `public/data/posts/`:
- English: `public/data/posts/slug.mdx`
- Other languages: `public/data/posts/[lang]/slug.mdx`

Required frontmatter:
```yaml
---
title: "Post Title"
description: "Post description"
publishDate: 2024-01-15
author: "author-id"
category: "Category Name"
tags: ["tag1", "tag2"]
featured: false
draft: false
heroImage: "/blog-images/image.jpg"
heroImageAlt: "Image description"
---
```

### Parsing Posts

Use the helper functions in `src/lib/posts.ts`:
```typescript
import { getAllBlogPosts, getBlogPost, getPublishedBlogPosts } from '../lib/posts';

// Get all posts for a language
const posts = await getAllBlogPosts('en');

// Get single post
const post = await getBlogPost('my-slug', 'en');

// Get only published posts
const published = await getPublishedBlogPosts('fr');
```

## Troubleshooting

### Build Errors

1. **Missing dependencies**: Run `npm install`
2. **TypeScript errors**: Check interface definitions match actual data
3. **MDX parsing errors**: Verify frontmatter YAML syntax

### Authentication Issues

1. **Can't log in**: Check `ADMIN_EMAIL` and `ADMIN_PASS` env variables
2. **Session not persisting**: Verify cookies are enabled and secure context
3. **Unauthorized errors**: Session may have expired (24-hour limit)

### Multilingual Issues

1. **Wrong language displayed**: Check `currentLanguage` prop is passed to layouts
2. **Missing translations**: Verify file exists in correct language subdirectory
3. **Broken hreflang tags**: Ensure `getAvailableLanguagesForPost()` returns correct languages

## Environment Variables

Required:
```env
ADMIN_EMAIL=admin@example.com
ADMIN_PASS=secure-password
```

Optional:
```env
PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
PORT=4321
```

## Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Type checking
npm run astro check
```

## File Naming Conventions

- Components: PascalCase (`SEOHead.astro`, `ThemeToggle.astro`)
- Utilities: camelCase (`posts.ts`, `session.ts`)
- API routes: kebab-case paths (`/api/posts/delete.ts`)
- Posts: slug format (`my-blog-post.mdx`)
