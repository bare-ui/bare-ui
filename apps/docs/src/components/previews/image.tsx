'use client'

const WireframePlaceholder = ({ width = 400, height = 240 }: { width?: number; height?: number }) => (
  <div style={{ width, height, position: 'relative', background: '#f5f5f5', border: '2px solid #000', overflow: 'hidden' }}>
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <line x1="0" y1="0" x2="100" y2="100" stroke="#000" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      <line x1="100" y1="0" x2="0" y2="100" stroke="#000" strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  </div>
)

export function ImagePreview() {
  return (
    <div className="p-6 flex flex-col gap-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-2">Default</p>
        <WireframePlaceholder />
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-2">Position: left</p>
        <div className="flex justify-start">
          <WireframePlaceholder width={320} height={200} />
        </div>
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-2">Position: center</p>
        <div className="flex justify-center">
          <WireframePlaceholder width={320} height={200} />
        </div>
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-2">Position: right</p>
        <div className="flex justify-end">
          <WireframePlaceholder width={320} height={200} />
        </div>
      </div>
    </div>
  )
}
