import fs from 'fs';
import path from 'path';

// Read the config from public/data/settings/site-config.json
const configPath = path.join(process.cwd(), 'public/data/settings/site-config.json');
const configData = fs.readFileSync(configPath, 'utf-8');
const config = JSON.parse(configData);

export const SITE_CONFIG = config;
export type SiteConfig = typeof SITE_CONFIG;
export const GA_MEASUREMENT_ID = config.gaId || "";