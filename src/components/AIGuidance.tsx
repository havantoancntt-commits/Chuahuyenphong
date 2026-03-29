import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Loader2, Leaf, Heart, Wind, ChevronLeft } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export function AIGuidance({ onClose }: { onClose: () => void }) {
  const [intention, setIntention] = useState<'peace' | 'health' | 'clarity' | null>(null);
  const [blessing, setBlessing] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleXinXam = async (selectedIntention: 'peace' | 'health' | 'clarity') => {
    setIntention(selectedIntention);
    setIsLoading(true);

    try {
      const promptMap = {
        peace: "I am seeking inner peace and calmness in my life.",
        health: "I am seeking physical and mental health and well-being.",
        clarity: "I am seeking clarity, wisdom, and guidance for my path."
      };

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are a wise, compassionate Buddhist monk in a sacred virtual temple. 
        The user has come to you seeking: ${promptMap[selectedIntention]}
        
        Provide a short, profound, and poetic blessing or piece of guidance (max 3 sentences).
        The tone must be peaceful, wise, non-materialistic, and deeply comforting.
        Write it in Vietnamese. Do not use markdown formatting, just plain text.`,
      });

      setBlessing(response.text || "Tâm tĩnh lặng, vạn sự bình an. Hãy giữ tâm trong sáng như đóa sen.");
    } catch (error) {
      console.error("Error generating blessing:", error);
      setBlessing("Tâm tĩnh lặng, vạn sự bình an. Hãy giữ tâm trong sáng như đóa sen.");
    } finally {
      setIsLoading(false);
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
            ) : isLoading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-12"
              >
                <Loader2 className="animate-spin text-amber-500/50 mb-4" size={32} />
                <p className="text-amber-200/50 tracking-widest font-light text-sm uppercase animate-pulse text-center">
                  Đang lắng nghe tâm nguyện...
                </p>
              </motion.div>
            ) : (
              <motion.div 
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center w-full"
              >
                <div className="relative w-full p-6 sm:p-8 bg-black/40 border border-amber-500/20 rounded-2xl mb-8 mt-4">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#110e0c] px-4 text-amber-500/50 text-xs tracking-widest uppercase">
                    Lời Khuyên
                  </div>
                  <p className="text-amber-100/90 text-base sm:text-lg font-light leading-relaxed text-center italic">
                    "{blessing}"
                  </p>
                </div>

                <button 
                  onClick={() => {
                    setIntention(null);
                    setBlessing(null);
                  }}
                  className="px-8 py-3 rounded-full bg-transparent border border-white/20 text-white/70 hover:text-white hover:border-white/50 tracking-widest uppercase text-xs font-light transition-all duration-300 shrink-0"
                >
                  Xin xăm lại
                </button>
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
