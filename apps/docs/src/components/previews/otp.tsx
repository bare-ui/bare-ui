'use client'

import { OTP } from '@wire-ui/react'
import { useState } from 'react'

const slotCls = [
  'h-12 w-10 rounded-[8px] border-2 border-black bg-white text-center text-lg font-mono font-semibold text-black',
  'outline-none transition-all caret-transparent',
  'data-[active]:ring-4 data-[active]:ring-black/20',
].join(' ')

export function OtpBasic() {
  return (
    <div className="p-6 flex items-center justify-center">
      <OTP.Root length={6} className="flex items-center gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <OTP.Slot key={i} index={i} className={slotCls} />
        ))}
      </OTP.Root>
    </div>
  )
}

export function OtpComposed() {
  return (
    <div className="p-6 flex items-center justify-center">
      <OTP.Root length={6} className="flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <OTP.Slot key={i} index={i} className={slotCls} />
        ))}
        <OTP.Separator className="text-xl font-light text-[#6b7280]" />
        {[3, 4, 5].map((i) => (
          <OTP.Slot key={i} index={i} className={slotCls} />
        ))}
      </OTP.Root>
    </div>
  )
}

export function OtpComplex() {
  const [value, setValue] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleComplete = (v: string) => {
    setStatus(v === '123456' ? 'success' : 'error')
  }

  const handleChange = (v: string) => {
    setValue(v)
    if (v.length < 6) setStatus('idle')
  }

  const completeCls = [
    'h-12 w-10 rounded-[8px] border-2 border-black text-center text-lg font-mono font-semibold',
    'outline-none transition-all caret-transparent',
    status === 'success'
      ? 'bg-black text-white'
      : status === 'error'
        ? 'bg-[#f5f5f5] text-black'
        : 'bg-white text-black data-[active]:ring-4 data-[active]:ring-black/20',
  ].join(' ')

  return (
    <div className="p-6 flex flex-col items-center gap-4">
      <p className="text-xs font-medium uppercase tracking-wide text-[#6b7280]">Try 123456</p>
      <OTP.Root
        value={value}
        onChange={handleChange}
        onComplete={handleComplete}
        length={6}
        className="flex items-center gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <OTP.Slot key={i} index={i} className={completeCls} />
        ))}
      </OTP.Root>
      {status === 'success' && <p className="text-sm font-medium text-black">&#10003; Code verified</p>}
      {status === 'error' && <p className="text-sm font-medium text-black">&#10007; Invalid code, try again</p>}
    </div>
  )
}
