import { inject, type InjectionKey } from 'vue'
import type { TagInputContextValue } from './TagInput.types'

export const TagInputKey: InjectionKey<TagInputContextValue> = Symbol('TagInputContext')

export function useTagInputContext() {
	const ctx = inject(TagInputKey)
	if (!ctx) throw new Error('TagInput compound components must be used within TagInput.Root')
	return ctx
}
