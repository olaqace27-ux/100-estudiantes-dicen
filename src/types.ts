export interface Answer {
  id: string;
  text: string;
  points: number;
  revealed: boolean;
}

export interface Question {
  id: string;
  title: string;
  category?: string;
  answers: Answer[];
}

export interface Team {
  id: 'A' | 'B';
  name: string;
  score: number;
  color: string;
}

export type ViewMode = 'game' | 'control' | 'split' | 'fast_money' | 'questions';

export interface FastMoneyQuestion {
  id: string;
  questionText: string;
  p1Answer: string;
  p1Points: number;
  p1Revealed: boolean;
  p2Answer: string;
  p2Points: number;
  p2Revealed: boolean;
}

export interface GameState {
  questions: Question[];
  currentQuestionIndex: number;
  teams: [Team, Team];
  potScore: number;
  multiplier: 1 | 2 | 3;
  strikes: number;
  strikesOverlayVisible: boolean;
  activeTeamId: 'A' | 'B' | null;
  viewMode: ViewMode;
  soundEnabled: boolean;
  volume: number;
}
