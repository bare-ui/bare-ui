'use client'

import { Alert } from '@wire-ui/react'

export function AlertBasic() {
  return (
    <div className="p-6 flex flex-col gap-3 max-w-lg mx-auto">
      <Alert.Root className="flex items-start gap-3 rounded-[8px] border border-black bg-[#f5f5f5] px-4 py-3 text-black">
        <div className="flex-1">
          <Alert.Title className="text-sm font-semibold">Heads up</Alert.Title>
          <Alert.Description className="mt-0.5 text-sm">This is a default informational alert.</Alert.Description>
        </div>
      </Alert.Root>
    </div>
  )
}

export function AlertComposed() {
  return (
    <div className="p-6 flex flex-col gap-3 max-w-lg mx-auto">
      <Alert.Root className="flex items-start gap-3 rounded-[8px] border border-black bg-[#f5f5f5] px-4 py-3 text-black">
        <div className="flex-1">
          <Alert.Title className="text-sm font-semibold">Default</Alert.Title>
          <Alert.Description className="mt-0.5 text-sm">This is a default informational alert.</Alert.Description>
        </div>
      </Alert.Root>
      <Alert.Root status="success" className="flex items-start gap-3 rounded-[8px] border border-black bg-[#f5f5f5] px-4 py-3 text-black">
        <div className="flex-1">
          <Alert.Title className="text-sm font-semibold">Success</Alert.Title>
          <Alert.Description className="mt-0.5 text-sm">Your changes have been saved successfully.</Alert.Description>
        </div>
      </Alert.Root>
      <Alert.Root status="warning" className="flex items-start gap-3 rounded-[8px] border border-black bg-[#f5f5f5] px-4 py-3 text-black">
        <div className="flex-1">
          <Alert.Title className="text-sm font-semibold">Warning</Alert.Title>
          <Alert.Description className="mt-0.5 text-sm">Please review the information before proceeding.</Alert.Description>
        </div>
      </Alert.Root>
      <Alert.Root status="danger" className="flex items-start gap-3 rounded-[8px] border border-black bg-[#f5f5f5] px-4 py-3 text-black">
        <div className="flex-1">
          <Alert.Title className="text-sm font-semibold">Error</Alert.Title>
          <Alert.Description className="mt-0.5 text-sm">Something went wrong. Please try again.</Alert.Description>
        </div>
      </Alert.Root>
    </div>
  )
}

export function AlertComplex() {
  return (
    <div className="p-6 flex flex-col gap-3 max-w-lg mx-auto">
      <Alert.Root status="warning" className="flex items-start gap-3 rounded-[8px] border border-black bg-[#f5f5f5] px-4 py-3 text-black">
        <svg className="h-5 w-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86l-8.4 14.31A1.5 1.5 0 003.18 20h17.64a1.5 1.5 0 001.29-2.23l-8.4-14.31a1.5 1.5 0 00-2.58 0z" />
        </svg>
        <div className="flex-1">
          <Alert.Title className="text-sm font-semibold">Warning</Alert.Title>
          <Alert.Description className="mt-0.5 text-sm">Your session is about to expire. Please save your work.</Alert.Description>
        </div>
        <Alert.Dismiss className="shrink-0 rounded-[8px] p-1 text-black hover:bg-[#e5e5e5] transition-colors">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Alert.Dismiss>
      </Alert.Root>
    </div>
  )
}
