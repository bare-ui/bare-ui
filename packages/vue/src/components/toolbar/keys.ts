import { inject, type InjectionKey } from 'vue';
import type { ToolbarContextValue } from './Toolbar.types';

export const ToolbarKey: InjectionKey<ToolbarContextValue> = Symbol('ToolbarContext');

export function useToolbarContext(): ToolbarContextValue {
	const ctx = inject(ToolbarKey);
	if (!ctx) throw new Error('Toolbar sub-components must be used within Toolbar.Root');
	return ctx;
}
