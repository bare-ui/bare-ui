'use client'

import { Toggle, ToggleGroup } from '@wire-ui/react'
import { useState } from 'react'

const toggleCls =
  'flex h-9 min-w-9 cursor-pointer items-center justify-center rounded-[8px] px-2.5 text-sm text-black outline-none transition-colors hover:bg-[#f5f5f5] data-[state=on]:bg-black data-[state=on]:text-white data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40 data-[focus-visible]:ring-2 data-[focus-visible]:ring-black data-[focus-visible]:ring-offset-1'
const groupCls = 'inline-flex items-center gap-1 rounded-[8px] border border-black bg-white p-1'

export function TogglePreview() {
  const [marks, setMarks] = useState<string[]>(['bold'])
  const [align, setAlign] = useState<string | null>('left')

  return (
    <div className="flex justify-center p-6">
      <div className="flex flex-col items-center gap-4">
        <ToggleGroup.Root
          type="multiple"
          value={marks}
          onChange={setMarks}
          className={groupCls}
          aria-label="Text formatting"
        >
          <Toggle value="bold" className={toggleCls} aria-label="Bold">
            <b>B</b>
          </Toggle>
          <Toggle value="italic" className={toggleCls} aria-label="Italic">
            <i>I</i>
          </Toggle>
          <Toggle value="underline" className={`${toggleCls} underline`} aria-label="Underline">
            U
          </Toggle>
        </ToggleGroup.Root>

        <ToggleGroup.Root
          type="single"
          value={align}
          onChange={setAlign}
          className={groupCls}
          aria-label="Text alignment"
        >
          <Toggle value="left" className={toggleCls} aria-label="Align left">
            ⬅
          </Toggle>
          <Toggle value="center" className={toggleCls} aria-label="Align center">
            ↔
          </Toggle>
          <Toggle value="right" className={toggleCls} aria-label="Align right">
            ➡
          </Toggle>
        </ToggleGroup.Root>

        <p
          className="w-72 text-center text-sm leading-relaxed text-black"
          style={{
            fontWeight: marks.includes('bold') ? 700 : 400,
            fontStyle: marks.includes('italic') ? 'italic' : 'normal',
            textDecoration: marks.includes('underline') ? 'underline' : 'none',
            textAlign: (align ?? 'left') as 'left' | 'center' | 'right',
          }}
        >
          The quick brown fox jumps over the lazy dog.
        </p>
      </div>
    </div>
  )
}
