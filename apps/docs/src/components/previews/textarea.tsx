'use client'

import { Textarea } from '@wire-ui/react'

export function TextareaPreview() {
  return (
    <div className="p-6 flex flex-col gap-6 max-w-xs">
      <Textarea.Root className="flex flex-col gap-1.5">
        <Textarea.Label className="text-sm font-medium text-black">Message</Textarea.Label>
        <Textarea.Field
          placeholder="Type your message here..."
          rows={4}
          className="w-full rounded-[8px] bg-white border-2 border-black px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
        />
      </Textarea.Root>

      <Textarea.Root
        isRequired
        errorMessage={{ required: 'This field is required' }}
        className="flex flex-col gap-1.5">
        <Textarea.Label className="text-sm font-medium text-black">Feedback</Textarea.Label>
        <Textarea.Field
          placeholder="Your feedback is important..."
          rows={4}
          className="w-full rounded-[8px] bg-white border-2 border-black px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
        />
        <Textarea.Error className="text-xs text-black" />
      </Textarea.Root>
    </div>
  )
}
