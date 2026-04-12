import { motion } from 'framer-motion';
import { Flame, ArrowDownToLine, HeartHandshake, Sparkles, Volume2, VolumeX, BookOpen, Feather, Globe, Share2, Wind, BookText, Droplets, User } from 'lucide-react';
import { useLanguage } from '../lib/i18n';

interface UIOverlayProps {
  onLightIncense: () => void;
  onBow: () => void;
  onDonate: () => void;
  onAIGuidance: () => void;
  onOpenRepentance: () => void;
  onOpenMeditation: () => void;
  onOpenPrayerBook: () => void;
  onOpenLifeRelease: () => void;
  onOpenGuide: () => void;
  onOpenProfile: () => void;
  onOpenKnowledge: () => void;
  onOpenLegal: (type: 'privacy' | 'terms' | 'contact') => void;
  isIncenseLit: boolean;
  isBowing: boolean;
  audioEnabled: boolean;
  setAudioEnabled: (enabled: boolean) => void;
}

export function UIOverlay({ 
  onLightIncense, 
  onBow, 
  onDonate, 
  onAIGuidance, 
  onOpenRepentance,
  onOpenMeditation,
  onOpenPrayerBook,
  onOpenLifeRelease,
  onOpenGuide,
  onOpenProfile,
  onOpenKnowledge,
  onOpenLegal,
  isIncenseLit,
  isBowing,
  audioEnabled,
  setAudioEnabled
}: UIOverlayProps) {
  const { t, language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'vi' ? 'en' : 'vi');
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 sm:p-6 z-10">
      {/* Top Bar */}
      <div className="flex justify-between items-center pt-safe px-2">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="text-amber-100/90 tracking-[0.3em] uppercase text-xs sm:text-sm font-medium drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
        >
          {t('app.title')}
        </motion.div>
        
        <div className="flex gap-2 sm:gap-3">
          <button 
            onClick={toggleLanguage}
            className="pointer-events-auto flex items-center gap-2 px-3 py-2 rounded-full bg-black/60 backdrop-blur-md border border-amber-500/30 text-amber-200/90 hover:text-amber-100 hover:bg-amber-500/20 transition-all duration-300 shadow-lg"
            title="Ngôn ngữ / Language"
          >
            <Globe size={16} strokeWidth={1.5} />
            <span className="text-[10px] font-bold tracking-widest uppercase">{language}</span>
          </button>
          <button 
            onClick={onOpenKnowledge}
            className="pointer-events-auto p-2.5 rounded-full bg-black/60 backdrop-blur-md border border-amber-500/30 text-amber-200/90 hover:text-amber-100 hover:bg-amber-500/20 transition-all duration-300 shadow-lg"
            title={t('ui.knowledge')}
          >
            <BookText size={18} strokeWidth={1.5} />
          </button>
          <button 
            onClick={onOpenGuide}
            className="pointer-events-auto p-2.5 rounded-full bg-black/60 backdrop-blur-md border border-amber-500/30 text-amber-200/90 hover:text-amber-100 hover:bg-amber-500/20 transition-all duration-300 shadow-lg"
            title={t('ui.guide_tooltip')}
          >
            <BookOpen size={18} strokeWidth={1.5} />
          </button>
          <button 
            onClick={() => setAudioEnabled(!audioEnabled)}
            className="pointer-events-auto p-2.5 rounded-full bg-black/60 backdrop-blur-md border border-amber-500/30 text-amber-200/90 hover:text-amber-100 hover:bg-amber-500/20 transition-all duration-300 shadow-lg"
            title={audioEnabled ? t('ui.audio_off') : t('ui.audio_on')}
          >
            {audioEnabled ? <Volume2 size={18} strokeWidth={1.5} /> : <VolumeX size={18} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="flex flex-col items-center pb-4 sm:pb-8 pb-safe w-full">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.8 }}
          className="grid grid-cols-4 gap-2 sm:gap-4 mb-6 w-full max-w-2xl px-2"
        >
          <ActionButton 
            icon={<Flame size={20} />} 
            label={t('ui.incense')} 
            onClick={onLightIncense} 
            disabled={isIncenseLit || isBowing}
          />
          <ActionButton 
            icon={<ArrowDownToLine size={20} />} 
            label={t('ui.bow')} 
            onClick={onBow} 
            disabled={isBowing}
          />
          <ActionButton 
            icon={<Feather size={20} />} 
            label={t('ui.repent')} 
            onClick={onOpenRepentance} 
            disabled={isBowing}
          />
          <ActionButton 
            icon={<Wind size={20} />} 
            label={t('meditation.title')} 
            onClick={onOpenMeditation} 
            disabled={isBowing}
          />
          <ActionButton 
            icon={<BookText size={20} />} 
            label={t('prayer.title')} 
            onClick={onOpenPrayerBook} 
            disabled={isBowing}
          />
          <ActionButton 
            icon={<Droplets size={20} />} 
            label={t('release.title')} 
            onClick={onOpenLifeRelease} 
            disabled={isBowing}
          />
          <ActionButton 
            icon={<Sparkles size={20} />} 
            label={t('ui.fortune')} 
            onClick={onAIGuidance} 
            disabled={isBowing}
          />
          <ActionButton 
            icon={<HeartHandshake size={20} />} 
            label={t('ui.donate')} 
            onClick={onDonate} 
            disabled={isBowing}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 1.5 }}
          className="flex flex-col items-center gap-4 w-full max-w-4xl"
        >
          <div className="text-center text-amber-100/40 text-[9px] sm:text-[10px] font-light px-6 tracking-[0.15em] uppercase leading-relaxed max-w-2xl drop-shadow-sm">
            {t('ui.disclaimer')}
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3 text-amber-200/20 text-[8px] sm:text-[9px] font-light tracking-[0.2em] uppercase">
            <button onClick={() => onOpenLegal('privacy')} className="hover:text-amber-400/60 transition-all duration-300 pointer-events-auto">{t('legal.privacy.title')}</button>
            <button onClick={() => onOpenLegal('terms')} className="hover:text-amber-400/60 transition-all duration-300 pointer-events-auto">{t('legal.terms.title')}</button>
            <button onClick={() => onOpenLegal('contact')} className="hover:text-amber-400/60 transition-all duration-300 pointer-events-auto">Liên Hệ: havantoancntt@gmail.com</button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function ActionButton({ 
  icon, 
  label, 
  onClick, 
  disabled = false
}: { 
  icon: React.ReactNode; 
  label: string; 
  onClick: () => void; 
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        pointer-events-auto flex flex-col items-center justify-center gap-2 
        aspect-square rounded-xl transition-all duration-500 group
        ${disabled ? 'opacity-30 cursor-not-allowed grayscale' : 'hover:-translate-y-1 cursor-pointer active:scale-95'}
        bg-black/40 backdrop-blur-md border border-amber-500/20 text-amber-100/80 
        hover:bg-amber-500/10 hover:border-amber-400/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]
      `}
    >
      <div className={`transition-all duration-500 ${!disabled && 'group-hover:scale-110'} text-amber-400/80 group-hover:text-amber-300`}>
        {icon}
      </div>
      <span className="text-[7px] sm:text-[9px] tracking-[0.1em] uppercase font-medium text-center px-1 leading-tight">
        {label}
      </span>
    </button>
  );
}
