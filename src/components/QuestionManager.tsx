import React from 'react';
import { Question, Answer } from '../types';
import { INITIAL_QUESTIONS } from '../data/presetQuestions';
import {
  FileText,
  Plus,
  Trash2,
  Download,
  Upload,
  RotateCcw,
  Check,
  Edit2,
  FolderOpen,
} from 'lucide-react';

interface QuestionManagerProps {
  questions: Question[];
  onUpdateQuestions: (questions: Question[]) => void;
  onSelectQuestion: (index: number) => void;
}

export const QuestionManager: React.FC<QuestionManagerProps> = ({
  questions,
  onUpdateQuestions,
  onSelectQuestion,
}) => {
  const [selectedIdx, setSelectedIdx] = React.useState<number>(0);
  const selectedQuestion = questions[selectedIdx] || null;

  // New Question state
  const [editingTitle, setEditingTitle] = React.useState('');
  const [editingCategory, setEditingCategory] = React.useState('');
  const [editingAnswers, setEditingAnswers] = React.useState<Answer[]>([]);

  React.useEffect(() => {
    if (selectedQuestion) {
      setEditingTitle(selectedQuestion.title);
      setEditingCategory(selectedQuestion.category || '');
      setEditingAnswers(JSON.parse(JSON.stringify(selectedQuestion.answers)));
    }
  }, [selectedIdx, questions]);

  // Save changes to currently selected question
  const handleSaveQuestion = () => {
    if (!editingTitle.trim()) return;
    const updated = [...questions];
    updated[selectedIdx] = {
      ...updated[selectedIdx],
      title: editingTitle,
      category: editingCategory,
      answers: editingAnswers,
    };
    onUpdateQuestions(updated);
    alert('Question updated successfully!');
  };

  // Add new question
  const handleAddNewQuestion = () => {
    const newQ: Question = {
      id: 'q_' + Date.now(),
      title: 'We asked 100 people: New Question...',
      category: 'General',
      answers: [
        { id: 'ans_1', text: 'Top Answer', points: 40, revealed: false },
        { id: 'ans_2', text: 'Second Answer', points: 30, revealed: false },
        { id: 'ans_3', text: 'Third Answer', points: 20, revealed: false },
        { id: 'ans_4', text: 'Fourth Answer', points: 10, revealed: false },
      ],
    };
    const updated = [...questions, newQ];
    onUpdateQuestions(updated);
    setSelectedIdx(updated.length - 1);
  };

  // Delete question
  const handleDeleteQuestion = (idx: number) => {
    if (questions.length <= 1) {
      alert('You must have at least one question in the game!');
      return;
    }
    if (confirm('Are you sure you want to delete this question?')) {
      const updated = questions.filter((_, i) => i !== idx);
      onUpdateQuestions(updated);
      setSelectedIdx(Math.max(0, selectedIdx - 1));
    }
  };

  // Reset to default preset questions
  const handleResetToDefaults = () => {
    if (confirm('Reset to default preset questions? Custom questions will be replaced.')) {
      onUpdateQuestions(INITIAL_QUESTIONS);
      setSelectedIdx(0);
    }
  };

  // Export JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(questions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `family_feud_questions_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].title && parsed[0].answers) {
            onUpdateQuestions(parsed);
            setSelectedIdx(0);
            alert('Questions imported successfully!');
          } else {
            alert('Invalid JSON file format. Make sure it matches the Family Feud questions schema.');
          }
        } catch (err) {
          alert('Error parsing JSON file.');
        }
      };
    }
  };

  const handleUpdateAnswerField = (aIdx: number, field: keyof Answer, val: any) => {
    const copy = [...editingAnswers];
    copy[aIdx] = { ...copy[aIdx], [field]: val };
    setEditingAnswers(copy);
  };

  const handleAddAnswerRow = () => {
    if (editingAnswers.length >= 8) {
      alert('Maximum 8 answers per question supported.');
      return;
    }
    setEditingAnswers([
      ...editingAnswers,
      { id: 'ans_' + Date.now(), text: 'New Answer', points: 5, revealed: false },
    ]);
  };

  const handleDeleteAnswerRow = (aIdx: number) => {
    if (editingAnswers.length <= 1) {
      alert('A question must have at least one answer.');
      return;
    }
    setEditingAnswers(editingAnswers.filter((_, i) => i !== aIdx));
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#050b1a] text-white p-4 sm:p-6 max-w-7xl mx-auto flex flex-col gap-6">
      {/* Top Banner */}
      <div className="bg-blue-950 border-2 border-blue-600 rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-yellow-500 p-2.5 rounded-xl shadow">
            <FileText className="w-6 h-6 text-blue-950" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
              QUESTION MANAGER
            </h2>
            <p className="text-xs text-blue-200 font-bold uppercase">
              Create, edit, import or export your survey questions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleAddNewQuestion}
            className="px-3.5 py-2 bg-yellow-500 hover:bg-yellow-400 text-blue-950 rounded-xl text-xs font-black uppercase shadow transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Question
          </button>

          <button
            onClick={handleExportJSON}
            className="px-3 py-2 bg-blue-900 hover:bg-blue-800 text-blue-100 rounded-xl text-xs font-bold transition flex items-center gap-1 border border-blue-700"
          >
            <Download className="w-4 h-4" /> Export JSON
          </button>

          <label className="px-3 py-2 bg-blue-900 hover:bg-blue-800 text-blue-100 rounded-xl text-xs font-bold transition flex items-center gap-1 border border-blue-700 cursor-pointer">
            <Upload className="w-4 h-4" /> Import JSON
            <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
          </label>

          <button
            onClick={handleResetToDefaults}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition flex items-center gap-1 border border-slate-700"
            title="Reset to default questions"
          >
            <RotateCcw className="w-4 h-4" /> Reset Preset
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Questions List (4 cols) */}
        <div className="lg:col-span-4 bg-blue-950/80 border-2 border-blue-800 rounded-2xl p-4 shadow-xl flex flex-col max-h-[650px]">
          <h3 className="font-black text-sm text-yellow-300 uppercase tracking-wider mb-3">
            Question List ({questions.length})
          </h3>
          <div className="space-y-2 overflow-y-auto pr-1 flex-1">
            {questions.map((q, idx) => (
              <div
                key={q.id}
                onClick={() => setSelectedIdx(idx)}
                className={`p-3 rounded-xl border-2 cursor-pointer transition flex items-center justify-between gap-2 ${
                  selectedIdx === idx
                    ? 'bg-yellow-500 text-blue-950 border-yellow-300 shadow'
                    : 'bg-slate-950 text-white border-blue-900 hover:border-blue-700'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-black uppercase tracking-wider block opacity-80">
                    Question {idx + 1}
                  </span>
                  <p className="font-black text-xs sm:text-sm truncate uppercase">
                    {q.title}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteQuestion(idx);
                  }}
                  className="p-1 hover:bg-red-600 hover:text-white rounded text-red-400 transition"
                  title="Delete question"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Question Editor (8 cols) */}
        {selectedQuestion && (
          <div className="lg:col-span-8 bg-blue-950/90 border-2 border-blue-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-blue-900">
              <h3 className="font-black text-base text-yellow-300 uppercase tracking-wider">
                Editing Question #{selectedIdx + 1}
              </h3>
              <button
                onClick={handleSaveQuestion}
                className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white font-black text-xs uppercase rounded-xl shadow transition flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" /> Save Question
              </button>
            </div>

            {/* Title & Category Inputs */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-black text-blue-200 uppercase tracking-wider block mb-1">
                  Question Title:
                </label>
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  className="w-full bg-slate-950 border-2 border-blue-700 text-white text-sm font-bold p-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 uppercase"
                />
              </div>

              <div>
                <label className="text-xs font-black text-blue-200 uppercase tracking-wider block mb-1">
                  Category (Optional):
                </label>
                <input
                  type="text"
                  value={editingCategory}
                  onChange={(e) => setEditingCategory(e.target.value)}
                  className="w-full bg-slate-950 border-2 border-blue-700 text-white text-xs font-bold p-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
            </div>

            {/* Answers Editor */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-yellow-300 uppercase tracking-wider">
                  Survey Answers ({editingAnswers.length} of max 8):
                </label>
                <button
                  onClick={handleAddAnswerRow}
                  className="px-2.5 py-1 bg-blue-900 hover:bg-blue-800 text-yellow-300 text-xs font-bold rounded-lg border border-blue-700 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Answer Row
                </button>
              </div>

              <div className="space-y-2">
                {editingAnswers.map((ans, aIdx) => (
                  <div
                    key={ans.id || aIdx}
                    className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-blue-900"
                  >
                    <span className="w-6 h-6 rounded bg-blue-900 text-yellow-300 font-black text-xs flex items-center justify-center flex-shrink-0">
                      {aIdx + 1}
                    </span>
                    <input
                      type="text"
                      value={ans.text}
                      onChange={(e) => handleUpdateAnswerField(aIdx, 'text', e.target.value)}
                      placeholder="Answer text..."
                      className="flex-1 bg-blue-950 text-white font-bold text-xs p-2 rounded-lg border border-blue-800 focus:outline-none focus:ring-1 focus:ring-yellow-400 uppercase"
                    />
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-blue-300 font-bold uppercase">Pts:</span>
                      <input
                        type="number"
                        value={ans.points}
                        onChange={(e) =>
                          handleUpdateAnswerField(aIdx, 'points', Number(e.target.value))
                        }
                        className="w-16 bg-blue-950 text-yellow-300 font-mono font-black text-xs text-center p-2 rounded-lg border border-blue-800"
                      />
                    </div>
                    <button
                      onClick={() => handleDeleteAnswerRow(aIdx)}
                      className="p-2 text-red-400 hover:text-white hover:bg-red-950 rounded-lg transition"
                      title="Delete answer row"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
