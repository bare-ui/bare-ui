'use client'

import { useState } from 'react'
import { NumberInput } from '@wire-ui/react'

const wrapperCls = 'inline-flex items-stretch overflow-hidden rounded-[8px] border border-black'
const fieldCls = 'w-16 bg-white px-2 py-2 text-center text-sm text-black outline-none focus:bg-[#f5f5f5]'
const stepBtnCls = 'cursor-pointer bg-white px-3 text-sm text-black hover:bg-[#f5f5f5] disabled:cursor-not-allowed disabled:opacity-40'

export function NumberInputPreview() {
  const [value, setValue] = useState<number | null>(3)
  return (
    <div className="p-6 flex flex-col items-center justify-center gap-4">
      <NumberInput.Root value={value} onChange={setValue} min={0} max={10} className={wrapperCls}>
        <NumberInput.Decrement className={`${stepBtnCls} border-r border-black`}>−</NumberInput.Decrement>
        <NumberInput.Field aria-label="Quantity" className={fieldCls} />
        <NumberInput.Increment className={`${stepBtnCls} border-l border-black`}>+</NumberInput.Increment>
      </NumberInput.Root>
      <p className="text-xs text-[#6b7280]">Value: <span className="font-medium text-black">{value ?? '∅'}</span></p>
    </div>
  )
}
