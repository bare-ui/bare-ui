import StepperRoot from './StepperRoot.vue';
import StepperList from './StepperList.vue';
import StepperItem from './StepperItem.vue';
import StepperTrigger from './StepperTrigger.vue';
import StepperSeparator from './StepperSeparator.vue';
import StepperContent from './StepperContent.vue';
import StepperPrevTrigger from './StepperPrevTrigger.vue';
import StepperNextTrigger from './StepperNextTrigger.vue';

export const Stepper = {
	Root: StepperRoot,
	List: StepperList,
	Item: StepperItem,
	Trigger: StepperTrigger,
	Separator: StepperSeparator,
	Content: StepperContent,
	PrevTrigger: StepperPrevTrigger,
	NextTrigger: StepperNextTrigger,
};

export type {
	StepperRootProps,
	StepperListProps,
	StepperItemProps,
	StepperTriggerProps,
	StepperSeparatorProps,
	StepperContentProps,
	StepperPrevTriggerProps,
	StepperNextTriggerProps,
	StepperOrientation,
} from './Stepper.types';
