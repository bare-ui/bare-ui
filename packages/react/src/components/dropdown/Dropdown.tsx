import React, { createContext, useContext, useRef } from 'react';
import { useClickOutside } from '@/hooks/use-click-outside';
import { useControllableState } from '@/hooks/use-controllable-state';
import { useInteractiveState } from '@/hooks/use-interactive-state';
import { useKeyboard } from '@/hooks/use-keyboard';
import { useMergedRefs } from '@/hooks/use-merged-refs';
import { mergeProps } from '@/utils/merge-props';
import type {
	DropdownContextValue,
	DropdownMenuProps,
	DropdownRootProps,
	DropdownTriggerProps,
} from './Dropdown.types';

const DropdownContext = createContext<DropdownContextValue | null>(null);

function useDropdownContext() {
	const context = useContext(DropdownContext);
	if (!context) {
		throw new globalThis.Error('Dropdown compound components must be used within Dropdown.Root');
	}
	return context;
}

const Root = React.forwardRef<HTMLDivElement, DropdownRootProps>(
	({ open: controlledOpen, defaultOpen = false, onOpenChange, children, className, ...rest }, ref) => {
		const [open, setOpen] = useControllableState({
			value: controlledOpen,
			defaultValue: defaultOpen,
			onChange: onOpenChange,
		});

		const rootRef = useRef<HTMLDivElement | null>(null);
		const mergedRef = useMergedRefs<HTMLDivElement>(rootRef, ref);

		useClickOutside(rootRef, () => {
			if (open) setOpen(false);
		});

		useKeyboard(
			{
				Escape: () => {
					if (open) setOpen(false);
				},
			},
			{ event: 'keyup' },
		);

		return (
			<DropdownContext.Provider value={{ open, onOpenChange: setOpen as (value: boolean) => void }}>
				<div
					ref={mergedRef}
					className={className}
					{...rest}>
					{children}
				</div>
			</DropdownContext.Provider>
		);
	},
);

Root.displayName = 'Dropdown.Root';

const Trigger = React.forwardRef<HTMLButtonElement, DropdownTriggerProps>(({ children, className, ...rest }, ref) => {
	const { open, onOpenChange } = useDropdownContext();
	const { handlers, dataAttributes } = useInteractiveState();

	const merged = mergeProps(rest as Record<string, unknown>, handlers as Record<string, unknown>);

	return (
		<button
			ref={ref}
			type='button'
			className={className}
			aria-expanded={open}
			data-state={open ? 'open' : 'closed'}
			{...dataAttributes}
			{...merged}
			onClick={(e) => {
				onOpenChange(!open);
				(rest.onClick as ((e: React.MouseEvent<HTMLButtonElement>) => void) | undefined)?.(e);
			}}>
			{children}
		</button>
	);
});

Trigger.displayName = 'Dropdown.Trigger';

const Menu = React.forwardRef<HTMLDivElement, DropdownMenuProps>(({ position, children, className, ...rest }, ref) => {
	const { open } = useDropdownContext();

	if (!open) return null;

	return (
		<div
			ref={ref}
			role='menu'
			className={className}
			data-state={open ? 'open' : 'closed'}
			data-position={position}
			{...rest}>
			{children}
		</div>
	);
});

Menu.displayName = 'Dropdown.Menu';

export const Dropdown = {
	Root,
	Trigger,
	Menu,
};
