'use client'

import { Editable } from '@wire-ui/react'

const previewCls =
  'cursor-text rounded-[8px] px-2 py-1 text-sm text-black transition-colors hover:bg-[#f5f5f5] data-[empty]:text-[#9ca3af]'
const inputCls = 'rounded-[8px] border border-black px-2 py-1 text-sm text-black outline-none'

export function EditablePreview() {
  return (
    <div className="flex justify-center p-6">
      <div className="w-80 rounded-[20px] border border-black bg-white p-5">
        <label className="mb-1 block text-xs font-medium text-[#374151]">Display name</label>
        <Editable.Root defaultValue="Jerald Austero" placeholder="Add your name…" className="block">
          <Editable.Preview className={`block w-full ${previewCls}`} />
          <Editable.Input className={`w-full ${inputCls}`} />
        </Editable.Root>

        <label className="mb-1 mt-4 block text-xs font-medium text-[#374151]">Bio</label>
        <Editable.Root
          defaultValue="Designing accessible component systems."
          placeholder="Add a short bio…"
          submitOnBlur={false}
          className="block"
        >
          <Editable.Preview className="block w-full cursor-text rounded-[8px] border border-transparent p-2 text-sm leading-relaxed text-black transition-colors hover:bg-[#f5f5f5] data-[empty]:text-[#9ca3af]" />
          <Editable.Area
            rows={3}
            className="w-full resize-none rounded-[8px] border border-black p-2 text-sm leading-relaxed outline-none"
          />
          <div className="mt-2 flex gap-2">
            <Editable.SubmitTrigger className="rounded-[8px] bg-black px-3 py-1 text-xs font-medium text-white">
              Save
            </Editable.SubmitTrigger>
            <Editable.CancelTrigger className="rounded-[8px] border border-black px-3 py-1 text-xs font-medium text-black">
              Cancel
            </Editable.CancelTrigger>
          </div>
        </Editable.Root>
      </div>
    </div>
  )
}
