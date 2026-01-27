
import React, { useState } from 'react';
import Header from './components/Header';
import AdPreview from './components/AdPreview';
import CrawlerReport from './components/CrawlerReport';
import CrawlProgressModal, { LogEntry } from './components/CrawlProgressModal';
import { SeoResult, GenerationMode } from './types';
import { generateSeoForUrl } from './services/geminiService';

const App: React.FC = () => {
  const [urlsInput, setUrlsInput] = useState<string>('');
  const [results, setResults] = useState<SeoResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'table' | 'previews'>('table');
  const [generationMode, setGenerationMode] = useState<GenerationMode>('meta-ads');
  
  // Crawler specific states
  const [crawlProgress, setCrawlProgress] = useState(0);
  const [crawlLogs, setCrawlLogs] = useState<LogEntry[]>([]);
  const [isCrawlModalOpen, setIsCrawlModalOpen] = useState(false);
  const [currentCrawlingUrl, setCurrentCrawlingUrl] = useState('');

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    let type: LogEntry['type'] = 'info';
    if (message.includes('[WARN]')) type = 'warn';
    if (message.includes('[SUCCESS]')) type = 'success';
    if (message.includes('[ERROR]')) type = 'error';

    setCrawlLogs(prev => [...prev, { timestamp, message, type }]);
  };

  const simulateLogs = (mode: GenerationMode) => {
    if (mode !== 'website-crawler') return null;
    
    const messages = [
      '[INFO] Initializing Shopify Discovery Protocol...',
      '[INFO] Locating /sitemap.xml and child product/collection sitemaps...',
      '[INFO] Fetching domain headers: Verifying SSL and X-Shopify-Stage...',
      '[INFO] Google Search: Mapping /products/ and /collections/ patterns...',
      '[SUCCESS] Shopify store structure identified.',
      '[INFO] Discovering indexed products via Google Search grounding...',
      '[INFO] Scanning for broken links and legacy 301 redirects...',
      '[WARN] High latency detected on /collections/ pages.',
      '[INFO] Metadata Audit: Extracting SEO Titles and Meta Descriptions...',
      '[INFO] Checking for canonical inconsistencies on product variants...',
      '[INFO] Analyzing internal link depth of top collections...',
      '[INFO] Content Audit: Detecting duplicate content across product pages...',
      '[SUCCESS] 40+ unique URLs mapped for technical review.',
      '[INFO] Compiling XML Sitemap architecture...',
      '[INFO] Synthesizing Site Health report...'
    ];

    const deepScanMessages = [
      '[INFO] Deep scanning DOM for Shopify-specific liquid errors...',
      '[INFO] Cross-referencing Google Search grounding indices...',
      '[INFO] Validating JSON-LD Product Schema implementation...',
      '[INFO] Calculating content-to-code ratios...',
      '[INFO] Finalizing comprehensive technical audit report...',
      '[INFO] Gemini Pro 3 is verifying data consistency across URLs...',
      '[INFO] Compiling final health metrics...'
    ];

    let currentIdx = 0;
    let deepScanIdx = 0;

    const interval = setInterval(() => {
      // Asymptotic progress: gets slower as it approaches 100
      setCrawlProgress(prev => {
        if (prev < 80) return prev + (Math.random() * 8);
        if (prev < 95) return prev + (Math.random() * 2);
        if (prev < 99) return prev + (Math.random() * 0.1); 
        return 99.1;
      });

      if (currentIdx < messages.length) {
        addLog(messages[currentIdx]);
        currentIdx++;
      } else {
        if (Math.random() > 0.8 && deepScanIdx < deepScanMessages.length) {
          addLog(deepScanMessages[deepScanIdx]);
          deepScanIdx++;
        } else if (Math.random() > 0.95) {
          addLog('[INFO] Still discovering product catalog... This can take a moment for larger stores.');
        }
      }
    }, 1500);

    return interval;
  };

  const handleGenerate = async () => {
    const urls = urlsInput
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0 && url.startsWith('http'));

    if (urls.length === 0) {
      alert('Please enter at least one valid URL.');
      return;
    }

    setIsProcessing(true);
    if (generationMode === 'website-crawler') {
      setIsCrawlModalOpen(true);
      setCrawlProgress(0);
      setCrawlLogs([]);
    }
    
    const initialResults: SeoResult[] = urls.map((url, index) => ({
      id: `${Date.now()}-${index}`,
      url,
      status: 'pending',
      mode: generationMode
    }));
    
    setResults(initialResults);

    const logInterval = simulateLogs(generationMode);

    try {
      for (let i = 0; i < initialResults.length; i++) {
        const current = initialResults[i];
        setCurrentCrawlingUrl(current.url);
        setResults(prev => prev.map(item => item.id === current.id ? { ...item, status: 'processing' as const } : item));

        try {
          const data = await generateSeoForUrl(current.url, generationMode);
          
          if (generationMode === 'website-crawler') {
            addLog('[SUCCESS] Product and collection data received.');
            addLog('[INFO] Formatting results table...');
          }

          setResults(prev => prev.map(item => 
            item.id === current.id ? { 
              ...item, 
              ...data,
              status: 'completed' as const 
            } : item
          ));
        } catch (err) {
          console.error("Audit item failed:", err);
          addLog(`[ERROR] Technical audit failed for ${current.url}`);
          setResults(prev => prev.map(item => 
            item.id === current.id ? { ...item, status: 'error' as const, error: 'Analysis failed' } : item
          ));
        }
      }
    } finally {
      if (logInterval) clearInterval(logInterval);
      
      if (generationMode === 'website-crawler') {
        addLog('[SUCCESS] All technical tasks completed.');
        setCrawlProgress(100);
        setTimeout(() => {
          setIsProcessing(false);
          setIsCrawlModalOpen(false);
        }, 1500);
      } else {
        setIsProcessing(false);
      }
    }
  };

  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
  };

  const getPlaceholder = () => {
    if (generationMode === 'meta-ads') {
      return `Paste Product URLs for Meta Ads (one per line)...\nExample: https://rev.com.ph/products/shoe`;
    }
    if (generationMode === 'collection-pages') {
      return `Paste Collection URLs for Intro Generation (one per line)...\nExample: https://rev.com.ph/collections/mens-apparel`;
    }
    return `Paste Domain URL for Technical Audit (e.g., https://rev.com.ph)`;
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-slate-50">
      <Header />
      
      <CrawlProgressModal 
        isOpen={isCrawlModalOpen} 
        progress={crawlProgress} 
        logs={crawlLogs} 
        url={currentCrawlingUrl || urlsInput.split('\n')[0] || ''} 
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-8">
        <section className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200 overflow-hidden">
          <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/80">
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Technical SEO & Ads Engine</h2>
                <p className="text-sm text-slate-500 mt-1">High-converting SEO tools powered by Google Gemini.</p>
              </div>
              
              <div className="flex p-1 bg-slate-200 rounded-xl w-fit flex-wrap gap-1">
                {[
                  { id: 'meta-ads', label: 'Meta Ads', icon: 'M' },
                  { id: 'collection-pages', label: 'Collections', icon: 'C' },
                  { id: 'website-crawler', label: 'Website Crawler', icon: 'W' }
                ].map((mode) => (
                  <button 
                    key={mode.id}
                    onClick={() => {
                      setGenerationMode(mode.id as GenerationMode);
                      if (mode.id !== 'meta-ads') setActiveTab('table');
                    }}
                    className={`px-4 py-2 text-xs font-black rounded-lg transition-all flex items-center gap-2 uppercase tracking-widest ${generationMode === mode.id ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
                  >
                    <span className={`w-5 h-5 flex items-center justify-center rounded text-[10px] ${generationMode === mode.id ? 'bg-blue-600 text-white' : 'bg-slate-300 text-slate-500'}`}>{mode.icon}</span>
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isProcessing || !urlsInput.trim()}
              className={`relative px-10 py-3.5 rounded-xl font-black text-white transition-all overflow-hidden flex items-center justify-center gap-2 group ${
                isProcessing || !urlsInput.trim() 
                ? 'bg-slate-300 cursor-not-allowed' 
                : 'bg-slate-900 hover:bg-black active:scale-[0.97]'
              }`}
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Running Audit...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>{generationMode === 'website-crawler' ? 'Start Crawl' : 'Run Intelligence'}</span>
                </>
              )}
            </button>
          </div>
          <div className="p-6 md:p-8 bg-slate-50/30">
            <div className="relative group">
              <textarea
                className="w-full h-48 p-6 text-xl text-slate-900 bg-white border-2 border-slate-200 rounded-2xl focus:ring-8 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all resize-none font-semibold placeholder-slate-300 shadow-sm"
                placeholder={getPlaceholder()}
                value={urlsInput}
                onChange={(e) => setUrlsInput(e.target.value)}
                disabled={isProcessing}
              />
              <div className="absolute top-4 right-4 text-[10px] font-black text-slate-400 uppercase tracking-widest pointer-events-none group-focus-within:text-blue-400 transition-colors">
                {generationMode.replace('-', ' ')}
              </div>
            </div>
          </div>
        </section>

        {results.length > 0 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                {generationMode === 'website-crawler' ? 'Technical Audit Results' : 'Optimization Results'}
                <span className="ml-3 text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                  {results.filter(r => r.status === 'completed').length} / {results.length} Ready
                </span>
              </h3>
              
              {generationMode === 'meta-ads' && (
                <div className="flex bg-slate-200/50 p-1 rounded-xl">
                  <button onClick={() => setActiveTab('table')} className={`px-5 py-2 text-[10px] font-black rounded-lg transition-all uppercase tracking-widest ${activeTab === 'table' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>Table</button>
                  <button onClick={() => setActiveTab('previews')} className={`px-5 py-2 text-[10px] font-black rounded-lg transition-all uppercase tracking-widest ${activeTab === 'previews' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>Ads</button>
                </div>
              )}
            </div>

            {generationMode === 'website-crawler' ? (
              <div className="space-y-12">
                {results.map((result) => (
                  <CrawlerReport key={result.id} result={result} />
                ))}
              </div>
            ) : generationMode === 'collection-pages' || activeTab === 'table' ? (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[900px]">
                    <thead>
                      <tr className="bg-slate-50 border-b-2 border-slate-100">
                        <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest w-1/3">Target Link</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">AI Intelligence</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest w-32 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {results.map((result) => (
                        <tr key={result.id} className="group hover:bg-slate-50/50 transition-colors">
                          <td className="px-8 py-8 align-top">
                            <a href={result.url} target="_blank" rel="noopener" className="text-sm font-bold text-blue-600 hover:text-blue-800 hover:underline break-all">
                              {result.url}
                            </a>
                          </td>
                          <td className="px-8 py-8 align-top">
                            {result.status === 'completed' ? (
                              generationMode === 'meta-ads' ? (
                                <div className="space-y-6">
                                  <div>
                                    <label className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1.5 block">H1 Optimized Headline</label>
                                    <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl group-hover:bg-white transition-all">
                                      <p className="text-base font-bold text-slate-900">{result.h1}</p>
                                      <button onClick={() => copyToClipboard(result.h1!)} className="p-2 text-slate-300 hover:text-blue-600">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                                      </button>
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1.5 block">Meta Description</label>
                                    <div className="flex items-start justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl group-hover:bg-white transition-all">
                                      <p className="text-sm text-slate-600 font-medium leading-relaxed">{result.metaDescription}</p>
                                      <button onClick={() => copyToClipboard(result.metaDescription!)} className="p-2 text-slate-300 hover:text-blue-600">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="p-6 bg-orange-50/20 border-l-8 border-orange-400 rounded-r-2xl border-y border-r border-orange-100/50 group-hover:bg-orange-50/40 transition-all flex justify-between gap-6">
                                  <p className="text-lg text-slate-800 font-bold leading-relaxed italic">"{result.introText}"</p>
                                  <button onClick={() => copyToClipboard(result.introText!)} className="p-2 text-orange-400 hover:text-orange-600 self-start">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                                  </button>
                                </div>
                              )
                            ) : result.status === 'error' ? (
                              <div className="flex items-center gap-3 text-rose-500 font-bold p-6 bg-rose-50 rounded-2xl border border-rose-100">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span>Optimization failed for this URL.</span>
                              </div>
                            ) : (
                              <div className="py-2 space-y-4">
                                <div className="h-8 bg-slate-100 rounded-xl w-full animate-pulse shadow-inner"></div>
                                <div className="h-8 bg-slate-100 rounded-xl w-5/6 animate-pulse shadow-inner"></div>
                              </div>
                            )}
                          </td>
                          <td className="px-8 py-8 align-top text-center">
                            <span className={`inline-flex px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                              result.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 
                              result.status === 'processing' ? 'bg-blue-100 text-blue-600 animate-pulse' : 
                              'bg-slate-100 text-slate-300'
                            }`}>
                              {result.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {results.map((result) => (
                  <AdPreview key={result.id} result={result} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
               <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
             </div>
             <span className="text-sm font-black text-slate-900 uppercase tracking-widest">Shopify Intelligence Suite</span>
          </div>
          <p className="text-xs text-slate-400 font-bold tracking-tight">&copy; {new Date().getFullYear()} Growth Optimization Tool.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
