import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: '1 - 8', desc: 'Reveal / Hide answer 1 through 8' },
    { key: 'X', desc: 'Trigger Strike / Error Cross (1, 2, 3)' },
    { key: 'Shift + X', desc: 'Clear all strike crosses (Reset to 0)' },
    { key: 'A', desc: 'Award round pot points to Team A' },
    { key: 'B', desc: 'Award round pot points to Team B' },
    { key: 'M', desc: 'Cycle round point multiplier (1X, 2X, 3X)' },
    { key: 'N', desc: 'Advance to Next Question' },
    { key: 'P', desc: 'Return to Previous Question' },
    { key: 'Spacebar', desc: 'Play wrong buzzer sound' },
    { key: 'F11', desc: 'Toggle Full Screen View' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-blue-950 border-2 border-blue-600 rounded-2xl p-6 max-w-md w-full shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-blue-300 hover:text-white p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="bg-yellow-500 p-2.5 rounded-xl shadow">
            <Keyboard className="w-6 h-6 text-blue-950" />
          </div>
          <div>
            <h3 className="font-black text-lg text-white uppercase">
              Host Keyboard Shortcuts
            </h3>
            <p className="text-xs text-blue-200">
              Control the game show directly from your keyboard
            </p>
          </div>
        </div>

        <div className="space-y-2 mb-6 max-h-[350px] overflow-y-auto pr-1">
          {shortcuts.map((sc, i) => (
            <div
              key={i}
              className="bg-slate-950 p-2.5 rounded-xl border border-blue-900 flex items-center justify-between gap-3 text-xs"
            >
              <span className="font-mono font-black text-yellow-300 bg-blue-900 px-2 py-1 rounded border border-yellow-500/40">
                {sc.key}
              </span>
              <span className="font-bold text-blue-100 text-right">{sc.desc}</span>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-yellow-500 hover:bg-yellow-400 text-blue-950 font-black text-xs uppercase rounded-xl shadow-md transition"
        >
          Got it, Close
        </button>
      </div>
    </div>
  );
};
