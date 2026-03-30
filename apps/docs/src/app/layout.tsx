import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    template: '%s – Wire UI',
    default: 'Wire UI',
  },
  description:
    'A headless, unstyled React 19 component library. Style everything with your own CSS using data-* attributes.',
  icons: {
    icon: [
      { url: '/images/favicon/favicon.ico' },
      { url: '/images/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/images/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/images/favicon/apple-touch-icon.png',
    other: [
      { rel: 'android-chrome-192x192', url: '/images/favicon/android-chrome-192x192.png' },
      { rel: 'android-chrome-512x512', url: '/images/favicon/android-chrome-512x512.png' },
    ],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
