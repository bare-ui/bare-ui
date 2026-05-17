'use client'

import { useState } from 'react'
import { Calendar } from '@wire-ui/react'

const wrapperCls = 'inline-block rounded-[20px] border border-black bg-white p-3 w-fit'
const navCls = 'flex items-center justify-between mb-2'
const navBtnCls = 'cursor-pointer rounded-[6px] px-2 py-1 text-sm text-black hover:bg-[#f5f5f5] disabled:opacity-40'
const titleCls = 'text-sm font-semibold text-black'
const dayCls =
  'cursor-pointer rounded-[6px] p-1.5 text-center text-sm text-black hover:bg-[#f5f5f5] data-[selected]:bg-black data-[selected]:text-white data-[today]:font-bold data-[today]:underline data-[outside-month]:text-[#a3a3a3] data-[disabled]:cursor-not-allowed data-[disabled]:opacity-30'
const weekdayCls = 'text-center text-xs font-medium text-[#6b7280] py-1'

export function CalendarPreview() {
  const [selected, setSelected] = useState<Date | null>(new Date())
  return (
    <div className="p-6 flex flex-col items-center justify-center gap-2">
      <Calendar.Root value={selected} onChange={setSelected} className={wrapperCls}>
        <Calendar.Nav className={navCls}>
          <Calendar.PrevButton className={navBtnCls}>‹</Calendar.PrevButton>
          <Calendar.Title className={titleCls} />
          <Calendar.NextButton className={navBtnCls}>›</Calendar.NextButton>
        </Calendar.Nav>
        <Calendar.Grid
          renderDay={(day) => (
            <button {...day.props} className={dayCls}>
              {day.dayOfMonth}
            </button>
          )}
          renderWeekday={(wd) => <div className={weekdayCls}>{wd.short}</div>}
        />
      </Calendar.Root>
      <p className="text-xs text-[#6b7280]">
        Selected: <span className="font-medium text-black">{selected ? selected.toLocaleDateString() : '∅'}</span>
      </p>
    </div>
  )
}
