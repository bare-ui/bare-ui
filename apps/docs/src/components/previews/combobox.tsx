'use client'

import { useState } from 'react'
import { Combobox } from '@wire-ui/react'
import type { ComboboxOption } from '@wire-ui/react'

const frameworks: ComboboxOption[] = [
  { value: 'react', label: 'React', subtitle: 'A JS library for UIs' },
  { value: 'vue', label: 'Vue', subtitle: 'The progressive JS framework' },
  { value: 'angular', label: 'Angular', subtitle: 'Platform for web apps' },
  { value: 'svelte', label: 'Svelte', subtitle: 'Cybernetically enhanced web apps' },
  { value: 'solid', label: 'Solid', subtitle: 'Reactive UI library', disabled: true },
  { value: 'next', label: 'Next.js', subtitle: 'The React framework' },
  { value: 'nuxt', label: 'Nuxt', subtitle: 'The Vue framework' },
]

const inputCls =
  'w-full rounded-[8px] border border-black bg-white px-3 py-2 pr-10 text-sm text-black outline-none focus:ring-2 focus:ring-black focus:ring-offset-1'
const triggerCls =
  'absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-[#6b7280] data-[state=open]:rotate-180 transition-transform'
const contentCls =
  'absolute left-0 top-full z-10 mt-1 w-full max-h-60 overflow-y-auto rounded-[20px] border border-black bg-white py-1'
const itemCls =
  'cursor-pointer px-3 py-2 text-sm text-black group-data-[highlighted]:bg-[#f5f5f5] group-data-[selected]:font-semibold group-data-[disabled]:cursor-not-allowed group-data-[disabled]:opacity-40'

export function ComboboxPreview() {
  const [value, setValue] = useState<string | null>(null)
  return (
    <div className="p-6 flex justify-center">
      <Combobox.Root
        options={frameworks}
        value={value}
        onChange={setValue}
        className="relative w-72">
        <Combobox.Input placeholder="Search frameworks…" className={inputCls} />
        <Combobox.Trigger className={triggerCls}>▾</Combobox.Trigger>
        <Combobox.Content className={contentCls}>
          <Combobox.Items>
            {({ option, selected }) => (
              <div className={itemCls}>
                <div className="flex items-center justify-between">
                  <span>{option.label}</span>
                  {selected && <span className="text-black">✓</span>}
                </div>
                {option.subtitle && (
                  <p className="text-xs text-[#6b7280]">{option.subtitle}</p>
                )}
              </div>
            )}
          </Combobox.Items>
          <Combobox.Empty className="px-3 py-3 text-center text-sm text-[#6b7280]">
            No frameworks match
          </Combobox.Empty>
        </Combobox.Content>
      </Combobox.Root>
    </div>
  )
}
