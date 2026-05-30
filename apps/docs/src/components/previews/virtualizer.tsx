'use client'

import { Virtualizer } from '@wire-ui/react'

export function VirtualizerPreview() {
  return (
    <div className="flex justify-center p-6">
      <div className="w-72 overflow-hidden rounded-[20px] border border-black bg-white">
        <div className="flex items-center justify-between border-b border-black px-4 py-3">
          <p className="text-sm font-semibold text-black">Items</p>
          <span className="text-xs text-[#6b7280]">1,000</span>
        </div>
        <Virtualizer.Root count={1000} estimateSize={44} className="h-80">
          {({ index }) => (
            <div className="flex items-center gap-3 border-b border-[#e5e5e5] px-4 py-3 text-sm">
              <span className="flex size-7 items-center justify-center rounded-full border border-black bg-[#f5f5f5] text-xs text-black">
                {index}
              </span>
              <span className="text-black">Item number {index}</span>
            </div>
          )}
        </Virtualizer.Root>
      </div>
    </div>
  )
}
