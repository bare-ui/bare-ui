'use client'

import { Checkbox } from '@wire-ui/react'

export function CheckboxPreview() {
  return (
    <div className="p-6 flex items-center justify-center">
      <Checkbox.Root name="fruits" className="flex flex-col gap-3">
        {['Apple', 'Banana', 'Cherry'].map((fruit) => (
          <Checkbox.Item
            key={fruit}
            value={fruit.toLowerCase()}
            className="group flex cursor-pointer items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded border-2 border-black bg-white text-white group-data-[checked]:border-black group-data-[checked]:bg-black">
              <Checkbox.Indicator>
                <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" />
                </svg>
              </Checkbox.Indicator>
            </span>
            <Checkbox.Label className="select-none text-sm text-black">{fruit}</Checkbox.Label>
          </Checkbox.Item>
        ))}
      </Checkbox.Root>
    </div>
  )
}
