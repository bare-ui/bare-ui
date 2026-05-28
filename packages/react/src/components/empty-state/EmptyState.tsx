import React from 'react';
import type {
	EmptyStateActionsProps,
	EmptyStateDescriptionProps,
	EmptyStateMediaProps,
	EmptyStateRootProps,
	EmptyStateTitleProps,
} from './EmptyState.types';

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

const Root = React.forwardRef<HTMLDivElement, EmptyStateRootProps>(({ className, children, ...rest }, ref) => (
	<div
		ref={ref}
		role='status'
		className={className}
		{...rest}>
		{children}
	</div>
));

Root.displayName = 'EmptyState.Root';

// ---------------------------------------------------------------------------
// Media (icon / illustration slot)
// ---------------------------------------------------------------------------

const Media = React.forwardRef<HTMLDivElement, EmptyStateMediaProps>(({ className, children, ...rest }, ref) => (
	<div
		ref={ref}
		aria-hidden='true'
		className={className}
		{...rest}>
		{children}
	</div>
));

Media.displayName = 'EmptyState.Media';

// ---------------------------------------------------------------------------
// Title
// ---------------------------------------------------------------------------

const Title = React.forwardRef<HTMLHeadingElement, EmptyStateTitleProps>(({ className, children, ...rest }, ref) => (
	<h3
		ref={ref}
		className={className}
		{...rest}>
		{children}
	</h3>
));

Title.displayName = 'EmptyState.Title';

// ---------------------------------------------------------------------------
// Description
// ---------------------------------------------------------------------------

const Description = React.forwardRef<HTMLParagraphElement, EmptyStateDescriptionProps>(
	({ className, children, ...rest }, ref) => (
		<p
			ref={ref}
			className={className}
			{...rest}>
			{children}
		</p>
	),
);

Description.displayName = 'EmptyState.Description';

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

const Actions = React.forwardRef<HTMLDivElement, EmptyStateActionsProps>(({ className, children, ...rest }, ref) => (
	<div
		ref={ref}
		className={className}
		{...rest}>
		{children}
	</div>
));

Actions.displayName = 'EmptyState.Actions';

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const EmptyState = {
	Root,
	Media,
	Title,
	Description,
	Actions,
};

// Named exports expose the sub-components to Storybook's react-docgen (public API stays `EmptyState.*`).
export { Root, Media, Title, Description, Actions };
