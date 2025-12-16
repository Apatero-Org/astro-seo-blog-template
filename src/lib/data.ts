import fs from 'fs/promises';
import path from 'path';

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

export interface ImageMetadata {
  displayName?: string;
  alt?: string;
  title?: string;
  caption?: string;
  updatedAt?: string;
}

export interface ImagesMetadata {
  images: Record<string, ImageMetadata>;
}

export interface SeoSettings {
  sitemap: {
    enabled?: boolean;
    changefreq: string;
    priority: number;
  };
  schema: {
    enabled?: boolean;
    organization?: boolean;
    breadcrumbs?: boolean;
    faq?: boolean;
  };
}

export interface SiteConfig {
  title: string;
  description: string;
  url: string;
  author: string;
  locale: string;
  ogImage?: string;
  social?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
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

export async function getImagesMetadata(): Promise<ImagesMetadata> {
  try {
    const metadataPath = path.join(process.cwd(), 'public', 'blog-images', 'metadata', 'images-metadata.json');
    const data = await fs.readFile(metadataPath, 'utf-8');
    return JSON.parse(data) as ImagesMetadata;
  } catch (e) {
    console.error('Error loading images metadata:', e);
    return { images: {} };
  }
}

export async function getSeoSettings(): Promise<SeoSettings> {
  try {
    const seoPath = path.join(process.cwd(), 'public/data/settings/seo-settings.json');
    const data = await fs.readFile(seoPath, 'utf-8');
    return JSON.parse(data) as SeoSettings;
  } catch (e) {
    console.error('Error loading SEO settings:', e);
    return {
      sitemap: { enabled: true, priority: 0.5, changefreq: 'weekly' },
      schema: { enabled: true }
    };
  }
}

export async function getSiteConfig(): Promise<SiteConfig> {
  try {
    const configPath = path.join(process.cwd(), 'public/data/settings/site-config.json');
    const data = await fs.readFile(configPath, 'utf-8');
    return JSON.parse(data) as SiteConfig;
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