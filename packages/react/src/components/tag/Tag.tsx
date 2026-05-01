import React from 'react';
import { useInteractiveState } from '@/hooks/use-interactive-state';
import { mergeProps } from '@/utils/merge-props';
import type { TagLabelProps, TagRemoveProps, TagRootProps } from './Tag.types';

const Root = React.forwardRef<HTMLSpanElement, TagRootProps>(
	({ disabled = false, className, children, ...rest }, ref) => (
		<span
			ref={ref}
			className={className}
			data-disabled={disabled ? '' : undefined}
			{...rest}>
			{children}
		</span>
	),
);
Root.displayName = 'Tag.Root';

const Label = React.forwardRef<HTMLSpanElement, TagLabelProps>(({ className, children, ...rest }, ref) => (
	<span
		ref={ref}
		className={className}
		{...rest}>
		{children}
	</span>
));
Label.displayName = 'Tag.Label';

const Remove = React.forwardRef<HTMLButtonElement, TagRemoveProps>(
	({ className, children, 'aria-label': ariaLabel = 'Remove', ...rest }, ref) => {
		const { handlers, dataAttributes } = useInteractiveState();
		const merged = mergeProps(rest as Record<string, unknown>, handlers as Record<string, unknown>);

		return (
			<button
				ref={ref}
				type='button'
				aria-label={ariaLabel}
				className={className}
				{...dataAttributes}
				{...merged}>
				{children}
			</button>
		);
	},
);
Remove.displayName = 'Tag.Remove';

export const Tag = { Root, Label, Remove };
