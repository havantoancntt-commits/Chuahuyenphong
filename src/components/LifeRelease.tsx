import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../lib/i18n';
import { useUserStats } from '../lib/userStats';
import { ChevronLeft, Bird, Fish, Heart, Sparkles, Droplets, Wind, Volume2, VolumeX } from 'lucide-react';

interface LifeReleaseProps {
  onClose: () => void;
}

type ReleaseType = 'bird' | 'fish';

export function LifeRelease({ onClose }: LifeReleaseProps) {
  const { t, language } = useLanguage();
  const { addMerit } = useUserStats();
  const [selectedType, setSelectedType] = useState<ReleaseType | null>(null);
  const [isReleasing, setIsReleasing] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [releasedCount, setReleasedCount] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(true);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio
    audioRef.current = new Audio();
    audioRef.current.loop = true;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      const newSrc = selectedType === 'bird' 
        ? 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=birds-singing-calm-river-nature-ambient-sound-118558.mp3'
        : selectedType === 'fish'
        ? 'https://cdn.pixabay.com/download/audio/2021/09/06/audio_4041b6c7a7.mp3?filename=water-stream-1-14465.mp3'
        : '';
        
      if (newSrc && audioRef.current.src !== newSrc) {
        audioRef.current.src = newSrc;
      }
      
      if (selectedType && audioEnabled) {
        audioRef.current.play().catch(e => console.log('Audio play failed:', e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [selectedType, audioEnabled]);

  const handleRelease = () => {
    setIsReleasing(true);
    
    // Play release sound effect
    if (audioEnabled) {
      const releaseSound = new Audio(selectedType === 'bird' 
        ? 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=bird-flapping-wings-103853.mp3'
        : 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3?filename=water-splash-199583.mp3'
      );
      releaseSound.volume = 0.5;
      releaseSound.play().catch(e => console.log('Release sound failed:', e));
    }

    // Simulate release animation duration
    setTimeout(() => {
      setIsReleasing(false);
      setShowCompletion(true);
      setReleasedCount(prev => prev + 1);
      addMerit(100); // 100 merit points for releasing a life
    }, 3000);
  };

  const resetRelease = () => {
    setShowCompletion(false);
    setSelectedType(null);
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/95 ">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative w-full max-w-2xl h-[80vh] max-h-[800px] flex flex-col bg-[#0a1118] border border-cyan-500/20 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.8)] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-cyan-500/10 bg-black/40 shrink-0 z-20 relative">
          <button 
            onClick={() => selectedType ? setSelectedType(null) : onClose()}
            className="flex items-center gap-1 text-cyan-500/80 hover:text-cyan-400 transition-colors text-sm font-light tracking-wider"
          >
            <ChevronLeft size={18} />
            {t('release.back')}
          </button>
          <span className="text-cyan-200/40 text-[10px] tracking-[0.2em] uppercase font-medium">
            {t('release.title')}
          </span>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setAudioEnabled(!audioEnabled)}
              className="text-cyan-500/50 hover:text-cyan-400 transition-colors"
            >
              {audioEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
            <div className="w-16 text-right text-cyan-500/50 text-xs tracking-widest">
              {releasedCount > 0 && `${releasedCount} 🕊️`}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden relative">
          {/* Background Effects */}
          <div className="absolute inset-0 pointer-events-none">
            {selectedType === 'fish' && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 1.5 }}
                className="absolute inset-0 bg-gradient-to-b from-[#0a1118] via-[#0f2a3f] to-[#0a1118] opacity-60"
              />
            )}
            {selectedType === 'bird' && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 1.5 }}
                className="absolute inset-0 bg-gradient-to-b from-[#1a2b3c] via-[#0a1118] to-[#0a1118] opacity-60"
              />
            )}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1)_0%,transparent_70%)]" />
            
            {/* Animated light rays */}
            {selectedType && (
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_0deg,rgba(6,182,212,0.05)_10deg,transparent_20deg,transparent_180deg,rgba(6,182,212,0.05)_190deg,transparent_200deg)] pointer-events-none"
              />
            )}
          </div>

          <AnimatePresence mode="wait">
            {!selectedType ? (
              <motion.div
                key="selection"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-full flex flex-col items-center justify-center p-8 relative z-10"
              >
                <div className="w-20 h-20 rounded-full bg-cyan-900/20 flex items-center justify-center mb-8 border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                  <Heart className="text-cyan-400" size={32} strokeWidth={1.5} />
                </div>
                <h2 className="text-2xl sm:text-3xl text-cyan-100 font-light tracking-widest uppercase mb-4 text-center">
                  {t('release.choose')}
                </h2>
                <p className="text-cyan-200/60 text-sm sm:text-base font-light text-center max-w-md mb-12 leading-relaxed">
                  {t('release.desc')}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-lg">
                  <button
                    onClick={() => setSelectedType('bird')}
                    className="group relative flex flex-col items-center justify-center p-8 bg-black/40 border border-cyan-500/20 rounded-2xl hover:bg-cyan-900/20 hover:border-cyan-400/50 transition-all duration-500 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <Wind className="text-cyan-500/50 group-hover:text-cyan-400 mb-4 transition-colors duration-500" size={40} strokeWidth={1} />
                    <span className="text-cyan-100 tracking-widest uppercase font-medium relative z-10">
                      {t('release.bird')}
                    </span>
                  </button>

                  <button
                    onClick={() => setSelectedType('fish')}
                    className="group relative flex flex-col items-center justify-center p-8 bg-black/40 border border-cyan-500/20 rounded-2xl hover:bg-cyan-900/20 hover:border-cyan-400/50 transition-all duration-500 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <Droplets className="text-cyan-500/50 group-hover:text-cyan-400 mb-4 transition-colors duration-500" size={40} strokeWidth={1} />
                    <span className="text-cyan-100 tracking-widest uppercase font-medium relative z-10">
                      {t('release.fish')}
                    </span>
                  </button>
                </div>
              </motion.div>
            ) : showCompletion ? (
              <motion.div
                key="completion"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="h-full flex flex-col items-center justify-center p-8 text-center relative z-10"
              >
                <motion.div 
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
                  className="w-28 h-28 rounded-full bg-gradient-to-br from-cyan-500/20 to-cyan-900/40 flex items-center justify-center mb-8 border border-cyan-400/40 shadow-[0_0_50px_rgba(6,182,212,0.3),inset_0_0_20px_rgba(6,182,212,0.2)]  relative z-10"
                >
                  <Sparkles className="text-cyan-300 drop-shadow-lg" size={48} strokeWidth={1.5} />
                </motion.div>
                <h3 className="text-3xl sm:text-4xl text-cyan-100 font-light tracking-widest uppercase mb-4 drop-shadow-md">
                  {t('release.success')}
                </h3>
                <p className="text-cyan-200/70 text-base sm:text-lg font-light max-w-md mb-12 leading-relaxed drop-shadow-sm">
                  {t('release.merit')}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetRelease}
                  className="px-10 py-3.5 bg-cyan-900/30 border border-cyan-500/40 text-cyan-200 hover:text-cyan-100 hover:bg-cyan-800/40 hover:border-cyan-400/60 rounded-full tracking-[0.2em] uppercase text-sm font-medium transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.15)] relative z-10"
                >
                  {t('release.continue')}
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="action"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center p-8 relative z-10"
              >
                {/* Animation Container */}
                <div className="relative w-64 h-64 mb-12 flex items-center justify-center">
                  {/* Glowing Orb */}
                  <motion.div
                    animate={{
                      scale: isReleasing ? [1, 2, 0] : [1, 1.1, 1],
                      opacity: isReleasing ? [0.5, 0.8, 0] : [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: isReleasing ? 2.5 : 4,
                      repeat: isReleasing ? 0 : Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute inset-0 rounded-full bg-cyan-400/20 blur-3xl"
                  />
                  
                  {/* Icon */}
                  <motion.div
                    animate={isReleasing ? {
                      y: selectedType === 'bird' ? -400 : 400,
                      x: selectedType === 'bird' ? [0, -80, 80, -30] : [0, 50, -50, 20],
                      scale: [1, 1.8, 0.1],
                      opacity: [1, 1, 0],
                      rotate: selectedType === 'bird' ? [0, -15, 15, 0] : [0, 20, -20, 0]
                    } : {
                      y: [0, -15, 0],
                      rotate: [0, 2, -2, 0]
                    }}
                    transition={{
                      duration: isReleasing ? 3.5 : 5,
                      repeat: isReleasing ? 0 : Infinity,
                      ease: isReleasing ? "easeIn" : "easeInOut"
                    }}
                    className="relative z-10 text-cyan-200 drop-shadow-[0_0_25px_rgba(6,182,212,0.8)]"
                  >
                    {selectedType === 'bird' ? <Bird size={100} strokeWidth={1.2} /> : <Fish size={100} strokeWidth={1.2} />}
                  </motion.div>

                  {/* Multiple entities during release */}
                  {isReleasing && (
                    <div className="absolute inset-0 pointer-events-none">
                      {[...Array(15)].map((_, i) => (
                        <motion.div
                          key={`entity-${i}`}
                          initial={{ opacity: 0, scale: 0.2, x: 0, y: 0 }}
                          animate={{
                            opacity: [0, 1, 0],
                            scale: [0.2, Math.random() * 0.8 + 0.5, 0.1],
                            x: selectedType === 'bird' 
                              ? (Math.random() - 0.5) * 400 
                              : (Math.random() - 0.5) * 300,
                            y: selectedType === 'bird' 
                              ? -300 - Math.random() * 200 
                              : 300 + Math.random() * 200,
                            rotate: selectedType === 'bird' 
                              ? (Math.random() - 0.5) * 45 
                              : (Math.random() - 0.5) * 60
                          }}
                          transition={{ 
                            duration: 2 + Math.random() * 1.5, 
                            ease: "easeOut", 
                            delay: Math.random() * 0.8 
                          }}
                          className="absolute top-1/2 left-1/2 text-cyan-300/80 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]"
                        >
                          {selectedType === 'bird' ? <Bird size={30 + Math.random() * 20} strokeWidth={1.5} /> : <Fish size={30 + Math.random() * 20} strokeWidth={1.5} />}
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Particles during release */}
                  {isReleasing && (
                    <div className="absolute inset-0 pointer-events-none">
                      {[...Array(40)].map((_, i) => (
                        <motion.div
                          key={`particle-${i}`}
                          initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                          animate={{
                            opacity: [1, 0.8, 0],
                            scale: Math.random() * 4 + 1,
                            x: (Math.random() - 0.5) * 500,
                            y: (Math.random() - 0.5) * 500,
                          }}
                          transition={{ 
                            duration: 1.5 + Math.random() * 1.5, 
                            ease: "easeOut", 
                            delay: Math.random() * 0.5 
                          }}
                          className={`absolute top-1/2 left-1/2 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.8)] ${
                            selectedType === 'bird' ? 'bg-white/80 w-1 h-1' : 'bg-cyan-400/80 w-2 h-2'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <AnimatePresence>
                  {!isReleasing && (
                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      onClick={handleRelease}
                      className="group relative px-12 py-4 bg-cyan-900/30 border border-cyan-500/40 rounded-full overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/20 to-cyan-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                      <span className="relative z-10 text-cyan-100 tracking-[0.3em] uppercase font-medium text-sm drop-shadow-md">
                        {t('release.action')}
                      </span>
                    </motion.button>
                  )}
                </AnimatePresence>
                
                {!isReleasing && (
                  <motion.p 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="mt-6 text-cyan-500/50 text-xs tracking-widest uppercase"
                  >
                    {t('release.tap')}
                  </motion.p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
