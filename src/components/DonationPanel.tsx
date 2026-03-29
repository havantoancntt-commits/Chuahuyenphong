import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, QrCode, Copy, CheckCircle2, ChevronLeft } from 'lucide-react';

export function DonationPanel({ onClose, onConfirm }: { onClose: () => void, onConfirm: () => void }) {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative w-full max-w-md max-h-[95vh] flex flex-col bg-[#1a1412] border border-[#3e2723] rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header with Back Button */}
        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-black/20 shrink-0">
          <button 
            onClick={onClose}
            className="flex items-center gap-1 text-amber-500/80 hover:text-amber-400 transition-colors text-sm font-light tracking-wider"
          >
            <ChevronLeft size={18} />
            Trở lại
          </button>
          <span className="text-amber-100/50 text-xs tracking-widest uppercase">Gieo Duyên</span>
          <div className="w-16"></div> {/* Spacer for centering */}
        </div>

        <div className="p-5 sm:p-8 overflow-y-auto flex-1 custom-scrollbar">
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-amber-900/30 flex items-center justify-center mb-4 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)] shrink-0">
              <Heart className="text-amber-500" size={24} strokeWidth={1.5} />
            </div>
            
            <h2 className="text-xl sm:text-2xl text-amber-100 font-light tracking-widest uppercase mb-2 text-center">
              Cúng Dường Tam Bảo
            </h2>
            <p className="text-white/60 text-xs sm:text-sm text-center mb-6 sm:mb-8 font-light leading-relaxed px-2">
              Phước báu phát sinh từ tâm thành kính. Mọi sự gieo duyên đều góp phần duy trì không gian thanh tịnh này.
            </p>

            <div className="w-full space-y-4 mb-6 sm:mb-8">
              {/* Vietcombank Card */}
              <div className="bg-gradient-to-br from-black/60 to-black/40 border border-amber-500/20 rounded-xl p-4 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                <div className="flex justify-between items-start mb-2 relative z-10">
                  <div className="text-xs text-white/50 uppercase tracking-wider">Ngân hàng Vietcombank</div>
                  <QrCode className="text-white/20" size={20} strokeWidth={1.5} />
                </div>
                <div className="flex items-end justify-between relative z-10">
                  <div>
                    <div className="text-amber-400 font-mono text-xl sm:text-2xl tracking-wider mb-1">0501000160764</div>
                    <div className="text-white/40 text-xs uppercase tracking-wider">Ha Van Toan</div>
                  </div>
                  <button 
                    onClick={() => handleCopy('0501000160764', 'vcb')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg text-amber-300 transition-all active:scale-95"
                  >
                    {copied === 'vcb' ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                    <span className="text-xs">{copied === 'vcb' ? 'Đã chép' : 'Sao chép'}</span>
                  </button>
                </div>
              </div>

              {/* ZaloPay Card */}
              <div className="bg-gradient-to-br from-black/60 to-black/40 border border-blue-500/20 rounded-xl p-4 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                <div className="flex justify-between items-start mb-2 relative z-10">
                  <div className="text-xs text-white/50 uppercase tracking-wider">Ví ZaloPay</div>
                  <QrCode className="text-white/20" size={20} strokeWidth={1.5} />
                </div>
                <div className="flex items-end justify-between relative z-10">
                  <div>
                    <div className="text-blue-400 font-mono text-xl sm:text-2xl tracking-wider mb-1">0974313633</div>
                    <div className="text-white/40 text-xs uppercase tracking-wider">Ha Van Toan</div>
                  </div>
                  <button 
                    onClick={() => handleCopy('0974313633', 'zalo')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-300 transition-all active:scale-95"
                  >
                    {copied === 'zalo' ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                    <span className="text-xs">{copied === 'zalo' ? 'Đã chép' : 'Sao chép'}</span>
                  </button>
                </div>
              </div>
            </div>

            <button 
              onClick={onConfirm}
              className="w-full py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white tracking-widest uppercase text-sm font-medium transition-all duration-300 shadow-[0_4px_20px_rgba(217,119,6,0.3)] hover:shadow-[0_4px_25px_rgba(217,119,6,0.5)] active:scale-[0.98] shrink-0"
            >
              Tôi đã thành tâm cúng dường
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
