import SelectRoot from './SelectRoot.vue';
import SelectTrigger from './SelectTrigger.vue';
import SelectValue from './SelectValue.vue';
import SelectContent from './SelectContent.vue';
import SelectItem from './SelectItem.vue';
import SelectSeparator from './SelectSeparator.vue';
import SelectGroup from './SelectGroup.vue';
import SelectGroupLabel from './SelectGroupLabel.vue';

export const Select = { Root: SelectRoot, Trigger: SelectTrigger, Value: SelectValue, Content: SelectContent, Item: SelectItem, Separator: SelectSeparator, Group: SelectGroup, GroupLabel: SelectGroupLabel };
export type {
	SelectRootProps,
	SelectTriggerProps,
	SelectValueProps,
	SelectContentProps,
	SelectItemProps,
	SelectSeparatorProps,
	SelectGroupProps,
	SelectGroupLabelProps,
	SelectContextValue,
} from './Select.types';
