import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  BookOpen,
  Volume2,
  VolumeX,
  Copy,
  Check,
  HelpCircle,
  Lightbulb,
  AlertCircle,
  Code,
  Gauge,
  Sliders,
  ChevronDown,
  ChevronUp,
  Camera,
  ShieldCheck,
  Bookmark,
  MapPin,
  ExternalLink,
  ImageIcon,
} from 'lucide-react';
import {
  Language,
  GradeLevel,
  Subject,
  Difficulty,
  LearningPace,
  SolveResponse,
} from '../types';
import { UI_TRANSLATIONS } from '../data/curriculum';
import { COUNTRIES_AND_CURRICULA } from '../data/curricula';
import { solveQuestion } from '../services/api';
import { PhotoClickerModal } from './PhotoClickerModal';

interface SolverViewProps {
  currentLanguage: Language;
  onQuestionSolved: (query: string, subject: string, gradeLevel: string, solution: SolveResponse) => void;
  isRtl: boolean;
  currentServerNode: string;
}

export const SolverView: React.FC<SolverViewProps> = ({
  currentLanguage,
  onQuestionSolved,
  isRtl,
  currentServerNode,
}) => {
  const t = UI_TRANSLATIONS[currentLanguage] || UI_TRANSLATIONS.English;

  // Form states
  const [query, setQuery] = useState('');
  const [subject, setSubject] = useState<Subject>('Mathematics');
  const [gradeLevel, setGradeLevel] = useState<GradeLevel>('Class 9-10 (Secondary / Matric / O-Level)');
  const [difficulty, setDifficulty] = useState<Difficulty>('Standard');
  const [pace, setPace] = useState<LearningPace>('Standard');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [codeSnippet, setCodeSnippet] = useState('');

  // Country & Textbook state
  const [selectedCountryId, setSelectedCountryId] = useState('pakistan');
  const selectedCountry = COUNTRIES_AND_CURRICULA.find((c) => c.id === selectedCountryId) || COUNTRIES_AND_CURRICULA[0];
  const [selectedBoard, setSelectedBoard] = useState(selectedCountry.defaultBoard);
  const [selectedBook, setSelectedBook] = useState(selectedCountry.popularBooks[0]?.title || 'Standard Textbook');
  const [isCustomBook, setIsCustomBook] = useState(false);
  const [customBookName, setCustomBookName] = useState('');
  const [chapterOrExercise, setChapterOrExercise] = useState('');

  // Photo Clicker & OCR state
  const [isPhotoClickerOpen, setIsPhotoClickerOpen] = useState(false);
  const [analyzedPhoto, setAnalyzedPhoto] = useState<string | null>(null);

  // Results & status states
  const [loading, setLoading] = useState(false);
  const [solution, setSolution] = useState<SolveResponse | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // When country changes, sync board and books
  const handleCountryChange = (countryId: string) => {
    setSelectedCountryId(countryId);
    const country = COUNTRIES_AND_CURRICULA.find((c) => c.id === countryId);
    if (country) {
      setSelectedBoard(country.defaultBoard);
      if (country.popularBooks.length > 0) {
        setSelectedBook(country.popularBooks[0].title);
        setIsCustomBook(false);
      }
    }
  };

  // Quick preset questions
  const samplePrompts = [
    {
      label: '📐 Quadratic Formula (اردو)',
      query: 'مساوات 2x^2 + 5x - 3 = 0 کو دو درجی فارمولے سے مرحلہ وار حل کریں اور روٹس کی نوعیت بتائیں۔',
      subject: 'Mathematics' as Subject,
    },
    {
      label: '💻 Python Binary Search',
      query: 'Write an iterative binary search in Python with O(log N) complexity, step-by-step logic, and edge cases.',
      subject: 'Computer Science & Coding' as Subject,
    },
    {
      label: '🕌 میثاقِ مدینہ (Charter of Medina)',
      query: 'میثاقِ مدینہ کے اہم نکات، تاریخی پس منظر اور اسلامی ریاست کے بنیادی اصول قرآن و سیرت کے حوالوں سے بیان کریں۔',
      subject: 'Islamic Studies & History' as Subject,
    },
    {
      label: '∫ Calculus: Integration by Parts',
      query: 'Evaluate the definite integral ∫ from 0 to 1 of x * e^(2x) dx using integration by parts. Show all working.',
      subject: 'Mathematics' as Subject,
    },
    {
      label: '📖 غالب کی غزل کی تشریح',
      query: 'مرزا غالب کے شعر "ہزاروں خواہشیں ایسی کہ ہر خواہش پہ دم نکلے..." کی فکری و فنی تشریح کیجیے۔',
      subject: 'Languages & Literature (English & Urdu)' as Subject,
    },
  ];

  const handleSolve = async (overrideQuery?: string) => {
    const q = overrideQuery || query;
    if (!q.trim()) return;

    setLoading(true);
    setErrorMessage(null);
    setShowHint(false);

    const activeBook = isCustomBook ? customBookName : selectedBook;

    try {
      const result = await solveQuestion({
        query: q,
        subject,
        gradeLevel,
        language: currentLanguage,
        difficulty,
        pace,
        codeSnippet: showCodeInput ? codeSnippet : undefined,
        country: selectedCountry.name,
        board: selectedBoard,
        bookName: activeBook,
        chapterOrExercise,
        serverNode: currentServerNode,
      });

      setSolution(result);
      onQuestionSolved(q, subject, gradeLevel, result);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to solve problem.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoSolved = (result: SolveResponse, photoUrl: string) => {
    setSolution(result);
    setAnalyzedPhoto(photoUrl);
    onQuestionSolved(result.problemSummary, result.subject, gradeLevel, result);
  };

  const handleCopySolution = () => {
    if (!solution) return;
    const textToCopy = `Al-Hikmah AI Solution: ${solution.problemSummary}
Subject: ${solution.subject} (${solution.detectedLanguage})
Country / Curriculum: ${solution.countryContext || selectedCountry.name} - ${solution.bookReference || selectedBook}

STEPS:
${solution.steps.map((s) => `${s.stepNumber}. ${s.title}\n${s.explanation}\n${s.mathOrCode || ''}\nTip: ${s.tip || ''}`).join('\n\n')}

FINAL ANSWER:
${solution.finalAnswer}

KEY TAKEAWAYS:
${solution.keyTakeaways.join(', ')}`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTextToSpeech = () => {
    if (!solution) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const fullSpeech = `${solution.problemSummary}. ` +
      solution.steps.map((s) => `Step ${s.stepNumber}: ${s.title}. ${s.explanation}`).join('. ') +
      `. Final answer: ${solution.finalAnswer}`;

    const utterance = new SpeechSynthesisUtterance(fullSpeech);
    const langLower = (solution.detectedLanguage || currentLanguage).toLowerCase();
    if (langLower.includes('urdu')) {
      utterance.lang = 'ur-PK';
    } else if (langLower.includes('arabic')) {
      utterance.lang = 'ar-SA';
    } else {
      utterance.lang = 'en-US';
    }

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const solutionIsRTL = solution?.textDirection === 'rtl' || isRtl;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Control Configuration Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        {/* Top bar with Photo Clicker Button */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {t.askQuestion}
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-500/20">
                  100+ Langs • Vision AI
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Text, Math, Code, Islamic Research & Live Photo OCR from your camera or gallery
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Live Photo Clicker & OCR Button */}
            <button
              onClick={() => setIsPhotoClickerOpen(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white shadow-sm hover:opacity-95 transition"
              title="Snap photo with camera or upload from gallery to solve"
            >
              <Camera className="w-4 h-4" />
              <span>Snap / Upload Photo</span>
            </button>

            <button
              onClick={() => setShowCodeInput(!showCodeInput)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                showCodeInput
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950/50 dark:border-indigo-800 dark:text-indigo-300'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Code Context</span>
              {showCodeInput ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Country Curriculum & Book Specification Row */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
            <MapPin className="w-3.5 h-3.5 text-blue-500" />
            <span>National Curriculum & Textbook Grounding:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {/* Country Selector */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Country Curriculum:
              </label>
              <select
                value={selectedCountryId}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {COUNTRIES_AND_CURRICULA.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Board / System */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Education Board / Exam:
              </label>
              <select
                value={selectedBoard}
                onChange={(e) => setSelectedBoard(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {selectedCountry.boards.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Book Name Selector / Custom Toggle */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  Textbook Name:
                </label>
                <button
                  type="button"
                  onClick={() => setIsCustomBook(!isCustomBook)}
                  className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {isCustomBook ? 'Select Popular' : 'Custom Book'}
                </button>
              </div>

              {isCustomBook ? (
                <input
                  type="text"
                  value={customBookName}
                  onChange={(e) => setCustomBookName(e.target.value)}
                  placeholder="Type any book name..."
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              ) : (
                <select
                  value={selectedBook}
                  onChange={(e) => setSelectedBook(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {selectedCountry.popularBooks.map((bk, i) => (
                    <option key={i} value={bk.title}>
                      {bk.title}
                    </option>
                  ))}
                  <option value="General Curriculum Textbook">General Curriculum Textbook</option>
                </select>
              )}
            </div>

            {/* Chapter / Exercise Reference */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Chapter / Exercise / Question #:
              </label>
              <input
                type="text"
                value={chapterOrExercise}
                onChange={(e) => setChapterOrExercise(e.target.value)}
                placeholder="e.g. Chapter 3, Ex 3.2, Q 7"
                className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Filters & Options Grid: Grade Level, Subject, Difficulty, Pace */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Grade Level Selector */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
              {t.gradeLevel}
            </label>
            <select
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value as GradeLevel)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="Class 1-5 (Primary / Elementary)">Class 1-5 (Primary / Elementary)</option>
              <option value="Class 6-8 (Middle School)">Class 6-8 (Middle School)</option>
              <option value="Class 9-10 (Secondary / Matric / O-Level)">Class 9-10 (Matric / O-Level)</option>
              <option value="Class 11-12 (Higher Secondary / FSc / A-Level)">Class 11-12 (FSc / A-Level)</option>
              <option value="Undergraduate / College (BS CS / Math / Sciences)">Undergraduate / College (BS)</option>
              <option value="Postgraduate / Master's (MS / MPhil)">Master's / Postgraduate</option>
              <option value="Doctoral / PhD Research Level">Doctoral / PhD Research</option>
            </select>
          </div>

          {/* Subject Selector */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-teal-500" />
              {t.subject}
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value as Subject)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="Mathematics">Mathematics (ریاضی)</option>
              <option value="Computer Science & Coding">Computer Science & Coding (کمپیوٹر سائنس)</option>
              <option value="Islamic Studies & History">Islamic Studies & History (اسلامیات و تاریخ)</option>
              <option value="Natural Sciences (Physics/Chem/Bio)">Natural Sciences (سائنس)</option>
              <option value="Languages & Literature (English & Urdu)">Languages & Urdu Literature (اردو و انگریزی)</option>
              <option value="General Academics">General Academics</option>
            </select>
          </div>

          {/* Difficulty Selector */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-amber-500" />
              {t.difficulty}
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="Easy">Easy (آسان)</option>
              <option value="Standard">Standard (معیاری)</option>
              <option value="Challenging">Challenging (مشکل / ایڈوانسڈ)</option>
              <option value="Olympiad / PhD">Olympiad / PhD (اولمپیائی و تحقیقی)</option>
            </select>
          </div>

          {/* Pace Selector */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <Lightbulb className="w-3.5 h-3.5 text-indigo-500" />
              {t.pace}
            </label>
            <select
              value={pace}
              onChange={(e) => setPace(e.target.value as LearningPace)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="Foundational (Gentle)">Foundational (آہستہ اور آسان تشریح)</option>
              <option value="Standard">Standard (معمول کی رفتار)</option>
              <option value="Accelerated">Accelerated (تیز رفتار)</option>
              <option value="Deep Dive">Deep Dive (گہری تحقیق و تفصیلی ثبوت)</option>
            </select>
          </div>
        </div>

        {/* Optional Code Context Attachment */}
        {showCodeInput && (
          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Code Snippet or Mathematical Equations (Optional Context):
            </label>
            <textarea
              value={codeSnippet}
              onChange={(e) => setCodeSnippet(e.target.value)}
              rows={3}
              placeholder="def solution(): ... or \int x dx"
              className="w-full p-3 font-mono text-xs rounded-xl bg-slate-900 text-slate-100 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        )}

        {/* Query Input Box */}
        <div className="space-y-2">
          <div className="relative">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  handleSolve();
                }
              }}
              rows={3}
              placeholder={t.solvePromptPlaceholder}
              className={`w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm placeholder:text-slate-400 ${
                isRtl ? 'font-urdu text-base' : ''
              }`}
            />
          </div>

          {/* Quick preset buttons */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-semibold text-slate-400 mr-1">Quick Topics:</span>
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuery(p.query);
                  setSubject(p.subject);
                  handleSolve(p.query);
                }}
                className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-300 border border-slate-200 dark:border-slate-700 transition"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-[11px]">Academic & Islamic research filter active</span>
            </div>

            <button
              onClick={() => handleSolve()}
              disabled={loading || !query.trim()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{t.solving}</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{t.solveButton}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Solution Presentation Card */}
      {solution && (
        <div
          dir={solutionIsRTL ? 'rtl' : 'ltr'}
          className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md p-6 space-y-6 transition-all ${
            solutionIsRTL ? 'font-urdu leading-loose' : ''
          }`}
        >
          {/* Solution Header & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  {solution.subject}
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {solution.detectedLanguage}
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300">
                  {gradeLevel}
                </span>

                {solution.countryContext && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {solution.countryContext}
                  </span>
                )}

                {solution.bookReference && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 flex items-center gap-1">
                    <Bookmark className="w-3 h-3" />
                    {solution.bookReference}
                  </span>
                )}

                {analyzedPhoto && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" />
                    Solved via Photo OCR
                  </span>
                )}

                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-800 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  Verified Academic Standard
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {solution.problemSummary}
              </h3>
            </div>

            {/* Utility buttons: Audio TTS & Copy */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleTextToSpeech}
                className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
                  isSpeaking
                    ? 'bg-rose-50 border-rose-300 text-rose-600 dark:bg-rose-950/40 dark:border-rose-800'
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
                title="Listen to audio explanation"
              >
                {isSpeaking ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4" />}
                <span className="hidden sm:inline">{isSpeaking ? 'Stop Audio' : 'Listen'}</span>
              </button>

              <button
                onClick={handleCopySolution}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
                title="Copy full solution"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Analyzed Photo Preview if applicable */}
          {analyzedPhoto && (
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <img
                src={analyzedPhoto}
                alt="Analyzed problem"
                className="w-20 h-20 rounded-lg object-cover border border-slate-300 dark:border-slate-700 shadow-xs"
              />
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-0.5">
                  Input Photo Transcribed & Analyzed
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Extracted mathematical terms, diagrams, and notation from your uploaded photograph.
                </p>
              </div>
            </div>
          )}

          {/* Step-by-Step Breakdown */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              {t.stepByStepExplanation}
            </h4>

            <div className="space-y-3">
              {solution.steps.map((step) => (
                <div
                  key={step.stepNumber}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-4 space-y-2.5 transition hover:border-emerald-300 dark:hover:border-emerald-700/60"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {step.stepNumber}
                    </span>
                    <h5 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      {step.title}
                    </h5>
                  </div>

                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line pl-8">
                    {step.explanation}
                  </p>

                  {/* Math Formula or Code Snippet */}
                  {step.mathOrCode && (
                    <div className="ml-8 p-3 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto border border-slate-800" dir="ltr">
                      <pre>{step.mathOrCode}</pre>
                    </div>
                  )}

                  {/* Tip / Memory Hook */}
                  {step.tip && (
                    <div className="ml-8 flex items-start gap-2 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200">
                      <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold mr-1">Pro Tip / یاد دہانی:</span>
                        <span>{step.tip}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Academic & Islamic Citations when present */}
          {solution.citations && solution.citations.length > 0 && (
            <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 space-y-2">
              <h4 className="text-xs font-bold text-blue-900 dark:text-blue-200 flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Textbook & Scholarly Citations / مستند حوالہ جات:</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {solution.citations.map((cite, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-blue-100 dark:border-blue-800/60">
                    <div className="font-semibold text-slate-900 dark:text-white">{cite.source}</div>
                    <div className="text-[11px] text-blue-700 dark:text-blue-300 font-mono">{cite.reference}</div>
                    {cite.notes && <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{cite.notes}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Final Answer Banner */}
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
            <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" />
              {t.finalAnswer}
            </h4>
            <p className="text-sm font-semibold text-emerald-950 dark:text-emerald-100 whitespace-pre-line">
              {solution.finalAnswer}
            </p>
          </div>

          {/* Key Takeaways */}
          {solution.keyTakeaways && solution.keyTakeaways.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                {t.keyTakeaways}
              </h4>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 dark:text-slate-300">
                {solution.keyTakeaways.map((takeaway, idx) => (
                  <li key={idx}>{takeaway}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Practice Challenge & Hint */}
          {solution.practiceChallenge && (
            <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/40 dark:bg-indigo-950/20 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-indigo-600" />
                  {t.practiceChallenge}
                </h4>
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  {showHint ? t.hideHint : t.showHint}
                </button>
              </div>
              <p className="text-xs text-indigo-950 dark:text-indigo-200">
                {solution.practiceChallenge.question}
              </p>
              {showHint && (
                <div className="p-2.5 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-indigo-100 dark:border-indigo-900/50 text-xs text-indigo-800 dark:text-indigo-300 flex items-start gap-2">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Hint: </span>
                    {solution.practiceChallenge.hint}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Photo Clicker Modal */}
      <PhotoClickerModal
        isOpen={isPhotoClickerOpen}
        onClose={() => setIsPhotoClickerOpen(false)}
        onPhotoSolved={handlePhotoSolved}
        language={currentLanguage}
        gradeLevel={gradeLevel}
        subject={subject}
        country={selectedCountry.name}
        board={selectedBoard}
        bookName={isCustomBook ? customBookName : selectedBook}
        chapterOrExercise={chapterOrExercise}
        serverNode={currentServerNode}
        isRtl={isRtl}
      />
    </div>
  );
};
