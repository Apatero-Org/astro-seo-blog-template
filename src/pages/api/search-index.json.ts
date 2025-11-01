import type { APIRoute } from 'astro';
import { getPublishedBlogPosts } from '../../lib/posts';

export const GET: APIRoute = async () => {
  try {
    const posts = await getPublishedBlogPosts();
    
    const searchIndex = posts.map(post => ({
      slug: post.slug,
      title: post.data.title,
      description: post.data.description,
      category: post.data.category,
      tags: post.data.tags,
      author: post.data.author,
      publishDate: post.data.publishDate.toISOString(),
      content: post.body.substring(0, 500), // First 500 chars for search
      featured: post.data.featured || false,
      heroImage: post.data.heroImage,
      url: `/blog/${post.slug}`
    }));

    return new Response(JSON.stringify(searchIndex), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'max-age=3600' // Cache for 1 hour
      }
    });
  } catch (error) {
    console.error('Error generating search index:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate search index' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};