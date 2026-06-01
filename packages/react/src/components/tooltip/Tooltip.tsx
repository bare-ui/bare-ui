import React, { createContext, useContext } from 'react';
import { useControllableState } from '@/hooks/use-controllable-state';
import { useId } from '@/hooks/use-id';
import { useTimeout } from '@/hooks/use-timeout';
import type { TooltipContextValue, TooltipRootProps, TooltipTriggerProps, TooltipContentProps } from './Tooltip.types';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const TooltipContext = createContext<TooltipContextValue>({
	open: false,
	setOpen: () => {},
	contentId: '',
});

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

const Root = ({
	open: controlledOpen,
	defaultOpen = false,
	onOpenChange,
	delayDuration = 300,
	children,
}: TooltipRootProps) => {
	const [open, setOpenState] = useControllableState({
		value: controlledOpen,
		defaultValue: defaultOpen,
		onChange: onOpenChange,
	});
	const { start, stop } = useTimeout(() => setOpenState(true), delayDuration, { autoStart: false });
	const contentId = useId('tooltip');

	const setOpen = (value: boolean) => {
		if (value) {
			start();
		} else {
			stop();
			setOpenState(false);
		}
	};

	return (
		<TooltipContext.Provider value={{ open, setOpen, contentId }}>
			<span style={{ position: 'relative', display: 'inline-block' }}>{children}</span>
		</TooltipContext.Provider>
	);
};

Root.displayName = 'Tooltip.Root';

// ---------------------------------------------------------------------------
// Trigger
// ---------------------------------------------------------------------------

const Trigger = React.forwardRef<HTMLSpanElement, TooltipTriggerProps>(
	({ children, onMouseEnter, onMouseLeave, onFocus, onBlur, ...rest }, ref) => {
		const { setOpen, contentId } = useContext(TooltipContext);

		return (
			<span
				ref={ref}
				aria-describedby={contentId}
				onMouseEnter={(e) => {
					setOpen(true);
					onMouseEnter?.(e);
				}}
				onMouseLeave={(e) => {
					setOpen(false);
					onMouseLeave?.(e);
				}}
				onFocus={(e) => {
					setOpen(true);
					onFocus?.(e);
				}}
				onBlur={(e) => {
					setOpen(false);
					onBlur?.(e);
				}}
				{...rest}>
				{children}
			</span>
		);
	},
);

Trigger.displayName = 'Tooltip.Trigger';

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

const Content = React.forwardRef<HTMLSpanElement, TooltipContentProps>(
	({ side = 'top', id, className, children, style, ...rest }, ref) => {
		const { open, contentId } = useContext(TooltipContext);

		const positionStyle: React.CSSProperties = {
			position: 'absolute',
			zIndex: 50,
			pointerEvents: 'none',
			...(side === 'top' && {
				bottom: '100%',
				left: '50%',
				transform: 'translateX(-50%)',
				marginBottom: 8,
			}),
			...(side === 'bottom' && {
				top: '100%',
				left: '50%',
				transform: 'translateX(-50%)',
				marginTop: 8,
			}),
			...(side === 'left' && {
				right: '100%',
				top: '50%',
				transform: 'translateY(-50%)',
				marginRight: 8,
			}),
			...(side === 'right' && {
				left: '100%',
				top: '50%',
				transform: 'translateY(-50%)',
				marginLeft: 8,
			}),
		};

		return (
			<span
				ref={ref}
				id={id ?? contentId}
				role='tooltip'
				data-state={open ? 'open' : 'closed'}
				data-side={side}
				className={className}
				style={{ ...positionStyle, ...style }}
				{...rest}>
				{children}
			</span>
		);
	},
);

Content.displayName = 'Tooltip.Content';

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const Tooltip = { Root, Trigger, Content };

// Named exports expose the sub-components to Storybook's react-docgen (public API stays `Tooltip.*`).
export { Root, Trigger, Content };
