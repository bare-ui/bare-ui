import React from 'react';

export type TabsOrientation = 'horizontal' | 'vertical';
export type TabsActivationMode = 'automatic' | 'manual';

export interface TabsRootProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
	/** Controlled active tab value. */
	value?: string;
	/** Initial active tab value (uncontrolled). */
	defaultValue?: string;
	/** Called when the active tab changes. */
	onChange?: (value: string) => void;
	/** Layout orientation; controls arrow-key navigation. */
	orientation?: TabsOrientation;
	/**
	 * `automatic` (default): focusing a trigger activates it.
	 * `manual`: user must press Enter/Space to activate.
	 */
	activationMode?: TabsActivationMode;
}

export type TabsListProps = React.HTMLAttributes<HTMLDivElement>;

export interface TabsTriggerProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
	/** Unique value identifying this tab. */
	value: string;
	/** Disable this tab. */
	disabled?: boolean;
}

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
	/** The tab value this content panel is associated with. */
	value: string;
	/** When true, keep mounted in DOM and toggle visibility via data-state. */
	forceMount?: boolean;
}

export interface TabsContextValue {
	value: string;
	setValue: (value: string) => void;
	orientation: TabsOrientation;
	activationMode: TabsActivationMode;
	registerTrigger: (value: string, el: HTMLButtonElement | null) => void;
	getTriggerOrder: () => string[];
	baseId: string;
}
