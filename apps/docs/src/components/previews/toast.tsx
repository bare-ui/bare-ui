'use client'

import { Toast, useToast } from '@wire-ui/react'

const triggerCls =
  'inline-flex cursor-pointer items-center rounded-[8px] border border-black bg-black px-4 py-2 text-sm font-medium text-white hover:bg-[#333]'
const triggerAltCls =
  'inline-flex cursor-pointer items-center rounded-[8px] border border-black bg-white px-4 py-2 text-sm font-medium text-black hover:bg-[#f5f5f5]'
const toastCls = 'flex items-start gap-3 rounded-[8px] border border-black bg-white px-4 py-3 shadow-sm w-80'
const closeCls =
  'shrink-0 rounded-[8px] p-1 text-black hover:bg-[#e5e5e5] [data-focus-visible]:ring-2 [data-focus-visible]:ring-black'
const viewportCls = 'fixed bottom-4 right-4 z-50 flex flex-col gap-2'

function Trigger() {
  const { toast } = useToast()
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <button
        className={triggerCls}
        onClick={() => toast({ title: 'Saved', description: 'Your changes are saved.', status: 'success' })}
      >
        Show toast
      </button>
      <button
        className={triggerAltCls}
        onClick={() =>
          toast({
            id: 'persistent',
            title: 'Persistent',
            description: 'Stays until dismissed.',
            duration: 0,
          })
        }
      >
        Show persistent
      </button>
    </div>
  )
}

export function ToastPreview() {
  return (
    <Toast.Provider defaultDuration={4000}>
      <div className="p-6 flex items-center justify-center">
        <Trigger />
      </div>
      <Toast.Viewport className={viewportCls}>
        {(t, dismiss) => (
          <Toast.Root key={t.id} className={toastCls}>
            <div className="flex-1">
              {t.title && <Toast.Title className="text-sm font-semibold text-black">{t.title}</Toast.Title>}
              {t.description && (
                <Toast.Description className="mt-0.5 text-sm text-[#6b7280]">{t.description}</Toast.Description>
              )}
            </div>
            <Toast.Close className={closeCls} onClick={dismiss}>
              ×
            </Toast.Close>
          </Toast.Root>
        )}
      </Toast.Viewport>
    </Toast.Provider>
  )
}
