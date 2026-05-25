export type StepperOrientation = 'horizontal' | 'vertical';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

export interface StepperContextValue {
	current: number;
	count: number;
	orientation: StepperOrientation;
	linear: boolean;
	goTo: (index: number) => void;
	next: () => void;
	prev: () => void;
	isActive: (index: number) => boolean;
	isCompleted: (index: number) => boolean;
}

export interface StepperItemContextValue {
	index: number;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

export interface StepperRootProps {
	class?: string;
	/** Total number of steps (used to clamp next/prev). */
	count: number;
	/** Controlled current step (0-based). */
	value?: number;
	/** Initial current step (uncontrolled). Default `0`. */
	defaultValue?: number;
	/** Called when the current step changes. */
	onChange?: (index: number) => void;
	/** Layout orientation. Default `'horizontal'`. */
	orientation?: StepperOrientation;
	/** Prevent jumping to steps ahead of the current one. Default `false`. */
	linear?: boolean;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

export interface StepperListProps {
	class?: string;
}

export interface StepperItemProps {
	class?: string;
	/** 0-based position of this step. */
	index: number;
}

export interface StepperTriggerProps {
	class?: string;
	disabled?: boolean;
}

export interface StepperSeparatorProps {
	class?: string;
}

export interface StepperContentProps {
	class?: string;
	/** Step index this panel belongs to. */
	index: number;
	/** Keep mounted when inactive. */
	forceMount?: boolean;
}

export interface StepperPrevTriggerProps {
	class?: string;
	disabled?: boolean;
}

export interface StepperNextTriggerProps {
	class?: string;
	disabled?: boolean;
}
