import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, 
  Upload, 
  FileText, 
  Trash2, 
  Plus, 
  RotateCw, 
  CheckCircle2, 
  Download, 
  Layers, 
  Sparkles,
  Lock,
  Type,
  FileCheck,
  AlertCircle
} from 'lucide-react';
import { PDFTool, UploadedFileItem, ProcessingResult, Language } from '../types';
import { 
  mergePDFs, 
  splitPDF, 
  compressPDF, 
  imagesToPDF, 
  rotatePDF, 
  watermarkPDF, 
  addPageNumbers, 
  signPDF, 
  organizePDF, 
  protectPDF, 
  unlockPDF, 
  createSamplePDF, 
  downloadBlob, 
  formatBytes 
} from '../utils/pdfOperations';
import { SignaturePad } from './SignaturePad';

interface ToolWorkspaceProps {
  tool: PDFTool;
  language: Language;
  onBack: () => void;
  onSelectAnotherTool: (id: any) => void;
}

export const ToolWorkspace: React.FC<ToolWorkspaceProps> = ({
  tool,
  language,
  onBack,
  onSelectAnotherTool,
}) => {
  const [files, setFiles] = useState<UploadedFileItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tool Specific Settings States
  const [splitRange, setSplitRange] = useState('1');
  const [compressLevel, setCompressLevel] = useState<'extreme' | 'recommended' | 'less'>('recommended');
  const [jpgOrientation, setJpgOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [jpgMargin, setJpgMargin] = useState<number>(20);
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.4);
  const [watermarkPos, setWatermarkPos] = useState<'center' | 'top' | 'bottom' | 'diagonal'>('diagonal');
  const [watermarkColor, setWatermarkColor] = useState('#E5322D');
  const [protectPassword, setProtectPassword] = useState('');
  const [pageNumberFormat, setPageNumberFormat] = useState<'1' | 'Page 1' | 'Page 1 of n' | 'Trang 1 / n'>('Page 1 of n');
  const [pageNumberPos, setPageNumberPos] = useState<'bottom-center' | 'bottom-right' | 'top-right'>('bottom-center');
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [signaturePos, setSignaturePos] = useState<'bottom-right' | 'bottom-left' | 'center'>('bottom-right');

  // Handle file uploads
  const handleAddFiles = (newFiles: FileList | File[]) => {
    setErrorMessage(null);
    const validFiles: UploadedFileItem[] = [];

    Array.from(newFiles).forEach((file) => {
      validFiles.push({
        id: Math.random().toString(36).substring(2, 9),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
      });
    });

    if (validFiles.length === 0) return;

    if (!tool.multiple) {
      setFiles([validFiles[0]]);
    } else {
      setFiles((prev) => [...prev, ...validFiles]);
    }
  };

  // Load 1-click sample file
  const handleLoadSample = async () => {
    try {
      setErrorMessage(null);
      const sample = await createSamplePDF('HLOVEPDF Sample Report');
      handleAddFiles([sample]);
    } catch (e: any) {
      console.error(e);
      setErrorMessage('Could not load sample PDF.');
    }
  };

  const handleRemoveFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    if (files.length <= 1) {
      setResult(null);
    }
  };

  const handleMoveFile = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= files.length) return;
    const newFiles = [...files];
    const [moved] = newFiles.splice(index, 1);
    newFiles.splice(targetIndex, 0, moved);
    setFiles(newFiles);
  };

  // Core Processing Routine
  const handleProcess = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setProgress(20);
    setErrorMessage(null);

    try {
      let finalBlob: Blob | null = null;
      let downloadName = `${tool.id}_output.pdf`;
      let originalTotalSize = files.reduce((acc, f) => acc + f.size, 0);
      let newTotalSize = originalTotalSize;
      let pageCount = 1;

      // Simulated Progress Steps
      const timer = setInterval(() => {
        setProgress((p) => (p < 85 ? p + 20 : p));
      }, 150);

      if (tool.id === 'merge') {
        const res = await mergePDFs(files.map((f) => f.file));
        finalBlob = res.blob;
        pageCount = res.pageCount;
        downloadName = `hlovepdf_merged.pdf`;
      } else if (tool.id === 'split') {
        const pages = splitRange
          .split(',')
          .map((s) => parseInt(s.trim()))
          .filter((n) => !isNaN(n));
        const res = await splitPDF(files[0].file, pages.length ? pages : [1]);
        finalBlob = res.blob;
        pageCount = res.pageCount;
        downloadName = `hlovepdf_split_pages.pdf`;
      } else if (tool.id === 'compress') {
        const res = await compressPDF(files[0].file, compressLevel);
        finalBlob = res.blob;
        originalTotalSize = res.originalSize;
        newTotalSize = res.newSize;
        pageCount = res.pageCount;
        downloadName = `hlovepdf_compressed.pdf`;
      } else if (tool.id === 'jpg-to-pdf') {
        const images = files.map((f) => ({
          file: f.file,
          orientation: jpgOrientation,
          margin: jpgMargin,
        }));
        const res = await imagesToPDF(images);
        finalBlob = res.blob;
        pageCount = res.pageCount;
        downloadName = `hlovepdf_converted.pdf`;
      } else if (tool.id === 'rotate') {
        const res = await rotatePDF(files[0].file, 90);
        finalBlob = res.blob;
        pageCount = res.pageCount;
        downloadName = `hlovepdf_rotated.pdf`;
      } else if (tool.id === 'watermark') {
        const res = await watermarkPDF(files[0].file, {
          text: watermarkText || 'CONFIDENTIAL',
          opacity: watermarkOpacity,
          fontSize: 36,
          color: watermarkColor,
          rotation: watermarkPos === 'diagonal' ? 45 : 0,
          position: watermarkPos,
        });
        finalBlob = res.blob;
        pageCount = res.pageCount;
        downloadName = `hlovepdf_watermarked.pdf`;
      } else if (tool.id === 'page-numbers') {
        const res = await addPageNumbers(files[0].file, {
          format: pageNumberFormat,
          position: pageNumberPos,
          fontSize: 11,
          startFrom: 1,
        });
        finalBlob = res.blob;
        pageCount = res.pageCount;
        downloadName = `hlovepdf_numbered.pdf`;
      } else if (tool.id === 'sign') {
        if (!signatureDataUrl) {
          throw new Error(
            language === 'vi'
              ? 'Vui lòng vẽ hoặc tải lên chữ ký trước khi xử lý.'
              : 'Please create or upload your signature before processing.'
          );
        }
        let xPercent = 65;
        let yPercent = 10;
        if (signaturePos === 'bottom-left') xPercent = 10;
        if (signaturePos === 'center') {
          xPercent = 35;
          yPercent = 40;
        }

        const res = await signPDF(files[0].file, signatureDataUrl, {
          pageIndex: 0,
          xPercent,
          yPercent,
          width: 140,
          height: 50,
        });
        finalBlob = res.blob;
        pageCount = res.pageCount;
        downloadName = `hlovepdf_signed.pdf`;
      } else if (tool.id === 'protect') {
        if (!protectPassword) {
          throw new Error(
            language === 'vi'
              ? 'Vui lòng nhập mật khẩu bảo vệ.'
              : 'Please enter a password to protect the document.'
          );
        }
        const res = await protectPDF(files[0].file, protectPassword);
        finalBlob = res.blob;
        pageCount = res.pageCount;
        downloadName = `hlovepdf_protected.pdf`;
      } else if (tool.id === 'unlock') {
        const res = await unlockPDF(files[0].file);
        finalBlob = res.blob;
        pageCount = res.pageCount;
        downloadName = `hlovepdf_unlocked.pdf`;
      } else {
        // Fallback generic PDF copy
        const res = await rotatePDF(files[0].file, 0);
        finalBlob = res.blob;
        pageCount = res.pageCount;
        downloadName = `hlovepdf_processed.pdf`;
      }

      clearInterval(timer);
      setProgress(100);

      if (finalBlob) {
        newTotalSize = finalBlob.size || newTotalSize;
        setResult({
          blob: finalBlob,
          downloadName,
          originalSize: originalTotalSize,
          newSize: newTotalSize,
          pageCount,
        });

        // Trigger joyful confetti!
        try {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 },
          });
        } catch (_) {}
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.message || 'Có lỗi xảy ra trong quá trình xử lý PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (result) {
      downloadBlob(result.blob, result.downloadName);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setResult(null);
    setProgress(0);
    setErrorMessage(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      {/* Top Breadcrumb & Action bar */}
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {language === 'vi' ? tool.titleVi : tool.title}
              </h2>
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: tool.color }}
              />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'vi' ? tool.shortDescVi : tool.shortDesc}
            </p>
          </div>
        </div>

        {files.length > 0 && !result && (
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
          >
            {language === 'vi' ? 'Chọn lại tệp khác' : 'Clear & Start Over'}
          </button>
        )}
      </div>

      {/* Error Notice */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-start gap-3 text-red-700 dark:text-red-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold">{language === 'vi' ? 'Thông báo: ' : 'Error: '}</span>
            {errorMessage}
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-red-500 hover:text-red-700 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* STATE 1: SUCCESS / DOWNLOAD SCREEN */}
      {result ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-sm animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 flex items-center justify-center mx-auto mb-5 shadow-xs">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            {language === 'vi' ? 'Tài liệu đã được xử lý thành công!' : 'Your PDF is Ready!'}
          </h3>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
            {language === 'vi'
              ? 'Tệp đã sẵn sàng tải xuống ngay bây giờ. Mọi dữ liệu đều được bảo mật an toàn.'
              : 'Your processed document is ready to download. Safe and secure.'}
          </p>

          {/* Stats Bar */}
          <div className="flex items-center justify-center gap-6 py-3 px-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl max-w-md mx-auto mb-8 border border-slate-100 dark:border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">
                {language === 'vi' ? 'Số trang' : 'Pages'}
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200 tabular-nums">
                {result.pageCount}
              </span>
            </div>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">
                {language === 'vi' ? 'Dung lượng' : 'File Size'}
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200 tabular-nums">
                {formatBytes(result.newSize)}
              </span>
            </div>
            {tool.id === 'compress' && result.originalSize > result.newSize && (
              <>
                <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">
                    {language === 'vi' ? 'Tiết kiệm' : 'Reduced'}
                  </span>
                  <span className="font-bold text-emerald-600 tabular-nums">
                    -{Math.round(((result.originalSize - result.newSize) / result.originalSize) * 100)}%
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Big Download Button */}
          <button
            type="button"
            onClick={handleDownload}
            className="w-full sm:w-auto min-w-[240px] px-8 py-3.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all inline-flex items-center justify-center gap-2 cursor-pointer mb-6"
          >
            <Download className="w-5 h-5" />
            <span>{language === 'vi' ? 'Tải xuống tệp PDF' : 'Download Processed PDF'}</span>
          </button>

          <div className="flex items-center justify-center gap-4 text-xs">
            <button
              type="button"
              onClick={handleReset}
              className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium underline"
            >
              {language === 'vi' ? 'Xử lý tệp khác' : 'Process another document'}
            </button>
            <span className="text-slate-300">·</span>
            <button
              type="button"
              onClick={() => onSelectAnotherTool('ai-assistant')}
              className="text-purple-600 dark:text-purple-400 hover:underline font-semibold flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'vi' ? 'Phân tích tài liệu này với AI' : 'Analyze with AI'}</span>
            </button>
          </div>
        </div>
      ) : files.length === 0 ? (
        /* STATE 2: EMPTY DROPZONE SCREEN */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files) {
              handleAddFiles(e.dataTransfer.files);
            }
          }}
          className={`border-2 border-dashed rounded-2xl p-10 sm:p-16 text-center transition-all ${
            isDragging
              ? 'border-red-500 bg-red-50/50 dark:bg-red-950/20 scale-[0.99]'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={tool.acceptedFiles}
            multiple={tool.multiple}
            onChange={(e) => {
              if (e.target.files) handleAddFiles(e.target.files);
            }}
            className="hidden"
          />

          {/* Big Select Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-8 py-4 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-base rounded-xl shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-3 cursor-pointer mb-5"
          >
            <Upload className="w-5 h-5" />
            <span>
              {tool.id === 'jpg-to-pdf'
                ? language === 'vi'
                  ? 'Chọn hình ảnh JPG / PNG'
                  : 'Select JPG / PNG Images'
                : language === 'vi'
                ? 'Chọn các tệp PDF'
                : 'Select PDF files'}
            </span>
          </button>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6">
            {language === 'vi'
              ? 'hoặc kéo và thả tệp của bạn vào đây'
              : 'or drop files right here'}
          </p>

          {/* Quick Sample Button */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 max-w-sm mx-auto">
            <button
              type="button"
              onClick={handleLoadSample}
              className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileCheck className="w-4 h-4 text-emerald-500" />
              <span>
                {language === 'vi'
                  ? 'Chưa có tệp sẵn? Thử với Tệp PDF Mẫu (1-Click)'
                  : 'No file ready? Try with a Sample PDF (1-Click)'}
              </span>
            </button>
          </div>
        </div>
      ) : (
        /* STATE 3: FILES LOADED & SETTINGS CONFIGURATION SCREEN */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left 2 Cols: File Manager & Previews */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {language === 'vi'
                  ? `Danh sách tệp (${files.length})`
                  : `Selected Files (${files.length})`}
              </h3>

              {tool.multiple && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{language === 'vi' ? 'Thêm tệp nữa' : 'Add more files'}</span>
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept={tool.acceptedFiles}
              multiple={tool.multiple}
              onChange={(e) => {
                if (e.target.files) handleAddFiles(e.target.files);
              }}
              className="hidden"
            />

            {/* List of File Cards */}
            <div className="space-y-3">
              {files.map((fileItem, idx) => (
                <div
                  key={fileItem.id}
                  className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${tool.color}15`, color: tool.color }}
                    >
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {fileItem.name}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span>{formatBytes(fileItem.size)}</span>
                        <span>·</span>
                        <span>#{idx + 1}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {tool.multiple && (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveFile(idx, 'up')}
                          className="px-2 py-1 text-[10px] font-bold border border-slate-200 dark:border-slate-800 rounded hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30"
                          title="Move Up"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          disabled={idx === files.length - 1}
                          onClick={() => handleMoveFile(idx, 'down')}
                          className="px-2 py-1 text-[10px] font-bold border border-slate-200 dark:border-slate-800 rounded hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30"
                          title="Move Down"
                        >
                          ↓
                        </button>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => handleRemoveFile(fileItem.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 transition-colors rounded-lg"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Special Sign PDF pad embedded directly in main area */}
            {tool.id === 'sign' && (
              <div className="mt-6">
                <SignaturePad
                  language={language}
                  onSignatureReady={(dataUrl) => setSignatureDataUrl(dataUrl)}
                />
              </div>
            )}
          </div>

          {/* Right Col: Tool Specific Settings Panel */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100 dark:border-slate-800">
              {language === 'vi' ? 'Tùy chọn xử lý' : 'Processing Options'}
            </h4>

            {/* MERGE SETTINGS */}
            {tool.id === 'merge' && (
              <div className="text-xs text-slate-600 dark:text-slate-400 space-y-2">
                <p>
                  {language === 'vi'
                    ? 'Các tệp sẽ được ghép theo đúng thứ tự hiển thị từ trên xuống dưới.'
                    : 'Files will be merged in the exact order shown on the left.'}
                </p>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-[11px]">
                  💡 {language === 'vi' ? 'Dùng mũi tên ↑ ↓ để sắp xếp vị trí tệp' : 'Use ↑ ↓ arrows to rearrange order'}
                </div>
              </div>
            )}

            {/* SPLIT SETTINGS */}
            {tool.id === 'split' && (
              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  {language === 'vi' ? 'Các trang cần trích xuất' : 'Pages to extract'}
                </label>
                <input
                  type="text"
                  value={splitRange}
                  onChange={(e) => setSplitRange(e.target.value)}
                  placeholder="e.g. 1, 2, 3"
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
                <span className="text-[11px] text-slate-400 block">
                  {language === 'vi' ? 'Ví dụ: 1 hoặc 1, 2 để lấy trang 1 và 2' : 'Example: 1 or 1, 2'}
                </span>
              </div>
            )}

            {/* COMPRESS SETTINGS */}
            {tool.id === 'compress' && (
              <div className="space-y-2">
                {[
                  {
                    id: 'extreme',
                    title: language === 'vi' ? 'Nén tối đa' : 'Extreme Compression',
                    sub: language === 'vi' ? 'Chất lượng vừa phải, giảm size tối đa' : 'Less quality, high compression',
                  },
                  {
                    id: 'recommended',
                    title: language === 'vi' ? 'Nén đề xuất (Khuyên dùng)' : 'Recommended Compression',
                    sub: language === 'vi' ? 'Chất lượng tốt, giảm size tối ưu' : 'Good quality, good compression',
                  },
                  {
                    id: 'less',
                    title: language === 'vi' ? 'Nén nhẹ' : 'Less Compression',
                    sub: language === 'vi' ? 'Giữ nguyên chất lượng cao' : 'High quality, less compression',
                  },
                ].map((lvl) => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setCompressLevel(lvl.id as any)}
                    className={`w-full text-left p-3 rounded-lg border text-xs transition-all ${
                      compressLevel === lvl.id
                        ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-bold text-slate-900 dark:text-white">{lvl.title}</div>
                    <div className="text-[11px] text-slate-500">{lvl.sub}</div>
                  </button>
                ))}
              </div>
            )}

            {/* JPG TO PDF SETTINGS */}
            {tool.id === 'jpg-to-pdf' && (
              <div className="space-y-4 text-xs">
                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                    {language === 'vi' ? 'Hướng trang' : 'Orientation'}
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {(['portrait', 'landscape'] as const).map((ori) => (
                      <button
                        key={ori}
                        type="button"
                        onClick={() => setJpgOrientation(ori)}
                        className={`py-2 px-3 rounded-lg border text-xs font-semibold capitalize ${
                          jpgOrientation === ori
                            ? 'border-red-500 bg-red-50 dark:bg-red-950/30 text-red-600'
                            : 'border-slate-200 dark:border-slate-800 text-slate-600'
                        }`}
                      >
                        {ori}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                    {language === 'vi' ? 'Lề trang' : 'Margins'}
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'None', margin: 0 },
                      { label: 'Small', margin: 20 },
                      { label: 'Big', margin: 40 },
                    ].map((m) => (
                      <button
                        key={m.label}
                        type="button"
                        onClick={() => setJpgMargin(m.margin)}
                        className={`py-2 px-2 rounded-lg border text-[11px] font-semibold ${
                          jpgMargin === m.margin
                            ? 'border-red-500 bg-red-50 dark:bg-red-950/30 text-red-600'
                            : 'border-slate-200 dark:border-slate-800 text-slate-600'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* WATERMARK SETTINGS */}
            {tool.id === 'watermark' && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    {language === 'vi' ? 'Chữ Watermark' : 'Watermark Text'}
                  </label>
                  <input
                    type="text"
                    value={watermarkText}
                    onChange={(e) => setWatermarkText(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    {language === 'vi' ? 'Vị trí' : 'Position'}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'diagonal', label: 'Diagonal 45°' },
                      { id: 'center', label: 'Center' },
                      { id: 'top', label: 'Header Top' },
                      { id: 'bottom', label: 'Footer Bottom' },
                    ].map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setWatermarkPos(p.id as any)}
                        className={`py-2 px-2 rounded-lg border text-[11px] font-medium ${
                          watermarkPos === p.id
                            ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300'
                            : 'border-slate-200 dark:border-slate-800 text-slate-600'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <span>{language === 'vi' ? 'Độ mờ đục' : 'Opacity'}</span>
                    <span>{Math.round(watermarkOpacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.05"
                    value={watermarkOpacity}
                    onChange={(e) => setWatermarkOpacity(parseFloat(e.target.value))}
                    className="w-full accent-red-600"
                  />
                </div>
              </div>
            )}

            {/* SIGN SETTINGS */}
            {tool.id === 'sign' && (
              <div className="space-y-3 text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300 block">
                  {language === 'vi' ? 'Vị trí đóng dấu chữ ký' : 'Stamp Placement'}
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'bottom-right', label: 'Bottom Right' },
                    { id: 'bottom-left', label: 'Bottom Left' },
                    { id: 'center', label: 'Center' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSignaturePos(p.id as any)}
                      className={`py-2 px-1 rounded-lg border text-[11px] font-medium text-center ${
                        signaturePos === p.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-700'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
                {signatureDataUrl && (
                  <div className="p-2 border border-slate-200 rounded-lg bg-slate-50 dark:bg-slate-800 text-center">
                    <span className="text-[10px] text-emerald-600 font-bold block mb-1">
                      ✓ {language === 'vi' ? 'Chữ ký đã sẵn sàng' : 'Signature Ready'}
                    </span>
                    <img
                      src={signatureDataUrl}
                      alt="Signature"
                      className="max-h-12 mx-auto object-contain"
                    />
                  </div>
                )}
              </div>
            )}

            {/* PAGE NUMBERS SETTINGS */}
            {tool.id === 'page-numbers' && (
              <div className="space-y-4 text-xs">
                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                    {language === 'vi' ? 'Định dạng số trang' : 'Number Format'}
                  </span>
                  <div className="space-y-1.5">
                    {(['Page 1 of n', 'Trang 1 / n', 'Page 1', '1'] as const).map((fmt) => (
                      <button
                        key={fmt}
                        type="button"
                        onClick={() => setPageNumberFormat(fmt)}
                        className={`w-full text-left p-2 rounded-lg border text-xs ${
                          pageNumberFormat === fmt
                            ? 'border-cyan-500 bg-cyan-50/50 dark:bg-cyan-950/30 text-cyan-700 dark:text-cyan-300 font-medium'
                            : 'border-slate-200 dark:border-slate-800 text-slate-600'
                        }`}
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                    {language === 'vi' ? 'Vị trí' : 'Position'}
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'bottom-center', label: 'Bottom Ctr' },
                      { id: 'bottom-right', label: 'Bottom Rgt' },
                      { id: 'top-right', label: 'Top Rgt' },
                    ].map((pos) => (
                      <button
                        key={pos.id}
                        type="button"
                        onClick={() => setPageNumberPos(pos.id as any)}
                        className={`p-2 rounded-lg border text-[10px] font-medium text-center ${
                          pageNumberPos === pos.id
                            ? 'border-cyan-500 bg-cyan-50/50 text-cyan-700 font-bold'
                            : 'border-slate-200 dark:border-slate-800 text-slate-600'
                        }`}
                      >
                        {pos.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* PROTECT SETTINGS */}
            {tool.id === 'protect' && (
              <div className="space-y-3 text-xs">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  {language === 'vi' ? 'Đặt mật khẩu bảo vệ' : 'Set Password'}
                </label>
                <input
                  type="password"
                  value={protectPassword}
                  onChange={(e) => setProtectPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
                <span className="text-[11px] text-slate-400 block">
                  {language === 'vi'
                    ? 'Tài liệu sẽ được bảo vệ bằng mã hóa chuẩn.'
                    : 'File will be locked and encrypted.'}
                </span>
              </div>
            )}

            {/* Processing Progress Bar */}
            {isProcessing && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  <span>{language === 'vi' ? 'Đang xử lý tài liệu...' : 'Processing PDF...'}</span>
                  <span className="tabular-nums">{progress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-600 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* The Big Action Button */}
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleProcess}
              className="w-full py-3.5 bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {language === 'vi'
                  ? `${tool.titleVi} ngay →`
                  : `${tool.title} now →`}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
