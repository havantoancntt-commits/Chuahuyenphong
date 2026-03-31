import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../lib/i18n';
import { ChevronLeft, Play, Square, Wind, Music, Volume2, VolumeX } from 'lucide-react';

interface MeditationRoomProps {
  onClose: () => void;
}

const BACKGROUND_SOUNDS = [
  { id: 'none', labelKey: 'meditation.sound.none', url: '' },
  { id: 'rain', labelKey: 'meditation.sound.rain', url: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_88447e769f.mp3?filename=light-rain-109591.mp3' },
  { id: 'stream', labelKey: 'meditation.sound.stream', url: 'https://cdn.pixabay.com/download/audio/2022/02/07/audio_331b26f5d8.mp3?filename=river-stream-14468.mp3' },
  { id: 'birds', labelKey: 'meditation.sound.birds', url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=birds-19624.mp3' },
  { id: 'chanting', labelKey: 'meditation.sound.chanting', url: 'https://cdn.pixabay.com/download/audio/2022/10/25/audio_10673030f2.mp3?filename=tibetan-monks-chanting-123444.mp3' },
];

export function MeditationRoom({ onClose }: MeditationRoomProps) {
  const { t, language } = useLanguage();
  const [isActive, setIsActive] = useState(false);
  const [duration, setDuration] = useState(5 * 60); // Default 5 minutes
  const [timeLeft, setTimeLeft] = useState(duration);
  const [breathState, setBreathState] = useState<'in' | 'hold' | 'out'>('in');
  const [showCompletion, setShowCompletion] = useState(false);
  const [selectedSound, setSelectedSound] = useState('none');
  const [isMuted, setIsMuted] = useState(false);
  
  const bgAudioRef = useRef<HTMLAudioElement | null>(null);
  const woodenFishAudioRef = useRef<HTMLAudioElement | null>(null);
  const bellAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio elements
    woodenFishAudioRef.current = new Audio('https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=wood-block-1-101346.mp3');
    bellAudioRef.current = new Audio('https://cdn.pixabay.com/download/audio/2022/03/15/audio_6a2016f466.mp3?filename=tibetan-singing-bowl-1-101348.mp3');
    
    return () => {
      if (bgAudioRef.current) {
        bgAudioRef.current.pause();
        bgAudioRef.current.src = '';
      }
    };
  }, []);

  useEffect(() => {
    if (bgAudioRef.current) {
      if (selectedSound === 'none') {
        bgAudioRef.current.pause();
      } else {
        const sound = BACKGROUND_SOUNDS.find(s => s.id === selectedSound);
        if (sound && sound.url) {
          bgAudioRef.current.src = sound.url;
          bgAudioRef.current.loop = true;
          if (isActive && !isMuted) {
            bgAudioRef.current.play().catch(e => console.log('Audio play failed:', e));
          }
        }
      }
    }
  }, [selectedSound, isActive, isMuted]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      setShowCompletion(true);
      if (bgAudioRef.current) bgAudioRef.current.pause();
      // Play completion bell
      if (bellAudioRef.current && !isMuted) {
        bellAudioRef.current.currentTime = 0;
        bellAudioRef.current.play().catch(e => console.log(e));
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, isMuted]);

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
    if (bgAudioRef.current && selectedSound !== 'none' && !isMuted) {
      bgAudioRef.current.play().catch(e => console.log(e));
    }
  };

  const handleStop = () => {
    setIsActive(false);
    setTimeLeft(duration);
    if (bgAudioRef.current) {
      bgAudioRef.current.pause();
    }
  };

  const playWoodenFish = () => {
    if (navigator.vibrate) navigator.vibrate(50); // Haptic feedback
    if (woodenFishAudioRef.current && !isMuted) {
      woodenFishAudioRef.current.currentTime = 0;
      woodenFishAudioRef.current.play().catch(e => console.log(e));
    }
  };

  const playBell = () => {
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]); // Haptic feedback
    if (bellAudioRef.current && !isMuted) {
      bellAudioRef.current.currentTime = 0;
      bellAudioRef.current.play().catch(e => console.log(e));
    }
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
      <audio ref={bgAudioRef} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-2xl flex flex-col items-center justify-center h-[85vh] bg-[#0a0a0a] border border-amber-500/20 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden"
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
          <span className="text-amber-200/40 text-xs tracking-[0.2em] uppercase font-medium hidden sm:block">
            {t('meditation.title')}
          </span>
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="w-10 h-10 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-amber-500/80 hover:text-amber-400 transition-colors"
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>

        {/* Main Content */}
        <div className="flex flex-col items-center justify-center w-full h-full p-6 pt-20">
          
          <AnimatePresence mode="wait">
            {!isActive && !showCompletion ? (
              <motion.div 
                key="setup"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center w-full max-w-md"
              >
                <div className="w-20 h-20 rounded-full bg-amber-900/20 flex items-center justify-center mb-6 border border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                  <Wind className="text-amber-500" size={32} strokeWidth={1.5} />
                </div>
                
                <h2 className="text-2xl sm:text-3xl text-amber-100 font-light tracking-widest uppercase mb-3 text-center">
                  {t('meditation.title')}
                </h2>
                <p className="text-amber-200/60 text-center mb-8 font-light tracking-wider text-sm">
                  {t('meditation.desc')}
                </p>

                {/* Duration Selection */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full mb-8">
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

                {/* Background Sound Selection */}
                <div className="w-full mb-10">
                  <div className="flex items-center gap-2 mb-4 text-amber-200/60 text-sm font-light tracking-wider">
                    <Music size={16} />
                    <span>Nhạc nền (Tùy chọn)</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {BACKGROUND_SOUNDS.map((sound) => (
                      <button
                        key={sound.id}
                        onClick={() => setSelectedSound(sound.id)}
                        className={`px-4 py-2 rounded-full border transition-all duration-300 text-xs tracking-wider ${
                          selectedSound === sound.id
                            ? 'bg-amber-500/20 border-amber-400/50 text-amber-200'
                            : 'bg-black/40 border-white/10 text-white/50 hover:bg-white/5 hover:border-amber-500/30 hover:text-amber-200/80'
                        }`}
                      >
                        {t(sound.labelKey)}
                      </button>
                    ))}
                  </div>
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
                className="flex flex-col items-center justify-between w-full h-full py-4"
              >
                <div className="text-4xl sm:text-5xl font-mono text-amber-100/90 tracking-widest mt-4 drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]">
                  {formatTime(timeLeft)}
                </div>

                {/* Breathing Lotus */}
                <div className="relative w-64 h-64 flex items-center justify-center my-8">
                  {/* Outer Glow Rings */}
                  <motion.div
                    animate={{
                      scale: breathState === 'in' ? 2.2 : breathState === 'out' ? 1 : 2.2,
                      opacity: breathState === 'hold' ? 0.3 : 0.05,
                    }}
                    transition={{
                      duration: breathState === 'in' ? 4 : breathState === 'out' ? 8 : 7,
                      ease: "easeInOut"
                    }}
                    className="absolute w-48 h-48 rounded-full border border-amber-500/20"
                  />
                  <motion.div
                    animate={{
                      scale: breathState === 'in' ? 1.8 : breathState === 'out' ? 1 : 1.8,
                      opacity: breathState === 'hold' ? 0.5 : 0.1,
                    }}
                    transition={{
                      duration: breathState === 'in' ? 4 : breathState === 'out' ? 8 : 7,
                      ease: "easeInOut"
                    }}
                    className="absolute w-40 h-40 rounded-full border border-amber-400/30"
                  />

                  {/* Lotus Flower SVG */}
                  <motion.div
                    animate={{
                      scale: breathState === 'in' ? 1.5 : breathState === 'out' ? 1 : 1.5,
                      opacity: breathState === 'hold' ? 1 : 0.7,
                    }}
                    transition={{
                      duration: breathState === 'in' ? 4 : breathState === 'out' ? 8 : 7,
                      ease: "easeInOut"
                    }}
                    className="absolute w-32 h-32 flex items-center justify-center text-amber-400 drop-shadow-[0_0_20px_rgba(245,158,11,0.4)]"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full opacity-80">
                      <path d="M12 22C12 22 15 18 15 14C15 10 12 2 12 2C12 2 9 10 9 14C9 18 12 22 12 22Z" opacity="0.9"/>
                      <path d="M12 22C12 22 18 20 20 15C22 10 18 5 18 5C18 5 16 11 12 14" opacity="0.7"/>
                      <path d="M12 22C12 22 6 20 4 15C2 10 6 5 6 5C6 5 8 11 12 14" opacity="0.7"/>
                      <path d="M12 22C12 22 21 22 23 18C25 14 21 9 21 9C21 9 19 14 12 16" opacity="0.5"/>
                      <path d="M12 22C12 22 3 22 1 18C-1 14 3 9 3 9C3 9 5 14 12 16" opacity="0.5"/>
                    </svg>
                  </motion.div>

                  <motion.div
                    animate={{
                      scale: breathState === 'in' ? 1.1 : breathState === 'out' ? 1 : 1.1,
                    }}
                    transition={{
                      duration: breathState === 'in' ? 4 : breathState === 'out' ? 8 : 7,
                      ease: "easeInOut"
                    }}
                    className="absolute w-24 h-24 rounded-full flex items-center justify-center bg-black/40 backdrop-blur-sm shadow-[inset_0_0_20px_rgba(245,158,11,0.2)]"
                  >
                    <span className="text-amber-200/90 tracking-widest uppercase text-xs font-medium drop-shadow-md">
                      {breathState === 'in' ? t('meditation.breathe_in') : 
                       breathState === 'hold' ? t('meditation.hold') : 
                       t('meditation.breathe_out')}
                    </span>
                  </motion.div>
                </div>

                {/* Interactive Instruments */}
                <div className="flex items-center justify-center gap-8 mb-8">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={playWoodenFish}
                    className="flex flex-col items-center gap-3 group"
                  >
                    <div className="w-16 h-16 rounded-full bg-amber-900/40 border border-amber-600/50 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.2)] group-hover:bg-amber-800/50 group-hover:border-amber-500/80 transition-all">
                      {/* Wooden Fish Icon */}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-amber-400">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
                        <path d="M7 12H17" strokeLinecap="round" />
                        <path d="M12 7V17" strokeLinecap="round" />
                        <circle cx="12" cy="12" r="2" fill="currentColor" />
                      </svg>
                    </div>
                    <span className="text-xs text-amber-200/60 uppercase tracking-wider">{t('meditation.wooden_fish')}</span>
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={playBell}
                    className="flex flex-col items-center gap-3 group"
                  >
                    <div className="w-16 h-16 rounded-full bg-amber-900/40 border border-amber-600/50 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.2)] group-hover:bg-amber-800/50 group-hover:border-amber-500/80 transition-all">
                      {/* Bell Icon */}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-amber-400">
                        <path d="M12 2V4" strokeLinecap="round" />
                        <path d="M12 20V22" strokeLinecap="round" />
                        <path d="M5 10C5 6.13401 8.13401 3 12 3C15.866 3 19 6.13401 19 10V14L21 18H3L5 14V10Z" strokeLinejoin="round" />
                        <path d="M9 20C9 21.6569 10.3431 23 12 23C13.6569 23 15 21.6569 15 20" strokeLinecap="round" />
                      </svg>
                    </div>
                    <span className="text-xs text-amber-200/60 uppercase tracking-wider">{t('meditation.bell')}</span>
                  </motion.button>
                </div>

                <button
                  onClick={handleStop}
                  className="flex items-center gap-2 px-6 py-3 bg-black/50 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 hover:border-white/30 rounded-full transition-all duration-300 mt-auto"
                >
                  <Square size={16} fill="currentColor" />
                  <span className="tracking-widest uppercase text-xs">{t('meditation.stop')}</span>
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="completion"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex flex-col items-center text-center relative"
              >
                {/* Completion Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                <motion.div 
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
                  className="w-28 h-28 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-900/40 flex items-center justify-center mb-8 border border-amber-400/40 shadow-[0_0_50px_rgba(245,158,11,0.3),inset_0_0_20px_rgba(245,158,11,0.2)] backdrop-blur-md relative z-10"
                >
                  <Wind className="text-amber-300 drop-shadow-lg" size={48} strokeWidth={1.5} />
                </motion.div>
                <h3 className="text-3xl text-amber-100 font-light tracking-widest uppercase mb-4 drop-shadow-md relative z-10">
                  {t('meditation.completed')}
                </h3>
                <p className="text-amber-200/60 font-light tracking-wider mb-10 max-w-sm relative z-10">
                  {language === 'vi' ? 'Tâm tĩnh lặng, vạn sự bình an.' : 'A quiet mind brings universal peace.'}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCompletion(false)}
                  className="px-10 py-3.5 bg-amber-900/30 hover:bg-amber-800/40 text-amber-200 border border-amber-500/40 hover:border-amber-400/60 rounded-full transition-all duration-300 tracking-[0.2em] uppercase text-sm font-medium shadow-[0_0_20px_rgba(245,158,11,0.15)] relative z-10"
                >
                  {t('meditation.back')}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
