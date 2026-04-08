'use client'

import { Tooltip } from '@wire-ui/react'

const contentCls = 'rounded-[8px] border-2 border-black bg-[#f5f5f5] px-2.5 py-1.5 text-xs font-medium text-black data-[state=closed]:hidden whitespace-nowrap'

export function TooltipPreview() {
  return (
    <div className="p-6 flex flex-col items-center justify-center gap-16">
      <Tooltip.Root delayDuration={0}>
        <Tooltip.Trigger>
          <button className="rounded-[8px] border-2 border-black px-4 py-2 text-sm font-medium text-black hover:bg-[#f5f5f5]">Top (default)</button>
        </Tooltip.Trigger>
        <Tooltip.Content side="top" className={contentCls}>Tooltip on top</Tooltip.Content>
      </Tooltip.Root>

      <Tooltip.Root delayDuration={0}>
        <Tooltip.Trigger>
          <button className="rounded-[8px] border-2 border-black px-4 py-2 text-sm font-medium text-black hover:bg-[#f5f5f5]">Bottom</button>
        </Tooltip.Trigger>
        <Tooltip.Content side="bottom" className={contentCls}>Tooltip on bottom</Tooltip.Content>
      </Tooltip.Root>

      <div className="flex gap-24">
        <Tooltip.Root delayDuration={0}>
          <Tooltip.Trigger>
            <button className="rounded-[8px] border-2 border-black px-4 py-2 text-sm font-medium text-black hover:bg-[#f5f5f5]">Left</button>
          </Tooltip.Trigger>
          <Tooltip.Content side="left" className={contentCls}>Tooltip on left</Tooltip.Content>
        </Tooltip.Root>

        <Tooltip.Root delayDuration={0}>
          <Tooltip.Trigger>
            <button className="rounded-[8px] border-2 border-black px-4 py-2 text-sm font-medium text-black hover:bg-[#f5f5f5]">Right</button>
          </Tooltip.Trigger>
          <Tooltip.Content side="right" className={contentCls}>Tooltip on right</Tooltip.Content>
        </Tooltip.Root>
      </div>
    </div>
  )
}
