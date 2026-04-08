'use client'

import { Switch } from '@wire-ui/react'
import { useState } from 'react'

const trackCls = 'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-black bg-[#e5e5e5] transition-colors outline-none data-[checked]:bg-black data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-[focus-visible]:ring-2 data-[focus-visible]:ring-black data-[focus-visible]:ring-offset-2'
const thumbCls = 'pointer-events-none inline-block size-5 translate-x-0 rounded-full border-2 border-black bg-white transition-transform data-[checked]:translate-x-5'

export function SwitchPreview() {
  const [notifications, setNotifications] = useState(true)
  const [emails, setEmails] = useState(false)
  const [marketing, setMarketing] = useState(false)

  const items = [
    { label: 'Push notifications', desc: 'Receive alerts in your browser', value: notifications, onChange: () => setNotifications(!notifications) },
    { label: 'Email updates', desc: 'Get a weekly digest of activity', value: emails, onChange: () => setEmails(!emails) },
    { label: 'Marketing emails', desc: 'Promotions and product announcements', value: marketing, onChange: () => setMarketing(!marketing) },
  ]

  return (
    <div className="p-6 flex justify-center">
      <div className="w-80 divide-y divide-[#d4d4d4] rounded-[20px] border-[3px] border-black bg-white">
        {items.map(({ label, desc, value, onChange }) => (
          <div key={label} className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="text-sm font-medium text-black">{label}</p>
              <p className="text-xs text-[#6b7280]">{desc}</p>
            </div>
            <Switch.Root checked={value} onChange={onChange} className={trackCls}>
              <Switch.Thumb className={thumbCls} />
            </Switch.Root>
          </div>
        ))}
      </div>
    </div>
  )
}
