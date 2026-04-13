import SearchRoot from './SearchRoot.vue';
import SearchInput from './SearchInput.vue';
import SearchContent from './SearchContent.vue';
import SearchItem from './SearchItem.vue';
import SearchEmpty from './SearchEmpty.vue';

export const Search = { Root: SearchRoot, Input: SearchInput, Content: SearchContent, Item: SearchItem, Empty: SearchEmpty };
export type {
	SearchRootProps,
	SearchInputProps,
	SearchContentProps,
	SearchItemProps,
	SearchEmptyProps,
	SearchOption,
	SearchContextValue,
} from './Search.types';
