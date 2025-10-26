# Blog Update Scripts

This directory contains scripts to automate blog maintenance tasks.

## Scripts

### `update-posts.js`

**Purpose:** Updates sitemap, search index, and robots.txt after adding new blog posts.

**Usage:**
```bash
npm run update-posts
```

**What it does:**
1. Counts current blog posts
2. Builds the site to regenerate sitemap and search index
3. Verifies sitemap generation
4. Checks search index endpoint
5. Displays next steps for committing and deploying

**When to use:** After adding any new `.mdx` files to `public/data/posts/` and before committing.

### `pre-commit-hook.sh`

**Purpose:** Automatically runs the update script when blog posts are modified in a commit.

**Setup (Optional):**
```bash
# Copy to git hooks directory
cp scripts/pre-commit-hook.sh .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

**What it does:**
1. Detects if any `.mdx` files in `public/data/posts/` were added or modified
2. Automatically runs `npm run update-posts` if changes detected
3. Allows commit to proceed if successful, blocks if failed

## Workflow

### Manual Workflow (Recommended)
1. Add new blog post to `public/data/posts/yourpost.mdx`
2. Run `npm run update-posts`
3. Review changes with `git status`
4. Commit with `git add . && git commit -m "feat: add new blog post"`
5. Deploy with `git push`

### Automatic Workflow (Optional)
1. Install the pre-commit hook (see setup above)
2. Add new blog post to `public/data/posts/yourpost.mdx`
3. Commit normally - the hook will automatically run the update script
4. Deploy with `git push`

## What Gets Updated

### Sitemap (`/sitemap.xml`)
- Generated dynamically by Astro
- Includes all blog posts, categories, tags, and static pages
- Updates automatically when the site builds

### Search Index (`/api/search-index.json`)
- Generated dynamically by Astro API route
- Contains searchable content from all published posts
- Updates automatically when accessed

### Robots.txt (`/robots.txt`)
- Static file in `public/robots.txt`
- Already configured with proper directives
- Points to the sitemap location

## Troubleshooting

### Build Fails
- Check that all `.mdx` files have valid frontmatter
- Ensure no syntax errors in blog post content
- Verify all required frontmatter fields are present

### Sitemap Missing URLs
- Ensure posts have `draft: false` in frontmatter
- Check that `publishDate` is valid
- Verify posts are in the correct directory

### Search Index Empty
- Check the `/api/search-index.json` endpoint directly
- Ensure posts have content in the body
- Verify the API route is working properly

## Files Affected

When you run the update script, these files/endpoints are refreshed:
- `/sitemap.xml` - Main sitemap
- `/sitemap-index.xml` - Sitemap index (if using multiple sitemaps)
- `/api/search-index.json` - Search index API
- `/robots.txt` - Already exists, verified by script

The updates happen during the build process and are served dynamically by Astro.