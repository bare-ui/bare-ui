import { createEffect, createMemo, createSignal, onCleanup, For, splitProps, type JSX } from 'solid-js';
import { createMergedRefs } from '@/primitives/create-merged-refs';
import type { VirtualItem, VirtualizerRootProps } from './Virtualizer.types';

function Root(props: VirtualizerRootProps & { ref?: (el: HTMLDivElement) => void }) {
	const [local, rest] = splitProps(props, [
		'count',
		'estimateSize',
		'overscan',
		'orientation',
		'getItemKey',
		'class',
		'style',
		'children',
		'onScroll',
		'ref',
	]);

	const orientation = () => local.orientation ?? 'vertical';
	const estimateSize = () => local.estimateSize ?? 50;
	const overscan = () => local.overscan ?? 4;
	const isVertical = () => orientation() === 'vertical';

	let scrollEl: HTMLDivElement | undefined;
	const mergedRef = createMergedRefs<HTMLDivElement>(
		(el) => (scrollEl = el),
		(el) => local.ref?.(el),
	);

	// Plain mutable registries — survive re-renders without triggering effect loops.
	const measured = new Map<number, number>();
	const elements = new Map<number, HTMLElement>();
	let observer: ResizeObserver | null = null;

	// Bump to force the offsets memo to re-eval once a measured size changes.
	const [version, setVersion] = createSignal(0);
	const bumpVersion = () => setVersion((x) => x + 1);

	const [scrollOffset, setScrollOffset] = createSignal(0);
	const [viewport, setViewport] = createSignal(0);

	// Prefix-sum offsets; measured sizes take over from the estimate once known.
	const offsets = createMemo(() => {
		version(); // track
		const count = local.count;
		const est = estimateSize();
		const arr = new Array<number>(count + 1);
		arr[0] = 0;
		for (let i = 0; i < count; i++) {
			const m = measured.get(i);
			arr[i + 1] = arr[i] + (m && m > 0 ? m : est);
		}
		return arr;
	});

	const totalSize = () => offsets()[local.count] ?? 0;

	const virtualItems = createMemo<VirtualItem[]>(() => {
		const count = local.count;
		if (count === 0) return [];
		const off = offsets();
		const so = scrollOffset();
		const vp = viewport();
		const ov = overscan();

		let start = 0;
		while (start < count && off[start + 1] <= so) start++;
		let end = start;
		const limit = so + vp;
		while (end < count && off[end] < limit) end++;
		start = Math.max(0, start - ov);
		end = Math.min(count, end + ov);

		const items: VirtualItem[] = [];
		for (let index = start; index < end; index++) {
			items.push({ index, start: off[index], size: off[index + 1] - off[index] });
		}
		return items;
	});

	// Viewport size tracking along the scroll axis.
	createEffect(() => {
		const el = scrollEl;
		if (!el) return;
		const vertical = isVertical(); // track
		const update = () => setViewport(vertical ? el.clientHeight : el.clientWidth);
		update();
		if (typeof ResizeObserver === 'undefined') return;
		const ro = new ResizeObserver(update);
		ro.observe(el);
		onCleanup(() => ro.disconnect());
	});

	// Per-item measurement.
	createEffect(() => {
		const vertical = isVertical(); // track
		if (typeof ResizeObserver === 'undefined') return;
		const ro = new ResizeObserver((entries) => {
			let changed = false;
			for (const entry of entries) {
				const target = entry.target as HTMLElement;
				const index = Number(target.dataset.index);
				const size = vertical ? target.offsetHeight : target.offsetWidth;
				if (size > 0 && measured.get(index) !== size) {
					measured.set(index, size);
					changed = true;
				}
			}
			if (changed) bumpVersion();
		});
		observer = ro;
		// Re-observe any already-mounted items (e.g. after an orientation change).
		for (const node of elements.values()) ro.observe(node);
		onCleanup(() => {
			ro.disconnect();
			observer = null;
		});
	});

	const setItemRef = (index: number) => (node: HTMLElement | null) => {
		const ro = observer;
		const prev = elements.get(index);
		if (prev && prev !== node) {
			ro?.unobserve(prev);
			elements.delete(index);
		}
		if (node) {
			node.dataset.index = String(index);
			elements.set(index, node);
			ro?.observe(node);
		}
	};

	const handleScroll: JSX.EventHandler<HTMLDivElement, Event> = (e) => {
		const el = e.currentTarget;
		setScrollOffset(isVertical() ? el.scrollTop : el.scrollLeft);
		const userOnScroll = local.onScroll;
		if (typeof userOnScroll === 'function') {
			(userOnScroll as (event: typeof e) => void)(e);
		}
	};

	const rootStyle = (): JSX.CSSProperties => {
		const vertical = isVertical();
		const ours: JSX.CSSProperties = {
			position: 'relative',
			'overflow-y': vertical ? 'auto' : 'hidden',
			'overflow-x': vertical ? 'hidden' : 'auto',
		};
		const user = local.style;
		if (typeof user === 'string' || !user) return ours;
		return { ...ours, ...(user as JSX.CSSProperties) };
	};

	const sizerStyle = (): JSX.CSSProperties =>
		isVertical()
			? { position: 'relative', width: '100%', height: `${totalSize()}px` }
			: { position: 'relative', height: '100%', width: `${totalSize()}px` };

	const itemStyle = (item: VirtualItem): JSX.CSSProperties =>
		isVertical()
			? { position: 'absolute', top: `${item.start}px`, left: '0', width: '100%' }
			: { position: 'absolute', left: `${item.start}px`, top: '0', height: '100%' };

	return (
		<div
			ref={mergedRef}
			class={local.class}
			data-orientation={orientation()}
			style={rootStyle()}
			{...rest}
			onScroll={handleScroll}>
			<div
				data-virtualizer-sizer=''
				style={sizerStyle()}>
				<For each={virtualItems()}>
					{(item) => {
						// Honor getItemKey for parity with the React API (used as a stable
						// reorder hint). Solid's <For> reconciles by item identity.
						local.getItemKey?.(item.index);
						return (
							<div
								ref={setItemRef(item.index)}
								data-virtual-item=''
								data-index={item.index}
								style={itemStyle(item)}>
								{local.children(item)}
							</div>
						);
					}}
				</For>
			</div>
		</div>
	);
}

export const Virtualizer = {
	Root,
};
