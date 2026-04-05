import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Award, Flame, Bell, Heart, Sparkles, Copy, Check } from 'lucide-react';
import { useLanguage } from '../lib/i18n';
import { useUserStats } from '../lib/userStats';

export function UserProfile({ onClose }: { onClose: () => void }) {
  const { t } = useLanguage();
  const { stats } = useUserStats();
  const [copied, setCopied] = useState(false);

  const copyId = () => {
    navigator.clipboard.writeText(stats.dharmaId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-md bg-[#0d0b0a] border border-amber-900/60 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden"
      >
        {/* Decorative Corner Elements */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-amber-500/20 rounded-tl-3xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-amber-500/20 rounded-tr-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-amber-500/20 rounded-bl-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-amber-500/20 rounded-br-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-amber-900/20 bg-gradient-to-b from-black/40 to-transparent">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <Sparkles className="text-amber-500/60" size={16} />
              <h2 className="text-2xl text-amber-100 font-light tracking-[0.3em] uppercase">
                {t('profile.title')}
              </h2>
            </div>
            <p className="text-[10px] text-amber-500/40 tracking-[0.2em] uppercase font-medium pl-7">
              Huyền Phong Phật Đạo • Spiritual Passport
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/5 text-white/20 hover:text-white/80 transition-all duration-500"
          >
            <X size={24} strokeWidth={1} />
          </button>
        </div>

        <div className="p-8 space-y-10">
          {/* Dharma ID - Styled as a Sacred Seal */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 to-amber-900/20 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
            <div className="relative bg-black/60 border border-amber-500/20 rounded-2xl p-6 flex items-center justify-between backdrop-blur-xl">
              <div className="flex flex-col">
                <span className="text-[9px] text-amber-500/60 uppercase tracking-[0.3em] mb-2 font-medium">
                  {t('profile.dharma_id')}
                </span>
                <span className="text-amber-200 font-mono text-xl tracking-widest drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]">
                  {stats.dharmaId.split('-')[0].toUpperCase()}
                  <span className="opacity-30">-{stats.dharmaId.split('-')[1]}</span>
                </span>
              </div>
              <button 
                onClick={copyId}
                className="p-3 rounded-xl bg-amber-500/5 hover:bg-amber-500/10 text-amber-500/40 hover:text-amber-400 transition-all duration-500 border border-amber-500/10"
                title={t('profile.copy_id')}
              >
                {copied ? <Check size={20} className="text-emerald-400" /> : <Copy size={20} strokeWidth={1.5} />}
              </button>
            </div>
          </div>

          {/* Main Stats Grid */}
          <div className="grid grid-cols-2 gap-6">
            <StatCard 
              icon={<Award className="text-amber-400/80" size={24} strokeWidth={1.2} />}
              label={t('profile.merit')}
              value={stats.meritPoints.toLocaleString()}
              subValue="Công đức"
            />
            <StatCard 
              icon={<Flame className="text-orange-500/80" size={24} strokeWidth={1.2} />}
              label={t('profile.streak')}
              value={stats.streak.toString()}
              subValue="Ngày liên tiếp"
            />
          </div>

          {/* Detailed Stats */}
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-900/40 to-transparent" />
              <h3 className="text-[10px] text-amber-500/40 uppercase tracking-[0.4em] font-medium">
                {t('profile.stats')}
              </h3>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-900/40 to-transparent" />
            </div>
            <div className="grid grid-cols-1 gap-3">
              <DetailRow 
                icon={<Bell size={18} strokeWidth={1.2} />}
                label={t('profile.bell_rings')}
                value={stats.totalBellRings}
              />
              <DetailRow 
                icon={<Heart size={18} strokeWidth={1.2} />}
                label={t('profile.prayers')}
                value={stats.totalPrayers}
              />
              <DetailRow 
                icon={<Sparkles size={18} strokeWidth={1.2} />}
                label={t('profile.repentance')}
                value={stats.totalRepentance}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 bg-black/40 border-t border-amber-900/20 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none" />
          <p className="text-[9px] text-amber-200/20 uppercase tracking-[0.3em] leading-relaxed font-light">
            Dữ liệu được bảo mật trên thiết bị cá nhân<br />
            <span className="text-amber-500/30">Tu tập tinh tấn • Vạn sự tùy duyên</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function StatCard({ icon, label, value, subValue }: { icon: React.ReactNode, label: string, value: string, subValue: string }) {
  return (
    <div className="relative group overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="relative bg-white/[0.02] border border-white/5 rounded-2xl p-6 flex flex-col items-center text-center transition-all duration-500 hover:border-amber-500/20 hover:-translate-y-1">
        <div className="mb-4 p-3 rounded-full bg-black/40 border border-white/5 group-hover:border-amber-500/30 transition-colors duration-500">
          {icon}
        </div>
        <span className="text-[9px] text-amber-500/40 uppercase tracking-[0.2em] mb-2 font-medium">{label}</span>
        <span className="text-2xl text-white font-light tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">{value}</span>
      </div>
    </div>
  );
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode, label: string, value: number }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-amber-500/20 hover:bg-white/[0.04] transition-all duration-500 group">
      <div className="flex items-center gap-4 text-white/40 group-hover:text-amber-100/80 transition-colors duration-500">
        <div className="p-2 rounded-lg bg-black/40 border border-white/5 group-hover:border-amber-500/20 transition-colors duration-500">
          {icon}
        </div>
        <span className="text-xs sm:text-sm font-light tracking-[0.1em] uppercase">{label}</span>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-amber-200/80 font-mono text-lg group-hover:text-amber-200 transition-colors duration-500">{value}</span>
        <div className="w-8 h-0.5 bg-amber-500/20 rounded-full mt-1 group-hover:w-12 transition-all duration-500" />
      </div>
    </div>
  );
}
