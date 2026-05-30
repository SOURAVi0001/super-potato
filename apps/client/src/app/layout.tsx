import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'], // ONLY these two weights for strict Notion/Linear aesthetic
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'LMS — Premier Loan Management System',
  description: 'A full-lifecycle digital lending platform offering multi-step applications and executive operations management.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased min-h-screen selection:bg-brand-100 selection:text-brand-900 bg-[#faf9f7] text-stone-800">
        {children}
      </body>
    </html>
  );
}
