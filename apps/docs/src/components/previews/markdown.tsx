'use client'

import { Markdown } from '@wire-ui/react'
import type { MarkdownComponents, MarkdownNode } from '@wire-ui/react'

const doc: MarkdownNode[] = [
  { type: 'heading', depth: 2, children: [{ type: 'text', value: 'Wire UI' }] },
  {
    type: 'paragraph',
    children: [
      { type: 'text', value: 'A headless library with ' },
      { type: 'strong', children: [{ type: 'text', value: 'zero CSS' }] },
      { type: 'text', value: ' and ' },
      { type: 'emphasis', children: [{ type: 'text', value: 'full control' }] },
      { type: 'text', value: '.' },
    ],
  },
  {
    type: 'list',
    ordered: false,
    children: [
      { type: 'listItem', children: [{ type: 'text', value: 'Compound components' }] },
      { type: 'listItem', children: [{ type: 'text', value: 'data-* styling' }] },
      {
        type: 'listItem',
        children: [
          { type: 'text', value: 'Install ' },
          { type: 'inlineCode', value: '@wire-ui/react' },
        ],
      },
    ],
  },
  {
    type: 'blockquote',
    children: [{ type: 'paragraph', children: [{ type: 'text', value: 'Style it however you like.' }] }],
  },
  { type: 'code', lang: 'bash', value: 'npm i @wire-ui/react' },
]

const components: MarkdownComponents = {
  heading: ({ children }) => <h2 className="mb-2 text-lg font-semibold text-black">{children}</h2>,
  paragraph: ({ children }) => <p className="mb-3 text-sm leading-relaxed text-[#374151]">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold text-black">{children}</strong>,
  emphasis: ({ children }) => <em className="italic">{children}</em>,
  inlineCode: ({ node }) => (
    <code className="rounded border border-black bg-[#f5f5f5] px-1 py-0.5 font-mono text-[0.8em] text-black">
      {node.value}
    </code>
  ),
  code: ({ node }) => (
    <pre className="mb-3 overflow-x-auto rounded-[8px] border border-black bg-black p-3 font-mono text-xs text-white">
      <code>{node.value}</code>
    </pre>
  ),
  list: ({ children }) => (
    <ul className="mb-3 list-disc space-y-1 pl-5 text-sm text-[#374151]">{children}</ul>
  ),
  listItem: ({ children }) => <li>{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="mb-3 border-l-2 border-black pl-3 text-sm italic text-[#6b7280]">
      {children}
    </blockquote>
  ),
}

export function MarkdownPreview() {
  return (
    <div className="flex justify-center p-6">
      <div className="w-full max-w-lg rounded-[8px] border border-black bg-white p-5">
        <Markdown nodes={doc} components={components} />
      </div>
    </div>
  )
}
