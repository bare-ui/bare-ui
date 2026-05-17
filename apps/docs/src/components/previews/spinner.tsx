'use client'

import { Spinner } from '@wire-ui/react'

function Ring({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ animation: 'wire-spin 1s linear infinite' }}>
      <style>{`@keyframes wire-spin { to { transform: rotate(360deg); } }`}</style>
      <circle cx="12" cy="12" r="10" stroke="#e5e5e5" strokeWidth="2" />
      <path d="M22 12a10 10 0 0 0-10-10" stroke="black" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function SpinnerPreview() {
  return (
    <div className="p-6 flex flex-col items-center gap-6">
      <div className="flex items-center gap-6">
        <Spinner label="Small">
          <Ring size={16} />
        </Spinner>
        <Spinner label="Medium">
          <Ring size={24} />
        </Spinner>
        <Spinner label="Large">
          <Ring size={40} />
        </Spinner>
      </div>
      <div className="inline-flex items-center gap-3 rounded-[8px] border border-black bg-white px-4 py-3 text-sm text-black">
        <Spinner label="Saving changes">
          <Ring size={18} />
        </Spinner>
        <span>Saving changes…</span>
      </div>
    </div>
  )
}
