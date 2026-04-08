import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Feather, Sparkles, Flame, Wind } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { useLanguage } from '../lib/i18n';
import { useUserStats } from '../lib/userStats';

const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
try {
  if (apiKey) {
    ai = new GoogleGenAI({ apiKey });
  }
} catch (e) {
  console.warn("Failed to initialize GoogleGenAI:", e);
}

export function RepentanceRoom({ onClose }: { onClose: () => void }) {
  const { t, language } = useLanguage();
  const { incrementRepentance } = useUserStats();
  const [text, setText] = useState('');
  const [isReleasing, setIsReleasing] = useState(false);
  const [isReleased, setIsReleased] = useState(false);
  const [advice, setAdvice] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fireAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fireAudioRef.current = new Audio('https://cdn.pixabay.com/download/audio/2022/02/22/audio_d1718ab41b.mp3?filename=crackling-fire-14488.mp3');
    return () => {
      if (fireAudioRef.current) {
        fireAudioRef.current.pause();
        fireAudioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (isReleasing && fireAudioRef.current) {
      fireAudioRef.current.volume = 0.5;
      fireAudioRef.current.play().catch(e => console.log('Fire audio play failed:', e));
    } else if (!isReleasing && fireAudioRef.current) {
      // Fade out audio
      const fadeOut = setInterval(() => {
        if (fireAudioRef.current && fireAudioRef.current.volume > 0.05) {
          fireAudioRef.current.volume -= 0.05;
        } else {
          clearInterval(fadeOut);
          if (fireAudioRef.current) fireAudioRef.current.pause();
        }
      }, 100);
    }
  }, [isReleasing]);

  const handleRelease = async () => {
    if (!text.trim()) return;
    
    setIsReleasing(true);
    
    try {
      if (!ai) throw new Error("AI not initialized");
      const aiPromise = ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are Zen Master Huyen Phong, a deeply compassionate and enlightened Buddhist monk. 
        A user has shared their regrets and is seeking a path to healing and forgiveness: "${text}"
        
        Provide a short, profound, and healing piece of advice (max 3 sentences).
        The tone must be ethereal, non-judgmental, and deeply comforting.
        Focus on the concept of impermanence, self-forgiveness, and the blossoming of a new heart.
        Write it in ${language === 'vi' ? 'Vietnamese' : 'English'}. Do not use markdown formatting, just plain text.`,
      });

      // Minimum animation time for the "burning/fading" effect
      const animationPromise = new Promise(resolve => setTimeout(resolve, 4000));

      const [response] = await Promise.all([aiPromise, animationPromise]);
      
      setAdvice(response.text || t('repentance.fallback'));
      incrementRepentance();
      setIsReleasing(false);
      setIsReleased(true);
    } catch (error) {
      console.error("Error generating advice:", error);
      setTimeout(() => {
        setAdvice(t('repentance.fallback'));
        setIsReleasing(false);
        setIsReleased(true);
      }, 4000);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="absolute inset-0 z-50 flex items-center justify-center bg-[#030303] overflow-hidden font-serif"
    >
      {/* Immersive Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519834785169-98be25ec3f84?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-screen" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
        <motion.div 
          animate={{ 
            opacity: isReleasing ? [0.1, 0.5, 0.1] : 0.1,
            scale: isReleasing ? [1, 1.2, 1] : 1
          }}
          transition={{ duration: 4, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.15)_0%,transparent_70%)] rounded-full blur-3xl" 
        />
      </div>

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 md:p-8 z-20 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
        <button 
          onClick={onClose}
          className="flex items-center gap-3 text-red-200/60 hover:text-red-100 transition-colors group"
        >
          <div className="w-10 h-10 rounded-full border border-red-500/20 flex items-center justify-center group-hover:border-red-400/50 group-hover:bg-red-500/10 transition-all">
            <ChevronLeft size={20} strokeWidth={1.5} />
          </div>
          <span className="text-xs md:text-sm tracking-[0.2em] uppercase font-light hidden sm:block">{t('repentance.back')}</span>
        </button>
        <span className="text-red-500/40 text-[10px] md:text-xs tracking-[0.3em] uppercase font-medium">
          {t('repentance.title')}
        </span>
        <div className="w-10 h-10" /> {/* Spacer for centering */}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center w-full h-full max-w-3xl px-4 md:px-6 overflow-y-auto scrollbar-hide">
        <div className="flex flex-col items-center justify-center min-h-full w-full py-24 md:py-32">
          <AnimatePresence mode="wait">
            {!isReleasing && !isReleased && (
              <motion.div 
                key="input"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, filter: "blur(10px)", scale: 1.05 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="w-full flex flex-col items-center"
              >
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="mb-8 md:mb-10 relative"
                >
                  <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full" />
                  <Feather className="text-red-400/80 relative z-10 w-8 h-8 md:w-10 md:h-10" strokeWidth={1} />
                </motion.div>

                <h2 className="text-2xl sm:text-3xl md:text-4xl text-red-50 font-light tracking-[0.2em] uppercase mb-4 md:mb-6 text-center drop-shadow-[0_0_15px_rgba(220,38,38,0.3)]">
                  {t('repentance.title')}
                </h2>
                
                <div className="flex flex-col items-center gap-4 md:gap-6 mb-8 md:mb-12">
                  <p className="text-red-200/80 text-center font-light tracking-[0.15em] text-xs md:text-base max-w-xl leading-relaxed italic px-4">
                    {t('repentance.quote')}
                  </p>
                  <div className="flex items-center gap-4 md:gap-8 text-red-500/40 text-[10px] md:text-xs tracking-[0.2em] uppercase">
                    <div className="flex items-center gap-1 md:gap-2"><Feather size={12} className="md:w-3.5 md:h-3.5" /> <span>{t('repentance.step1')}</span></div>
                    <span className="w-1 h-1 rounded-full bg-red-500/30" />
                    <div className="flex items-center gap-1 md:gap-2"><Flame size={12} className="md:w-3.5 md:h-3.5" /> <span>{t('repentance.step2')}</span></div>
                    <span className="w-1 h-1 rounded-full bg-red-500/30" />
                    <div className="flex items-center gap-1 md:gap-2"><Wind size={12} className="md:w-3.5 md:h-3.5" /> <span>{t('repentance.step3')}</span></div>
                  </div>
                </div>

                <div className="w-full relative group mb-8 md:mb-12">
                  <div className="absolute -inset-1 bg-gradient-to-r from-red-900/20 via-red-600/20 to-red-900/20 rounded-2xl blur opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                  <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={t('repentance.placeholder')}
                    className="relative w-full h-40 sm:h-48 md:h-64 bg-black/60  border border-red-900/30 rounded-2xl p-5 md:p-8 text-red-100/90 placeholder:text-red-900/50 focus:outline-none focus:border-red-500/50 transition-all duration-500 resize-none font-light text-base md:text-lg leading-relaxed shadow-[inset_0_0_30px_rgba(0,0,0,0.8)]"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleRelease}
                  disabled={!text.trim()}
                  className={`group relative flex items-center justify-center gap-3 md:gap-4 px-12 py-4 md:px-16 md:py-5 rounded-full overflow-hidden transition-all duration-700 mt-2 md:mt-4 w-full max-w-[280px] md:max-w-none md:w-auto ${
                    text.trim() 
                      ? 'opacity-100 cursor-pointer shadow-[0_0_30px_rgba(220,38,38,0.2)]' 
                      : 'opacity-40 cursor-not-allowed grayscale'
                  }`}
                >
                <div className="absolute inset-0 bg-gradient-to-r from-red-900/60 via-red-600/50 to-red-900/60 border border-red-500/50 rounded-full transition-all duration-700 group-hover:bg-red-500/40" />
                
                {text.trim() && (
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden rounded-full">
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-red-300/20 to-transparent skew-x-12"
                      animate={{ x: ['-150%', '150%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                  </div>
                )}
                
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.6)_0%,transparent_70%)] blur-md" />
                
                <Flame size={16} className={`relative z-10 transition-all duration-500 md:w-4 md:h-4 ${text.trim() ? 'text-red-200 group-hover:scale-110 group-hover:text-white' : 'text-red-400'}`} strokeWidth={1.5} />
                <span className={`tracking-[0.3em] uppercase text-xs md:text-sm font-medium relative z-10 transition-colors duration-500 ${text.trim() ? 'text-red-50' : 'text-red-300'}`}>
                  {t('repentance.button')}
                </span>
              </motion.button>
            </motion.div>
          )}

          {isReleasing && (
            <motion.div 
              key="releasing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center text-center"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.5, 2, 2.5, 3],
                  opacity: [1, 0.8, 0.5, 0.2, 0],
                  filter: ["blur(0px)", "blur(4px)", "blur(8px)", "blur(12px)", "blur(20px)"]
                }}
                transition={{ duration: 4, ease: "easeIn" }}
                className="text-red-500/80 mb-8"
              >
                <Flame className="w-16 h-16 md:w-20 md:h-20" strokeWidth={1} />
              </motion.div>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-red-200/60 font-light tracking-[0.2em] uppercase text-xs md:text-sm"
              >
                {t('repentance.releasing')}
              </motion.p>
            </motion.div>
          )}

          {isReleased && (
            <motion.div 
              key="released"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="flex flex-col items-center text-center relative w-full"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-amber-500/10 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />

              <motion.div 
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                className="w-20 h-20 md:w-24 md:h-24 rounded-full border border-amber-500/30 flex items-center justify-center mb-8 md:mb-10 relative z-10"
              >
                <div className="absolute inset-0 bg-amber-500/10 rounded-full blur-md" />
                <Sparkles className="text-amber-300 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)] w-8 h-8 md:w-10 md:h-10" strokeWidth={1} />
              </motion.div>
              
              <h3 className="text-xl md:text-3xl text-amber-100 font-light tracking-[0.3em] uppercase mb-8 md:mb-10 drop-shadow-md relative z-10 px-4">
                {t('repentance.completed_title')}
              </h3>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, delay: 1.5 }}
                className="relative z-10 mb-12 md:mb-16 w-full"
              >
                <div className="absolute -left-2 md:-left-4 top-0 text-4xl md:text-6xl text-amber-500/10 font-serif">"</div>
                <p className="text-amber-100/80 font-light tracking-[0.05em] text-base md:text-xl leading-relaxed italic px-6 md:px-8">
                  {advice}
                </p>
                <div className="absolute -right-2 md:-right-4 bottom-0 text-4xl md:text-6xl text-amber-500/10 font-serif">"</div>
              </motion.div>
              
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setText('');
                  setIsReleased(false);
                  setAdvice(null);
                }}
                className="px-10 py-3 md:px-12 md:py-4 bg-transparent hover:bg-amber-900/20 text-amber-200/80 hover:text-amber-100 border border-amber-500/30 hover:border-amber-400/60 rounded-full transition-all duration-500 tracking-[0.25em] uppercase text-[10px] md:text-xs font-medium relative z-10"
              >
                {t('repentance.continue')}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
