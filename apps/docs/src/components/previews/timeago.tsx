'use client'

import { Timeago } from '@wire-ui/react'

export function TimeagoPreview() {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
  const lastYear = new Date('2025-06-15T10:30:00')

  return (
    <div className="p-6 flex flex-col gap-8">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-4">Recent date</p>
        <div className="flex flex-col gap-3">
          <div>
            <span className="text-sm font-medium text-[#6b7280]">Duration: </span>
            <Timeago datetime={fiveMinutesAgo} isDuration className="text-sm text-black" />
          </div>
          <div>
            <span className="text-sm font-medium text-[#6b7280]">Full date/time: </span>
            <Timeago datetime={fiveMinutesAgo} className="text-sm text-black" />
          </div>
          <div>
            <span className="text-sm font-medium text-[#6b7280]">Time only: </span>
            <Timeago datetime={fiveMinutesAgo} timeOnly className="text-sm text-black" />
          </div>
        </div>
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-4">Older dates</p>
        <div className="flex flex-col gap-3">
          <div>
            <span className="text-sm font-medium text-[#6b7280]">3 days ago: </span>
            <Timeago datetime={threeDaysAgo} className="text-sm text-black" />
          </div>
          <div>
            <span className="text-sm font-medium text-[#6b7280]">2 weeks ago: </span>
            <Timeago datetime={twoWeeksAgo} className="text-sm text-black" />
          </div>
          <div>
            <span className="text-sm font-medium text-[#6b7280]">Last year: </span>
            <Timeago datetime={lastYear} className="text-sm text-black" />
          </div>
        </div>
      </div>
    </div>
  )
}
