import { createContext, createMemo, For, splitProps, useContext, type JSX } from 'solid-js';
import { createControllableState } from '@/primitives/create-controllable-state';
import { createInteractiveState } from '@/primitives/create-interactive-state';
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
	if (!ctx) throw new Error('Pagination compound components must be used within Pagination.Root');
	return ctx;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

function Root(props: PaginationRootProps) {
	const [local, rest] = splitProps(props, [
		'totalPages',
		'page',
		'defaultPage',
		'onChange',
		'siblingCount',
		'boundaryCount',
		'children',
		'class',
		'aria-label',
	]);

	const [page, setPage] = createControllableState<number>({
		get value() {
			return local.page;
		},
		defaultValue: local.defaultPage ?? 1,
		onChange: local.onChange,
	});
	const totalPages = () => local.totalPages;
	const ariaLabel = () => local['aria-label'] ?? 'Pagination';

	const goTo = (next: number) => {
		const clamped = Math.min(Math.max(next, 1), Math.max(totalPages(), 1));
		if (clamped === page()) return;
		setPage(clamped);
	};

	const prev = () => goTo(page() - 1);
	const next = () => goTo(page() + 1);

	const items = createMemo(() =>
		getPaginationItems(totalPages(), page(), local.siblingCount ?? 1, local.boundaryCount ?? 1),
	);

	const ctxValue: PaginationContextValue = {
		get page() {
			return page();
		},
		get totalPages() {
			return totalPages();
		},
		get items() {
			return items();
		},
		get canPrev() {
			return page() > 1;
		},
		get canNext() {
			return page() < totalPages();
		},
		goTo,
		prev,
		next,
	};

	return (
		<PaginationContext.Provider value={ctxValue}>
			<nav
				aria-label={ariaLabel()}
				class={local.class}
				{...rest}>
				{local.children}
			</nav>
		</PaginationContext.Provider>
	);
}

// ---------------------------------------------------------------------------
// Items render-prop — emits the computed item sequence
// ---------------------------------------------------------------------------

interface PaginationItemsProps {
	children: (item: PaginationItemValue, index: number) => JSX.Element;
}

function Items(props: PaginationItemsProps) {
	const ctx = usePaginationContext();
	return (
		<For each={ctx.items}>
			{(item, i) => {
				// eslint-disable-next-line solid/reactivity
				return props.children(item, i());
			}}
		</For>
	);
}

// ---------------------------------------------------------------------------
// Subcomponents
// ---------------------------------------------------------------------------

function List(props: PaginationListProps) {
	const [local, rest] = splitProps(props, ['children', 'class']);
	return (
		<ul
			class={local.class}
			{...rest}>
			{local.children}
		</ul>
	);
}

function Item(props: PaginationItemProps) {
	const [local, rest] = splitProps(props, ['page', 'disabled', 'children', 'class', 'onClick']);
	const ctx = usePaginationContext();
	const state = createInteractiveState({
		get disabled() {
			return !!local.disabled;
		},
	});

	const active = () => ctx.page === local.page;

	const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
		ctx.goTo(local.page);
		const userOnClick = local.onClick;
		if (typeof userOnClick === 'function') {
			// onClick on li bubbles from the button. We treat it as a "click on the page button".
			(userOnClick as (event: MouseEvent) => void)(e);
		}
	};

	return (
		<li
			class={local.class}
			{...rest}>
			<button
				type='button'
				disabled={local.disabled}
				aria-current={active() ? 'page' : undefined}
				aria-label={`Page ${local.page}`}
				data-active={active() ? '' : undefined}
				{...state.dataAttributes}
				onMouseEnter={state.handlers.onMouseEnter}
				onMouseLeave={state.handlers.onMouseLeave}
				onPointerDown={state.handlers.onPointerDown}
				onPointerUp={state.handlers.onPointerUp}
				onFocus={state.handlers.onFocus}
				onBlur={state.handlers.onBlur}
				onKeyDown={state.handlers.onKeyDown}
				onKeyUp={state.handlers.onKeyUp}
				onClick={handleClick}>
				{local.children ?? local.page}
			</button>
		</li>
	);
}

function Ellipsis(props: PaginationEllipsisProps) {
	const [local, rest] = splitProps(props, ['children', 'class']);
	return (
		<li
			role='presentation'
			aria-hidden='true'
			class={local.class}
			{...rest}>
			{local.children ?? '…'}
		</li>
	);
}

function makeNavButton(direction: 'prev' | 'next', label: string) {
	return function NavButton(props: PaginationButtonProps) {
		const [local, rest] = splitProps(props, ['disabled', 'children', 'class', 'onClick']);
		const ctx = usePaginationContext();
		const isDisabled = () =>
			!!local.disabled || (direction === 'prev' ? !ctx.canPrev : !ctx.canNext);
		const state = createInteractiveState({
			get disabled() {
				return isDisabled();
			},
		});
		const merged = mergeProps(rest, state.handlers);

		const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
			if (direction === 'prev') ctx.prev();
			else ctx.next();
			const userOnClick = local.onClick;
			if (typeof userOnClick === 'function') {
				(userOnClick as (event: typeof e) => void)(e);
			}
		};

		return (
			<button
				type='button'
				disabled={isDisabled()}
				aria-label={label}
				class={local.class}
				{...state.dataAttributes}
				{...merged}
				onClick={handleClick}>
				{local.children}
			</button>
		);
	};
}

const Previous = makeNavButton('prev', 'Previous page');
const Next = makeNavButton('next', 'Next page');

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const Pagination = { Root, List, Items, Item, Previous, Next, Ellipsis };
