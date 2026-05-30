'use client'

import { Sheet } from '@wire-ui/react'
import { useState } from 'react'

const overlayCls = 'fixed inset-0 z-40 bg-black/50'
const contentBaseCls =
  'z-50 flex flex-col border-t-[3px] border-black bg-white transition-transform duration-300 ease-out data-[dragging]:transition-none'
const handleCls =
  'mx-auto mt-3 h-1.5 w-10 shrink-0 cursor-grab rounded-full bg-[#d4d4d4] active:cursor-grabbing'

export function SheetPreview() {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex justify-center p-6">
      <Sheet.Root open={open} onOpenChange={setOpen} snapPoints={[0.4]}>
        <Sheet.Trigger className="inline-flex items-center rounded-[8px] border border-black bg-black px-4 py-2 text-sm font-medium text-white hover:bg-[#333]">
          Open Sheet
        </Sheet.Trigger>
        <Sheet.Portal>
          <Sheet.Overlay className={overlayCls} />
          <Sheet.Content className={`${contentBaseCls} rounded-t-[20px]`}>
            <Sheet.Handle className={handleCls} />
            <div className="p-5">
              <Sheet.Title className="text-lg font-bold text-black">Bottom sheet</Sheet.Title>
              <Sheet.Description className="mt-1 text-sm text-[#6b7280]">
                Slides up from the bottom edge. Drag the handle down or tap the overlay to dismiss.
              </Sheet.Description>
              <Sheet.Close className="mt-4 w-full rounded-[8px] border border-black py-2 text-sm font-medium text-black hover:bg-[#f5f5f5]">
                Done
              </Sheet.Close>
            </div>
          </Sheet.Content>
        </Sheet.Portal>
      </Sheet.Root>
    </div>
  )
}
