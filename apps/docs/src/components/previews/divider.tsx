'use client'

import { Divider } from '@wire-ui/react'

export function DividerPreview() {
  return (
    <div className="p-6 flex flex-col gap-8">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-3">Horizontal</p>
        <div className="flex flex-col gap-3">
          <p className="text-sm text-black">Item one</p>
          <Divider className="h-[2px] w-full bg-black" />
          <p className="text-sm text-black">Item two</p>
          <Divider className="h-[2px] w-full bg-black" />
          <p className="text-sm text-black">Item three</p>
        </div>
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-3">Vertical</p>
        <div className="flex h-6 items-center gap-3">
          <span className="text-sm text-black">Home</span>
          <Divider orientation="vertical" className="h-full w-[2px] bg-black" />
          <span className="text-sm text-black">About</span>
          <Divider orientation="vertical" className="h-full w-[2px] bg-black" />
          <span className="text-sm text-black">Contact</span>
        </div>
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-3">With label</p>
        <div className="flex w-64 items-center gap-3">
          <Divider className="h-[2px] flex-1 bg-black" />
          <span className="text-xs text-[#6b7280]">OR</span>
          <Divider className="h-[2px] flex-1 bg-black" />
        </div>
      </div>
    </div>
  )
}
