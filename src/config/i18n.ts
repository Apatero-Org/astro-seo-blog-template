/**
 * Internationalization (i18n) translations for UI text
 * Translations are loaded from public/data/i18n/translations.json
 */
import fs from 'fs';
import path from 'path';

export interface Translations {
  // Blog page
  relatedArticles: string;
  minRead: string;
  publishedOn: string;
  updatedOn: string;

  // Navigation
  backToBlog: string;
  backToAllBlogs: string;
  home: string;
  blog: string;

  // Sidebar
  featuredArticle: string;
  articleInfo: string;
  readingTime: string;
  category: string;
  published: string;
  aboutTheAuthor: string;
  categories: string;
  popularTags: string;

  // Common
  readMore: string;
  tags: string;
  author: string;
  share: string;

  // CTAs - ComfyUI Workflows
  comfyUIWorkflowsTitle: string;
  comfyUIWorkflowsDescription: string;
  comfyUIWorkflowsOpenSource: string;
  comfyUIWorkflowsFree: string;
  comfyUIWorkflowsMITLicense: string;
  comfyUIWorkflowsProductionReady: string;
  comfyUIWorkflowsButton: string;

  // CTAs - Apatero Alternative
  apateroAltTitle: string;
  apateroAltDescription: string;
  apateroAltZeroSetup: string;
  apateroAltSameQuality: string;
  apateroAltStartQuick: string;
  apateroAltButton: string;
  apateroAltNoCard: string;

  // CTAs - Course/Blog CTA
  courseTitle: string;
  courseDescription: string;
  courseSocialProof: string;
  courseButton: string;
  courseSecondary: string;
  courseEarlyBirdNote: string;
  courseStatsComplete: string;
  courseStatsOneTime: string;
  courseStatsLifetime: string;
  courseBeginnerFriendly: string;
  courseProductionReady: string;
  courseAlwaysUpdated: string;

  // Countdown timer
  priceIncreasesIn: string;
  days: string;
  hours: string;
  minutes: string;
  seconds: string;

  // CourseCTATopBanner
  courseTopBannerText: string;
  courseTopBannerSubtext: string;

  // CourseCTABottom
  courseBottomTitle: string;
  courseBottomPitch: string;
}

// Load translations from JSON file
// Note: Sync read is intentional for build-time configuration
const translationsPath = path.join(process.cwd(), 'public/data/i18n/translations.json');

let translations: Record<string, Translations>;
try {
  const data = fs.readFileSync(translationsPath, 'utf-8');
  translations = JSON.parse(data);
} catch (error) {
  // Fallback to English defaults if file doesn't exist
  translations = {
    en: {
      relatedArticles: 'Related Articles',
      minRead: 'min read',
      publishedOn: 'Published on',
      updatedOn: 'Updated on',
      backToBlog: 'Back to Blog',
      backToAllBlogs: 'Back to All Blogs',
      home: 'Home',
      blog: 'Blog',
      featuredArticle: 'Featured Article',
      articleInfo: 'Article Info',
      readingTime: 'Reading Time',
      category: 'Category',
      published: 'Published',
      aboutTheAuthor: 'About the Author',
      categories: 'Categories',
      popularTags: 'Popular Tags',
      readMore: 'Read More',
      tags: 'Tags',
      author: 'Author',
      share: 'Share',
      comfyUIWorkflowsTitle: 'Free ComfyUI Workflows',
      comfyUIWorkflowsDescription: 'Find free, open-source ComfyUI workflows for techniques in this article.',
      comfyUIWorkflowsOpenSource: 'Open source is strong.',
      comfyUIWorkflowsFree: '100% Free',
      comfyUIWorkflowsMITLicense: 'MIT License',
      comfyUIWorkflowsProductionReady: 'Production Ready',
      comfyUIWorkflowsButton: 'Star & Try Workflows',
      apateroAltTitle: 'Want to skip the complexity?',
      apateroAltDescription: 'gives you professional AI results instantly with no technical setup required.',
      apateroAltZeroSetup: 'Zero setup',
      apateroAltSameQuality: 'Same quality',
      apateroAltStartQuick: 'Start in 30 seconds',
      apateroAltButton: 'Try Apatero Free',
      apateroAltNoCard: 'No credit card required',
      courseTitle: 'Create Your First Mega-Realistic AI Influencer in 51 Lessons',
      courseDescription: 'Create ultra-realistic AI influencers with lifelike skin details, professional selfies, and complex scenes.',
      courseSocialProof: 'Join 115 other course members',
      courseButton: 'Claim Your Spot - $199',
      courseSecondary: 'Save $200 - Price Increases to $399 Forever',
      courseEarlyBirdNote: 'Early-bird discount for our first students.',
      courseStatsComplete: '51 Lessons • 2 Complete Courses',
      courseStatsOneTime: 'One-Time Payment',
      courseStatsLifetime: 'Lifetime Updates',
      courseBeginnerFriendly: 'Beginner friendly',
      courseProductionReady: 'Production ready',
      courseAlwaysUpdated: 'Always updated',
      priceIncreasesIn: 'Early-bird pricing ends in:',
      days: 'Days',
      hours: 'Hours',
      minutes: 'Minutes',
      seconds: 'Seconds',
      courseTopBannerText: 'Learning ComfyUI?',
      courseTopBannerSubtext: '51 lessons covering ComfyUI + AI influencer marketing.',
      courseBottomTitle: 'Ready to Create Your AI Influencer?',
      courseBottomPitch: 'Join 115 students mastering ComfyUI and AI influencer marketing.',
    }
  };
}

export { translations };

/**
 * Get translations for a specific language
 */
export function getTranslations(language: string): Translations {
  return translations[language] || translations['en'];
}

/**
 * Get a specific translation key for a language
 */
export function t(language: string, key: keyof Translations): string {
  const trans = getTranslations(language);
  return trans[key];
}
