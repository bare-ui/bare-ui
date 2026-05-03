import NumberInputRoot from './NumberInputRoot.vue';
import NumberInputField from './NumberInputField.vue';
import NumberInputIncrement from './NumberInputIncrement.vue';
import NumberInputDecrement from './NumberInputDecrement.vue';

export const NumberInput = {
	Root: NumberInputRoot,
	Field: NumberInputField,
	Increment: NumberInputIncrement,
	Decrement: NumberInputDecrement,
};

export type {
	NumberInputRootProps,
	NumberInputFieldProps,
	NumberInputIncrementProps,
	NumberInputDecrementProps,
} from './NumberInput.types';
