'use client'

import { useState } from 'react'
import { Rating } from '@wire-ui/react'

const starCls = 'size-6 cursor-pointer text-[#e5e5e5] outline-none transition-colors data-[highlighted]:text-black data-[filled]:text-black hover:scale-110 data-[disabled]:cursor-default data-[disabled]:opacity-50'

export function RatingPreview() {
  const [value, setValue] = useState(0)
  const labels = ['', 'Terrible', 'Bad', 'Okay', 'Good', 'Excellent']

  return (
    <div className="p-6 flex flex-col gap-8">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-3">With label</p>
        <div className="flex flex-col items-start gap-2">
          <Rating value={value} onChange={setValue} className="flex gap-0.5" starClassName={starCls} />
          <p className="text-sm text-[#6b7280]">
            {value > 0 ? <span className="font-medium text-black">{labels[value]}</span> : 'Select a rating'}
          </p>
        </div>
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-3">With count</p>
        <div className="flex items-center gap-2">
          <Rating value={4} readOnly className="flex gap-0.5" starClassName="size-4 cursor-default text-[#e5e5e5] data-[filled]:text-black" />
          <span className="text-sm font-medium text-black">4.0</span>
          <span className="text-sm text-[#6b7280]">(128 reviews)</span>
        </div>
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-3">Sizes</p>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="w-12 text-xs text-[#6b7280]">Small</span>
            <Rating defaultValue={3} className="flex gap-0.5" starClassName="size-4 cursor-pointer text-[#e5e5e5] transition-colors data-[highlighted]:text-black data-[filled]:text-black" />
          </div>
          <div className="flex items-center gap-3">
            <span className="w-12 text-xs text-[#6b7280]">Medium</span>
            <Rating defaultValue={3} className="flex gap-0.5" starClassName={starCls} />
          </div>
          <div className="flex items-center gap-3">
            <span className="w-12 text-xs text-[#6b7280]">Large</span>
            <Rating defaultValue={3} className="flex gap-0.5" starClassName="size-9 cursor-pointer text-[#e5e5e5] transition-colors data-[highlighted]:text-black data-[filled]:text-black" />
          </div>
        </div>
      </div>
    </div>
  )
}
