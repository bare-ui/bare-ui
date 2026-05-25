import { inject, type InjectionKey } from 'vue';
import type { TypewriterContextValue } from './Typewriter.types';

export const TypewriterKey: InjectionKey<TypewriterContextValue> = Symbol('TypewriterContext');

export function useTypewriterContext() {
	const ctx = inject(TypewriterKey);
	if (!ctx) throw new Error('Typewriter.Text/Cursor must be used within Typewriter.Root');
	return ctx;
}
