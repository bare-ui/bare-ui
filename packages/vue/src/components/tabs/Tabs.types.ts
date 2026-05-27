export type TabsOrientation = 'horizontal' | 'vertical';
export type TabsActivationMode = 'automatic' | 'manual';

export interface TabsRootProps {
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
	class?: string;
}

export interface TabsListProps {
	class?: string;
}

export interface TabsTriggerProps {
	/** Unique value identifying this tab. */
	value: string;
	/** Disable this tab. */
	disabled?: boolean;
	class?: string;
}

export interface TabsContentProps {
	/** The tab value this content panel is associated with. */
	value: string;
	/** When true, keep mounted in DOM and toggle visibility via data-state. */
	forceMount?: boolean;
	class?: string;
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
