'use client'

import { RichText } from '@wire-ui/react'
import type { ReactNode } from 'react'
import { useState } from 'react'

type Node =
  | { type: 'heading'; depth: number; children: Node[] }
  | { type: 'paragraph'; children: Node[] }
  | { type: 'list'; ordered: boolean; children: Node[] }
  | { type: 'listItem'; children: Node[] }
  | { type: 'strong'; children: Node[] }
  | { type: 'text'; value: string }

function inline(text: string): Node[] {
  const nodes: Node[] = []
  const regex = /\*\*(.+?)\*\*/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = regex.exec(text))) {
    if (m.index > last) nodes.push({ type: 'text', value: text.slice(last, m.index) })
    nodes.push({ type: 'strong', children: [{ type: 'text', value: m[1] }] })
    last = m.index + m[0].length
  }
  if (last < text.length) nodes.push({ type: 'text', value: text.slice(last) })
  return nodes
}

// Tiny demo parser — swap for remark/marked in real apps.
function miniParse(src: string): Node[] {
  return src.split('\n\n').map((block) => {
    const heading = block.match(/^(#{1,3})\s+(.*)$/)
    if (heading) return { type: 'heading', depth: heading[1].length, children: inline(heading[2]) }
    if (block.startsWith('- ')) {
      return {
        type: 'list',
        ordered: false,
        children: block.split('\n').map((li) => ({ type: 'listItem', children: inline(li.replace(/^- /, '')) })),
      }
    }
    return { type: 'paragraph', children: inline(block) }
  })
}

const previewComponents = {
  heading: ({ children }: { children?: ReactNode }) => <h3 className="mb-2 text-lg font-bold text-black">{children}</h3>,
  paragraph: ({ children }: { children?: ReactNode }) => <p className="mb-2 text-sm text-[#374151]">{children}</p>,
  list: ({ children }: { children?: ReactNode }) => <ul className="mb-2 list-disc pl-5 text-sm text-[#374151]">{children}</ul>,
  strong: ({ children }: { children?: ReactNode }) => <strong className="font-semibold text-black">{children}</strong>,
}

const actionCls = 'rounded-[6px] px-2 py-1 text-sm text-black hover:bg-[#f5f5f5]'
const tabCls = (active: boolean) =>
  `rounded-[6px] px-2 py-1 text-sm ${active ? 'bg-black text-white' : 'text-[#6b7280] hover:bg-[#f5f5f5]'}`

export function RichTextPreview() {
  const [mode, setMode] = useState<'edit' | 'preview' | 'split'>('split')

  return (
    <div className="flex justify-center p-6">
      <RichText.Root
        defaultValue={'# Hello\n\nType **markdown** on the left, see it rendered on the right.\n\n- item one\n- item two'}
        mode={mode}
        onModeChange={setMode}
        parse={miniParse}
        components={previewComponents}
        className="w-full max-w-2xl overflow-hidden rounded-[20px] border border-black bg-white">
        <RichText.Toolbar className="flex items-center gap-1 border-b border-black bg-[#fafafa] p-1.5">
          <RichText.Action wrap="**" className={`${actionCls} font-bold`}>
            B
          </RichText.Action>
          <RichText.Action wrap="_" className={`${actionCls} italic`}>
            I
          </RichText.Action>
          <RichText.Action wrap={['[', '](url)']} className={actionCls}>
            Link
          </RichText.Action>
          <RichText.Action insert={'\n- '} className={actionCls}>
            • List
          </RichText.Action>
          <div className="ml-auto flex gap-1">
            {(['edit', 'split', 'preview'] as const).map((m) => (
              <button key={m} type="button" onClick={() => setMode(m)} className={tabCls(mode === m)}>
                {m}
              </button>
            ))}
          </div>
        </RichText.Toolbar>
        <div className={`grid ${mode === 'split' ? 'grid-cols-2' : 'grid-cols-1'}`}>
          <RichText.Editor
            className="min-h-48 w-full resize-none border-r border-black p-3 font-mono text-sm text-black placeholder:text-[#9ca3af] outline-none"
            placeholder="Write some markdown…"
          />
          <RichText.Preview className="min-h-48 p-3" />
        </div>
      </RichText.Root>
    </div>
  )
}
