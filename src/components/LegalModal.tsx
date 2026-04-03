import { motion } from 'framer-motion';
import { X, Shield, FileText, Mail, ChevronLeft } from 'lucide-react';
import { useLanguage } from '../lib/i18n';

interface LegalModalProps {
  type: 'privacy' | 'terms' | 'contact';
  onClose: () => void;
}

export function LegalModal({ type, onClose }: LegalModalProps) {
  const { t } = useLanguage();

  const content: Record<'privacy' | 'terms' | 'contact', { icon: React.ReactNode; title: string; text: string; email?: string }> = {
    privacy: {
      icon: <Shield className="text-amber-500" size={24} strokeWidth={1.5} />,
      title: t('legal.privacy.title'),
      text: t('legal.privacy.text'),
    },
    terms: {
      icon: <FileText className="text-amber-500" size={24} strokeWidth={1.5} />,
      title: t('legal.terms.title'),
      text: t('legal.terms.text'),
    },
    contact: {
      icon: <Mail className="text-amber-500" size={24} strokeWidth={1.5} />,
      title: t('legal.contact.title'),
      text: t('legal.contact.text'),
      email: 'havantoancntt@gmail.com'
    }
  };

  const currentContent = content[type];

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/95 ">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative w-full max-w-lg max-h-[85vh] flex flex-col bg-[#110e0c] border border-amber-500/20 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.8)] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-amber-500/10 bg-black/40 shrink-0">
          <button 
            onClick={onClose}
            className="flex items-center gap-1 text-amber-500/80 hover:text-amber-400 transition-colors text-sm font-light tracking-wider"
          >
            <ChevronLeft size={18} />
            {t('legal.back')}
          </button>
          <span className="text-amber-200/40 text-[10px] tracking-[0.2em] uppercase font-medium">{t('legal.header')}</span>
          <div className="w-16"></div>
        </div>

        <div className="p-6 sm:p-10 overflow-y-auto flex-1 custom-scrollbar">
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-amber-900/20 flex items-center justify-center mb-6 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)] shrink-0">
              {currentContent.icon}
            </div>
            
            <h2 className="text-xl sm:text-2xl text-amber-100 font-light tracking-widest uppercase mb-8 text-center drop-shadow-md">
              {currentContent.title}
            </h2>
            
            <div className="w-full bg-black/40 border border-white/5 rounded-2xl p-6 sm:p-8">
              <p className="text-amber-100/70 text-sm sm:text-base font-light leading-relaxed text-justify">
                {currentContent.text}
              </p>
              
              {type === 'contact' && (
                <div className="mt-8 flex flex-col items-center justify-center">
                  <span className="text-white/40 text-xs uppercase tracking-widest mb-2">{t('legal.contact.email_label')}</span>
                  <a 
                    href={`mailto:${currentContent.email}`}
                    className="text-amber-400 font-mono text-lg tracking-wider hover:text-amber-300 transition-colors border-b border-amber-500/30 pb-1"
                  >
                    {currentContent.email}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
