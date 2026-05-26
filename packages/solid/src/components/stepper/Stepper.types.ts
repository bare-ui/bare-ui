import type { JSX } from 'solid-js';

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

export interface StepperRootProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onChange'> {
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

export type StepperListProps = JSX.HTMLAttributes<HTMLDivElement>;

export interface StepperItemProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** 0-based position of this step. */
	index: number;
}

export type StepperTriggerProps = JSX.ButtonHTMLAttributes<HTMLButtonElement>;

export type StepperSeparatorProps = JSX.HTMLAttributes<HTMLDivElement>;

export interface StepperContentProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Step index this panel belongs to. */
	index: number;
	/** Keep mounted when inactive. */
	forceMount?: boolean;
}

export type StepperPrevTriggerProps = JSX.ButtonHTMLAttributes<HTMLButtonElement>;

export type StepperNextTriggerProps = JSX.ButtonHTMLAttributes<HTMLButtonElement>;
