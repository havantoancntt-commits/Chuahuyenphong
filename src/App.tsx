/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TempleScene } from './components/TempleScene';
import { UIOverlay } from './components/UIOverlay';
import { AudioController } from './components/AudioController';
import { DonationPanel } from './components/DonationPanel';
import { AIGuidance } from './components/AIGuidance';
import { RepentanceRoom } from './components/RepentanceRoom';
import { GuideModal } from './components/GuideModal';
import { useLanguage } from './lib/i18n';

import { WelcomeScreen } from './components/WelcomeScreen';
import { useStats } from './lib/useStats';

export default function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [isIncenseLit, setIsIncenseLit] = useState(false);
  const [isBowing, setIsBowing] = useState(false);
  const [showDonation, setShowDonation] = useState(false);
  const [hasDonated, setHasDonated] = useState(false);
  const [showAIGuidance, setShowAIGuidance] = useState(false);
  const [showRepentance, setShowRepentance] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [blessingMessage, setBlessingMessage] = useState<string | null>(null);
  const [bowMessage, setBowMessage] = useState<string | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const { t } = useLanguage();
  const stats = useStats();

  // Handle the bow animation trigger
  const handleBow = () => {
    if (isBowing) return;
    setIsBowing(true);
    setBowMessage(t('app.bow_message'));
    setTimeout(() => {
      setIsBowing(false);
      setTimeout(() => setBowMessage(null), 1000); // Fade out text slightly after bow ends
    }, 4500); // Bowing takes 4.5 seconds for a more deliberate, respectful pace
  };

  const handleDonateConfirm = () => {
    setHasDonated(true);
    setShowDonation(false);
    setBlessingMessage(t('app.donate_blessing'));
    setTimeout(() => setBlessingMessage(null), 6000);
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-serif">
      {/* 3D Scene */}
      <TempleScene 
        isIncenseLit={isIncenseLit} 
        isBowing={isBowing} 
        hasDonated={hasDonated} 
      />

      {/* Audio Controller */}
      <AudioController 
        enabled={audioEnabled} 
        hasDonated={hasDonated} 
        isIncenseLit={isIncenseLit}
        isBowing={isBowing}
      />

      {/* UI Overlay */}
      <UIOverlay 
        onLightIncense={() => {
          setIsIncenseLit(true);
          setAudioEnabled(true);
        }}
        onBow={() => {
          handleBow();
          setAudioEnabled(true);
        }}
        onDonate={() => {
          setShowDonation(true);
          setAudioEnabled(true);
        }}
        onAIGuidance={() => {
          setShowAIGuidance(true);
          setAudioEnabled(true);
        }}
        onOpenRepentance={() => {
          setShowRepentance(true);
          setAudioEnabled(true);
        }}
        onOpenGuide={() => setShowGuide(true)}
        isIncenseLit={isIncenseLit}
        isBowing={isBowing}
        audioEnabled={audioEnabled}
        setAudioEnabled={setAudioEnabled}
        stats={stats}
      />

      {/* Modals & Overlays */}
      <AnimatePresence>
        {showDonation && (
          <DonationPanel 
            onClose={() => setShowDonation(false)} 
            onConfirm={handleDonateConfirm} 
          />
        )}

        {showAIGuidance && (
          <AIGuidance 
            onClose={() => setShowAIGuidance(false)} 
          />
        )}

        {showRepentance && (
          <RepentanceRoom 
            onClose={() => setShowRepentance(false)} 
          />
        )}

        {showGuide && (
          <GuideModal 
            onClose={() => setShowGuide(false)} 
          />
        )}
      </AnimatePresence>

      {/* Blessing Message */}
      <AnimatePresence>
        {blessingMessage && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 pointer-events-none flex items-center justify-center z-50"
          >
            <div className="bg-gradient-to-b from-black/60 to-black/80 backdrop-blur-lg px-10 py-5 rounded-full border border-amber-400/40 text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 text-2xl sm:text-3xl tracking-[0.2em] shadow-[0_0_50px_rgba(251,191,36,0.3)] font-medium uppercase">
              {blessingMessage}
            </div>
          </motion.div>
        )}

        {bowMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 1.5 }}
            className="absolute top-1/4 left-0 right-0 pointer-events-none flex items-center justify-center z-40"
          >
            <div className="text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-amber-100 text-base sm:text-lg md:text-xl tracking-[0.4em] font-medium uppercase text-center px-4 drop-shadow-[0_0_20px_rgba(251,191,36,0.6)]">
              {bowMessage}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Initial Audio Prompt */}
      {!hasEntered && (
        <WelcomeScreen 
          onEnter={() => {
            setHasEntered(true);
            setAudioEnabled(true);
          }} 
          stats={stats}
        />
      )}
    </div>
  );
}
