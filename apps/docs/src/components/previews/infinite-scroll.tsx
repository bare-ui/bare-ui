'use client'

import { InfiniteScroll } from '@wire-ui/react'
import { useCallback, useRef, useState } from 'react'

const TOTAL = 60
const PAGE = 15

export function InfiniteScrollPreview() {
  const [items, setItems] = useState(() => Array.from({ length: PAGE }, (_, i) => i))
  const [loading, setLoading] = useState(false)
  const loadingRef = useRef(false)

  const loadMore = useCallback(() => {
    if (loadingRef.current) return
    loadingRef.current = true
    setLoading(true)
    globalThis.setTimeout(() => {
      setItems((prev) => [...prev, ...Array.from({ length: PAGE }, (_, i) => prev.length + i)])
      setLoading(false)
      loadingRef.current = false
    }, 700)
  }, [])

  const hasMore = items.length < TOTAL

  return (
    <div className="flex justify-center p-6">
      <InfiniteScroll.Root
        onLoadMore={loadMore}
        hasMore={hasMore}
        loading={loading}
        rootMargin="120px"
        className="h-80 w-72 overflow-auto rounded-[8px] border border-black bg-white"
      >
        <ul className="divide-y divide-[#d4d4d4]">
          {items.map((i) => (
            <li key={i} className="px-4 py-3 text-sm text-black">
              Item #{i + 1}
            </li>
          ))}
        </ul>
        <InfiniteScroll.Loader className="flex items-center justify-center gap-2 py-4 text-sm text-[#6b7280]">
          <span className="size-4 animate-spin rounded-full border-2 border-[#d4d4d4] border-t-black" />
          Loading more…
        </InfiniteScroll.Loader>
        <InfiniteScroll.EndMessage className="py-4 text-center text-xs text-[#9ca3af]">
          You’ve reached the end
        </InfiniteScroll.EndMessage>
        <InfiniteScroll.Sentinel />
      </InfiniteScroll.Root>
    </div>
  )
}
