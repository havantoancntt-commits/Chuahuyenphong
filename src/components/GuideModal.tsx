import { motion } from 'framer-motion';
import { X, Heart, Flame, User, BookOpen, Sparkles } from 'lucide-react';
import { useLanguage } from '../lib/i18n';

interface GuideModalProps {
  onClose: () => void;
}

export function GuideModal({ onClose }: GuideModalProps) {
  const { t } = useLanguage();
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto custom-scrollbar bg-zinc-900/90 border border-amber-500/30 rounded-3xl shadow-[0_0_50px_rgba(251,191,36,0.1)] text-amber-50"
      >
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 flex justify-between items-center p-6 border-b border-amber-500/20 bg-zinc-900/95 backdrop-blur-sm">
          <h2 className="text-xl sm:text-2xl font-medium tracking-wider text-amber-200 flex items-center gap-3">
            <BookOpen size={24} className="text-amber-400" />
            {t('guide.title')}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 transition-colors text-amber-200/70 hover:text-amber-200"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-8 font-light leading-relaxed text-sm sm:text-base">
          
          {/* Section 1: Tâm Thế */}
          <section className="space-y-3">
            <h3 className="text-lg font-medium text-amber-300 flex items-center gap-2">
              <Heart size={20} className="text-rose-400" />
              {t('guide.mindset.title')}
            </h3>
            <p className="text-amber-100/80 pl-7">
              {t('guide.mindset.desc')}
            </p>
          </section>

          {/* Section 2: Dâng Hương */}
          <section className="space-y-3">
            <h3 className="text-lg font-medium text-amber-300 flex items-center gap-2">
              <Flame size={20} className="text-orange-400" />
              {t('guide.incense.title')}
            </h3>
            <div className="text-amber-100/80 pl-7 space-y-2">
              <p>{t('guide.incense.desc1')}</p>
              <ul className="list-disc list-inside space-y-1 ml-2 text-amber-200/70">
                <li><strong className="text-amber-200 font-normal">{t('guide.incense.point1.title')}</strong> {t('guide.incense.point1.desc')}</li>
                <li><strong className="text-amber-200 font-normal">{t('guide.incense.point2.title')}</strong> {t('guide.incense.point2.desc')}</li>
                <li><strong className="text-amber-200 font-normal">{t('guide.incense.point3.title')}</strong> {t('guide.incense.point3.desc')}</li>
              </ul>
              <p className="pt-2"><strong>{t('guide.incense.how.title')}</strong> {t('guide.incense.how.desc')}</p>
            </div>
          </section>

          {/* Section 3: Lễ Bái */}
          <section className="space-y-3">
            <h3 className="text-lg font-medium text-amber-300 flex items-center gap-2">
              <User size={20} className="text-amber-400" />
              {t('guide.bow.title')}
            </h3>
            <div className="text-amber-100/80 pl-7 space-y-2">
              <p>{t('guide.bow.desc1')} <strong>{t('guide.bow.desc1.bold')}</strong>{t('guide.bow.desc1.after')}</p>
              <ul className="list-disc list-inside space-y-1 ml-2 text-amber-200/70">
                <li>{t('guide.bow.point1')}</li>
                <li>{t('guide.bow.point2')}</li>
              </ul>
              <p className="pt-2">{t('guide.bow.desc2')} <strong>{t('guide.bow.desc2.bold')}</strong>.</p>
            </div>
          </section>

          {/* Section 4: Khấn Nguyện */}
          <section className="space-y-3">
            <h3 className="text-lg font-medium text-amber-300 flex items-center gap-2">
              <Sparkles size={20} className="text-yellow-400" />
              {t('guide.pray.title')}
            </h3>
            <p className="text-amber-100/80 pl-7">
              {t('guide.pray.desc')}
            </p>
          </section>

        </div>
        
        {/* Footer */}
        <div className="sticky bottom-0 p-6 border-t border-amber-500/20 bg-zinc-900/95 backdrop-blur-sm flex justify-center">
          <button 
            onClick={onClose}
            className="px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-600/20 to-orange-600/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/30 text-amber-200 font-medium tracking-widest transition-all duration-300 shadow-[0_0_15px_rgba(251,191,36,0.1)] hover:shadow-[0_0_25px_rgba(251,191,36,0.2)]"
          >
            {t('guide.understood')}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
