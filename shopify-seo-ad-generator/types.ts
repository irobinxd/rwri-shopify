
export type GenerationMode = 'meta-ads' | 'collection-pages' | 'website-crawler';

export interface PageAudit {
  url: string;
  status: number;
  title: string;
  metaDescription: string;
  h1: string;
  robots: string;
  hreflang: string;
  canonical: string;
  isDuplicate: boolean;
  wordCount: number;
}

export interface CrawlerData {
  summary: {
    totalCrawled: number;
    brokenLinks: number;
    redirects: number;
    duplicateTitles: number;
    healthScore: number;
  };
  pages: PageAudit[];
  xmlSitemap: string;
  visualizations: {
    statusDistribution: { code: string; count: number }[];
  };
}

export interface SeoResult {
  id: string;
  url: string;
  h1?: string;
  metaDescription?: string;
  primaryBenefit?: string;
  hook?: string;
  introText?: string;
  crawlerData?: CrawlerData;
  status: 'pending' | 'processing' | 'completed' | 'error';
  error?: string;
  mode: GenerationMode;
}

export interface GeneratedSeoData {
  h1?: string;
  metaDescription?: string;
  primaryBenefit?: string;
  hook?: string;
  introText?: string;
  crawlerData?: CrawlerData;
}
