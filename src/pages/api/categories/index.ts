import type { APIRoute } from 'astro';
import fs from 'fs/promises';
import path from 'path';
import { isValidSession } from '../../../lib/session';

const CATEGORIES_FILE = path.join(process.cwd(), 'public', 'data', 'categories', 'categories.json');

export const GET: APIRoute = async () => {
  try {
    const data = await fs.readFile(CATEGORIES_FILE, 'utf-8');
    const { categories } = JSON.parse(data);
    
    return new Response(JSON.stringify({ categories }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch categories' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
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
    const { name } = await request.json();

    if (!name) {
      return new Response(JSON.stringify({ error: 'Category name is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const data = await fs.readFile(CATEGORIES_FILE, 'utf-8');
    const { categories } = JSON.parse(data);
    
    // Check if category already exists
    const exists = categories.some((cat: { name: string }) =>
      cat.name.toLowerCase() === name.toLowerCase()
    );
    
    if (exists) {
      return new Response(JSON.stringify({ error: 'Category already exists' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    
    // Create slug from name
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    const id = slug;
    
    const newCategory = { id, name, slug };
    categories.push(newCategory);
    
    await fs.writeFile(
      CATEGORIES_FILE, 
      JSON.stringify({ categories }, null, 2)
    );
    
    return new Response(JSON.stringify({ category: newCategory }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create category' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
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

    if (!id) {
      return new Response(JSON.stringify({ error: 'Category ID is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const data = await fs.readFile(CATEGORIES_FILE, 'utf-8');
    const { categories } = JSON.parse(data);
    
    const filteredCategories = categories.filter((cat: { id: string }) => cat.id !== id);
    
    if (filteredCategories.length === categories.length) {
      return new Response(JSON.stringify({ error: 'Category not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    
    await fs.writeFile(
      CATEGORIES_FILE, 
      JSON.stringify({ categories: filteredCategories }, null, 2)
    );
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to delete category' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};