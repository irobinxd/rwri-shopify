
import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedSeoData, GenerationMode } from "../types";

export const generateSeoForUrl = async (url: string, mode: GenerationMode): Promise<GeneratedSeoData> => {
  const modelName = mode === 'website-crawler' ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  let prompt = '';
  let responseSchema: any = {};

  if (mode === 'meta-ads') {
    prompt = `Analyze the Shopify URL: ${url}. Create optimized Meta Ads content: H1, Meta Description, Hook, and Primary Benefit. Use Google Search to find UVPs.`;
    responseSchema = {
      type: Type.OBJECT,
      properties: {
        h1: { type: Type.STRING },
        metaDescription: { type: Type.STRING },
        primaryBenefit: { type: Type.STRING },
        hook: { type: Type.STRING },
      },
      required: ["h1", "metaDescription", "primaryBenefit", "hook"],
    };
  } else if (mode === 'collection-pages') {
    prompt = `Analyze the Shopify Collection URL: ${url}. Generate a 2-3 sentence brand-bespoke SEO introductory text. DO NOT use placeholder names like "REV*". Identify the actual brand.`;
    responseSchema = {
      type: Type.OBJECT,
      properties: {
        introText: { type: Type.STRING },
      },
      required: ["introText"],
    };
  } else if (mode === 'website-crawler') {
    prompt = `
      ACT AS AN ELITE TECHNICAL SEO SPIDER. Your objective is a COMPREHENSIVE SCAN of the Shopify store: ${url}.
      The store has a large catalog (300+ products). You MUST attempt to discover and list ALL of them.
      
      VIRTUAL CRAWL INSTRUCTIONS (CRITICAL):
      1. PRIMARY SOURCE: Use the googleSearch tool to locate and read the content of "${url}/sitemap_products_1.xml". This is the most reliable source for the 300+ product links.
      2. SECONDARY SOURCES: 
         - Search "${url}/sitemap_collections_1.xml" for category pages.
         - Search for "site:${url}/products/" and "site:${url}/collections/" to verify Google's indexing.
         - Use the googleSearch tool to look for "Shopify product sitemap ${url}" if the direct path is hidden.
      
      3. TARGET QUANTITY: 
         - Aim to discover 300+ REAL unique internal URLs.
         - For each URL, report the REAL Page Title, H1, and Meta Description.
         - Do not truncate the list prematurely; the user needs the full inventory audit.

      4. TECHNICAL AUDIT REQUIREMENTS:
         - STATUS CODES: Assume 200 for current sitemap entries. Look for 404s by searching for "out of stock" or "discontinued" items that are missing.
         - DUPLICATE DETECTION: Explicitly flag items with identical SEO Titles.
         - REDIRECTS: Check for domain-level or path-level 301/302 redirects.

      5. OUTPUT:
         - Return a comprehensive 'pages' array. 
         - The 'summary' object MUST match the exact totals in the 'pages' array.

      STRICT RULE: Every entry MUST be a real product link from ${url}. Do not generate fake handles.
    `;
    
    responseSchema = {
      type: Type.OBJECT,
      properties: {
        crawlerData: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.OBJECT,
              properties: {
                totalCrawled: { type: Type.INTEGER },
                brokenLinks: { type: Type.INTEGER },
                redirects: { type: Type.INTEGER },
                duplicateTitles: { type: Type.INTEGER },
                healthScore: { type: Type.INTEGER },
              },
              required: ["totalCrawled", "brokenLinks", "redirects", "duplicateTitles", "healthScore"]
            },
            pages: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  url: { type: Type.STRING },
                  status: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  metaDescription: { type: Type.STRING },
                  h1: { type: Type.STRING },
                  robots: { type: Type.STRING },
                  hreflang: { type: Type.STRING },
                  canonical: { type: Type.STRING },
                  isDuplicate: { type: Type.BOOLEAN },
                  wordCount: { type: Type.INTEGER }
                },
                required: ["url", "status", "title", "isDuplicate"]
              }
            },
            xmlSitemap: { type: Type.STRING },
            visualizations: {
              type: Type.OBJECT,
              properties: {
                statusDistribution: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      code: { type: Type.STRING },
                      count: { type: Type.INTEGER }
                    }
                  }
                }
              },
              required: ["statusDistribution"]
            }
          },
          required: ["summary", "pages", "xmlSitemap", "visualizations"]
        }
      },
      required: ["crawlerData"]
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const text = response.text.trim();
    const parsedData = JSON.parse(text);

    // Deep Post-Processing for Data Integrity
    if (mode === 'website-crawler' && parsedData.crawlerData?.pages) {
      const urlObj = new URL(url);
      const origin = urlObj.origin;
      const domain = urlObj.hostname.replace('www.', '');
      
      let pages = parsedData.crawlerData.pages;

      // 1. URL Normalization
      pages = pages.map((p: any) => {
        let finalUrl = p.url;
        if (finalUrl.startsWith('/')) {
          finalUrl = `${origin}${finalUrl}`;
        } else if (!finalUrl.startsWith('http')) {
          finalUrl = `${origin}/${finalUrl}`;
        }
        p.url = finalUrl.replace(/\/$/, "").replace(/([^:]\/)\/+/g, "$1");
        p.status = Number(p.status) || 200;
        return p;
      });

      // 2. Filter out external noise
      pages = pages.filter((p: any) => p.url.includes(domain));

      // 3. Duplicate Detection Logic
      const titleTracker = new Map<string, number>();
      pages.forEach((p: any, index: number) => {
        const cleanTitle = (p.title || '').trim().toLowerCase();
        if (p.status === 200 && cleanTitle && cleanTitle !== 'untitled') {
          if (titleTracker.has(cleanTitle)) {
            p.isDuplicate = true;
            const originalIdx = titleTracker.get(cleanTitle)!;
            pages[originalIdx].isDuplicate = true;
          } else {
            titleTracker.set(cleanTitle, index);
          }
        }
      });

      parsedData.crawlerData.pages = pages;
      
      // 4. Recalculate Summary to match the array size
      const pCount = pages.length;
      const bCount = pages.filter((x: any) => x.status >= 400).length;
      const rCount = pages.filter((x: any) => x.status >= 300 && x.status < 400).length;
      const dCount = pages.filter((x: any) => x.isDuplicate).length;

      parsedData.crawlerData.summary = {
        totalCrawled: pCount,
        brokenLinks: bCount,
        redirects: rCount,
        duplicateTitles: dCount,
        healthScore: Math.round(((pCount - bCount) / (pCount || 1)) * 100)
      };

      // 5. Accurate Status Distribution
      const dist: Record<string, number> = {};
      pages.forEach((x: any) => {
        const code = x.status.toString();
        dist[code] = (dist[code] || 0) + 1;
      });
      parsedData.crawlerData.visualizations.statusDistribution = Object.keys(dist).map(code => ({
        code,
        count: dist[code]
      }));
    }

    return parsedData as GeneratedSeoData;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Site crawling failed. The AI engine could not retrieve the full product catalog.");
  }
};
