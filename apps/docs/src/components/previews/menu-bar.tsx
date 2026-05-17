'use client'

import { MenuBar } from '@wire-ui/react'

const barCls = 'flex items-center gap-1 rounded-[8px] border border-black bg-white p-1'
const triggerCls =
  'cursor-pointer rounded-[6px] px-3 py-1 text-sm text-black outline-none hover:bg-[#f5f5f5] data-[state=open]:bg-[#f5f5f5] data-[focus-visible]:ring-2 data-[focus-visible]:ring-black'
const contentCls =
  'absolute left-0 top-full z-10 mt-1 min-w-[180px] rounded-[20px] border border-black bg-white p-1'
const itemCls =
  'cursor-pointer rounded-[6px] px-3 py-1.5 text-sm text-black outline-none hover:bg-[#f5f5f5] data-[focus-visible]:bg-[#f5f5f5] data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40'
const sepCls = 'my-1 h-px bg-black'

export function MenuBarPreview() {
  return (
    <div className="p-6 flex items-center justify-center">
      <MenuBar.Root className={barCls}>
        <MenuBar.Menu value="file">
          <div className="relative">
            <MenuBar.Trigger className={triggerCls}>File</MenuBar.Trigger>
            <MenuBar.Content className={contentCls}>
              <MenuBar.Item className={itemCls}>New</MenuBar.Item>
              <MenuBar.Item className={itemCls}>Open</MenuBar.Item>
              <MenuBar.Item className={itemCls}>Save</MenuBar.Item>
              <MenuBar.Separator className={sepCls} />
              <MenuBar.Item className={itemCls}>Quit</MenuBar.Item>
            </MenuBar.Content>
          </div>
        </MenuBar.Menu>
        <MenuBar.Menu value="edit">
          <div className="relative">
            <MenuBar.Trigger className={triggerCls}>Edit</MenuBar.Trigger>
            <MenuBar.Content className={contentCls}>
              <MenuBar.Item className={itemCls}>Undo</MenuBar.Item>
              <MenuBar.Item className={itemCls}>Redo</MenuBar.Item>
              <MenuBar.Separator className={sepCls} />
              <MenuBar.Item className={itemCls}>Cut</MenuBar.Item>
              <MenuBar.Item className={itemCls}>Copy</MenuBar.Item>
              <MenuBar.Item className={itemCls}>Paste</MenuBar.Item>
            </MenuBar.Content>
          </div>
        </MenuBar.Menu>
        <MenuBar.Menu value="view">
          <div className="relative">
            <MenuBar.Trigger className={triggerCls}>View</MenuBar.Trigger>
            <MenuBar.Content className={contentCls}>
              <MenuBar.Item className={itemCls}>Zoom In</MenuBar.Item>
              <MenuBar.Item className={itemCls}>Zoom Out</MenuBar.Item>
              <MenuBar.Item className={itemCls}>Reset</MenuBar.Item>
            </MenuBar.Content>
          </div>
        </MenuBar.Menu>
      </MenuBar.Root>
    </div>
  )
}
