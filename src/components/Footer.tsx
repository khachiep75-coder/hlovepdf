import React from 'react';
import { Heart, ShieldCheck, Lock, Globe } from 'lucide-react';
import { ToolId, Language } from '../types';

interface FooterProps {
  onSelectTool: (id: ToolId) => void;
  language: Language;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTool, language }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 pt-14 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 4 Column Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-12 border-b border-slate-800">
          {/* Col 1: Organize & Optimize */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
              {language === 'vi' ? 'Tổ chức & Nén' : 'Organize & Compress'}
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTool('merge')}
                  className="hover:text-white transition-colors"
                >
                  {language === 'vi' ? 'Ghép file PDF' : 'Merge PDF'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTool('split')}
                  className="hover:text-white transition-colors"
                >
                  {language === 'vi' ? 'Tách file PDF' : 'Split PDF'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTool('compress')}
                  className="hover:text-white transition-colors"
                >
                  {language === 'vi' ? 'Nén giảm dung lượng' : 'Compress PDF'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTool('rotate')}
                  className="hover:text-white transition-colors"
                >
                  {language === 'vi' ? 'Xoay hướng trang PDF' : 'Rotate PDF'}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 2: Convert */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
              {language === 'vi' ? 'Chuyển đổi hình ảnh' : 'Convert & Images'}
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTool('jpg-to-pdf')}
                  className="hover:text-white transition-colors"
                >
                  {language === 'vi' ? 'Chuyển Ảnh JPG sang PDF' : 'JPG to PDF'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTool('pdf-to-jpg')}
                  className="hover:text-white transition-colors"
                >
                  {language === 'vi' ? 'Trích xuất PDF sang JPG' : 'PDF to JPG'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTool('crop')}
                  className="hover:text-white transition-colors"
                >
                  {language === 'vi' ? 'Cắt lề & Canh chỉnh trang' : 'Crop & Trim Margins'}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Edit & Security */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
              {language === 'vi' ? 'Bảo mật & Ký tên' : 'Security & Sign'}
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTool('sign')}
                  className="hover:text-white transition-colors"
                >
                  {language === 'vi' ? 'Ký tên điện tử PDF' : 'Sign PDF Document'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTool('watermark')}
                  className="hover:text-white transition-colors"
                >
                  {language === 'vi' ? 'Đóng dấu Watermark bản quyền' : 'Watermark PDF'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTool('protect')}
                  className="hover:text-white transition-colors"
                >
                  {language === 'vi' ? 'Đặt mật khẩu khóa PDF' : 'Protect with Password'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTool('page-numbers')}
                  className="hover:text-white transition-colors"
                >
                  {language === 'vi' ? 'Đánh số trang tự động' : 'Add Page Numbers'}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: AI & Security Trust */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
              {language === 'vi' ? 'Trí tuệ nhân tạo AI' : 'Gemini AI Suite'}
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTool('ai-assistant')}
                  className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
                >
                  {language === 'vi' ? 'Trợ lý tóm tắt tài liệu AI' : 'AI Document Summarizer'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTool('ai-assistant')}
                  className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
                >
                  {language === 'vi' ? 'Trò chuyện hỏi đáp cùng PDF' : 'Chat with PDF'}
                </button>
              </li>
            </ul>

            <div className="mt-5 pt-4 border-t border-slate-800 space-y-2 text-[11px] text-slate-500">
              <div className="flex items-center gap-1.5 text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>ISO/IEC 27001 Certified Security</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <Lock className="w-3.5 h-3.5 text-red-500" />
                <span>TLS Encryption & Zero Data Storage</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div className="flex items-center gap-1">
            <span>© 2026 HLOVEPDF</span>
            <span aria-hidden="true">·</span>
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>for PDF lovers worldwide</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hover:text-slate-300 transition-colors cursor-pointer">
              {language === 'vi' ? 'Chính sách bảo mật' : 'Privacy Policy'}
            </span>
            <span aria-hidden="true">·</span>
            <span className="hover:text-slate-300 transition-colors cursor-pointer">
              {language === 'vi' ? 'Điều khoản dịch vụ' : 'Terms of Service'}
            </span>
            <span aria-hidden="true">·</span>
            <span className="hover:text-slate-300 transition-colors cursor-pointer">
              {language === 'vi' ? 'Bảo mật chuẩn ISO' : 'ISO 27001'}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
