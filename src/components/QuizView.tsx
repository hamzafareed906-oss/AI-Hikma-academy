import React, { useState } from 'react';
import {
  HelpCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Trophy,
} from 'lucide-react';
import { Language, GradeLevel, Subject, Difficulty, QuizData } from '../types';
import { UI_TRANSLATIONS } from '../data/curriculum';
import { generateQuiz } from '../services/api';

interface QuizViewProps {
  currentLanguage: Language;
  onQuizCompleted?: (score: number, total: number, subject: string) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ currentLanguage, onQuizCompleted }) => {
  const t = UI_TRANSLATIONS[currentLanguage] || UI_TRANSLATIONS.English;

  const [subject, setSubject] = useState<Subject>('Mathematics');
  const [topic, setTopic] = useState('Calculus & Quadratic Equations');
  const [gradeLevel, setGradeLevel] = useState<GradeLevel>('Class 9-10 (Secondary / Matric / O-Level)');
  const [difficulty, setDifficulty] = useState<Difficulty>('Standard');

  const [loading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({});
  const [showHint, setShowHint] = useState<Record<number, boolean>>({});
  const [isFinished, setIsFinished] = useState(false);

  const handleStartQuiz = async () => {
    setLoading(true);
    setIsFinished(false);
    setSelectedAnswers({});
    setShowExplanation({});
    setShowHint({});
    setCurrentQuestionIndex(0);

    try {
      const data = await generateQuiz({
        subject,
        topic,
        gradeLevel,
        difficulty,
        count: 4,
        language: currentLanguage,
      });

      setQuizData(data);
    } catch (err: any) {
      console.error('Quiz generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    if (selectedAnswers[questionId] !== undefined) return; // already answered

    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
    setShowExplanation((prev) => ({ ...prev, [questionId]: true }));
  };

  const handleFinishQuiz = () => {
    setIsFinished(true);
    if (quizData && onQuizCompleted) {
      let score = 0;
      quizData.questions.forEach((q) => {
        if (selectedAnswers[q.id] === q.correctIndex) {
          score += 1;
        }
      });
      onQuizCompleted(score, quizData.questions.length, quizData.subject);
    }
  };

  const currentQ = quizData?.questions[currentQuestionIndex];
  const isAnswered = currentQ ? selectedAnswers[currentQ.id] !== undefined : false;

  // Calculate final score
  let correctCount = 0;
  if (quizData) {
    quizData.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correctCount += 1;
      }
    });
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Quiz Generator Config Box */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Interactive Adaptive Quizzes (K-12 to PhD)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Generate self-paced assessments with instant feedback, hints, and step-by-step explanations
            </p>
          </div>
        </div>

        {/* Configuration selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Subject:
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value as Subject)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="Mathematics">Mathematics</option>
              <option value="Computer Science & Coding">Computer Science & Coding</option>
              <option value="Islamic Studies & History">Islamic Studies & History</option>
              <option value="Natural Sciences (Physics/Chem/Bio)">Natural Sciences</option>
              <option value="Languages & Literature (English & Urdu)">Languages & Urdu</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Topic:
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Dijkstra, Quadratic Equations, Seerah"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Grade Level:
            </label>
            <select
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value as GradeLevel)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="Class 1-5 (Primary / Elementary)">Primary (Class 1-5)</option>
              <option value="Class 6-8 (Middle School)">Middle School (Class 6-8)</option>
              <option value="Class 9-10 (Secondary / Matric / O-Level)">Matric / O-Level (Class 9-10)</option>
              <option value="Class 11-12 (Higher Secondary / FSc / A-Level)">FSc / A-Level (Class 11-12)</option>
              <option value="Undergraduate / College (BS CS / Math / Sciences)">Undergraduate / BS</option>
              <option value="Doctoral / PhD Research Level">PhD Research Level</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Difficulty:
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="Easy">Easy</option>
              <option value="Standard">Standard</option>
              <option value="Challenging">Challenging</option>
              <option value="Olympiad / PhD">Olympiad / PhD</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            onClick={handleStartQuiz}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-md shadow-amber-500/20 transition disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Generating Quiz...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Curriculum Quiz</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Active Quiz Card */}
      {quizData && !isFinished && currentQ && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md p-6 space-y-6">
          {/* Progress Tracker Bar */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>
              Question {currentQuestionIndex + 1} of {quizData.questions.length}
            </span>
            <div className="flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>Self-Paced Practice</span>
            </div>
          </div>

          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 transition-all duration-300"
              style={{
                width: `${((currentQuestionIndex + 1) / quizData.questions.length) * 100}%`,
              }}
            />
          </div>

          {/* Question Text */}
          <div className="space-y-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
              {quizData.topic} • {quizData.gradeLevel}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
              {currentQ.question}
            </h3>
          </div>

          {/* Multiple Choice Options */}
          <div className="space-y-2.5">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedAnswers[currentQ.id] === idx;
              const isCorrect = idx === currentQ.correctIndex;
              const isIncorrect = isSelected && !isCorrect;

              let buttonStyle = 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700';

              if (isAnswered) {
                if (isCorrect) {
                  buttonStyle = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-semibold ring-1 ring-emerald-500';
                } else if (isIncorrect) {
                  buttonStyle = 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-800 dark:text-rose-200';
                } else {
                  buttonStyle = 'opacity-50 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(currentQ.id, idx)}
                  disabled={isAnswered}
                  className={`w-full p-4 rounded-xl border text-left text-sm transition flex items-center justify-between gap-3 ${buttonStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                  </div>

                  {isAnswered && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  )}
                  {isAnswered && isIncorrect && (
                    <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Hint Section */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() =>
                setShowHint((prev) => ({ ...prev, [currentQ.id]: !prev[currentQ.id] }))
              }
              className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
            >
              <Lightbulb className="w-4 h-4" />
              <span>{showHint[currentQ.id] ? 'Hide Hint' : 'Need a Hint?'}</span>
            </button>
          </div>

          {showHint[currentQ.id] && (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200">
              <span className="font-bold">Guiding Hint: </span>
              {currentQ.hint}
            </div>
          )}

          {/* Step-by-Step Explanation when answered */}
          {isAnswered && (
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Step-by-Step Explanation:
              </span>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Next / Finish Navigation */}
          <div className="flex justify-end pt-2">
            {currentQuestionIndex < quizData.questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                disabled={!isAnswered}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 transition"
              >
                <span>Next Question</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinishQuiz}
                disabled={!isAnswered}
                className="flex items-center gap-2 px-6 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:opacity-90 disabled:opacity-50 transition"
              >
                <span>Complete Assessment</span>
                <Trophy className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Finished Summary Card */}
      {isFinished && quizData && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md p-8 text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 mx-auto flex items-center justify-center shadow-lg">
            <Trophy className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Quiz Completed!
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {quizData.title}
            </p>
          </div>

          {/* Score Badge */}
          <div className="inline-block p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {correctCount} / {quizData.questions.length}
            </div>
            <div className="text-xs font-semibold text-slate-500 mt-1">
              Accuracy: {Math.round((correctCount / quizData.questions.length) * 100)}%
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
            {correctCount === quizData.questions.length
              ? 'Outstanding performance! You have mastered this concept completely.'
              : 'Great effort! Review the step-by-step explanations or retry the quiz to solidify mastery.'}
          </p>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={handleStartQuiz}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Assessment</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
