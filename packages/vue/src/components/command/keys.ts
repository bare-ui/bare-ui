import { inject, type InjectionKey } from 'vue';
import type { CommandContextValue, CommandGroupContextValue } from './Command.types';

export const CommandKey: InjectionKey<CommandContextValue> = Symbol('CommandContext');
export const CommandGroupKey: InjectionKey<CommandGroupContextValue> = Symbol('CommandGroupContext');

export function useCommandContext(): CommandContextValue {
	const ctx = inject(CommandKey);
	if (!ctx) throw new Error('Command sub-components must be used within Command.Root');
	return ctx;
}

export function useCommandGroupContext(): CommandGroupContextValue | undefined {
	return inject(CommandGroupKey, undefined);
}
