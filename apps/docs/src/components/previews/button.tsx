'use client'

import { Button } from '@wire-ui/react'

export function ButtonPreview() {
  return (
    <div className="p-6 flex flex-col gap-8">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-4">Styled</p>
        <Button className="inline-flex cursor-pointer items-center justify-center rounded-[8px] border-2 border-black px-4 py-2 bg-[#f5f5f5] text-sm font-medium text-black outline-none transition-colors [data-hover]:bg-black [data-hover]:text-white [data-active]:scale-95 [data-focus-visible]:ring-2 [data-focus-visible]:ring-blue-500 [data-focus-visible]:ring-offset-2 [data-disabled]:cursor-not-allowed [data-disabled]:opacity-50">
          Styled Button
        </Button>
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-3">Data attributes showcase</p>
        <p className="text-sm text-[#6b7280] mb-4">Hover, click, and tab to each button — data attributes change in real time.</p>
        <div className="flex flex-wrap gap-4">
          <Button className="cursor-pointer rounded-[8px] border-2 border-black bg-white px-4 py-2 text-sm text-black outline-none transition-colors [data-hover]:bg-black [data-hover]:text-white [data-active]:scale-95 [data-focus-visible]:ring-2 [data-focus-visible]:ring-blue-500">
            Hover me
          </Button>
          <Button className="cursor-pointer rounded-[8px] border-2 border-black bg-white px-4 py-2 text-sm text-black outline-none transition-colors [data-hover]:bg-black [data-hover]:text-white [data-active]:scale-95 [data-focus-visible]:ring-2 [data-focus-visible]:ring-blue-500">
            Tab to me
          </Button>
          <Button disabled className="cursor-not-allowed rounded-[8px] border-2 border-black bg-white px-4 py-2 text-sm text-black outline-none [data-disabled]:opacity-50">
            Disabled
          </Button>
        </div>
      </div>
    </div>
  )
}
