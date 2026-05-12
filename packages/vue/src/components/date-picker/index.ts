import DatePickerRoot from './DatePickerRoot.vue';
import DatePickerTrigger from './DatePickerTrigger.vue';
import DatePickerValue from './DatePickerValue.vue';
import DatePickerContent from './DatePickerContent.vue';
import DatePickerCalendar from './DatePickerCalendar.vue';

export const DatePicker = {
	Root: DatePickerRoot,
	Trigger: DatePickerTrigger,
	Value: DatePickerValue,
	Content: DatePickerContent,
	Calendar: DatePickerCalendar,
};

export type {
	DatePickerRootProps,
	DatePickerTriggerProps,
	DatePickerValueProps,
	DatePickerContentProps,
} from './DatePicker.types';
