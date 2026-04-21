'use client'

import { Select } from '@wire-ui/react'
import { useState } from 'react'

const frameworks = ['React', 'Vue', 'Angular', 'Svelte', 'Solid']

const triggerCls =
  'flex w-full items-center justify-between gap-2 rounded-[8px] border border-black bg-white px-3 py-2 text-sm text-black outline-none transition data-[state=open]:ring-2 data-[state=open]:ring-black data-[state=open]:ring-offset-1 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-[hover]:bg-[#f5f5f5]'

const contentCls =
  'absolute z-50 mt-1 w-full overflow-hidden rounded-[20px] border border-black bg-white py-1'

const itemCls =
  'flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-black outline-none transition data-[hover]:bg-[#f5f5f5] data-[selected]:font-medium data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40'

const ChevronIcon = () => (
  <svg
    className="size-4 shrink-0 text-[#6b7280] transition-transform data-[state=open]:rotate-180"
    viewBox="0 0 20 20"
    fill="currentColor">
    <path
      fillRule="evenodd"
      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
)

const CheckIcon = () => (
  <svg className="size-4" viewBox="0 0 20 20" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
)

export function SelectBasic() {
  const [value, setValue] = useState('')

  return (
    <div className="flex justify-center p-6">
      <div className="w-64">
        <Select.Root value={value} onChange={setValue}>
          <div className="relative">
            <Select.Trigger className={triggerCls}>
              <Select.Value placeholder="Select a framework" className="data-[placeholder]:text-[#6b7280]" />
              <ChevronIcon />
            </Select.Trigger>
            <Select.Content className={contentCls}>
              {frameworks.map((fw) => (
                <Select.Item key={fw} value={fw.toLowerCase()} className={itemCls}>
                  <span className="flex-1">{fw}</span>
                </Select.Item>
              ))}
            </Select.Content>
          </div>
        </Select.Root>
      </div>
    </div>
  )
}

export function SelectComposed() {
  const [value, setValue] = useState('')

  return (
    <div className="flex justify-center p-6">
      <div className="w-64">
        <Select.Root value={value} onChange={setValue}>
          <div className="relative">
            <Select.Trigger className={triggerCls}>
              <Select.Value placeholder="Select a framework" className="data-[placeholder]:text-[#6b7280]" />
              <ChevronIcon />
            </Select.Trigger>
            <Select.Content className={contentCls}>
              {frameworks.map((fw) => (
                <Select.Item key={fw} value={fw.toLowerCase()} className={itemCls}>
                  <span className="flex-1">{fw}</span>
                  <span className="invisible text-black data-[selected]:visible">
                    <CheckIcon />
                  </span>
                </Select.Item>
              ))}
            </Select.Content>
          </div>
        </Select.Root>
      </div>
    </div>
  )
}

export function SelectComplex() {
  const [value, setValue] = useState('')

  return (
    <div className="flex justify-center p-6">
      <div className="w-64">
        <Select.Root value={value} onChange={setValue}>
          <div className="relative">
            <Select.Trigger className={triggerCls}>
              <Select.Value placeholder="Select a framework" className="data-[placeholder]:text-[#6b7280]" />
              <ChevronIcon />
            </Select.Trigger>
            <Select.Content className={contentCls}>
              <Select.Group>
                <Select.GroupLabel className="px-3 py-1.5 text-xs font-semibold text-[#6b7280]">
                  Frontend
                </Select.GroupLabel>
                <Select.Item value="react" className={itemCls}>
                  <span className="flex-1">React</span>
                  <span className="invisible text-black data-[selected]:visible">
                    <CheckIcon />
                  </span>
                </Select.Item>
                <Select.Item value="vue" className={itemCls}>
                  <span className="flex-1">Vue</span>
                  <span className="invisible text-black data-[selected]:visible">
                    <CheckIcon />
                  </span>
                </Select.Item>
                <Select.Item value="angular" className={itemCls}>
                  <span className="flex-1">Angular</span>
                  <span className="invisible text-black data-[selected]:visible">
                    <CheckIcon />
                  </span>
                </Select.Item>
              </Select.Group>
              <Select.Separator className="my-1 h-px bg-black" />
              <Select.Group>
                <Select.GroupLabel className="px-3 py-1.5 text-xs font-semibold text-[#6b7280]">
                  Other
                </Select.GroupLabel>
                <Select.Item value="svelte" className={itemCls}>
                  <span className="flex-1">Svelte</span>
                  <span className="invisible text-black data-[selected]:visible">
                    <CheckIcon />
                  </span>
                </Select.Item>
                <Select.Item value="solid" disabled className={itemCls}>
                  <span className="flex-1">Solid</span>
                  <span className="invisible text-black data-[selected]:visible">
                    <CheckIcon />
                  </span>
                </Select.Item>
              </Select.Group>
            </Select.Content>
          </div>
        </Select.Root>
      </div>
    </div>
  )
}
