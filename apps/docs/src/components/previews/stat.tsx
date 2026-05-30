'use client'

import { Stat } from '@wire-ui/react'

const deltaCls =
  'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium data-[direction=increase]:bg-[#dcfce7] data-[direction=increase]:text-[#15803d] data-[direction=decrease]:bg-[#fee2e2] data-[direction=decrease]:text-[#b91c1c] data-[direction=neutral]:bg-[#f5f5f5] data-[direction=neutral]:text-[#6b7280]'

const cards = [
  { label: 'Revenue', value: '$48,250', delta: 12.5, trend: [20, 24, 22, 30, 28, 36, 34, 42] },
  { label: 'New customers', value: '312', delta: 5.4, trend: [8, 10, 9, 12, 14, 13, 16, 18] },
  { label: 'Churn rate', value: '2.1%', delta: -0.8, trend: [6, 5, 6, 4, 5, 4, 3, 3] },
]

export function StatPreview() {
  return (
    <div className="flex justify-center p-6">
      <div className="w-full max-w-2xl rounded-[20px] border border-black bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold text-black">Performance</h2>
          <span className="text-xs text-[#9ca3af]">Last 30 days</span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {cards.map((c) => (
            <Stat.Root key={c.label} className="rounded-[8px] border border-black p-4">
              <div className="flex items-center justify-between">
                <Stat.Label className="text-xs text-[#6b7280]">{c.label}</Stat.Label>
                <Stat.Delta value={c.delta} className={deltaCls}>
                  {c.delta > 0 ? '▲' : '▼'} {Math.abs(c.delta)}%
                </Stat.Delta>
              </div>
              <Stat.Value className="mt-1 block text-2xl font-semibold text-black">{c.value}</Stat.Value>
              <Stat.Sparkline data={c.trend} width={180} height={32} className="mt-3 w-full text-black" />
            </Stat.Root>
          ))}
        </div>
      </div>
    </div>
  )
}
