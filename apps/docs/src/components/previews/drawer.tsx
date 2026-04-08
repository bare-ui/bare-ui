'use client'

import { useState } from 'react'
import { Drawer } from '@wire-ui/react'

const navItems = [
  { label: 'Dashboard', icon: '🏠' },
  { label: 'Analytics', icon: '📊' },
  { label: 'Projects', icon: '📁' },
  { label: 'Team', icon: '👥' },
  { label: 'Messages', icon: '💬' },
  { label: 'Settings', icon: '⚙️' },
]

const CloseIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
  </svg>
)

export function DrawerPreview() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('Dashboard')

  return (
    <div className="p-6">
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-[8px] border-2 border-black bg-black px-4 py-2 text-sm font-medium text-white hover:bg-[#333]">
        ☰ Menu
      </button>

      <Drawer.Root open={open} onOpenChange={setOpen}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-50 bg-black/50">
            <Drawer.Content className="fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r-[3px] border-black bg-white">
              <Drawer.Header className="flex items-center justify-between px-4 py-4">
                <span className="text-lg font-bold text-black">MyApp</span>
                <Drawer.Close className="rounded-[8px] p-1 text-[#6b7280] hover:bg-[#f5f5f5] hover:text-black">
                  <CloseIcon />
                </Drawer.Close>
              </Drawer.Header>
              <nav className="flex-1 overflow-y-auto px-2 py-2">
                {navItems.map(({ label, icon }) => (
                  <button
                    key={label}
                    onClick={() => { setActive(label); setOpen(false) }}
                    className={[
                      'flex w-full items-center gap-3 rounded-[8px] px-3 py-2.5 text-sm font-medium transition-colors',
                      active === label ? 'bg-black text-white' : 'text-black hover:bg-[#f5f5f5]',
                    ].join(' ')}>
                    <span className="text-base">{icon}</span>
                    {label}
                  </button>
                ))}
              </nav>
              <div className="border-t-2 border-[#d4d4d4] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-black bg-black text-sm font-semibold text-white">JD</div>
                  <div>
                    <p className="text-sm font-medium text-black">Jane Doe</p>
                    <p className="text-xs text-[#6b7280]">jane@example.com</p>
                  </div>
                </div>
              </div>
            </Drawer.Content>
          </Drawer.Overlay>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  )
}
