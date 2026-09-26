import React from 'react';
import {
  Sparkles,
  Code2,
  HelpCircle,
  FileCheck2,
  BookOpen,
  LineChart,
} from 'lucide-react';
import { Language } from '../types';
import { UI_TRANSLATIONS } from '../data/curriculum';

export type ActiveTab = 'solver' | 'coding' | 'quizzes' | 'grader' | 'curriculum' | 'dashboard';

interface NavigationTabsProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  currentLanguage: Language;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  onTabChange,
  currentLanguage,
}) => {
  const t = UI_TRANSLATIONS[currentLanguage] || UI_TRANSLATIONS.English;

  const tabs: Array<{ id: ActiveTab; label: string; icon: React.ReactNode }> = [
    { id: 'solver', label: t.tabSolver, icon: <Sparkles className="w-4 h-4" /> },
    { id: 'coding', label: t.tabCoding, icon: <Code2 className="w-4 h-4" /> },
    { id: 'quizzes', label: t.tabQuizzes, icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'grader', label: t.tabGrader, icon: <FileCheck2 className="w-4 h-4" /> },
    { id: 'curriculum', label: t.tabCurriculum, icon: <BookOpen className="w-4 h-4" /> },
    { id: 'dashboard', label: t.tabDashboard, icon: <LineChart className="w-4 h-4" /> },
  ];

  return (
    <div className="border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm sticky top-16 z-30 overflow-x-auto no-scrollbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 sm:space-x-2 py-2 min-w-max" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
