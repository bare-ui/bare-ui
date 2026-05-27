import { inject, type InjectionKey } from 'vue';
import type { TabsContextValue } from './Tabs.types';

export const TabsKey: InjectionKey<TabsContextValue> = Symbol('TabsContext');

export function useTabsContext() {
	const ctx = inject(TabsKey);
	if (!ctx) throw new Error('Tabs compound components must be used within Tabs.Root');
	return ctx;
}
