import type { APIRoute } from 'astro';
import fs from 'fs/promises';
import path from 'path';
import { isValidSession } from '../../lib/session';

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
    const settings = await request.json();
    
    // Update site-config.json
    const configPath = path.join(process.cwd(), 'public/data/settings/site-config.json');
    
    // Read current config
    const currentConfig = JSON.parse(await fs.readFile(configPath, 'utf-8'));
    
    // Update config with new settings
    const updatedConfig = {
      ...currentConfig,
      title: settings.siteName || currentConfig.title,
      description: settings.siteDescription || currentConfig.description,
      url: settings.siteUrl || currentConfig.url,
      gaId: settings.gaId || currentConfig.gaId || '',
      social: {
        twitter: settings.socialTwitter ? (settings.socialTwitter.startsWith('@') ? settings.socialTwitter : '@' + settings.socialTwitter) : currentConfig.social?.twitter || '',
        github: settings.socialGithub || currentConfig.social?.github || '',
        linkedin: settings.socialLinkedin || currentConfig.social?.linkedin || '',
        instagram: settings.socialInstagram ? (settings.socialInstagram.startsWith('@') ? settings.socialInstagram : '@' + settings.socialInstagram) : currentConfig.social?.instagram || '',
        youtube: settings.socialYoutube || currentConfig.social?.youtube || '',
        discord: settings.socialDiscord || currentConfig.social?.discord || ''
      },
      blogCTA: {
        enabled: settings.ctaEnabled || false,
        title: settings.ctaTitle || 'Join Our Waitlist - Be One of the First Apatero Creators',
        description: settings.ctaDescription || "Get exclusive early access to Apatero's revolutionary AI creation platform. Join the select group of pioneering creators shaping the future of AI-powered content.",
        buttonText: settings.ctaButtonText || 'Join Waitlist',
        buttonUrl: settings.ctaButtonUrl || '/',
        secondaryText: settings.ctaSecondaryText || 'Limited Early Access',
        showStats: settings.ctaShowStats || false,
        stats: [
          {
            number: settings.ctaStat1Number || '1,000+',
            label: settings.ctaStat1Label || 'Waitlist Members'
          },
          {
            number: settings.ctaStat2Number || 'First 500',
            label: settings.ctaStat2Label || 'Get Priority'
          },
          {
            number: settings.ctaStat3Number || 'Early 2025',
            label: settings.ctaStat3Label || 'Launch Date'
          }
        ]
      }
    };
    
    // Save updated config
    await fs.writeFile(configPath, JSON.stringify(updatedConfig, null, 2));
    
    // Update SEO settings JSON
    const seoSettingsPath = path.join(process.cwd(), 'public/data/settings/seo-settings.json');
    const seoSettings = {
      sitemap: {
        enabled: settings.sitemapEnabled,
        priority: settings.sitemapPriority,
        changefreq: settings.sitemapChangefreq
      },
      schema: {
        enabled: true,
        organization: settings.siteName
      },
      meta: {
        keywords: settings.metaKeywords || ''
      }
    };
    
    await fs.writeFile(seoSettingsPath, JSON.stringify(seoSettings, null, 2));
    
    // Also update the src/data/site-config.ts to trigger rebuild
    const srcConfigPath = path.join(process.cwd(), 'src/data/site-config.ts');
    const srcConfigContent = `import fs from 'fs';
import path from 'path';

// Read the config from public/data/settings/site-config.json
const configPath = path.join(process.cwd(), 'public/data/settings/site-config.json');
const configData = fs.readFileSync(configPath, 'utf-8');
const config = JSON.parse(configData);

export const SITE_CONFIG = config;
export type SiteConfig = typeof SITE_CONFIG;
export const GA_MEASUREMENT_ID = config.gaId || "";`;
    
    await fs.writeFile(srcConfigPath, srcConfigContent);
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return new Response(JSON.stringify({ error: 'Failed to update settings' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};