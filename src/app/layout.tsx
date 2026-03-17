import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ToastProvider } from '@/components/Toast';
import Navbar from '@/components/Navbar';
import ParticleCanvas from '@/components/ParticleCanvas';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'LifeAI — Your Intelligent Daily Life Companion',
  description: 'Solve daily problems, manage tasks, track finances, build healthy habits, and boost focus — all powered by AI.',
  keywords: ['AI', 'productivity', 'task manager', 'finance tracker', 'wellness', 'pomodoro', 'LifeAI'],
  icons: {
    icon: '/favicon.svg',
    apple: '/logo.svg',
  },
  openGraph: {
    title: 'LifeAI — Your Intelligent Daily Life Companion',
    description: 'An AI-powered daily life hub for tasks, finances, wellness, and focus.',
    images: ['/logo.svg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <ToastProvider>
            <ParticleCanvas />
            <Navbar />
            <main className="relative z-[1] pt-[68px] min-h-screen">
              {children}
            </main>
            <Footer />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
