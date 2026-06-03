'use client';

import React, { createContext, useContext } from 'react';
import { useControllableState } from '@/hooks/use-controllable-state';
import { useInteractiveState } from '@/hooks/use-interactive-state';
import { mergeProps } from '@/utils/merge-props';
import type { SwitchContextValue, SwitchRootProps, SwitchThumbProps } from './Switch.types';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const SwitchContext = createContext<SwitchContextValue>({ checked: false, disabled: false });

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

const Root = React.forwardRef<HTMLButtonElement, SwitchRootProps>(
	(
		{
			checked: controlledChecked,
			defaultChecked = false,
			onChange,
			disabled = false,
			className,
			children,
			onClick,
			...rest
		},
		ref,
	) => {
		const [checked, setChecked] = useControllableState({
			value: controlledChecked,
			defaultValue: defaultChecked,
			onChange,
		});

		const { handlers, dataAttributes } = useInteractiveState({ disabled });
		const merged = mergeProps(rest as Record<string, unknown>, handlers as Record<string, unknown>);

		const toggle = () => {
			if (disabled) return;
			setChecked(!checked);
		};

		return (
			<SwitchContext.Provider value={{ checked, disabled }}>
				<button
					ref={ref}
					type='button'
					role='switch'
					aria-checked={checked}
					disabled={disabled}
					className={className}
					data-checked={checked ? '' : undefined}
					{...dataAttributes}
					{...merged}
					onClick={(e) => {
						toggle();
						onClick?.(e);
					}}>
					{children}
				</button>
			</SwitchContext.Provider>
		);
	},
);

Root.displayName = 'Switch.Root';

// ---------------------------------------------------------------------------
// Thumb
// ---------------------------------------------------------------------------

const Thumb = React.forwardRef<HTMLSpanElement, SwitchThumbProps>(({ className, ...rest }, ref) => {
	const { checked, disabled } = useContext(SwitchContext);

	return (
		<span
			ref={ref}
			className={className}
			data-checked={checked ? '' : undefined}
			data-disabled={disabled ? '' : undefined}
			{...rest}
		/>
	);
});

Thumb.displayName = 'Switch.Thumb';

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const Switch = { Root, Thumb };

// Named exports expose the sub-components to Storybook's react-docgen (public API stays `Switch.*`).
export { Root, Thumb };
