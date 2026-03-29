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
import { GuideModal } from './components/GuideModal';

export default function App() {
  const [isIncenseLit, setIsIncenseLit] = useState(false);
  const [isBowing, setIsBowing] = useState(false);
  const [showDonation, setShowDonation] = useState(false);
  const [hasDonated, setHasDonated] = useState(false);
  const [showAIGuidance, setShowAIGuidance] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [blessingMessage, setBlessingMessage] = useState<string | null>(null);
  const [bowMessage, setBowMessage] = useState<string | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(false);

  // Handle the bow animation trigger
  const handleBow = () => {
    if (isBowing) return;
    setIsBowing(true);
    setBowMessage("Nam Mô Bổn Sư Thích Ca Mâu Ni Phật");
    setTimeout(() => {
      setIsBowing(false);
      setTimeout(() => setBowMessage(null), 1000); // Fade out text slightly after bow ends
    }, 4500); // Bowing takes 4.5 seconds for a more deliberate, respectful pace
  };

  const handleDonateConfirm = () => {
    setHasDonated(true);
    setShowDonation(false);
    setBlessingMessage("Tâm an vạn sự an");
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
        onOpenGuide={() => setShowGuide(true)}
        isIncenseLit={isIncenseLit}
        isBowing={isBowing}
        audioEnabled={audioEnabled}
        setAudioEnabled={setAudioEnabled}
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
            <div className="bg-black/40 backdrop-blur-md px-8 py-4 rounded-full border border-amber-500/30 text-amber-200 text-xl sm:text-2xl tracking-widest shadow-[0_0_30px_rgba(251,191,36,0.2)]">
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
            <div className="text-amber-200/70 text-sm sm:text-base md:text-lg tracking-[0.3em] font-light uppercase text-center px-4 drop-shadow-[0_0_15px_rgba(251,191,36,0.4)]">
              {bowMessage}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Initial Audio Prompt */}
      {!audioEnabled && (
        <div className="absolute inset-0 bg-black/80 z-50 flex flex-col items-center justify-center text-amber-100/80 backdrop-blur-sm">
          <h1 className="text-4xl md:text-6xl mb-8 tracking-widest text-amber-500 font-light drop-shadow-[0_0_15px_rgba(245,158,11,0.5)] text-center px-4">Huyền Phong Phật Đạo</h1>
          <p className="mb-8 text-base md:text-lg font-light tracking-wide text-center px-4">Vui lòng đeo tai nghe để có trải nghiệm tâm linh trọn vẹn nhất.</p>
          <button 
            onClick={() => setAudioEnabled(true)}
            className="px-8 py-3 border border-amber-500/50 rounded-full hover:bg-amber-500/10 transition-colors duration-500 tracking-widest uppercase text-sm"
          >
            Bước Vào Chánh Điện
          </button>
        </div>
      )}
    </div>
  );
}
