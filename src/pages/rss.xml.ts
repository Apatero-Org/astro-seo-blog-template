import rss from '@astrojs/rss';
import { SITE_CONFIG } from '../data/site-config';
import { sortPostsByDate } from '../lib/utils';
import { getPublishedBlogPosts } from '../lib/posts';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getPublishedBlogPosts();
  const sortedPosts = sortPostsByDate(posts);
  
  return rss({
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    site: context.site || SITE_CONFIG.url,
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.publishDate,
      description: post.data.description,
      link: `/blog/${post.slug}`,
      categories: [post.data.category, ...post.data.tags],
      author: post.data.author || SITE_CONFIG.author,
    })),
    customData: `<language>${SITE_CONFIG.locale}</language>`,
  });
}