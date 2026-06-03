'use client';

import React, { createContext, useCallback, useContext, useId } from 'react';
import { useControllableState } from '@/hooks/use-controllable-state';
import { useInteractiveState } from '@/hooks/use-interactive-state';
import type {
	RadioContextValue,
	RadioIndicatorProps,
	RadioItemContextValue,
	RadioItemProps,
	RadioLabelProps,
	RadioRootProps,
} from './Radio.types';

const RadioContext = createContext<RadioContextValue | null>(null);
const RadioItemContext = createContext<RadioItemContextValue | null>(null);

function useRadioContext() {
	const context = useContext(RadioContext);
	if (!context) {
		throw new globalThis.Error('Radio compound components must be used within Radio.Root');
	}
	return context;
}

function useRadioItemContext() {
	const context = useContext(RadioItemContext);
	if (!context) {
		throw new globalThis.Error('Radio.Indicator/Label must be used within Radio.Item');
	}
	return context;
}

const Root = React.forwardRef<HTMLDivElement, RadioRootProps>(
	(
		{
			value: controlledValue,
			defaultValue,
			onChange,
			name,
			children,
			className,
			...rest
		},
		ref,
	) => {
		const [selectedValue, setSelectedValue] = useControllableState<string | number>({
			value: controlledValue,
			defaultValue,
			onChange,
		});

		// SSR-stable group name: useId() matches across server/client so the
		// rendered name="" on each radio input is identical during hydration.
		const generatedName = useId();
		const groupName = name || generatedName;

		const isSelected = useCallback(
			(itemValue: string | number) => {
				if (selectedValue === undefined || selectedValue === null) return false;
				return String(selectedValue) === String(itemValue);
			},
			[selectedValue],
		);

		const select = useCallback(
			(itemValue: string | number) => {
				setSelectedValue(itemValue);
			},
			[setSelectedValue],
		);

		return (
			<RadioContext.Provider value={{ selectedValue, name: groupName, select, isSelected }}>
				<div
					ref={ref}
					role='radiogroup'
					className={className}
					{...rest}>
					{children}
				</div>
			</RadioContext.Provider>
		);
	},
);

Root.displayName = 'Radio.Root';

const Item = React.forwardRef<HTMLInputElement, RadioItemProps>(
	({ value, disabled = false, children, className, onClick, id, ...rest }, ref) => {
		const ctx = useRadioContext();
		const checked = ctx.isSelected(value);
		const { handlers, dataAttributes } = useInteractiveState({ disabled });
		const generatedId = useId();
		const inputId = id || generatedId;

		return (
			<RadioItemContext.Provider value={{ value, disabled, checked, inputId }}>
				<div
					className={className}
					data-checked={checked ? '' : undefined}
					{...dataAttributes}
					onMouseEnter={handlers.onMouseEnter}
					onMouseLeave={handlers.onMouseLeave}
					onPointerDown={handlers.onPointerDown}
					onPointerUp={handlers.onPointerUp}
					onClick={(e) => {
						if (!disabled) ctx.select(value);
						onClick?.(e);
					}}
					{...rest}>
					<input
						ref={ref}
						id={inputId}
						type='radio'
						name={ctx.name}
						value={String(value)}
						checked={checked}
						disabled={disabled}
						onChange={() => ctx.select(value)}
						onFocus={handlers.onFocus}
						onBlur={handlers.onBlur}
						onKeyDown={handlers.onKeyDown}
						onKeyUp={handlers.onKeyUp}
						style={{
							position: 'absolute',
							opacity: 0,
							pointerEvents: 'none',
							width: 0,
							height: 0,
						}}
					/>
					{children}
				</div>
			</RadioItemContext.Provider>
		);
	},
);

Item.displayName = 'Radio.Item';

const Indicator = React.forwardRef<HTMLSpanElement, RadioIndicatorProps>(({ children, className, ...rest }, ref) => {
	const { checked } = useRadioItemContext();

	if (!checked) return null;

	return (
		<span
			ref={ref}
			className={className}
			data-checked=''
			{...rest}>
			{children}
		</span>
	);
});

Indicator.displayName = 'Radio.Indicator';

const Label = React.forwardRef<HTMLLabelElement, RadioLabelProps>(({ children, className, htmlFor, ...rest }, ref) => {
	const { disabled, inputId } = useRadioItemContext();

	return (
		<label
			ref={ref}
			htmlFor={htmlFor ?? inputId}
			className={className}
			data-disabled={disabled ? '' : undefined}
			{...rest}>
			{children}
		</label>
	);
});

Label.displayName = 'Radio.Label';

export const Radio = {
	Root,
	Item,
	Indicator,
	Label,
};

// Named exports expose the sub-components to Storybook's react-docgen (public API stays `Radio.*`).
export { Root, Item, Indicator, Label };
