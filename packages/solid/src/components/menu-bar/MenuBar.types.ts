import type { JSX } from 'solid-js';

export interface MenuBarRootProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
	/** Controlled active menu id (open menu). */
	value?: string | null;
	/** Initial open menu (uncontrolled). */
	defaultValue?: string | null;
	/** Called when the open menu changes. */
	onValueChange?: (value: string | null) => void;
}

export interface MenuBarMenuProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Unique id for this menu (matches Root's `value`). */
	value: string;
}

export interface MenuBarTriggerProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
	disabled?: boolean;
}

export type MenuBarContentProps = JSX.HTMLAttributes<HTMLDivElement>;

export interface MenuBarItemProps extends JSX.HTMLAttributes<HTMLDivElement> {
	disabled?: boolean;
	onSelect?: () => void;
}

export type MenuBarSeparatorProps = JSX.HTMLAttributes<HTMLDivElement>;

export interface MenuBarContextValue {
	readonly openMenu: string | null;
	setOpenMenu: (value: string | null) => void;
	registerMenu: (id: string) => void;
	unregisterMenu: (id: string) => void;
	getMenuOrder: () => string[];
}

export interface MenuBarMenuContextValue {
	readonly value: string;
	readonly open: boolean;
	close: () => void;
	open_: () => void;
	toggle: () => void;
}
