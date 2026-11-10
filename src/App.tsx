import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ToolCard } from './components/ToolCard';
import { ToolWorkspace } from './components/ToolWorkspace';
import { AIAssistantWorkspace } from './components/AIAssistantWorkspace';
import { PricingModal } from './components/PricingModal';
import { SearchModal } from './components/SearchModal';
import { Footer } from './components/Footer';
import { PDF_TOOLS } from './data/tools';
import { ToolId, ToolCategory, Language } from './types';
import { ShieldCheck, Zap, Smartphone, Sparkles } from 'lucide-react';

export default function App() {
  const [language, setLanguage] = useState<Language>('vi');
  const [activeToolId, setActiveToolId] = useState<ToolId | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [pricingOpen, setPricingOpen] = useState<boolean>(false);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);

  // Sync dark mode class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Global Keyboard Shortcuts (Ctrl+K / Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setPricingOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectTool = (id: ToolId) => {
    setActiveToolId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoHome = () => {
    setActiveToolId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentTool = PDF_TOOLS.find((t) => t.id === activeToolId);

  // Filter tools based on category and query
  const filteredTools = PDF_TOOLS.filter((tool) => {
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCategory;

    const matchesQuery =
      tool.title.toLowerCase().includes(q) ||
      tool.titleVi.toLowerCase().includes(q) ||
      tool.shortDesc.toLowerCase().includes(q) ||
      tool.shortDescVi.toLowerCase().includes(q);

    return matchesCategory && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Bar Header */}
      <Header
        onSelectTool={handleSelectTool}
        activeToolId={activeToolId}
        onGoHome={handleGoHome}
        language={language}
        onToggleLanguage={() => setLanguage((l) => (l === 'vi' ? 'en' : 'vi'))}
        onOpenPricing={() => setPricingOpen(true)}
        onOpenSearch={() => setSearchOpen(true)}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode((d) => !d)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeToolId === 'ai-assistant' ? (
          <AIAssistantWorkspace
            language={language}
            onBack={handleGoHome}
          />
        ) : currentTool ? (
          <ToolWorkspace
            tool={currentTool}
            language={language}
            onBack={handleGoHome}
            onSelectAnotherTool={handleSelectTool}
          />
        ) : (
          /* HOMEPAGE VIEW */
          <div>
            {/* Hero Section with Search & Categories */}
            <Hero
              language={language}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />

            {/* Grid of Tools */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {filteredTools.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                  {filteredTools.map((tool) => (
                    <ToolCard
                      key={tool.id}
                      tool={tool}
                      language={language}
                      onSelect={() => handleSelectTool(tool.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <p className="text-sm text-slate-500 mb-3">
                    {language === 'vi'
                      ? `Không tìm thấy công cụ nào với từ khóa "${searchQuery}"`
                      : `No tools matching "${searchQuery}"`}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                    className="text-xs font-semibold text-red-600 hover:underline cursor-pointer"
                  >
                    {language === 'vi' ? 'Xem lại tất cả công cụ' : 'Reset filters'}
                  </button>
                </div>
              )}
            </section>

            {/* Feature Spotlight: Why Choose HLOVEPDF? */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 p-8 sm:p-12 shadow-xs">
                <div className="max-w-2xl mb-10">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400 mb-2 block">
                    {language === 'vi' ? 'Tiêu chuẩn bảo mật hàng đầu' : 'Industry Standards'}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
                    {language === 'vi'
                      ? 'Giải pháp xử lý tài liệu thông minh & tin cậy'
                      : 'The Document Suite Trusted Everywhere'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {language === 'vi'
                      ? 'Được thiết kế tối ưu hóa tốc độ, bảo mật quyền riêng tư tuyệt đối, hoạt động mượt mà trên mọi thiết bị và tích hợp trí tuệ nhân tạo thế hệ mới.'
                      : 'Engineered for maximal performance and zero-leak privacy across all browsers, smartphones, and desktop environments.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center mb-3">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
                      {language === 'vi' ? 'Bảo mật riêng tư 100%' : '100% Secure & Private'}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {language === 'vi'
                        ? 'Các thao tác ghép, tách, nén diễn ra trực tiếp ngay trên trình duyệt máy khách.'
                        : 'Core PDF manipulations run client-side with zero data persistence.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                    <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-950/40 text-red-600 flex items-center justify-center mb-3">
                      <Zap className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
                      {language === 'vi' ? 'Tốc độ siêu nhanh' : 'Lightning Processing'}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {language === 'vi'
                        ? 'Không phải chờ đợi hàng đợi server. Tải file, xử lý và tải xuống ngay lập tức.'
                        : 'No server queue wait times. Process and download documents in fractions of a second.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center mb-3">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
                      {language === 'vi' ? 'Đa nền tảng mọi lúc' : 'Cross-Platform Ready'}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {language === 'vi'
                        ? 'Hoạt động đồng bộ trên máy tính để bàn, iPad, máy tính bảng và điện thoại di động.'
                        : 'Responsive design crafted for smooth usage on mobile, tablet, and desktop viewports.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center mb-3">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
                      {language === 'vi' ? 'Trợ lý Gemini AI' : 'Gemini AI Integration'}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {language === 'vi'
                        ? 'Tóm tắt các văn bản pháp lý dài, trích xuất hạn chót công việc và dịch thuật tự động.'
                        : 'Summarize lengthy legal briefs, extract key action items, and translate documents.'}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Pricing Modal */}
      <PricingModal
        isOpen={pricingOpen}
        onClose={() => setPricingOpen(false)}
        language={language}
      />

      {/* Quick Search Modal */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectTool={handleSelectTool}
        language={language}
      />

      {/* Global Footer */}
      <Footer
        onSelectTool={handleSelectTool}
        language={language}
      />
    </div>
  );
}
