'use client'

import { Tag } from '@wire-ui/react'

const tagCls =
  'inline-flex items-center gap-1 rounded-full border border-black bg-[#f5f5f5] px-2.5 py-1 text-xs font-medium text-black data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed'

const tagSolidCls =
  'inline-flex items-center gap-1 rounded-full border border-black bg-black px-2.5 py-1 text-xs font-medium text-white'

const removeCls =
  'inline-flex size-4 cursor-pointer items-center justify-center rounded-full text-black outline-none hover:bg-[#e5e5e5] [data-focus-visible]:ring-2 [data-focus-visible]:ring-black'

export function TagPreview() {
  return (
    <div className="p-6 flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Tag.Root className={tagSolidCls}>
          <Tag.Label>active</Tag.Label>
        </Tag.Root>
        <Tag.Root className={tagCls}>
          <Tag.Label>draft</Tag.Label>
        </Tag.Root>
        <Tag.Root disabled className={tagCls}>
          <Tag.Label>archived</Tag.Label>
        </Tag.Root>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {['React', 'Vue', 'Solid'].map((label) => (
          <Tag.Root key={label} className={tagCls}>
            <Tag.Label>{label}</Tag.Label>
            <Tag.Remove className={removeCls}>×</Tag.Remove>
          </Tag.Root>
        ))}
      </div>
    </div>
  )
}
