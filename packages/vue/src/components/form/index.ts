import FormRoot from './FormRoot.vue';
import FormField from './FormField.vue';
import FormLabel from './FormLabel.vue';
import FormControl from './FormControl.vue';
import FormDescription from './FormDescription.vue';
import FormError from './FormError.vue';

export const Form = {
	Root: FormRoot,
	Field: FormField,
	Label: FormLabel,
	Control: FormControl,
	Description: FormDescription,
	Error: FormError,
};

export type {
	FormRootProps,
	FormFieldProps,
	FormLabelProps,
	FormControlProps,
	FormDescriptionProps,
	FormErrorProps,
} from './Form.types';
