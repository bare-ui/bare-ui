'use client'

import { useState } from 'react'
import { Pagination } from '@wire-ui/react'

const listCls = 'flex items-center gap-1'
const navBtnCls = 'cursor-pointer rounded-[8px] border border-black bg-white px-3 py-1.5 text-sm text-black hover:bg-[#f5f5f5] disabled:cursor-not-allowed disabled:opacity-40'
const pageBtnCls = 'cursor-pointer rounded-[8px] border border-black bg-white min-w-[36px] inline-flex items-center justify-center px-2 py-1.5 text-sm text-black hover:bg-[#f5f5f5] data-[active]:bg-black data-[active]:text-white'

export function PaginationPreview() {
  const [page, setPage] = useState(4)
  return (
    <div className="p-6 flex flex-col items-center justify-center gap-2">
      <Pagination.Root totalPages={10} page={page} onChange={setPage}>
        <Pagination.List className={listCls}>
          <li><Pagination.Previous className={navBtnCls}>‹</Pagination.Previous></li>
          <Pagination.Items>
            {(item, i) =>
              item === 'ellipsis' ? (
                <Pagination.Ellipsis key={`e-${i}`} className="px-2 text-[#6b7280]" />
              ) : (
                <Pagination.Item key={item} page={item}>
                  <span className={pageBtnCls}>{item}</span>
                </Pagination.Item>
              )
            }
          </Pagination.Items>
          <li><Pagination.Next className={navBtnCls}>›</Pagination.Next></li>
        </Pagination.List>
      </Pagination.Root>
      <p className="text-xs text-[#6b7280]">Page <span className="font-medium text-black">{page}</span> of 10</p>
    </div>
  )
}
