import React from 'react';
import { Signal } from '../store/useSignalStore';
import { TrendingUp, TrendingDown, BookOpen, Info } from 'lucide-react';

export const SignalCard: React.FC<{ signal: Signal }> = ({ signal }) => {
  const isBuy = signal.type === 'BUY';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-4 shadow-xl transition-all hover:border-blue-500/50">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <span className={`p-2 rounded-lg ${isBuy ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-400'}`}>
            {isBuy ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
          </span>
          <h3 className="text-lg font-bold text-slate-100">{signal.symbol} <span className="text-xs font-normal text-slate-400 ml-2">{signal.timestamp}</span></h3>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-500 block">Confidence</span>
          <span className="text-sm font-mono font-bold text-blue-400">{signal.confidence}%</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-slate-800/50 p-2 rounded-lg text-center">
          <span className="text-[10px] text-slate-500 block uppercase">Entry</span>
          <span className="text-sm font-mono text-slate-200">{signal.entry}</span>
        </div>
        <div className="bg-slate-800/50 p-2 rounded-lg text-center">
          <span className="text-[10px] text-red-500 block uppercase">Stop Loss</span>
          <span className="text-sm font-mono text-slate-200">{signal.sl}</span>
        </div>
        <div className="bg-slate-800/50 p-2 rounded-lg text-center">
          <span className="text-[10px] text-green-500 block uppercase">Take Profit</span>
          <span className="text-sm font-mono text-slate-200">{signal.tp}</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex gap-2 text-slate-300 text-sm bg-slate-800/30 p-3 rounded-xl">
          <Info size={16} className="shrink-0 text-blue-400" />
          <p className="italic">{signal.rationale}</p>
        </div>
        <div className="flex gap-2 text-slate-400 text-xs bg-blue-500/5 p-3 rounded-xl border border-blue-500/10">
          <BookOpen size={16} className="shrink-0 text-blue-400" />
          <p>{signal.eduNote}</p>
        </div>
      </div>
    </div>
  );
};
