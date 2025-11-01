import type { APIRoute } from 'astro';
import fs from 'fs/promises';
import path from 'path';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { slug } = await request.json();
    
    if (!slug) {
      return new Response(JSON.stringify({ error: 'Slug is required' }), {
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