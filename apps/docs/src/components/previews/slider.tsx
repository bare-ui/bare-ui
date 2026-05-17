'use client'

import { useState } from 'react'
import { Slider } from '@wire-ui/react'

const sliderCls = [
  'h-6 w-80',
  '[&_[data-part=track]]:top-1/2 [&_[data-part=track]]:-translate-y-1/2 [&_[data-part=track]]:h-1 [&_[data-part=track]]:rounded-full [&_[data-part=track]]:bg-[#e5e5e5]',
  '[&_[data-part=fill]]:top-1/2 [&_[data-part=fill]]:-translate-y-1/2 [&_[data-part=fill]]:h-1 [&_[data-part=fill]]:rounded-full [&_[data-part=fill]]:bg-black',
  '[&_[data-part=thumb]]:size-4 [&_[data-part=thumb]]:rounded-full [&_[data-part=thumb]]:border [&_[data-part=thumb]]:border-black [&_[data-part=thumb]]:bg-white',
  '[&_[data-part=thumb]]:cursor-grab [&_[data-part=thumb]]:outline-none',
  '[&_[data-part=thumb]:focus-visible]:ring-2 [&_[data-part=thumb]:focus-visible]:ring-black [&_[data-part=thumb]:focus-visible]:ring-offset-1',
  '[&_[data-part=thumb]:active]:cursor-grabbing',
].join(' ')

export function SliderPreview() {
  const [value, setValue] = useState(40)
  const [range, setRange] = useState<[number, number]>([20, 80])
  return (
    <div className="p-6 flex flex-col items-center justify-center gap-8">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium text-black">Volume</span>
          <span className="text-[#6b7280]">{value}%</span>
        </div>
        <Slider value={value} onChange={setValue} min={0} max={100} step={1} aria-label="Volume" className={sliderCls} />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium text-black">Price range</span>
          <span className="text-[#6b7280]">${range[0]} – ${range[1]}</span>
        </div>
        <Slider range value={range} onChange={setRange} min={0} max={100} step={5} aria-label="Price range" className={sliderCls} />
      </div>
    </div>
  )
}
