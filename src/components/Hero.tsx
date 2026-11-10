import React from 'react';
import { Search, Sparkles, Shield, Zap, Lock } from 'lucide-react';
import { ToolCategory, Language } from '../types';

interface HeroProps {
  language: Language;
  selectedCategory: ToolCategory;
  onSelectCategory: (category: ToolCategory) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  language,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
}) => {
  const categories: { id: ToolCategory; labelEn: string; labelVi: string }[] = [
    { id: 'all', labelEn: 'All Tools', labelVi: 'Tất cả công cụ' },
    { id: 'organize', labelEn: 'Organize PDF', labelVi: 'Tổ chức PDF' },
    { id: 'optimize', labelEn: 'Optimize', labelVi: 'Tối ưu hóa' },
    { id: 'convert', labelEn: 'Convert', labelVi: 'Chuyển đổi' },
    { id: 'edit-security', labelEn: 'Security & Sign', labelVi: 'Bảo mật & Ký tên' },
    { id: 'ai', labelEn: 'AI Document Suite', labelVi: 'Trợ lý AI' },
  ];

  return (
    <section className="pt-10 pb-8 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto">
      {/* Editorial Title */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight text-balance mb-4">
        {language === 'vi' ? (
          <>
            Mọi công cụ bạn cần để làm việc với <span className="text-red-600">PDF</span>
          </>
        ) : (
          <>
            Every tool you need to work with <span className="text-red-600">PDFs</span> in one place
          </>
        )}
      </h1>

      {/* Subtitle */}
      <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8">
        {language === 'vi'
          ? 'Tất cả công cụ tiện ích PDF đều HOÀN TOÀN MIỄN PHÍ và dễ sử dụng! Ghép, tách, nén, chuyển đổi hình ảnh, đóng dấu, ký số và phân tích bằng AI chỉ trong vài giây.'
          : 'All the PDF tools you need at your fingertips. 100% free, browser-fast, and secure. Merge, split, compress, convert, watermark, sign, and analyze documents instantly.'}
      </p>

      {/* Trust & Security Strip */}
      <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400 mb-8">
        <div className="flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{language === 'vi' ? 'Bảo mật quyền riêng tư 100%' : '100% Client-Side Privacy'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-amber-500" />
          <span>{language === 'vi' ? 'Xử lý tốc độ cao tức thì' : 'Instant In-Browser Processing'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span>{language === 'vi' ? 'Tích hợp trợ lý Gemini AI' : 'Gemini AI Assistant Enabled'}</span>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="max-w-md mx-auto mb-8 relative">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={
              language === 'vi'
                ? 'Tìm kiếm công cụ (ví dụ: ghép file, nén, ký tên, watermark...)'
                : 'Search any PDF tool (e.g. merge, compress, sign, watermark)...'
            }
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 shadow-xs transition-all text-slate-900 dark:text-white"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Category Segmented Tabs */}
      <div className="flex items-center justify-center flex-wrap gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/60 rounded-xl max-w-fit mx-auto">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              selectedCategory === cat.id
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {language === 'vi' ? cat.labelVi : cat.labelEn}
          </button>
        ))}
      </div>
    </section>
  );
};
