import fs from 'fs';
import path from 'path';

// Read the config from public/data/settings/site-config.json
// Note: Sync read is intentional for build-time configuration
const configPath = path.join(process.cwd(), 'public/data/settings/site-config.json');

let config: Record<string, unknown>;
try {
  const configData = fs.readFileSync(configPath, 'utf-8');
  config = JSON.parse(configData);
} catch (error) {
  // Fallback config if file doesn't exist or is invalid
  config = {
    title: 'Astro SEO Blog',
    description: 'A blog template built with Astro',
    url: 'https://example.com',
    gaId: ''
  };
}

export const SITE_CONFIG = config;
export type SiteConfig = typeof SITE_CONFIG;
export const GA_MEASUREMENT_ID = (config.gaId as string) || "";