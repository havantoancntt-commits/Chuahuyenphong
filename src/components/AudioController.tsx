import { useEffect, useRef } from 'react';

export function AudioController({ 
  enabled, 
  hasDonated,
  isIncenseLit,
  isBowing
}: { 
  enabled: boolean, 
  hasDonated: boolean,
  isIncenseLit: boolean,
  isBowing: boolean
}) {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const windNodeRef = useRef<BiquadFilterNode | null>(null);
  const windGainRef = useRef<GainNode | null>(null);
  const ambientAudioRef = useRef<HTMLAudioElement | null>(null);
  
  // Track previous states to trigger sounds on change
  const prevIncenseRef = useRef(isIncenseLit);
  const prevBowingRef = useRef(isBowing);

  // Helper to play a chime
  const playChime = (freq: number = 880, duration: number = 3) => {
    if (!audioCtxRef.current || audioCtxRef.current.state !== 'running') return;
    
    const t = audioCtxRef.current.currentTime;
    const osc = audioCtxRef.current.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;
    
    const gain = audioCtxRef.current.createGain();
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.1, t + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
    
    osc.connect(gain);
    gain.connect(audioCtxRef.current.destination);
    
    osc.start(t);
    osc.stop(t + duration);
  };

  useEffect(() => {
    if (!enabled) {
      if (audioCtxRef.current) {
        audioCtxRef.current.suspend();
      }
      if (ambientAudioRef.current) {
        ambientAudioRef.current.pause();
      }
      return;
    }

    // Start background ambience
    if (!ambientAudioRef.current) {
      ambientAudioRef.current = new Audio('https://cdn.pixabay.com/download/audio/2022/01/18/audio_6064f777c6.mp3?filename=forest-with-birds-and-river-14488.mp3');
      ambientAudioRef.current.loop = true;
      ambientAudioRef.current.volume = 0.2;
    }
    ambientAudioRef.current.play().catch(e => console.log(e));

    if (!audioCtxRef.current) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) {
          console.warn("AudioContext is not supported in this browser.");
          return;
        }
        audioCtxRef.current = new AudioContextClass();
      } catch (e) {
        console.warn("Failed to initialize AudioContext:", e);
        return;
      }
      
      // 1. Synthesize Wind (White Noise + Lowpass Filter + LFO)
      const bufferSize = audioCtxRef.current.sampleRate * 2; // 2 seconds of noise
      const noiseBuffer = audioCtxRef.current.createBuffer(1, bufferSize, audioCtxRef.current.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const noiseSource = audioCtxRef.current.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      const windFilter = audioCtxRef.current.createBiquadFilter();
      windFilter.type = 'lowpass';
      windFilter.frequency.value = 400; // Deep wind sound
      windNodeRef.current = windFilter;

      const windGain = audioCtxRef.current.createGain();
      windGain.gain.value = 0.1; // Soft wind
      windGainRef.current = windGain;

      // LFO for wind sweeping effect
      const lfo = audioCtxRef.current.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.1; // Slow sweep
      
      const lfoGain = audioCtxRef.current.createGain();
      lfoGain.gain.value = 200; // Sweep range
      
      lfo.connect(lfoGain);
      lfoGain.connect(windFilter.frequency);
      lfo.start();

      noiseSource.connect(windFilter);
      windFilter.connect(windGain);
      windGain.connect(audioCtxRef.current.destination);
      noiseSource.start();

      // 2. Synthesize Temple Bell (Periodic)
      const playBell = () => {
        if (!audioCtxRef.current || audioCtxRef.current.state !== 'running') return;
        
        const t = audioCtxRef.current.currentTime;
        
        // Fundamental frequency
        const osc1 = audioCtxRef.current.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.value = 220; // A3
        
        // Overtone
        const osc2 = audioCtxRef.current.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.value = 440; // A4
        
        const gainNode = audioCtxRef.current.createGain();
        gainNode.gain.setValueAtTime(0, t);
        gainNode.gain.linearRampToValueAtTime(0.3, t + 0.1); // Attack
        gainNode.gain.exponentialRampToValueAtTime(0.001, t + 8); // Long decay
        
        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(audioCtxRef.current.destination);
        
        osc1.start(t);
        osc2.start(t);
        osc1.stop(t + 8);
        osc2.stop(t + 8);
      };

      // Play bell every 30 seconds
      const bellInterval = setInterval(playBell, 30000);
      
      // Play initial bell after a short delay
      setTimeout(playBell, 2000);

      return () => {
        clearInterval(bellInterval);
        noiseSource.stop();
        lfo.stop();
        audioCtxRef.current?.close();
        audioCtxRef.current = null;
      };
    } else if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  }, [enabled]);

  // React to interactions
  useEffect(() => {
    if (isIncenseLit && !prevIncenseRef.current) {
      playChime(1046.50, 2); // C6
    }
    prevIncenseRef.current = isIncenseLit;
  }, [isIncenseLit]);

  useEffect(() => {
    if (isBowing && !prevBowingRef.current) {
      playChime(523.25, 4); // C5
    }
    prevBowingRef.current = isBowing;
  }, [isBowing]);

  // React to donation (increase wind slightly, play a special chime)
  useEffect(() => {
    if (hasDonated && audioCtxRef.current && windGainRef.current) {
      const t = audioCtxRef.current.currentTime;
      // Increase wind slightly
      windGainRef.current.gain.linearRampToValueAtTime(0.2, t + 2);
      
      // Play a high, pure chime
      playChime(880, 5); // A5
    }
  }, [hasDonated]);

  return null;
}
