'use client'

import { Icon } from '@wire-ui/react'

const icons = {
  home: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>',
}

export function IconPreview() {
  return (
    <div className="p-6 flex items-center justify-center gap-6">
      <Icon type="home" icons={icons} size="large" className="[data-size=large]:size-8 text-black" />
      <Icon type="star" icons={icons} size="large" className="[data-size=large]:size-8 text-black" />
      <Icon type="heart" icons={icons} size="large" className="[data-size=large]:size-8 text-black" />
    </div>
  )
}
