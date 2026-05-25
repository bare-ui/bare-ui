import { inject, type InjectionKey } from 'vue'
import type { MentionContextValue } from './Mention.types'

export const MentionKey: InjectionKey<MentionContextValue> = Symbol('MentionContext')

export function useMentionContext() {
	const ctx = inject(MentionKey)
	if (!ctx) throw new Error('Mention sub-components must be used within Mention.Root')
	return ctx
}
