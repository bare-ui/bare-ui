export type ToggleOrientation = 'horizontal' | 'vertical';

// ---------------------------------------------------------------------------
// Toggle (standalone, or group-aware via `value`)
// ---------------------------------------------------------------------------

export interface ToggleProps {
	/** Controlled pressed state (standalone use). */
	pressed?: boolean;
	/** Initial pressed state (uncontrolled, standalone use). */
	defaultPressed?: boolean;
	/** Called when the pressed state changes (standalone use). */
	onPressedChange?: (pressed: boolean) => void;
	/** Identity within a `ToggleGroup.Root`. When set inside a group, the group owns the pressed state. */
	value?: string;
	disabled?: boolean;
	class?: string;
}

// ---------------------------------------------------------------------------
// ToggleGroup context
// ---------------------------------------------------------------------------

export interface ToggleGroupContextValue {
	isPressed: (value: string) => boolean;
	toggle: (value: string) => void;
	disabled: boolean;
	orientation: ToggleOrientation;
	rovingFocus: boolean;
	isTabbable: (id: string) => boolean;
	register: (id: string, el: HTMLElement) => () => void;
	onItemFocus: (id: string) => void;
	onItemKeyDown: (event: KeyboardEvent) => void;
}

// ---------------------------------------------------------------------------
// ToggleGroup.Root — single vs multiple
// ---------------------------------------------------------------------------

interface ToggleGroupBaseProps {
	/** Disable the whole group. */
	disabled?: boolean;
	/** Layout + arrow-key axis. Default `'horizontal'`. */
	orientation?: ToggleOrientation;
	/** Wrap arrow-key focus. Default `true`. */
	loop?: boolean;
	/** Manage focus as a single tab stop with arrow-key navigation. Default `true`. */
	rovingFocus?: boolean;
	class?: string;
}

export interface ToggleGroupSingleProps extends ToggleGroupBaseProps {
	type: 'single';
	/** Controlled selected value (`null` when none). */
	value?: string | null;
	/** Initial selected value (uncontrolled). */
	defaultValue?: string | null;
	/** Called when the selection changes. */
	onChange?: (value: string | null) => void;
}

export interface ToggleGroupMultipleProps extends ToggleGroupBaseProps {
	type: 'multiple';
	/** Controlled selected values. */
	value?: string[];
	/** Initial selected values (uncontrolled). */
	defaultValue?: string[];
	/** Called when the selection changes. */
	onChange?: (value: string[]) => void;
}

export type ToggleGroupRootProps = ToggleGroupSingleProps | ToggleGroupMultipleProps;
