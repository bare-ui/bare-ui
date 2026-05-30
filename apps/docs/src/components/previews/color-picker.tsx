'use client'

import { ColorPicker } from '@wire-ui/react'
import { useState } from 'react'

const thumbCls = 'size-3.5 rounded-full border-2 border-white shadow ring-1 ring-black/30'
const inputCls =
  'mt-3 w-full rounded-[8px] border border-black px-2 py-1 font-mono text-sm uppercase text-black outline-none focus:ring-2 focus:ring-black'

const presets = ['#000000', '#ef4444', '#f59e0b', '#10b981', '#0ea5e9', '#6d28d9']

export function ColorPickerPreview() {
  const [color, setColor] = useState('#0ea5e9')

  return (
    <div className="flex justify-center p-6">
      <div className="w-72 rounded-[20px] border border-black bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-semibold text-black">Brand color</span>
          <span
            className="size-6 rounded-full ring-1 ring-black/20"
            style={{ backgroundColor: color }}
          />
        </div>
        <ColorPicker.Root value={color} onChange={setColor}>
          <ColorPicker.Area className="relative mb-3 h-36 w-full rounded-[8px]">
            <ColorPicker.AreaThumb className={thumbCls} />
          </ColorPicker.Area>
          <div className="flex items-center gap-3">
            <ColorPicker.Swatch className="size-9 shrink-0 rounded-full ring-1 ring-black/20" />
            <div className="flex-1 space-y-2">
              <ColorPicker.Hue className="relative h-3 w-full rounded-full">
                <ColorPicker.HueThumb className={thumbCls} />
              </ColorPicker.Hue>
              <ColorPicker.Alpha className="relative h-3 w-full rounded-full">
                <ColorPicker.AlphaThumb className={thumbCls} />
              </ColorPicker.Alpha>
            </div>
          </div>
          <ColorPicker.Input className={inputCls} />
        </ColorPicker.Root>
        <div className="mt-4">
          <p className="mb-2 text-xs font-medium text-[#6b7280]">Presets</p>
          <div className="flex gap-2">
            {presets.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setColor(p)}
                className="size-7 rounded-full ring-1 ring-black/20 transition hover:scale-110"
                style={{ backgroundColor: p }}
                aria-label={`Use ${p}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
