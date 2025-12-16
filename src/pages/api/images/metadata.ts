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
    const { imageName, metadata } = await request.json();
    
    if (!imageName || typeof imageName !== 'string') {
      return new Response(JSON.stringify({ error: 'Image name is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Read existing metadata
    const metadataPath = path.join(process.cwd(), 'public', 'blog-images', 'metadata', 'images-metadata.json');
    let metadataData = { images: {} };
    
    try {
      const content = await fs.readFile(metadataPath, 'utf-8');
      metadataData = JSON.parse(content);
    } catch (e) {
      // File doesn't exist yet, use default
    }

    // Update metadata for this image
    metadataData.images[imageName] = {
      displayName: metadata.displayName || '',
      alt: metadata.alt || '',
      title: metadata.title || '',
      caption: metadata.caption || '',
      updatedAt: new Date().toISOString()
    };

    // Save updated metadata
    await fs.writeFile(metadataPath, JSON.stringify(metadataData, null, 2));

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Metadata saved successfully'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error saving metadata:', error);
    return new Response(JSON.stringify({ error: 'Failed to save metadata' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const GET: APIRoute = async ({ url }) => {
  try {
    const imageName = url.searchParams.get('image');
    
    // Read metadata
    const metadataPath = path.join(process.cwd(), 'public', 'blog-images', 'metadata', 'images-metadata.json');
    let metadataData = { images: {} };
    
    try {
      const content = await fs.readFile(metadataPath, 'utf-8');
      metadataData = JSON.parse(content);
    } catch (e) {
      // File doesn't exist yet
    }

    if (imageName) {
      // Return metadata for specific image
      return new Response(JSON.stringify(metadataData.images[imageName] || {}), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Return all metadata
    return new Response(JSON.stringify(metadataData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error reading metadata:', error);
    return new Response(JSON.stringify({ error: 'Failed to read metadata' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};