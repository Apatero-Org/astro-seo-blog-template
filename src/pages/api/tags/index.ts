import type { APIRoute } from 'astro';
import fs from 'fs/promises';
import path from 'path';
import { isValidSession } from '../../../lib/session';

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
    const { name } = await request.json();
    
    if (!name || typeof name !== 'string') {
      return new Response(JSON.stringify({ error: 'Tag name is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Read existing tags from JSON file
    const tagsFilePath = path.join(process.cwd(), 'public', 'data', 'tags', 'tags.json');
    const tagsData = JSON.parse(await fs.readFile(tagsFilePath, 'utf-8'));
    
    // Check if tag already exists
    const existingTag = tagsData.tags.find((t: { name: string }) =>
      t.name.toLowerCase() === name.toLowerCase()
    );
    
    if (existingTag) {
      return new Response(JSON.stringify({ error: 'Tag already exists' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Add new tag with simple ID generation
    const newTag = {
      id: `tag-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      name: name.trim(),
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    };
    
    tagsData.tags.push(newTag);
    
    // Save updated tags
    await fs.writeFile(tagsFilePath, JSON.stringify(tagsData, null, 2));

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Tag created successfully',
      tag: newTag
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error creating tag:', error);
    return new Response(JSON.stringify({ error: 'Failed to create tag' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const DELETE: APIRoute = async ({ request, cookies }) => {
  // Check authentication
  const sessionToken = cookies.get('admin-session');
  if (!isValidSession(sessionToken?.value)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { id } = await request.json();

    if (!id || typeof id !== 'string') {
      return new Response(JSON.stringify({ error: 'Tag ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Read tags from JSON file
    const tagsFilePath = path.join(process.cwd(), 'public', 'data', 'tags', 'tags.json');
    const tagsData = JSON.parse(await fs.readFile(tagsFilePath, 'utf-8'));

    // Find the tag to delete
    const tagToDelete = tagsData.tags.find((t: { id: string }) => t.id === id);
    if (!tagToDelete) {
      return new Response(JSON.stringify({ error: 'Tag not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Remove tag from JSON file
    tagsData.tags = tagsData.tags.filter((t: { id: string }) => t.id !== id);
    await fs.writeFile(tagsFilePath, JSON.stringify(tagsData, null, 2));

    return new Response(JSON.stringify({
      success: true,
      message: 'Tag deleted successfully'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error deleting tag:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete tag' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};