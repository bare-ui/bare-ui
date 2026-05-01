import React from 'react';

export interface MenuBarRootProps
	extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
	/** Controlled active menu id (open menu). */
	value?: string | null;
	/** Initial open menu (uncontrolled). */
	defaultValue?: string | null;
	/** Called when the open menu changes. */
	onValueChange?: (value: string | null) => void;
}

export interface MenuBarMenuProps extends React.HTMLAttributes<HTMLDivElement> {
	/** Unique id for this menu (matches Root's `value`). */
	value: string;
}

export interface MenuBarTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	disabled?: boolean;
}

export type MenuBarContentProps = React.HTMLAttributes<HTMLDivElement>;

export interface MenuBarItemProps extends React.HTMLAttributes<HTMLDivElement> {
	disabled?: boolean;
	onSelect?: () => void;
}

export type MenuBarSeparatorProps = React.HTMLAttributes<HTMLDivElement>;

export interface MenuBarContextValue {
	openMenu: string | null;
	setOpenMenu: (value: string | null) => void;
	registerMenu: (id: string) => void;
	unregisterMenu: (id: string) => void;
	getMenuOrder: () => string[];
}

export interface MenuBarMenuContextValue {
	value: string;
	open: boolean;
	close: () => void;
	open_: () => void;
	toggle: () => void;
}
