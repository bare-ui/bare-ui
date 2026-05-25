import { inject, type InjectionKey } from 'vue';
import type { ColorPickerContextValue } from './ColorPicker.types';

export const ColorPickerKey: InjectionKey<ColorPickerContextValue> = Symbol('ColorPickerContext');

export function useColorPickerContext() {
	const ctx = inject(ColorPickerKey);
	if (!ctx) throw new Error('ColorPicker sub-components must be used within ColorPicker.Root');
	return ctx;
}
