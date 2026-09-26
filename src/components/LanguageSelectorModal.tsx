import React, { useState, useMemo } from 'react';
import { X, Search, Globe, Check, Sparkles } from 'lucide-react';
import { WORLD_LANGUAGES, POPULAR_LANGUAGE_CODES, LanguageItem } from '../data/languages';

interface LanguageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLanguage: string;
  onSelectLanguage: (lang: LanguageItem) => void;
  isRtl: boolean;
}

export const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({
  isOpen,
  onClose,
  selectedLanguage,
  onSelectLanguage,
  isRtl,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');

  const regions = useMemo(() => {
    const set = new Set<string>();
    WORLD_LANGUAGES.forEach((l) => set.add(l.region));
    return ['All', ...Array.from(set)];
  }, []);

  const popularLanguages = useMemo(() => {
    return WORLD_LANGUAGES.filter((l) => POPULAR_LANGUAGE_CODES.includes(l.code));
  }, []);

  const filteredLanguages = useMemo(() => {
    return WORLD_LANGUAGES.filter((l) => {
      const matchesSearch =
        l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.nativeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRegion = selectedRegion === 'All' || l.region === selectedRegion;
      return matchesSearch && matchesRegion;
    });
  }, [searchTerm, selectedRegion]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                100+ Global Languages Catalog
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-semibold">
                  {WORLD_LANGUAGES.length} Languages
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose any world language for problem solving, code explanations, and textbook solutions.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filters */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search 100+ languages (e.g. Urdu, Arabic, Pashto, Sindhi, French, Punjabi, German)..."
              className="w-full pl-11 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
            />
          </div>

          {/* Quick Popular Pills */}
          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Frequently Used Languages:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {popularLanguages.map((lang) => {
                const isSelected = selectedLanguage.toLowerCase() === lang.name.toLowerCase();
                return (
                  <button
                    key={lang.code}
                    onClick={() => {
                      onSelectLanguage(lang);
                      onClose();
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                    <span className="opacity-75 font-urdu font-arabic">({lang.nativeName})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Region Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {regions.map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`px-3 py-1 rounded-md whitespace-nowrap transition font-medium ${
                  selectedRegion === reg
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>
        </div>

        {/* Language Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {filteredLanguages.map((lang) => {
              const isSelected = selectedLanguage.toLowerCase() === lang.name.toLowerCase();
              return (
                <button
                  key={lang.code}
                  onClick={() => {
                    onSelectLanguage(lang);
                    onClose();
                  }}
                  className={`flex items-center justify-between p-3 rounded-xl border text-left transition ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-200 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xl flex-shrink-0">{lang.flag}</span>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold truncate text-slate-900 dark:text-slate-100">
                        {lang.name}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-urdu font-arabic truncate">
                        {lang.nativeName}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        lang.direction === 'rtl'
                          ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300'
                          : 'bg-blue-500/10 text-blue-700 dark:text-blue-300'
                      }`}
                    >
                      {lang.direction.toUpperCase()}
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                  </div>
                </button>
              );
            })}
          </div>

          {filteredLanguages.length === 0 && (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
              <Globe className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p>No language found matching "{searchTerm}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
