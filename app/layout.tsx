import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SnapCal AI — 卡路里分析',
  description: '上传餐食照片，AI 帮你估算卡路里和营养成分',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
