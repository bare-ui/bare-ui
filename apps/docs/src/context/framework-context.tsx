'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export type Framework = 'react' | 'vue' | 'solid'

const FRAMEWORKS: Framework[] = ['react', 'vue', 'solid']
const DEFAULT_FRAMEWORK: Framework = 'react'

interface FrameworkContextValue {
  framework: Framework
  setFramework: (fw: Framework) => void
}

const FrameworkContext = createContext<FrameworkContextValue>({
  framework: DEFAULT_FRAMEWORK,
  setFramework: () => {},
})

/**
 * Extract the framework from the URL pathname.
 * e.g. /vue/docs/components/button → 'vue'
 */
function getFrameworkFromPath(): Framework | null {
  if (typeof window === 'undefined') return null
  const match = window.location.pathname.match(/^\/(react|vue|solid)\/docs/)
  if (match && FRAMEWORKS.includes(match[1] as Framework)) {
    return match[1] as Framework
  }
  return null
}

export function FrameworkProvider({ children }: { children: React.ReactNode }) {
  const [framework, setFrameworkState] = useState<Framework>(DEFAULT_FRAMEWORK)

  useEffect(() => {
    // Priority: URL path > localStorage > default
    const fromPath = getFrameworkFromPath()
    if (fromPath) {
      setFrameworkState(fromPath)
      localStorage.setItem('wire-ui-framework', fromPath)
      return
    }

    const stored = localStorage.getItem('wire-ui-framework') as Framework | null
    if (stored && FRAMEWORKS.includes(stored)) {
      setFrameworkState(stored)
    }
  }, [])

  const setFramework = (fw: Framework) => {
    localStorage.setItem('wire-ui-framework', fw)

    // Update cookie so the docs layout (which reads the cookie server-side to
    // render framework-aware sidebar entries) picks up the new framework.
    document.cookie = `wire-ui-framework=${fw};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`

    // Do a full navigation so the SSR'd layout (sidebar with framework-specific
    // hook/composable/primitive title) re-renders with the new cookie. The
    // middleware rewrites all /{framework}/docs/* to the same internal route,
    // so a client-side router.replace + router.refresh isn't reliable.
    const { pathname, search, hash } = window.location
    const newPath = pathname.replace(/^\/(react|vue|solid)(\/docs)/, `/${fw}$2`)
    window.location.assign((newPath !== pathname ? newPath : pathname) + search + hash)
  }

  return (
    <FrameworkContext.Provider value={{ framework, setFramework }}>
      {children}
    </FrameworkContext.Provider>
  )
}

export const useFramework = () => useContext(FrameworkContext)
