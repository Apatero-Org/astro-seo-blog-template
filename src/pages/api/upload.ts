import type { APIRoute } from 'astro';
import fs from 'fs/promises';
import path from 'path';

export const POST: APIRoute = async ({ request, cookies }) => {
  // Check authentication
  const sessionToken = cookies.get('admin-session');
  if (sessionToken?.value !== 'authenticated') {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return new Response(JSON.stringify({ error: 'No file uploaded' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return new Response(JSON.stringify({ error: 'Invalid file type. Only images are allowed.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = file.name.split('.').pop();
    const filename = `${timestamp}-${randomString}.${extension}`;
    
    // Save file
    const uploadDir = path.join(process.cwd(), 'public', 'blog-images');
    await fs.mkdir(uploadDir, { recursive: true });
    
    const filePath = path.join(uploadDir, filename);
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(filePath, buffer);
    
    // Return the public URL
    const publicUrl = `/blog-images/${filename}`;
    
    return new Response(JSON.stringify({ 
      success: true, 
      url: publicUrl,
      filename: filename
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Upload failed: ' + error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};