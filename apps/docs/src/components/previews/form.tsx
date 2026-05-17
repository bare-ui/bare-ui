'use client'

import { useState } from 'react'
import { Form } from '@wire-ui/react'

const labelCls = 'text-sm font-medium text-black data-[invalid]:text-black'
const fieldCls =
  'w-full rounded-[8px] border border-black bg-white px-3 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 data-[invalid]:ring-2 data-[invalid]:ring-black disabled:opacity-50'
const descCls = 'text-xs text-[#6b7280]'
const errorCls = 'text-xs font-medium text-black'

export function FormPreview() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('not-an-email')
  const nameInvalid = name.trim().length === 0
  const emailInvalid = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const formInvalid = nameInvalid || emailInvalid

  return (
    <div className="p-6 flex items-center justify-center">
      <Form.Root
        className="flex w-80 flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault()
          alert(`Submitted: ${name} <${email}>`)
        }}
      >
        <Form.Field name="name" invalid={nameInvalid} required className="flex flex-col gap-1.5">
          <Form.Label className={labelCls}>Name</Form.Label>
          <Form.Control>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              className={fieldCls}
            />
          </Form.Control>
          <Form.Description className={descCls}>How should we address you?</Form.Description>
          <Form.Error className={errorCls}>Name is required.</Form.Error>
        </Form.Field>

        <Form.Field name="email" invalid={emailInvalid} required className="flex flex-col gap-1.5">
          <Form.Label className={labelCls}>Email</Form.Label>
          <Form.Control>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={fieldCls}
            />
          </Form.Control>
          <Form.Description className={descCls}>We&apos;ll send a magic link.</Form.Description>
          <Form.Error className={errorCls}>Please enter a valid email address.</Form.Error>
        </Form.Field>

        <button
          type="submit"
          disabled={formInvalid}
          className="cursor-pointer rounded-[8px] border border-black bg-black px-4 py-2 text-sm font-medium text-white hover:bg-[#333] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Submit
        </button>
      </Form.Root>
    </div>
  )
}
