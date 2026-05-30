'use client'

import { Toolbar } from '@wire-ui/react'

const btnCls =
  'flex size-9 cursor-pointer items-center justify-center rounded-[8px] text-sm text-black outline-none transition-colors hover:bg-[#f5f5f5] data-[state=on]:bg-black data-[state=on]:text-white data-[focus-visible]:ring-2 data-[focus-visible]:ring-black'

export function ToolbarPreview() {
  return (
    <div className="flex justify-center p-6">
      <Toolbar.Root
        aria-label="Text formatting"
        className="inline-flex items-center gap-1 rounded-[8px] border border-black bg-white p-1"
      >
        <Toolbar.Toggle className={btnCls} aria-label="Bold" defaultPressed>
          <b>B</b>
        </Toolbar.Toggle>
        <Toolbar.Toggle className={btnCls} aria-label="Italic">
          <i>I</i>
        </Toolbar.Toggle>
        <Toolbar.Toggle className={`${btnCls} underline`} aria-label="Underline">
          U
        </Toolbar.Toggle>
        <Toolbar.Separator className="mx-1 h-5 w-px bg-black" />
        <Toolbar.Button className={btnCls} aria-label="Align left">
          ⬅
        </Toolbar.Button>
        <Toolbar.Button className={btnCls} aria-label="Align center">
          ↔
        </Toolbar.Button>
        <Toolbar.Button className={btnCls} aria-label="Align right">
          ➡
        </Toolbar.Button>
        <Toolbar.Separator className="mx-1 h-5 w-px bg-black" />
        <Toolbar.Link href="#" className={`${btnCls} w-auto px-2`}>
          Help
        </Toolbar.Link>
      </Toolbar.Root>
    </div>
  )
}
