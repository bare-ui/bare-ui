import { inject, type InjectionKey } from 'vue';
import type { RichTextContextValue } from './RichText.types';

export const RichTextKey: InjectionKey<RichTextContextValue> = Symbol('RichTextContext');

export function useRichTextContext() {
	const ctx = inject(RichTextKey);
	if (!ctx) throw new Error('RichText sub-components must be used within RichText.Root');
	return ctx;
}
