'use client'

import { useState } from 'react'
import { TagInput, Tag } from '@wire-ui/react'

const wrapperCls = 'flex flex-wrap items-center gap-1.5 rounded-[8px] border border-black bg-white px-2 py-1.5 focus-within:ring-2 focus-within:ring-black focus-within:ring-offset-1 data-[disabled]:opacity-50'
const fieldCls = 'flex-1 min-w-[100px] bg-transparent px-1 py-1 text-sm text-black outline-none placeholder:text-[#a3a3a3]'
const tagCls = 'inline-flex items-center gap-1 rounded-full border border-black bg-[#f5f5f5] px-2 py-0.5 text-xs font-medium text-black'
const removeCls = 'inline-flex size-4 items-center justify-center rounded-full text-black hover:bg-[#e5e5e5]'

export function TagInputPreview() {
  const [tags, setTags] = useState<string[]>(['react', 'tailwind'])
  return (
    <div className="p-6 flex items-center justify-center w-full">
      <div className="flex flex-col gap-2 w-full max-w-md">
        <label className="text-sm font-medium text-black">Topics</label>
        <TagInput.Root value={tags} onChange={setTags} maxTags={5} className={wrapperCls}>
          <TagInput.Items>
            {(tag, i, remove) => (
              <Tag.Root key={`${tag}-${i}`} className={tagCls}>
                <Tag.Label>{tag}</Tag.Label>
                <Tag.Remove className={removeCls} onClick={remove}>×</Tag.Remove>
              </Tag.Root>
            )}
          </TagInput.Items>
          <TagInput.Field placeholder={tags.length >= 5 ? '' : 'Add a tag…'} className={fieldCls} />
        </TagInput.Root>
        <p className="text-xs text-[#6b7280]">{tags.length}/5 — press Enter or comma to add</p>
      </div>
    </div>
  )
}
