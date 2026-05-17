'use client'

import { AspectRatio } from '@wire-ui/react'

const placeholderCls =
  'flex h-full w-full items-center justify-center rounded-[8px] border border-black bg-[#f5f5f5] text-sm font-medium text-black'

export function AspectRatioPreview() {
  return (
    <div className="p-6 grid grid-cols-3 gap-4 w-full max-w-2xl mx-auto">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-[#6b7280]">1:1</p>
        <AspectRatio ratio={1}>
          <div className={placeholderCls}>1:1</div>
        </AspectRatio>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-[#6b7280]">16:9</p>
        <AspectRatio ratio={16 / 9}>
          <div className={placeholderCls}>16:9</div>
        </AspectRatio>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-[#6b7280]">4:3</p>
        <AspectRatio ratio={4 / 3}>
          <div className={placeholderCls}>4:3</div>
        </AspectRatio>
      </div>
    </div>
  )
}
