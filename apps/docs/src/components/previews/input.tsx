'use client'

import { Input } from '@wire-ui/react'

const fieldCls = 'w-full rounded-[8px] bg-white border-2 border-black px-3 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1'

export function InputBasic() {
  return (
    <div className="p-6 flex items-center justify-center">
      <Input.Root className="flex w-full max-w-xs flex-col gap-1.5">
        <Input.Label className="text-sm font-medium text-black">Full Name</Input.Label>
        <Input.Field placeholder="John Doe" className={fieldCls} />
      </Input.Root>
    </div>
  )
}

export function InputComposed() {
  return (
    <div className="p-6 flex items-center justify-center">
      <Input.Root
        invalidType="email"
        defaultValue="not-an-email"
        errorMessage={{ email: 'Please enter a valid email address' }}
        className="flex w-full max-w-xs flex-col gap-1.5">
        <Input.Label className="text-sm font-medium text-black">Email</Input.Label>
        <Input.Field type="email" className={fieldCls} />
        <Input.Error className="text-xs text-black" />
      </Input.Root>
    </div>
  )
}

export function InputComplex() {
  return (
    <div className="p-6 flex flex-col gap-6 max-w-xs mx-auto">
      <Input.Root className="flex flex-col gap-1.5">
        <Input.Label className="text-sm font-medium text-black">Full Name</Input.Label>
        <Input.Field placeholder="John Doe" className={fieldCls} />
      </Input.Root>

      <Input.Root
        invalidType="email"
        defaultValue="not-an-email"
        errorMessage={{ email: 'Please enter a valid email address' }}
        className="flex flex-col gap-1.5">
        <Input.Label className="text-sm font-medium text-black">Email</Input.Label>
        <Input.Field type="email" className={fieldCls} />
        <Input.Error className="text-xs text-black" />
      </Input.Root>

      <Input.Root isSuccess defaultValue="available_user" className="flex flex-col gap-1.5">
        <Input.Label className="text-sm font-medium text-black">Username</Input.Label>
        <Input.Field className={fieldCls} />
        <span className="text-xs text-black">Username is available</span>
      </Input.Root>
    </div>
  )
}
