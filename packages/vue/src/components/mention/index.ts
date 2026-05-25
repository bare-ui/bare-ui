import MentionRoot from './MentionRoot.vue';
import MentionInput from './MentionInput.vue';
import MentionContent from './MentionContent.vue';
import MentionItems from './MentionItems.vue';
import MentionEmpty from './MentionEmpty.vue';

export const Mention = {
	Root: MentionRoot,
	Input: MentionInput,
	Content: MentionContent,
	Items: MentionItems,
	Empty: MentionEmpty,
};

export type {
	MentionRootProps,
	MentionInputProps,
	MentionContentProps,
	MentionItemsProps,
	MentionEmptyProps,
	MentionOption,
	MentionItemRenderProps,
	MentionCoords,
} from './Mention.types';
