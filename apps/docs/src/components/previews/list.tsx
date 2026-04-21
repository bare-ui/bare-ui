'use client'

import { List } from '@wire-ui/react'

export function ListBasic() {
  return (
    <div className="p-6">
      <List className="w-72 divide-y divide-black overflow-hidden rounded-[8px] border border-black bg-white">
        {['Profile settings', 'Notifications', 'Privacy controls', 'Help center'].map((item) => (
          <li key={item} className="px-4 py-3 text-sm text-black">
            {item}
          </li>
        ))}
      </List>
    </div>
  )
}

export function ListComposed() {
  return (
    <div className="p-6">
      <List className="w-72 divide-y divide-[#d4d4d4] overflow-hidden rounded-[8px] border border-black bg-white">
        {[
          { label: 'Profile', icon: '👤', desc: 'Manage your account' },
          { label: 'Notifications', icon: '🔔', desc: 'Configure alerts' },
          { label: 'Privacy', icon: '🔒', desc: 'Control your data' },
          { label: 'Help', icon: '❓', desc: 'Get support' },
        ].map(({ label, icon, desc }) => (
          <li key={label} className="flex cursor-pointer items-center gap-3 px-4 py-3 text-sm text-black hover:bg-[#f5f5f5]">
            <span className="text-xl">{icon}</span>
            <div>
              <p className="text-sm font-medium text-black">{label}</p>
              <p className="text-xs text-[#6b7280]">{desc}</p>
            </div>
            <svg className="ml-auto h-4 w-4 text-[#6b7280]" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
            </svg>
          </li>
        ))}
      </List>
    </div>
  )
}

export function ListComplex() {
  return (
    <div className="p-6">
      <List className="w-64 space-y-2">
        {[
          { label: 'Design mockups', done: true },
          { label: 'Write unit tests', done: true },
          { label: 'Implement API', done: false },
          { label: 'Deploy to staging', done: false },
        ].map(({ label, done }) => (
          <li key={label} className="flex items-center gap-2.5 text-sm">
            <span className={['flex h-5 w-5 items-center justify-center rounded-full border', done ? 'border-black bg-black text-white' : 'border-black bg-white'].join(' ')}>
              {done && (
                <svg className="h-3 w-3" viewBox="0 0 12 12" fill="currentColor">
                  <path d="M3.5 6L5.5 8L8.5 4.5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
            <span className={done ? 'text-[#6b7280] line-through' : 'text-black'}>{label}</span>
          </li>
        ))}
      </List>
    </div>
  )
}
