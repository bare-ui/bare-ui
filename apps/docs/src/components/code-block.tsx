'use client'

import { useFramework } from '../context/framework-context'
import type { Framework } from '../context/framework-context'

interface CodeBlockProps {
  /** Visible when React is selected (default) */
  children: React.ReactNode
}

/**
 * Wrapper that shows its children only when a specific framework is selected.
 * Used in MDX to conditionally display framework-specific code blocks.
 *
 * Usage in MDX:
 * ```mdx
 * <ForReact>
 * ```tsx
 * import { Button } from '@wire-ui/react'
 * ```
 * </ForReact>
 * <ForVue>
 * ```vue
 * <script setup>
 * import { Button } from '@wire-ui/vue'
 * </script>
 * ```
 * </ForVue>
 * ```
 */
function ForFramework({ framework: target, children }: { framework: Framework; children: React.ReactNode }) {
  const { framework } = useFramework()
  if (framework !== target) return null
  return <>{children}</>
}

export function ForReact({ children }: CodeBlockProps) {
  return <ForFramework framework="react">{children}</ForFramework>
}

export function ForVue({ children }: CodeBlockProps) {
  return <ForFramework framework="vue">{children}</ForFramework>
}

export function ForSolid({ children }: CodeBlockProps) {
  return <ForFramework framework="solid">{children}</ForFramework>
}
