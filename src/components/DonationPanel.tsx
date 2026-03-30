import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, QrCode, Copy, CheckCircle2, ChevronLeft, Sparkles } from 'lucide-react';
import { useLanguage } from '../lib/i18n';

export function DonationPanel({ onClose, onConfirm }: { onClose: () => void, onConfirm: () => void }) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState<string | null>(null);
  const [amount, setAmount] = useState<number | null>(null);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const amounts = [
    { value: 50000, label: '50K' },
    { value: 100000, label: '100K' },
    { value: 200000, label: '200K' },
    { value: 500000, label: '500K' },
  ];

  // VietQR URL generation
  const bankId = 'vcb';
  const accountNo = '0501000160764';
  const accountName = 'HA VAN TOAN';
  const addInfo = 'Gieo duyen Huyen Phong';
  
  const qrUrl = `https://img.vietqr.io/image/${bankId}-${accountNo}-compact2.png?amount=${amount || ''}&addInfo=${encodeURIComponent(addInfo)}&accountName=${encodeURIComponent(accountName)}`;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative w-full max-w-md max-h-[95vh] flex flex-col bg-[#110e0c] border border-amber-500/30 rounded-3xl shadow-[0_0_50px_rgba(251,191,36,0.15)] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-amber-500/20 bg-black/40 shrink-0">
          <button 
            onClick={onClose}
            className="flex items-center gap-1 text-amber-500/80 hover:text-amber-400 transition-colors text-sm font-light tracking-wider"
          >
            <ChevronLeft size={18} />
            {t('donation.back')}
          </button>
          <span className="text-amber-200/50 text-xs tracking-widest uppercase font-medium">{t('donation.subtitle')}</span>
          <div className="w-16"></div>
        </div>

        <div className="p-5 sm:p-6 overflow-y-auto flex-1 custom-scrollbar">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-amber-900/30 flex items-center justify-center mb-3 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)] shrink-0">
              <Heart className="text-amber-500" size={20} strokeWidth={1.5} />
            </div>
            
            <h2 className="text-xl text-amber-100 font-medium tracking-widest uppercase mb-2 text-center drop-shadow-md">
              {t('donation.title')}
            </h2>
            <p className="text-amber-100/60 text-xs sm:text-sm text-center mb-6 font-light leading-relaxed px-2">
              {t('donation.desc')}
            </p>

            {/* Amount Selector */}
            <div className="w-full grid grid-cols-5 gap-2 mb-6">
              {amounts.map((a) => (
                <button
                  key={a.value}
                  onClick={() => setAmount(a.value)}
                  className={`py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 border ${
                    amount === a.value 
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.3)]' 
                      : 'bg-black/40 border-amber-500/20 text-amber-100/60 hover:border-amber-500/50 hover:text-amber-200'
                  }`}
                >
                  {a.label}
                </button>
              ))}
              <button
                onClick={() => setAmount(null)}
                className={`py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 border ${
                  amount === null 
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.3)]' 
                    : 'bg-black/40 border-amber-500/20 text-amber-100/60 hover:border-amber-500/50 hover:text-amber-200'
                }`}
              >
                {t('donation.amount.custom')}
              </button>
            </div>

            {/* QR Code Section */}
            <div className="w-full bg-gradient-to-b from-amber-500/10 to-transparent border border-amber-500/20 rounded-2xl p-4 sm:p-6 mb-6 flex flex-col items-center relative overflow-hidden group">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="text-amber-200/80 text-xs tracking-widest uppercase mb-4 flex items-center gap-2">
                <QrCode size={14} />
                {t('donation.scan_qr')}
              </div>

              <div className="bg-white p-2 sm:p-3 rounded-xl shadow-[0_0_30px_rgba(251,191,36,0.2)] mb-4 relative group-hover:shadow-[0_0_40px_rgba(251,191,36,0.4)] transition-shadow duration-500">
                <img 
                  src={qrUrl} 
                  alt="VietQR" 
                  className="w-48 h-48 sm:w-56 sm:h-56 object-contain"
                  crossOrigin="anonymous"
                />
              </div>

              <div className="w-full bg-black/40 rounded-xl p-3 border border-white/5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white/40 text-[10px] uppercase tracking-wider">{t('donation.bank')}</span>
                  <span className="text-amber-200/80 text-xs font-medium">Vietcombank</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white/40 text-[10px] uppercase tracking-wider">{t('donation.account_name')}</span>
                  <span className="text-amber-200/80 text-xs font-medium">HA VAN TOAN</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/40 text-[10px] uppercase tracking-wider">{t('donation.account_number')}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 font-mono text-sm sm:text-base tracking-wider">0501000160764</span>
                    <button 
                      onClick={() => handleCopy('0501000160764', 'vcb')}
                      className="p-1.5 bg-amber-500/10 hover:bg-amber-500/20 rounded-md text-amber-300 transition-colors"
                      title={t('donation.copy')}
                    >
                      {copied === 'vcb' ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ZaloPay Alternative (Compact) */}
            <div className="w-full flex items-center justify-between bg-black/40 border border-blue-500/20 rounded-xl p-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/30">
                  <span className="text-blue-400 font-bold text-xs">Zalo</span>
                </div>
                <div>
                  <div className="text-white/40 text-[10px] uppercase tracking-wider">{t('donation.wallet')}</div>
                  <div className="text-blue-400 font-mono text-sm tracking-wider">0974313633</div>
                </div>
              </div>
              <button 
                onClick={() => handleCopy('0974313633', 'zalo')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-300 transition-all active:scale-95"
              >
                {copied === 'zalo' ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                <span className="text-xs">{copied === 'zalo' ? t('donation.copied') : t('donation.copy')}</span>
              </button>
            </div>

            <button 
              onClick={onConfirm}
              className="w-full py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black tracking-widest uppercase text-xs sm:text-sm font-bold transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] active:scale-[0.98] shrink-0 flex items-center justify-center gap-2"
            >
              <Sparkles size={16} />
              {t('donation.confirm')}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
