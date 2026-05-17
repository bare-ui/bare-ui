'use client'

import { Breadcrumb } from '@wire-ui/react'

const linkCls = 'text-sm text-[#6b7280] hover:text-black hover:underline'
const currentCls = 'text-sm font-medium text-black'
const sepCls = 'mx-2 text-[#6b7280]'
const listCls = 'flex items-center'

export function BreadcrumbPreview() {
  return (
    <div className="p-6 flex flex-col gap-6">
      <Breadcrumb.Root>
        <Breadcrumb.List className={listCls}>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="#" className={linkCls}>Home</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator className={sepCls} />
          <Breadcrumb.Item>
            <Breadcrumb.Link href="#" className={linkCls}>Settings</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator className={sepCls} />
          <Breadcrumb.Item current className={currentCls}>Profile</Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>

      <Breadcrumb.Root>
        <Breadcrumb.List className={listCls}>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="#" className={linkCls}>Home</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator className={sepCls}>›</Breadcrumb.Separator>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="#" className={linkCls}>Docs</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator className={sepCls}>›</Breadcrumb.Separator>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="#" className={linkCls}>Components</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator className={sepCls}>›</Breadcrumb.Separator>
          <Breadcrumb.Item current className={currentCls}>Breadcrumb</Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>
    </div>
  )
}
