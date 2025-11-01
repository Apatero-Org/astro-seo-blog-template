import fs from 'fs/promises';
import path from 'path';
import { getCollection } from 'astro:content';

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

/**
 * Get categories dynamically from blog posts
 * This extracts all unique categories used in published posts
 */
export async function getCategories(): Promise<Category[]> {
  try {
    // Try to get posts from MDX files
    const postsDir = path.join(process.cwd(), 'public/data/posts');
    const files = await fs.readdir(postsDir);
    const mdxFiles = files.filter(f => f.endsWith('.mdx') || f.endsWith('.md'));

    const categoriesSet = new Set<string>();

    for (const file of mdxFiles) {
      try {
        const content = await fs.readFile(path.join(postsDir, file), 'utf-8');
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        if (frontmatterMatch) {
          const categoryMatch = frontmatterMatch[1].match(/category:\s*['"]*([^'"\n]+)['"]*/)
;
          if (categoryMatch && categoryMatch[1]) {
            categoriesSet.add(categoryMatch[1].trim());
          }
        }
      } catch (e) {
        // Skip files that can't be read
      }
    }

    // Convert to Category objects
    const categories = Array.from(categoriesSet).map(cat => ({
      id: cat.toLowerCase().replace(/\s+/g, '-'),
      name: cat,
      slug: cat.toLowerCase().replace(/\s+/g, '-')
    }));

    return categories.length > 0 ? categories : [
      { id: 'getting-started', name: 'Getting Started', slug: 'getting-started' },
      { id: 'tutorials', name: 'Tutorials', slug: 'tutorials' },
      { id: 'technology', name: 'Technology', slug: 'technology' }
    ];
  } catch (e) {
    console.error('Error loading categories:', e);
    return [
      { id: 'getting-started', name: 'Getting Started', slug: 'getting-started' },
      { id: 'tutorials', name: 'Tutorials', slug: 'tutorials' },
      { id: 'technology', name: 'Technology', slug: 'technology' }
    ];
  }
}

/**
 * Get tags dynamically from blog posts
 * This extracts all unique tags used in published posts
 */
export async function getTags(): Promise<Tag[]> {
  try {
    const postsDir = path.join(process.cwd(), 'public/data/posts');
    const files = await fs.readdir(postsDir);
    const mdxFiles = files.filter(f => f.endsWith('.mdx') || f.endsWith('.md'));

    const tagsSet = new Set<string>();

    for (const file of mdxFiles) {
      try {
        const content = await fs.readFile(path.join(postsDir, file), 'utf-8');
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        if (frontmatterMatch) {
          const tagsMatch = frontmatterMatch[1].match(/tags:\s*\[([^\]]+)\]/);
          if (tagsMatch && tagsMatch[1]) {
            const tags = tagsMatch[1].split(',').map(t => t.trim().replace(/['"]/g, ''));
            tags.forEach(tag => tagsSet.add(tag));
          }
        }
      } catch (e) {
        // Skip files that can't be read
      }
    }

    // Convert to Tag objects
    const tags = Array.from(tagsSet).map(tag => ({
      id: tag.toLowerCase().replace(/\s+/g, '-'),
      name: tag,
      slug: tag.toLowerCase().replace(/\s+/g, '-')
    }));

    return tags;
  } catch (e) {
    console.error('Error loading tags:', e);
    return [];
  }
}

export async function getImagesMetadata(): Promise<any> {
  try {
    const metadataPath = path.join(process.cwd(), 'public', 'blog-images', 'metadata', 'images-metadata.json');
    const data = await fs.readFile(metadataPath, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    console.error('Error loading images metadata:', e);
    return { images: {} };
  }
}

export async function getSeoSettings(): Promise<any> {
  try {
    const seoPath = path.join(process.cwd(), 'public/data/settings/seo-settings.json');
    const data = await fs.readFile(seoPath, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    console.error('Error loading SEO settings:', e);
    return {
      sitemap: { enabled: true, priority: 0.5, changefreq: 'weekly' },
      schema: { enabled: true }
    };
  }
}

export async function getSiteConfig(): Promise<any> {
  try {
    const configPath = path.join(process.cwd(), 'public/data/settings/site-config.json');
    const data = await fs.readFile(configPath, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    console.error('Error loading site config:', e);
    return {
      title: "Astro SEO Blog",
      description: "A modern, SEO-optimized blog template",
      url: "https://astroseoblog.com",
      author: "Author",
      locale: "en"
    };
  }
}