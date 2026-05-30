import type { Metadata } from 'next';
import './globals.css';

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
    <html lang="en">
      <body className="antialiased min-h-screen selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
