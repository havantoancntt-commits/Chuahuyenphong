import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../lib/i18n';
import { ArrowRight, Sparkles } from 'lucide-react';

interface WelcomeScreenProps {
  onEnter: () => void;
  onOpenKnowledge: () => void;
  onOpenLegal: (type: 'privacy' | 'terms' | 'contact') => void;
  isSceneReady?: boolean;
}

export function WelcomeScreen({ onEnter, onOpenKnowledge, onOpenLegal, isSceneReady = true }: WelcomeScreenProps) {
  const { t } = useLanguage();
  const [isOpening, setIsOpening] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isSceneReady) {
        setShowLoading(true);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [isSceneReady]);

  const handleEnter = () => {
    setIsOpening(true);
    // Wait for the doors to open before transitioning
    setTimeout(() => {
      onEnter();
    }, 2500);
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-[#050505] font-serif perspective-[2000px]">
      
      {/* The Temple Interior (Revealed when doors open) */}
      <div className="absolute inset-0 -z-20 bg-[url('https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-80" />
      <div className="absolute inset-0 -z-20 bg-gradient-to-t from-black via-transparent to-black/50" />
      
      {/* Intense light pouring out from inside */}
      <motion.div 
        className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0 }}
        animate={isOpening ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.5, delay: 0.5 }}
      >
        <div className="w-[120vw] h-[120vh] bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.6)_0%,rgba(251,191,36,0.1)_40%,transparent_70%)]" />
      </motion.div>

      {/* The Doors Container */}
      <div className="absolute inset-0 flex z-0 pointer-events-none">
        {/* Left Door */}
        <motion.div 
          className="relative w-1/2 h-full bg-[#120a05] border-r-2 border-amber-900/50 origin-left shadow-[inset_-30px_0_50px_rgba(0,0,0,0.9)]"
          animate={isOpening ? { rotateY: -110 } : { rotateY: 0 }}
          transition={{ duration: 2.5, ease: [0.2, 0.8, 0.2, 1] }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Wood Texture */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-40 mix-blend-overlay" />
          
          {/* Vertical Planks */}
          <div className="absolute inset-0 flex">
            {[...Array(5)].map((_, i) => (
              <div key={`left-plank-${i}`} className="flex-1 border-r border-black/40 shadow-[inset_2px_0_5px_rgba(255,255,255,0.05)]" />
            ))}
          </div>

          {/* Golden Studs */}
          <div className="absolute top-1/4 right-4 bottom-1/4 flex flex-col justify-between">
            {[...Array(6)].map((_, i) => (
              <div key={`left-stud-${i}`} className="w-4 h-4 rounded-full bg-gradient-to-br from-amber-400 to-amber-700 shadow-[0_2px_4px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.5)]" />
            ))}
          </div>

          {/* Door Knocker */}
          <div className="absolute top-1/2 right-8 md:right-16 -translate-y-1/2 w-16 h-16 md:w-24 md:h-24 rounded-full border-4 border-amber-600/60 bg-gradient-to-br from-amber-800 to-amber-950 shadow-[0_10px_20px_rgba(0,0,0,0.8),inset_0_2px_5px_rgba(255,255,255,0.2)] flex items-center justify-center">
            <div className="w-10 h-10 md:w-16 md:h-16 rounded-full border-4 border-amber-500/40 shadow-inner flex items-center justify-center">
              <div className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-amber-400/80 shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
            </div>
          </div>
          
          {/* Center Seal Half */}
          <div className="absolute top-1/2 right-0 translate-x-[1px] -translate-y-1/2 w-3 md:w-4 h-48 md:h-64 bg-gradient-to-b from-amber-600 via-amber-400 to-amber-600 rounded-l-full shadow-[0_0_15px_rgba(251,191,36,0.3)]" />
        </motion.div>

        {/* Right Door */}
        <motion.div 
          className="relative w-1/2 h-full bg-[#120a05] border-l-2 border-amber-900/50 origin-right shadow-[inset_30px_0_50px_rgba(0,0,0,0.9)]"
          animate={isOpening ? { rotateY: 110 } : { rotateY: 0 }}
          transition={{ duration: 2.5, ease: [0.2, 0.8, 0.2, 1] }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Wood Texture */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-40 mix-blend-overlay" />
          
          {/* Vertical Planks */}
          <div className="absolute inset-0 flex">
            {[...Array(5)].map((_, i) => (
              <div key={`right-plank-${i}`} className="flex-1 border-l border-black/40 shadow-[inset_-2px_0_5px_rgba(255,255,255,0.05)]" />
            ))}
          </div>

          {/* Golden Studs */}
          <div className="absolute top-1/4 left-4 bottom-1/4 flex flex-col justify-between">
            {[...Array(6)].map((_, i) => (
              <div key={`right-stud-${i}`} className="w-4 h-4 rounded-full bg-gradient-to-br from-amber-400 to-amber-700 shadow-[0_2px_4px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.5)]" />
            ))}
          </div>

          {/* Door Knocker */}
          <div className="absolute top-1/2 left-8 md:left-16 -translate-y-1/2 w-16 h-16 md:w-24 md:h-24 rounded-full border-4 border-amber-600/60 bg-gradient-to-br from-amber-800 to-amber-950 shadow-[0_10px_20px_rgba(0,0,0,0.8),inset_0_2px_5px_rgba(255,255,255,0.2)] flex items-center justify-center">
            <div className="w-10 h-10 md:w-16 md:h-16 rounded-full border-4 border-amber-500/40 shadow-inner flex items-center justify-center">
              <div className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-amber-400/80 shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
            </div>
          </div>
          
          {/* Center Seal Half */}
          <div className="absolute top-1/2 left-0 -translate-x-[1px] -translate-y-1/2 w-3 md:w-4 h-48 md:h-64 bg-gradient-to-b from-amber-600 via-amber-400 to-amber-600 rounded-r-full shadow-[0_0_15px_rgba(251,191,36,0.3)]" />
        </motion.div>
      </div>

      {/* UI Content overlay (Fades out when opening) */}
      <AnimatePresence>
        {!isOpening && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            transition={{ duration: 1 }}
            className="relative z-10 flex flex-col items-center justify-center w-full h-full max-w-5xl px-4 md:px-8 pointer-events-none"
          >
            {/* Dark gradient overlays for text readability */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.7)_0%,transparent_80%)] -z-10" />

            {/* Glowing atmospheric effects */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[100vw] md:w-[60vw] h-[40vh] bg-amber-500/10 blur-[100px] rounded-full pointer-events-none mix-blend-screen -z-10" />
            
            {/* Top Decorative Element */}
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1, duration: 1.5 }}
              className="mb-8 flex flex-col items-center"
            >
              <div className="w-1 h-12 bg-gradient-to-b from-transparent via-amber-400 to-transparent opacity-80" />
              <div className="w-3 h-3 rotate-45 border border-amber-400 bg-amber-500/20 shadow-[0_0_15px_rgba(251,191,36,0.8)] mt-2" />
            </motion.div>

            {/* Glowing Neon Sign */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl mb-12 tracking-[0.15em] md:tracking-[0.2em] font-medium text-center uppercase leading-[1.2] md:leading-tight flex flex-col items-center">
              <span 
                className="block text-[#FFFBEB] drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]" 
                style={{ 
                  textShadow: '0 0 10px #FFFBEB, 0 0 20px #FDE68A, 0 0 40px #F59E0B, 0 0 80px #D97706, 0 0 120px #B45309' 
                }}
              >
                HUYỀN PHONG
              </span>
              <span 
                className="block text-[#FFFBEB] drop-shadow-[0_0_20px_rgba(255,255,255,0.8)] mt-2 md:mt-4" 
                style={{ 
                  textShadow: '0 0 10px #FFFBEB, 0 0 20px #FDE68A, 0 0 40px #F59E0B, 0 0 80px #D97706, 0 0 120px #B45309' 
                }}
              >
                PHẬT ĐẠO
              </span>
            </h1>

            {/* Bottom Decorative Element */}
            <motion.div 
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 1.5, duration: 1.5 }}
              className="flex items-center justify-center w-full max-w-md mb-12 opacity-80"
            >
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-amber-400/80 to-transparent shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
              <div className="mx-6 w-2 h-2 rotate-45 bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.8)]" />
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-amber-400/80 to-transparent shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
            </motion.div>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 1.5 }}
              className="mb-8 text-xs md:text-sm lg:text-base font-light tracking-[0.25em] text-center text-amber-100/80 uppercase max-w-2xl leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
            >
              {t('app.headphone_prompt')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5, duration: 1.5 }}
              className="mb-12 text-center max-w-3xl px-6"
            >
              <p className="text-amber-100/40 text-[10px] md:text-xs font-light tracking-widest leading-relaxed uppercase">
                {t('app.welcome_desc')}
              </p>
            </motion.div>

            {/* Premium Button or Loading Indicator */}
            <div className="relative h-24 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {!isSceneReady && showLoading ? (
                  <motion.div 
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-3"
                  >
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={`loading-dot-${i}`}
                          className="w-2 h-2 bg-amber-500 rounded-full"
                          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                        />
                      ))}
                    </div>
                    <span className="text-amber-200/60 text-xs tracking-[0.3em] uppercase font-light">
                      {t('app.loading_scene')}
                    </span>
                  </motion.div>
                ) : (
                  <motion.button 
                    key="enter-button"
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.5, duration: 1, type: "spring", stiffness: 100 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleEnter}
                    className="pointer-events-auto group relative px-12 md:px-16 py-6 md:py-8 rounded-full overflow-hidden cursor-pointer shadow-[0_0_50px_rgba(245,158,11,0.3)] hover:shadow-[0_0_80px_rgba(245,158,11,0.6)] transition-all duration-500"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-amber-900/40 to-black/80  border-2 border-amber-500/60 rounded-full transition-all duration-500 group-hover:border-amber-300 group-hover:bg-amber-800/40" />
                    <div className="absolute inset-0 opacity-50 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.5)_0%,transparent_70%)] animate-pulse" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-100/30 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                    <span className="relative z-10 flex items-center justify-center gap-3 text-amber-100 group-hover:text-white tracking-[0.3em] md:tracking-[0.4em] uppercase text-sm md:text-lg font-bold transition-colors duration-500 drop-shadow-[0_0_10px_rgba(251,191,36,1)]">
                      {t('app.enter_temple')}
                      <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-2 transition-transform duration-500" />
                    </span>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3 text-amber-200/20 text-[8px] sm:text-[9px] font-light tracking-[0.2em] uppercase mt-8 pointer-events-auto">
              <button onClick={onOpenKnowledge} className="hover:text-amber-400/60 transition-all duration-300">{t('knowledge.title')}</button>
              <button onClick={() => onOpenLegal('privacy')} className="hover:text-amber-400/60 transition-all duration-300">{t('legal.privacy.title')}</button>
              <button onClick={() => onOpenLegal('terms')} className="hover:text-amber-400/60 transition-all duration-300">{t('legal.terms.title')}</button>
              <button onClick={() => onOpenLegal('contact')} className="hover:text-amber-400/60 transition-all duration-300">{t('legal.contact.title')}</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none z-20">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={`welcome-particle-${i}`}
            className="absolute w-1 h-1 bg-amber-200/60 rounded-full blur-[1px]"
            style={{ boxShadow: '0 0 10px rgba(251,191,36,0.8)' }}
            initial={{
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 10,
              opacity: Math.random() * 0.5 + 0.2,
              scale: Math.random() * 2 + 0.5,
            }}
            animate={{
              y: -50,
              x: `calc(${Math.random() * 100}vw)`,
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 15 + 10,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 10,
            }}
          />
        ))}
      </div>
    </div>
  );
}
