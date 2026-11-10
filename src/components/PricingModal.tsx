import React, { useState } from 'react';
import { X, Check, Sparkles, Shield, Zap } from 'lucide-react';
import { Language } from '../types';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [activated, setActivated] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-[11px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400 mb-2 block">
            {language === 'vi' ? 'Linh hoạt & Minh bạch' : 'Flexible & Transparent'}
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
            {language === 'vi'
              ? 'Tăng tốc năng suất với HLOVEPDF Premium'
              : 'Boost Your Productivity with HLOVEPDF Premium'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {language === 'vi'
              ? 'Mở khóa xử lý hàng loạt không giới hạn, trích xuất văn bản OCR và tốc độ ưu tiên cao nhất.'
              : 'Unlimited batch tasks, OCR conversion, and priority cloud engines.'}
          </p>

          {/* Billing Cycle Switch */}
          <div className="mt-5 inline-flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {language === 'vi' ? 'Thanh toán hàng tháng' : 'Monthly'}
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('yearly')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                billingCycle === 'yearly'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <span>{language === 'vi' ? 'Theo năm (-33%)' : 'Yearly (Save 33%)'}</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Free */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-6 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col justify-between">
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                {language === 'vi' ? 'Gói Cơ Bản Miễn Phí' : 'Free Basic'}
              </h4>
              <p className="text-xs text-slate-500 mb-4">
                {language === 'vi' ? 'Dành cho người dùng cá nhân phổ thông' : 'For regular everyday tasks'}
              </p>
              <div className="text-2xl font-black text-slate-900 dark:text-white mb-6">
                0đ <span className="text-xs font-normal text-slate-400">/ forever</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>{language === 'vi' ? 'Toàn bộ 20+ công cụ PDF' : 'Full access to 20+ tools'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>{language === 'vi' ? 'Bảo mật 100% trên trình duyệt' : 'Client-side zero-leak security'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>{language === 'vi' ? 'Dung lượng tệp lên tới 25MB' : 'Max file size up to 25MB'}</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="mt-8 w-full py-2.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold rounded-lg transition-colors"
            >
              {language === 'vi' ? 'Đang sử dụng' : 'Current Plan'}
            </button>
          </div>

          {/* Card 2: Premium (Featured) */}
          <div className="border-2 border-red-500 rounded-xl p-6 bg-white dark:bg-slate-900 flex flex-col justify-between relative shadow-lg">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-red-600 text-white text-[10px] font-bold uppercase rounded-full">
              {language === 'vi' ? 'Phổ Biến Nhất' : 'Most Popular'}
            </span>

            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                Premium Pro
              </h4>
              <p className="text-xs text-slate-500 mb-4">
                {language === 'vi' ? 'Dành cho chuyên gia & văn phòng' : 'For busy professionals'}
              </p>
              <div className="text-3xl font-black text-slate-900 dark:text-white mb-6">
                {billingCycle === 'yearly' ? '$4' : '$7'}
                <span className="text-xs font-normal text-slate-400"> / month</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-red-500" />
                  <span>{language === 'vi' ? 'Không giới hạn dung lượng tệp (1GB+)' : 'Unlimited file size (1GB+)'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-red-500" />
                  <span>{language === 'vi' ? 'Xử lý hàng loạt cùng lúc 100 tệp' : 'Batch process up to 100 files'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-red-500" />
                  <span>{language === 'vi' ? 'Nhận diện ký tự quang học OCR' : 'Full optical character OCR'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-red-500" />
                  <span>{language === 'vi' ? 'Mở khóa toàn bộ Gemini AI Assistant' : 'Unlimited Gemini AI queries'}</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => {
                setActivated('Premium Pro');
                setTimeout(() => onClose(), 1200);
              }}
              className="mt-8 w-full py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all"
            >
              {activated === 'Premium Pro'
                ? language === 'vi' ? '✓ Đã kích hoạt!' : '✓ Activated!'
                : language === 'vi' ? 'Nâng cấp ngay' : 'Upgrade to Premium'}
            </button>
          </div>

          {/* Card 3: Business */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-6 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col justify-between">
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                Business & Teams
              </h4>
              <p className="text-xs text-slate-500 mb-4">
                {language === 'vi' ? 'Dành cho doanh nghiệp quy mô lớn' : 'For enterprise organizations'}
              </p>
              <div className="text-3xl font-black text-slate-900 dark:text-white mb-6">
                $12
                <span className="text-xs font-normal text-slate-400"> / user/mo</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>{language === 'vi' ? 'Bao gồm toàn bộ tính năng Premium' : 'All Premium Pro features'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>{language === 'vi' ? 'Quản lý tài khoản nhóm SSO' : 'Team console & SAML/SSO'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>{language === 'vi' ? 'Hỗ trợ kỹ thuật 24/7 riêng' : '24/7 dedicated support & SLA'}</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => {
                setActivated('Business');
                setTimeout(() => onClose(), 1200);
              }}
              className="mt-8 w-full py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 text-xs font-bold rounded-lg transition-colors"
            >
              {activated === 'Business'
                ? language === 'vi' ? '✓ Đã liên hệ!' : '✓ Contacted!'
                : language === 'vi' ? 'Liên hệ Doanh nghiệp' : 'Contact Sales'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
