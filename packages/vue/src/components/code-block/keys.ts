import { inject, type InjectionKey } from 'vue';
import type { CodeBlockContextValue } from './CodeBlock.types';

export const CodeBlockKey: InjectionKey<CodeBlockContextValue> = Symbol('CodeBlockContext');

export function useCodeBlockContext(): CodeBlockContextValue {
	const ctx = inject(CodeBlockKey);
	if (!ctx) throw new Error('CodeBlock sub-components must be used within CodeBlock.Root');
	return ctx;
}
