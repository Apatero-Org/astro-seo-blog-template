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
    const { imageName } = await request.json();
    
    if (!imageName || typeof imageName !== 'string') {
      return new Response(JSON.stringify({ error: 'Image name is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Security check - prevent directory traversal
    if (imageName.includes('../') || imageName.includes('..\\')) {
      return new Response(JSON.stringify({ error: 'Invalid image name' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Delete the image file
    const imagePath = path.join(process.cwd(), 'public', 'blog-images', imageName);
    
    // Check if file exists
    try {
      await fs.access(imagePath);
    } catch {
      return new Response(JSON.stringify({ error: 'Image not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Delete the file
    await fs.unlink(imagePath);

    // Remove metadata for this image
    const metadataPath = path.join(process.cwd(), 'public', 'blog-images', 'metadata', 'images-metadata.json');
    let metadataData = { images: {} };
    
    try {
      const content = await fs.readFile(metadataPath, 'utf-8');
      metadataData = JSON.parse(content);
    } catch (e) {
      // File doesn't exist yet, use default
    }

    // Remove the image metadata
    if (metadataData.images[imageName]) {
      delete metadataData.images[imageName];
      
      // Save updated metadata
      await fs.writeFile(metadataPath, JSON.stringify(metadataData, null, 2));
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Image deleted successfully'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error deleting image:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete image' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};