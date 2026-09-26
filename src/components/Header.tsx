import React from 'react';
import {
  GraduationCap,
  Globe,
  Moon,
  Sun,
  Bell,
  Wifi,
  WifiOff,
  UserCheck,
  User,
  ArrowLeftRight,
} from 'lucide-react';
import { Language } from '../types';
import { UI_TRANSLATIONS } from '../data/curriculum';

interface HeaderProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  isRtl: boolean;
  onToggleRtl: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  isOnline: boolean;
  activeDeadlinesCount: number;
  onOpenDeadlines: () => void;
  isTeacherMode: boolean;
  onToggleTeacherMode: () => void;
  onOpenLanguagesModal: () => void;
  onOpenServerModal: () => void;
  currentServerName: string;
  currentServerFlag: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  onLanguageChange,
  isRtl,
  onToggleRtl,
  isDarkMode,
  onToggleDarkMode,
  isOnline,
  activeDeadlinesCount,
  onOpenDeadlines,
  isTeacherMode,
  onToggleTeacherMode,
  onOpenLanguagesModal,
  onOpenServerModal,
  currentServerName,
  currentServerFlag,
}) => {
  const t = UI_TRANSLATIONS[currentLanguage] || UI_TRANSLATIONS.English;

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div className="truncate">
            <div className="flex items-center gap-2">
              <span className={`font-bold text-lg text-slate-900 dark:text-white tracking-tight ${isRtl ? 'font-urdu text-xl' : ''}`}>
                {t.appTitle}
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                K-12 to PhD
              </span>
            </div>
            <p className="hidden md:block text-xs text-slate-500 dark:text-slate-400 truncate">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Online / Offline status badge */}
          <div
            className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
              isOnline
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300'
                : 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300'
            }`}
            title={isOnline ? 'Online with live Gemini 3.8 AI' : 'Offline caching mode active'}
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            <span>{isOnline ? t.onlineStatus : t.offlineStatus}</span>
          </div>

          {/* Teacher / Student Mode Switch */}
          <button
            onClick={onToggleTeacherMode}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition border ${
              isTeacherMode
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
            title="Toggle between Student and Teacher Feedback mode"
          >
            {isTeacherMode ? <UserCheck className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">
              {isTeacherMode ? 'Teacher Mode' : 'Student Mode'}
            </span>
          </button>

          {/* Education Server Cluster Status & Switcher */}
          <button
            onClick={onOpenServerModal}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-600 transition"
            title="Active Education AI Server Node. Click to inspect or switch cluster."
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{currentServerFlag}</span>
            <span className="max-w-[110px] truncate text-[11px] font-semibold">{currentServerName}</span>
          </button>

          {/* 100+ World Languages Modal Trigger */}
          <button
            onClick={onOpenLanguagesModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 transition shadow-xs"
            title="Browse and select from 100+ Global Languages"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="truncate max-w-[85px] sm:max-w-none">{currentLanguage}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-200/60 dark:bg-emerald-800/60 text-emerald-900 dark:text-emerald-100 font-bold">
              100+
            </span>
          </button>

          {/* RTL / LTR toggle */}
          <button
            onClick={onToggleRtl}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition border border-slate-200 dark:border-slate-700 flex items-center gap-1 text-xs font-semibold"
            title={`Current layout: ${isRtl ? 'RTL (Right-to-Left)' : 'LTR (Left-to-Right)'}. Click to toggle.`}
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span className="text-[11px] font-mono">{isRtl ? 'RTL' : 'LTR'}</span>
          </button>

          {/* Deadlines Notification Bell */}
          <button
            onClick={onOpenDeadlines}
            className="relative p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition border border-slate-200 dark:border-slate-700"
            title="Upcoming Deadlines & Homework Reminders"
          >
            <Bell className="w-4 h-4" />
            {activeDeadlinesCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow">
                {activeDeadlinesCount}
              </span>
            )}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition border border-slate-200 dark:border-slate-700"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </div>
    </header>
  );
};
