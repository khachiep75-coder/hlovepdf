import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowLeft, 
  Upload, 
  FileText, 
  Send, 
  Copy, 
  Check, 
  Download, 
  BookOpen, 
  CheckCircle,
  Languages,
  ListTodo,
  Bot
} from 'lucide-react';
import { Language } from '../types';
import { downloadBlob } from '../utils/pdfOperations';

interface AIAssistantWorkspaceProps {
  language: Language;
  onBack: () => void;
}

export const AIAssistantWorkspace: React.FC<AIAssistantWorkspaceProps> = ({
  language,
  onBack,
}) => {
  const [docText, setDocText] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [mode, setMode] = useState<'summarize' | 'chat' | 'translate' | 'action_items'>('summarize');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Load rich sample contract / business document
  const handleLoadSample = () => {
    const sample = `HỢP ĐỒNG HỢP TÁC CHIẾN LƯỢC & PHÁT TRIỂN PHẦN MỀM
Số: 108/2026/HĐKT-HLOVEPDF

ĐIỀU 1: CÁC BÊN THAM GIA
1. Bên A (Chủ quản): Công ty Cổ phần Công nghệ Toàn Cầu HLOVEPDF Solutions.
2. Bên B (Đối tác triển khai): Đội ngũ Chuyên gia Công nghệ Đám mây AI Studio.

ĐIỀU 2: PHẠM VI DỰ ÁN & MỤC TIÊU
- Triển khai hệ sinh thái xử lý tài liệu PDF trực tuyến bao gồm: Ghép file, Tách file, Nén tối ưu dung lượng, Chuyển đổi định dạng hình ảnh, Đóng dấu Watermark và Chữ ký số điện tử.
- Tích hợp mô hình ngôn ngữ lớn Google Gemini AI để hỗ trợ tóm tắt văn bản tự động, dịch thuật tài liệu đa ngôn ngữ và trích xuất hạn chót công việc.

ĐIỀU 3: THỜI HẠN VÀ TIẾN ĐỘ THỰC HIỆN
- Giai đoạn 1: Khởi tạo kiến trúc và lõi xử lý PDF hoàn thành trước ngày 15/11/2026.
- Giai đoạn 2: Tối ưu hóa giao diện người dùng theo chuẩn Anti-Slop Design hoàn thành trước ngày 20/11/2026.
- Giai đoạn 3: Kiểm thử tải và bàn giao chính thức vào ngày 30/11/2026.

ĐIỀU 4: BẢO MẬT DỮ LIỆU
Các bên cam kết bảo vệ toàn diện dữ liệu của khách hàng, toàn bộ quy trình xử lý tệp diễn ra trực tiếp trên trình duyệt hoặc qua kết nối TLS bảo mật cao nhất, tuyệt đối không lưu giữ văn bản nhạy cảm trái phép.`;

    setDocText(sample);
    setFileName('sample_hop_dong_kinh_te.txt');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        setDocText(content);
      }
    };
    reader.readAsText(file);
  };

  const runAnalysis = async (selectedAction = mode, customP = customPrompt) => {
    if (!docText.trim()) return;

    setIsLoading(true);
    setAnalysisResult('');

    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: docText,
          prompt: customP,
          action: selectedAction,
          language,
        }),
      });

      const data = await res.json();
      setAnalysisResult(data.result || 'Đã hoàn tất phân tích.');
    } catch (err) {
      console.error(err);
      setAnalysisResult('Lỗi kết nối máy chủ phân tích AI. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(analysisResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadAnalysis = () => {
    const blob = new Blob([analysisResult], { type: 'text/markdown;charset=utf-8' });
    downloadBlob(blob, `hlovepdf_ai_analysis_${Date.now()}.md`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {language === 'vi' ? 'Trợ lý AI Phân tích Tài liệu' : 'AI Document Assistant'}
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                Powered by Gemini
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'vi'
                ? 'Tóm tắt văn bản, hỏi đáp tương tác, dịch thuật và trích xuất điểm cốt lõi thông minh.'
                : 'Summarize, ask questions, extract action items, and translate documents with AI.'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Document Input / Upload (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {language === 'vi' ? '1. Nạp nội dung tài liệu' : '1. Input Document Text'}
              </h4>

              <button
                type="button"
                onClick={handleLoadSample}
                className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
              >
                {language === 'vi' ? 'Nạp văn bản mẫu' : 'Load Sample Contract'}
              </button>
            </div>

            {/* File upload trigger */}
            <div className="mb-3">
              <label className="block w-full border border-dashed border-slate-200 dark:border-slate-700 rounded-lg p-3 text-center cursor-pointer hover:border-purple-400 dark:hover:border-purple-600 transition-colors">
                <input
                  type="file"
                  accept=".txt,.md,.pdf,.csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="flex items-center justify-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <Upload className="w-4 h-4 text-purple-500" />
                  <span>
                    {fileName || (language === 'vi' ? 'Chọn tệp văn bản / PDF để đọc' : 'Select text or document file')}
                  </span>
                </div>
              </label>
            </div>

            {/* Textarea */}
            <textarea
              rows={12}
              value={docText}
              onChange={(e) => setDocText(e.target.value)}
              placeholder={
                language === 'vi'
                  ? 'Dán nội dung tài liệu, hợp đồng, báo cáo của bạn vào đây...'
                  : 'Paste your document text, contract clauses, or report here...'
              }
              className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />

            <div className="flex items-center justify-between mt-2 text-[11px] text-slate-400">
              <span>{docText ? `${docText.trim().split(/\s+/).length} words` : '0 words'}</span>
              {docText && (
                <button
                  type="button"
                  onClick={() => {
                    setDocText('');
                    setFileName('');
                    setAnalysisResult('');
                  }}
                  className="text-red-500 hover:underline"
                >
                  {language === 'vi' ? 'Xóa nội dung' : 'Clear'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Analysis Controls & Result (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Action Tabs */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              {language === 'vi' ? '2. Chọn chế độ AI' : '2. Select AI Mode'}
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              {[
                { id: 'summarize', labelVi: 'Tóm tắt', labelEn: 'Summarize', icon: BookOpen },
                { id: 'action_items', labelVi: 'Hạn chót & Việc', labelEn: 'Action Items', icon: ListTodo },
                { id: 'chat', labelVi: 'Hỏi đáp', labelEn: 'Q&A Chat', icon: Bot },
                { id: 'translate', labelVi: 'Dịch thuật', labelEn: 'Translate', icon: Languages },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = mode === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setMode(item.id as any);
                      runAnalysis(item.id as any);
                    }}
                    className={`p-2.5 rounded-lg border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      isActive
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{language === 'vi' ? item.labelVi : item.labelEn}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Query Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') runAnalysis('chat', customPrompt);
                }}
                placeholder={
                  language === 'vi'
                    ? 'Hoặc nhập câu hỏi bất kỳ về tài liệu...'
                    : 'Or type any specific question about the document...'
                }
                className="flex-1 px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="button"
                disabled={isLoading || !docText.trim()}
                onClick={() => runAnalysis('chat', customPrompt)}
                className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{language === 'vi' ? 'Hỏi AI' : 'Ask'}</span>
              </button>
            </div>
          </div>

          {/* Result Output Window */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  {language === 'vi' ? 'Kết quả phản hồi từ AI' : 'AI Analysis Response'}
                </h4>
              </div>

              {analysisResult && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-xs flex items-center gap-1"
                    title="Copy"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="text-[11px]">{copied ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadAnalysis}
                    className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-xs flex items-center gap-1"
                    title="Download Markdown"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="text-[11px]">Save</span>
                  </button>
                </div>
              )}
            </div>

            {isLoading ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-500 dark:text-slate-400 animate-pulse">
                  {language === 'vi'
                    ? 'AI đang đọc và tổng hợp thông tin tài liệu...'
                    : 'AI is analyzing and synthesizing document information...'}
                </p>
              </div>
            ) : analysisResult ? (
              <div className="prose prose-sm dark:prose-invert max-w-none text-xs sm:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                {analysisResult}
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <Bot className="w-8 h-8 mx-auto opacity-40 text-purple-400" />
                <p className="text-xs">
                  {language === 'vi'
                    ? 'Nạp tài liệu ở khung bên trái và bấm chọn chế độ để nhận phân tích thông minh.'
                    : 'Input document text on the left and select an AI mode to view analysis.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
