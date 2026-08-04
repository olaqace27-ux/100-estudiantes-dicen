import React from 'react';
import { GameState } from '../types';
import { sound } from '../utils/sound';
import {
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  XCircle,
  Award,
  Plus,
  Minus,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  Flame,
} from 'lucide-react';

interface ControlPanelProps {
  gameState: GameState;
  autoDeductPenalty: boolean;
  penaltyAmount: number;
  onToggleAutoDeductPenalty: () => void;
  onSetPenaltyAmount: (amount: number) => void;
  onDeductTeamScore: (teamId: 'A' | 'B', amount: number) => void;
  onDeductPotScore: (amount: number) => void;
  onRevealAnswer: (answerId: string) => void;
  onRevealAllAnswers: () => void;
  onHideAllAnswers: () => void;
  onTriggerStrike: (count: number) => void;
  onClearStrikes: () => void;
  onDismissStrikeOverlay: () => void;
  onSetTurn: (teamId: 'A' | 'B' | null) => void;
  onAssignPotToTeam: (teamId: 'A' | 'B') => void;
  onAdjustTeamScore: (teamId: 'A' | 'B', delta: number) => void;
  onSetMultiplier: (mult: 1 | 2 | 3) => void;
  onSelectQuestion: (index: number) => void;
  onResetBoardState: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  gameState,
  autoDeductPenalty,
  penaltyAmount,
  onToggleAutoDeductPenalty,
  onSetPenaltyAmount,
  onDeductTeamScore,
  onDeductPotScore,
  onRevealAnswer,
  onRevealAllAnswers,
  onHideAllAnswers,
  onTriggerStrike,
  onClearStrikes,
  onDismissStrikeOverlay,
  onSetTurn,
  onAssignPotToTeam,
  onAdjustTeamScore,
  onSetMultiplier,
  onSelectQuestion,
  onResetBoardState,
}) => {
  const { questions, currentQuestionIndex, teams, potScore, multiplier, strikes, strikesOverlayVisible, activeTeamId } = gameState;
  const currentQuestion = questions[currentQuestionIndex] || {
    id: '',
    title: 'No questions loaded',
    answers: [],
  };

  const teamA = teams[0];
  const teamB = teams[1];

  return (
    <div className="bg-[#050b1a] text-white p-4 sm:p-6 min-h-[calc(100vh-4rem)] max-w-7xl mx-auto flex flex-col gap-6">
      {/* Top Banner: Question Selector & Navigator */}
      <div className="bg-blue-950 border-2 border-blue-600 rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black text-yellow-300 uppercase tracking-widest bg-blue-900 px-2.5 py-0.5 rounded border border-blue-700">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            {currentQuestion.category && (
              <span className="text-xs font-medium text-blue-200">
                • {currentQuestion.category}
              </span>
            )}
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white tracking-tight uppercase">
            {currentQuestion.title}
          </h2>
        </div>

        {/* Question Selector Controls */}
        <div className="flex items-center gap-2">
          <button
            id="btn-prev-question"
            onClick={() => onSelectQuestion(Math.max(0, currentQuestionIndex - 1))}
            disabled={currentQuestionIndex === 0}
            className="p-2.5 bg-blue-900 hover:bg-blue-800 disabled:opacity-40 text-white rounded-xl border border-blue-700 transition"
            title="Previous Question"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <select
            id="select-question-dropdown"
            value={currentQuestionIndex}
            onChange={(e) => onSelectQuestion(Number(e.target.value))}
            className="bg-slate-950 text-white text-xs sm:text-sm font-semibold px-3 py-2.5 rounded-xl border border-blue-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 max-w-[200px] sm:max-w-xs"
          >
            {questions.map((q, idx) => (
              <option key={q.id} value={idx}>
                {idx + 1}. {q.title.slice(0, 38)}...
              </option>
            ))}
          </select>

          <button
            id="btn-next-question"
            onClick={() => onSelectQuestion(Math.min(questions.length - 1, currentQuestionIndex + 1))}
            disabled={currentQuestionIndex === questions.length - 1}
            className="p-2.5 bg-blue-900 hover:bg-blue-800 disabled:opacity-40 text-white rounded-xl border border-blue-700 transition"
            title="Next Question"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Grid: Live Answer Controls & Live Game Control Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Board Answers Controls (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-blue-950/80 border-2 border-blue-800 rounded-2xl p-4 sm:p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-blue-800">
              <h3 className="font-black text-base text-yellow-300 uppercase tracking-wider flex items-center gap-2">
                <Eye className="w-5 h-5 text-yellow-400" /> Board Answers ({currentQuestion.answers.length})
              </h3>
              <div className="flex items-center gap-2">
                <button
                  id="btn-reveal-all"
                  onClick={onRevealAllAnswers}
                  className="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-400 text-blue-950 border border-yellow-300 rounded-lg text-xs font-black transition flex items-center gap-1 shadow"
                >
                  <Eye className="w-3.5 h-3.5" /> Reveal All
                </button>
                <button
                  id="btn-hide-all"
                  onClick={onHideAllAnswers}
                  className="px-3 py-1.5 bg-blue-900 hover:bg-blue-800 text-blue-100 border border-blue-700 rounded-lg text-xs font-bold transition flex items-center gap-1"
                >
                  <EyeOff className="w-3.5 h-3.5" /> Hide All
                </button>
              </div>
            </div>

            {/* Answer Rows List */}
            <div className="space-y-2.5">
              {currentQuestion.answers.map((answer, index) => (
                <div
                  key={answer.id || index}
                  className={`p-3 rounded-xl border-2 flex items-center justify-between gap-3 transition-all ${
                    answer.revealed
                      ? 'bg-white border-yellow-400 text-blue-950 shadow-md'
                      : 'bg-blue-900/60 border-blue-700 hover:border-blue-500 text-white'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-7 h-7 rounded bg-blue-950 text-yellow-400 font-black text-sm flex items-center justify-center flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className={`font-black text-sm sm:text-base tracking-wide uppercase truncate ${answer.revealed ? 'text-blue-950' : 'text-white'}`}>
                      {answer.text}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="bg-blue-950 border border-yellow-400/60 text-yellow-300 font-mono font-black text-sm px-2.5 py-1 rounded-lg">
                      {answer.points} pts
                    </span>

                    <button
                      id={`btn-toggle-answer-${index + 1}`}
                      onClick={() => onRevealAnswer(answer.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition flex items-center gap-1.5 shadow ${
                        answer.revealed
                          ? 'bg-yellow-500 text-blue-950 hover:bg-yellow-400'
                          : 'bg-blue-600 hover:bg-blue-500 text-white'
                      }`}
                    >
                      {answer.revealed ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5" /> REVEALED
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5" /> REVEAL [{index + 1}]
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Strike Controls, Penalty Options, Multipliers & Scores (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Strikes / Errors Controls */}
          <div className="bg-blue-950/90 border-2 border-red-800 rounded-2xl p-4 sm:p-5 shadow-xl">
            <h3 className="font-black text-base text-red-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-500" /> Strike / Error Controls
            </h3>

            <div className="grid grid-cols-3 gap-2 mb-3">
              <button
                id="btn-strike-1"
                onClick={() => onTriggerStrike(1)}
                className="py-2.5 bg-red-950 hover:bg-red-900 border-2 border-red-700 text-red-100 text-xs font-black rounded-xl shadow transition flex flex-col items-center gap-1"
              >
                <span className="text-lg">❌</span> 1 STRIKE
              </button>
              <button
                id="btn-strike-2"
                onClick={() => onTriggerStrike(2)}
                className="py-2.5 bg-red-900 hover:bg-red-800 border-2 border-red-600 text-white text-xs font-black rounded-xl shadow transition flex flex-col items-center gap-1"
              >
                <span className="text-lg">❌❌</span> 2 STRIKES
              </button>
              <button
                id="btn-strike-3"
                onClick={() => onTriggerStrike(3)}
                className="py-2.5 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 border-2 border-red-400 text-white text-xs font-black rounded-xl shadow-lg transition flex flex-col items-center gap-1 animate-pulse"
              >
                <span className="text-lg">❌❌❌</span> 3 STRIKES
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-950 p-2.5 rounded-xl border border-blue-900">
              <span className="text-xs font-black text-blue-200">
                Board Strikes Marked: <strong className="text-red-400 text-sm ml-1">{strikes}</strong>
              </span>
              <div className="flex items-center gap-1.5">
                {strikesOverlayVisible && (
                  <button
                    onClick={onDismissStrikeOverlay}
                    className="px-2.5 py-1 bg-blue-900 hover:bg-blue-800 text-blue-200 text-xs font-bold rounded border border-blue-700 transition"
                    title="Dismiss full screen overlay but KEEP strikes on board"
                  >
                    Hide Banner
                  </button>
                )}
                <button
                  id="btn-clear-strikes"
                  onClick={onClearStrikes}
                  className="px-2.5 py-1 bg-red-950 hover:bg-red-900 text-red-200 text-xs font-bold rounded border border-red-800 transition"
                  title="Clear all strikes (Reset to 0)"
                >
                  Clear Strikes (0)
                </button>
              </div>
            </div>
          </div>

          {/* Point Deductions & Error Penalty Controls */}
          <div className="bg-blue-950/90 border-2 border-amber-600/80 rounded-2xl p-4 sm:p-5 shadow-xl">
            <h3 className="font-black text-sm text-yellow-300 uppercase tracking-wider mb-2.5 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400" /> Error Penalty & Point Deductions
            </h3>

            {/* Auto-deduct Toggle */}
            <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-yellow-500/40 mb-3">
              <div className="flex flex-col">
                <span className="text-xs font-black text-white uppercase">
                  Auto-Deduct Penalty on Strike
                </span>
                <span className="text-[10px] text-blue-300">
                  Deducts points from the active team when a strike is triggered
                </span>
              </div>
              <button
                onClick={onToggleAutoDeductPenalty}
                className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase transition ${
                  autoDeductPenalty
                    ? 'bg-yellow-400 text-blue-950 shadow border border-yellow-200'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {autoDeductPenalty ? 'ENABLED ON' : 'DISABLED OFF'}
              </button>
            </div>

            {/* Penalty Amount Selector */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-bold text-blue-200 uppercase">Penalty Value:</span>
              <div className="flex items-center gap-1">
                {[5, 10, 20, 50].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => onSetPenaltyAmount(amt)}
                    className={`px-2.5 py-1 text-xs font-black rounded border transition ${
                      penaltyAmount === amt
                        ? 'bg-red-600 text-white border-red-400 shadow'
                        : 'bg-blue-900 text-blue-300 border-blue-700'
                    }`}
                  >
                    -{amt} pts
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Manual Deduction Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-blue-900">
              <button
                onClick={() => onDeductTeamScore('A', penaltyAmount)}
                className="py-2 px-3 bg-gradient-to-r from-red-950 to-red-900 hover:from-red-900 hover:to-red-800 border border-red-700 text-red-100 rounded-xl text-xs font-black uppercase transition text-center shadow"
              >
                - {penaltyAmount} pts ({teamA.name})
              </button>
              <button
                onClick={() => onDeductTeamScore('B', penaltyAmount)}
                className="py-2 px-3 bg-gradient-to-r from-red-950 to-red-900 hover:from-red-900 hover:to-red-800 border border-red-700 text-red-100 rounded-xl text-xs font-black uppercase transition text-center shadow"
              >
                - {penaltyAmount} pts ({teamB.name})
              </button>
            </div>
          </div>

          {/* Round Multiplier Selector */}
          <div className="bg-blue-950/90 border-2 border-blue-800 rounded-2xl p-4 shadow-xl">
            <h3 className="font-black text-xs text-blue-300 uppercase tracking-wider mb-2">
              Round Point Multiplier
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {([1, 2, 3] as const).map((mult) => (
                <button
                  key={mult}
                  id={`btn-multiplier-${mult}`}
                  onClick={() => onSetMultiplier(mult)}
                  className={`py-2 rounded-xl text-xs font-black tracking-wider border transition-all ${
                    multiplier === mult
                      ? 'bg-yellow-500 text-blue-950 border-yellow-300 shadow-md font-black'
                      : 'bg-blue-900 text-blue-300 border-blue-700 hover:text-white'
                  }`}
                >
                  {mult}X POINTS
                </button>
              ))}
            </div>
          </div>

          {/* Round Pot & Team Points Management */}
          <div className="bg-blue-950/90 border-2 border-yellow-500/60 rounded-2xl p-4 sm:p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-black text-sm text-yellow-300 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-yellow-400" /> Round Pot at Stake:
              </h3>
              <span className="text-2xl font-black font-mono text-yellow-400">
                {potScore} pts
              </span>
            </div>

            {/* Transfer Pot Buttons */}
            <div className="grid grid-cols-2 gap-2.5 mb-4">
              <button
                id="btn-assign-pot-team-a"
                onClick={() => onAssignPotToTeam('A')}
                disabled={potScore === 0}
                className="p-3 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 disabled:opacity-40 text-white rounded-xl font-bold text-xs shadow-md transition text-left flex flex-col justify-between border border-blue-500"
              >
                <span className="text-[10px] text-yellow-300 uppercase font-black">
                  Award Pot To:
                </span>
                <span className="font-black text-sm truncate uppercase">{teamA.name}</span>
              </button>

              <button
                id="btn-assign-pot-team-b"
                onClick={() => onAssignPotToTeam('B')}
                disabled={potScore === 0}
                className="p-3 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 disabled:opacity-40 text-white rounded-xl font-bold text-xs shadow-md transition text-left flex flex-col justify-between border border-blue-500"
              >
                <span className="text-[10px] text-yellow-300 uppercase font-black">
                  Award Pot To:
                </span>
                <span className="font-black text-sm truncate uppercase">{teamB.name}</span>
              </button>
            </div>

            {/* Active Turn Selector */}
            <div className="mb-4 pt-3 border-t border-blue-900">
              <span className="text-[11px] font-black text-blue-300 uppercase tracking-wider block mb-2">
                Active Turn Selection:
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  id="btn-turn-team-a"
                  onClick={() => onSetTurn(activeTeamId === 'A' ? null : 'A')}
                  className={`py-1.5 px-2 rounded-lg text-xs font-black uppercase border transition ${
                    activeTeamId === 'A'
                      ? 'bg-yellow-500 text-blue-950 border-yellow-300 shadow'
                      : 'bg-blue-900 text-blue-300 border-blue-700'
                  }`}
                >
                  Turn {teamA.name.slice(0, 10)}
                </button>
                <button
                  id="btn-turn-team-b"
                  onClick={() => onSetTurn(activeTeamId === 'B' ? null : 'B')}
                  className={`py-1.5 px-2 rounded-lg text-xs font-black uppercase border transition ${
                    activeTeamId === 'B'
                      ? 'bg-yellow-500 text-blue-950 border-yellow-300 shadow'
                      : 'bg-blue-900 text-blue-300 border-blue-700'
                  }`}
                >
                  Turn {teamB.name.slice(0, 10)}
                </button>
                <button
                  id="btn-turn-none"
                  onClick={() => onSetTurn(null)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-black uppercase border transition ${
                    activeTeamId === null
                      ? 'bg-slate-700 text-white border-slate-500'
                      : 'bg-blue-900 text-blue-300 border-blue-700'
                  }`}
                >
                  No Active Turn
                </button>
              </div>
            </div>

            {/* Manual Score Adjustments */}
            <div className="space-y-2 pt-3 border-t border-blue-900">
              <span className="text-[11px] font-black text-blue-300 uppercase tracking-wider block">
                Manual Score Adjustments:
              </span>
              <div className="flex items-center justify-between bg-slate-950 p-2 rounded-xl border border-blue-900">
                <span className="text-xs font-black text-blue-200 truncate max-w-[120px] uppercase">
                  {teamA.name}: {teamA.score}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onAdjustTeamScore('A', 5)}
                    className="px-2 py-0.5 bg-blue-900 hover:bg-blue-800 text-yellow-300 text-xs font-bold rounded border border-blue-700"
                  >
                    +5
                  </button>
                  <button
                    onClick={() => onAdjustTeamScore('A', 10)}
                    className="px-2 py-0.5 bg-blue-900 hover:bg-blue-800 text-yellow-300 text-xs font-bold rounded border border-blue-700"
                  >
                    +10
                  </button>
                  <button
                    onClick={() => onDeductTeamScore('A', 5)}
                    className="px-2 py-0.5 bg-red-950 hover:bg-red-900 text-red-200 text-xs font-bold rounded border border-red-800"
                  >
                    -5
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between bg-slate-950 p-2 rounded-xl border border-blue-900">
                <span className="text-xs font-black text-blue-200 truncate max-w-[120px] uppercase">
                  {teamB.name}: {teamB.score}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onAdjustTeamScore('B', 5)}
                    className="px-2 py-0.5 bg-blue-900 hover:bg-blue-800 text-yellow-300 text-xs font-bold rounded border border-blue-700"
                  >
                    +5
                  </button>
                  <button
                    onClick={() => onAdjustTeamScore('B', 10)}
                    className="px-2 py-0.5 bg-blue-900 hover:bg-blue-800 text-yellow-300 text-xs font-bold rounded border border-blue-700"
                  >
                    +10
                  </button>
                  <button
                    onClick={() => onDeductTeamScore('B', 5)}
                    className="px-2 py-0.5 bg-red-950 hover:bg-red-900 text-red-200 text-xs font-bold rounded border border-red-800"
                  >
                    -5
                  </button>
                </div>
              </div>
            </div>

            {/* Sound FX Test & Reset Board */}
            <div className="mt-4 pt-3 border-t border-blue-900 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => sound.playCorrect()}
                  className="px-2.5 py-1 bg-blue-900 hover:bg-blue-800 text-xs font-bold text-green-300 rounded border border-blue-700"
                  title="Test correct answer sound"
                >
                  🔔 Correct
                </button>
                <button
                  onClick={() => sound.playWrong()}
                  className="px-2.5 py-1 bg-blue-900 hover:bg-blue-800 text-xs font-bold text-red-300 rounded border border-blue-700"
                  title="Test wrong answer buzzer sound"
                >
                  ❌ Buzzer
                </button>
                <button
                  onClick={() => sound.playWinner()}
                  className="px-2.5 py-1 bg-blue-900 hover:bg-blue-800 text-xs font-bold text-yellow-300 rounded border border-blue-700"
                  title="Test winner fanfare sound"
                >
                  🎺 Fanfare
                </button>
              </div>

              <button
                id="btn-reset-board-state"
                onClick={onResetBoardState}
                className="px-3 py-1 bg-blue-900 hover:bg-blue-800 text-blue-200 text-xs font-black uppercase rounded border border-blue-700 flex items-center gap-1 shadow"
                title="Hide answers and clear strikes for current round"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Clear Round
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
