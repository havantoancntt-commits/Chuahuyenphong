import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../lib/i18n';
import { ChevronLeft, Play, Square, Wind } from 'lucide-react';

interface MeditationRoomProps {
  onClose: () => void;
}

export function MeditationRoom({ onClose }: MeditationRoomProps) {
  const { t } = useLanguage();
  const [isActive, setIsActive] = useState(false);
  const [duration, setDuration] = useState(5 * 60); // Default 5 minutes
  const [timeLeft, setTimeLeft] = useState(duration);
  const [breathState, setBreathState] = useState<'in' | 'hold' | 'out'>('in');
  const [showCompletion, setShowCompletion] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      setShowCompletion(true);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  useEffect(() => {
    let breathInterval: NodeJS.Timeout;
    if (isActive) {
      // 4-7-8 breathing technique
      const cycle = () => {
        setBreathState('in');
        setTimeout(() => {
          setBreathState('hold');
          setTimeout(() => {
            setBreathState('out');
          }, 7000);
        }, 4000);
      };
      
      cycle();
      breathInterval = setInterval(cycle, 19000); // 4 + 7 + 8 = 19s
    }
    return () => clearInterval(breathInterval);
  }, [isActive]);

  const handleStart = () => {
    setTimeLeft(duration);
    setIsActive(true);
    setShowCompletion(false);
  };

  const handleStop = () => {
    setIsActive(false);
    setTimeLeft(duration);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const durations = [
    { label: t('meditation.timer.5min'), value: 5 * 60 },
    { label: t('meditation.timer.10min'), value: 10 * 60 },
    { label: t('meditation.timer.15min'), value: 15 * 60 },
    { label: t('meditation.timer.30min'), value: 30 * 60 },
  ];

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-2xl flex flex-col items-center justify-center h-[80vh] bg-[#0a0a0a] border border-amber-500/20 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden"
      >
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-6 z-10">
          <button 
            onClick={onClose}
            className="flex items-center gap-2 text-amber-500/80 hover:text-amber-400 transition-colors text-sm font-light tracking-wider"
          >
            <ChevronLeft size={20} />
            {t('meditation.back')}
          </button>
          <span className="text-amber-200/40 text-xs tracking-[0.2em] uppercase font-medium">
            {t('meditation.title')}
          </span>
          <div className="w-20"></div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col items-center justify-center w-full h-full p-8 pt-20">
          
          <AnimatePresence mode="wait">
            {!isActive && !showCompletion ? (
              <motion.div 
                key="setup"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center w-full max-w-md"
              >
                <div className="w-20 h-20 rounded-full bg-amber-900/20 flex items-center justify-center mb-8 border border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                  <Wind className="text-amber-500" size={32} strokeWidth={1.5} />
                </div>
                
                <h2 className="text-2xl sm:text-3xl text-amber-100 font-light tracking-widest uppercase mb-4 text-center">
                  {t('meditation.title')}
                </h2>
                <p className="text-amber-200/60 text-center mb-12 font-light tracking-wider">
                  {t('meditation.desc')}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full mb-12">
                  {durations.map((d) => (
                    <button
                      key={d.value}
                      onClick={() => setDuration(d.value)}
                      className={`py-3 px-4 rounded-xl border transition-all duration-300 text-sm tracking-wider ${
                        duration === d.value
                          ? 'bg-amber-500/20 border-amber-400/50 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                          : 'bg-black/40 border-white/10 text-white/50 hover:bg-white/5 hover:border-amber-500/30 hover:text-amber-200/80'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleStart}
                  className="flex items-center gap-3 px-10 py-4 bg-amber-600/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/50 rounded-full transition-all duration-300 hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:scale-105"
                >
                  <Play size={20} fill="currentColor" />
                  <span className="tracking-widest uppercase font-medium">{t('meditation.start')}</span>
                </button>
              </motion.div>
            ) : isActive ? (
              <motion.div 
                key="active"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center w-full h-full"
              >
                {/* Breathing Circle */}
                <div className="relative w-64 h-64 flex items-center justify-center mb-16">
                  <motion.div
                    animate={{
                      scale: breathState === 'in' ? 1.5 : breathState === 'out' ? 1 : 1.5,
                      opacity: breathState === 'hold' ? 0.8 : 0.5,
                    }}
                    transition={{
                      duration: breathState === 'in' ? 4 : breathState === 'out' ? 8 : 7,
                      ease: "easeInOut"
                    }}
                    className="absolute w-40 h-40 rounded-full bg-gradient-to-tr from-amber-500/20 to-yellow-300/20 blur-xl"
                  />
                  <motion.div
                    animate={{
                      scale: breathState === 'in' ? 1.2 : breathState === 'out' ? 1 : 1.2,
                    }}
                    transition={{
                      duration: breathState === 'in' ? 4 : breathState === 'out' ? 8 : 7,
                      ease: "easeInOut"
                    }}
                    className="absolute w-32 h-32 rounded-full border border-amber-400/30 flex items-center justify-center bg-black/40 backdrop-blur-sm shadow-[0_0_30px_rgba(245,158,11,0.1)]"
                  >
                    <span className="text-amber-200/80 tracking-widest uppercase text-sm font-medium">
                      {breathState === 'in' ? t('meditation.breathe_in') : 
                       breathState === 'hold' ? t('meditation.hold') : 
                       t('meditation.breathe_out')}
                    </span>
                  </motion.div>
                </div>

                <div className="text-4xl sm:text-5xl font-mono text-amber-100/90 tracking-widest mb-12 drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]">
                  {formatTime(timeLeft)}
                </div>

                <button
                  onClick={handleStop}
                  className="flex items-center gap-2 px-6 py-3 bg-black/50 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 hover:border-white/30 rounded-full transition-all duration-300"
                >
                  <Square size={16} fill="currentColor" />
                  <span className="tracking-widest uppercase text-xs">{t('meditation.stop')}</span>
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="completion"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-24 h-24 rounded-full bg-amber-500/10 flex items-center justify-center mb-8 border border-amber-400/30 shadow-[0_0_40px_rgba(245,158,11,0.2)]">
                  <Wind className="text-amber-400" size={40} strokeWidth={1} />
                </div>
                <h3 className="text-2xl text-amber-100 font-light tracking-widest uppercase mb-6">
                  {t('meditation.completed')}
                </h3>
                <button
                  onClick={() => setShowCompletion(false)}
                  className="px-8 py-3 bg-amber-600/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/50 rounded-full transition-all duration-300 tracking-widest uppercase text-sm"
                >
                  {t('meditation.back')}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
