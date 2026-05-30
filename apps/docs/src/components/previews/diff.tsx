'use client'

import { Diff } from '@wire-ui/react'

const before = `export function add(a, b) {
  return a + b;
}

const total = add(1, 2);`

const after = `export function add(...nums) {
  return nums.reduce((a, b) => a + b, 0);
}

const total = add(1, 2, 3);`

const gutterCls = 'inline-block w-8 select-none px-2 text-right text-[#9ca3af]'

function lineClass(type: 'equal' | 'insert' | 'delete') {
  if (type === 'insert') return 'bg-green-50 text-green-900'
  if (type === 'delete') return 'bg-red-50 text-red-900'
  return 'text-[#374151]'
}

function sign(type: 'equal' | 'insert' | 'delete') {
  if (type === 'insert') return '+'
  if (type === 'delete') return '-'
  return ' '
}

export function DiffPreview() {
  return (
    <div className="flex justify-center p-6">
      <div className="w-full max-w-xl overflow-hidden rounded-[8px] border border-black bg-white font-mono text-xs">
        <Diff.Root oldValue={before} newValue={after}>
          <div className="flex items-center justify-between border-b border-black bg-[#f5f5f5] px-4 py-2">
            <span className="text-[#374151]">src/math.ts</span>
            <Diff.Stats>
              {({ additions, deletions }) => (
                <div className="flex gap-3">
                  <span className="text-green-600">+{additions}</span>
                  <span className="text-red-600">−{deletions}</span>
                </div>
              )}
            </Diff.Stats>
          </div>
          <Diff.Unified>
            {({ line }) => (
              <div className={`flex whitespace-pre px-1 ${lineClass(line.type)}`}>
                <span className={gutterCls}>{line.oldLine ?? ''}</span>
                <span className={gutterCls}>{line.newLine ?? ''}</span>
                <span className="px-2">{sign(line.type)}</span>
                <span>{line.content}</span>
              </div>
            )}
          </Diff.Unified>
        </Diff.Root>
      </div>
    </div>
  )
}
