import CheckboxRoot from './CheckboxRoot.vue';
import CheckboxItem from './CheckboxItem.vue';
import CheckboxIndicator from './CheckboxIndicator.vue';
import CheckboxLabel from './CheckboxLabel.vue';

export const Checkbox = { Root: CheckboxRoot, Item: CheckboxItem, Indicator: CheckboxIndicator, Label: CheckboxLabel };
export type {
	CheckboxRootProps,
	CheckboxItemProps,
	CheckboxIndicatorProps,
	CheckboxLabelProps,
} from './Checkbox.types';
