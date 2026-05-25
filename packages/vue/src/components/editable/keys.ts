import { inject, type InjectionKey } from 'vue';
import type { EditableContextValue } from './Editable.types';

export const EditableKey: InjectionKey<EditableContextValue> = Symbol('EditableContext');

export function useEditableContext() {
	const ctx = inject(EditableKey);
	if (!ctx) throw new Error('Editable sub-components must be used within Editable.Root');
	return ctx;
}
