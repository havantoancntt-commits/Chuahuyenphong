import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../lib/i18n';
import { ChevronLeft, Play, Square, Wind, Music, Volume2, VolumeX, Sparkles, Heart } from 'lucide-react';

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
  const [duration, setDuration] = useState(5 * 60);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [breathState, setBreathState] = useState<'in' | 'hold' | 'out'>('in');
  const [showCompletion, setShowCompletion] = useState(false);
  const [selectedSound, setSelectedSound] = useState('none');
  const [isMuted, setIsMuted] = useState(false);
  
  const bgAudioRef = useRef<HTMLAudioElement | null>(null);
  const woodenFishAudioRef = useRef<HTMLAudioElement | null>(null);
  const bellAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
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
    if (!bgAudioRef.current) return;

    if (selectedSound === 'none') {
      bgAudioRef.current.pause();
    } else {
      const sound = BACKGROUND_SOUNDS.find(s => s.id === selectedSound);
      if (sound && sound.url) {
        if (bgAudioRef.current.src !== sound.url) {
          bgAudioRef.current.src = sound.url;
        }
        bgAudioRef.current.loop = true;
        if (!isMuted) {
          bgAudioRef.current.play().catch(e => console.log('Audio play failed:', e));
        } else {
          bgAudioRef.current.pause();
        }
      }
    }
  }, [selectedSound, isMuted]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      setShowCompletion(true);
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
      breathInterval = setInterval(cycle, 19000);
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

  const playWoodenFish = () => {
    if (navigator.vibrate) navigator.vibrate(50);
    if (woodenFishAudioRef.current && !isMuted) {
      woodenFishAudioRef.current.currentTime = 0;
      woodenFishAudioRef.current.play().catch(e => console.log(e));
    }
  };

  const playBell = () => {
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
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

  const progress = isActive ? ((duration - timeLeft) / duration) * 100 : 0;
  const circumference = 2 * Math.PI * 120; // radius 120
  const strokeDashoffset = circumference - (progress / 100) * circumference;

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
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-screen" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/80" />
        <motion.div 
          animate={{ 
            opacity: isActive ? [0.1, 0.3, 0.1] : 0.1,
            scale: isActive ? [1, 1.1, 1] : 1
          }}
          transition={{ duration: 19, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.15)_0%,transparent_70%)] rounded-full blur-3xl" 
        />
      </div>

      <audio ref={bgAudioRef} />
      
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 md:p-8 z-20 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
        <button 
          onClick={onClose}
          className="flex items-center gap-3 text-amber-200/60 hover:text-amber-100 transition-colors group"
        >
          <div className="w-10 h-10 rounded-full border border-amber-500/20 flex items-center justify-center group-hover:border-amber-400/50 group-hover:bg-amber-500/10 transition-all">
            <ChevronLeft size={20} strokeWidth={1.5} />
          </div>
          <span className="text-xs md:text-sm tracking-[0.2em] uppercase font-light hidden sm:block">{t('meditation.back')}</span>
        </button>
        <span className="text-amber-500/40 text-[10px] md:text-xs tracking-[0.3em] uppercase font-medium">
          {t('meditation.title')}
        </span>
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="w-10 h-10 rounded-full border border-amber-500/20 flex items-center justify-center text-amber-200/60 hover:text-amber-100 hover:border-amber-400/50 hover:bg-amber-500/10 transition-all"
        >
          {isMuted ? <VolumeX size={18} strokeWidth={1.5} /> : <Volume2 size={18} strokeWidth={1.5} />}
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center w-full h-full max-w-4xl px-4 md:px-6 overflow-y-auto scrollbar-hide">
        <div className="flex flex-col items-center justify-center min-h-full w-full py-24 md:py-32">
          <AnimatePresence mode="wait">
            {!isActive && !showCompletion ? (
              <motion.div 
                key="setup"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8 }}
                className="flex flex-col items-center w-full"
              >
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="mb-8 md:mb-12 relative"
                >
                  <div className="absolute inset-0 bg-amber-500/20 blur-2xl rounded-full" />
                  <Wind className="text-amber-400/80 relative z-10 w-10 h-10 md:w-12 md:h-12" strokeWidth={1} />
                </motion.div>
                
                <h2 className="text-2xl sm:text-3xl md:text-5xl text-amber-50 font-light tracking-[0.2em] uppercase mb-4 md:mb-6 text-center drop-shadow-[0_0_15px_rgba(251,191,36,0.3)]">
                  {t('meditation.title')}
                </h2>
                
                <div className="flex flex-col items-center gap-4 md:gap-6 mb-10 md:mb-16">
                  <p className="text-amber-200/80 text-center font-light tracking-[0.15em] text-xs md:text-base max-w-xl leading-relaxed italic px-4">
                    "{language === 'vi' ? 'Hãy tìm một tư thế thoải mái, nhắm mắt lại và để hơi thở dẫn lối bạn về với hiện tại.' : 'Find a comfortable posture, close your eyes, and let your breath guide you back to the present.'}"
                  </p>
                  <div className="flex items-center gap-4 md:gap-8 text-amber-500/40 text-[10px] md:text-xs tracking-[0.2em] uppercase">
                    <div className="flex items-center gap-1 md:gap-2"><Wind size={12} className="md:w-3.5 md:h-3.5" /> <span>{language === 'vi' ? 'Hít thở' : 'Breathe'}</span></div>
                    <span className="w-1 h-1 rounded-full bg-amber-500/30" />
                    <div className="flex items-center gap-1 md:gap-2"><Sparkles size={12} className="md:w-3.5 md:h-3.5" /> <span>{language === 'vi' ? 'Thư giãn' : 'Relax'}</span></div>
                    <span className="w-1 h-1 rounded-full bg-amber-500/30" />
                    <div className="flex items-center gap-1 md:gap-2"><Heart size={12} className="md:w-3.5 md:h-3.5" /> <span>{language === 'vi' ? 'Buông xả' : 'Let go'}</span></div>
                  </div>
                </div>

                {/* Duration Selection */}
                <div className="w-full max-w-2xl mb-8 md:mb-12">
                  <div className="flex items-center justify-center gap-3 mb-4 md:mb-6 text-amber-500/50 text-[10px] md:text-xs tracking-[0.2em] uppercase">
                    <span className="w-8 h-[1px] bg-amber-500/30" />
                    Thời gian
                    <span className="w-8 h-[1px] bg-amber-500/30" />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                    {durations.map((d) => (
                      <button
                        key={d.value}
                        onClick={() => setDuration(d.value)}
                        className={`py-3 px-4 md:py-4 md:px-6 rounded-2xl border backdrop-blur-md transition-all duration-500 text-[10px] md:text-sm tracking-[0.15em] uppercase ${
                          duration === d.value
                            ? 'bg-amber-500/10 border-amber-400/50 text-amber-200 shadow-[0_0_30px_rgba(245,158,11,0.15)]'
                            : 'bg-black/40 border-white/5 text-white/40 hover:bg-white/5 hover:border-amber-500/30 hover:text-amber-200/80'
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Background Sound Selection */}
                <div className="w-full max-w-2xl mb-12 md:mb-16">
                  <div className="flex items-center justify-center gap-3 mb-4 md:mb-6 text-amber-500/50 text-[10px] md:text-xs tracking-[0.2em] uppercase">
                    <span className="w-8 h-[1px] bg-amber-500/30" />
                    <Music size={12} className="md:w-3.5 md:h-3.5" /> Âm thanh
                    <span className="w-8 h-[1px] bg-amber-500/30" />
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                    {BACKGROUND_SOUNDS.map((sound) => (
                      <button
                        key={sound.id}
                        onClick={() => setSelectedSound(sound.id)}
                        className={`px-4 py-2 md:px-6 md:py-3 rounded-full border backdrop-blur-md transition-all duration-500 text-[10px] md:text-xs tracking-[0.15em] uppercase ${
                          selectedSound === sound.id
                            ? 'bg-amber-500/10 border-amber-400/50 text-amber-200 shadow-[0_0_20px_rgba(245,158,11,0.1)]'
                            : 'bg-black/40 border-white/5 text-white/40 hover:bg-white/5 hover:border-amber-500/30 hover:text-amber-200/80'
                        }`}
                      >
                        {t(sound.labelKey)}
                      </button>
                    ))}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleStart}
                  className="group relative flex items-center justify-center gap-3 md:gap-4 px-12 py-4 md:px-16 md:py-5 rounded-full overflow-hidden mt-2 md:mt-4 w-full max-w-[280px] md:max-w-none md:w-auto"
                >
                  {/* Animated background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-900/60 via-amber-600/50 to-amber-900/60 border border-amber-500/50 rounded-full transition-all duration-700 group-hover:bg-amber-500/40" />
                  
                  {/* Sweeping light effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden rounded-full">
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-200/20 to-transparent skew-x-12"
                      animate={{ x: ['-150%', '150%'] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                    />
                  </div>
                  
                  {/* Glowing aura */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.5)_0%,transparent_70%)] blur-md" />
                  
                  <Play size={16} fill="currentColor" className="text-amber-100 relative z-10 transition-transform duration-500 group-hover:scale-110 md:w-4 md:h-4" />
                  <span className="text-amber-50 tracking-[0.3em] uppercase text-xs md:text-sm font-medium relative z-10">{t('meditation.start')}</span>
                </motion.button>
              </motion.div>
            ) : isActive ? (
              <motion.div 
                key="active"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="flex flex-col items-center justify-center w-full h-full"
              >
                {/* Timer Progress Ring */}
                <div className="relative flex items-center justify-center mb-12 md:mb-16">
                  <svg className="w-[260px] h-[260px] md:w-[400px] md:h-[400px] transform -rotate-90" viewBox="0 0 260 260">
                    <circle
                      cx="130"
                      cy="130"
                      r="120"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="transparent"
                      className="text-white/5"
                    />
                    <motion.circle
                      cx="130"
                      cy="130"
                      r="120"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="transparent"
                      strokeDasharray={circumference}
                      animate={{ strokeDashoffset }}
                      transition={{ duration: 1, ease: "linear" }}
                      className="text-amber-500/50 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                      strokeLinecap="round"
                    />
                  </svg>

                  {/* Breathing Lotus inside Ring */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      animate={{
                        scale: breathState === 'in' ? 1.5 : breathState === 'out' ? 1 : 1.5,
                        opacity: breathState === 'hold' ? 1 : 0.6,
                      }}
                      transition={{
                        duration: breathState === 'in' ? 4 : breathState === 'out' ? 8 : 7,
                        ease: "easeInOut"
                      }}
                      className="absolute w-24 h-24 md:w-40 md:h-40 flex items-center justify-center text-amber-400/80 drop-shadow-[0_0_30px_rgba(245,158,11,0.3)]"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                        <path d="M12 22C12 22 15 18 15 14C15 10 12 2 12 2C12 2 9 10 9 14C9 18 12 22 12 22Z" opacity="0.9"/>
                        <path d="M12 22C12 22 18 20 20 15C22 10 18 5 18 5C18 5 16 11 12 14" opacity="0.6"/>
                        <path d="M12 22C12 22 6 20 4 15C2 10 6 5 6 5C6 5 8 11 12 14" opacity="0.6"/>
                        <path d="M12 22C12 22 21 22 23 18C25 14 21 9 21 9C21 9 19 14 12 16" opacity="0.4"/>
                        <path d="M12 22C12 22 3 22 1 18C-1 14 3 9 3 9C3 9 5 14 12 16" opacity="0.4"/>
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
                      className="absolute flex flex-col items-center justify-center"
                    >
                      <span className="text-amber-100/90 tracking-[0.3em] uppercase text-[10px] md:text-sm font-medium drop-shadow-md mb-1 md:mb-2">
                        {breathState === 'in' ? t('meditation.breathe_in') : 
                         breathState === 'hold' ? t('meditation.hold') : 
                         t('meditation.breathe_out')}
                      </span>
                      <div className="text-xl md:text-3xl font-mono text-amber-200/50 tracking-widest font-light">
                        {formatTime(timeLeft)}
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Interactive Instruments */}
                <div className="flex items-center justify-center gap-8 md:gap-12 mb-12 md:mb-16">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={playWoodenFish}
                    className="flex flex-col items-center gap-3 md:gap-4 group"
                  >
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-black/40 border border-amber-900/50 flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.5)] group-hover:border-amber-500/50 group-hover:bg-amber-900/20 transition-all duration-500 backdrop-blur-md">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-8 h-8 md:w-10 md:h-10 text-amber-500/70 group-hover:text-amber-400 transition-colors">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
                        <path d="M7 12H17" strokeLinecap="round" />
                        <path d="M12 7V17" strokeLinecap="round" />
                        <circle cx="12" cy="12" r="2" fill="currentColor" />
                      </svg>
                    </div>
                    <span className="text-[9px] md:text-[10px] text-amber-500/50 uppercase tracking-[0.2em] group-hover:text-amber-400/80 transition-colors">{t('meditation.wooden_fish')}</span>
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={playBell}
                    className="flex flex-col items-center gap-3 md:gap-4 group"
                  >
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-black/40 border border-amber-900/50 flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.5)] group-hover:border-amber-500/50 group-hover:bg-amber-900/20 transition-all duration-500 backdrop-blur-md">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-8 h-8 md:w-10 md:h-10 text-amber-500/70 group-hover:text-amber-400 transition-colors">
                        <path d="M12 2V4" strokeLinecap="round" />
                        <path d="M12 20V22" strokeLinecap="round" />
                        <path d="M5 10C5 6.13401 8.13401 3 12 3C15.866 3 19 6.13401 19 10V14L21 18H3L5 14V10Z" strokeLinejoin="round" />
                        <path d="M9 20C9 21.6569 10.3431 23 12 23C13.6569 23 15 21.6569 15 20" strokeLinecap="round" />
                      </svg>
                    </div>
                    <span className="text-[9px] md:text-[10px] text-amber-500/50 uppercase tracking-[0.2em] group-hover:text-amber-400/80 transition-colors">{t('meditation.bell')}</span>
                  </motion.button>
                </div>

                <button
                  onClick={handleStop}
                  className="flex items-center gap-2 md:gap-3 px-6 py-2 md:px-8 md:py-3 bg-transparent hover:bg-white/5 text-white/40 hover:text-white/80 border border-white/10 hover:border-white/30 rounded-full transition-all duration-500"
                >
                  <Square size={12} className="md:w-3.5 md:h-3.5" fill="currentColor" />
                  <span className="tracking-[0.2em] uppercase text-[10px] md:text-xs">{t('meditation.stop')}</span>
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="completion"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="flex flex-col items-center text-center relative"
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[400px] md:h-[400px] bg-amber-500/10 rounded-full blur-[80px] md:blur-[100px] pointer-events-none" />

                <motion.div 
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full border border-amber-500/30 flex items-center justify-center mb-8 md:mb-12 relative z-10"
                >
                  <div className="absolute inset-0 bg-amber-500/10 rounded-full blur-md" />
                  <Wind className="text-amber-300 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)] w-10 h-10 md:w-12 md:h-12" strokeWidth={1} />
                </motion.div>
                
                <h3 className="text-2xl md:text-4xl text-amber-100 font-light tracking-[0.3em] uppercase mb-4 md:mb-6 drop-shadow-md relative z-10 px-4">
                  {t('meditation.completed')}
                </h3>
                <p className="text-amber-200/50 font-light tracking-[0.15em] text-xs md:text-base mb-12 md:mb-16 max-w-md relative z-10 leading-relaxed italic px-6">
                  "{language === 'vi' ? 'Tâm tĩnh lặng, vạn sự bình an.' : 'A quiet mind brings universal peace.'}"
                </p>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCompletion(false)}
                  className="px-10 py-3 md:px-12 md:py-4 bg-transparent hover:bg-amber-900/20 text-amber-200/80 hover:text-amber-100 border border-amber-500/30 hover:border-amber-400/60 rounded-full transition-all duration-500 tracking-[0.25em] uppercase text-[10px] md:text-xs font-medium relative z-10"
                >
                  {t('meditation.back')}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
