'use client'

import { ResizablePanels } from '@wire-ui/react'

const panelCls = 'flex items-center justify-center bg-[#f5f5f5] text-sm font-medium text-black'
const handleHCls = 'w-px bg-black hover:w-1 transition-all'
const handleVCls = 'h-px bg-black hover:h-1 transition-all'

export function ResizablePanelsPreview() {
  return (
    <div className="p-6 w-full flex items-center justify-center">
      <div
        style={{ width: '100%', maxWidth: 560, height: 280 }}
        className="border border-black rounded-[8px] overflow-hidden">
        <ResizablePanels.Group orientation="horizontal">
          <ResizablePanels.Panel
            defaultSize={25}
            minSize={15}
            maxSize={50}
            className={`${panelCls} flex-col items-start gap-1 p-3`}>
            <p className="text-xs font-medium uppercase tracking-wide text-[#6b7280]">Sidebar</p>
            <p className="text-xs text-black">Files</p>
            <p className="text-xs text-black">Search</p>
          </ResizablePanels.Panel>
          <ResizablePanels.Handle className={handleHCls} />
          <ResizablePanels.Panel defaultSize={75}>
            <ResizablePanels.Group orientation="vertical">
              <ResizablePanels.Panel defaultSize={70} minSize={30} className={panelCls}>
                Editor
              </ResizablePanels.Panel>
              <ResizablePanels.Handle className={handleVCls} />
              <ResizablePanels.Panel defaultSize={30} minSize={15} className={`${panelCls} text-[#6b7280]`}>
                Terminal
              </ResizablePanels.Panel>
            </ResizablePanels.Group>
          </ResizablePanels.Panel>
        </ResizablePanels.Group>
      </div>
    </div>
  )
}
