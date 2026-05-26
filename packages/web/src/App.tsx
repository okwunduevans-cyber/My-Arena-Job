import React, { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useSignalStore } from './store/useSignalStore';
import { SignalCard } from './components/SignalCard';
import { LayoutDashboard, BookOpen, Bell, User, TrendingUp } from 'lucide-react';

const App: React.FC = () => {
  const { signals, addSignal } = useSignalStore();

  useEffect(() => {
    // Connect to the backend we built in Phase 1
    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000');

    socket.on('new_signal', (signal) => {
      addSignal({
        ...signal,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    });

    return () => { socket.disconnect(); };
  }, [addSignal]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">DF</div>
          <h1 className="text-xl font-bold tracking-tight text-slate-100">DEEP<span className="text-blue-500">FX</span></h1>
        </div>
        <div className="flex gap-4">
          <Bell size={22} className="text-slate-400 hover:text-blue-400 cursor-pointer transition-colors" />
          <User size={22} className="text-slate-400 hover:text-blue-400 cursor-pointer transition-colors" />
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-8 pb-24">
        {/* Welcome Section */}
        <section className="mb-8">
          <h2 className="text-3xl font-bold text-slate-100 mb-2">Market Intelligence</h2>
          <p className="text-slate-400 text-sm">Real-time AI analysis and institutional-grade signals.</p>
        </section>

        {/* Signal Feed */}
        <div className="space-y-4">
          {signals.length === 0 ? (
            <div className="text-center py-20">
              <div className="bg-slate-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-600">
                <TrendingUp size={32} />
              </div>
              <p className="text-slate-500 text-sm">Waiting for AI to detect high-probability setups...</p>
            </div>
          ) : (
            signals.map((s) => <SignalCard key={s.id} signal={s} />)
          )}
        </div>
      </main>

      {/* Bottom Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-lg border-t border-slate-800 px-6 py-3 flex justify-around items-center">
        <div className="flex flex-col items-center gap-1 text-blue-500">
          <LayoutDashboard size={24} />
          <span className="text-[10px] font-medium uppercase">Feed</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-slate-500 hover:text-blue-400 cursor-pointer transition-colors">
          <BookOpen size={24} />
          <span className="text-[10px] font-medium uppercase">Academy</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-slate-500 hover:text-blue-400 cursor-pointer transition-colors">
          <TrendingUp size={24} />
          <span className="text-[10px] font-medium uppercase">Analysis</span>
        </div>
      </nav>
    </div>
  );
};

export default App;
