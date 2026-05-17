'use client'

import { Popover } from '@wire-ui/react'

const triggerCls = 'inline-flex cursor-pointer items-center rounded-[8px] border border-black bg-black px-4 py-2 text-sm font-medium text-white hover:bg-[#333]'
const panelCls = 'absolute left-0 top-full z-10 mt-2 w-72 rounded-[20px] border border-black bg-white p-4 text-sm text-black'

export function PopoverPreview() {
  return (
    <div className="p-6 flex items-center justify-center min-h-[200px]">
      <Popover.Root className="relative inline-block">
        <Popover.Trigger className={triggerCls}>Account</Popover.Trigger>
        <Popover.Content className={panelCls}>
          <div className="flex items-center gap-3 pb-3 border-b border-black">
            <div className="flex size-10 items-center justify-center rounded-full border border-black bg-[#f5f5f5] text-sm font-semibold text-black">JD</div>
            <div>
              <p className="text-sm font-medium text-black">Jane Doe</p>
              <p className="text-xs text-[#6b7280]">jane@example.com</p>
            </div>
          </div>
          <nav className="mt-3 flex flex-col">
            <button className="cursor-pointer rounded-[8px] px-3 py-2 text-left text-sm text-black hover:bg-[#f5f5f5]">Profile</button>
            <button className="cursor-pointer rounded-[8px] px-3 py-2 text-left text-sm text-black hover:bg-[#f5f5f5]">Settings</button>
            <Popover.Close className="cursor-pointer rounded-[8px] px-3 py-2 text-left text-sm font-medium text-black hover:bg-[#f5f5f5]">
              Sign out
            </Popover.Close>
          </nav>
        </Popover.Content>
      </Popover.Root>
    </div>
  )
}
