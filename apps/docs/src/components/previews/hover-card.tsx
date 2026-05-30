'use client'

import { HoverCard } from '@wire-ui/react'

const cardCls =
  'w-64 rounded-[8px] border border-black bg-white p-4 text-sm shadow-[4px_4px_0_0_#000]'

export function HoverCardPreview() {
  return (
    <div className="flex justify-center p-6">
      <p className="max-w-sm text-sm leading-relaxed text-black">
        The latest release was shipped by{' '}
        <HoverCard.Root openDelay={150}>
          <HoverCard.Trigger className="cursor-pointer font-medium text-black underline underline-offset-2">
            @grace
          </HoverCard.Trigger>
          <HoverCard.Content side="top" sideOffset={8} className={cardCls}>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full border border-black bg-black text-sm font-bold text-white">
                G
              </div>
              <div>
                <p className="font-semibold text-black">Grace Hopper</p>
                <p className="text-xs text-[#6b7280]">@grace · Staff Engineer</p>
              </div>
            </div>
            <p className="mt-3 text-[#374151]">
              Builds compilers and ships releases on Fridays anyway.
            </p>
            <button className="mt-3 w-full rounded-[8px] border border-black bg-black py-1.5 text-xs font-medium text-white transition-colors hover:bg-white hover:text-black">
              Follow
            </button>
          </HoverCard.Content>
        </HoverCard.Root>{' '}
        with help from the platform team. Hover the name to preview their profile.
      </p>
    </div>
  )
}
