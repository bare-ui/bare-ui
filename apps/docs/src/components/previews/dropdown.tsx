'use client'

import { Dropdown } from '@wire-ui/react'

export function Basic() {
  return (
    <div className="p-6 flex justify-center">
      <Dropdown.Root className="relative inline-block">
        <Dropdown.Trigger className="inline-flex items-center rounded-[8px] border border-black bg-black px-4 py-2 text-sm font-medium text-white hover:bg-[#333]">
          Open Menu
        </Dropdown.Trigger>
        <Dropdown.Menu className="absolute left-0 top-full z-10 mt-1 w-48 overflow-hidden rounded-[20px] border border-black bg-white py-1">
          <div className="cursor-pointer px-4 py-2 text-sm text-black hover:bg-[#f5f5f5]">Profile</div>
          <div className="cursor-pointer px-4 py-2 text-sm text-black hover:bg-[#f5f5f5]">Settings</div>
          <div className="cursor-pointer px-4 py-2 text-sm text-black hover:bg-[#f5f5f5]">Sign out</div>
        </Dropdown.Menu>
      </Dropdown.Root>
    </div>
  )
}

export function Composed() {
  return (
    <div className="p-6 flex justify-center">
      <Dropdown.Root className="relative inline-block">
        <Dropdown.Trigger className="inline-flex items-center rounded-[8px] border border-black bg-black px-4 py-2 text-sm font-medium text-white hover:bg-[#333]">
          Actions
        </Dropdown.Trigger>
        <Dropdown.Menu className="absolute left-0 top-full z-10 mt-1 w-48 overflow-hidden rounded-[20px] border border-black bg-white py-1">
          <div className="cursor-pointer px-4 py-2 text-sm text-black hover:bg-[#f5f5f5]">Edit</div>
          <div className="cursor-pointer px-4 py-2 text-sm text-black hover:bg-[#f5f5f5]">Duplicate</div>
          <div className="my-1 border-t-2 border-black" />
          <div className="cursor-pointer px-4 py-2 text-sm text-black hover:bg-[#f5f5f5]">Archive</div>
          <div className="cursor-pointer px-4 py-2 text-sm text-black hover:bg-[#f5f5f5]">Delete</div>
        </Dropdown.Menu>
      </Dropdown.Root>
    </div>
  )
}

export function Complex() {
  return (
    <div className="p-6 flex justify-center">
      <Dropdown.Root className="relative inline-block">
        <Dropdown.Trigger className="inline-flex items-center gap-2 rounded-[8px] border border-black bg-black px-4 py-2 text-sm font-medium text-white hover:bg-[#333]">
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.99 5.99 0 00-4.793 2.39A6.483 6.483 0 0010 16.5a6.483 6.483 0 004.793-2.11A5.99 5.99 0 0010 12z" clipRule="evenodd" />
          </svg>
          Account
        </Dropdown.Trigger>
        <Dropdown.Menu className="absolute left-0 top-full z-10 mt-1 w-52 overflow-hidden rounded-[20px] border border-black bg-white py-1">
          <div className="cursor-pointer px-4 py-2 text-sm text-black hover:bg-[#f5f5f5]">
            <span className="mr-2">👤</span>Profile
          </div>
          <div className="cursor-pointer px-4 py-2 text-sm text-black hover:bg-[#f5f5f5]">
            <span className="mr-2">⚙️</span>Settings
          </div>
          <div className="cursor-pointer px-4 py-2 text-sm text-black hover:bg-[#f5f5f5]">
            <span className="mr-2">📊</span>Analytics
          </div>
          <div className="my-1 border-t-2 border-black" />
          <div className="cursor-pointer px-4 py-2 text-sm font-medium text-black hover:bg-[#f5f5f5]">
            <span className="mr-2">🚪</span>Sign out
          </div>
        </Dropdown.Menu>
      </Dropdown.Root>
    </div>
  )
}
