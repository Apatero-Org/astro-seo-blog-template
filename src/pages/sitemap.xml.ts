import type { APIRoute } from 'astro';
import { getPublishedBlogPosts } from '../lib/posts';
import { getCategories } from '../lib/data';
import { normalizeTagName } from '../lib/utils';
import { SITE_CONFIG } from '../data/site-config';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, getLanguagePrefix } from '../config/languages';

export const GET: APIRoute = async () => {
  const posts = await getPublishedBlogPosts();
  const categories = await getCategories();

  // Get unique tags from all posts
  const tags = [...new Set(posts.flatMap(post => post.data.tags))];

  // Get posts for all languages
  const allLanguagePosts = await Promise.all(
    SUPPORTED_LANGUAGES.map(async (lang) => ({
      lang,
      posts: await getPublishedBlogPosts(lang)
    }))
  );

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <!-- Homepage -->
  <url>
    <loc>${SITE_CONFIG.url}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Blog index (English) -->
  <url>
    <loc>${SITE_CONFIG.url}/blog</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>

  <!-- Blog index (Other languages) -->
  ${SUPPORTED_LANGUAGES.filter(lang => lang !== DEFAULT_LANGUAGE).map(lang => {
    const prefix = getLanguagePrefix(lang);
    return `
  <url>
    <loc>${SITE_CONFIG.url}${prefix}/blog</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`;
  }).join('')}

  <!-- About page -->
  <url>
    <loc>${SITE_CONFIG.url}/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Policy pages -->
  <url>
    <loc>${SITE_CONFIG.url}/terms-of-service</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${SITE_CONFIG.url}/privacy-policy</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${SITE_CONFIG.url}/refund-cancellation-policy</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${SITE_CONFIG.url}/ai-content-usage-policy</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>

  <!-- Blog posts (All languages) -->
  ${allLanguagePosts.flatMap(({ lang, posts: langPosts }) => {
    const prefix = getLanguagePrefix(lang);
    return langPosts.map(post => `
  <url>
    <loc>${SITE_CONFIG.url}${prefix}/blog/${post.slug}</loc>
    <lastmod>${post.data.publishDate.toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`);
  }).join('')}

  <!-- Category pages (English) -->
  ${categories.filter(category => {
    // Only include if category has posts
    const postsInCategory = posts.filter(
      post => post.data.category.toLowerCase() === category.name.toLowerCase()
    );
    return postsInCategory.length > 0;
  }).map(category => {
    // Get most recent post in category for lastmod
    const postsInCategory = posts.filter(
      post => post.data.category.toLowerCase() === category.name.toLowerCase()
    );
    const mostRecentPost = postsInCategory.sort(
      (a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime()
    )[0];
    const lastmod = mostRecentPost.data.publishDate.toISOString().split('T')[0];

    return `
  <url>
    <loc>${SITE_CONFIG.url}/blog/category/${encodeURIComponent(category.name.toLowerCase())}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
  }).join('')}

  <!-- Category pages (Other languages) -->
  ${allLanguagePosts.filter(({ lang }) => lang !== DEFAULT_LANGUAGE).flatMap(({ lang, posts: langPosts }) => {
    const prefix = getLanguagePrefix(lang);
    return categories.filter(category => {
      // Only include if category has posts in this language
      const postsInCategory = langPosts.filter(
        post => post.data.category.toLowerCase() === category.name.toLowerCase()
      );
      return postsInCategory.length > 0;
    }).map(category => {
      // Get most recent post in category for lastmod
      const postsInCategory = langPosts.filter(
        post => post.data.category.toLowerCase() === category.name.toLowerCase()
      );
      const mostRecentPost = postsInCategory.sort(
        (a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime()
      )[0];
      const lastmod = mostRecentPost.data.publishDate.toISOString().split('T')[0];

      return `
  <url>
    <loc>${SITE_CONFIG.url}${prefix}/blog/category/${encodeURIComponent(category.name.toLowerCase())}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });
  }).join('')}

  <!-- Tag pages (English) -->
  ${[...new Set(tags.map(tag => normalizeTagName(tag)))].filter(normalizedTag => {
    // Only include if tag has 5+ posts (quality threshold)
    const postsWithTag = posts.filter(post =>
      (post.data.tags || []).some(postTag => normalizeTagName(postTag) === normalizedTag)
    );
    return postsWithTag.length >= 5;
  }).map(normalizedTag => {
    // Get most recent post with this tag for lastmod
    const postsWithTag = posts.filter(post =>
      (post.data.tags || []).some(postTag => normalizeTagName(postTag) === normalizedTag)
    );
    const mostRecentPost = postsWithTag.sort(
      (a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime()
    )[0];
    const lastmod = mostRecentPost.data.publishDate.toISOString().split('T')[0];

    return `
  <url>
    <loc>${SITE_CONFIG.url}/blog/tag/${normalizedTag}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
  }).join('')}

  <!-- Tag pages (Other languages) -->
  ${allLanguagePosts.flatMap(({ lang, posts: langPosts }) => {
    if (lang === DEFAULT_LANGUAGE) return [];
    const prefix = getLanguagePrefix(lang);
    const langTags = [...new Set(langPosts.flatMap(post => post.data.tags || []))];

    // Get unique normalized tags and validate they have posts in this language
    const normalizedTags = [...new Set(langTags.map(tag => normalizeTagName(tag)))];

    return normalizedTags.filter(normalizedTag => {
      // Only include if this tag has 5+ posts in this specific language (quality threshold)
      const postsWithTag = langPosts.filter(post =>
        (post.data.tags || []).some(postTag => normalizeTagName(postTag) === normalizedTag)
      );
      return postsWithTag.length >= 5;
    }).map(normalizedTag => {
      // Get most recent post with this tag for lastmod
      const postsWithTag = langPosts.filter(post =>
        (post.data.tags || []).some(postTag => normalizeTagName(postTag) === normalizedTag)
      );
      const mostRecentPost = postsWithTag.sort(
        (a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime()
      )[0];
      const lastmod = mostRecentPost.data.publishDate.toISOString().split('T')[0];

      return `
  <url>
    <loc>${SITE_CONFIG.url}${prefix}/blog/tag/${normalizedTag}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
    });
  }).join('')}

  <!-- Author page -->
  <url>
    <loc>${SITE_CONFIG.url}/author/kevin</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>`;

  return new Response(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'max-age=3600' // Cache for 1 hour
    }
  });
};