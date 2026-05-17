'use client'

import { useState } from 'react'
import { Calendar, DatePicker } from '@wire-ui/react'

const triggerCls =
  'inline-flex cursor-pointer items-center justify-between gap-2 rounded-[8px] border border-black bg-white px-3 py-2 text-sm text-black outline-none hover:bg-[#f5f5f5] data-[state=open]:ring-2 data-[state=open]:ring-black data-[state=open]:ring-offset-1 w-64'
const contentCls = 'absolute left-0 top-full z-10 mt-2 w-72 rounded-[20px] border border-black bg-white p-3'
const navCls = 'flex items-center justify-between mb-2'
const navBtnCls = 'cursor-pointer rounded-[6px] px-2 py-1 text-sm text-black hover:bg-[#f5f5f5] disabled:opacity-40'
const titleCls = 'text-sm font-semibold text-black'
const dayCls =
  'cursor-pointer rounded-[6px] p-1.5 text-center text-sm text-black hover:bg-[#f5f5f5] data-[selected]:bg-black data-[selected]:text-white data-[today]:font-bold data-[today]:underline data-[outside-month]:text-[#a3a3a3] data-[disabled]:cursor-not-allowed data-[disabled]:opacity-30'

export function DatePickerPreview() {
  const [date, setDate] = useState<Date | null>(null)
  return (
    <div className="p-6 flex items-center justify-center">
      <DatePicker.Root value={date} onChange={setDate} className="relative inline-block">
        <DatePicker.Trigger className={triggerCls}>
          <DatePicker.Value placeholder={<span className="text-[#a3a3a3]">Pick a date</span>} />
          <svg className="size-4 text-[#6b7280]" viewBox="0 0 20 20" fill="currentColor">
            <path d="M6 2a1 1 0 011 1v1h6V3a1 1 0 112 0v1h1a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2h1V3a1 1 0 011-1z" />
          </svg>
        </DatePicker.Trigger>
        <DatePicker.Content className={contentCls}>
          <DatePicker.Calendar>
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
              renderWeekday={(wd) => <div className="text-center text-xs font-medium text-[#6b7280] py-1">{wd.short}</div>}
            />
          </DatePicker.Calendar>
        </DatePicker.Content>
      </DatePicker.Root>
    </div>
  )
}
