'use client'

import { Citation } from '@wire-ui/react'

const sources = [
  {
    id: 'rfc',
    title: 'RFC 9110 — HTTP Semantics',
    url: 'https://www.rfc-editor.org/rfc/rfc9110',
    excerpt: 'The 200 status code indicates that the request has succeeded.',
  },
  {
    id: 'mdn',
    title: 'MDN — HTTP response status codes',
    url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status',
    excerpt: 'Responses are grouped in five classes.',
  },
]

const markerCls =
  'ml-0.5 inline-flex items-center rounded-[4px] border border-black bg-white px-1 text-[0.65rem] font-semibold text-black no-underline align-super hover:bg-black hover:text-white'

export function CitationPreview() {
  return (
    <div className="flex justify-center p-6">
      <Citation.Root
        sources={sources}
        className="w-full max-w-lg space-y-4 rounded-[20px] border border-black bg-white p-5 text-sm text-black"
      >
        <p className="leading-relaxed">
          A <code>200 OK</code> response means the request succeeded
          <Citation.Ref for="rfc" className={markerCls} />. Status codes are grouped into five
          classes, from informational to server error
          <Citation.Ref for="mdn" className={markerCls} />.
        </p>
        <Citation.List className="space-y-1 border-t border-black pt-3 text-xs text-[#6b7280]">
          {({ index, source }) => (
            <div className="flex gap-2">
              <span className="font-semibold text-black">{index}.</span>
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="text-black hover:underline"
              >
                {source.title}
              </a>
            </div>
          )}
        </Citation.List>
      </Citation.Root>
    </div>
  )
}
