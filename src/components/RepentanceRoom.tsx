import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Feather, Sparkles } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { useLanguage } from '../lib/i18n';

const apiKey = "AIzaSyBqwWTRtCv8meMbpGqweC9Sxzm456LxsyQ";
const ai = new GoogleGenAI({ apiKey });

export function RepentanceRoom({ onClose }: { onClose: () => void }) {
  const { t, language } = useLanguage();
  const [text, setText] = useState('');
  const [isReleasing, setIsReleasing] = useState(false);
  const [isReleased, setIsReleased] = useState(false);
  const [advice, setAdvice] = useState<string | null>(null);

  const handleRelease = async () => {
    if (!text.trim()) return;
    
    setIsReleasing(true);
    
    try {
      const aiPromise = ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are a wise, compassionate Buddhist monk. 
        A person has come to you to repent and let go of this burden/sin/regret: "${text}"
        
        Provide a short, profound, and deeply comforting Buddhist advice (max 3 sentences) about forgiveness, letting go of the past, and finding peace.
        The tone must be forgiving, non-judgmental, and enlightening.
        Write it in ${language === 'vi' ? 'Vietnamese' : 'English'}. Do not use markdown formatting, just plain text.`,
      });

      // Minimum animation time for the "burning/fading" effect
      const animationPromise = new Promise(resolve => setTimeout(resolve, 3000));

      const [response] = await Promise.all([aiPromise, animationPromise]);
      
      setAdvice(response.text || t('repentance.fallback'));
      setIsReleasing(false);
      setIsReleased(true);
    } catch (error) {
      console.error("Error generating advice:", error);
      setTimeout(() => {
        setAdvice(t('repentance.fallback'));
        setIsReleasing(false);
        setIsReleased(true);
      }, 3000);
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-[#0a0a0a] border border-amber-900/40 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,1)] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-900/20 flex items-center justify-center border border-amber-500/20">
              <Feather className="text-amber-500/80" size={18} strokeWidth={1.5} />
            </div>
            <h2 className="text-lg md:text-xl text-amber-100 font-light tracking-widest uppercase">
              {t('repentance.title')}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="text-white/40 hover:text-white/80 transition-colors p-2"
          >
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>

        <div className="p-6 md:p-10 overflow-y-auto flex-1 custom-scrollbar flex flex-col items-center justify-center min-h-[400px]">
          <AnimatePresence mode="wait">
            {!isReleasing && !isReleased && (
              <motion.div 
                key="input"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, filter: "blur(10px)", scale: 1.1 }}
                transition={{ duration: 1.5 }}
                className="w-full flex flex-col items-center"
              >
                <p className="text-amber-200/60 text-sm md:text-base text-center mb-8 font-light leading-relaxed tracking-wide">
                  {t('repentance.prompt')}
                </p>

                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={t('repentance.placeholder')}
                  className="w-full h-48 bg-white/5 border border-white/10 rounded-2xl p-6 text-white/90 placeholder:text-white/20 focus:outline-none focus:border-amber-500/50 focus:bg-white/10 transition-all duration-500 resize-none font-light text-lg leading-relaxed"
                />

                <button
                  onClick={handleRelease}
                  disabled={!text.trim()}
                  className="mt-8 px-10 py-4 rounded-full bg-gradient-to-r from-amber-900/80 to-amber-800/80 border border-amber-500/30 text-amber-100 tracking-[0.2em] uppercase text-sm font-medium hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:border-amber-400/50 transition-all duration-500 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {t('repentance.button')}
                </button>
              </motion.div>
            )}

            {isReleasing && (
              <motion.div 
                key="releasing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full flex flex-col items-center justify-center relative"
              >
                {/* Burning Effect Background */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.5, 2],
                    opacity: [0.8, 0.4, 0],
                    rotate: [0, 45, 90]
                  }}
                  transition={{ duration: 3, ease: "easeOut" }}
                  className="absolute w-64 h-64 bg-gradient-to-t from-orange-600/40 via-amber-500/20 to-transparent rounded-full blur-3xl pointer-events-none"
                />

                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                    filter: ["blur(4px)", "blur(8px)", "blur(4px)"]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-32 h-32 rounded-full bg-amber-500/20 mb-8 flex items-center justify-center relative z-10"
                >
                  <Sparkles className="text-amber-400 w-12 h-12 drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]" />
                </motion.div>
                <p className="text-amber-200/60 tracking-[0.3em] font-light text-sm uppercase animate-pulse text-center relative z-10 drop-shadow-md">
                  {t('repentance.releasing')}
                </p>
              </motion.div>
            )}

            {isReleased && advice && (
              <motion.div 
                key="released"
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1.2, type: "spring", stiffness: 100, damping: 20 }}
                className="w-full flex flex-col items-center relative"
              >
                {/* Divine Light Background */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-64 bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

                <motion.div 
                  initial={{ rotate: -180, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ duration: 1, type: "spring", stiffness: 200, damping: 20, delay: 0.3 }}
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-900/40 flex items-center justify-center mb-10 border border-amber-400/40 shadow-[0_0_40px_rgba(245,158,11,0.3),inset_0_0_20px_rgba(245,158,11,0.2)] backdrop-blur-md relative z-10"
                >
                  <Feather className="text-amber-300 drop-shadow-lg" size={36} strokeWidth={1.5} />
                </motion.div>
                
                <div className="relative w-full p-10 bg-black/40 border border-amber-500/20 rounded-3xl shadow-[0_0_30px_rgba(0,0,0,0.5),inset_0_0_20px_rgba(245,158,11,0.05)] backdrop-blur-sm">
                  <div className="absolute -top-4 -left-4 text-amber-500/10 rotate-180">
                    <Feather size={60} strokeWidth={0.5} />
                  </div>
                  <div className="absolute -bottom-4 -right-4 text-amber-500/10">
                    <Feather size={60} strokeWidth={0.5} />
                  </div>
                  <p className="text-amber-100/90 text-lg md:text-xl font-light leading-relaxed text-center italic relative z-10 drop-shadow-sm">
                    "{advice}"
                  </p>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setText('');
                    setIsReleased(false);
                    setAdvice(null);
                  }}
                  className="mt-12 px-10 py-3.5 rounded-full bg-amber-900/30 border border-amber-500/40 text-amber-200 hover:text-amber-100 hover:bg-amber-800/40 hover:border-amber-400/60 tracking-[0.2em] uppercase text-xs font-medium transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.15)] relative z-10"
                >
                  {t('repentance.back')}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
