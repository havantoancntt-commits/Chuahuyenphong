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
import { MeditationRoom } from './components/MeditationRoom';
import { PrayerBook } from './components/PrayerBook';
import { LifeRelease } from './components/LifeRelease';
import { GuideModal } from './components/GuideModal';
import { LegalModal } from './components/LegalModal';
import { UserProfile } from './components/UserProfile';
import { useLanguage } from './lib/i18n';
import { useUserStats } from './lib/userStats';

import { WelcomeScreen } from './components/WelcomeScreen';

export default function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [isSceneReady, setIsSceneReady] = useState(false);
  const [isIncenseLit, setIsIncenseLit] = useState(false);
  const [isBowing, setIsBowing] = useState(false);
  const [showDonation, setShowDonation] = useState(false);
  const [hasDonated, setHasDonated] = useState(false);
  const [showAIGuidance, setShowAIGuidance] = useState(false);
  const [showRepentance, setShowRepentance] = useState(false);
  const [showMeditation, setShowMeditation] = useState(false);
  const [showPrayerBook, setShowPrayerBook] = useState(false);
  const [showLifeRelease, setShowLifeRelease] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | 'contact' | null>(null);
  const [blessingMessage, setBlessingMessage] = useState<string | null>(null);
  const [bowMessage, setBowMessage] = useState<string | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const { t } = useLanguage();
  const { incrementBow, incrementIncense } = useUserStats();

  // Simulate scene loading for a smoother experience
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSceneReady(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Handle the bow animation trigger
  const handleBow = () => {
    if (isBowing) return;
    setIsBowing(true);
    incrementBow?.();
    setBowMessage(t('app.bow_message'));
    setTimeout(() => {
      setIsBowing(false);
      setBowMessage(null);
    }, 4500);
  };

  const handleDonateConfirm = () => {
    setHasDonated(true);
    setShowDonation(false);
    setBlessingMessage(t('app.donate_blessing'));
    setTimeout(() => setBlessingMessage(null), 6000);
  };

  return (
    <div className="relative w-full h-screen bg-[#050505] overflow-hidden font-serif">
      <AnimatePresence mode="wait">
        {!hasEntered && (
          <WelcomeScreen 
            key="welcome"
            onEnter={() => setHasEntered(true)} 
            isSceneReady={isSceneReady} 
          />
        )}
      </AnimatePresence>

      {/* 3D Scene */}
      <TempleScene 
        isIncenseLit={isIncenseLit} 
        isBowing={isBowing} 
        hasDonated={hasDonated} 
      />

      {/* Audio Controller */}
      <AudioController 
        enabled={audioEnabled && !showMeditation && !showRepentance && !showLifeRelease} 
        hasDonated={hasDonated} 
        isIncenseLit={isIncenseLit}
        isBowing={isBowing}
      />

      {/* UI Overlay */}
      <UIOverlay 
        onLightIncense={() => {
          setIsIncenseLit(true);
          setAudioEnabled(true);
          incrementIncense?.();
          setBlessingMessage(t('blessing.incense') !== 'blessing.incense' ? t('blessing.incense') : 'Tâm hương giải thoát');
          setTimeout(() => setBlessingMessage(null), 5000);
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
        onOpenMeditation={() => {
          setShowMeditation(true);
          setAudioEnabled(true);
        }}
        onOpenPrayerBook={() => {
          setShowPrayerBook(true);
          setAudioEnabled(true);
        }}
        onOpenLifeRelease={() => {
          setShowLifeRelease(true);
          setAudioEnabled(true);
        }}
        onOpenGuide={() => setShowGuide(true)}
        onOpenProfile={() => setShowProfile(true)}
        onOpenLegal={(type) => setLegalModalType(type)}
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

        {showRepentance && (
          <RepentanceRoom 
            onClose={() => setShowRepentance(false)} 
          />
        )}

        {showMeditation && (
          <MeditationRoom 
            onClose={() => setShowMeditation(false)} 
          />
        )}

        {showPrayerBook && (
          <PrayerBook 
            onClose={() => setShowPrayerBook(false)} 
          />
        )}

        {showLifeRelease && (
          <LifeRelease 
            onClose={() => setShowLifeRelease(false)} 
          />
        )}

        {showGuide && (
          <GuideModal 
            onClose={() => setShowGuide(false)} 
          />
        )}

        {showProfile && (
          <UserProfile 
            onClose={() => setShowProfile(false)} 
          />
        )}

        {legalModalType && (
          <LegalModal 
            type={legalModalType}
            onClose={() => setLegalModalType(null)} 
          />
        )}
      </AnimatePresence>

      {/* Blessing Message */}
      <AnimatePresence>
        {blessingMessage && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="absolute inset-0 pointer-events-none flex items-center justify-center z-50"
          >
            <div className="bg-black/40 backdrop-blur-md px-10 py-5 rounded-full border border-amber-400/20 text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 text-2xl sm:text-3xl tracking-[0.2em] shadow-[0_0_50px_rgba(251,191,36,0.2)] font-medium uppercase text-center">
              {blessingMessage}
            </div>
          </motion.div>
        )}

        {bowMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 1.5 }}
            className="absolute top-1/4 left-0 right-0 pointer-events-none flex items-center justify-center z-40"
          >
            <div className="text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-amber-100 text-lg sm:text-xl md:text-2xl tracking-[0.4em] font-medium uppercase text-center px-4 drop-shadow-[0_0_20px_rgba(251,191,36,0.5)]">
              {bowMessage}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
