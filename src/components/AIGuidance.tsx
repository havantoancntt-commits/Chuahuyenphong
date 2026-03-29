import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Leaf, Heart, Wind, ChevronLeft } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export function AIGuidance({ onClose }: { onClose: () => void }) {
  const [intention, setIntention] = useState<'peace' | 'health' | 'clarity' | null>(null);
  const [blessing, setBlessing] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [isDrawn, setIsDrawn] = useState(false);

  const handleXinXam = async (selectedIntention: 'peace' | 'health' | 'clarity') => {
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
        clarity: "I am seeking clarity, wisdom, and guidance for my path."
      };

      const aiPromise = ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are a wise, compassionate Buddhist monk in a sacred virtual temple. 
        The user has come to you seeking: ${promptMap[selectedIntention]}
        
        Provide a short, profound, and poetic blessing or piece of guidance (max 3 sentences).
        The tone must be peaceful, wise, non-materialistic, and deeply comforting.
        Write it in Vietnamese. Do not use markdown formatting, just plain text.`,
      });

      const [response] = await Promise.all([aiPromise, shakePromise]);
      
      setIsShaking(false);
      setIsDrawn(true);
      
      // Wait a moment for the stick to fly out before showing the text
      setTimeout(() => {
        setBlessing(response.text || "Tâm tĩnh lặng, vạn sự bình an. Hãy giữ tâm trong sáng như đóa sen.");
      }, 800);

    } catch (error) {
      console.error("Error generating blessing:", error);
      await shakePromise;
      setIsShaking(false);
      setIsDrawn(true);
      setTimeout(() => {
        setBlessing("Tâm tĩnh lặng, vạn sự bình an. Hãy giữ tâm trong sáng như đóa sen.");
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
            Trở lại
          </button>
          <button 
            onClick={onClose}
            className="text-white/40 hover:text-white/80 transition-colors"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        <div className="p-6 md:p-10 overflow-y-auto flex-1 custom-scrollbar flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-amber-900/20 flex items-center justify-center mb-6 border border-amber-500/20 shrink-0">
            <Sparkles className="text-amber-500/80" size={24} strokeWidth={1.5} />
          </div>
          
          <h2 className="text-xl md:text-2xl text-amber-100 font-light tracking-widest uppercase mb-4 text-center">
            Xin Xăm & Lời Khuyên
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
                  Hãy chọn tâm nguyện của bạn để nhận một lời khuyên từ chư Phật.
                </p>

                <div className="w-full space-y-3">
                  <IntentionButton 
                    icon={<Wind size={20} className="text-blue-300/70" />}
                    label="Bình An"
                    onClick={() => handleXinXam('peace')}
                  />
                  <IntentionButton 
                    icon={<Heart size={20} className="text-rose-300/70" />}
                    label="Sức Khỏe"
                    onClick={() => handleXinXam('health')}
                  />
                  <IntentionButton 
                    icon={<Leaf size={20} className="text-emerald-300/70" />}
                    label="Trí Tuệ"
                    onClick={() => handleXinXam('clarity')}
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
                    Đang thỉnh xăm...
                  </motion.p>
                )}

                {isDrawn && blessing && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex flex-col items-center w-full mt-4"
                  >
                    <div className="relative w-full p-6 sm:p-8 bg-black/40 border border-amber-500/20 rounded-2xl mb-8">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#110e0c] px-4 text-amber-500/50 text-xs tracking-widest uppercase">
                        Quẻ Xăm
                      </div>
                      <p className="text-amber-100/90 text-base sm:text-lg font-light leading-relaxed text-center italic">
                        "{blessing}"
                      </p>
                    </div>

                    <button 
                      onClick={() => {
                        setIntention(null);
                        setBlessing(null);
                        setIsDrawn(false);
                        setIsShaking(false);
                      }}
                      className="px-8 py-3 rounded-full bg-transparent border border-white/20 text-white/70 hover:text-white hover:border-white/50 tracking-widest uppercase text-xs font-light transition-all duration-300 shrink-0"
                    >
                      Xin xăm lại
                    </button>
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
          rotate: [0, -15, 15, -12, 12, -10, 10, -5, 5, 0],
          y: [0, -12, 0, -10, 0, -8, 0],
          x: [0, -5, 5, -3, 3, 0]
        } : { rotate: 0, y: 0, x: 0 }}
        transition={{ repeat: isShaking ? Infinity : 0, duration: 0.4, ease: "easeInOut" }}
      >
        {/* Background sticks */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-1.5 px-4 z-0">
          {[...Array(12)].map((_, i) => (
            <motion.div 
              key={i}
              className="w-1.5 bg-gradient-to-b from-[#fcd34d] to-[#b45309] rounded-t-sm origin-bottom shadow-sm"
              style={{ 
                height: `${80 + Math.random() * 50}px`,
                transform: `rotate(${(i - 5.5) * 4}deg) translateX(${(i - 5.5) * 1.5}px)`
              }}
              animate={isShaking ? {
                y: [0, -(Math.random() * 20 + 10), 0],
                rotate: [(i - 5.5) * 4, (i - 5.5) * 4 + (Math.random() * 10 - 5), (i - 5.5) * 4]
              } : { y: 0 }}
              transition={{ repeat: isShaking ? Infinity : 0, duration: 0.15 + Math.random() * 0.2 }}
            />
          ))}
        </div>

        {/* The Drawn Stick */}
        <motion.div 
          className="absolute bottom-6 left-1/2 -translate-x-1/2 w-4 h-52 bg-gradient-to-b from-[#fef3c7] via-[#fcd34d] to-[#b45309] rounded-t-sm origin-bottom z-10 shadow-[0_0_25px_rgba(251,191,36,0.9)]"
          initial={{ y: 30, opacity: 0 }}
          animate={isDrawn ? { 
            y: -120, 
            opacity: 1,
            rotate: 0,
            scale: 1.3,
            zIndex: 50
          } : isShaking ? { 
            y: [-10, -50, -10], 
            opacity: 1,
            rotate: [-5, 5, -5]
          } : { 
            y: 30, 
            opacity: 0 
          }}
          transition={isDrawn ? { type: "spring", bounce: 0.6, duration: 1.2 } : { repeat: Infinity, duration: 0.2 }}
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
                transition={{ delay: 0.3, duration: 0.5 }}
                className="absolute -top-10 -left-10 -right-10 bottom-0 pointer-events-none"
              >
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1.5 h-1.5 bg-amber-200 rounded-full shadow-[0_0_10px_rgba(251,191,36,1)]"
                    initial={{ x: 0, y: 0, opacity: 1 }}
                    animate={{ 
                      x: (Math.random() - 0.5) * 100, 
                      y: (Math.random() - 0.5) * 100 - 50,
                      opacity: 0,
                      scale: 0
                    }}
                    transition={{ duration: 1 + Math.random(), ease: "easeOut" }}
                  />
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
               <span className="text-amber-400 text-base -rotate-45 font-bold tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">XĂM</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
