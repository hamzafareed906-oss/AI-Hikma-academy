import React from 'react';
import {
  LineChart,
  Flame,
  CheckCircle2,
  Clock,
  Award,
  BookOpen,
  Download,
  Share2,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { UserProgress, Language } from '../types';
import { INITIAL_TEACHER_FEEDBACK } from '../data/curriculum';

interface DashboardViewProps {
  progress: UserProgress;
  currentLanguage: Language;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ progress, currentLanguage }) => {
  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Welcome & Stats Cards */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <LineChart className="w-5 h-5 text-emerald-500" />
              Student Academic Progress & Learning Analytics
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Personalized performance tracking, mastery benchmarks, and teacher evaluation loops
            </p>
          </div>

          <button
            onClick={handlePrintReport}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Progress Report</span>
          </button>
        </div>

        {/* 4 Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                Problems Solved
              </span>
              <BookOpen className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
              {progress.totalSolved}
            </div>
            <div className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5">
              Across K-12 to PhD
            </div>
          </div>

          <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-orange-800 dark:text-orange-300">
                Study Streak
              </span>
              <Flame className="w-4 h-4 text-orange-500" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-2 flex items-center gap-1">
              {progress.streakDays} <span className="text-base font-normal">days</span>
            </div>
            <div className="text-[11px] text-orange-700 dark:text-orange-400 mt-0.5">
              Active daily consistency 🔥
            </div>
          </div>

          <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-teal-800 dark:text-teal-300">
                Quiz Accuracy
              </span>
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
              {progress.accuracyRate}%
            </div>
            <div className="text-[11px] text-teal-700 dark:text-teal-400 mt-0.5">
              Adaptive benchmark
            </div>
          </div>

          <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-indigo-800 dark:text-indigo-300">
                Study Hours
              </span>
              <Clock className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
              {progress.hoursSpent} <span className="text-base font-normal">hrs</span>
            </div>
            <div className="text-[11px] text-indigo-700 dark:text-indigo-400 mt-0.5">
              Self-paced mastery
            </div>
          </div>
        </div>
      </div>

      {/* Subject Mastery Progress Bars */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <Award className="w-4 h-4 text-emerald-500" />
          Subject Mastery & Proficiency Levels
        </h3>

        <div className="space-y-4">
          {Object.entries(progress.subjectMastery).map(([subj, level]) => (
            <div key={subj} className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-800 dark:text-slate-200">{subj}</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {level}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                  style={{ width: `${level}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Teacher Feedback Loop Integration Panel */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-indigo-500" />
            Instructor Feedback & Mentorship Loop
          </h3>
          <span className="text-xs text-emerald-600 font-semibold">
            All Reviews Synchronized
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {INITIAL_TEACHER_FEEDBACK.slice(0, 2).map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2 text-xs"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    {item.assignmentTitle}
                  </h4>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                    {item.teacherName}
                  </p>
                </div>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {item.rating}%
                </span>
              </div>

              <p className="text-slate-700 dark:text-slate-300 italic bg-white dark:bg-slate-900/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                "{item.notes}"
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Solved History */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-500" />
          Recent Solved Problems (Offline Archive)
        </h3>

        <div className="space-y-2.5">
          {progress.history.slice(0, 5).map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-wrap items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1 max-w-lg">
                <span className="font-semibold text-slate-900 dark:text-white text-sm line-clamp-1">
                  {item.query}
                </span>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-[11px]">
                  <span>{item.subject}</span>
                  <span>•</span>
                  <span>{item.gradeLevel}</span>
                  <span>•</span>
                  <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                  Solved Step-by-Step
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
