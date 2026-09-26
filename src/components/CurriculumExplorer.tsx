import React, { useState } from 'react';
import {
  Search,
  BookOpen,
  Sparkles,
  HelpCircle,
  Layers,
  GraduationCap,
  Filter,
} from 'lucide-react';
import { CURRICULUM_DATA, CurriculumTopic } from '../data/curriculum';
import { Language } from '../types';

interface CurriculumExplorerProps {
  currentLanguage: Language;
  onSelectTopicForSolver: (topic: CurriculumTopic) => void;
  onSelectTopicForQuiz: (topic: CurriculumTopic) => void;
  isRtl: boolean;
}

export const CurriculumExplorer: React.FC<CurriculumExplorerProps> = ({
  currentLanguage,
  onSelectTopicForSolver,
  onSelectTopicForQuiz,
  isRtl,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('All');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');

  const gradeOptions = [
    'All',
    'Class 1-5 (Primary / Elementary)',
    'Class 6-8 (Middle School)',
    'Class 9-10 (Secondary / Matric / O-Level)',
    'Class 11-12 (Higher Secondary / FSc / A-Level)',
    'Undergraduate / College (BS CS / Math / Sciences)',
    'Doctoral / PhD Research Level',
  ];

  const subjectOptions = [
    'All',
    'Computer Science & Coding',
    'Mathematics',
    'Islamic Studies & History',
    'Natural Sciences (Physics/Chem/Bio)',
    'Languages & Literature (English & Urdu)',
  ];

  const filteredTopics = CURRICULUM_DATA.filter((item) => {
    const matchesSearch =
      item.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.topicUrdu && item.topicUrdu.includes(searchQuery)) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGrade = selectedGrade === 'All' || item.gradeLevel.includes(selectedGrade.split(' ')[0]);
    const matchesSubject = selectedSubject === 'All' || item.subject === selectedSubject;

    return matchesSearch && matchesGrade && matchesSubject;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Curriculum Explorer (Class 1 to PhD Research Levels)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Searchable academic syllabus covering Coding, Maths, Islamic Studies & History, Sciences, and Urdu Literature
            </p>
          </div>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by topic, keyword, or concept (e.g., Dijkstra, Seerah, Integration, دو درجی مساوات)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Grade Level Pills */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <GraduationCap className="w-3.5 h-3.5" />
            Filter by Grade Level:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {gradeOptions.map((grade) => (
              <button
                key={grade}
                onClick={() => setSelectedGrade(grade)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                  selectedGrade === grade
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {grade === 'All' ? 'All Classes (1 to PhD)' : grade.split('(')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Subject Pills */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" />
            Filter by Subject:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {subjectOptions.map((subj) => (
              <button
                key={subj}
                onClick={() => setSelectedSubject(subj)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                  selectedSubject === subj
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {subj}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Curriculum Topic Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTopics.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 hover:border-emerald-500/50 transition"
          >
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                  {item.subject}
                </span>
                <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {item.gradeLevel.split('(')[0]}
                </span>
              </div>

              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                {item.topic}
              </h3>

              {item.topicUrdu && (
                <div dir="rtl" className="font-urdu text-sm font-semibold text-emerald-700 dark:text-emerald-400 leading-relaxed">
                  {item.topicUrdu}
                </div>
              )}

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Launch buttons */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
              <span className="text-[11px] font-medium text-slate-400">
                Difficulty: {item.difficulty}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSelectTopicForQuiz(item)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800 transition"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Take Quiz</span>
                </button>

                <button
                  onClick={() => onSelectTopicForSolver(item)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Solve with AI</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredTopics.length === 0 && (
          <div className="col-span-full p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500">
            No topics matched your search criteria. Try a different query or reset filters.
          </div>
        )}
      </div>
    </div>
  );
};
