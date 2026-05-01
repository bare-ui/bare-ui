import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useInteractiveState } from '@/hooks/use-interactive-state';
import { mergeProps } from '@/utils/merge-props';
import type {
	PaginationButtonProps,
	PaginationContextValue,
	PaginationEllipsisProps,
	PaginationItemProps,
	PaginationItemValue,
	PaginationListProps,
	PaginationRootProps,
} from './Pagination.types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function range(start: number, end: number): number[] {
	const out: number[] = [];
	for (let i = start; i <= end; i++) out.push(i);
	return out;
}

/**
 * Build the list of items: a mix of page numbers and 'ellipsis' markers.
 * Mirrors the MUI / shadcn behavior.
 */
export function getPaginationItems(
	totalPages: number,
	page: number,
	siblingCount = 1,
	boundaryCount = 1,
): PaginationItemValue[] {
	if (totalPages <= 1) return totalPages === 1 ? [1] : [];

	const startPages = range(1, Math.min(boundaryCount, totalPages));
	const endPages = range(Math.max(totalPages - boundaryCount + 1, boundaryCount + 1), totalPages);

	const siblingsStart = Math.max(
		Math.min(page - siblingCount, totalPages - boundaryCount - siblingCount * 2 - 1),
		boundaryCount + 2,
	);
	const siblingsEnd = Math.min(
		Math.max(page + siblingCount, boundaryCount + siblingCount * 2 + 2),
		endPages.length > 0 ? endPages[0] - 2 : totalPages - 1,
	);

	const items: PaginationItemValue[] = [
		...startPages,
		...(siblingsStart > boundaryCount + 2
			? (['ellipsis'] as const)
			: boundaryCount + 1 < totalPages - boundaryCount
				? [boundaryCount + 1]
				: []),
		...range(siblingsStart, siblingsEnd),
		...(siblingsEnd < totalPages - boundaryCount - 1
			? (['ellipsis'] as const)
			: totalPages - boundaryCount > boundaryCount
				? [totalPages - boundaryCount]
				: []),
		...endPages,
	];

	return items;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const PaginationContext = createContext<PaginationContextValue | null>(null);

function usePaginationContext() {
	const ctx = useContext(PaginationContext);
	if (!ctx) throw new globalThis.Error('Pagination compound components must be used within Pagination.Root');
	return ctx;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

const Root = React.forwardRef<HTMLElement, PaginationRootProps>(
	(
		{
			totalPages,
			page: controlledPage,
			defaultPage = 1,
			onChange,
			siblingCount = 1,
			boundaryCount = 1,
			children,
			className,
			'aria-label': ariaLabel = 'Pagination',
			...rest
		},
		ref,
	) => {
		const [uncontrolled, setUncontrolled] = useState<number>(defaultPage);
		const isControlled = controlledPage !== undefined;
		const page = isControlled ? (controlledPage as number) : uncontrolled;

		const goTo = useCallback(
			(next: number) => {
				const clamped = Math.min(Math.max(next, 1), Math.max(totalPages, 1));
				if (clamped === page) return;
				if (!isControlled) setUncontrolled(clamped);
				onChange?.(clamped);
			},
			[isControlled, onChange, page, totalPages],
		);

		const prev = useCallback(() => goTo(page - 1), [goTo, page]);
		const next = useCallback(() => goTo(page + 1), [goTo, page]);

		const items = useMemo(
			() => getPaginationItems(totalPages, page, siblingCount, boundaryCount),
			[totalPages, page, siblingCount, boundaryCount],
		);

		const ctx = useMemo<PaginationContextValue>(
			() => ({
				page,
				totalPages,
				items,
				canPrev: page > 1,
				canNext: page < totalPages,
				goTo,
				prev,
				next,
			}),
			[page, totalPages, items, goTo, prev, next],
		);

		return (
			<PaginationContext.Provider value={ctx}>
				<nav
					ref={ref}
					aria-label={ariaLabel}
					className={className}
					{...rest}>
					{children}
				</nav>
			</PaginationContext.Provider>
		);
	},
);
Root.displayName = 'Pagination.Root';

// ---------------------------------------------------------------------------
// Items render-prop — emits the computed item sequence
// ---------------------------------------------------------------------------

interface PaginationItemsProps {
	children: (item: PaginationItemValue, index: number) => React.ReactNode;
}

const Items: React.FC<PaginationItemsProps> = ({ children }) => {
	const ctx = usePaginationContext();
	return <>{ctx.items.map((item, i) => children(item, i))}</>;
};
Items.displayName = 'Pagination.Items';

// ---------------------------------------------------------------------------
// Subcomponents
// ---------------------------------------------------------------------------

const List = React.forwardRef<HTMLUListElement, PaginationListProps>(({ children, className, ...rest }, ref) => (
	<ul
		ref={ref}
		className={className}
		{...rest}>
		{children}
	</ul>
));
List.displayName = 'Pagination.List';

const Item = React.forwardRef<HTMLLIElement, PaginationItemProps>(
	({ page, disabled = false, children, className, onClick, ...rest }, ref) => {
		const ctx = usePaginationContext();
		const { handlers, dataAttributes } = useInteractiveState({ disabled });
		const merged = mergeProps({ onClick } as Record<string, unknown>, handlers as Record<string, unknown>);
		const active = ctx.page === page;

		return (
			<li ref={ref} className={className} {...rest}>
				<button
					type='button'
					disabled={disabled}
					aria-current={active ? 'page' : undefined}
					aria-label={`Page ${page}`}
					data-active={active ? '' : undefined}
					{...dataAttributes}
					{...(merged as React.ButtonHTMLAttributes<HTMLButtonElement>)}
					onClick={(e) => {
						ctx.goTo(page);
						(merged as { onClick?: React.MouseEventHandler<HTMLButtonElement> }).onClick?.(e);
					}}>
					{children ?? page}
				</button>
			</li>
		);
	},
);
Item.displayName = 'Pagination.Item';

const Ellipsis = React.forwardRef<HTMLLIElement, PaginationEllipsisProps>(
	({ children = '…', className, ...rest }, ref) => (
		<li
			ref={ref}
			role='presentation'
			aria-hidden='true'
			className={className}
			{...rest}>
			{children}
		</li>
	),
);
Ellipsis.displayName = 'Pagination.Ellipsis';

function makeNavButton(direction: 'prev' | 'next', label: string, displayName: string) {
	const Component = React.forwardRef<HTMLButtonElement, PaginationButtonProps>(
		({ disabled = false, children, className, onClick, ...rest }, ref) => {
			const ctx = usePaginationContext();
			const isDisabled = disabled || (direction === 'prev' ? !ctx.canPrev : !ctx.canNext);
			const { handlers, dataAttributes } = useInteractiveState({ disabled: isDisabled });
			const merged = mergeProps(rest as Record<string, unknown>, handlers as Record<string, unknown>);

			return (
				<button
					ref={ref}
					type='button'
					disabled={isDisabled}
					aria-label={label}
					className={className}
					{...dataAttributes}
					{...merged}
					onClick={(e) => {
						if (direction === 'prev') ctx.prev();
						else ctx.next();
						onClick?.(e);
					}}>
					{children}
				</button>
			);
		},
	);
	Component.displayName = displayName;
	return Component;
}

const Previous = makeNavButton('prev', 'Previous page', 'Pagination.Previous');
const Next = makeNavButton('next', 'Next page', 'Pagination.Next');

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const Pagination = { Root, List, Items, Item, Previous, Next, Ellipsis };
