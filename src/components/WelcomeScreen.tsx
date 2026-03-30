import { motion } from 'framer-motion';
import { useLanguage } from '../lib/i18n';
import { Users, Eye, ArrowRight } from 'lucide-react';

interface WelcomeScreenProps {
  onEnter: () => void;
  stats: { onlineUsers: number; totalVisits: number };
}

export function WelcomeScreen({ onEnter, stats }: WelcomeScreenProps) {
  const { t } = useLanguage();
  const { onlineUsers, totalVisits } = stats;

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-[#050505] font-serif">
      {/* Majestic Gate Background */}
      <div 
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat opacity-30 mix-blend-luminosity"
        style={{ filter: 'contrast(1.2) brightness(0.8)' }}
      />
      
      {/* Dark gradient overlays for depth and focus */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/80 via-[#050505]/40 to-[#050505]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050505_80%)]" />

      {/* Glowing atmospheric effects (Dạ quang) */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[100vw] md:w-[60vw] h-[40vh] bg-amber-500/15 blur-[100px] rounded-full pointer-events-none mix-blend-screen" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[50vw] md:w-[30vw] h-[20vh] bg-yellow-300/20 blur-[60px] rounded-full pointer-events-none mix-blend-screen" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2.5, ease: [0.2, 0.8, 0.2, 1] }}
        className="relative z-10 flex flex-col items-center w-full max-w-5xl px-4 md:px-8"
      >
        {/* Top Decorative Element */}
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, duration: 1.5 }}
          className="mb-8 flex flex-col items-center"
        >
          <div className="w-1 h-12 bg-gradient-to-b from-transparent via-amber-400 to-transparent opacity-80" />
          <div className="w-3 h-3 rotate-45 border border-amber-400 bg-amber-500/20 shadow-[0_0_15px_rgba(251,191,36,0.8)] mt-2" />
        </motion.div>

        {/* Glowing Neon Sign (Phát sáng dạ quang) */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl mb-12 tracking-[0.15em] md:tracking-[0.2em] font-medium text-center uppercase leading-[1.2] md:leading-tight flex flex-col items-center">
          <span 
            className="block text-[#FFFBEB] drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]" 
            style={{ 
              textShadow: '0 0 10px #FFFBEB, 0 0 20px #FDE68A, 0 0 40px #F59E0B, 0 0 80px #D97706, 0 0 120px #B45309' 
            }}
          >
            HUYỀN PHONG
          </span>
          <span 
            className="block text-[#FFFBEB] drop-shadow-[0_0_20px_rgba(255,255,255,0.8)] mt-2 md:mt-4" 
            style={{ 
              textShadow: '0 0 10px #FFFBEB, 0 0 20px #FDE68A, 0 0 40px #F59E0B, 0 0 80px #D97706, 0 0 120px #B45309' 
            }}
          >
            PHẬT ĐẠO
          </span>
        </h1>

        {/* Bottom Decorative Element */}
        <motion.div 
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 1.5, duration: 1.5 }}
          className="flex items-center justify-center w-full max-w-md mb-12 opacity-80"
        >
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-amber-400/80 to-transparent shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
          <div className="mx-6 w-2 h-2 rotate-45 bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.8)]" />
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-amber-400/80 to-transparent shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
        </motion.div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1.5 }}
          className="mb-12 text-xs md:text-sm lg:text-base font-light tracking-[0.25em] text-center text-amber-100/80 uppercase max-w-2xl leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
        >
          {t('app.headphone_prompt')}
        </motion.p>

        {/* Premium Button - Optimized for clicking */}
        <motion.button 
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 2.5, duration: 1, type: "spring", stiffness: 100 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onEnter}
          className="group relative px-12 md:px-16 py-6 md:py-8 rounded-full overflow-hidden cursor-pointer shadow-[0_0_50px_rgba(245,158,11,0.3)] hover:shadow-[0_0_80px_rgba(245,158,11,0.6)] transition-all duration-500 mb-16"
        >
          {/* Button Background & Border */}
          <div className="absolute inset-0 bg-gradient-to-b from-amber-900/40 to-black/80 backdrop-blur-xl border-2 border-amber-500/60 rounded-full transition-all duration-500 group-hover:border-amber-300 group-hover:bg-amber-800/40" />
          
          {/* Pulsating Glow */}
          <div className="absolute inset-0 opacity-50 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.5)_0%,transparent_70%)] animate-pulse" />
          
          {/* Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-100/30 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
          
          {/* Button Text */}
          <span className="relative z-10 flex items-center justify-center gap-3 text-amber-100 group-hover:text-white tracking-[0.3em] md:tracking-[0.4em] uppercase text-sm md:text-lg font-bold transition-colors duration-500 drop-shadow-[0_0_10px_rgba(251,191,36,1)]">
            {t('app.enter_temple')}
            <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-2 transition-transform duration-500" />
          </span>
        </motion.button>
        
        {/* Statistics Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 1 }}
          className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 text-amber-200/60 text-xs md:text-sm tracking-widest uppercase font-light"
        >
          <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full border border-amber-500/20 backdrop-blur-sm">
            <Users className="w-4 h-4 text-amber-400" />
            <span>{t('app.online_users')}: <strong className="text-amber-400 font-medium">{onlineUsers}</strong></span>
          </div>
          <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full border border-amber-500/20 backdrop-blur-sm">
            <Eye className="w-4 h-4 text-amber-400" />
            <span>{t('app.total_visits')}: <strong className="text-amber-400 font-medium">{totalVisits}</strong></span>
          </div>
        </motion.div>
      </motion.div>

      {/* Floating Particles (CSS) */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-amber-200/60 rounded-full blur-[1px]"
            style={{
              boxShadow: '0 0 10px rgba(251,191,36,0.8)'
            }}
            initial={{
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 10,
              opacity: Math.random() * 0.5 + 0.2,
              scale: Math.random() * 2 + 0.5,
            }}
            animate={{
              y: -50,
              x: `calc(${Math.random() * 100}vw)`,
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 15 + 10,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 10,
            }}
          />
        ))}
      </div>
    </div>
  );
}
