'use client'

import { Command } from '@wire-ui/react'
import { useState } from 'react'

const paletteCls =
  'fixed left-1/2 top-[18vh] z-50 w-full max-w-md -translate-x-1/2 overflow-hidden rounded-[20px] border border-black bg-white shadow-xl'
const inputCls =
  'w-full border-b border-black px-4 py-3 text-sm text-black outline-none placeholder:text-[#9ca3af]'
const listCls = 'max-h-72 overflow-auto p-2'
const headingCls = 'px-2 py-1.5 text-xs font-medium text-[#9ca3af]'
const itemCls =
  'flex cursor-pointer items-center gap-2 rounded-[8px] px-2 py-2 text-sm text-black data-[active]:bg-[#f5f5f5] data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40'

export function CommandPreview() {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex h-48 items-center justify-center p-6">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-[8px] border border-black bg-white px-3 py-2 text-sm text-[#374151] hover:bg-[#f5f5f5]">
        Press
        <kbd className="rounded border border-[#d1d5db] bg-[#fafafa] px-1.5 font-mono text-xs text-black">⌘</kbd>
        <kbd className="rounded border border-[#d1d5db] bg-[#fafafa] px-1.5 font-mono text-xs text-black">K</kbd>
        to open the palette
      </button>

      {open && (
        <div className="fixed inset-0 z-40 bg-black/20" onClick={() => setOpen(false)} aria-hidden="true" />
      )}

      <Command.Root open={open} onOpenChange={setOpen} shortcut="mod+k" className={paletteCls}>
        <Command.Input placeholder="Type a command or search…" className={inputCls} />
        <Command.List className={listCls}>
          <Command.Empty className="py-6 text-center text-sm text-[#9ca3af]">
            No results found.
          </Command.Empty>
          <Command.Group heading="Suggestions" className="[&[hidden]]:hidden">
            <div className={headingCls}>Suggestions</div>
            <Command.Item value="New File" keywords={['create', 'document']} className={itemCls}>
              📄 New File
            </Command.Item>
            <Command.Item value="Search Docs" keywords={['find', 'help']} className={itemCls}>
              🔍 Search Docs
            </Command.Item>
          </Command.Group>
          <Command.Separator className="my-1 h-px bg-[#e5e5e5]" />
          <Command.Group className="[&[hidden]]:hidden">
            <div className={headingCls}>Settings</div>
            <Command.Item value="Profile" className={itemCls}>
              👤 Profile
            </Command.Item>
            <Command.Item value="Appearance" keywords={['theme', 'dark mode']} className={itemCls}>
              🎨 Appearance
            </Command.Item>
            <Command.Item value="Billing" disabled className={itemCls}>
              💳 Billing (disabled)
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command.Root>
    </div>
  )
}
