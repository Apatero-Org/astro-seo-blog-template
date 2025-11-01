import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '../config/languages';

export interface BlogPost {
  id: string;
  slug: string;
  body: string;
  collection: string;
  language: string; // ISO 639-1 language code
  data: {
    title: string;
    description: string;
    publishDate: Date;
    updateDate?: Date;
    author: string;
    category: string;
    tags: string[];
    featured: boolean;
    draft: boolean;
    heroImage?: string;
    heroImageAlt?: string;
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string;
    noindex?: boolean;
    nofollow?: boolean;
    canonicalUrl?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
  };
}

/**
 * Gets all blog posts from both the new location (public/data/posts)
 * and the old location (src/content/blog) for backward compatibility
 * Supports multiple languages with structure: posts/[lang]/slug.mdx
 */
export async function getAllBlogPosts(language: string = DEFAULT_LANGUAGE): Promise<BlogPost[]> {
  const posts: BlogPost[] = [];

  // 1. Read from new location: public/data/posts/
  const postsDir = path.join(process.cwd(), 'public', 'data', 'posts');
  try {
    await fs.access(postsDir);

    // For English (default), read from root posts directory
    if (language === DEFAULT_LANGUAGE) {
      const files = await fs.readdir(postsDir);
      const mdxFiles = files.filter(file => file.endsWith('.mdx') || file.endsWith('.md'));

      for (const file of mdxFiles) {
        const filePath = path.join(postsDir, file);
        const stats = await fs.stat(filePath);

        // Skip if it's a directory
        if (stats.isDirectory()) continue;

        const content = await fs.readFile(filePath, 'utf-8');
        const { data, content: body } = matter(content);

        const slug = file.replace(/\.(mdx|md)$/, '');

        posts.push({
          id: slug,
          slug,
          body,
          collection: 'blog',
          language: DEFAULT_LANGUAGE,
          data: {
            title: data.title || '',
            description: data.description || '',
            publishDate: new Date(data.publishDate || Date.now()),
            updateDate: data.updateDate ? new Date(data.updateDate) : undefined,
            author: data.author || 'default',
            category: data.category || 'Uncategorized',
            tags: Array.isArray(data.tags) ? data.tags : [],
            featured: data.featured || false,
            draft: data.draft || false,
            heroImage: data.heroImage,
            heroImageAlt: data.heroImageAlt,
            seoTitle: data.seoTitle,
            seoDescription: data.seoDescription,
            seoKeywords: data.seoKeywords,
            noindex: data.noindex,
            nofollow: data.nofollow,
            canonicalUrl: data.canonicalUrl,
            ogTitle: data.ogTitle,
            ogDescription: data.ogDescription,
            ogImage: data.ogImage,
          }
        });
      }
    } else {
      // For other languages, read from language subdirectory
      const langDir = path.join(postsDir, language);
      try {
        await fs.access(langDir);
        const files = await fs.readdir(langDir);
        const mdxFiles = files.filter(file => file.endsWith('.mdx') || file.endsWith('.md'));

        for (const file of mdxFiles) {
          const filePath = path.join(langDir, file);
          const content = await fs.readFile(filePath, 'utf-8');
          const { data, content: body } = matter(content);

          const slug = file.replace(/\.(mdx|md)$/, '');

          posts.push({
            id: slug,
            slug,
            body,
            collection: 'blog',
            language,
            data: {
              title: data.title || '',
              description: data.description || '',
              publishDate: new Date(data.publishDate || Date.now()),
              updateDate: data.updateDate ? new Date(data.updateDate) : undefined,
              author: data.author || 'default',
              category: data.category || 'Uncategorized',
              tags: Array.isArray(data.tags) ? data.tags : [],
              featured: data.featured || false,
              draft: data.draft || false,
              heroImage: data.heroImage,
              heroImageAlt: data.heroImageAlt,
              seoTitle: data.seoTitle,
              seoDescription: data.seoDescription,
              seoKeywords: data.seoKeywords,
              noindex: data.noindex,
              nofollow: data.nofollow,
              canonicalUrl: data.canonicalUrl,
              ogTitle: data.ogTitle,
              ogDescription: data.ogDescription,
              ogImage: data.ogImage,
            }
          });
        }
      } catch (error) {
        // Language directory doesn't exist, that's ok
      }
    }
  } catch (error) {
    // Directory doesn't exist yet, that's ok
  }
  
  // 2. Also read from old location for backward compatibility (English only)
  if (language === DEFAULT_LANGUAGE) {
    const oldPostsDir = path.join(process.cwd(), 'src', 'content', 'blog');
    try {
      await fs.access(oldPostsDir);
      const files = await fs.readdir(oldPostsDir);
      const mdxFiles = files.filter(file => file.endsWith('.mdx') || file.endsWith('.md'));

      for (const file of mdxFiles) {
        const slug = file.replace(/\.(mdx|md)$/, '');

        // Skip if we already have this post from the new location
        if (posts.find(p => p.slug === slug)) {
          continue;
        }

        const filePath = path.join(oldPostsDir, file);
        const content = await fs.readFile(filePath, 'utf-8');
        const { data, content: body } = matter(content);

        posts.push({
          id: slug,
          slug,
          body,
          collection: 'blog',
          language: DEFAULT_LANGUAGE,
          data: {
            title: data.title || '',
            description: data.description || '',
            publishDate: new Date(data.publishDate || Date.now()),
            updateDate: data.updateDate ? new Date(data.updateDate) : undefined,
            author: data.author || 'default',
            category: data.category || 'Uncategorized',
            tags: Array.isArray(data.tags) ? data.tags : [],
            featured: data.featured || false,
            draft: data.draft || false,
            heroImage: data.heroImage,
            heroImageAlt: data.heroImageAlt,
            seoTitle: data.seoTitle,
            seoDescription: data.seoDescription,
            seoKeywords: data.seoKeywords,
            noindex: data.noindex,
            nofollow: data.nofollow,
            canonicalUrl: data.canonicalUrl,
            ogTitle: data.ogTitle,
            ogDescription: data.ogDescription,
            ogImage: data.ogImage,
          }
        });
      }
    } catch (error) {
      // Old directory doesn't exist or has issues, that's ok
    }
  }

  return posts;
}

/**
 * Gets all published (non-draft) blog posts for a specific language
 */
export async function getPublishedBlogPosts(language: string = DEFAULT_LANGUAGE): Promise<BlogPost[]> {
  const allPosts = await getAllBlogPosts(language);
  return allPosts.filter(post => !post.data.draft);
}

/**
 * Gets a single blog post by slug and language
 */
export async function getBlogPost(slug: string, language: string = DEFAULT_LANGUAGE): Promise<BlogPost | null> {
  const postsDir = path.join(process.cwd(), 'public', 'data', 'posts');

  // Determine file path based on language
  let filePath: string;
  if (language === DEFAULT_LANGUAGE) {
    // English posts are in root posts directory
    filePath = path.join(postsDir, `${slug}.mdx`);
  } else {
    // Other languages are in subdirectories
    filePath = path.join(postsDir, language, `${slug}.mdx`);
  }

  // Try to read the post
  try {
    await fs.access(filePath);
    const content = await fs.readFile(filePath, 'utf-8');
    const { data, content: body } = matter(content);

    return {
      id: slug,
      slug,
      body,
      collection: 'blog',
      language,
      data: {
        title: data.title || '',
        description: data.description || '',
        publishDate: new Date(data.publishDate || Date.now()),
        updateDate: data.updateDate ? new Date(data.updateDate) : undefined,
        author: data.author || 'default',
        category: data.category || 'Uncategorized',
        tags: Array.isArray(data.tags) ? data.tags : [],
        featured: data.featured || false,
        draft: data.draft || false,
        heroImage: data.heroImage,
        heroImageAlt: data.heroImageAlt,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        seoKeywords: data.seoKeywords,
        noindex: data.noindex,
        nofollow: data.nofollow,
        canonicalUrl: data.canonicalUrl,
        ogTitle: data.ogTitle,
        ogDescription: data.ogDescription,
        ogImage: data.ogImage,
      }
    };
  } catch (error) {
    // File doesn't exist in new location
  }

  // Try the old location for English only (backward compatibility)
  if (language === DEFAULT_LANGUAGE) {
    const oldFilePath = path.join(process.cwd(), 'src', 'content', 'blog', `${slug}.mdx`);
    try {
      await fs.access(oldFilePath);
      const content = await fs.readFile(oldFilePath, 'utf-8');
      const { data, content: body } = matter(content);

      return {
        id: slug,
        slug,
        body,
        collection: 'blog',
        language: DEFAULT_LANGUAGE,
        data: {
          title: data.title || '',
          description: data.description || '',
          publishDate: new Date(data.publishDate || Date.now()),
          updateDate: data.updateDate ? new Date(data.updateDate) : undefined,
          author: data.author || 'default',
          category: data.category || 'Uncategorized',
          tags: Array.isArray(data.tags) ? data.tags : [],
          featured: data.featured || false,
          draft: data.draft || false,
          heroImage: data.heroImage,
          heroImageAlt: data.heroImageAlt,
          seoTitle: data.seoTitle,
          seoDescription: data.seoDescription,
          seoKeywords: data.seoKeywords,
          noindex: data.noindex,
          nofollow: data.nofollow,
          canonicalUrl: data.canonicalUrl,
          ogTitle: data.ogTitle,
          ogDescription: data.ogDescription,
          ogImage: data.ogImage,
        }
      };
    } catch (error) {
      // Post not found
    }
  }

  return null;
}

/**
 * Get all available languages for a specific post slug
 */
export async function getAvailableLanguagesForPost(slug: string): Promise<string[]> {
  const availableLanguages: string[] = [];
  const postsDir = path.join(process.cwd(), 'public', 'data', 'posts');

  // Check each supported language
  for (const lang of SUPPORTED_LANGUAGES) {
    // Check for both .mdx and .md extensions
    for (const ext of ['.mdx', '.md']) {
      let filePath: string;
      if (lang === DEFAULT_LANGUAGE) {
        filePath = path.join(postsDir, `${slug}${ext}`);
      } else {
        filePath = path.join(postsDir, lang, `${slug}${ext}`);
      }

      try {
        await fs.access(filePath);
        availableLanguages.push(lang);
        break; // Found the file, no need to check other extensions
      } catch (error) {
        // File doesn't exist with this extension
      }
    }
  }

  return availableLanguages;
}