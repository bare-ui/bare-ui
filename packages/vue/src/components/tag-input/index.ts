import TagInputRoot from './TagInputRoot.vue';
import TagInputList from './TagInputList.vue';
import TagInputItems from './TagInputItems.vue';
import TagInputField from './TagInputField.vue';

export const TagInput = {
	Root: TagInputRoot,
	List: TagInputList,
	Items: TagInputItems,
	Field: TagInputField,
};

export type { TagInputRootProps, TagInputListProps, TagInputFieldProps } from './TagInput.types';
