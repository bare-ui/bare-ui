'use client'

import { Card } from '@wire-ui/react'

export function CardPreview() {
  return (
    <div className="p-6 flex flex-col gap-8">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-4">Colors</p>
        <div className="flex flex-col gap-3">
          <Card color="default" className="rounded-[8px] border-2 border-black bg-white p-4 text-sm text-black">Default color card</Card>
          <Card color="primary" className="rounded-[8px] border-2 border-black bg-[#f5f5f5] p-4 text-sm text-black">Primary color card</Card>
          <Card color="inverse" className="rounded-[8px] border-2 border-black bg-black p-4 text-sm text-white">Inverse color card</Card>
        </div>
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-4">Sizes</p>
        <div className="flex flex-col gap-3">
          <Card size="xsmall" className="rounded-[8px] border-2 border-black bg-white p-2 text-xs text-black">Extra small</Card>
          <Card size="small" className="rounded-[8px] border-2 border-black bg-white p-3 text-sm text-black">Small</Card>
          <Card size="medium" className="rounded-[8px] border-2 border-black bg-white p-4 text-sm text-black">Medium</Card>
          <Card size="large" className="rounded-[20px] border-[3px] border-black bg-white p-6 text-base text-black">Large</Card>
        </div>
      </div>
    </div>
  )
}
