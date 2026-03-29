'use client'

import { FrameworkProvider } from '../context/framework-context'

export function DocsProviders({ children }: { children: React.ReactNode }) {
  return <FrameworkProvider>{children}</FrameworkProvider>
}
