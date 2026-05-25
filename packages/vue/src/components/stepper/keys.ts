import { inject, type InjectionKey } from 'vue';
import type { StepperContextValue, StepperItemContextValue } from './Stepper.types';

export const StepperKey: InjectionKey<StepperContextValue> = Symbol('StepperContext');
export const StepperItemKey: InjectionKey<StepperItemContextValue> = Symbol('StepperItemContext');

export function useStepperContext() {
	const ctx = inject(StepperKey);
	if (!ctx) throw new Error('Stepper sub-components must be used within Stepper.Root');
	return ctx;
}

export function useStepperItemContext() {
	const ctx = inject(StepperItemKey);
	if (!ctx) throw new Error('Stepper.Trigger must be used within Stepper.Item');
	return ctx;
}
