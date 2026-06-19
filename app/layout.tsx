import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Logit AI — Calorie Analysis',
  description: 'Upload a meal photo and let AI estimate your calories and nutrition.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
      <body>{children}</body>
    </html>
  )
}
