import { readFileSync } from 'fs'
import { join } from 'path'

export function LicenseText() {
  const text = readFileSync(join(process.cwd(), '../../LICENSE'), 'utf-8')

  return (
    <pre className="overflow-x-auto rounded-lg bg-neutral-900 p-4 text-sm text-neutral-200">
      <code>{text}</code>
    </pre>
  )
}
