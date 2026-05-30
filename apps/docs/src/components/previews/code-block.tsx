'use client'

import { CodeBlock } from '@wire-ui/react'

const shellCls =
  'relative w-full max-w-xl overflow-hidden rounded-[8px] border border-black bg-white font-mono text-sm'
const copyCls =
  'absolute right-2 top-2 rounded-[8px] border border-black bg-white px-2 py-1 text-xs text-black transition-colors hover:bg-[#f5f5f5] data-[copied]:bg-black data-[copied]:text-white'
const preCls = 'overflow-x-auto p-4 leading-relaxed text-black'
const gutterCls = 'mr-4 inline-block w-6 select-none text-right text-[#9ca3af]'

const KEYWORDS = ['function', 'const', 'let', 'var', 'return', 'if', 'else', 'for', 'while']
const KEYWORD_SPLIT = new RegExp(`\\b(${KEYWORDS.join('|')})\\b`)

function highlight(content: string) {
  return content.split(KEYWORD_SPLIT).map((part, i) =>
    KEYWORDS.includes(part) ? (
      <span key={i} className="font-semibold text-black">
        {part}
      </span>
    ) : (
      <span key={i} className="text-[#6b7280]">
        {part}
      </span>
    ),
  )
}

const sample = `function greet(name) {
  const message = "Hello, " + name;
  return message;
}`

export function CodeBlockPreview() {
  return (
    <div className="flex justify-center p-6">
      <CodeBlock.Root code={sample} language="js" highlightLines={[2]} className={shellCls}>
        <CodeBlock.CopyButton className={copyCls}>
          {({ copied }) => (copied ? 'Copied!' : 'Copy')}
        </CodeBlock.CopyButton>
        <CodeBlock.Code className={preCls}>
          <CodeBlock.Lines>
            {({ line }) => (
              <span className={`block px-2${line.highlighted ? ' bg-[#f5f5f5]' : ''}`}>
                <span className={gutterCls}>{line.number}</span>
                {highlight(line.content)}
              </span>
            )}
          </CodeBlock.Lines>
        </CodeBlock.Code>
      </CodeBlock.Root>
    </div>
  )
}
