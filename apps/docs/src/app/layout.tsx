import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s – bare-ui',
    default: 'bare-ui',
  },
  description:
    'A headless, unstyled React 19 component library. Style everything with your own CSS using data-* attributes.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
