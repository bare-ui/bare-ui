'use client'

import { NavigationMenu } from '@wire-ui/react'

const navCls = 'inline-flex items-center gap-1 rounded-[8px] border border-black bg-white px-2 py-1.5'
const listCls = 'flex items-center gap-1'
const triggerCls =
  'cursor-pointer rounded-[6px] px-3 py-1 text-sm font-medium text-black outline-none hover:bg-[#f5f5f5] data-[state=open]:bg-[#f5f5f5]'
const linkCls =
  'cursor-pointer rounded-[6px] px-3 py-1 text-sm font-medium text-black outline-none hover:bg-[#f5f5f5] data-[active]:bg-black data-[active]:text-white'
const contentCls =
  'absolute left-0 top-full z-10 mt-2 min-w-[280px] rounded-[20px] border border-black bg-white p-3'
const linkRowCls =
  'block rounded-[6px] px-3 py-2 text-sm text-black no-underline hover:bg-[#f5f5f5]'

export function NavigationMenuPreview() {
  return (
    <div className="p-6 flex items-center justify-center">
      <NavigationMenu.Root className={navCls}>
        <NavigationMenu.List className={listCls}>
          <NavigationMenu.Item>
            <NavigationMenu.Link href="#home" active className={linkCls}>
              Home
            </NavigationMenu.Link>
          </NavigationMenu.Item>
          <NavigationMenu.Item value="products">
            <div className="relative">
              <NavigationMenu.Trigger className={triggerCls}>
                Products
              </NavigationMenu.Trigger>
              <NavigationMenu.Content className={contentCls}>
                <div className="flex flex-col gap-1">
                  <NavigationMenu.Link href="#design" className={linkRowCls}>
                    <p className="font-medium">Design</p>
                    <p className="text-xs text-[#6b7280]">Templates and components</p>
                  </NavigationMenu.Link>
                  <NavigationMenu.Link href="#dev" className={linkRowCls}>
                    <p className="font-medium">Develop</p>
                    <p className="text-xs text-[#6b7280]">SDKs and APIs</p>
                  </NavigationMenu.Link>
                </div>
              </NavigationMenu.Content>
            </div>
          </NavigationMenu.Item>
          <NavigationMenu.Item>
            <NavigationMenu.Link href="#pricing" className={linkCls}>
              Pricing
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>
    </div>
  )
}
