import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Leaf, Heart, Wind, ChevronLeft } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { useLanguage } from '../lib/i18n';

const apiKey = process.env.GEMINI_API_KEY || "AIzaSyBqwWTRtCv8meMbpGqweC9Sxzm456LxsyQ";
let ai: GoogleGenAI | null = null;
try {
  ai = apiKey ? new GoogleGenAI({ apiKey }) : null;
} catch (e) {
  console.warn("Failed to initialize GoogleGenAI:", e);
}

export function AIGuidance({ onClose }: { onClose: () => void }) {
  const { t, language } = useLanguage();
  const [mode, setMode] = useState<'selection' | 'fortune' | 'chat'>('selection');
  const [intention, setIntention] = useState<'peace' | 'health' | 'clarity' | 'wealth' | 'family' | 'study' | 'business' | 'travel' | null>(null);
  const [blessing, setBlessing] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [isDrawn, setIsDrawn] = useState(false);
  
  // Chat state
  const [messages, setMessages] = useState<{ id: string, role: 'user' | 'model', text: string }[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatSession, setChatSession] = useState<any>(null);

  const startChat = () => {
    if (ai) {
      const session = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: `You are Zen Master Huyen Phong (Thiền sư Huyền Phong), a legendary, deeply enlightened Buddhist monk residing in the ethereal Huyền Phong Temple. 
          Your wisdom is as vast as the ocean and as steady as the mountain. 
          Your goal is to provide profound spiritual guidance, explain the subtle essence of Buddhist philosophy, and offer deep healing comfort.
          Maintain a serene, poetic, and highly respectful tone. Use rich metaphors from nature (the scent of sandalwood, the reflection of the moon in a still pond, the blossoming of a thousand-petaled lotus).
          Always respond in ${language === 'vi' ? 'Vietnamese' : 'English'}. 
          Keep responses concise yet multi-layered and meaningful (max 4-5 sentences). 
          If the user is troubled, offer a short mindful breathing practice or a paradoxical Zen koan to shift their perspective.`,
        },
      });
      setChatSession(session);
      setMessages([{ id: 'initial-msg', role: 'model', text: t('ai.master_welcome') }]);
      setMode('chat');
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !chatSession || isTyping) return;

    const userMsg = inputValue.trim();
    const userMsgId = `user-${Date.now()}`;
    setMessages(prev => [...prev, { id: userMsgId, role: 'user', text: userMsg }]);
    setInputValue('');
    setIsTyping(true);

    try {
      const result = await chatSession.sendMessage({ message: userMsg });
      const modelMsgId = `model-${Date.now()}`;
      setMessages(prev => [...prev, { id: modelMsgId, role: 'model', text: result.text }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { id: `error-${Date.now()}`, role: 'model', text: t('ai.fallback') }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleXinXam = async (selectedIntention: 'peace' | 'health' | 'clarity' | 'wealth' | 'family' | 'study' | 'business' | 'travel') => {
    setIntention(selectedIntention);
    setIsShaking(true);
    setIsDrawn(false);
    setBlessing(null);

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
          contents: `You are a legendary, enlightened Buddhist monk in a sacred, ancient temple. 
          The user has come to you with a sincere heart, seeking guidance for: ${promptMap[selectedIntention]}
          
          Provide a short, profound, and highly poetic blessing or a piece of divine guidance (max 3 sentences).
          The tone must be ethereal, wise, non-materialistic, and deeply healing.
          Use metaphors that evoke a sense of sacredness and peace.
          Write it in ${language === 'vi' ? 'Vietnamese' : 'English'}. Do not use markdown formatting, just plain text.`,
        });
      } else {
        aiPromise = Promise.resolve({ text: t('ai.fallback') });
      }

      const [response] = await Promise.all([aiPromise, shakePromise]);
      
      setIsShaking(false);
      setIsDrawn(true);
      
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
    <div className="absolute inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/95 ">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="relative w-full max-w-lg h-[90vh] max-h-[900px] flex flex-col bg-[#110e0c] border border-amber-900/40 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header with Back Button */}
        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-black/20 shrink-0">
          <button 
            onClick={mode !== 'selection' ? () => { setMode('selection'); setIntention(null); setBlessing(null); } : onClose}
            className="flex items-center gap-1 text-amber-500/80 hover:text-amber-400 transition-colors text-sm font-light tracking-wider"
          >
            <ChevronLeft size={18} />
            {t('ai.back')}
          </button>
          <div className="text-amber-200/40 text-[10px] tracking-[0.4em] uppercase font-medium">
            {mode === 'chat' ? t('ai.mode_master') : t('ai.title')}
          </div>
          <button 
            onClick={onClose}
            className="text-white/40 hover:text-white/80 transition-colors"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col relative">
          {/* Background Ambient Glow */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[100px]" />
          </div>

          <AnimatePresence mode="wait">
            {mode === 'selection' ? (
              <motion.div 
                key="mode-selection"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-6 md:p-10 flex flex-col items-center h-full overflow-y-auto custom-scrollbar"
              >
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-900/40 flex items-center justify-center mb-6 border border-amber-500/30 shrink-0 shadow-[0_0_40px_rgba(245,158,11,0.3)] relative"
                >
                  <Sparkles className="text-amber-400" size={32} />
                </motion.div>
                
                <h2 className="text-2xl md:text-3xl text-amber-100 font-light tracking-widest uppercase mb-8 text-center">
                  {t('ai.title')}
                </h2>

                <div className="w-full space-y-4">
                  <button 
                    onClick={() => setMode('fortune')}
                    className="w-full group relative p-6 rounded-2xl bg-gradient-to-br from-amber-900/20 to-black border border-amber-500/20 hover:border-amber-500/50 transition-all duration-500 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/5 transition-colors duration-500" />
                    <div className="relative flex items-center gap-5">
                      <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform duration-500">
                        <Wind size={24} />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-amber-100 text-lg font-medium tracking-wide">{t('ai.mode_fortune')}</span>
                        <span className="text-white/40 text-xs font-light">{t('ai.prompt')}</span>
                      </div>
                    </div>
                  </button>

                  <button 
                    onClick={startChat}
                    className="w-full group relative p-6 rounded-2xl bg-gradient-to-br from-blue-900/10 to-black border border-blue-500/20 hover:border-blue-500/50 transition-all duration-500 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-colors duration-500" />
                    <div className="relative flex items-center gap-5">
                      <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform duration-500">
                        <Heart size={24} />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-blue-100 text-lg font-medium tracking-wide">{t('ai.mode_master')}</span>
                        <span className="text-white/40 text-xs font-light">Đàm đạo, giải đáp thắc mắc và nhận chỉ dẫn thiền định</span>
                      </div>
                    </div>
                  </button>
                </div>
              </motion.div>
            ) : mode === 'fortune' ? (
              <motion.div 
                key="fortune-mode"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-6 md:p-10 flex flex-col items-center h-full overflow-y-auto custom-scrollbar"
              >
                {!intention ? (
                  <div className="w-full flex flex-col items-center">
                    <p className="text-white/60 text-sm text-center mb-8 font-light leading-relaxed">
                      {t('ai.prompt')}
                    </p>
                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <IntentionButton icon={<Wind size={20} className="text-blue-300/70" />} label={t('prayer.need.peace')} onClick={() => handleXinXam('peace')} />
                      <IntentionButton icon={<Heart size={20} className="text-rose-300/70" />} label={t('prayer.need.health')} onClick={() => handleXinXam('health')} />
                      <IntentionButton icon={<Leaf size={20} className="text-emerald-300/70" />} label={t('ai.clarity')} onClick={() => handleXinXam('clarity')} />
                      <IntentionButton icon={<Sparkles size={20} className="text-amber-300/70" />} label={t('prayer.need.wealth')} onClick={() => handleXinXam('wealth')} />
                      <IntentionButton icon={<Heart size={20} className="text-pink-300/70" />} label={t('prayer.need.family')} onClick={() => handleXinXam('family')} />
                      <IntentionButton icon={<Sparkles size={20} className="text-purple-300/70" />} label={t('prayer.need.study')} onClick={() => handleXinXam('study')} />
                      <IntentionButton icon={<Wind size={20} className="text-orange-300/70" />} label={t('prayer.need.business')} onClick={() => handleXinXam('business')} />
                      <IntentionButton icon={<Wind size={20} className="text-teal-300/70" />} label={t('prayer.need.travel')} onClick={() => handleXinXam('travel')} />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center w-full py-4">
                    <FortuneTube isShaking={isShaking} isDrawn={isDrawn} />
                    {isShaking && <p className="text-amber-200/50 tracking-widest font-light text-sm uppercase animate-pulse text-center mt-6">{t('ai.shaking')}</p>}
                    {isDrawn && blessing && (
                      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center w-full mt-8">
                        <div className="relative w-full p-8 bg-gradient-to-b from-black/80 to-black/60 border border-amber-500/40 rounded-3xl mb-8 shadow-2xl">
                          <p className="text-amber-50 text-lg font-light leading-relaxed text-center italic">"{blessing}"</p>
                        </div>
                        <button onClick={() => { setIntention(null); setBlessing(null); setIsDrawn(false); }} className="px-10 py-3 rounded-full bg-amber-900/40 border border-amber-500/50 text-amber-100 uppercase text-xs tracking-widest">{t('ai.redraw')}</button>
                      </motion.div>
                    )}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div 
                key="chat-mode"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex-1 flex flex-col h-full overflow-hidden"
              >
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                  {messages.map((msg) => (
                    <motion.div 
                      key={msg.id}
                      initial={{ opacity: 0, y: 10, x: msg.role === 'user' ? 10 : -10 }}
                      animate={{ opacity: 1, y: 0, x: 0 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[85%] p-4 rounded-2xl text-sm font-light leading-relaxed shadow-lg ${
                        msg.role === 'user' 
                          ? 'bg-amber-600/20 border border-amber-500/30 text-amber-50 rounded-tr-none' 
                          : 'bg-white/5 border border-white/10 text-white/90 rounded-tl-none'
                      }`}>
                        {msg.text}
                      </div>
                    </motion.div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none flex gap-1">
                        <div className="w-1.5 h-1.5 bg-amber-500/50 rounded-full animate-bounce" />
                        <div className="w-1.5 h-1.5 bg-amber-500/50 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <div className="w-1.5 h-1.5 bg-amber-500/50 rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-white/5 bg-black/40">
                  <div className="relative flex items-center gap-2">
                    <input 
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder={t('ai.chat_placeholder')}
                      className="flex-1 bg-white/5 border border-white/10 rounded-full py-3 px-6 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-amber-500/50 transition-colors"
                    />
                    <button 
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isTyping}
                      className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-black hover:bg-amber-400 disabled:opacity-50 disabled:hover:bg-amber-500 transition-all shadow-[0_0_15px_rgba(245,158,11,0.4)]"
                    >
                      <Wind size={18} />
                    </button>
                  </div>
                </div>
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
              key={`stick-bg-${i}`}
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
                    key={`sparkle-drawn-${i}`}
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
