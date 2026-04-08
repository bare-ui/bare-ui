'use client'

import { Dropdown } from '@wire-ui/react'

export function DropdownPreview() {
  return (
    <div className="p-6 flex justify-center">
      <Dropdown.Root className="relative inline-block">
        <Dropdown.Trigger className="inline-flex items-center rounded-[8px] border-2 border-black bg-black px-4 py-2 text-sm font-medium text-white hover:bg-[#333]">
          Open Menu
        </Dropdown.Trigger>
        <Dropdown.Menu className="absolute left-0 top-full z-10 mt-1 w-48 overflow-hidden rounded-[20px] border-[3px] border-black bg-white py-1">
          <div className="cursor-pointer px-4 py-2 text-sm text-black hover:bg-[#f5f5f5]">Profile</div>
          <div className="cursor-pointer px-4 py-2 text-sm text-black hover:bg-[#f5f5f5]">Settings</div>
          <div className="cursor-pointer px-4 py-2 text-sm text-black hover:bg-[#f5f5f5]">Sign out</div>
        </Dropdown.Menu>
      </Dropdown.Root>
    </div>
  )
}
