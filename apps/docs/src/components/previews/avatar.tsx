'use client'

import { Avatar } from '@wire-ui/react'

const rootCls = "relative inline-flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-black bg-[#f5f5f5] ring-2 ring-white"

export function AvatarPreview() {
  return (
    <div className="p-6 flex items-center justify-center">
      <div className="flex -space-x-2">
        <Avatar.Root className={rootCls}>
          <Avatar.Image src="https://i.pravatar.cc/150?img=1" alt="User 1" className="size-full object-cover" />
          <Avatar.Fallback className="text-sm font-medium text-black select-none">U1</Avatar.Fallback>
        </Avatar.Root>
        <Avatar.Root className={rootCls}>
          <Avatar.Fallback className="text-sm font-medium text-black select-none">JD</Avatar.Fallback>
        </Avatar.Root>
        <Avatar.Root className="relative inline-flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-black bg-black ring-2 ring-white">
          <Avatar.Fallback className="text-xs font-medium text-white">+9</Avatar.Fallback>
        </Avatar.Root>
      </div>
    </div>
  )
}
