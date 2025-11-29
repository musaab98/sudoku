// src/app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sudoku',
  description: 'Simple Sudoku App',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* The body tag wraps all your pages */}
      <body>{children}</body>
    </html>
  );
}