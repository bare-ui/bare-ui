'use client'

import { Tooltip } from '@wire-ui/react'

const contentCls = 'rounded-[8px] border border-black bg-[#f5f5f5] px-2.5 py-1.5 text-xs font-medium text-black data-[state=closed]:hidden whitespace-nowrap'

export function Basic() {
  return (
    <div className="p-6 flex items-center justify-center">
      <Tooltip.Root delayDuration={0}>
        <Tooltip.Trigger>
          <button className="rounded-[8px] border border-black bg-black px-4 py-2 text-sm font-medium text-white hover:bg-[#333]">Hover me</button>
        </Tooltip.Trigger>
        <Tooltip.Content side="top" className={contentCls}>Tooltip on top</Tooltip.Content>
      </Tooltip.Root>
    </div>
  )
}

export function Composed() {
  return (
    <div className="p-6 flex flex-col items-center justify-center gap-16">
      <Tooltip.Root delayDuration={0}>
        <Tooltip.Trigger>
          <button className="rounded-[8px] border border-black px-4 py-2 text-sm font-medium text-black hover:bg-[#f5f5f5]">Top</button>
        </Tooltip.Trigger>
        <Tooltip.Content side="top" className={contentCls}>Tooltip on top</Tooltip.Content>
      </Tooltip.Root>

      <div className="flex gap-24">
        <Tooltip.Root delayDuration={0}>
          <Tooltip.Trigger>
            <button className="rounded-[8px] border border-black px-4 py-2 text-sm font-medium text-black hover:bg-[#f5f5f5]">Left</button>
          </Tooltip.Trigger>
          <Tooltip.Content side="left" className={contentCls}>Tooltip on left</Tooltip.Content>
        </Tooltip.Root>

        <Tooltip.Root delayDuration={0}>
          <Tooltip.Trigger>
            <button className="rounded-[8px] border border-black px-4 py-2 text-sm font-medium text-black hover:bg-[#f5f5f5]">Right</button>
          </Tooltip.Trigger>
          <Tooltip.Content side="right" className={contentCls}>Tooltip on right</Tooltip.Content>
        </Tooltip.Root>
      </div>

      <Tooltip.Root delayDuration={0}>
        <Tooltip.Trigger>
          <button className="rounded-[8px] border border-black px-4 py-2 text-sm font-medium text-black hover:bg-[#f5f5f5]">Bottom</button>
        </Tooltip.Trigger>
        <Tooltip.Content side="bottom" className={contentCls}>Tooltip on bottom</Tooltip.Content>
      </Tooltip.Root>
    </div>
  )
}

export function Complex() {
  return (
    <div className="p-6 flex items-center justify-center gap-6">
      <Tooltip.Root delayDuration={0}>
        <Tooltip.Trigger>
          <button className="rounded-[8px] border border-black px-4 py-2 text-sm font-medium text-black hover:bg-[#f5f5f5]">Outline Button</button>
        </Tooltip.Trigger>
        <Tooltip.Content side="top" className={contentCls}>This is an outline trigger</Tooltip.Content>
      </Tooltip.Root>

      <Tooltip.Root delayDuration={0}>
        <Tooltip.Trigger>
          <button className="rounded-[8px] border border-black bg-black px-4 py-2 text-sm font-medium text-white hover:bg-[#333]">Solid Button</button>
        </Tooltip.Trigger>
        <Tooltip.Content side="top" className={contentCls}>This is a solid trigger</Tooltip.Content>
      </Tooltip.Root>
    </div>
  )
}
