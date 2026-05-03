import ComboboxRoot from './ComboboxRoot.vue';
import ComboboxInput from './ComboboxInput.vue';
import ComboboxTrigger from './ComboboxTrigger.vue';
import ComboboxContent from './ComboboxContent.vue';
import ComboboxItems from './ComboboxItems.vue';
import ComboboxEmpty from './ComboboxEmpty.vue';

export const Combobox = {
	Root: ComboboxRoot,
	Input: ComboboxInput,
	Trigger: ComboboxTrigger,
	Content: ComboboxContent,
	Items: ComboboxItems,
	Empty: ComboboxEmpty,
};

export type {
	ComboboxRootProps,
	ComboboxInputProps,
	ComboboxTriggerProps,
	ComboboxContentProps,
	ComboboxEmptyProps,
	ComboboxItemRenderProps,
	ComboboxItemsProps,
	ComboboxOption,
} from './Combobox.types';
