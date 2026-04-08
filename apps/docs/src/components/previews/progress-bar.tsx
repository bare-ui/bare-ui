'use client'

import { ProgressBar } from '@wire-ui/react'

const trackCls = 'w-full overflow-hidden rounded-full bg-[#e5e5e5] [&_[data-part=fill]]:h-full [&_[data-part=fill]]:rounded-full [&_[data-part=fill]]:bg-black [&_[data-part=fill]]:transition-[width] [&_[data-part=fill]]:duration-300'

export function ProgressBarBasic() {
  return (
    <div className="p-6 flex justify-center">
      <div className="w-80">
        <ProgressBar percentage={60} className={['h-2', trackCls].join(' ')} />
      </div>
    </div>
  )
}

export function ProgressBarComposed() {
  return (
    <div className="p-6 flex justify-center">
      <div className="flex w-80 flex-col gap-3">
        {[0, 25, 50, 75, 100].map((p) => (
          <div key={p} className="flex items-center gap-3">
            <div className="w-8 text-right text-xs text-[#6b7280]">{p}%</div>
            <ProgressBar percentage={p} className={['flex-1 h-2', trackCls].join(' ')} />
          </div>
        ))}
      </div>
    </div>
  )
}

export function ProgressBarComplex() {
  return (
    <div className="p-6 flex justify-center">
      <div className="w-80">
        <div className="mb-1 flex justify-between text-sm">
          <span className="font-medium text-black">Storage used</span>
          <span className="text-[#6b7280]">68%</span>
        </div>
        <ProgressBar percentage={68} className={['h-2', trackCls].join(' ')} />
        <p className="mt-1 text-xs text-[#6b7280]">6.8 GB of 10 GB used</p>
      </div>
    </div>
  )
}
