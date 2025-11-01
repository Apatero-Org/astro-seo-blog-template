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

export function extractReviews(markdown: string): ReviewItem[] {
  const reviewItems: ReviewItem[] = [];

  // Look for comparison tables with "Overall Quality Score" rows
  // Pattern: | Overall Quality Score | 8.2/10 | 9.1/10 | 8.0/10 | ...
  const overallScoreRegex = /\|\s*Overall Quality Score\s*\|(.*?)\|/i;
  const match = markdown.match(overallScoreRegex);

  if (!match) {
    return reviewItems;
  }

  // Extract the row content with ratings
  const ratingsRow = match[1];

  // Find the table header to get product names
  // Look backwards from the Overall Quality Score row to find the header
  const textBeforeRatings = markdown.substring(0, match.index!);
  const tableLines = textBeforeRatings.split('\n');

  // Find the header row (should be a few lines before)
  let headerRow = '';
  for (let i = tableLines.length - 1; i >= Math.max(0, tableLines.length - 10); i--) {
    const line = tableLines[i];
    // Header row typically has | Metric | Product1 | Product2 | Product3 | ...
    if (line.includes('|') && !line.includes('---') && !line.includes('Overall Quality Score')) {
      headerRow = line;
      break;
    }
  }

  if (!headerRow) {
    return reviewItems;
  }

  // Extract product names from header (skip first column which is "Metric" or similar)
  const headerParts = headerRow.split('|').map(part => part.trim()).filter(part => part);
  const productNames = headerParts.slice(1); // Skip first column

  // Extract ratings from the ratings row
  const ratingParts = ratingsRow.split('|').map(part => part.trim()).filter(part => part);

  // Match ratings with product names
  for (let i = 0; i < Math.min(productNames.length, ratingParts.length); i++) {
    const ratingText = ratingParts[i];
    const productName = productNames[i];

    // Skip non-rating columns (like "Test Method" or "Notes")
    // Extract rating in format X/10 or X.X/10
    const ratingMatch = ratingText.match(/([\d.]+)\/(\d+)/);

    if (ratingMatch && productName) {
      const ratingValue = parseFloat(ratingMatch[1]);
      const bestRating = parseInt(ratingMatch[2]);

      // Look for review body text mentioning this product
      let reviewBody = '';
      const productMentionRegex = new RegExp(`\\*\\*${productName}[^*]*\\*\\*[^.]*\\.`, 'i');
      const bodyMatch = markdown.match(productMentionRegex);
      if (bodyMatch) {
        reviewBody = bodyMatch[0].replace(/\*\*/g, '').trim();
      }

      reviewItems.push({
        itemName: productName,
        ratingValue,
        bestRating,
        worstRating: 1,
        reviewBody
      });
    }
  }

  return reviewItems;
}