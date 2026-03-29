'use client'

import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackConsole,
} from '@codesandbox/sandpack-react'
import { useState } from 'react'

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

export function ComponentPreview({ code, height = 200, showConsole = false, libSource }: Props) {
  const [showCode, setShowCode] = useState(false)

  return (
    <div className="my-6 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-2 dark:border-gray-700 dark:bg-gray-900">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Preview</span>
        <button
          onClick={() => setShowCode((v) => !v)}
          className="rounded px-2 py-1 text-xs text-gray-500 transition hover:bg-gray-200 hover:text-gray-800 dark:hover:bg-gray-700 dark:hover:text-gray-200"
        >
          {showCode ? 'Hide code' : 'Show code'}
        </button>
      </div>

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
          {showCode && (
            <SandpackCodeEditor
              showLineNumbers
              showInlineErrors
              style={{ height: height + 100 }}
            />
          )}
          <SandpackPreview style={{ height }} showNavigator={false} showOpenInCodeSandbox />
          {showConsole && <SandpackConsole style={{ maxHeight: 120 }} />}
        </SandpackLayout>
      </SandpackProvider>
    </div>
  )
}
