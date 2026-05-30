'use client'

import { ScrollArea } from '@wire-ui/react'

const notifications = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  who: ['Maya Chen', 'Leo Park', 'Ravi Singh', 'Tess Doyle'][i % 4],
  text: ['mentioned you in a comment', 'requested your review', 'assigned you a task', 'shared a document'][i % 4],
  when: `${i + 1}m ago`,
}))

export function ScrollAreaPreview() {
  return (
    <div className="flex justify-center p-6">
      <div className="w-80 overflow-hidden rounded-[20px] border border-black bg-white">
        <div className="flex items-center justify-between border-b border-black px-4 py-3">
          <p className="text-sm font-semibold text-black">Notifications</p>
          <span className="rounded-full border border-black bg-black px-2 py-0.5 text-xs text-white">24</span>
        </div>
        <ScrollArea.Root className="h-72">
          <ScrollArea.Viewport className="h-full w-full">
            <ul className="divide-y divide-[#d4d4d4]">
              {notifications.map((n) => (
                <li key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-[#f5f5f5]">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-black bg-white text-xs font-medium text-black">
                    {n.who
                      .split(' ')
                      .map((p) => p[0])
                      .join('')}
                  </span>
                  <div className="min-w-0 text-sm">
                    <p className="text-black">
                      <span className="font-medium">{n.who}</span> {n.text}
                    </p>
                    <p className="text-xs text-[#6b7280]">{n.when}</p>
                  </div>
                </li>
              ))}
            </ul>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar orientation="vertical" className="flex w-2.5 touch-none select-none p-0.5">
            <ScrollArea.Thumb className="flex-1 rounded-full border border-black bg-black/70 hover:bg-black" />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
      </div>
    </div>
  )
}
