import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Normalize tag names for URLs (alias for slugify)
 */
export const normalizeTagName = slugify;

export function sortPostsByDate<T extends { data: { publishDate: Date } }>(
  posts: T[]
): T[] {
  return posts.sort(
    (a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime()
  );
}

export interface Heading {
  depth: number;
  text: string;
  slug: string;
}

export function extractHeadings(markdown: string): Heading[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: Heading[] = [];
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    const depth = match[1].length;
    const text = match[2].trim();
    const slug = slugify(text);

    headings.push({ depth, text, slug });
  }

  return headings;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export function extractFAQ(markdown: string): FAQItem[] {
  const faqItems: FAQItem[] = [];

  // Find FAQ section - look for headings like "FAQ", "Frequently Asked Questions", etc.
  const faqSectionRegex = /^##\s+(FAQ|Frequently Asked Questions|Common Questions)[\s\S]*$/im;
  const faqMatch = markdown.match(faqSectionRegex);

  if (!faqMatch) {
    return faqItems;
  }

  // Get the content after the FAQ heading
  const faqSectionStart = faqMatch.index!;
  const afterFAQ = markdown.substring(faqSectionStart);

  // Find the end of FAQ section (next ## heading or end of document)
  const nextSectionMatch = afterFAQ.substring(1).match(/^##\s+/m);
  const faqContent = nextSectionMatch
    ? afterFAQ.substring(0, nextSectionMatch.index! + 1)
    : afterFAQ;

  // Extract Q&A pairs
  // Pattern: **Question?** followed by answer paragraph(s)
  const qaRegex = /\*\*([^*]+\?)\*\*\s*\n\n([^\n*]+(?:\n(?!\*\*)[^\n*]+)*)/g;
  let match;

  while ((match = qaRegex.exec(faqContent)) !== null) {
    const question = match[1].trim();
    const answer = match[2].trim();

    if (question && answer) {
      faqItems.push({ question, answer });
    }
  }

  return faqItems;
}

export interface ReviewItem {
  itemName: string;
  ratingValue: number;
  bestRating: number;
  worstRating: number;
  reviewBody?: string;
}

/**
 * Parse table cells from a markdown table row
 */
function parseTableCells(row: string): string[] {
  return row.split('|').map(cell => cell.trim()).filter(Boolean);
}

/**
 * Find the table header row before a given position in markdown
 */
function findTableHeader(markdown: string, beforeIndex: number): string | null {
  const lines = markdown.substring(0, beforeIndex).split('\n');

  for (let i = lines.length - 1; i >= Math.max(0, lines.length - 10); i--) {
    const line = lines[i];
    if (line.includes('|') && !line.includes('---') && !line.includes('Overall Quality Score')) {
      return line;
    }
  }
  return null;
}

/**
 * Extract review items from markdown comparison tables
 * Looks for tables with "Overall Quality Score" rows containing X/10 ratings
 */
export function extractReviews(markdown: string): ReviewItem[] {
  const scoreMatch = markdown.match(/\|\s*Overall Quality Score\s*\|(.*?)\|/i);
  if (!scoreMatch) return [];

  const headerRow = findTableHeader(markdown, scoreMatch.index!);
  if (!headerRow) return [];

  const productNames = parseTableCells(headerRow).slice(1); // Skip metric column
  const ratings = parseTableCells(scoreMatch[1]);
  const ratingPattern = /([\d.]+)\/(\d+)/;

  return ratings.reduce<ReviewItem[]>((items, ratingText, index) => {
    const productName = productNames[index];
    const match = ratingText.match(ratingPattern);

    if (match && productName) {
      items.push({
        itemName: productName,
        ratingValue: parseFloat(match[1]),
        bestRating: parseInt(match[2]),
        worstRating: 1,
        reviewBody: extractProductMention(markdown, productName)
      });
    }
    return items;
  }, []);
}

/**
 * Extract a product mention as review body text
 */
function extractProductMention(markdown: string, productName: string): string {
  const pattern = new RegExp(`\\*\\*${productName}[^*]*\\*\\*[^.]*\\.`, 'i');
  const match = markdown.match(pattern);
  return match ? match[0].replace(/\*\*/g, '').trim() : '';
}