import type { APIRoute } from 'astro';
import { z } from 'astro:content';

const commentSchema = z.object({
  postSlug: z.string(),
  author: z.string().min(1).max(100),
  email: z.string().email(),
  content: z.string().min(1).max(1000),
  website: z.string().optional(), // Honeypot field
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    
    // Validate data
    const parsed = commentSchema.safeParse(data);
    
    if (!parsed.success) {
      return new Response(JSON.stringify({ 
        error: 'Invalid data',
        details: parsed.error.errors 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Check honeypot
    if (parsed.data.website) {
      return new Response(JSON.stringify({ 
        error: 'Spam detected' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Generate unique ID
    const id = `comment-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    
    // Create comment object
    const comment = {
      id,
      postSlug: parsed.data.postSlug,
      author: parsed.data.author,
      email: parsed.data.email,
      content: parsed.data.content,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    
    // In a real implementation, you would save this to your data store
    // For now, we'll just return success
    // When using Keystatic, you would create a new file in the pending comments folder
    
    return new Response(JSON.stringify({ 
      success: true,
      message: 'Comment submitted for moderation',
      id: id,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Error submitting comment:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to submit comment' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const prerender = false;