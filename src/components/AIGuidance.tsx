import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Leaf, Heart, Wind, ChevronLeft } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { useLanguage } from '../lib/i18n';

const apiKey = (import.meta as any).env.VITE_GEMINI_API_KEY || "AIzaSyBqwWTRtCv8meMbpGqweC9Sxzm456LxsyQ";
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export function AIGuidance({ onClose }: { onClose: () => void }) {
  const { t, language } = useLanguage();
  const [intention, setIntention] = useState<'peace' | 'health' | 'clarity' | 'wealth' | 'family' | 'study' | 'business' | 'travel' | null>(null);
  const [blessing, setBlessing] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [isDrawn, setIsDrawn] = useState(false);

  const handleXinXam = async (selectedIntention: 'peace' | 'health' | 'clarity' | 'wealth' | 'family' | 'study' | 'business' | 'travel') => {
    setIntention(selectedIntention);
    setIsShaking(true);
    setIsDrawn(false);
    setBlessing(null);

    // Ensure shaking lasts at least 2.5 seconds for a realistic feel
    const shakePromise = new Promise(resolve => setTimeout(resolve, 2500));

    try {
      const promptMap = {
        peace: "I am seeking inner peace and calmness in my life.",
        health: "I am seeking physical and mental health and well-being.",
        clarity: "I am seeking clarity, wisdom, and guidance for my path.",
        wealth: "I am seeking wealth, prosperity, and success in my career.",
        family: "I am seeking harmony, love, and happiness for my family.",
        study: "I am seeking focus, intelligence, and success in my studies and exams.",
        business: "I am seeking smooth operations, good luck, and growth in my business.",
        travel: "I am seeking safety, protection, and a smooth journey for my travels."
      };

      let aiPromise;
      if (ai) {
        aiPromise = ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `You are a wise, compassionate Buddhist monk in a sacred virtual temple. 
          The user has come to you seeking: ${promptMap[selectedIntention]}
          
          Provide a short, profound, and poetic blessing or piece of guidance (max 3 sentences).
          The tone must be peaceful, wise, non-materialistic, and deeply comforting.
          Write it in ${language === 'vi' ? 'Vietnamese' : 'English'}. Do not use markdown formatting, just plain text.`,
        });
      } else {
        // Fallback if API key is missing
        aiPromise = Promise.resolve({ text: t('ai.fallback') });
      }

      const [response] = await Promise.all([aiPromise, shakePromise]);
      
      setIsShaking(false);
      setIsDrawn(true);
      
      // Wait a moment for the stick to fly out before showing the text
      setTimeout(() => {
        setBlessing(response.text || t('ai.fallback'));
      }, 800);

    } catch (error) {
      console.error("Error generating blessing:", error);
      await shakePromise;
      setIsShaking(false);
      setIsDrawn(true);
      setTimeout(() => {
        setBlessing(t('ai.fallback'));
      }, 800);
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-lg">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="relative w-full max-w-lg max-h-[95vh] flex flex-col bg-[#110e0c] border border-amber-900/40 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header with Back Button */}
        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-black/20 shrink-0">
          <button 
            onClick={intention ? () => { setIntention(null); setBlessing(null); } : onClose}
            className="flex items-center gap-1 text-amber-500/80 hover:text-amber-400 transition-colors text-sm font-light tracking-wider"
          >
            <ChevronLeft size={18} />
            {t('ai.back')}
          </button>
          <button 
            onClick={onClose}
            className="text-white/40 hover:text-white/80 transition-colors"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        <div className="p-6 md:p-10 overflow-y-auto flex-1 custom-scrollbar flex flex-col items-center relative">
          {/* Background Ambient Glow */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[100px]" />
          </div>

          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-900/40 flex items-center justify-center mb-8 border border-amber-500/30 shrink-0 shadow-[0_0_50px_rgba(245,158,11,0.4)] relative"
          >
            <div className="absolute inset-0 rounded-full border-2 border-amber-400/30 animate-[spin_6s_linear_infinite] border-dashed" />
            <div className="absolute inset-2 rounded-full border border-amber-500/20 animate-[spin_4s_linear_infinite_reverse]" />
            <Sparkles className="text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]" size={40} strokeWidth={1.5} />
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl text-amber-100 font-light tracking-widest uppercase mb-4 text-center drop-shadow-[0_0_20px_rgba(251,191,36,0.6)]">
            {t('ai.title')}
          </h2>
          
          <AnimatePresence mode="wait">
            {!intention ? (
              <motion.div 
                key="selection"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full flex flex-col items-center"
              >
                <p className="text-white/60 text-sm text-center mb-8 font-light leading-relaxed">
                  {t('ai.prompt')}
                </p>

                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <IntentionButton 
                    icon={<Wind size={20} className="text-blue-300/70" />}
                    label={t('prayer.need.peace')}
                    onClick={() => handleXinXam('peace')}
                  />
                  <IntentionButton 
                    icon={<Heart size={20} className="text-rose-300/70" />}
                    label={t('prayer.need.health')}
                    onClick={() => handleXinXam('health')}
                  />
                  <IntentionButton 
                    icon={<Leaf size={20} className="text-emerald-300/70" />}
                    label={t('ai.clarity')}
                    onClick={() => handleXinXam('clarity')}
                  />
                  <IntentionButton 
                    icon={<Sparkles size={20} className="text-amber-300/70" />}
                    label={t('prayer.need.wealth')}
                    onClick={() => handleXinXam('wealth')}
                  />
                  <IntentionButton 
                    icon={<Heart size={20} className="text-pink-300/70" />}
                    label={t('prayer.need.family')}
                    onClick={() => handleXinXam('family')}
                  />
                  <IntentionButton 
                    icon={<Sparkles size={20} className="text-purple-300/70" />}
                    label={t('prayer.need.study')}
                    onClick={() => handleXinXam('study')}
                  />
                  <IntentionButton 
                    icon={<Wind size={20} className="text-orange-300/70" />}
                    label={t('prayer.need.business')}
                    onClick={() => handleXinXam('business')}
                  />
                  <IntentionButton 
                    icon={<Wind size={20} className="text-teal-300/70" />}
                    label={t('prayer.need.travel')}
                    onClick={() => handleXinXam('travel')}
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="shaking-or-result"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center w-full py-4"
              >
                <FortuneTube isShaking={isShaking} isDrawn={isDrawn} />
                
                {isShaking && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-amber-200/50 tracking-widest font-light text-sm uppercase animate-pulse text-center mt-6"
                  >
                    {t('ai.shaking')}
                  </motion.p>
                )}

                {isDrawn && blessing && (
                  <motion.div 
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                    className="flex flex-col items-center w-full mt-8 relative z-10"
                  >
                    {/* Divine Light Background */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
                    
                    <motion.div 
                      className="absolute -inset-4 bg-amber-500/5 rounded-3xl blur-xl pointer-events-none"
                      animate={{
                        scale: [1, 1.05, 1],
                        opacity: [0.5, 0.8, 0.5],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />

                    <div className="relative w-full p-8 sm:p-10 bg-gradient-to-b from-black/80 to-black/60 border border-amber-500/40 rounded-3xl mb-8 shadow-[0_0_50px_rgba(0,0,0,0.8),inset_0_0_30px_rgba(245,158,11,0.1)] backdrop-blur-xl overflow-hidden">
                      {/* Inner subtle glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />
                      
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-900 to-amber-800 px-8 py-1.5 border border-amber-500/50 rounded-full text-amber-200 text-xs tracking-[0.3em] uppercase shadow-[0_0_20px_rgba(245,158,11,0.4)] font-medium z-20">
                        {t('ai.result')}
                      </div>
                      
                      {/* Decorative corners */}
                      <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-amber-500/50" />
                      <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-amber-500/50" />
                      <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-amber-500/50" />
                      <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-amber-500/50" />

                      <p className="text-amber-50 text-lg sm:text-xl font-light leading-relaxed text-center italic drop-shadow-[0_2px_10px_rgba(251,191,36,0.3)] relative z-10">
                        "{blessing}"
                      </p>
                    </div>

                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setIntention(null);
                        setBlessing(null);
                        setIsDrawn(false);
                        setIsShaking(false);
                      }}
                      className="px-12 py-4 rounded-full bg-gradient-to-r from-amber-900/40 to-amber-800/40 border border-amber-500/50 text-amber-100 hover:from-amber-800/50 hover:to-amber-700/50 hover:border-amber-400/80 tracking-[0.2em] uppercase text-xs font-medium transition-all duration-300 shrink-0 shadow-[0_0_30px_rgba(245,158,11,0.2)] relative z-10"
                    >
                      {t('ai.redraw')}
                    </motion.button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

function IntentionButton({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-3 sm:p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-amber-500/30 transition-all duration-300 group"
    >
      <div className="w-10 h-10 shrink-0 rounded-full bg-black/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <span className="text-white/80 group-hover:text-amber-100 tracking-wider font-light text-sm sm:text-base text-left">
        {label}
      </span>
    </button>
  );
}

function FortuneTube({ isShaking, isDrawn }: { isShaking: boolean, isDrawn: boolean }) {
  const { t } = useLanguage();
  return (
    <div className="relative w-40 h-56 mx-auto flex items-end justify-center">
      {/* Background Glow */}
      <AnimatePresence>
        {(isShaking || isDrawn) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl z-0"
          />
        )}
      </AnimatePresence>

      <motion.div
        className="relative w-28 h-48 origin-bottom z-10"
        animate={isShaking ? {
          rotate: [0, -25, 25, -20, 20, -15, 15, -10, 10, -5, 5, 0],
          y: [0, -20, 0, -15, 0, -10, 0],
          x: [0, -12, 12, -8, 8, 0],
          scale: [1, 1.05, 0.95, 1.02, 0.98, 1]
        } : isDrawn ? {
          rotate: [0, 5, -5, 0],
          y: [0, 10, 0],
          scale: [1, 0.95, 1]
        } : { rotate: 0, y: 0, x: 0, scale: 1 }}
        transition={{ 
          repeat: isShaking ? Infinity : 0, 
          duration: isShaking ? 0.4 : 0.8, 
          ease: "easeInOut" 
        }}
      >
        {/* Background sticks */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-1.5 px-4 z-0">
          {[...Array(16)].map((_, i) => (
            <motion.div 
              key={i}
              className="w-1.5 bg-gradient-to-b from-[#fcd34d] to-[#b45309] rounded-t-sm origin-bottom shadow-[0_0_5px_rgba(0,0,0,0.5)]"
              style={{ 
                height: `${80 + Math.random() * 60}px`,
                transform: `rotate(${(i - 7.5) * 3}deg) translateX(${(i - 7.5) * 1.2}px)`
              }}
              animate={isShaking ? {
                y: [0, -(Math.random() * 45 + 25), 0],
                rotate: [(i - 7.5) * 3, (i - 7.5) * 3 + (Math.random() * 30 - 15), (i - 7.5) * 3],
                opacity: [0.8, 1, 0.8]
              } : isDrawn ? {
                y: [0, Math.random() * 10 + 5, 0],
                opacity: 0.5
              } : { y: 0, opacity: 0.8 }}
              transition={{ repeat: isShaking ? Infinity : 0, duration: 0.05 + Math.random() * 0.1 }}
            />
          ))}
        </div>

        {/* The Drawn Stick */}
        <motion.div 
          className="absolute bottom-6 left-1/2 -translate-x-1/2 w-4 h-52 bg-gradient-to-b from-[#fef3c7] via-[#fcd34d] to-[#b45309] rounded-t-sm origin-bottom z-10 shadow-[0_0_30px_rgba(251,191,36,1)]"
          initial={{ y: 30, opacity: 0 }}
          animate={isDrawn ? { 
            y: -160, 
            opacity: 1,
            rotate: 0,
            scale: 1.5,
            zIndex: 50
          } : isShaking ? { 
            y: [-10, -70, -10], 
            opacity: 1,
            rotate: [-10, 10, -10]
          } : { 
            y: 30, 
            opacity: 0 
          }}
          transition={isDrawn ? { 
            y: { type: "spring", bounce: 0.5, duration: 2 },
            scale: { type: "spring", bounce: 0.5, duration: 2 },
            rotate: { duration: 1, ease: "easeOut" }
          } : { repeat: Infinity, duration: 0.12 }}
        >
          {/* Red tip */}
          <div className="w-full h-5 bg-gradient-to-b from-red-500 to-red-700 rounded-t-sm shadow-[0_0_10px_rgba(220,38,38,0.8)]" />
          {/* Engravings */}
          <div className="w-full h-full flex flex-col items-center pt-5 gap-2.5 opacity-80">
            <div className="w-2 h-2 bg-amber-950 rounded-full" />
            <div className="w-2 h-4 bg-amber-950 rounded-sm" />
            <div className="w-2 h-2 bg-amber-950 rounded-full" />
          </div>
          
          {/* Sparkles when drawn */}
          <AnimatePresence>
            {isDrawn && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="absolute -top-32 -left-32 -right-32 bottom-0 pointer-events-none"
              >
                {[...Array(48)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-amber-200 rounded-full shadow-[0_0_20px_rgba(251,191,36,1)]"
                    initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                    animate={{ 
                      x: (Math.random() - 0.5) * 450, 
                      y: (Math.random() - 0.5) * 450 - 150,
                      opacity: [0, 1, 0],
                      scale: [0, Math.random() * 2.5 + 0.5, 0],
                      rotate: Math.random() * 360
                    }}
                    transition={{ duration: 2.5 + Math.random() * 2, ease: "easeOut" }}
                  >
                    {/* Add a star shape to some particles */}
                    {i % 3 === 0 && (
                      <div className="absolute inset-0 bg-amber-100 rotate-45 scale-x-50" />
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Tube Front (Bamboo) */}
        <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-b from-[#78350f] to-[#451a03] rounded-b-3xl rounded-t-xl border-x-4 border-b-8 border-[#2dd4bf]/0 shadow-[inset_0_0_30px_rgba(0,0,0,0.9),0_15px_30px_rgba(0,0,0,0.7)] z-20 overflow-hidden flex flex-col items-center">
          {/* Bamboo texture highlights */}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.15)_0%,transparent_20%,transparent_80%,rgba(0,0,0,0.5)_100%)]" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-20 mix-blend-overlay" />
          
          {/* Bamboo joints */}
          <div className="w-full h-2.5 bg-[#92400e] opacity-60 mt-6 shadow-[0_2px_5px_rgba(0,0,0,0.5)] border-t border-[#b45309]/40" />
          <div className="w-full h-2.5 bg-[#92400e] opacity-60 mt-12 shadow-[0_2px_5px_rgba(0,0,0,0.5)] border-t border-[#b45309]/40" />
          
          {/* Red paper decoration */}
          <div className="absolute top-10 w-20 h-20 bg-gradient-to-br from-red-600 to-red-800 rotate-45 border-2 border-amber-500/60 flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.5)]">
            <div className="w-16 h-16 border border-amber-400/80 rotate-0 flex items-center justify-center">
               <span className="text-amber-400 text-base -rotate-45 font-bold tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {t('ai.stick')}
               </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
