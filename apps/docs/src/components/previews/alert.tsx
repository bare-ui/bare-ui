'use client'

import { Alert } from '@wire-ui/react'

export function AlertPreview() {
  return (
    <div className="p-6 flex flex-col gap-3 max-w-lg mx-auto">
      <Alert.Root className="flex items-start gap-3 rounded-[8px] border-2 border-black bg-[#f5f5f5] px-4 py-3 text-black">
        <div className="flex-1">
          <Alert.Title className="text-sm font-semibold">Default</Alert.Title>
          <Alert.Description className="mt-0.5 text-sm">This is a default informational alert.</Alert.Description>
        </div>
      </Alert.Root>
      <Alert.Root status="success" className="flex items-start gap-3 rounded-[8px] border-2 border-black bg-[#f5f5f5] px-4 py-3 text-black">
        <div className="flex-1">
          <Alert.Title className="text-sm font-semibold">Success</Alert.Title>
          <Alert.Description className="mt-0.5 text-sm">Your changes have been saved successfully.</Alert.Description>
        </div>
      </Alert.Root>
      <Alert.Root status="warning" className="flex items-start gap-3 rounded-[8px] border-2 border-black bg-[#f5f5f5] px-4 py-3 text-black">
        <div className="flex-1">
          <Alert.Title className="text-sm font-semibold">Warning</Alert.Title>
          <Alert.Description className="mt-0.5 text-sm">Please review the information before proceeding.</Alert.Description>
        </div>
      </Alert.Root>
      <Alert.Root status="danger" className="flex items-start gap-3 rounded-[8px] border-2 border-black bg-[#f5f5f5] px-4 py-3 text-black">
        <div className="flex-1">
          <Alert.Title className="text-sm font-semibold">Error</Alert.Title>
          <Alert.Description className="mt-0.5 text-sm">Something went wrong. Please try again.</Alert.Description>
        </div>
      </Alert.Root>
    </div>
  )
}
