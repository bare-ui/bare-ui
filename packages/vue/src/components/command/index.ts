import CommandRoot from './CommandRoot.vue';
import CommandInput from './CommandInput.vue';
import CommandList from './CommandList.vue';
import CommandGroup from './CommandGroup.vue';
import CommandItem from './CommandItem.vue';
import CommandSeparator from './CommandSeparator.vue';
import CommandEmpty from './CommandEmpty.vue';

export const Command = {
	Root: CommandRoot,
	Input: CommandInput,
	List: CommandList,
	Group: CommandGroup,
	Item: CommandItem,
	Separator: CommandSeparator,
	Empty: CommandEmpty,
};

export type {
	CommandRootProps,
	CommandInputProps,
	CommandListProps,
	CommandGroupProps,
	CommandItemProps,
	CommandSeparatorProps,
	CommandEmptyProps,
	CommandFilter,
} from './Command.types';
