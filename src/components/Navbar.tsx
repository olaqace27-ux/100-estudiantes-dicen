import React from 'react';
import { ViewMode } from '../types';
import {
  Trophy,
  Tv,
  Sliders,
  Columns,
  Zap,
  HelpCircle,
  Volume2,
  VolumeX,
  Keyboard,
  RotateCcw,
} from 'lucide-react';

interface NavbarProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  onShowShortcuts: () => void;
  onResetGame: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  viewMode,
  setViewMode,
  soundEnabled,
  setSoundEnabled,
  onShowShortcuts,
  onResetGame,
}) => {
  // Fullscreen toggle helper
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  return (
    <header className="bg-gradient-to-b from-[#1e40af] to-[#1e3a8a] border-b-4 border-yellow-500 text-white px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-40 shadow-2xl">
      {/* Brand Title */}
      <div className="flex items-center gap-3">
        <div className="bg-yellow-500 text-blue-950 font-black text-xl px-3 py-1 rounded shadow-md border-2 border-yellow-300 transform -rotate-2 flex items-center gap-1">
          <span className="tracking-tighter">100</span>
          <Trophy className="w-4 h-4 text-blue-950" />
        </div>
        <div>
          <h1 className="font-black text-lg sm:text-xl tracking-wider text-white uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] italic">
            FAMILY FEUD TV
          </h1>
          <p className="text-[10px] text-yellow-300 font-bold uppercase tracking-wider">
            Game Show Edition • Board & Host Controls
          </p>
        </div>
      </div>

      {/* View Mode Switcher Tabs */}
      <nav className="flex items-center bg-blue-950 p-1 rounded-lg border-2 border-blue-600 shadow-inner">
        <button
          id="btn-view-game"
          onClick={() => setViewMode('game')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-black uppercase tracking-wider transition-all ${
            viewMode === 'game'
              ? 'bg-yellow-500 text-blue-950 shadow border border-yellow-300'
              : 'text-blue-200 hover:text-white hover:bg-blue-900/60'
          }`}
          title="Giant screen board mode for projection"
        >
          <Tv className="w-4 h-4" /> TV Board
        </button>

        <button
          id="btn-view-control"
          onClick={() => setViewMode('control')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-black uppercase tracking-wider transition-all ${
            viewMode === 'control'
              ? 'bg-yellow-500 text-blue-950 shadow border border-yellow-300'
              : 'text-blue-200 hover:text-white hover:bg-blue-900/60'
          }`}
          title="Exclusive host control panel"
        >
          <Sliders className="w-4 h-4" /> Host Panel
        </button>

        <button
          id="btn-view-split"
          onClick={() => setViewMode('split')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-black uppercase tracking-wider transition-all ${
            viewMode === 'split'
              ? 'bg-yellow-500 text-blue-950 shadow border border-yellow-300'
              : 'text-blue-200 hover:text-white hover:bg-blue-900/60'
          }`}
          title="View board and controls simultaneously"
        >
          <Columns className="w-4 h-4" /> Split View
        </button>

        <button
          id="btn-view-fast-money"
          onClick={() => setViewMode('fast_money')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-black uppercase tracking-wider transition-all ${
            viewMode === 'fast_money'
              ? 'bg-red-600 text-white shadow border border-red-400 animate-pulse'
              : 'text-yellow-400 hover:text-white hover:bg-blue-900/60'
          }`}
          title="Fast Money final round"
        >
          <Zap className="w-4 h-4" /> Fast Money
        </button>

        <button
          id="btn-view-questions"
          onClick={() => setViewMode('questions')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-black uppercase tracking-wider transition-all ${
            viewMode === 'questions'
              ? 'bg-yellow-500 text-blue-950 shadow border border-yellow-300'
              : 'text-blue-200 hover:text-white hover:bg-blue-900/60'
          }`}
          title="Edit or add survey questions"
        >
          <HelpCircle className="w-4 h-4" /> Questions
        </button>
      </nav>

      {/* Auxiliary Utility Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`p-2 rounded-lg border transition ${
            soundEnabled
              ? 'bg-blue-900 text-yellow-300 border-blue-600 hover:bg-blue-800'
              : 'bg-red-950 text-red-400 border-red-800 hover:bg-red-900'
          }`}
          title={soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        <button
          onClick={onShowShortcuts}
          className="p-2 bg-blue-900 hover:bg-blue-800 text-blue-200 rounded-lg border border-blue-600 transition"
          title="Host Keyboard Shortcuts"
        >
          <Keyboard className="w-4 h-4" />
        </button>

        <button
          onClick={onResetGame}
          className="p-2 bg-red-900/80 hover:bg-red-800 text-white rounded-lg border border-red-600 transition"
          title="Reset All Game Scores & Progress"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
