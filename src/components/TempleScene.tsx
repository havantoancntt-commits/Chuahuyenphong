import { useRef, useState, useMemo, Suspense, useCallback, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sparkles, Environment, Float, useTexture, PointMaterial, SpotLight, Text } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise, ChromaticAberration } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useUserStats } from '../lib/userStats';
import { useLanguage } from '../lib/i18n';

// Helper to create a soft particle texture
const createSoftParticleTexture = () => {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const context = canvas.getContext('2d');
    if (context) {
      const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(255,255,255,1)');
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      context.fillStyle = gradient;
      context.fillRect(0, 0, 32, 32);
    }
    return new THREE.CanvasTexture(canvas);
  } catch (e) {
    console.warn("Failed to create particle texture", e);
    return null;
  }
};

const sharedParticleTexture = createSoftParticleTexture();

// A stylized sitting Buddha statue representation
function Statue({ hasDonated, isBowing }: { hasDonated: boolean, isBowing: boolean }) {
  const haloRef = useRef<THREE.MeshBasicMaterial>(null);
  const innerHaloRef = useRef<THREE.MeshBasicMaterial>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  
  const statueMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#FFD700",
    metalness: 0.9,
    roughness: 0.15,
    emissive: new THREE.Color("#FFD700"),
    emissiveIntensity: 0.1,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    reflectivity: 1.0,
    sheen: 1.0,
    sheenRoughness: 0.2,
    sheenColor: new THREE.Color("#ffffff"),
    ior: 1.5,
  }), []);

  const heartLightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    // Subtle breathing animation for the statue's aura
    const baseEmissive = isBowing ? 0.6 : (hasDonated ? 0.4 : 0.1);
    const pulse = Math.sin(t * 0.5) * 0.05;
    statueMaterial.emissiveIntensity = THREE.MathUtils.lerp(statueMaterial.emissiveIntensity, baseEmissive + pulse, 0.05);

    if (haloRef.current) {
      const targetOpacity = isBowing ? 0.6 : (hasDonated ? 0.4 : 0.15);
      haloRef.current.opacity = THREE.MathUtils.lerp(haloRef.current.opacity, targetOpacity, 0.05);
    }
    if (innerHaloRef.current) {
      const targetOpacity = isBowing ? 0.9 : (hasDonated ? 0.6 : 0.25);
      innerHaloRef.current.opacity = THREE.MathUtils.lerp(innerHaloRef.current.opacity, targetOpacity, 0.05);
    }
    if (lightRef.current) {
      const targetIntensity = isBowing ? 2.5 : (hasDonated ? 1.8 : 0.6);
      const pulseLight = Math.sin(t * 2) * 0.2;
      lightRef.current.intensity = THREE.MathUtils.lerp(lightRef.current.intensity, targetIntensity + pulseLight, 0.05);
    }
    if (heartLightRef.current) {
      const heartPulse = Math.sin(t * 1.5) * 0.5 + 0.5;
      heartLightRef.current.intensity = (isBowing ? 1.5 : (hasDonated ? 1.0 : 0.3)) * heartPulse;
    }
  });

  return (
    <group position={[0, 1.2, -4]}>
      {/* Sacred Light */}
      <pointLight ref={lightRef} position={[0, 2, 1]} color="#ffcc00" distance={10} decay={2} />

      {/* Halo/Aura - Multiple layers for a sacred glow */}
      <mesh position={[0, 3.5, -0.7]}>
        <circleGeometry args={[4.8, 64]} />
        <meshBasicMaterial 
          ref={haloRef}
          color="#ffb347" 
          transparent 
          opacity={0.05} 
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, 3.5, -0.6]}>
        <circleGeometry args={[3.5, 64]} />
        <meshBasicMaterial 
          ref={innerHaloRef}
          color="#ffcc00" 
          transparent 
          opacity={0.1} 
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, 3.5, -0.55]}>
        <circleGeometry args={[2.2, 64]} />
        <meshBasicMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.05} 
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      
      {/* Dynamic Halo Rings */}
      <group position={[0, 3.5, -0.5]}>
        {[...Array(5)].map((_, i) => (
          <mesh key={`halo-ring-${i}`} rotation={[0, 0, (i * Math.PI) / 5]}>
            <torusGeometry args={[3.5 + i * 0.3, 0.008, 16, 100]} />
            <meshBasicMaterial color="#ffcc00" transparent opacity={0.15 - i * 0.02} blending={THREE.AdditiveBlending} />
          </mesh>
        ))}
      </group>
      
      {/* Sitting Buddha */}
      <Float speed={1.2} rotationIntensity={0.03} floatIntensity={0.08}>
        <group position={[0, 0.2, 0]}>
          {/* Heart Light - The "Soul" of the statue */}
          <pointLight ref={heartLightRef} position={[0, 1.8, 0.5]} color="#fff0b3" distance={3} decay={2} />
          
          {/* Crossed Legs (Lotus Position) */}
          <mesh castShadow receiveShadow position={[0, 0.4, 0.2]} scale={[1.8, 0.4, 1.2]} material={statueMaterial}>
            <sphereGeometry args={[1, 32, 32]} />
          </mesh>

          {/* Torso */}
          <mesh castShadow receiveShadow position={[0, 1.4, 0]} scale={[1.1, 1.3, 0.8]} material={statueMaterial}>
            <sphereGeometry args={[1, 32, 32]} />
          </mesh>

          {/* Shoulders / Chest */}
          <mesh castShadow receiveShadow position={[0, 2.2, 0]} scale={[1.4, 0.6, 0.7]} material={statueMaterial}>
            <sphereGeometry args={[1, 32, 32]} />
          </mesh>

          {/* Arms */}
          <mesh castShadow receiveShadow position={[-1.1, 1.5, 0]} rotation={[0, 0, -0.3]} scale={[0.3, 1.2, 0.4]} material={statueMaterial}>
            <sphereGeometry args={[1, 32, 32]} />
          </mesh>
          <mesh castShadow receiveShadow position={[1.1, 1.5, 0]} rotation={[0, 0, 0.3]} scale={[0.3, 1.2, 0.4]} material={statueMaterial}>
            <sphereGeometry args={[1, 32, 32]} />
          </mesh>

          {/* Hands resting on lap */}
          <mesh castShadow receiveShadow position={[0, 0.8, 0.7]} scale={[0.6, 0.2, 0.4]} material={statueMaterial}>
            <sphereGeometry args={[1, 32, 32]} />
          </mesh>

          {/* Neck */}
          <mesh castShadow receiveShadow position={[0, 2.7, 0]} material={statueMaterial}>
            <cylinderGeometry args={[0.3, 0.35, 0.4, 32]} />
          </mesh>

          {/* Head Group */}
          <group position={[0, 3.3, 0.1]}>
            {/* Main Head Sphere */}
            <mesh castShadow receiveShadow material={statueMaterial}>
              <sphereGeometry args={[0.65, 32, 32]} />
            </mesh>

            {/* Face Features */}
            <group position={[0, 0, 0.58]}>
              {/* Urna (Third Eye) */}
              <mesh position={[0, 0.2, 0.04]}>
                <sphereGeometry args={[0.03, 16, 16]} />
                <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.5} />
              </mesh>

              {/* Bindi/Dot */}
              <mesh position={[0, 0.2, 0.05]}>
                <circleGeometry args={[0.04, 32]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.5} blending={THREE.AdditiveBlending} />
              </mesh>

              {/* Eyebrows */}
              <mesh position={[-0.18, 0.14, 0.03]} rotation={[0, 0, Math.PI * 0.15 + 0.1]} material={statueMaterial}>
                <torusGeometry args={[0.09, 0.012, 16, 32, Math.PI * 0.7]} />
              </mesh>
              <mesh position={[0.18, 0.14, 0.03]} rotation={[0, 0, Math.PI * 0.15 - 0.1]} material={statueMaterial}>
                <torusGeometry args={[0.09, 0.012, 16, 32, Math.PI * 0.7]} />
              </mesh>

              {/* Closed Eyes - More serene and soulful */}
              <mesh position={[-0.18, 0.03, 0.04]} rotation={[0.1, 0, Math.PI * 1.1 + 0.05]} material={statueMaterial}>
                <torusGeometry args={[0.09, 0.018, 16, 32, Math.PI * 0.8]} />
              </mesh>
              <mesh position={[0.18, 0.03, 0.04]} rotation={[0.1, 0, Math.PI * 1.1 - 0.05]} material={statueMaterial}>
                <torusGeometry args={[0.09, 0.018, 16, 32, Math.PI * 0.8]} />
              </mesh>

              {/* Nose */}
              <mesh position={[0, -0.08, 0.07]} rotation={[0.15, 0, 0]} material={statueMaterial}>
                <capsuleGeometry args={[0.028, 0.14, 8, 8]} />
              </mesh>

              {/* Smile - More compassionate and gentle */}
              <mesh position={[0, -0.24, 0.03]} rotation={[-0.1, 0, Math.PI * 1.15]} material={statueMaterial}>
                <torusGeometry args={[0.08, 0.012, 16, 32, Math.PI * 0.7]} />
              </mesh>
            </group>

            {/* Ushnisha (Top bump) */}
            <mesh castShadow receiveShadow position={[0, 0.62, 0]} material={statueMaterial}>
              <sphereGeometry args={[0.25, 32, 32]} />
            </mesh>
            <mesh castShadow receiveShadow position={[0, 0.82, 0]} material={statueMaterial}>
              <sphereGeometry args={[0.08, 32, 32]} />
            </mesh>

            {/* Ears (Elongated) */}
            <mesh castShadow receiveShadow position={[-0.65, -0.1, 0]} scale={[0.1, 0.4, 0.2]} material={statueMaterial}>
              <sphereGeometry args={[1, 16, 16]} />
            </mesh>
            <mesh castShadow receiveShadow position={[0.65, -0.1, 0]} scale={[0.1, 0.4, 0.2]} material={statueMaterial}>
              <sphereGeometry args={[1, 16, 16]} />
            </mesh>
          </group>
          
          {/* Glowing Orb in hands */}
          <mesh position={[0, 0.9, 0.8]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshBasicMaterial color="#ffffff" />
            <pointLight color="#ffffff" intensity={0.5} distance={2} />
          </mesh>
        </group>
      </Float>
      
      {/* Sacred floating gold dust around the statue */}
      <Sparkles count={100} scale={5} size={3} speed={0.4} opacity={0.3} color="#ffcc00" position={[0, 2, 0]} />
      
      {/* Lotus Base */}
      <group position={[0, -0.2, 0]}>
        {/* Base cylinder */}
        <mesh receiveShadow position={[0, 0.25, 0]}>
          <cylinderGeometry args={[2.4, 2.8, 0.6, 64]} />
          <meshStandardMaterial color="#4a3219" roughness={0.9} metalness={0.1} />
        </mesh>
        
        {/* Lotus Petals - Layer 1 */}
        {Array.from({ length: 12 }).map((_, i) => (
          <group key={`petal-1-${i}`} rotation={[0, (i / 12) * Math.PI * 2, 0]}>
            <mesh position={[0, 0.6, 2.2]} rotation={[-0.4, 0, 0]}>
              <sphereGeometry args={[0.6, 16, 16]} scale={[1, 0.2, 1.5]} />
              <meshPhysicalMaterial color="#d4af37" metalness={0.7} roughness={0.3} clearcoat={0.5} />
            </mesh>
          </group>
        ))}

        {/* Lotus Petals - Layer 2 */}
        {Array.from({ length: 8 }).map((_, i) => (
          <group key={`petal-2-${i}`} rotation={[0, (i / 8) * Math.PI * 2 + 0.3, 0]}>
            <mesh position={[0, 0.8, 1.6]} rotation={[-0.6, 0, 0]}>
              <sphereGeometry args={[0.5, 16, 16]} scale={[1, 0.2, 1.3]} />
              <meshPhysicalMaterial color="#ffd700" metalness={0.8} roughness={0.2} clearcoat={0.8} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

function IncenseSmoke() {
  const count = 150;
  const mesh = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const life = new Float32Array(count);
    const offsets = new Float32Array(count);
    const speeds = new Float32Array(count);
    for(let i=0; i<count; i++) {
      positions[i*3] = (Math.random() - 0.5) * 0.05;
      positions[i*3+1] = Math.random() * 2.5; // Initial height spread
      positions[i*3+2] = (Math.random() - 0.5) * 0.05;
      life[i] = Math.random();
      offsets[i] = Math.random() * Math.PI * 2;
      speeds[i] = 0.2 + Math.random() * 0.3;
    }
    return { positions, life, offsets, speeds };
  }, [count]);

  const texture = sharedParticleTexture;

  useFrame((state, delta) => {
    if (!mesh.current || !materialRef.current) return;
    const pos = mesh.current.geometry.attributes.position.array as Float32Array;
    const time = state.clock.elapsedTime;

    for(let i=0; i<count; i++) {
      let l = particles.life[i];
      l += delta * particles.speeds[i] * 0.4; // age

      if (l > 1.0) {
        l = 0.0;
        pos[i*3] = (Math.random() - 0.5) * 0.02;
        pos[i*3+1] = 0;
        pos[i*3+2] = (Math.random() - 0.5) * 0.02;
      }
      particles.life[i] = l;

      // Move up
      pos[i*3+1] += delta * particles.speeds[i];

      // Curl and spread
      const spread = Math.pow(l, 1.5) * 0.4; // Spread more as it goes higher
      pos[i*3] += Math.sin(time * 1.5 + particles.offsets[i]) * delta * spread;
      pos[i*3+2] += Math.cos(time * 1.2 + particles.offsets[i]) * delta * spread;
    }
    mesh.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={particles.positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial 
        ref={materialRef} 
        size={0.25} 
        color="#e0e0e0" 
        transparent 
        opacity={0.15} 
        depthWrite={false} 
        blending={THREE.AdditiveBlending} 
        sizeAttenuation={true} 
        map={texture}
      />
    </points>
  );
}

// Altar with incense burner and candles
function Altar({ isIncenseLit }: { isIncenseLit: boolean }) {
  const candleLight1 = useRef<THREE.PointLight>(null);
  const candleLight2 = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    // Flicker effect
    const flicker = Math.random() * 0.1 + 0.9;
    if (candleLight1.current) candleLight1.current.intensity = 1.5 * flicker;
    if (candleLight2.current) candleLight2.current.intensity = 1.5 * flicker;
  });

  return (
    <group position={[0, 0.5, -1.5]}>
      {/* Table */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[4, 1, 1.5]} />
        <meshStandardMaterial color="#3e2723" roughness={0.9} />
      </mesh>

      {/* Incense Burner */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.4, 0.4, 32]} />
        <meshStandardMaterial color="#b87333" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Incense Sticks */}
      {isIncenseLit && (
        <group position={[0, 0.8, 0]}>
          {/* Stick 1 */}
          <group position={[-0.05, 0.3, 0]} rotation={[0, 0, 0.1]}>
            <mesh position={[0, -0.1, 0]}>
              <cylinderGeometry args={[0.006, 0.006, 0.5]} />
              <meshBasicMaterial color="#5c3a21" />
            </mesh>
            <mesh position={[0, 0.15, 0]}>
              <sphereGeometry args={[0.012]} />
              <meshBasicMaterial color="#ff5500" />
            </mesh>
            <pointLight position={[0, 0.15, 0]} color="#ff4400" intensity={0.5} distance={0.5} />
          </group>
          {/* Stick 2 */}
          <group position={[0.05, 0.3, 0]} rotation={[0, 0, -0.1]}>
            <mesh position={[0, -0.1, 0]}>
              <cylinderGeometry args={[0.006, 0.006, 0.5]} />
              <meshBasicMaterial color="#5c3a21" />
            </mesh>
            <mesh position={[0, 0.15, 0]}>
              <sphereGeometry args={[0.012]} />
              <meshBasicMaterial color="#ff5500" />
            </mesh>
            <pointLight position={[0, 0.15, 0]} color="#ff4400" intensity={0.5} distance={0.5} />
          </group>
          {/* Stick 3 */}
          <group position={[0, 0.3, 0.05]} rotation={[0.1, 0, 0]}>
            <mesh position={[0, -0.1, 0]}>
              <cylinderGeometry args={[0.006, 0.006, 0.5]} />
              <meshBasicMaterial color="#5c3a21" />
            </mesh>
            <mesh position={[0, 0.15, 0]}>
              <sphereGeometry args={[0.012]} />
              <meshBasicMaterial color="#ff5500" />
            </mesh>
            <pointLight position={[0, 0.15, 0]} color="#ff4400" intensity={0.5} distance={0.5} />
          </group>
          
          {/* Incense Smoke */}
          <group position={[0, 0.5, 0]}>
            <IncenseSmoke />
          </group>
        </group>
      )}

      {/* Candles */}
      <group position={[-1.5, 0.6, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.3]} />
          <meshStandardMaterial color="#ffcc80" />
        </mesh>
        <pointLight ref={candleLight1} position={[0, 0.3, 0]} color="#ffaa00" distance={5} decay={2} />
        <mesh position={[0, 0.2, 0]}>
          <sphereGeometry args={[0.05]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>

      <group position={[1.5, 0.6, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.3]} />
          <meshStandardMaterial color="#ffcc80" />
        </mesh>
        <pointLight ref={candleLight2} position={[0, 0.3, 0]} color="#ffaa00" distance={5} decay={2} />
        <mesh position={[0, 0.2, 0]}>
          <sphereGeometry args={[0.05]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* Stylized Lotus Flowers */}
      <group position={[-0.8, 0.5, 0.2]}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.05, 0.1, 8]} />
          <meshStandardMaterial color="#ff69b4" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.1, 0]}>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshStandardMaterial color="#ffb6c1" roughness={0.4} />
        </mesh>
      </group>

      <group position={[0.8, 0.5, 0.2]}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.05, 0.1, 8]} />
          <meshStandardMaterial color="#ff69b4" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.1, 0]}>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshStandardMaterial color="#ffb6c1" roughness={0.4} />
        </mesh>
      </group>
    </group>
  );
}

// Temple Bell Component
function TempleBell() {
  const { incrementBell } = useUserStats();
  const { t } = useLanguage();
  const [isRinging, setIsRinging] = useState(false);
  const bellRef = useRef<THREE.Group>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useFrame((state) => {
    if (!bellRef.current) return;
    const t = state.clock.getElapsedTime();
    
    if (isRinging) {
      const swing = Math.sin(t * 10) * 0.15;
      bellRef.current.rotation.z = swing;
    } else {
      bellRef.current.rotation.z = THREE.MathUtils.lerp(bellRef.current.rotation.z, 0, 0.05);
    }
  });

  const handleRing = useCallback(() => {
    if (isRinging) return;
    setIsRinging(true);
    incrementBell();

    if (!audioRef.current) {
      audioRef.current = new Audio('https://cdn.pixabay.com/download/audio/2022/03/15/audio_6a2016f466.mp3?filename=tibetan-singing-bowl-1-101348.mp3');
    }
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(e => console.log(e));

    setTimeout(() => setIsRinging(false), 3000);
  }, [isRinging, incrementBell]);

  return (
    <group position={[5, 4, -3]} onClick={handleRing} onPointerDown={handleRing}>
      <group ref={bellRef}>
        {/* Bell String */}
        <mesh position={[0, 1.5, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 3]} />
          <meshStandardMaterial color="#2e1b12" />
        </mesh>
        
        {/* Bell Body */}
        <mesh position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.6, 0.8, 1.2, 32]} />
          <meshStandardMaterial color="#b8860b" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.6, 0]} castShadow>
          <sphereGeometry args={[0.6, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#b8860b" metalness={0.8} roughness={0.2} />
        </mesh>
        
        {/* Bell Label */}
        <Text
          position={[0, -1, 0]}
          fontSize={0.2}
          color="#ffcc00"
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKbxmc.woff"
        >
          {t('profile.bell_rings')}
        </Text>
      </group>
      
      {/* Interaction Glow */}
      <pointLight position={[0, 0, 0]} color="#ffcc00" intensity={isRinging ? 2 : 0.5} distance={3} />
    </group>
  );
}

// Temple Architecture
function TempleArchitecture() {
  const lanternRef1 = useRef<THREE.Group>(null);
  const lanternRef2 = useRef<THREE.Group>(null);
  const prevCameraPos = useRef(new THREE.Vector3());
  const windVelocity = useRef(new THREE.Vector3());

  useFrame((state) => {
    if (prevCameraPos.current.lengthSq() === 0) {
      prevCameraPos.current.copy(state.camera.position);
    }
    const cameraMovement = new THREE.Vector3().subVectors(state.camera.position, prevCameraPos.current);
    windVelocity.current.add(cameraMovement.multiplyScalar(2.0));
    windVelocity.current.lerp(new THREE.Vector3(0, 0, 0), 0.05);
    
    const t = state.clock.getElapsedTime();
    
    // Calculate wind effect on rotation (sway)
    const windSwayX = windVelocity.current.z * 0.5; // Moving Z causes X rotation
    const windSwayZ = -windVelocity.current.x * 0.5; // Moving X causes Z rotation

    if (lanternRef1.current) {
      const targetZ = Math.sin(t * 0.5) * 0.05 + windSwayZ;
      const targetX = Math.cos(t * 0.3) * 0.05 + windSwayX;
      lanternRef1.current.rotation.z = THREE.MathUtils.lerp(lanternRef1.current.rotation.z, targetZ, 0.1);
      lanternRef1.current.rotation.x = THREE.MathUtils.lerp(lanternRef1.current.rotation.x, targetX, 0.1);
    }
    if (lanternRef2.current) {
      const targetZ = Math.sin(t * 0.4 + 1) * 0.05 + windSwayZ * 1.2;
      const targetX = Math.cos(t * 0.6 + 1) * 0.05 + windSwayX * 1.2;
      lanternRef2.current.rotation.z = THREE.MathUtils.lerp(lanternRef2.current.rotation.z, targetZ, 0.1);
      lanternRef2.current.rotation.x = THREE.MathUtils.lerp(lanternRef2.current.rotation.x, targetX, 0.1);
    }
    
    prevCameraPos.current.copy(state.camera.position);
  });

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial color="#2a1a10" />
      </mesh>

      {/* Back Wall */}
      <mesh position={[0, 5, -6]} receiveShadow>
        <planeGeometry args={[20, 10]} />
        <meshStandardMaterial color="#3e2723" roughness={0.9} />
      </mesh>

      {/* Pillars */}
      <mesh position={[-4, 4, -4]} castShadow receiveShadow>
        <cylinderGeometry args={[0.4, 0.4, 8, 16]} />
        <meshStandardMaterial color="#2e1b12" roughness={0.8} />
      </mesh>
      <mesh position={[4, 4, -4]} castShadow receiveShadow>
        <cylinderGeometry args={[0.4, 0.4, 8, 16]} />
        <meshStandardMaterial color="#2e1b12" roughness={0.8} />
      </mesh>
      <mesh position={[-4, 4, 2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.4, 0.4, 8, 16]} />
        <meshStandardMaterial color="#2e1b12" roughness={0.8} />
      </mesh>
      <mesh position={[4, 4, 2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.4, 0.4, 8, 16]} />
        <meshStandardMaterial color="#2e1b12" roughness={0.8} />
      </mesh>

      {/* Hanging Lanterns */}
      <group position={[-3, 6, -2]} ref={lanternRef1}>
        {/* String */}
        <mesh position={[0, 1, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 2]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        {/* Lantern Body */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.8, 8]} />
          <meshStandardMaterial color="#8b0000" emissive="#8b0000" emissiveIntensity={0.2} transparent opacity={0.9} />
        </mesh>
        {/* Lantern Top/Bottom */}
        <mesh position={[0, 0.45, 0]}>
          <cylinderGeometry args={[0.45, 0.45, 0.1, 8]} />
          <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, -0.45, 0]}>
          <cylinderGeometry args={[0.45, 0.45, 0.1, 8]} />
          <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.2} />
        </mesh>
        <pointLight position={[0, 0, 0]} color="#ffaa00" intensity={1} distance={4} decay={2} />
      </group>

      <group position={[3, 6, -2]} ref={lanternRef2}>
        {/* String */}
        <mesh position={[0, 1, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 2]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        {/* Lantern Body */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.8, 8]} />
          <meshStandardMaterial color="#8b0000" emissive="#8b0000" emissiveIntensity={0.2} transparent opacity={0.9} />
        </mesh>
        {/* Lantern Top/Bottom */}
        <mesh position={[0, 0.45, 0]}>
          <cylinderGeometry args={[0.45, 0.45, 0.1, 8]} />
          <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, -0.45, 0]}>
          <cylinderGeometry args={[0.45, 0.45, 0.1, 8]} />
          <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.2} />
        </mesh>
        <pointLight position={[0, 0, 0]} color="#ffaa00" intensity={1} distance={4} decay={2} />
      </group>
    </group>
  );
}

// Camera Controller for Bowing
function CameraController({ isBowing, controlsRef }: { isBowing: boolean, controlsRef: React.RefObject<any> }) {
  const { camera } = useThree();
  const initialY = useRef(camera.position.y);
  const initialTargetY = useRef(2.5);
  const bowProgress = useRef(0);

  useFrame((state, delta) => {
    // Smoothly interpolate camera position and rotation for bowing
    bowProgress.current = THREE.MathUtils.damp(bowProgress.current, isBowing ? 1 : 0, 3, delta);
    
    // Drop camera Y
    camera.position.y = initialY.current - (1.2 * bowProgress.current);
    
    // Drop target Y to look down
    if (controlsRef.current) {
      controlsRef.current.target.y = initialTargetY.current - (2.0 * bowProgress.current);
      controlsRef.current.update();
    }
    
    // Subtle breathing/floating motion when not bowing
    if (!isBowing && bowProgress.current < 0.01) {
      const t = state.clock.getElapsedTime();
      camera.position.y = initialY.current + Math.sin(t * 0.5) * 0.05;
    }
  });

  return null;
}

// Advanced Dust Particles reacting to camera movement
function DustParticles() {
  const count = 500;
  const mesh = useRef<THREE.Points>(null);
  
  const [positions, phases] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const phases = new Float32Array(count * 3); // speed, phaseX, phaseZ
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 1] = Math.random() * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15;

      phases[i * 3] = Math.random() * 0.5 + 0.1; // speed
      phases[i * 3 + 1] = Math.random() * Math.PI * 2; // phaseX
      phases[i * 3 + 2] = Math.random() * Math.PI * 2; // phaseZ
    }
    return [positions, phases];
  }, [count]);

  const prevCameraPos = useRef(new THREE.Vector3());
  const windVelocity = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    if (!mesh.current) return;
    
    // Initialize prevCameraPos on first frame
    if (prevCameraPos.current.lengthSq() === 0) {
      prevCameraPos.current.copy(state.camera.position);
    }
    
    // Calculate camera movement (air displacement)
    const cameraMovement = new THREE.Vector3().subVectors(state.camera.position, prevCameraPos.current);
    
    // Add camera movement to wind velocity (with amplification)
    windVelocity.current.add(cameraMovement.multiplyScalar(4.0));
    // Dampen wind over time to simulate air resistance
    windVelocity.current.lerp(new THREE.Vector3(0, 0, 0), 0.05); 

    const positionsAttribute = mesh.current.geometry.attributes.position;
    const posArray = positionsAttribute.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Natural floating movement
      const speed = phases[i3];
      const time = state.clock.elapsedTime;
      
      // Upward drift + sine wave flutter
      posArray[i3 + 1] += delta * speed * 0.15; // Move up
      posArray[i3] += Math.sin(time * speed + phases[i3 + 1]) * delta * 0.08; // Flutter X
      posArray[i3 + 2] += Math.cos(time * speed + phases[i3 + 2]) * delta * 0.08; // Flutter Z

      // Apply wind from camera
      posArray[i3] += windVelocity.current.x * delta * 10;
      posArray[i3 + 1] += windVelocity.current.y * delta * 10;
      posArray[i3 + 2] += windVelocity.current.z * delta * 10;

      // Reset particles that go too high or too far
      if (posArray[i3 + 1] > 8) {
        posArray[i3 + 1] = 0;
        posArray[i3] = (Math.random() - 0.5) * 15;
        posArray[i3 + 2] = (Math.random() - 0.5) * 15;
      }
    }
    
    positionsAttribute.needsUpdate = true;
    prevCameraPos.current.copy(state.camera.position);
  });

  return (
    <points ref={mesh} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <PointMaterial
        transparent
        color="#ffcc80"
        size={0.06}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.5}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function BowingAura({ isBowing }: { isBowing: boolean }) {
  const lightRef = useRef<THREE.PointLight>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const ringMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const bowTime = useRef(0);
  
  const count = 100;
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    const speeds = new Float32Array(count);
    for(let i=0; i<count; i++) {
      positions[i*3] = (Math.random() - 0.5) * 10;
      positions[i*3+1] = Math.random() * 4 - 1;
      positions[i*3+2] = (Math.random() - 0.5) * 8 + 1;
      phases[i] = Math.random() * Math.PI * 2;
      speeds[i] = Math.random() * 0.5 + 0.2;
    }
    return { positions, phases, speeds };
  }, [count]);

  const texture = sharedParticleTexture;

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    
    if (isBowing) {
      bowTime.current += delta;
    } else {
      bowTime.current = 0;
    }

    if (lightRef.current) {
      const targetIntensity = isBowing ? 4.0 : 0.0;
      lightRef.current.intensity = THREE.MathUtils.damp(lightRef.current.intensity, targetIntensity, 4, delta);
    }

    if (materialRef.current) {
      const targetOpacity = isBowing ? 0.8 : 0.0;
      materialRef.current.opacity = THREE.MathUtils.damp(materialRef.current.opacity, targetOpacity, 4, delta);
    }

    if (ringRef.current && ringMatRef.current) {
      if (isBowing) {
        const scale = 1 + bowTime.current * 4;
        ringRef.current.scale.set(scale, scale, scale);
        ringMatRef.current.opacity = Math.max(0, 0.6 - bowTime.current * 0.15);
      } else {
        ringRef.current.scale.set(1, 1, 1);
        ringMatRef.current.opacity = THREE.MathUtils.damp(ringMatRef.current.opacity, 0, 4, delta);
      }
    }

    if (particlesRef.current && materialRef.current.opacity > 0.01) {
      const pos = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for(let i=0; i<count; i++) {
        pos[i*3+1] += delta * particles.speeds[i]; // float up
        pos[i*3] += Math.sin(t * particles.speeds[i] + particles.phases[i]) * delta * 0.2;
        pos[i*3+2] += Math.cos(t * particles.speeds[i] + particles.phases[i]) * delta * 0.2;
        if (pos[i*3+1] > 5) pos[i*3+1] = -1; // wrap around
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      <pointLight ref={lightRef} position={[0, 2, 1]} color="#ffaa00" distance={12} decay={2} />
      
      {/* Expanding Sacred Ring on the floor */}
      <mesh ref={ringRef} position={[0, 0.02, -1]} rotation={[-Math.PI/2, 0, 0]}>
        <ringGeometry args={[1.8, 2.0, 64]} />
        <meshBasicMaterial ref={ringMatRef} color="#ffcc00" transparent opacity={0} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
      </mesh>

      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={count} array={particles.positions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial 
          ref={materialRef}
          size={0.25}
          color="#ffd700"
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          map={texture}
        />
      </points>
    </group>
  );
}

function SceneLoader({ onReady }: { onReady: () => void }) {
  useEffect(() => {
    // Small delay to ensure everything is truly ready and avoid flickering
    const timer = setTimeout(onReady, 100);
    return () => clearTimeout(timer);
  }, [onReady]);
  return null;
}

export function TempleScene({ isIncenseLit, isBowing, hasDonated }: { isIncenseLit: boolean, isBowing: boolean, hasDonated: boolean }) {
  const controlsRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);
  
  // Dynamic Environment Logic based on real time
  const [timeState] = useState(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 10) return 'morning';
    if (hour >= 10 && hour < 16) return 'noon';
    if (hour >= 16 && hour < 19) return 'afternoon';
    return 'night';
  });

  const envConfig = useMemo(() => {
    const configs = {
      morning: {
        bg: '#0a0806',
        fog: '#1a140f',
        ambient: 0.6,
        spot: { color: '#ffcc80', intensity: 80, pos: [5, 10, 5] },
        fill: { color: '#ff9966', intensity: 0.8 },
        bloom: 1.2
      },
      noon: {
        bg: '#0c0a08',
        fog: '#15120f',
        ambient: 0.8,
        spot: { color: '#ffffff', intensity: 100, pos: [0, 15, 0] },
        fill: { color: '#fff5e6', intensity: 1.0 },
        bloom: 0.8
      },
      afternoon: {
        bg: '#0a0604',
        fog: '#1a0f0a',
        ambient: 0.5,
        spot: { color: '#ff8844', intensity: 120, pos: [-5, 8, 5] },
        fill: { color: '#ff5500', intensity: 1.2 },
        bloom: 1.5
      },
      night: {
        bg: '#050508',
        fog: '#08080c',
        ambient: 0.4,
        spot: { color: '#4466ff', intensity: 80, pos: [0, 10, -5] },
        fill: { color: '#223366', intensity: 0.6 },
        bloom: 1.8
      }
    };
    return configs[timeState as keyof typeof configs];
  }, [timeState]);

  return (
    <div className={`w-full h-full absolute inset-0 bg-black transition-opacity duration-1000 ${isReady ? 'opacity-100' : 'opacity-0'}`}>
      <Canvas 
        shadows 
        dpr={[1, 2]} 
        camera={{ position: [0, 2.5, 6], fov: 45 }}
        gl={{ antialias: true, stencil: false, depth: true }}
      >
        <color attach="background" args={[envConfig.bg]} />
        <fog attach="fog" args={[envConfig.fog, 5, 25]} />
        
        <Suspense fallback={null}>
          <SceneLoader onReady={() => setIsReady(true)} />
          <Environment preset="sunset" blur={0.8} />
          
          {/* Lighting Setup */}
          <ambientLight intensity={envConfig.ambient} />
          <SpotLight 
            position={envConfig.spot.pos as any} 
            angle={0.3} 
            penumbra={1} 
            intensity={envConfig.spot.intensity} 
            color={envConfig.spot.color} 
            castShadow 
          />
          <pointLight position={[-5, 5, 5]} intensity={envConfig.fill.intensity} color={envConfig.fill.color} />
          
          {/* Scene Elements */}
          <TempleArchitecture />
          <Statue hasDonated={hasDonated} isBowing={isBowing} />
          <Altar isIncenseLit={isIncenseLit} />
          <TempleBell />
          <BowingAura isBowing={isBowing} />
          <DustParticles />

          {/* Camera & Controls */}
          <CameraController isBowing={isBowing} controlsRef={controlsRef} />
          <OrbitControls 
            ref={controlsRef}
            target={[0, 1.8, -2]}
            enableZoom={false} 
            enablePan={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 3}
            maxAzimuthAngle={Math.PI / 8}
            minAzimuthAngle={-Math.PI / 8}
            rotateSpeed={0.4}
            dampingFactor={0.05}
          />

          {/* Post Processing */}
          <EffectComposer>
            <Bloom 
              luminanceThreshold={0.2} 
              mipmapBlur 
              intensity={envConfig.bloom} 
              radius={0.4} 
            />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
            <ChromaticAberration offset={new THREE.Vector2(0.001, 0.001)} />
            <Noise opacity={0.02} />
          </EffectComposer>
        </Suspense>
      </Canvas>

      {/* Time of Day Indicator */}
      <div className="absolute bottom-10 left-10 flex flex-col gap-2 pointer-events-none select-none group">
        <div className="flex items-center gap-4">
          <div className="h-[1px] w-8 bg-gradient-to-r from-amber-500/60 to-transparent" />
          <div className="text-[9px] tracking-[0.6em] text-amber-500/60 uppercase font-medium">Sacred Environment</div>
        </div>
        <div className="flex items-center gap-4 pl-12">
          <div className="relative">
            <div className={`w-2.5 h-2.5 rounded-full ${
              timeState === 'morning' ? 'bg-orange-400' : 
              timeState === 'noon' ? 'bg-yellow-400' : 
              timeState === 'afternoon' ? 'bg-red-500' : 'bg-indigo-500'
            } shadow-[0_0_15px_currentColor]`} />
            <div className={`absolute inset-0 w-2.5 h-2.5 rounded-full ${
              timeState === 'morning' ? 'bg-orange-400' : 
              timeState === 'noon' ? 'bg-yellow-400' : 
              timeState === 'afternoon' ? 'bg-red-500' : 'bg-indigo-500'
            } animate-ping opacity-40`} />
          </div>
          <div className="text-sm tracking-[0.3em] text-amber-50/90 uppercase font-serif italic">
            {timeState === 'morning' ? 'Bình minh thanh tịnh' : 
             timeState === 'noon' ? 'Chánh ngọ rực rỡ' : 
             timeState === 'afternoon' ? 'Hoàng hôn huyền ảo' : 'Đêm thiền tĩnh lặng'}
          </div>
        </div>
      </div>
    </div>
  );
}
