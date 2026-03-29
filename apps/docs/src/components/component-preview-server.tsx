import { readFileSync } from 'fs'
import path from 'path'
import { ComponentPreview } from './component-preview'

type Props = {
  code: string
  height?: number
  showConsole?: boolean
}

function readLibSource(): string {
  // During local dev: read from monorepo packages/wire-ui/dist
  // After npm publish: falls back to node_modules
  const candidates = [
    // monorepo local build (dev + Vercel deploy)
    path.join(process.cwd(), '../../packages/wire-ui/dist/wire-ui.es.js'),
    // root node_modules symlink (npm workspaces)
    path.join(process.cwd(), '../../node_modules/@wire-ui/react/dist/wire-ui.es.js'),
    // installed from npm (standalone / Vercel)
    path.join(process.cwd(), 'node_modules/@wire-ui/react/dist/wire-ui.es.js'),
  ]

  for (const filePath of candidates) {
    try {
      return readFileSync(filePath, 'utf-8')
    } catch {
      // try next candidate
    }
  }

  return '// @wire-ui/react could not be loaded'
}

export function ComponentPreviewServer({ code, height, showConsole }: Props) {
  const libSource = readLibSource()
  return <ComponentPreview code={code} height={height} showConsole={showConsole} libSource={libSource} />
}
