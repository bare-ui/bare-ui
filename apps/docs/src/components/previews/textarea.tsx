'use client'

import { Textarea } from '@wire-ui/react'
import { useState } from 'react'

export function TextareaBasic() {
  return (
    <div className="flex max-w-xs flex-col gap-6 p-6">
      <Textarea.Root className="flex flex-col gap-1.5">
        <Textarea.Label className="text-sm font-medium text-black">Message</Textarea.Label>
        <Textarea.Field
          placeholder="Type your message here..."
          rows={4}
          className="w-full rounded-[8px] border border-black bg-white px-3 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-black focus:ring-offset-1"
        />
      </Textarea.Root>
    </div>
  )
}

export function TextareaComposed() {
  return (
    <div className="flex max-w-xs flex-col gap-6 p-6">
      <Textarea.Root
        isRequired
        errorMessage={{ required: 'This field is required' }}
        className="flex flex-col gap-1.5">
        <Textarea.Label className="text-sm font-medium text-black">Feedback</Textarea.Label>
        <Textarea.Field
          placeholder="Your feedback is important..."
          rows={4}
          className="w-full rounded-[8px] border border-black bg-white px-3 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-black focus:ring-offset-1"
        />
        <Textarea.Error className="text-xs text-black" />
      </Textarea.Root>
    </div>
  )
}

export function TextareaComplex() {
  const [value, setValue] = useState('')

  return (
    <div className="flex max-w-xs flex-col gap-6 p-6">
      <Textarea.Root value={value} onChange={setValue} className="flex flex-col gap-1.5">
        <Textarea.Label className="text-sm font-medium text-black">Bio</Textarea.Label>
        <p className="text-xs text-[#6b7280]">Write a short bio about yourself.</p>
        <Textarea.Field
          placeholder="Tell us about yourself..."
          rows={4}
          maxLength={200}
          className="w-full rounded-[8px] border border-black bg-white px-3 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-black focus:ring-offset-1"
        />
        <p className="text-right text-xs text-[#6b7280]">{value.length}/200</p>
      </Textarea.Root>
    </div>
  )
}
