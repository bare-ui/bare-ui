'use client'

import { Radio } from '@wire-ui/react'

const plans = [
  {
    value: 'startup',
    label: 'Startup',
    description: 'Up to 5 active job postings',
    ram: '12GB',
    cpus: '6 CPUs',
    disk: '160 GB SSD disk',
  },
  {
    value: 'business',
    label: 'Business',
    description: 'Up to 25 active job postings',
    ram: '16GB',
    cpus: '8 CPUs',
    disk: '512 GB SSD disk',
  },
  {
    value: 'enterprise',
    label: 'Enterprise',
    description: 'Unlimited active job postings',
    ram: '32GB',
    cpus: '12 CPUs',
    disk: '1024 GB SSD disk',
  },
]

export function RadioPreview() {
  return (
    <div className="p-6">
      <Radio.Root name="plan-specs" className="space-y-2">
        {plans.map((plan) => (
          <Radio.Item
            key={plan.value}
            value={plan.value}
            className="group relative flex cursor-pointer rounded-[8px] border-2 border-black bg-white px-5 py-4 transition focus:outline-none data-[checked]:bg-[#f5f5f5]">
            <div className="flex w-full items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full border-2 border-black bg-white transition group-data-[checked]:border-black group-data-[checked]:bg-black">
                  <Radio.Indicator className="size-2 rounded-full bg-white" />
                </span>
                <div>
                  <Radio.Label className="block text-sm font-medium text-black">{plan.label}</Radio.Label>
                  <p className="text-xs text-[#6b7280]">{plan.description}</p>
                </div>
              </div>
              <div className="flex shrink-0 gap-4 text-xs text-[#6b7280] group-data-[checked]:text-black">
                <span>{plan.ram}</span>
                <span>{plan.cpus}</span>
                <span>{plan.disk}</span>
              </div>
            </div>
          </Radio.Item>
        ))}
      </Radio.Root>
    </div>
  )
}
