
import React, { useEffect, useRef } from 'react';

export interface LogEntry {
  timestamp: string;
  message: string;
  type: 'info' | 'warn' | 'success' | 'error';
}

interface CrawlProgressModalProps {
  isOpen: boolean;
  progress: number;
  logs: LogEntry[];
  url: string;
}

const CrawlProgressModal: React.FC<CrawlProgressModalProps> = ({ isOpen, progress, logs, url }) => {
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-slate-950 w-full max-w-2xl rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-white flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
              </span>
              Technical Site Crawl
            </h3>
            <p className="text-xs text-slate-500 font-mono mt-1 truncate max-w-md">{url}</p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-black text-blue-500 font-mono">{Math.floor(progress)}%</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 w-full bg-slate-800">
          <div 
            className="h-full bg-blue-500 transition-all duration-700 ease-out shadow-[0_0_15px_rgba(59,130,246,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Logs Console */}
        <div className="flex-1 p-6 overflow-y-auto font-mono text-[11px] space-y-2 bg-black/40 scrollbar-hide">
          {logs && logs.map((log, i) => (
            <div key={i} className="flex gap-3 leading-relaxed animate-in slide-in-from-left-2 duration-300">
              <span className="text-slate-600 shrink-0">[{log.timestamp}]</span>
              <span className={`
                ${log.type === 'warn' ? 'text-amber-400 font-bold' : ''}
                ${log.type === 'info' ? 'text-blue-400' : ''}
                ${log.type === 'success' ? 'text-emerald-400 font-bold' : ''}
                ${log.type === 'error' ? 'text-rose-400 font-bold' : ''}
              `}>
                {log.message}
              </span>
            </div>
          ))}
          <div ref={logEndRef} />
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-900/30 border-t border-slate-800 text-[10px] text-slate-500 uppercase tracking-widest font-black text-center">
          ENGINE STATUS: {progress < 100 ? 'ANALYZING DOM STRUCTURE' : 'REPORT GENERATED'}
        </div>
      </div>
    </div>
  );
};

export default CrawlProgressModal;
