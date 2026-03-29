'use client'

import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackConsole,
} from '@codesandbox/sandpack-react'
import { useState } from 'react'

const APP_ENTRY = `
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

const root = createRoot(document.getElementById('root'))
root.render(<App />)
`.trim()

const HTML_ENTRY = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
`.trim()

type Props = {
  code: string
  height?: number
  showConsole?: boolean
}

export function ComponentPreview({ code, height = 200, showConsole = false }: Props) {
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
        template="react"
        files={{
          '/App.tsx': code,
          '/index.tsx': APP_ENTRY,
          '/index.html': HTML_ENTRY,
        }}
        customSetup={{
          dependencies: {
            'bareui': 'latest',
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
