export type ConversionStatus = 'ready' | 'processing' | 'failed';

export interface Conversion {
  id: string;
  title: string;
  duration: string;
  durationSec: number;
  createdAt: string;
  status: ConversionStatus;
  progress?: number;
  thumbnailHue: number;
  gloss: string;
  transcript: string;
  views: number;
}

export const PIPELINE_STEPS = [
  { id: 'audio', label: 'Extracting Audio', desc: 'Isolating clean speech from background', icon: 'audio' },
  { id: 'stt', label: 'Speech-to-Text', desc: 'Whisper-grade transcription + diarization', icon: 'text' },
  { id: 'gloss', label: 'Text → ASL Gloss', desc: 'Grammar-aware ASL reordering', icon: 'lang' },
  { id: 'motion', label: 'Generating Avatar Motion', desc: 'Handshapes, face & body synthesis', icon: 'avatar' },
  { id: 'render', label: 'Rendering Signed Video', desc: '1080p avatar composite + captions', icon: 'video' },
] as const;

export const MOCK_CONVERSIONS: Conversion[] = [
  {
    id: 'conv-01',
    title: 'Welcome & Onboarding Message',
    duration: '2:14',
    durationSec: 134,
    createdAt: '2 hours ago',
    status: 'ready',
    thumbnailHue: 168,
    gloss: 'HELLO WELCOME OUR APP. WE HAPPY YOU HERE. VIDEO ACCESSIBLE DEAF YOU.',
    transcript: 'Hello and welcome! We are so happy you are here. Every video is now accessible to you.',
    views: 342,
  },
  {
    id: 'conv-02',
    title: 'Product Launch Keynote Q3',
    duration: '12:48',
    durationSec: 768,
    createdAt: 'Yesterday',
    status: 'ready',
    thumbnailHue: 225,
    gloss: 'TODAY WE ANNOUNCE NEW FEATURE. DEAF COMMUNITY FEEDBACK LEAD DESIGN.',
    transcript: 'Today we announce a brand new feature, designed directly from Deaf community feedback.',
    views: 1204,
  },
  {
    id: 'conv-03',
    title: 'Safety Training — Lab Intro',
    duration: '5:32',
    durationSec: 332,
    createdAt: 'Sep 21',
    status: 'processing',
    progress: 68,
    thumbnailHue: 190,
    gloss: 'SAFETY FIRST. PLEASE WATCH CAREFUL. EMERGENCY EXIT LEFT SIDE.',
    transcript: 'Safety first. Please watch carefully. Emergency exits are on the left side.',
    views: 0,
  },
  {
    id: 'conv-04',
    title: 'University Lecture: Intro to Linguistics',
    duration: '48:20',
    durationSec: 2900,
    createdAt: 'Sep 18',
    status: 'ready',
    thumbnailHue: 262,
    gloss: 'LANGUAGE RICH VISUAL. ASL GRAMMAR USE SPACE, FACE, BODY.',
    transcript: 'Language is rich and visual. ASL grammar uses space, face, and body together.',
    views: 876,
  },
  {
    id: 'conv-05',
    title: 'Marketing Explainer — Spring Sale',
    duration: '1:05',
    durationSec: 65,
    createdAt: 'Sep 15',
    status: 'ready',
    thumbnailHue: 150,
    gloss: 'SPRING SALE START NOW. SAVE 30% ALL PLAN. CAPTION + SIGN INCLUDE.',
    transcript: 'Our spring sale starts now — save 30% on all plans, captions and signing included.',
    views: 210,
  },
  {
    id: 'conv-06',
    title: 'Town Hall Recording — August',
    duration: '32:10',
    durationSec: 1930,
    createdAt: 'Sep 10',
    status: 'failed',
    thumbnailHue: 350,
    gloss: 'MEETING DISCUSS ACCESS FUTURE. SORRY ERROR PLEASE RETRY.',
    transcript: 'Town hall discussing the future of access.',
    views: 0,
  },
];

export const SAMPLE_GLOSS_FULL = `HELLO WELCOME VIDEO.
YOUR WORDS BECOME SIGN.
ME USE FACE, HAND, BODY.
GRAMMAR CORRECT, SOUL SAME.
DEAF COMMUNITY LEAD, WE LISTEN.`;

export const SAMPLE_TRANSCRIPT_FULL = `Hello and welcome to SignBridge. Your spoken words become fluent sign language. Our avatar uses face, hands, and body together — with correct grammar and the same warmth. Designed with the Deaf community, we listen first.`;
