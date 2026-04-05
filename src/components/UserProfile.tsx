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
        className="relative w-full max-w-md bg-[#110e0c] border border-amber-900/40 rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-black/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
              <User size={20} />
            </div>
            <h2 className="text-xl text-amber-100 font-light tracking-widest uppercase">
              {t('profile.title')}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="text-white/40 hover:text-white/80 transition-colors"
          >
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Dharma ID */}
          <div className="bg-black/40 border border-white/5 rounded-2xl p-4 flex items-center justify-between group">
            <div className="flex flex-col">
              <span className="text-[10px] text-white/40 uppercase tracking-widest mb-1">
                {t('profile.dharma_id')}
              </span>
              <span className="text-amber-200 font-mono text-lg tracking-wider">
                {stats.dharmaId}
              </span>
            </div>
            <button 
              onClick={copyId}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-amber-400 transition-all"
              title={t('profile.copy_id')}
            >
              {copied ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
            </button>
          </div>

          {/* Main Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <StatCard 
              icon={<Award className="text-amber-400" size={20} />}
              label={t('profile.merit')}
              value={stats.meritPoints.toLocaleString()}
              subValue="Công đức"
            />
            <StatCard 
              icon={<Flame className="text-orange-400" size={20} />}
              label={t('profile.streak')}
              value={stats.streak.toString()}
              subValue="Ngày liên tiếp"
            />
          </div>

          {/* Detailed Stats */}
          <div className="space-y-4">
            <h3 className="text-xs text-white/30 uppercase tracking-[0.3em] font-medium pl-1">
              {t('profile.stats')}
            </h3>
            <div className="space-y-2">
              <DetailRow 
                icon={<Bell size={16} />}
                label={t('profile.bell_rings')}
                value={stats.totalBellRings}
              />
              <DetailRow 
                icon={<Heart size={16} />}
                label={t('profile.prayers')}
                value={stats.totalPrayers}
              />
              <DetailRow 
                icon={<Sparkles size={16} />}
                label={t('profile.repentance')}
                value={stats.totalRepentance}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-black/20 border-t border-white/5 text-center">
          <p className="text-[10px] text-white/20 uppercase tracking-[0.2em] leading-relaxed">
            Dữ liệu được lưu an toàn trên thiết bị của bạn.<br />
            Tu tập tinh tấn, vạn sự bình an.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function StatCard({ icon, label, value, subValue }: { icon: React.ReactNode, label: string, value: string, subValue: string }) {
  return (
    <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/5 rounded-2xl p-4 flex flex-col items-center text-center">
      <div className="mb-2">{icon}</div>
      <span className="text-[10px] text-white/30 uppercase tracking-widest mb-1">{label}</span>
      <span className="text-xl text-white font-light tracking-wider">{value}</span>
    </div>
  );
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode, label: string, value: number }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-transparent hover:border-white/10 transition-colors">
      <div className="flex items-center gap-3 text-white/60">
        {icon}
        <span className="text-sm font-light tracking-wide">{label}</span>
      </div>
      <span className="text-amber-200/80 font-medium">{value}</span>
    </div>
  );
}
