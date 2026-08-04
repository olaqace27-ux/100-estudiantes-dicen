import React from 'react';
import { FastMoneyQuestion } from '../types';
import { sound } from '../utils/sound';
import confetti from 'canvas-confetti';
import { Zap, Play, Pause, RotateCcw, Trophy, Check, Eye, EyeOff } from 'lucide-react';

export const FastMoneyView: React.FC = () => {
  const [timer, setTimer] = React.useState<number>(20);
  const [timerActive, setTimerActive] = React.useState<boolean>(false);
  const [activePlayer, setActivePlayer] = React.useState<1 | 2>(1);

  // 5 questions for Fast Money in English
  const [fastQuestions, setFastQuestions] = React.useState<FastMoneyQuestion[]>([
    {
      id: 'fm1',
      questionText: '1. Something you do right before going to bed',
      p1Answer: '',
      p1Points: 0,
      p1Revealed: false,
      p2Answer: '',
      p2Points: 0,
      p2Revealed: false,
    },
    {
      id: 'fm2',
      questionText: '2. An animal that starts with the letter C',
      p1Answer: '',
      p1Points: 0,
      p1Revealed: false,
      p2Answer: '',
      p2Points: 0,
      p2Revealed: false,
    },
    {
      id: 'fm3',
      questionText: '3. A popular birthday gift',
      p1Answer: '',
      p1Points: 0,
      p1Revealed: false,
      p2Answer: '',
      p2Points: 0,
      p2Revealed: false,
    },
    {
      id: 'fm4',
      questionText: '4. An excuse for skipping the gym',
      p1Answer: '',
      p1Points: 0,
      p1Revealed: false,
      p2Answer: '',
      p2Points: 0,
      p2Revealed: false,
    },
    {
      id: 'fm5',
      questionText: '5. A popular beverage at a restaurant',
      p1Answer: '',
      p1Points: 0,
      p1Revealed: false,
      p2Answer: '',
      p2Points: 0,
      p2Revealed: false,
    },
  ]);

  // Timer effect
  React.useEffect(() => {
    let interval: any = null;
    if (timerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            sound.playWrong();
            setTimerActive(false);
            return 0;
          }
          sound.playTimerTick();
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, timer]);

  const handleStartTimer = (seconds: number) => {
    setTimer(seconds);
    setTimerActive(true);
  };

  const handleToggleTimer = () => {
    setTimerActive(!timerActive);
  };

  const handleResetTimer = () => {
    setTimerActive(false);
    setTimer(activePlayer === 1 ? 20 : 25);
  };

  // Total Points calculation
  const totalP1 = fastQuestions.reduce((sum, q) => sum + (q.p1Revealed ? q.p1Points : 0), 0);
  const totalP2 = fastQuestions.reduce((sum, q) => sum + (q.p2Revealed ? q.p2Points : 0), 0);
  const totalPoints = totalP1 + totalP2;

  // Trigger celebration when reaching 200
  React.useEffect(() => {
    if (totalPoints >= 200) {
      sound.playWinner();
      confetti({
        particleCount: 180,
        spread: 90,
        origin: { y: 0.6 },
      });
    }
  }, [totalPoints]);

  const updateQuestion = (index: number, field: keyof FastMoneyQuestion, value: any) => {
    setFastQuestions((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const toggleRevealP1 = (index: number) => {
    setFastQuestions((prev) => {
      const copy = [...prev];
      const isRev = !copy[index].p1Revealed;
      copy[index] = { ...copy[index], p1Revealed: isRev };
      if (isRev) {
        if (copy[index].p1Points > 0) sound.playCorrect();
        else sound.playWrong();
      }
      return copy;
    });
  };

  const toggleRevealP2 = (index: number) => {
    setFastQuestions((prev) => {
      const copy = [...prev];
      const isRev = !copy[index].p2Revealed;
      copy[index] = { ...copy[index], p2Revealed: isRev };
      if (isRev) {
        if (copy[index].p2Points > 0) sound.playCorrect();
        else sound.playWrong();
      }
      return copy;
    });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#050b1a] text-white p-4 sm:p-6 max-w-7xl mx-auto flex flex-col gap-6">
      {/* Fast Money Header & Timer */}
      <div className="bg-blue-950 border-2 border-yellow-500/60 rounded-2xl p-4 sm:p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-yellow-500 to-amber-600 p-3 rounded-2xl shadow-lg shadow-yellow-500/30">
            <Zap className="w-8 h-8 text-blue-950 animate-pulse" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-yellow-300 tracking-tight uppercase">
              FAST MONEY ROUND
            </h2>
            <p className="text-xs text-blue-200 font-bold uppercase">
              Final Round • Goal: <strong className="text-yellow-400">200 Points</strong>
            </p>
          </div>
        </div>

        {/* Big Digital Timer Control */}
        <div className="flex items-center gap-4 bg-slate-950 border-2 border-blue-800 p-3.5 rounded-2xl shadow-inner">
          <div className="text-center px-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-300 block">
              COUNTDOWN TIMER
            </span>
            <span
              className={`text-4xl sm:text-5xl font-black font-mono tracking-wider ${
                timer <= 5 && timer > 0
                  ? 'text-red-500 animate-bounce'
                  : timer === 0
                  ? 'text-slate-600'
                  : 'text-yellow-400'
              }`}
            >
              {timer}s
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1">
              <button
                id="btn-timer-20"
                onClick={() => {
                  setActivePlayer(1);
                  handleStartTimer(20);
                }}
                className="px-2.5 py-1 bg-yellow-500 hover:bg-yellow-400 text-blue-950 text-xs font-black rounded-lg shadow uppercase"
              >
                20s (Player 1)
              </button>
              <button
                id="btn-timer-25"
                onClick={() => {
                  setActivePlayer(2);
                  handleStartTimer(25);
                }}
                className="px-2.5 py-1 bg-yellow-500 hover:bg-yellow-400 text-blue-950 text-xs font-black rounded-lg shadow uppercase"
              >
                25s (Player 2)
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleToggleTimer}
                className={`px-3 py-1 text-xs font-black rounded-lg shadow flex-1 flex items-center justify-center gap-1 uppercase ${
                  timerActive
                    ? 'bg-red-600 text-white hover:bg-red-500'
                    : 'bg-green-600 text-white hover:bg-green-500'
                }`}
              >
                {timerActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                {timerActive ? 'Pause' : 'Start'}
              </button>
              <button
                onClick={handleResetTimer}
                className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700"
                title="Reset timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Total Points Display */}
        <div className="bg-blue-900 border-2 border-yellow-400 px-6 py-3 rounded-2xl text-center shadow-2xl flex items-center gap-4">
          <div>
            <span className="text-[10px] font-black uppercase text-yellow-300 tracking-wider block">
              TOTAL POINTS
            </span>
            <span
              className={`text-4xl sm:text-5xl font-mono font-black ${
                totalPoints >= 200 ? 'text-yellow-300 animate-pulse' : 'text-white'
              }`}
            >
              {totalPoints}
            </span>
          </div>
          <Trophy className={`w-8 h-8 ${totalPoints >= 200 ? 'text-yellow-400 animate-bounce' : 'text-blue-400'}`} />
        </div>
      </div>

      {/* Questions & Player Responses Table */}
      <div className="bg-blue-950/90 border-2 border-blue-800 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-4">
        {fastQuestions.map((q, idx) => (
          <div
            key={q.id}
            className="bg-slate-950 border-2 border-blue-900 rounded-xl p-3 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            {/* Question title */}
            <div className="md:w-1/3">
              <input
                type="text"
                value={q.questionText}
                onChange={(e) => updateQuestion(idx, 'questionText', e.target.value)}
                className="w-full bg-blue-950 border border-blue-700 text-white text-xs sm:text-sm font-bold p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            {/* Player 1 Answers */}
            <div className="flex-1 bg-blue-900/60 p-2.5 rounded-xl border border-blue-800 flex items-center gap-2">
              <span className="text-[10px] font-black text-yellow-300 uppercase px-2 py-1 bg-blue-950 rounded">
                P1
              </span>
              <input
                type="text"
                placeholder="Player 1 Answer..."
                value={q.p1Answer}
                onChange={(e) => updateQuestion(idx, 'p1Answer', e.target.value)}
                className="flex-1 bg-blue-950 text-white font-bold text-xs p-1.5 rounded border border-blue-700 uppercase"
              />
              <input
                type="number"
                value={q.p1Points}
                onChange={(e) => updateQuestion(idx, 'p1Points', Number(e.target.value))}
                className="w-14 bg-blue-950 text-yellow-300 font-mono font-black text-center text-xs p-1.5 rounded border border-blue-700"
              />
              <button
                onClick={() => toggleRevealP1(idx)}
                className={`p-1.5 rounded text-xs font-black uppercase transition ${
                  q.p1Revealed
                    ? 'bg-yellow-500 text-blue-950'
                    : 'bg-blue-700 hover:bg-blue-600 text-white'
                }`}
                title="Toggle Player 1 Answer Reveal"
              >
                {q.p1Revealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Player 2 Answers */}
            <div className="flex-1 bg-blue-900/60 p-2.5 rounded-xl border border-blue-800 flex items-center gap-2">
              <span className="text-[10px] font-black text-yellow-300 uppercase px-2 py-1 bg-blue-950 rounded">
                P2
              </span>
              <input
                type="text"
                placeholder="Player 2 Answer..."
                value={q.p2Answer}
                onChange={(e) => updateQuestion(idx, 'p2Answer', e.target.value)}
                className="flex-1 bg-blue-950 text-white font-bold text-xs p-1.5 rounded border border-blue-700 uppercase"
              />
              <input
                type="number"
                value={q.p2Points}
                onChange={(e) => updateQuestion(idx, 'p2Points', Number(e.target.value))}
                className="w-14 bg-blue-950 text-yellow-300 font-mono font-black text-center text-xs p-1.5 rounded border border-blue-700"
              />
              <button
                onClick={() => toggleRevealP2(idx)}
                className={`p-1.5 rounded text-xs font-black uppercase transition ${
                  q.p2Revealed
                    ? 'bg-yellow-500 text-blue-950'
                    : 'bg-blue-700 hover:bg-blue-600 text-white'
                }`}
                title="Toggle Player 2 Answer Reveal"
              >
                {q.p2Revealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
