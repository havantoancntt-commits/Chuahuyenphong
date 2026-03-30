import React from 'react';
import MobileMenu from './components/MobileMenu';
import useIsMobile from './lib/useMediaQuery';

const App = ({
  onLightIncense,
  onBow,
  onDonate,
  onAIGuidance,
  onOpenRepentance,
  onOpenLegal,
  isIncenseLit,
  isBowing,
  audioEnabled,
  setAudioEnabled,
  stats
}) => {
  const isMobile = useIsMobile();

  return (
    <div>
      {!isMobile ? (
        <UIOverlay
          onLightIncense={onLightIncense}
          onBow={onBow}
          onDonate={onDonate}
          onAIGuidance={onAIGuidance}
          onOpenRepentance={onOpenRepentance}
          onOpenLegal={onOpenLegal}
          isIncenseLit={isIncenseLit}
          isBowing={isBowing}
          audioEnabled={audioEnabled}
          setAudioEnabled={setAudioEnabled}
          stats={stats}
        />
      ) : (
        <MobileMenu
          onLightIncense={onLightIncense}
          onBow={onBow}
          onDonate={onDonate}
          onAIGuidance={onAIGuidance}
          onOpenRepentance={onOpenRepentance}
          onOpenLegal={onOpenLegal}
          isIncenseLit={isIncenseLit}
          isBowing={isBowing}
          audioEnabled={audioEnabled}
          setAudioEnabled={setAudioEnabled}
          stats={stats}
        />
      )}
    </div>
  );
};

export default App;