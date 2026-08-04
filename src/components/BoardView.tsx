import React from 'react';
import { GameState, Team } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trophy, Sparkles, RotateCcw } from 'lucide-react';

interface BoardViewProps {
  gameState: GameState;
  onAnswerClick?: (answerId: string) => void;
  onUpdateTeamName?: (teamId: 'A' | 'B', name: string) => void;
  onClearStrikes?: () => void;
  onDismissStrikesOverlay?: () => void;
  compact?: boolean;
}

export const BoardView: React.FC<BoardViewProps> = ({
  gameState,
  onAnswerClick,
  onUpdateTeamName,
  onClearStrikes,
  onDismissStrikesOverlay,
  compact = false,
}) => {
  const { questions, currentQuestionIndex, teams, potScore, multiplier, strikes, strikesOverlayVisible, activeTeamId } = gameState;
  const currentQuestion = questions[currentQuestionIndex] || {
    id: 'none',
    title: 'No questions loaded',
    answers: [],
  };

  const teamA = teams[0];
  const teamB = teams[1];

  // Helper for team editing
  const [editingTeam, setEditingTeam] = React.useState<'A' | 'B' | null>(null);
  const [tempName, setTempName] = React.useState('');

  const handleStartEdit = (team: Team) => {
    setEditingTeam(team.id);
    setTempName(team.name);
  };

  const handleSaveEdit = (teamId: 'A' | 'B') => {
    if (onUpdateTeamName && tempName.trim()) {
      onUpdateTeamName(teamId, tempName.trim());
    }
    setEditingTeam(null);
  };

  return (
    <div
      className={`relative min-h-[calc(100vh-4rem)] bg-[#050b1a] text-white flex flex-col justify-between overflow-hidden p-3 sm:p-6 border-4 border-[#1e3a8a] shadow-[inset_0_0_100px_rgba(30,58,138,0.5)] select-none ${
        compact ? 'p-2 sm:p-3 min-h-[500px]' : ''
      }`}
    >
      {/* Background Decorative TV Studio Lights */}
      <div className="absolute inset-0 pointer-events-none opacity-25">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-blue-500/30 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 left-10 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px]" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[800px] h-48 bg-amber-500/15 rounded-full blur-[120px]" />
      </div>

      {/* Top Bar: Question Banner & Multiplier */}
      <div className="relative z-10 max-w-5xl mx-auto w-full mb-3">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          {/* Round Indicator & Category */}
          <div className="flex items-center gap-2">
            <span className="bg-blue-900/90 border-2 border-blue-400 text-yellow-300 text-xs font-black px-3.5 py-1 rounded-md uppercase tracking-wider shadow-md">
              Round {currentQuestionIndex + 1} of {questions.length}
            </span>
            {currentQuestion.category && (
              <span className="bg-blue-950 border border-blue-500/60 text-blue-200 text-xs font-bold px-3 py-1 rounded-md">
                {currentQuestion.category}
              </span>
            )}
          </div>

          {/* Multiplier Badge */}
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-black px-4 py-1.5 rounded-md tracking-wider border-2 transition-all shadow-xl ${
                multiplier === 3
                  ? 'bg-gradient-to-r from-red-600 via-amber-500 to-yellow-400 text-white border-yellow-300 shadow-red-600/60 animate-pulse'
                  : multiplier === 2
                  ? 'bg-gradient-to-r from-purple-700 to-pink-600 text-white border-purple-300 shadow-purple-600/50'
                  : 'bg-yellow-500 text-blue-950 border-yellow-300 shadow-yellow-500/30 font-black'
              }`}
            >
              POINTS {multiplier}X
            </span>
          </div>
        </div>

        {/* Main Question Display Box */}
        <div className="bg-blue-900 border-2 border-blue-400 p-4 sm:p-5 rounded-xl shadow-2xl text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-snug">
            {currentQuestion.title}
          </h2>
        </div>
      </div>

      {/* Main Game Stage Layout */}
      <div className="relative z-10 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch flex-1 my-2">
        {/* Left Team Panel (Team A) */}
        <div className="lg:col-span-3 flex flex-col justify-center">
          <div
            className={`relative rounded-xl p-4 transition-all duration-300 border-2 shadow-2xl ${
              activeTeamId === 'A'
                ? 'bg-gradient-to-b from-blue-900 to-blue-950 border-yellow-400 shadow-yellow-400/30 ring-4 ring-yellow-400/20'
                : 'bg-blue-950/80 border-blue-800'
            }`}
          >
            {activeTeamId === 'A' && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-yellow-400 text-blue-950 text-[11px] font-black tracking-widest uppercase px-3 py-0.5 rounded shadow-lg flex items-center gap-1 border border-yellow-200">
                <Sparkles className="w-3 h-3" /> ACTIVE TURN
              </div>
            )}

            <div className="text-center">
              {editingTeam === 'A' ? (
                <div className="flex items-center gap-1 justify-center my-1">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit('A')}
                    className="bg-blue-900 text-white font-black text-base px-2 py-1 rounded border-2 border-yellow-400 w-full text-center uppercase"
                    autoFocus
                  />
                  <button
                    onClick={() => handleSaveEdit('A')}
                    className="bg-yellow-500 text-blue-950 px-2 py-1 rounded text-xs font-black"
                  >
                    OK
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleStartEdit(teamA)}
                  className="group flex items-center justify-center gap-1.5 w-full text-center hover:opacity-90 transition"
                  title="Click to edit team name"
                >
                  <h3 className="text-lg sm:text-xl font-bold text-blue-200 tracking-wider uppercase truncate">
                    {teamA.name}
                  </h3>
                </button>
              )}

              {/* Team Score Box */}
              <div className="mt-3 bg-blue-950 rounded-lg border-2 border-blue-500 p-3 flex flex-col items-center justify-center shadow-inner">
                <span className="text-[10px] font-black text-blue-300 uppercase tracking-widest block mb-0.5">
                  TOTAL SCORE
                </span>
                <span className="text-5xl sm:text-6xl font-mono font-black text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]">
                  {teamA.score}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: The Answer Board & Accumulated Pot */}
        <div className="lg:col-span-6 flex flex-col justify-between gap-4">
          {/* Accumulated Pot Banner */}
          <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 border-2 border-yellow-400/80 rounded-xl p-3 sm:p-4 text-center shadow-2xl flex items-center justify-between px-6 mx-auto w-full max-w-md">
            <div className="text-left">
              <span className="text-[10px] font-black uppercase tracking-widest text-yellow-300 block">
                POINTS AT STAKE
              </span>
              <span className="text-xs font-bold text-blue-200">
                Round Accumulator
              </span>
            </div>
            <div className="flex items-center gap-2">
              <motion.span
                key={potScore}
                initial={{ scale: 1.25 }}
                animate={{ scale: 1 }}
                className="text-4xl sm:text-5xl font-mono font-black text-yellow-300 drop-shadow-[0_0_15px_rgba(253,224,71,0.6)]"
              >
                {potScore}
              </motion.span>
              <Trophy className="w-7 h-7 text-yellow-400 hidden sm:block drop-shadow" />
            </div>
          </div>

          {/* Answer Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 flex-1 justify-center">
            {currentQuestion.answers.map((answer, index) => {
              const isRevealed = answer.revealed;

              return (
                <div
                  key={answer.id || index}
                  onClick={() => onAnswerClick && onAnswerClick(answer.id)}
                  className={`relative cursor-pointer select-none overflow-hidden transition-all duration-300 min-h-[64px] ${
                    onAnswerClick ? 'hover:brightness-105 active:scale-[0.99]' : ''
                  }`}
                  style={{ perspective: '1000px' }}
                >
                  <motion.div
                    className="w-full h-full relative"
                    initial={false}
                    animate={{ rotateX: isRevealed ? 360 : 0 }}
                    transition={{ duration: 0.6, type: 'spring', stiffness: 180, damping: 20 }}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {isRevealed ? (
                      /* REVEALED CARD BACK SIDE */
                      <div className="h-full bg-white border-4 border-yellow-500 rounded-lg flex items-center justify-between px-4 py-2 shadow-xl">
                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                          <span className="flex-shrink-0 bg-blue-900 text-yellow-400 font-black text-sm w-7 h-7 rounded flex items-center justify-center shadow">
                            {index + 1}
                          </span>
                          <span className="text-lg sm:text-xl font-black text-blue-950 uppercase tracking-tight truncate">
                            {answer.text}
                          </span>
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-blue-800 border-l-4 border-blue-200 pl-3 font-mono flex-shrink-0">
                          {answer.points}
                        </div>
                      </div>
                    ) : (
                      /* COVERED CARD FRONT SIDE */
                      <div className="h-full bg-gradient-to-br from-blue-700 to-blue-900 border-4 border-blue-400 rounded-lg flex items-center justify-between px-4 py-2 shadow-xl hover:brightness-110">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl sm:text-4xl font-black text-blue-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                            {index + 1}
                          </span>
                          <span className="text-xs sm:text-sm font-bold text-blue-200 tracking-wider uppercase">
                            HIDDEN ANSWER
                          </span>
                        </div>
                        <div className="text-blue-300 font-black text-lg tracking-widest">
                          - -
                        </div>
                      </div>
                    )}
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Team Panel (Team B) */}
        <div className="lg:col-span-3 flex flex-col justify-center">
          <div
            className={`relative rounded-xl p-4 transition-all duration-300 border-2 shadow-2xl ${
              activeTeamId === 'B'
                ? 'bg-gradient-to-b from-blue-900 to-blue-950 border-yellow-400 shadow-yellow-400/30 ring-4 ring-yellow-400/20'
                : 'bg-blue-950/80 border-blue-800'
            }`}
          >
            {activeTeamId === 'B' && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-yellow-400 text-blue-950 text-[11px] font-black tracking-widest uppercase px-3 py-0.5 rounded shadow-lg flex items-center gap-1 border border-yellow-200">
                <Sparkles className="w-3 h-3" /> ACTIVE TURN
              </div>
            )}

            <div className="text-center">
              {editingTeam === 'B' ? (
                <div className="flex items-center gap-1 justify-center my-1">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit('B')}
                    className="bg-blue-900 text-white font-black text-base px-2 py-1 rounded border-2 border-yellow-400 w-full text-center uppercase"
                    autoFocus
                  />
                  <button
                    onClick={() => handleSaveEdit('B')}
                    className="bg-yellow-500 text-blue-950 px-2 py-1 rounded text-xs font-black"
                  >
                    OK
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleStartEdit(teamB)}
                  className="group flex items-center justify-center gap-1.5 w-full text-center hover:opacity-90 transition"
                  title="Click to edit team name"
                >
                  <h3 className="text-lg sm:text-xl font-bold text-blue-200 tracking-wider uppercase truncate">
                    {teamB.name}
                  </h3>
                </button>
              )}

              {/* Team Score Box */}
              <div className="mt-3 bg-blue-950 rounded-lg border-2 border-blue-500 p-3 flex flex-col items-center justify-center shadow-inner">
                <span className="text-[10px] font-black text-blue-300 uppercase tracking-widest block mb-0.5">
                  TOTAL SCORE
                </span>
                <span className="text-5xl sm:text-6xl font-mono font-black text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]">
                  {teamB.score}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Strikes Indicator Bar (Persistent Board Strikes) */}
      <div className="relative z-10 max-w-xl mx-auto w-full mt-3">
        <div className="bg-blue-950/90 border-2 border-blue-600 rounded-2xl p-3 flex items-center justify-between px-6 shadow-2xl">
          <span className="text-xs font-black text-blue-300 uppercase tracking-widest flex items-center gap-2">
            STRIKES / ERRORS:
          </span>
          <div className="flex items-center gap-3">
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                className={`w-12 h-14 sm:w-14 sm:h-16 rounded-lg flex items-center justify-center text-3xl sm:text-4xl font-black transition-all shadow-lg ${
                  strikes >= num
                    ? 'bg-red-600 border-4 border-red-400 text-white shadow-red-900/60 scale-105'
                    : 'bg-slate-900 border-4 border-slate-700 text-slate-700'
                }`}
              >
                {strikes >= num ? 'X' : num}
              </div>
            ))}
          </div>

          {onClearStrikes && strikes > 0 && (
            <button
              onClick={onClearStrikes}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 text-xs font-bold transition flex items-center gap-1 ml-2"
              title="Clear board strikes (Reset to 0)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Full-Screen Animated Red "X" Strike Overlay */}
      <AnimatePresence>
        {strikesOverlayVisible && strikes > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={onDismissStrikesOverlay || onClearStrikes}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-4 cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.3, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              className="flex items-center justify-center gap-4 sm:gap-8 flex-wrap"
            >
              {Array.from({ length: strikes }).map((_, i) => (
                <div
                  key={i}
                  className="bg-gradient-to-b from-red-500 via-red-600 to-red-800 border-4 border-red-300 p-6 sm:p-10 rounded-3xl shadow-[0_0_80px_rgba(239,68,68,0.9)] text-white"
                >
                  <X className="w-24 h-24 sm:w-36 sm:h-36 stroke-[4]" />
                </div>
              ))}
            </motion.div>
            <div className="mt-8 flex flex-col items-center gap-2">
              <p className="text-white/90 font-bold text-sm tracking-widest uppercase bg-slate-900/90 border-2 border-red-500 px-6 py-2 rounded-full shadow-lg">
                Tap anywhere to close overlay (Strikes stay marked on board)
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
