import StatRoot from './StatRoot.vue';
import StatLabel from './StatLabel.vue';
import StatValue from './StatValue.vue';
import StatDelta from './StatDelta.vue';
import StatHelpText from './StatHelpText.vue';
import StatSparkline from './StatSparkline.vue';

export const Stat = {
	Root: StatRoot,
	Label: StatLabel,
	Value: StatValue,
	Delta: StatDelta,
	HelpText: StatHelpText,
	Sparkline: StatSparkline,
};

export type {
	StatRootProps,
	StatLabelProps,
	StatValueProps,
	StatDeltaProps,
	StatHelpTextProps,
	StatSparklineProps,
	StatDirection,
} from './Stat.types';
