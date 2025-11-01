// Function to normalize tag names for URLs
export function normalizeTagName(tagName: string): string {
  return tagName
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters except hyphens and spaces
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
}