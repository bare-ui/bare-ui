'use client'

import { Mention } from '@wire-ui/react'
import type { MentionOption } from '@wire-ui/react'
import { useState } from 'react'

const people: MentionOption[] = [
  { id: 1, label: 'Ada Lovelace' },
  { id: 2, label: 'Alan Turing' },
  { id: 3, label: 'Grace Hopper' },
  { id: 4, label: 'Katherine Johnson' },
  { id: 5, label: 'Linus Torvalds', disabled: true },
]

const inputCls =
  'w-full resize-none rounded-[8px] border border-black bg-white p-3 text-sm text-black outline-none data-[focus-visible]:ring-2 data-[focus-visible]:ring-black'
const contentCls =
  'z-10 mt-1 max-h-56 w-56 overflow-auto rounded-[8px] border border-black bg-white p-1'
const itemCls =
  'flex cursor-pointer items-center gap-2 rounded-[6px] px-2 py-1.5 text-sm text-black data-[active]:bg-black data-[active]:text-white data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40'

export function MentionPreview() {
  const [value, setValue] = useState('Hey ')

  return (
    <div className="flex justify-center p-6">
      <div className="w-full max-w-md rounded-[20px] border border-black bg-white p-4">
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-black bg-black text-sm font-semibold text-white">
            You
          </div>
          <Mention.Root options={people} value={value} onChange={setValue} className="relative flex-1">
            <Mention.Input
              aria-label="Write a comment"
              rows={3}
              placeholder="Add a comment… use @ to notify a teammate"
              className={inputCls}
            />
            <Mention.Content className={contentCls}>
              <Mention.Items>
                {({ option }) => (
                  <div className={itemCls}>
                    <span className="flex size-6 items-center justify-center rounded-full border border-black bg-white text-xs font-semibold text-black">
                      {option.label.charAt(0)}
                    </span>
                    {option.label}
                  </div>
                )}
              </Mention.Items>
              <Mention.Empty className="px-2 py-1.5 text-sm text-[#6b7280]">No people found</Mention.Empty>
            </Mention.Content>
          </Mention.Root>
        </div>
        <div className="mt-3 flex items-center justify-end gap-2">
          <button className="rounded-[8px] px-3 py-1.5 text-sm font-medium text-[#6b7280] hover:bg-[#f5f5f5]">
            Cancel
          </button>
          <button
            disabled={value.trim().length === 0}
            className="rounded-[8px] border border-black bg-black px-3 py-1.5 text-sm font-medium text-white disabled:opacity-40">
            Comment
          </button>
        </div>
      </div>
    </div>
  )
}
