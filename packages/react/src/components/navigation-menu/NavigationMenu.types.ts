import React from 'react';

export interface NavigationMenuRootProps
	extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange' | 'defaultValue'> {
	/** Controlled open item value. */
	value?: string | null;
	/** Initial open item (uncontrolled). */
	defaultValue?: string | null;
	/** Called when the open item changes. */
	onValueChange?: (value: string | null) => void;
	/** Open delay (ms) when hovering a trigger. Default 100. */
	delayDuration?: number;
	/** Time (ms) the user has to move from trigger → content before it closes. Default 300. */
	skipDelayDuration?: number;
}

export type NavigationMenuListProps = React.HTMLAttributes<HTMLUListElement>;

export interface NavigationMenuItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
	/** Unique identifier for this item. Required only if it has Trigger/Content children. */
	value?: string;
}

export interface NavigationMenuTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	disabled?: boolean;
}

export type NavigationMenuContentProps = React.HTMLAttributes<HTMLDivElement>;

export interface NavigationMenuLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
	active?: boolean;
}

export interface NavigationMenuRootContextValue {
	value: string | null;
	setValue: (value: string | null) => void;
	delayDuration: number;
	skipDelayDuration: number;
	/** Cancel any pending close. Called when cursor enters a Trigger or Content. */
	cancelClose: () => void;
	/** Schedule a close after `skipDelayDuration`. Called when cursor leaves a Trigger or Content. */
	scheduleClose: () => void;
}

export interface NavigationMenuItemContextValue {
	value: string;
}
