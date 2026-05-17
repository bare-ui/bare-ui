'use client'

import { useState } from 'react'
import { FileUpload } from '@wire-ui/react'

const dropzoneCls =
  'flex flex-col items-center justify-center gap-2 rounded-[20px] border border-dashed border-black bg-[#f5f5f5] p-8 text-center text-sm text-black cursor-pointer transition-colors hover:bg-[#e5e5e5] data-[dragging]:bg-[#e5e5e5] data-[dragging]:border-solid data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed'

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function FileUploadPreview() {
  const [files, setFiles] = useState<File[]>([])
  return (
    <div className="p-6 w-full max-w-md mx-auto">
      <FileUpload.Root value={files} onChange={setFiles} multiple accept="image/*" maxSize={2 * 1024 * 1024}>
        <FileUpload.Input />
        <FileUpload.Dropzone className={dropzoneCls}>
          <svg className="size-8 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 7.5m0 0L7.5 12M12 7.5v9"
            />
          </svg>
          <p className="font-medium">Click or drag images here</p>
          <p className="text-xs text-[#6b7280]">PNG / JPG · max 2 MB each</p>
        </FileUpload.Dropzone>
        <ul className="mt-3 flex flex-col gap-1 text-sm">
          <FileUpload.Items>
            {(file, i, remove) => (
              <li
                key={i}
                className="flex items-center justify-between rounded-[8px] border border-black bg-white px-3 py-2"
              >
                <div className="flex flex-col">
                  <span className="truncate font-medium text-black">{file.name}</span>
                  <span className="text-xs text-[#6b7280]">{formatBytes(file.size)}</span>
                </div>
                <button onClick={remove} className="text-sm text-black hover:underline" aria-label={`Remove ${file.name}`}>
                  ×
                </button>
              </li>
            )}
          </FileUpload.Items>
        </ul>
      </FileUpload.Root>
    </div>
  )
}
