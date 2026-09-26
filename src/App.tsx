import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { NavigationTabs, ActiveTab } from './components/NavigationTabs';
import { SolverView } from './components/SolverView';
import { CodingStudio } from './components/CodingStudio';
import { QuizView } from './components/QuizView';
import { GraderView } from './components/GraderView';
import { CurriculumExplorer } from './components/CurriculumExplorer';
import { DashboardView } from './components/DashboardView';
import { DeadlinesModal } from './components/DeadlinesModal';
import { LanguageSelectorModal } from './components/LanguageSelectorModal';
import { ServerSelectorModal } from './components/ServerSelectorModal';
import {
  Language,
  DeadlineItem,
  UserProgress,
  SolveResponse,
} from './types';
import { INITIAL_DEADLINES } from './data/curriculum';
import { EDUCATION_SERVERS, EducationServer } from './data/curricula';
import { LanguageItem } from './data/languages';

export default function App() {
  // Theme & Layout States
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('alhikmah_theme');
    return saved ? saved === 'dark' : true;
  });

  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('alhikmah_lang');
    return (saved as Language) || 'English';
  });

  const [isRtl, setIsRtl] = useState<boolean>(() => {
    const langLower = currentLanguage.toLowerCase();
    return (
      langLower.includes('urdu') ||
      langLower.includes('arabic') ||
      langLower.includes('persian') ||
      langLower.includes('pashto') ||
      langLower.includes('sindhi')
    );
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('solver');
  const [isTeacherMode, setIsTeacherMode] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  // Education AI Server Cluster State
  const [selectedServerId, setSelectedServerId] = useState<string>(() => {
    return localStorage.getItem('alhikmah_server') || 'alhikmah-cluster-southasia';
  });
  const currentServer =
    EDUCATION_SERVERS.find((s) => s.id === selectedServerId) || EDUCATION_SERVERS[0];
  const [isServerModalOpen, setIsServerModalOpen] = useState(false);

  // 100+ Languages Catalog Modal
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  // Deadlines & Notifications
  const [deadlines, setDeadlines] = useState<DeadlineItem[]>(() => {
    const saved = localStorage.getItem('alhikmah_deadlines');
    return saved ? JSON.parse(saved) : INITIAL_DEADLINES;
  });
  const [isDeadlinesModalOpen, setIsDeadlinesModalOpen] = useState(false);

  // User Progress Analytics
  const [userProgress, setUserProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('alhikmah_progress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return {
      totalSolved: 14,
      streakDays: 5,
      lastActiveDate: new Date().toISOString(),
      hoursSpent: 18.5,
      accuracyRate: 92,
      subjectMastery: {
        'Computer Science & Coding': 85,
        'Mathematics': 88,
        'Islamic Studies & History': 94,
        'Natural Sciences': 80,
        'Languages & Literature (Urdu/Eng)': 90,
      },
      history: [],
    };
  });

  // Apply dark mode class to html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('alhikmah_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('alhikmah_theme', 'light');
    }
  }, [isDarkMode]);

  // Apply RTL/LTR direction to html element
  useEffect(() => {
    document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
  }, [isRtl]);

  // Language change handler - automatically toggles RTL for RTL languages
  const handleLanguageChange = (newLang: Language) => {
    setCurrentLanguage(newLang);
    localStorage.setItem('alhikmah_lang', newLang);
    const langLower = newLang.toLowerCase();
    const shouldBeRtl =
      langLower.includes('urdu') ||
      langLower.includes('arabic') ||
      langLower.includes('persian') ||
      langLower.includes('pashto') ||
      langLower.includes('sindhi') ||
      langLower.includes('hebrew');
    setIsRtl(shouldBeRtl);
  };

  const handleSelectLanguageItem = (langItem: LanguageItem) => {
    handleLanguageChange(langItem.name);
    setIsRtl(langItem.direction === 'rtl');
  };

  const handleSelectServer = (server: EducationServer) => {
    setSelectedServerId(server.id);
    localStorage.setItem('alhikmah_server', server.id);
  };

  // Sync online/offline listener
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Save progress changes
  useEffect(() => {
    localStorage.setItem('alhikmah_progress', JSON.stringify(userProgress));
  }, [userProgress]);

  // Save deadlines changes
  useEffect(() => {
    localStorage.setItem('alhikmah_deadlines', JSON.stringify(deadlines));
  }, [deadlines]);

  // Handler when a problem is solved
  const handleQuestionSolved = (
    query: string,
    subject: string,
    gradeLevel: string,
    solution: SolveResponse
  ) => {
    setUserProgress((prev) => {
      const currentMastery = prev.subjectMastery[subject] || 75;
      const newMastery = Math.min(100, currentMastery + 2);

      return {
        ...prev,
        totalSolved: prev.totalSolved + 1,
        hoursSpent: Number((prev.hoursSpent + 0.25).toFixed(2)),
        subjectMastery: {
          ...prev.subjectMastery,
          [subject]: newMastery,
        },
        history: [
          {
            id: Date.now().toString(),
            query,
            subject,
            gradeLevel,
            timestamp: new Date().toISOString(),
            solution,
          },
          ...prev.history,
        ],
      };
    });
  };

  // Handler when quiz is completed
  const handleQuizCompleted = (score: number, total: number, subject: string) => {
    setUserProgress((prev) => {
      const percentage = Math.round((score / total) * 100);
      const newAccuracy = Math.round((prev.accuracyRate * 4 + percentage) / 5);

      return {
        ...prev,
        totalSolved: prev.totalSolved + total,
        accuracyRate: newAccuracy,
        hoursSpent: Number((prev.hoursSpent + 0.3).toFixed(2)),
      };
    });
  };

  const handleToggleDeadlineComplete = (id: string) => {
    setDeadlines((prev) =>
      prev.map((d) => (d.id === id ? { ...d, completed: !d.completed } : d))
    );
  };

  const handleAddDeadline = (item: Omit<DeadlineItem, 'id' | 'completed'>) => {
    const newItem: DeadlineItem = {
      ...item,
      id: 'dl-' + Date.now(),
      completed: false,
    };
    setDeadlines((prev) => [newItem, ...prev]);
  };

  const activeDeadlinesCount = deadlines.filter((d) => !d.completed).length;

  return (
    <div className={`min-h-screen flex flex-col ${isRtl ? 'font-urdu' : ''}`}>
      {/* Top Header */}
      <Header
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
        isRtl={isRtl}
        onToggleRtl={() => setIsRtl(!isRtl)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        isOnline={isOnline}
        activeDeadlinesCount={activeDeadlinesCount}
        onOpenDeadlines={() => setIsDeadlinesModalOpen(true)}
        isTeacherMode={isTeacherMode}
        onToggleTeacherMode={() => setIsTeacherMode(!isTeacherMode)}
        onOpenLanguagesModal={() => setIsLanguageModalOpen(true)}
        onOpenServerModal={() => setIsServerModalOpen(true)}
        currentServerName={currentServer.name}
        currentServerFlag={currentServer.flag}
      />

      {/* Navigation Tabs */}
      <NavigationTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        currentLanguage={currentLanguage}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'solver' && (
          <SolverView
            currentLanguage={currentLanguage}
            onQuestionSolved={handleQuestionSolved}
            isRtl={isRtl}
            currentServerNode={currentServer.name}
          />
        )}

        {activeTab === 'coding' && (
          <CodingStudio currentLanguage={currentLanguage} />
        )}

        {activeTab === 'quizzes' && (
          <QuizView
            currentLanguage={currentLanguage}
            onQuizCompleted={handleQuizCompleted}
          />
        )}

        {activeTab === 'grader' && (
          <GraderView
            currentLanguage={currentLanguage}
            isTeacherMode={isTeacherMode}
          />
        )}

        {activeTab === 'curriculum' && (
          <CurriculumExplorer
            currentLanguage={currentLanguage}
            onSelectTopicForSolver={() => {
              setActiveTab('solver');
            }}
            onSelectTopicForQuiz={() => {
              setActiveTab('quizzes');
            }}
            isRtl={isRtl}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardView
            progress={userProgress}
            currentLanguage={currentLanguage}
          />
        )}
      </main>

      {/* 100+ Languages Catalog Modal */}
      <LanguageSelectorModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
        selectedLanguage={currentLanguage}
        onSelectLanguage={handleSelectLanguageItem}
        isRtl={isRtl}
      />

      {/* Education AI Server Node Switcher Modal */}
      <ServerSelectorModal
        isOpen={isServerModalOpen}
        onClose={() => setIsServerModalOpen(false)}
        selectedServerId={selectedServerId}
        onSelectServer={handleSelectServer}
        isRtl={isRtl}
      />

      {/* Deadlines & Notification Modal */}
      <DeadlinesModal
        isOpen={isDeadlinesModalOpen}
        onClose={() => setIsDeadlinesModalOpen(false)}
        deadlines={deadlines}
        onToggleComplete={handleToggleDeadlineComplete}
        onAddDeadline={handleAddDeadline}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 bg-white/50 dark:bg-slate-900/50 text-xs text-slate-500 dark:text-slate-400 text-center space-y-1">
        <p>
          Al-Hikmah AI Academy • Global K-12 to PhD Multilingual Education Platform
        </p>
        <p className="text-[11px] text-slate-400">
          100+ Languages • Multimodal Photo OCR • Authentic Islamic & Academic Research • National Curricula (PTB, FBISE, Cambridge, NCERT, MoE)
        </p>
      </footer>
    </div>
  );
}
