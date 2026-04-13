import RadioRoot from './RadioRoot.vue';
import RadioItem from './RadioItem.vue';
import RadioIndicator from './RadioIndicator.vue';
import RadioLabel from './RadioLabel.vue';

export const Radio = { Root: RadioRoot, Item: RadioItem, Indicator: RadioIndicator, Label: RadioLabel };
export type {
	RadioRootProps,
	RadioItemProps,
	RadioIndicatorProps,
	RadioLabelProps,
} from './Radio.types';
