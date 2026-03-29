'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export type Framework = 'react' | 'vue' | 'solid'

interface FrameworkContextValue {
  framework: Framework
  setFramework: (fw: Framework) => void
}

const FrameworkContext = createContext<FrameworkContextValue>({
  framework: 'react',
  setFramework: () => {},
})

export function FrameworkProvider({ children }: { children: React.ReactNode }) {
  const [framework, setFrameworkState] = useState<Framework>('react')

  useEffect(() => {
    const stored = localStorage.getItem('wire-ui-framework') as Framework | null
    if (stored && (['react', 'vue', 'solid'] as const).includes(stored)) {
      setFrameworkState(stored)
    }
  }, [])

  const setFramework = (fw: Framework) => {
    setFrameworkState(fw)
    localStorage.setItem('wire-ui-framework', fw)
  }

  return (
    <FrameworkContext.Provider value={{ framework, setFramework }}>
      {children}
    </FrameworkContext.Provider>
  )
}

export const useFramework = () => useContext(FrameworkContext)
