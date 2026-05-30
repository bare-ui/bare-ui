'use client'

import { EmptyState } from '@wire-ui/react'

export function EmptyStatePreview() {
  return (
    <div className="flex justify-center p-6">
      <EmptyState.Root className="mx-auto flex max-w-sm flex-col items-center gap-3 rounded-[20px] border border-black bg-white p-10 text-center">
        <EmptyState.Media className="flex size-14 items-center justify-center rounded-full border border-black bg-[#f5f5f5] text-3xl">
          🗂️
        </EmptyState.Media>
        <EmptyState.Title className="text-base font-semibold text-black">No projects yet</EmptyState.Title>
        <EmptyState.Description className="text-sm text-[#6b7280]">
          Create your first project to organize tasks, files and collaborators in one place.
        </EmptyState.Description>
        <EmptyState.Actions className="mt-2 flex gap-2">
          <button className="rounded-[8px] bg-black px-3 py-1.5 text-sm font-medium text-white">
            Create project
          </button>
          <button className="rounded-[8px] border border-black px-3 py-1.5 text-sm font-medium text-black">
            Import
          </button>
        </EmptyState.Actions>
      </EmptyState.Root>
    </div>
  )
}
