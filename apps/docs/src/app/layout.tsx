import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s – Wire UI',
    default: 'Wire UI',
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
