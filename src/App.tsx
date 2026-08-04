import React from 'react';
import { GameState, Question, Team, ViewMode } from './types';
import { INITIAL_QUESTIONS } from './data/presetQuestions';
import { sound } from './utils/sound';
import { Navbar } from './components/Navbar';
import { BoardView } from './components/BoardView';
import { ControlPanel } from './components/ControlPanel';
import { FastMoneyView } from './components/FastMoneyView';
import { QuestionManager } from './components/QuestionManager';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';

export default function App() {
  const [questions, setQuestions] = React.useState<Question[]>(INITIAL_QUESTIONS);
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState<number>(0);
  const [teams, setTeams] = React.useState<[Team, Team]>([
    { id: 'A', name: 'TEAM 1', score: 0, color: '#3b82f6' },
    { id: 'B', name: 'TEAM 2', score: 0, color: '#ef4444' },
  ]);
  const [multiplier, setMultiplier] = React.useState<1 | 2 | 3>(1);
  const [strikes, setStrikes] = React.useState<number>(0);
  const [strikesOverlayVisible, setStrikesOverlayVisible] = React.useState<boolean>(false);
  const [activeTeamId, setActiveTeamId] = React.useState<'A' | 'B' | null>(null);
  const [viewMode, setViewMode] = React.useState<ViewMode>('game');
  const [soundEnabled, setSoundEnabled] = React.useState<boolean>(true);
  const [showShortcutsModal, setShowShortcutsModal] = React.useState<boolean>(false);

  // Penalty / Deduct Points configuration
  const [autoDeductPenalty, setAutoDeductPenalty] = React.useState<boolean>(true);
  const [penaltyAmount, setPenaltyAmount] = React.useState<number>(10);

  // Calculate Pot Score (accumulated round points)
  const currentQuestion = questions[currentQuestionIndex];
  const potScore = React.useMemo(() => {
    if (!currentQuestion) return 0;
    const baseSum = currentQuestion.answers.reduce(
      (acc, ans) => (ans.revealed ? acc + ans.points : acc),
      0
    );
    return baseSum * multiplier;
  }, [currentQuestion, multiplier]);

  // Combined game state
  const gameState: GameState = {
    questions,
    currentQuestionIndex,
    teams,
    potScore,
    multiplier,
    strikes,
    strikesOverlayVisible,
    activeTeamId,
    viewMode,
    soundEnabled,
    volume: 0.8,
  };

  // 1. Reveal or hide single answer
  const handleRevealAnswer = (answerId: string) => {
    setQuestions((prevQuestions) => {
      const copy = JSON.parse(JSON.stringify(prevQuestions)) as Question[];
      const q = copy[currentQuestionIndex];
      if (!q) return prevQuestions;

      const targetAns = q.answers.find((a) => a.id === answerId);
      if (targetAns) {
        const willReveal = !targetAns.revealed;
        targetAns.revealed = willReveal;
        if (willReveal) {
          sound.playCorrect();
        }
      }
      return copy;
    });
  };

  // 2. Reveal all answers
  const handleRevealAllAnswers = () => {
    setQuestions((prevQuestions) => {
      const copy = JSON.parse(JSON.stringify(prevQuestions)) as Question[];
      const q = copy[currentQuestionIndex];
      if (!q) return prevQuestions;
      q.answers.forEach((a) => (a.revealed = true));
      return copy;
    });
    sound.playCorrect();
  };

  // 3. Hide all answers
  const handleHideAllAnswers = () => {
    setQuestions((prevQuestions) => {
      const copy = JSON.parse(JSON.stringify(prevQuestions)) as Question[];
      const q = copy[currentQuestionIndex];
      if (!q) return prevQuestions;
      q.answers.forEach((a) => (a.revealed = false));
      return copy;
    });
  };

  // 4. Trigger strikes & auto-deduct penalty if enabled
  const handleTriggerStrike = (count: number) => {
    setStrikes(count);
    setStrikesOverlayVisible(true);

    if (count >= 3) {
      sound.playTripleStrike();
    } else {
      sound.playWrong();
    }

    // Auto-deduct penalty points from active team on error if configured
    if (autoDeductPenalty && activeTeamId) {
      handleDeductTeamScore(activeTeamId, penaltyAmount);
    }
  };

  // 5. Dismiss full screen overlay WITHOUT clearing strikes from board
  const handleDismissStrikeOverlay = () => {
    setStrikesOverlayVisible(false);
  };

  // 6. Clear strikes from board (Reset to 0)
  const handleClearStrikes = () => {
    setStrikes(0);
    setStrikesOverlayVisible(false);
  };

  // 7. Deduct points from team score (penalty)
  const handleDeductTeamScore = (teamId: 'A' | 'B', amount: number) => {
    setTeams((prevTeams) => {
      return prevTeams.map((t) =>
        t.id === teamId ? { ...t, score: Math.max(0, t.score - amount) } : t
      ) as [Team, Team];
    });
  };

  // 8. Deduct points from pot
  const handleDeductPotScore = (amount: number) => {
    // Handled dynamically if needed or manual score adjustment
  };

  // 9. Assign pot to team
  const handleAssignPotToTeam = (teamId: 'A' | 'B') => {
    if (potScore === 0) return;
    setTeams((prevTeams) => {
      return prevTeams.map((t) =>
        t.id === teamId ? { ...t, score: t.score + potScore } : t
      ) as [Team, Team];
    });
    sound.playPointsTransfer();
  };

  // 10. Adjust team score manually (+ or -)
  const handleAdjustTeamScore = (teamId: 'A' | 'B', delta: number) => {
    setTeams((prevTeams) => {
      return prevTeams.map((t) =>
        t.id === teamId ? { ...t, score: Math.max(0, t.score + delta) } : t
      ) as [Team, Team];
    });
  };

  // 11. Update team names
  const handleUpdateTeamName = (teamId: 'A' | 'B', newName: string) => {
    setTeams((prevTeams) => {
      return prevTeams.map((t) =>
        t.id === teamId ? { ...t, name: newName } : t
      ) as [Team, Team];
    });
  };

  // 12. Reset current board state (hide answers & clear strikes)
  const handleResetBoardState = () => {
    handleHideAllAnswers();
    handleClearStrikes();
  };

  // 13. Reset entire game (scores, question index, strikes)
  const handleResetGame = () => {
    if (confirm('Are you sure you want to reset all team scores and return to Question 1?')) {
      setTeams([
        { id: 'A', name: 'TEAM 1', score: 0, color: '#3b82f6' },
        { id: 'B', name: 'TEAM 2', score: 0, color: '#ef4444' },
      ]);
      setCurrentQuestionIndex(0);
      setMultiplier(1);
      setStrikes(0);
      setStrikesOverlayVisible(false);
      setActiveTeamId(null);
      setQuestions((prev) =>
        prev.map((q) => ({
          ...q,
          answers: q.answers.map((a) => ({ ...a, revealed: false })),
        }))
      );
    }
  };

  // Keyboard Shortcuts Hook
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input or textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT'
      ) {
        return;
      }

      const key = e.key;

      // 1-8 keys reveal answers
      if (/^[1-8]$/.test(key)) {
        const num = parseInt(key, 10);
        if (currentQuestion && currentQuestion.answers[num - 1]) {
          handleRevealAnswer(currentQuestion.answers[num - 1].id);
        }
      } else if (key === 'x' || key === 'X') {
        if (e.shiftKey) {
          handleClearStrikes();
        } else {
          const nextStrikes = strikes >= 3 ? 0 : strikes + 1;
          if (nextStrikes === 0) {
            handleClearStrikes();
          } else {
            handleTriggerStrike(nextStrikes);
          }
        }
      } else if (key === 'a' || key === 'A') {
        handleAssignPotToTeam('A');
      } else if (key === 'b' || key === 'B') {
        handleAssignPotToTeam('B');
      } else if (key === 'm' || key === 'M') {
        setMultiplier((prev) => (prev === 1 ? 2 : prev === 2 ? 3 : 1));
      } else if (key === 'n' || key === 'N') {
        setCurrentQuestionIndex((prev) => Math.min(questions.length - 1, prev + 1));
      } else if (key === 'p' || key === 'P') {
        setCurrentQuestionIndex((prev) => Math.max(0, prev - 1));
      } else if (key === ' ') {
        sound.playWrong();
      } else if (key === '?') {
        setShowShortcutsModal(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestion, strikes, potScore, questions.length, autoDeductPenalty, activeTeamId, penaltyAmount]);

  return (
    <div className="min-h-screen bg-[#050b1a] font-sans antialiased selection:bg-yellow-500 selection:text-blue-950">
      {/* Top Navigation */}
      <Navbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onShowShortcuts={() => setShowShortcutsModal(true)}
        onResetGame={handleResetGame}
      />

      {/* View Router */}
      <main>
        {viewMode === 'game' && (
          <BoardView
            gameState={gameState}
            onAnswerClick={handleRevealAnswer}
            onUpdateTeamName={handleUpdateTeamName}
            onClearStrikes={handleClearStrikes}
            onDismissStrikesOverlay={handleDismissStrikeOverlay}
          />
        )}

        {viewMode === 'control' && (
          <ControlPanel
            gameState={gameState}
            autoDeductPenalty={autoDeductPenalty}
            penaltyAmount={penaltyAmount}
            onToggleAutoDeductPenalty={() => setAutoDeductPenalty(!autoDeductPenalty)}
            onSetPenaltyAmount={setPenaltyAmount}
            onDeductTeamScore={handleDeductTeamScore}
            onDeductPotScore={handleDeductPotScore}
            onRevealAnswer={handleRevealAnswer}
            onRevealAllAnswers={handleRevealAllAnswers}
            onHideAllAnswers={handleHideAllAnswers}
            onTriggerStrike={handleTriggerStrike}
            onClearStrikes={handleClearStrikes}
            onDismissStrikeOverlay={handleDismissStrikeOverlay}
            onSetTurn={setActiveTeamId}
            onAssignPotToTeam={handleAssignPotToTeam}
            onAdjustTeamScore={handleAdjustTeamScore}
            onSetMultiplier={setMultiplier}
            onSelectQuestion={setCurrentQuestionIndex}
            onResetBoardState={handleResetBoardState}
          />
        )}

        {viewMode === 'split' && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-2 bg-slate-950">
            <div className="xl:col-span-7 border-b xl:border-b-0 xl:border-r border-blue-900">
              <BoardView
                gameState={gameState}
                onAnswerClick={handleRevealAnswer}
                onUpdateTeamName={handleUpdateTeamName}
                onClearStrikes={handleClearStrikes}
                onDismissStrikesOverlay={handleDismissStrikeOverlay}
                compact={true}
              />
            </div>
            <div className="xl:col-span-5">
              <ControlPanel
                gameState={gameState}
                autoDeductPenalty={autoDeductPenalty}
                penaltyAmount={penaltyAmount}
                onToggleAutoDeductPenalty={() => setAutoDeductPenalty(!autoDeductPenalty)}
                onSetPenaltyAmount={setPenaltyAmount}
                onDeductTeamScore={handleDeductTeamScore}
                onDeductPotScore={handleDeductPotScore}
                onRevealAnswer={handleRevealAnswer}
                onRevealAllAnswers={handleRevealAllAnswers}
                onHideAllAnswers={handleHideAllAnswers}
                onTriggerStrike={handleTriggerStrike}
                onClearStrikes={handleClearStrikes}
                onDismissStrikeOverlay={handleDismissStrikeOverlay}
                onSetTurn={setActiveTeamId}
                onAssignPotToTeam={handleAssignPotToTeam}
                onAdjustTeamScore={handleAdjustTeamScore}
                onSetMultiplier={setMultiplier}
                onSelectQuestion={setCurrentQuestionIndex}
                onResetBoardState={handleResetBoardState}
              />
            </div>
          </div>
        )}

        {viewMode === 'fast_money' && <FastMoneyView />}

        {viewMode === 'questions' && (
          <QuestionManager
            questions={questions}
            onUpdateQuestions={setQuestions}
            onSelectQuestion={setCurrentQuestionIndex}
          />
        )}
      </main>

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        isOpen={showShortcutsModal}
        onClose={() => setShowShortcutsModal(false)}
      />
    </div>
  );
}
