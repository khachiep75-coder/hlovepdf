import React, { useRef, useState, useEffect } from 'react';
import { PenTool, Type, Upload, RotateCcw, Check } from 'lucide-react';

interface SignaturePadProps {
  onSignatureReady: (dataUrl: string) => void;
  language: 'en' | 'vi';
}

export const SignaturePad: React.FC<SignaturePadProps> = ({ onSignatureReady, language }) => {
  const [tab, setTab] = useState<'draw' | 'type' | 'upload'>('draw');
  const [color, setColor] = useState('#111827');
  const [typedName, setTypedName] = useState('John Doe');
  const [fontFamily, setFontFamily] = useState('cursive');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High DPI support
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = color;
  }, [tab]);

  // Update stroke style when color changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = color;
  }, [color]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  // Convert Typed Name to Canvas Data URL
  const generateTypedSignature = (): string => {
    const offCanvas = document.createElement('canvas');
    offCanvas.width = 600;
    offCanvas.height = 200;
    const ctx = offCanvas.getContext('2d');
    if (!ctx) return '';

    ctx.clearRect(0, 0, 600, 200);
    ctx.fillStyle = color;
    ctx.font = `italic 54px ${fontFamily}, "Brush Script MT", cursive`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(typedName || 'Signature', 300, 100);

    return offCanvas.toDataURL('image/png');
  };

  const handleApply = () => {
    if (tab === 'draw') {
      const canvas = canvasRef.current;
      if (!canvas) return;
      onSignatureReady(canvas.toDataURL('image/png'));
    } else if (tab === 'type') {
      const dataUrl = generateTypedSignature();
      onSignatureReady(dataUrl);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        onSignatureReady(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          {language === 'vi' ? 'Tạo chữ ký của bạn' : 'Create Your Signature'}
        </h4>

        {/* Tab segmented buttons */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setTab('draw')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              tab === 'draw'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>{language === 'vi' ? 'Vẽ' : 'Draw'}</span>
          </button>

          <button
            type="button"
            onClick={() => setTab('type')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              tab === 'type'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>{language === 'vi' ? 'Gõ tên' : 'Type'}</span>
          </button>

          <button
            type="button"
            onClick={() => setTab('upload')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              tab === 'upload'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{language === 'vi' ? 'Tải ảnh' : 'Upload'}</span>
          </button>
        </div>
      </div>

      {/* Ink Color Picker */}
      {tab !== 'upload' && (
        <div className="flex items-center justify-between mb-3 text-xs text-slate-600 dark:text-slate-400">
          <span>{language === 'vi' ? 'Màu mực' : 'Ink Color'}</span>
          <div className="flex items-center gap-2">
            {[
              { label: 'Black', hex: '#111827' },
              { label: 'Blue', hex: '#1D4ED8' },
              { label: 'Red', hex: '#DC2626' },
            ].map((c) => (
              <button
                key={c.hex}
                type="button"
                onClick={() => setColor(c.hex)}
                className={`w-6 h-6 rounded-full border-2 transition-transform ${
                  color === c.hex ? 'border-red-500 scale-110' : 'border-transparent'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.label}
              />
            ))}
          </div>
        </div>
      )}

      {/* DRAW TAB */}
      {tab === 'draw' && (
        <div>
          <div className="relative border border-dashed border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50/50 dark:bg-slate-800/30 overflow-hidden">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-36 cursor-crosshair touch-none"
            />
            {!hasDrawn && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-xs text-slate-400">
                {language === 'vi' ? 'Ký tên tại đây...' : 'Draw signature here...'}
              </div>
            )}
            <div className="absolute bottom-2 right-2">
              <button
                type="button"
                onClick={clearCanvas}
                className="p-1.5 bg-white dark:bg-slate-700 hover:bg-slate-100 text-slate-600 dark:text-slate-300 rounded shadow-xs text-xs flex items-center gap-1"
                title="Clear"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{language === 'vi' ? 'Xóa lại' : 'Clear'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TYPE TAB */}
      {tab === 'type' && (
        <div className="space-y-3">
          <input
            type="text"
            value={typedName}
            onChange={(e) => setTypedName(e.target.value)}
            placeholder={language === 'vi' ? 'Nhập họ và tên...' : 'Type your full name...'}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />

          <div className="flex gap-2">
            {[
              { id: 'cursive', label: 'Script Style 1' },
              { id: 'sans-serif', label: 'Clean Modern' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFontFamily(f.id)}
                className={`flex-1 py-1.5 text-xs rounded border transition-colors ${
                  fontFamily === f.id
                    ? 'border-red-500 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 font-medium'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="h-28 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg flex items-center justify-center bg-slate-50/50 dark:bg-slate-800/30 p-4">
            <span
              style={{
                fontFamily: fontFamily === 'cursive' ? 'cursive' : 'sans-serif',
                fontStyle: 'italic',
                fontSize: '2rem',
                color: color,
              }}
            >
              {typedName || 'Your Signature'}
            </span>
          </div>
        </div>
      )}

      {/* UPLOAD TAB */}
      {tab === 'upload' && (
        <div className="border border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-6 text-center">
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleImageUpload}
            id="sig-file"
            className="hidden"
          />
          <label
            htmlFor="sig-file"
            className="cursor-pointer inline-flex flex-col items-center gap-2"
          >
            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-600 flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
              {language === 'vi' ? 'Nhấn để chọn ảnh con dấu / chữ ký PNG' : 'Click to select transparent signature image'}
            </span>
            <span className="text-[11px] text-slate-400">PNG, JPG (Max 5MB)</span>
          </label>
        </div>
      )}

      {/* Save / Apply Button */}
      {tab !== 'upload' && (
        <button
          type="button"
          onClick={handleApply}
          className="mt-4 w-full py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 shadow-xs transition-colors"
        >
          <Check className="w-4 h-4" />
          <span>{language === 'vi' ? 'Sử dụng chữ ký này' : 'Apply Signature to Document'}</span>
        </button>
      )}
    </div>
  );
};
