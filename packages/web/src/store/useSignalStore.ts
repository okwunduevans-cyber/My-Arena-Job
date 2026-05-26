import { create } from 'zustand';

export interface Signal {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  entry: number;
  sl: number;
  tp: number;
  confidence: number;
  rationale: string;
  eduNote: string;
  timestamp: string;
}

interface SignalState {
  signals: Signal[];
  addSignal: (signal: Signal) => void;
  clearSignals: () => void;
}

export const useSignalStore = create<SignalState>((set) => ({
  signals: [],
  addSignal: (signal) => set((state) => ({ 
    signals: [signal, ...state.signals].slice(0, 50) 
  })),
  clearSignals: () => set({ signals: [] }),
}));
