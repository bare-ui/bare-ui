'use client'

import { Tabs } from '@wire-ui/react'

const listCls = 'flex gap-1 border-b border-black'
const triggerCls = [
  'cursor-pointer px-4 py-2 text-sm font-medium text-black outline-none',
  'border-b-2 border-transparent -mb-px transition-colors',
  'hover:bg-[#f5f5f5]',
  'data-[state=active]:border-black data-[state=active]:font-semibold',
  'data-[focus-visible]:ring-2 data-[focus-visible]:ring-black data-[focus-visible]:ring-offset-1',
  'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40',
].join(' ')
const contentCls = 'mt-4 text-sm text-black outline-none'

export function TabsPreview() {
  return (
    <div className="p-6 w-full flex items-center justify-center">
      <Tabs.Root defaultValue="overview" className="w-full max-w-lg">
        <Tabs.List className={listCls}>
          <Tabs.Trigger value="overview" className={triggerCls}>
            Overview
          </Tabs.Trigger>
          <Tabs.Trigger value="details" className={triggerCls}>
            Details
          </Tabs.Trigger>
          <Tabs.Trigger value="reviews" className={triggerCls}>
            Reviews
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="overview" className={contentCls}>
          A high-level summary of the product features and what makes it special.
        </Tabs.Content>
        <Tabs.Content value="details" className={contentCls}>
          Detailed specifications, dimensions, materials, and technical information.
        </Tabs.Content>
        <Tabs.Content value="reviews" className={contentCls}>
          Customer reviews and ratings from verified buyers.
        </Tabs.Content>
      </Tabs.Root>
    </div>
  )
}
