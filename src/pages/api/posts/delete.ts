import type { APIRoute } from 'astro';
import fs from 'fs/promises';
import path from 'path';
import { isValidSession } from '../../../lib/session';

/**
 * Validates that a slug contains only safe characters
 * Prevents path traversal attacks
 */
function isValidSlug(slug: string): boolean {
  return /^[a-zA-Z0-9_-]+$/.test(slug) && slug.length > 0 && slug.length < 200;
}

export const POST: APIRoute = async ({ request, cookies }) => {
  // Check authentication
  const sessionToken = cookies.get('admin-session');
  if (!isValidSession(sessionToken?.value)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { slug } = await request.json();

    if (!slug) {
      return new Response(JSON.stringify({ error: 'Slug is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate slug to prevent path traversal
    if (!isValidSlug(slug)) {
      return new Response(JSON.stringify({ error: 'Invalid slug format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Delete from new location
    const newFilePath = path.join(process.cwd(), 'public', 'data', 'posts', `${slug}.mdx`);
    let deletedFromNew = false;
    try {
      await fs.unlink(newFilePath);
      deletedFromNew = true;
    } catch (e) {
      console.log('File not found in new location:', newFilePath);
    }
    
    // Also try to delete from old location
    const oldFilePath = path.join(process.cwd(), 'src', 'content', 'blog', `${slug}.mdx`);
    let deletedFromOld = false;
    try {
      await fs.unlink(oldFilePath);
      deletedFromOld = true;
    } catch (e) {
      console.log('File not found in old location:', oldFilePath);
    }
    
    if (!deletedFromNew && !deletedFromOld) {
      return new Response(JSON.stringify({ error: 'Post not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ 
      success: true,
      message: `Post "${slug}" deleted successfully`
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to delete post',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};