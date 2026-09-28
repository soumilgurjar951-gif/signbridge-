'use client';

import React, { Suspense, forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

/** Procedural signing poses (degrees). Applied to shoulder/arm/forearm/head joints. */
const POSES3D = [
  { lsx: -8, lsz: 12, lex: -20, rsx: -8, rsz: -12, rex: -20, hx: 0, hz: 0 },
  { lsx: -55, lsz: 25, lex: -65, rsx: -55, rsz: -25, rex: -65, hx: -4, hz: -5 },
  { lsx: -70, lsz: 45, lex: -40, rsx: -20, rsz: -15, rex: -85, hx: 3, hz: 5 },
  { lsx: -25, lsz: 15, lex: -90, rsx: -65, rsz: -40, rex: -35, hx: -3, hz: -5 },
  { lsx: -60, lsz: 35, lex: -75, rsx: -60, rsz: -35, rex: -75, hx: 4, hz: 0 },
  { lsx: -30, lsz: 20, lex: -30, rsx: -35, rsz: -30, rex: -100, hx: 0, hz: 6 },
  { lsx: -75, lsz: 50, lex: -85, rsx: -30, rsz: -20, rex: -55, hx: -4, hz: -6 },
  { lsx: -20, lsz: 12, lex: -55, rsx: -55, rsz: -45, rex: -90, hx: 3, hz: 4 },
];

type Bones = Record<string, THREE.Object3D | undefined>;

function findBones(root: THREE.Object3D): Bones {
  const list: THREE.Object3D[] = [];
  root.traverse((o) => {
    if ((o as THREE.Bone).isBone) list.push(o);
  });
  const by = (inc: string[], exc: string[] = []) =>
    list.find((b) => {
      const n = b.name.toLowerCase();
      return inc.every((k) => n.includes(k)) && !exc.some((k) => n.includes(k));
    });
  return {
    lShoulder: by(['left', 'shoulder']),
    lArm: by(['left', 'arm'], ['fore', 'shoulder', 'hand']),
    lFore: by(['left', 'fore']),
    lHand: by(['left', 'hand']),
    rShoulder: by(['right', 'shoulder']),
    rArm: by(['right', 'arm'], ['fore', 'shoulder', 'hand']),
    rFore: by(['right', 'fore']),
    rHand: by(['right', 'hand']),
    head: by(['head']),
    neck: by(['neck']),
    spine: by(['spine']),
  };
}

function RiggedModel({
  url,
  playing,
  beat,
  onReady,
}: {
  url: string;
  playing: boolean;
  beat: number;
  onReady?: () => void;
}) {
  const gltf = useGLTF(url);
  const group = useRef<THREE.Group>(null);
  const bones = useMemo(() => findBones(gltf.scene), [gltf]);
  const live = useRef({ playing, beat });
  live.current.playing = playing;
  live.current.beat = beat;
  const cur = useRef({ ...POSES3D[0] });
  const readyFired = useRef(false);

  useFrame((state, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const { playing: p, beat: b } = live.current;
    const tgt = p ? POSES3D[((b % POSES3D.length) + POSES3D.length) % POSES3D.length] : POSES3D[0];
    const c = cur.current;
    const k = 1 - Math.exp(-7 * dt);
    (Object.keys(tgt) as (keyof typeof tgt)[]).forEach((key) => {
      c[key] += (tgt[key] - c[key]) * k;
    });
    const t = state.clock.elapsedTime;
    const D = Math.PI / 180;
    const wave = p ? Math.sin(t * 3.1) * 6 : Math.sin(t * 1.2) * 2;

    bones.lShoulder?.rotation.set(c.lsx * 0.35 * D, 0, c.lsz * 0.35 * D);
    bones.lArm?.rotation.set(c.lsx * D, 0, c.lsz * D);
    bones.lFore?.rotation.set(c.lex * D, 0, 0);
    if (bones.lHand) bones.lHand.rotation.z = wave * D;
    bones.rShoulder?.rotation.set(c.rsx * 0.35 * D, 0, c.rsz * 0.35 * D);
    bones.rArm?.rotation.set(c.rsx * D, 0, c.rsz * D);
    bones.rFore?.rotation.set(c.rex * D, 0, 0);
    if (bones.rHand) bones.rHand.rotation.z = -wave * D;
    if (bones.head) bones.head.rotation.set(c.hx * D + Math.sin(t * 1.4) * 0.035, Math.sin(t * 0.9) * 0.05, c.hz * D);
    if (bones.spine) bones.spine.rotation.x = Math.sin(t * (p ? 2.2 : 1.1)) * 0.02;
    if (group.current) group.current.position.y = Math.abs(Math.sin(t * (p ? 2.2 : 1.1))) * 0.02;

    if (!readyFired.current) {
      readyFired.current = true;
      onReady?.();
    }
  });

  return <primitive ref={group} object={gltf.scene} />;
}

class GLBErrorBoundary extends React.Component<
  { onError?: () => void; children: React.ReactNode },
  { err: boolean }
> {
  state = { err: false };
  static getDerivedStateFromError() {
    return { err: true };
  }
  componentDidCatch() {
    this.props.onError?.();
  }
  render() {
    return this.state.err ? null : this.props.children;
  }
}

type Props = {
  playing: boolean;
  /** increments as gloss words advance — avatar changes pose per word */
  beat: number;
  modelUrl: string;
  onReady?: () => void;
  onError?: () => void;
  className?: string;
};

/**
 * Realistic rigged-human avatar (default: bundled humanoid; or any
 * Ready Player Me / Mixamo-compatible .glb, e.g. made from your selfie).
 * Rendered live with Three.js; joints driven by the signing beat.
 */
export const HumanAvatar = forwardRef<HTMLCanvasElement, Props>(function HumanAvatar(
  { playing, beat, modelUrl, onReady, onError, className },
  ref
) {
  const [errTick, setErrTick] = useState(0);
  return (
    <Canvas
      ref={ref}
      dpr={[1, 2]}
      camera={{ position: [0, 1.35, 3.9], fov: 38 }}
      onCreated={({ camera }) => camera.lookAt(0, 1.0, 0)}
      gl={{ preserveDrawingBuffer: true, antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
      className={className}
      aria-label="Realistic 3D human avatar signing in American Sign Language"
      role="img"
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[2.5, 4, 3]} intensity={1.15} />
      <directionalLight position={[-3, 2, -2]} intensity={0.45} color="#a78bfa" />
      <Suspense fallback={null}>
        <GLBErrorBoundary
          key={modelUrl + errTick}
          onError={() => {
            setErrTick((v) => v + 1);
            onError?.();
          }}
        >
          <RiggedModel key={modelUrl} url={modelUrl} playing={playing} beat={beat} onReady={onReady} />
        </GLBErrorBoundary>
      </Suspense>
      <ContactShadows position={[0, 0.01, 0]} scale={9} blur={2.4} far={3} opacity={0.55} color="#000000" />
    </Canvas>
  );
});

useGLTF.preload('/models/Xbot.glb');
