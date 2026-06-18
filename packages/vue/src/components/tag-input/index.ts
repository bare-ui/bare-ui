import TagInputRoot from './TagInputRoot.vue';
import TagInputList from './TagInputList.vue';
import TagInputItems from './TagInputItems.vue';
import TagInputTag from './TagInputTag.vue';
import TagInputField from './TagInputField.vue';

export const TagInput = {
	Root: TagInputRoot,
	List: TagInputList,
	Items: TagInputItems,
	Tag: TagInputTag,
	Field: TagInputField,
};

export type { TagInputRootProps, TagInputListProps, TagInputFieldProps } from './TagInput.types';
