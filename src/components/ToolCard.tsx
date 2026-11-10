import React from 'react';
import { 
  GitMerge, 
  Scissors, 
  Minimize2, 
  Image as ImageIcon, 
  Images, 
  RotateCw, 
  Stamp, 
  Lock, 
  Unlock, 
  LayoutGrid, 
  Hash, 
  PenTool, 
  Crop, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { PDFTool, Language } from '../types';

interface ToolCardProps {
  tool: PDFTool;
  language: Language;
  onSelect: () => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, language, onSelect }) => {
  const renderIcon = () => {
    const props = { className: 'w-6 h-6', style: { color: tool.color } };
    switch (tool.id) {
      case 'merge':
        return <GitMerge {...props} />;
      case 'split':
        return <Scissors {...props} />;
      case 'compress':
        return <Minimize2 {...props} />;
      case 'pdf-to-jpg':
        return <ImageIcon {...props} />;
      case 'jpg-to-pdf':
        return <Images {...props} />;
      case 'sign':
        return <PenTool {...props} />;
      case 'watermark':
        return <Stamp {...props} />;
      case 'rotate':
        return <RotateCw {...props} />;
      case 'protect':
        return <Lock {...props} />;
      case 'unlock':
        return <Unlock {...props} />;
      case 'page-numbers':
        return <Hash {...props} />;
      case 'organize':
        return <LayoutGrid {...props} />;
      case 'crop':
        return <Crop {...props} />;
      case 'ai-assistant':
        return <Sparkles {...props} />;
      default:
        return <Sparkles {...props} />;
    }
  };

  const title = language === 'vi' ? tool.titleVi : tool.title;
  const description = language === 'vi' ? tool.shortDescVi : tool.shortDesc;

  return (
    <button
      type="button"
      onClick={onSelect}
      className="group relative flex flex-col justify-between text-left p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden"
    >
      {/* Top row: Icon container + Badge */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${tool.bgLight}`}
          >
            {renderIcon()}
          </div>

          {tool.badge && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
              {tool.badge}
            </span>
          )}

          {tool.popular && !tool.badge && (
            <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
              {language === 'vi' ? 'Phổ biến' : 'Popular'}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors mb-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
          {description}
        </p>
      </div>

      {/* Subtle Bottom Affordance */}
      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-semibold text-slate-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
        <span>{language === 'vi' ? 'Sử dụng ngay' : 'Open tool'}</span>
        <ArrowRight className="w-3.5 h-3.5 transform -translate-x-1 group-hover:translate-x-0 transition-transform" />
      </div>
    </button>
  );
};
