import { inject, type InjectionKey } from 'vue'
import type { FileUploadContextValue } from './FileUpload.types'

export const FileUploadKey: InjectionKey<FileUploadContextValue> = Symbol('FileUploadContext')

export function useFileUploadContext() {
	const ctx = inject(FileUploadKey)
	if (!ctx) throw new Error('FileUpload compound components must be used within FileUpload.Root')
	return ctx
}
