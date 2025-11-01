import fs from 'fs/promises';
import path from 'path';

export interface Author {
  id: string;
  name: string;
  email: string;
  bio: string;
  avatar?: string;
  social?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    website?: string;
  };
}

const AUTHORS_FILE = path.join(process.cwd(), 'public/data/authors/authors.json');

export async function getAuthors(): Promise<Author[]> {
  try {
    const data = await fs.readFile(AUTHORS_FILE, 'utf-8');
    const { authors } = JSON.parse(data);
    return authors || [];
  } catch (error) {
    console.error('Error loading authors:', error);
    // Return default author if file doesn't exist
    return [{
      id: 'default',
      name: 'Default Author',
      email: 'author@example.com',
      bio: 'A passionate writer and developer.',
      avatar: '',
      social: {}
    }];
  }
}

export async function getAuthor(id: string): Promise<Author | null> {
  const authors = await getAuthors();
  return authors.find(author => author.id === id) || null;
}

export async function saveAuthors(authors: Author[]): Promise<void> {
  const data = JSON.stringify({ authors }, null, 2);
  await fs.writeFile(AUTHORS_FILE, data, 'utf-8');
}