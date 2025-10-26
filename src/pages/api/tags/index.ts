import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import fs from 'fs/promises';
import path from 'path';

export const POST: APIRoute = async ({ request }) => {
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
    const existingTag = tagsData.tags.find((t: any) => 
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

export const DELETE: APIRoute = async ({ request }) => {
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
    const tagToDelete = tagsData.tags.find((t: any) => t.id === id);
    if (!tagToDelete) {
      return new Response(JSON.stringify({ error: 'Tag not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if tag is in use
    const allPosts = await getCollection('blog');
    let postsUsingTag = 0;
    
    for (const post of allPosts) {
      const tags = post.data.tags || [];
      if (tags.includes(tagToDelete.name)) {
        postsUsingTag++;
      }
    }

    if (postsUsingTag > 0) {
      return new Response(JSON.stringify({ 
        error: `Cannot delete tag "${tagToDelete.name}" because it is used in ${postsUsingTag} post(s)` 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Remove tag from JSON file
    tagsData.tags = tagsData.tags.filter((t: any) => t.id !== id);
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