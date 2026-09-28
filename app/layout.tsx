import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { FeedbackProvider } from '@/components/feedback-modal';
import { MotionPrefsProvider } from '@/components/motion-prefs';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = {
  title: 'SignBridge — Turn Any Video into Sign Language',
  description:
    'AI-powered avatar signing that respects grammar, facial expressions, and the visual nature of ASL. Make content truly accessible.',
  keywords: ['ASL', 'sign language', 'accessibility', 'AI avatar', 'video conversion', 'Deaf community'],
  openGraph: {
    title: 'SignBridge — Turn Any Video into Sign Language',
    description: 'AI-powered avatar signing that respects ASL grammar and expression.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="min-h-screen bg-white font-sans text-slate-900 dark:bg-navy-900 dark:text-slate-100">
        <ThemeProvider>
          <MotionPrefsProvider>
            <FeedbackProvider>
              <a href="#main-content" className="skip-link">
                Skip to main content
              </a>
              <Navbar />
              <main id="main-content" className="min-h-[70vh]">
                {children}
              </main>
              <Footer />
            </FeedbackProvider>
          </MotionPrefsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
