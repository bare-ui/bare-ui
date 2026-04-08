'use client'

import { Avatar } from '@wire-ui/react'

const users = [
  { src: 'https://i.pravatar.cc/150?img=1', name: 'User 1', initials: 'U1' },
  { src: 'https://i.pravatar.cc/150?img=2', name: 'User 2', initials: 'U2' },
  { src: 'https://i.pravatar.cc/150?img=3', name: 'User 3', initials: 'U3' },
  { src: 'https://broken.invalid/img.png', name: 'User 4', initials: 'U4' },
]

export function AvatarPreview() {
  return (
    <div className="p-6 flex flex-col gap-8 items-start">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-3">Sizes</p>
        <div className="flex items-end gap-4">
          <Avatar.Root className="relative inline-flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-black bg-[#f5f5f5]">
            <Avatar.Image src="https://i.pravatar.cc/150?img=3" alt="Jane Doe" className="size-full object-cover" />
            <Avatar.Fallback className="text-xs font-medium text-black">JD</Avatar.Fallback>
          </Avatar.Root>
          <Avatar.Root className="relative inline-flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-black bg-[#f5f5f5]">
            <Avatar.Image src="https://i.pravatar.cc/150?img=3" alt="Jane Doe" className="size-full object-cover" />
            <Avatar.Fallback className="text-xs font-medium text-black">JD</Avatar.Fallback>
          </Avatar.Root>
          <Avatar.Root className="relative inline-flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-black bg-[#f5f5f5]">
            <Avatar.Image src="https://i.pravatar.cc/150?img=3" alt="Jane Doe" className="size-full object-cover" />
            <Avatar.Fallback className="text-xs font-medium text-black">JD</Avatar.Fallback>
          </Avatar.Root>
          <Avatar.Root className="relative inline-flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-black bg-[#f5f5f5]">
            <Avatar.Image src="https://i.pravatar.cc/150?img=3" alt="Jane Doe" className="size-full object-cover" />
            <Avatar.Fallback className="text-xs font-medium text-black">JD</Avatar.Fallback>
          </Avatar.Root>
          <Avatar.Root className="relative inline-flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-black bg-[#f5f5f5]">
            <Avatar.Image src="https://i.pravatar.cc/150?img=3" alt="Jane Doe" className="size-full object-cover" />
            <Avatar.Fallback className="text-xs font-medium text-black">JD</Avatar.Fallback>
          </Avatar.Root>
        </div>
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-3">Group</p>
        <div className="flex -space-x-2">
          {users.map((user) => (
            <Avatar.Root
              key={user.name}
              className="relative inline-flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-black bg-[#f5f5f5] ring-2 ring-white">
              <Avatar.Image src={user.src} alt={user.name} className="size-full object-cover" />
              <Avatar.Fallback className="text-sm font-medium text-black select-none">{user.initials}</Avatar.Fallback>
            </Avatar.Root>
          ))}
          <Avatar.Root className="relative inline-flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-black bg-black ring-2 ring-white">
            <Avatar.Fallback className="text-xs font-medium text-white">+9</Avatar.Fallback>
          </Avatar.Root>
        </div>
      </div>
    </div>
  )
}
