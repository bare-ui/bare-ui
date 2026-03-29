import React, { createContext, useContext, useState } from 'react';
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
		const [uncontrolledChecked, setUncontrolledChecked] = useState(defaultChecked);
		const isControlled = controlledChecked !== undefined;
		const checked = isControlled ? controlledChecked : uncontrolledChecked;

		const { handlers, dataAttributes } = useInteractiveState({ disabled });
		const merged = mergeProps(rest as Record<string, unknown>, handlers as Record<string, unknown>);

		const toggle = () => {
			if (disabled) return;
			if (!isControlled) setUncontrolledChecked((prev) => !prev);
			onChange?.(!checked);
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
