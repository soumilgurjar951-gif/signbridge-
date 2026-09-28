import { forwardRef, useEffect, useRef, useState } from 'react';

export type HandShape = 'open' | 'fist' | 'point' | 'ily';

interface Pose {
  la: number; lb: number; ra: number; rb: number;
  tilt: number; handL: HandShape; handR: HandShape;
  mouth: boolean; brow: boolean;
}

/** Signing poses cycle in sync with gloss words. Angles in degrees, 0 = arm straight down. */
const POSES: Pose[] = [
  { la: -14, lb: -22, ra: 14, rb: 22, tilt: 0, handL: 'fist', handR: 'fist', mouth: false, brow: false },
  { la: -38, lb: -72, ra: 38, rb: 72, tilt: -5, handL: 'open', handR: 'open', mouth: true, brow: false },
  { la: -58, lb: -42, ra: 22, rb: -96, tilt: 5, handL: 'point', handR: 'open', mouth: false, brow: false },
  { la: -22, lb: -102, ra: 58, rb: -38, tilt: -5, handL: 'open', handR: 'point', mouth: true, brow: true },
  { la: -50, lb: -82, ra: 50, rb: 82, tilt: 0, handL: 'ily', handR: 'ily', mouth: true, brow: false },
  { la: -32, lb: -34, ra: 34, rb: -112, tilt: 6, handL: 'fist', handR: 'open', mouth: false, brow: true },
  { la: -62, lb: -100, ra: 28, rb: -62, tilt: -6, handL: 'open', handR: 'fist', mouth: true, brow: false },
  { la: -18, lb: -64, ra: 48, rb: -100, tilt: 4, handL: 'point', handR: 'ily', mouth: false, brow: true },
];

const SKIN = '#f0c297';
const SKIN_SHADE = '#c98a5b';
const SLEEVE = '#9F1239';
const HAIR = '#2d2119';

const SL = { x: 282, y: 178 };
const SR = { x: 358, y: 178 };
const L1 = 62;
const L2 = 56;
const rad = (d: number) => (d * Math.PI) / 180;
const joint = (s: { x: number; y: number }, aDeg: number, len: number) => ({
  x: s.x + Math.sin(rad(aDeg)) * len,
  y: s.y + Math.cos(rad(aDeg)) * len,
});

interface Frame extends Pose {
  sway: number; bob: number; blink: boolean;
}

function Hand({ shape }: { shape: HandShape }) {
  if (shape === 'fist') {
    return <circle r={12} fill={SKIN} stroke={SKIN_SHADE} strokeWidth={2.5} />;
  }
  if (shape === 'open') {
    return (
      <g stroke={SKIN} strokeWidth={5.5} strokeLinecap="round">
        <line x1={-9} y1={-6} x2={-14} y2={-20} />
        <line x1={-3} y1={-8} x2={-5} y2={-23} />
        <line x1={3} y1={-8} x2={5} y2={-23} />
        <line x1={9} y1={-6} x2={14} y2={-20} />
        <line x1={9} y1={0} x2={17} y2={-6} />
        <circle r={9.5} fill={SKIN} stroke="none" />
      </g>
    );
  }
  if (shape === 'point') {
    return (
      <g>
        <line x1={0} y1={-7} x2={1} y2={-26} stroke={SKIN} strokeWidth={5.5} strokeLinecap="round" />
        <circle r={9} fill={SKIN} stroke={SKIN_SHADE} strokeWidth={2} />
      </g>
    );
  }
  return (
    <g>
      <line x1={0} y1={-7} x2={-10} y2={-22} stroke={SKIN} strokeWidth={5.5} strokeLinecap="round" />
      <line x1={0} y1={-7} x2={10} y2={-22} stroke={SKIN} strokeWidth={5.5} strokeLinecap="round" />
      <circle r={9} fill={SKIN} stroke={SKIN_SHADE} strokeWidth={2} />
    </g>
  );
}

type Props = {
  playing: boolean;
  /** increments as gloss words advance — avatar changes pose per word */
  beat: number;
  className?: string;
};

/**
 * Friendly vector signing avatar. Poses interpolate every frame so motion is
 * continuous; hands, head tilt, brows and mouth change with each gloss word.
 * Fully self-contained (inline fills only) so it can be recorded to video.
 */
export const SigningAvatar = forwardRef<SVGSVGElement, Props>(function SigningAvatar(
  { playing, beat, className },
  ref
) {
  const cur = useRef({ la: POSES[0].la, lb: POSES[0].lb, ra: POSES[0].ra, rb: POSES[0].rb, tilt: 0 });
  const live = useRef({ playing, beat });
  live.current.playing = playing;
  live.current.beat = beat;

  const [f, setF] = useState<Frame>({ ...POSES[0], sway: 0, bob: 0, blink: false });

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const loop = (now: number) => {
      const t = (now - start) / 1000;
      const { playing: p, beat: b } = live.current;
      const tgt = p ? POSES[((b % POSES.length) + POSES.length) % POSES.length] : POSES[0];
      const c = cur.current;
      const k = 0.14;
      c.la += (tgt.la - c.la) * k;
      c.lb += (tgt.lb - c.lb) * k;
      c.ra += (tgt.ra - c.ra) * k;
      c.rb += (tgt.rb - c.rb) * k;
      c.tilt += (tgt.tilt - c.tilt) * k;
      const speed = p ? 2.2 : 1.1;
      const amp = p ? 10 : 4;
      setF({
        la: c.la, lb: c.lb, ra: c.ra, rb: c.rb, tilt: c.tilt,
        handL: tgt.handL, handR: tgt.handR, mouth: tgt.mouth, brow: tgt.brow,
        sway: Math.sin(t * speed) * amp,
        bob: Math.abs(Math.sin(t * speed)) * -6,
        blink: now % 4200 < 160,
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const el = joint(SL, f.la, L1);
  const wl = joint(el, f.la + f.lb, L2);
  const er = joint(SR, f.ra, L1);
  const wr = joint(er, f.ra + f.rb, L2);
  const browY = f.brow ? -5 : 0;

  return (
    <svg
      ref={ref}
      viewBox="0 0 640 360"
      width={640}
      height={360}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Animated avatar signing in American Sign Language"
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="sb-shirt" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F43F5E" />
          <stop offset="1" stopColor="#9F1239" />
        </linearGradient>
        <radialGradient id="sb-halo" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FDA4AF" stopOpacity="0.55" />
          <stop offset="0.6" stopColor="#FB7185" stopOpacity="0.22" />
          <stop offset="1" stopColor="#FB7185" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx={320} cy={195} rx={168} ry={142} fill="url(#sb-halo)" />
      <ellipse cx={320} cy={332} rx={95} ry={13} fill="#000000" opacity={0.28} />

      {playing && (
        <g fill="none" stroke="#FDA4AF" strokeWidth={5} strokeLinecap="round" opacity={0.75}>
          <path d="M196,118 C170,180 172,242 200,294" strokeDasharray="10 10" className="trail-line" />
          <path d="M444,118 C470,180 468,242 440,294" strokeDasharray="10 10" className="trail-line" />
        </g>
      )}

      <g transform={`translate(${f.sway} ${f.bob})`}>
        {/* torso */}
        <rect x={262} y={158} width={116} height={152} rx={36} fill="url(#sb-shirt)" />
        <path d="M300,160 L320,182 L340,160" fill="none" stroke="#ffffff" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" opacity={0.55} />

        {/* arms */}
        <g strokeLinecap="round" fill="none">
          <line x1={SL.x} y1={SL.y} x2={el.x} y2={el.y} stroke={SLEEVE} strokeWidth={19} />
          <line x1={el.x} y1={el.y} x2={wl.x} y2={wl.y} stroke={SKIN} strokeWidth={14} />
          <line x1={SR.x} y1={SR.y} x2={er.x} y2={er.y} stroke={SLEEVE} strokeWidth={19} />
          <line x1={er.x} y1={er.y} x2={wr.x} y2={wr.y} stroke={SKIN} strokeWidth={14} />
        </g>
        <g transform={`translate(${wl.x} ${wl.y}) rotate(${f.la + f.lb})`}>
          <Hand shape={f.handL} />
        </g>
        <g transform={`translate(${wr.x} ${wr.y}) rotate(${f.ra + f.rb})`}>
          <Hand shape={f.handR} />
        </g>

        {/* neck + head */}
        <rect x={308} y={136} width={24} height={26} rx={8} fill={SKIN} />
        <g transform={`rotate(${f.tilt} 320 106)`}>
          <circle cx={280} cy={108} r={8} fill={SKIN} />
          <circle cx={360} cy={108} r={8} fill={SKIN} />
          <circle cx={320} cy={106} r={40} fill={SKIN} />
          <path d="M280,108 a40,40 0 0 1 80,0 z" fill={HAIR} />
          <circle cx={292} cy={124} r={5} fill="#f9a8a4" opacity={0.55} />
          <circle cx={348} cy={124} r={5} fill="#f9a8a4" opacity={0.55} />
          <line x1={295} y1={94 + browY} x2={313} y2={92 + browY} stroke={HAIR} strokeWidth={4.5} strokeLinecap="round" />
          <line x1={327} y1={92 + browY} x2={345} y2={94 + browY} stroke={HAIR} strokeWidth={4.5} strokeLinecap="round" />
          <ellipse cx={304} cy={110} rx={6.5} ry={f.blink ? 1 : 7} fill="#1f2937" />
          <ellipse cx={336} cy={110} rx={6.5} ry={f.blink ? 1 : 7} fill="#1f2937" />
          {f.mouth ? (
            <g>
              <ellipse cx={320} cy={134} rx={9} ry={11} fill="#7f1d1d" />
              <ellipse cx={320} cy={138} rx={5} ry={5} fill="#fca5a5" />
            </g>
          ) : (
            <path d="M304,132 Q320,142 336,132" fill="none" stroke="#9a3412" strokeWidth={4.5} strokeLinecap="round" />
          )}
        </g>
      </g>
    </svg>
  );
});
