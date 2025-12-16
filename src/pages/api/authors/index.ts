import type { APIRoute } from 'astro';
import { getAuthors, saveAuthors } from '../../../lib/authors';
import { isValidSession } from '../../../lib/session';

export const GET: APIRoute = async () => {
  try {
    const authors = await getAuthors();
    return new Response(JSON.stringify({ authors }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch authors' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

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
    const author = await request.json();
    const authors = await getAuthors();
    
    // Check if author with same ID already exists
    if (authors.find(a => a.id === author.id)) {
      return new Response(JSON.stringify({ error: 'Author with this ID already exists' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    authors.push(author);
    await saveAuthors(authors);
    
    return new Response(JSON.stringify({ success: true, author }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create author' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const PUT: APIRoute = async ({ request, cookies }) => {
  // Check authentication
  const sessionToken = cookies.get('admin-session');
  if (!isValidSession(sessionToken?.value)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const updatedAuthor = await request.json();
    const authors = await getAuthors();
    
    const index = authors.findIndex(a => a.id === updatedAuthor.id);
    if (index === -1) {
      return new Response(JSON.stringify({ error: 'Author not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    authors[index] = updatedAuthor;
    await saveAuthors(authors);
    
    return new Response(JSON.stringify({ success: true, author: updatedAuthor }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to update author' }), {
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
    const authors = await getAuthors();
    
    const filteredAuthors = authors.filter(a => a.id !== id);
    if (filteredAuthors.length === authors.length) {
      return new Response(JSON.stringify({ error: 'Author not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    await saveAuthors(filteredAuthors);
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to delete author' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};