import Toggle from './Toggle.vue';
import ToggleGroupRoot from './ToggleGroupRoot.vue';

export { Toggle };

export const ToggleGroup = {
	Root: ToggleGroupRoot,
};

export type {
	ToggleProps,
	ToggleGroupRootProps,
	ToggleGroupSingleProps,
	ToggleGroupMultipleProps,
	ToggleOrientation,
	ToggleGroupContextValue,
} from './Toggle.types';
