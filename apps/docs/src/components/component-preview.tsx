'use client'

import {
  SandpackProvider,
  SandpackLayout,
  SandpackPreview,
  SandpackConsole,
} from '@codesandbox/sandpack-react'

const LIB_PKG = JSON.stringify({
  name: '@wire-ui/react',
  version: '0.1.4',
  type: 'module',
  main: './index.js',
  module: './index.js',
  exports: { '.': { import: './index.js', default: './index.js' } },
})

type Props = {
  code: string
  height?: number
  showConsole?: boolean
  libSource: string
}

export function ComponentPreview({ code, height = 500, showConsole = false, libSource }: Props) {
  return (
    <div className="my-6 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
      <SandpackProvider
        template="react-ts"
        files={{
          '/App.tsx': { code, active: true },
          '/node_modules/@wire-ui/react/index.js': { code: libSource, hidden: true },
          '/node_modules/@wire-ui/react/package.json': { code: LIB_PKG, hidden: true },
        }}
        customSetup={{
          dependencies: {
            // React is provided by the template; no external fetches needed
          },
        }}
        options={{
          externalResources: ['https://cdn.tailwindcss.com'],
        }}
        theme="auto"
      >
        <SandpackLayout>
          <SandpackPreview style={{ height }} showNavigator={false} showOpenInCodeSandbox />
          {showConsole && <SandpackConsole style={{ maxHeight: 120 }} />}
        </SandpackLayout>
      </SandpackProvider>
    </div>
  )
}
