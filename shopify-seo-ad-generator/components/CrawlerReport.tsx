
import React, { useState } from 'react';
import { SeoResult } from '../types';

interface CrawlerReportProps {
  result: SeoResult;
}

const CrawlerReport: React.FC<CrawlerReportProps> = ({ result }) => {
  const [filter, setFilter] = useState<'all' | 'errors' | 'duplicates'>('all');

  if (result.status !== 'completed') return null;
  
  if (!result.crawlerData) {
    return (
      <div className="p-8 bg-amber-50 border border-amber-200 rounded-2xl text-amber-700 font-bold">
        Technical audit completed but no crawl data was returned. Please try again.
      </div>
    );
  }

  // Strict numeric parsing to prevent Infinity/undefined/NaN
  const sanitize = (val: any) => {
    const num = Number(val);
    return isFinite(num) ? num : 0;
  };

  const summary = {
    totalCrawled: sanitize(result.crawlerData.summary?.totalCrawled),
    brokenLinks: sanitize(result.crawlerData.summary?.brokenLinks),
    redirects: sanitize(result.crawlerData.summary?.redirects),
    duplicateTitles: sanitize(result.crawlerData.summary?.duplicateTitles),
    healthScore: sanitize(result.crawlerData.summary?.healthScore),
  };

  const pages = result.crawlerData.pages || [];
  const xmlSitemap = result.crawlerData.xmlSitemap || '<!-- No sitemap data generated -->';
  const visualizations = result.crawlerData.visualizations || { statusDistribution: [] };

  const filteredPages = pages.filter(p => {
    if (!p) return false;
    if (filter === 'errors') return p.status >= 400;
    if (filter === 'duplicates') return p.isDuplicate;
    return true;
  });

  const getStatusColor = (status: number) => {
    if (status < 300) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (status < 400) return 'bg-amber-100 text-amber-700 border-amber-200';
    return 'bg-rose-100 text-rose-700 border-rose-200';
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Pages', val: summary.totalCrawled, icon: '📄' },
          { label: 'Broken Links', val: summary.brokenLinks, icon: '🚫', color: 'text-rose-600' },
          { label: 'Redirects', val: summary.redirects, icon: '↪️', color: 'text-amber-600' },
          { label: 'Duplicates', val: summary.duplicateTitles, icon: '👯', color: 'text-purple-600' },
          { label: 'Health Score', val: `${summary.healthScore}%`, icon: '🛡️', color: 'text-emerald-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
            <span className="text-2xl mb-2">{stat.icon}</span>
            <span className={`text-2xl font-black ${stat.color || 'text-slate-900'}`}>{stat.val}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Table Controls */}
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
          <div className="flex bg-slate-200 p-1 rounded-xl">
            {(['all', 'errors', 'duplicates'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all capitalize ${filter === f ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {f}
              </button>
            ))}
          </div>
          <button 
            onClick={() => {
              const blob = new Blob([xmlSitemap], { type: 'text/xml' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'sitemap.xml';
              a.click();
            }}
            className="text-xs font-bold text-blue-600 flex items-center gap-2 hover:bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 transition-all"
          >
            📥 Export XML Sitemap
          </button>
        </div>

        {/* Audit Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">URL</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4">Page Title</th>
                <th className="px-6 py-4">Robots</th>
                <th className="px-6 py-4">Hreflang</th>
                <th className="px-6 py-4 text-center">Duplicate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPages.length > 0 ? filteredPages.map((page, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-blue-600 truncate max-w-[200px]" title={page.url}>
                    {page.url}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-block min-w-[40px] px-2 py-1 rounded-lg text-[10px] font-black border ${getStatusColor(page.status)}`}>
                      {page.status || '???'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900 truncate max-w-[250px]" title={page.title}>{page.title || 'Untitled'}</div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[250px]">{page.metaDescription || 'No description found.'}</div>
                  </td>
                  <td className="px-6 py-4 text-[10px] font-mono text-slate-500">{page.robots || 'index, follow'}</td>
                  <td className="px-6 py-4 text-[10px] text-slate-500">{page.hreflang || 'None'}</td>
                  <td className="px-6 py-4 text-center">
                    {page.isDuplicate ? (
                      <span className="text-rose-500 text-lg" title="Duplicate Content Detected">⚠️</span>
                    ) : (
                      <span className="text-emerald-500 text-lg" title="Unique Content">✅</span>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-bold italic">
                    No pages match the current filter or crawl was empty.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visualizations & Sitemap Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 border-b border-slate-100 pb-3">Status Distribution</h4>
          <div className="space-y-4">
            {visualizations.statusDistribution && visualizations.statusDistribution.length > 0 ? visualizations.statusDistribution.map((dist, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-600">HTTP {dist.code}</span>
                  <span className="text-slate-400">{dist.count} pages</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${dist.code === '200' ? 'bg-emerald-500' : dist.code.toString().startsWith('3') ? 'bg-amber-500' : 'bg-rose-500'}`}
                    style={{ width: `${summary.totalCrawled > 0 ? (sanitize(dist.count) / summary.totalCrawled) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            )) : (
              <div className="text-xs text-slate-400 italic">No distribution data available.</div>
            )}
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm">
          <h4 className="text-sm font-black text-slate-100 uppercase tracking-widest mb-6 border-b border-slate-800 pb-3">XML Sitemap Architecture</h4>
          <pre className="text-[10px] font-mono text-emerald-400/80 overflow-auto max-h-[200px] scrollbar-hide">
            {xmlSitemap}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CrawlerReport;
