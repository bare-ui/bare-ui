'use client'

import { useState } from 'react'
import { TreeView } from '@wire-ui/react'
import type { TreeNode } from '@wire-ui/react'

const fileTree: TreeNode[] = [
  {
    id: 'src',
    label: 'src',
    children: [
      {
        id: 'src/components',
        label: 'components',
        children: [
          { id: 'src/components/Button.tsx', label: 'Button.tsx' },
          { id: 'src/components/Card.tsx', label: 'Card.tsx' },
          {
            id: 'src/components/Tabs',
            label: 'Tabs',
            children: [
              { id: 'src/components/Tabs/index.ts', label: 'index.ts' },
              { id: 'src/components/Tabs/Tabs.tsx', label: 'Tabs.tsx' },
            ],
          },
        ],
      },
      { id: 'src/index.ts', label: 'index.ts' },
    ],
  },
  { id: 'package.json', label: 'package.json' },
  { id: 'README.md', label: 'README.md' },
]

const rowCls =
  'flex items-center gap-1 px-2 py-1 text-sm text-black cursor-pointer rounded-[6px] hover:bg-[#f5f5f5] data-[selected]:bg-[#f5f5f5] data-[selected]:font-medium'
const toggleCls = 'inline-flex size-5 items-center justify-center rounded text-[#6b7280] hover:bg-[#e5e5e5]'

export function TreeViewPreview() {
  const [selected, setSelected] = useState<string[]>(['src/components/Button.tsx'])
  return (
    <div className="p-6 flex items-center justify-center">
      <div className="w-80 rounded-[20px] border border-black bg-white p-2">
        <TreeView.Root
          nodes={fileTree}
          defaultExpanded={['src', 'src/components']}
          selectionMode="single"
          selected={selected}
          onSelectionChange={setSelected}
          renderItem={(node, state) => (
            <div
              className={rowCls}
              style={{ paddingLeft: `${(state.level - 1) * 16 + 8}px` }}
              onClick={state.select}
            >
              {state.hasChildren ? (
                <button
                  data-tree-toggle
                  onClick={(e) => {
                    e.stopPropagation()
                    state.toggle()
                  }}
                  className={toggleCls}
                >
                  {state.expanded ? '▾' : '▸'}
                </button>
              ) : (
                <span className="inline-block size-5" />
              )}
              <span className="flex-1">{node.label}</span>
              {state.selected && <span className="text-xs text-black">✓</span>}
            </div>
          )}
        />
      </div>
    </div>
  )
}
