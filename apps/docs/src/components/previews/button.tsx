'use client'

import { Button } from '@wire-ui/react'

export function ButtonBasic() {
  return (
    <div className="p-6 flex items-center justify-center">
      <Button className="inline-flex cursor-pointer items-center justify-center rounded-[8px] border border-black px-4 py-2 bg-[#f5f5f5] text-sm font-medium text-black outline-none transition-colors [data-hover]:bg-black [data-hover]:text-white [data-active]:scale-95 [data-focus-visible]:ring-2 [data-focus-visible]:ring-black [data-focus-visible]:ring-offset-2 [data-disabled]:cursor-not-allowed [data-disabled]:opacity-50">
        Styled Button
      </Button>
    </div>
  )
}

export function ButtonComposed() {
  return (
    <div className="p-6 flex items-center justify-center">
      <Button asChild>
        <a
          href="https://example.com"
          target="_blank"
          rel="noopener noreferrer"
          className="no-underline inline-flex cursor-pointer items-center justify-center rounded-[8px] border border-black px-4 py-2 bg-[#f5f5f5] text-sm font-medium text-black outline-none transition-colors [data-hover]:bg-black [data-hover]:text-white [data-active]:scale-95 [data-focus-visible]:ring-2 [data-focus-visible]:ring-black [data-focus-visible]:ring-offset-2 [data-disabled]:cursor-not-allowed [data-disabled]:opacity-50">
          Open example.com &rarr;
        </a>
      </Button>
    </div>
  )
}

export function ButtonComplex() {
  return (
    <div className="p-6 flex flex-col gap-4">
      <p className="text-xs font-medium uppercase tracking-wide text-[#6b7280]">Data attributes showcase</p>
      <p className="text-sm text-[#6b7280]">Hover, click, and tab to each button — data attributes change in real time.</p>
      <div className="flex flex-wrap gap-4">
        <Button className="cursor-pointer rounded-[8px] border border-black bg-white px-4 py-2 text-sm text-black outline-none transition-colors [data-hover]:bg-black [data-hover]:text-white [data-active]:scale-95 [data-focus-visible]:ring-2 [data-focus-visible]:ring-black">
          Hover me
        </Button>
        <Button className="cursor-pointer rounded-[8px] border border-black bg-white px-4 py-2 text-sm text-black outline-none transition-colors [data-hover]:bg-black [data-hover]:text-white [data-active]:scale-95 [data-focus-visible]:ring-2 [data-focus-visible]:ring-black">
          Tab to me
        </Button>
        <Button disabled className="cursor-not-allowed rounded-[8px] border border-black bg-white px-4 py-2 text-sm text-black outline-none [data-disabled]:opacity-50">
          Disabled
        </Button>
      </div>
    </div>
  )
}
