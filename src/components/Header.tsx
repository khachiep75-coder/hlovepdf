import React, { useState } from 'react';
import { Heart, Search, Globe, ChevronDown, Sparkles, Layers, ShieldCheck, Moon, Sun, Menu, X } from 'lucide-react';
import { PDFTool, ToolId, Language } from '../types';
import { PDF_TOOLS } from '../data/tools';

interface HeaderProps {
  onSelectTool: (id: ToolId) => void;
  activeToolId: ToolId | null;
  onGoHome: () => void;
  language: Language;
  onToggleLanguage: () => void;
  onOpenPricing: () => void;
  onOpenSearch: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onSelectTool,
  onGoHome,
  language,
  onToggleLanguage,
  onOpenPricing,
  onOpenSearch,
  isDarkMode,
  onToggleTheme,
}) => {
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [convertDropdownOpen, setConvertDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single Brand element */}
        <div className="flex items-center gap-6 shrink-0">
          <button
            type="button"
            onClick={onGoHome}
            className="flex items-center gap-1.5 group cursor-pointer focus:outline-none"
            aria-label="HLOVEPDF Home"
          >
            <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white transition-colors">
              H
            </span>
            <span className="inline-flex items-center justify-center text-red-600 group-hover:scale-110 transition-transform">
              <Heart className="w-5 h-5 fill-red-600 text-red-600 stroke-red-600" />
            </span>
            <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white transition-colors">
              PDF
            </span>
          </button>
        </div>

        {/* Zone 2: 4-5 concise single-line nav links */}
        <nav className="hidden lg:flex items-center gap-7 text-[13px] font-semibold text-slate-700 dark:text-slate-300">
          <button
            type="button"
            onClick={() => onSelectTool('merge')}
            className="hover:text-red-600 dark:hover:text-red-400 transition-colors whitespace-nowrap shrink-0 uppercase tracking-wide cursor-pointer"
          >
            {language === 'vi' ? 'Ghép PDF' : 'Merge PDF'}
          </button>

          <button
            type="button"
            onClick={() => onSelectTool('split')}
            className="hover:text-red-600 dark:hover:text-red-400 transition-colors whitespace-nowrap shrink-0 uppercase tracking-wide cursor-pointer"
          >
            {language === 'vi' ? 'Tách PDF' : 'Split PDF'}
          </button>

          <button
            type="button"
            onClick={() => onSelectTool('compress')}
            className="hover:text-red-600 dark:hover:text-red-400 transition-colors whitespace-nowrap shrink-0 uppercase tracking-wide cursor-pointer"
          >
            {language === 'vi' ? 'Nén PDF' : 'Compress PDF'}
          </button>

          {/* Convert PDF Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setConvertDropdownOpen(true)}
            onMouseLeave={() => setConvertDropdownOpen(false)}
          >
            <button
              type="button"
              className="flex items-center gap-1 hover:text-red-600 dark:hover:text-red-400 transition-colors whitespace-nowrap shrink-0 uppercase tracking-wide cursor-pointer py-2"
            >
              <span>{language === 'vi' ? 'Chuyển đổi' : 'Convert PDF'}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </button>

            {convertDropdownOpen && (
              <div className="absolute top-full left-0 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <button
                  type="button"
                  onClick={() => {
                    onSelectTool('jpg-to-pdf');
                    setConvertDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center justify-between"
                >
                  <span className="font-semibold">{language === 'vi' ? 'Ảnh JPG sang PDF' : 'JPG to PDF'}</span>
                  <span className="text-[10px] text-amber-600 font-medium">Fast</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onSelectTool('pdf-to-jpg');
                    setConvertDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center justify-between"
                >
                  <span className="font-semibold">{language === 'vi' ? 'PDF sang hình ảnh JPG' : 'PDF to JPG'}</span>
                  <span className="text-[10px] text-amber-600 font-medium">HD</span>
                </button>
              </div>
            )}
          </div>

          {/* All PDF Tools Mega Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setToolsDropdownOpen(true)}
            onMouseLeave={() => setToolsDropdownOpen(false)}
          >
            <button
              type="button"
              className="flex items-center gap-1 hover:text-red-600 dark:hover:text-red-400 transition-colors whitespace-nowrap shrink-0 uppercase tracking-wide cursor-pointer py-2"
            >
              <span>{language === 'vi' ? 'Tất cả công cụ' : 'All PDF Tools'}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </button>

            {toolsDropdownOpen && (
              <div className="absolute top-full right-0 w-[580px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl p-5 z-50 grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-1 duration-150">
                <div>
                  <h4 className="text-[11px] font-bold tracking-wider uppercase text-slate-400 mb-2">
                    {language === 'vi' ? 'Tổ chức & Tối ưu' : 'Organize & Optimize'}
                  </h4>
                  <div className="space-y-1">
                    {PDF_TOOLS.slice(0, 7).map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          onSelectTool(t.id);
                          setToolsDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400 transition-colors flex items-center justify-between"
                      >
                        <span>{language === 'vi' ? t.titleVi : t.title}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-[11px] font-bold tracking-wider uppercase text-slate-400 mb-2">
                    {language === 'vi' ? 'Bảo mật & Trí tuệ AI' : 'Security & AI Suite'}
                  </h4>
                  <div className="space-y-1">
                    {PDF_TOOLS.slice(7).map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          onSelectTool(t.id);
                          setToolsDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400 transition-colors flex items-center justify-between"
                      >
                        <span>{language === 'vi' ? t.titleVi : t.title}</span>
                        {t.id === 'ai-assistant' && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 font-semibold">
                            AI
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Zone 3: 1 primary action cluster */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Quick Search */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={language === 'vi' ? 'Tìm kiếm công cụ (Ctrl+K)' : 'Search Tools (Ctrl+K)'}
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Language Switcher */}
          <button
            type="button"
            onClick={onToggleLanguage}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span className="uppercase">{language}</span>
          </button>

          {/* Theme Switcher */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={isDarkMode ? 'Light mode' : 'Dark mode'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Primary Action Button */}
          <button
            type="button"
            onClick={onOpenPricing}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-lg transition-all shadow-xs whitespace-nowrap cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'vi' ? 'Gói Cao Cấp' : 'Go Premium'}</span>
          </button>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-2">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            {PDF_TOOLS.slice(0, 8).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  onSelectTool(t.id);
                  setMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                {language === 'vi' ? t.titleVi : t.title}
              </button>
            ))}
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                onOpenPricing();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 text-xs font-bold text-white bg-red-600 rounded-lg flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{language === 'vi' ? 'Nâng cấp Gói Premium' : 'Go Premium'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
