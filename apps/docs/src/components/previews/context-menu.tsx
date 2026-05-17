'use client'

import { ContextMenu } from '@wire-ui/react'

const triggerCls =
  'flex h-32 w-72 items-center justify-center rounded-[20px] border border-dashed border-black bg-[#f5f5f5] text-sm text-[#6b7280] select-none'
const contentCls = 'min-w-[180px] rounded-[20px] border border-black bg-white p-1'
const itemCls =
  'cursor-pointer rounded-[8px] px-3 py-1.5 text-sm text-black outline-none hover:bg-[#f5f5f5] data-[focus-visible]:bg-[#f5f5f5] data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40'
const sepCls = 'my-1 h-px bg-black'

export function ContextMenuPreview() {
  return (
    <div className="p-6 flex items-center justify-center">
      <ContextMenu.Root>
        <ContextMenu.Trigger className={triggerCls}>
          Right-click here
        </ContextMenu.Trigger>
        <ContextMenu.Content className={contentCls}>
          <ContextMenu.Item className={itemCls}>Open</ContextMenu.Item>
          <ContextMenu.Item className={itemCls}>Rename</ContextMenu.Item>
          <ContextMenu.Item className={itemCls}>Duplicate</ContextMenu.Item>
          <ContextMenu.Separator className={sepCls} />
          <ContextMenu.Item className={itemCls} disabled>
            Move to trash
          </ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Root>
    </div>
  )
}
