'use client'

import { Stepper } from '@wire-ui/react'
import { useState } from 'react'

const steps = [
  { title: 'Account', body: 'Create your account credentials.' },
  { title: 'Profile', body: 'Tell us a bit about yourself.' },
  { title: 'Review', body: 'Confirm everything looks right.' },
]

const triggerCls =
  'flex items-center gap-2 text-sm font-medium text-[#9ca3af] outline-none data-[state=active]:text-black data-[state=completed]:text-black disabled:cursor-not-allowed'
const dotCls =
  'flex size-7 items-center justify-center rounded-full border border-[#d4d4d4] text-xs data-[state=active]:border-black data-[state=active]:bg-black data-[state=active]:text-white data-[state=completed]:border-black data-[state=completed]:bg-black data-[state=completed]:text-white'

export function StepperPreview() {
  const [step, setStep] = useState(0)

  return (
    <div className="flex justify-center p-6">
      <div className="w-full max-w-md rounded-[20px] border border-black bg-white p-6">
        <Stepper.Root count={steps.length} value={step} onChange={setStep} className="space-y-6">
          <Stepper.List className="flex items-center">
            {steps.map((s, i) => (
              <Stepper.Item key={s.title} index={i} className="flex flex-1 items-center last:flex-none">
                <Stepper.Trigger className={triggerCls}>
                  <span
                    className={dotCls}
                    data-state={i === step ? 'active' : i < step ? 'completed' : 'inactive'}>
                    {i < step ? '✓' : i + 1}
                  </span>
                  {s.title}
                </Stepper.Trigger>
                {i < steps.length - 1 && (
                  <Stepper.Separator className="mx-3 h-px flex-1 bg-[#d4d4d4] data-[state=completed]:bg-black" />
                )}
              </Stepper.Item>
            ))}
          </Stepper.List>

          {steps.map((s, i) => (
            <Stepper.Content key={s.title} index={i} className="rounded-[8px] bg-[#f5f5f5] p-4 text-sm text-[#374151]">
              <p className="mb-1 font-semibold text-black">{s.title}</p>
              {s.body}
            </Stepper.Content>
          ))}

          <div className="flex justify-between">
            <Stepper.PrevTrigger className="rounded-[8px] border border-black px-3 py-1.5 text-sm text-black disabled:opacity-40">
              Back
            </Stepper.PrevTrigger>
            <Stepper.NextTrigger className="rounded-[8px] bg-black px-3 py-1.5 text-sm text-white disabled:opacity-40">
              {step === steps.length - 1 ? 'Submit' : 'Next'}
            </Stepper.NextTrigger>
          </div>
        </Stepper.Root>
      </div>
    </div>
  )
}
