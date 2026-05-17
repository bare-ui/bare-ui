'use client'

import { Skeleton } from '@wire-ui/react'

const baseCls = 'animate-pulse rounded-[8px] bg-[#e5e5e5]'

export function SkeletonPreview() {
  return (
    <div className="flex justify-center p-6">
      <div className="flex w-80 gap-3 rounded-[20px] border border-black bg-white p-6">
        <Skeleton className={`${baseCls} h-12 w-12 rounded-full`} />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className={`${baseCls} h-4 w-1/2`} />
          <Skeleton className={`${baseCls} h-3 w-full`} />
          <Skeleton className={`${baseCls} h-3 w-3/4`} />
        </div>
      </div>
    </div>
  )
}
