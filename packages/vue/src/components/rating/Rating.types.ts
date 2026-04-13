export interface RatingProps {
	value?: number;
	defaultValue?: number;
	onChange?: (value: number) => void;
	max?: number;
	disabled?: boolean;
	readOnly?: boolean;
	starClassName?: string;
	class?: string;
}
