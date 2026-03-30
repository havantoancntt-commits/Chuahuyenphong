import { motion } from 'framer-motion';
import { Flame, ArrowDownToLine, HeartHandshake, Sparkles, Volume2, VolumeX, BookOpen, Feather } from 'lucide-react';

interface UIOverlayProps {
  onLightIncense: () => void;
  onBow: () => void;
  onDonate: () => void;
  onAIGuidance: () => void;
  onOpenRepentance: () => void;
  onOpenGuide: () => void;
  isIncenseLit: boolean;
  isBowing: boolean;
  audioEnabled: boolean;
  setAudioEnabled: (enabled: boolean) => void;
}

export function UIOverlay({ 
  onLightIncense, 
  onBow, 
  onDonate, 
  onAIGuidance, 
  onOpenRepentance,
  onOpenGuide,
  isIncenseLit,
  isBowing,
  audioEnabled,
  setAudioEnabled
}: UIOverlayProps) {
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 sm:p-6 z-10">
      {/* Top Bar */}
      <div className="flex justify-between items-start pt-safe">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="text-amber-100/80 tracking-[0.15em] sm:tracking-[0.2em] uppercase text-xs sm:text-sm font-light drop-shadow-md"
        >
          Huyền Phong Phật Đạo
        </motion.div>
        
        <div className="flex gap-2">
          <button 
            onClick={onOpenGuide}
            className="pointer-events-auto p-2 sm:p-3 rounded-full bg-black/40 backdrop-blur-xl border border-amber-500/30 text-amber-200/90 hover:text-amber-100 hover:bg-amber-500/30 hover:border-amber-400/50 hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all duration-500"
            title="Hướng dẫn lễ bái"
          >
            <BookOpen size={20} strokeWidth={1.5} />
          </button>
          <button 
            onClick={() => setAudioEnabled(!audioEnabled)}
            className="pointer-events-auto p-2 sm:p-3 rounded-full bg-black/40 backdrop-blur-xl border border-amber-500/30 text-amber-200/90 hover:text-amber-100 hover:bg-amber-500/30 hover:border-amber-400/50 hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all duration-500"
            title={audioEnabled ? "Tắt âm thanh" : "Bật âm thanh"}
          >
            {audioEnabled ? <Volume2 size={20} strokeWidth={1.5} /> : <VolumeX size={20} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="flex flex-col items-center pb-4 sm:pb-8 pb-safe w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 1 }}
          className="flex flex-wrap justify-center gap-2 sm:gap-4 md:gap-6 mb-4 sm:mb-6 w-full px-2"
        >
          <ActionButton 
            icon={<Flame size={22} strokeWidth={1.5} />} 
            label="Dâng Hương" 
            onClick={onLightIncense} 
            disabled={isIncenseLit || isBowing}
          />
          <ActionButton 
            icon={<ArrowDownToLine size={22} strokeWidth={1.5} />} 
            label="Lễ Bái" 
            onClick={onBow} 
            disabled={isBowing}
          />
          <ActionButton 
            icon={<Feather size={22} strokeWidth={1.5} />} 
            label="Sám Hối" 
            onClick={onOpenRepentance} 
            disabled={isBowing}
          />
          <ActionButton 
            icon={<Sparkles size={22} strokeWidth={1.5} />} 
            label="Xin Xăm" 
            onClick={onAIGuidance} 
            disabled={isBowing}
          />
          <ActionButton 
            icon={<HeartHandshake size={22} strokeWidth={1.5} />} 
            label="Cúng Dường" 
            onClick={onDonate} 
            disabled={isBowing}
            highlight
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 2 }}
          className="text-center text-white/30 text-[9px] sm:text-[10px] font-light px-4 tracking-wider uppercase"
        >
          Trải nghiệm tĩnh tâm • Không thay thế nghi thức thực tế
        </motion.div>
      </div>
    </div>
  );
}

function ActionButton({ 
  icon, 
  label, 
  onClick, 
  disabled = false,
  highlight = false
}: { 
  icon: React.ReactNode; 
  label: string; 
  onClick: () => void; 
  disabled?: boolean;
  highlight?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        pointer-events-auto flex flex-col items-center justify-center gap-2 
        w-[76px] h-[86px] sm:w-20 sm:h-24 md:w-28 md:h-32 rounded-2xl backdrop-blur-xl transition-all duration-500
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'hover:-translate-y-1 cursor-pointer active:scale-95'}
        ${highlight 
          ? 'bg-gradient-to-b from-amber-900/60 to-amber-950/60 border border-amber-400/40 text-amber-200 shadow-[0_4px_20px_rgba(245,158,11,0.2)] hover:shadow-[0_4px_30px_rgba(245,158,11,0.4)] hover:border-amber-300/60' 
          : 'bg-black/50 border border-white/10 text-white/80 hover:text-white hover:bg-white/20 hover:border-amber-200/30 hover:shadow-[0_4px_20px_rgba(255,255,255,0.1)]'
        }
      `}
    >
      <div className={`transition-transform duration-500 ${!disabled && 'group-hover:scale-110'} ${highlight ? 'text-amber-400' : ''}`}>
        {icon}
      </div>
      <span className="text-[9px] sm:text-[10px] md:text-xs tracking-[0.1em] uppercase font-medium text-center px-1 leading-tight">
        {label}
      </span>
    </button>
  );
}
