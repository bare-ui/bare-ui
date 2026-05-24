import React, { useCallback, useMemo, useReducer, useRef, useState } from 'react';
import { useIsomorphicLayoutEffect } from '@/hooks/use-isomorphic-layout-effect';
import { useMergedRefs } from '@/hooks/use-merged-refs';
import type { VirtualItem, VirtualizerRootProps } from './Virtualizer.types';

const Root = React.forwardRef<HTMLDivElement, VirtualizerRootProps>(
	(
		{
			count,
			estimateSize = 50,
			overscan = 4,
			orientation = 'vertical',
			getItemKey,
			className,
			style,
			children,
			...rest
		},
		ref,
	) => {
		const isVertical = orientation === 'vertical';
		const scrollRef = useRef<HTMLDivElement | null>(null);
		const mergedRef = useMergedRefs(scrollRef, ref);

		const measuredRef = useRef<Map<number, number>>(new Map());
		const elementsRef = useRef<Map<number, HTMLElement>>(new Map());
		const observerRef = useRef<ResizeObserver | null>(null);
		const [version, bumpVersion] = useReducer((x: number) => x + 1, 0);

		const [scrollOffset, setScrollOffset] = useState(0);
		const [viewport, setViewport] = useState(0);

		// Prefix-sum offsets; measured sizes take over from the estimate once known.
		const offsets = useMemo(() => {
			const arr = new Array<number>(count + 1);
			arr[0] = 0;
			for (let i = 0; i < count; i++) {
				const m = measuredRef.current.get(i);
				arr[i + 1] = arr[i] + (m && m > 0 ? m : estimateSize);
			}
			return arr;
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [count, estimateSize, version]);

		const totalSize = offsets[count] ?? 0;

		const virtualItems = useMemo<VirtualItem[]>(() => {
			if (count === 0) return [];
			let start = 0;
			while (start < count && offsets[start + 1] <= scrollOffset) start++;
			let end = start;
			const limit = scrollOffset + viewport;
			while (end < count && offsets[end] < limit) end++;
			start = Math.max(0, start - overscan);
			end = Math.min(count, end + overscan);

			const items: VirtualItem[] = [];
			for (let index = start; index < end; index++) {
				items.push({ index, start: offsets[index], size: offsets[index + 1] - offsets[index] });
			}
			return items;
		}, [count, offsets, scrollOffset, viewport, overscan]);

		useIsomorphicLayoutEffect(() => {
			const el = scrollRef.current;
			if (!el) return;
			const update = () => setViewport(isVertical ? el.clientHeight : el.clientWidth);
			update();
			if (typeof ResizeObserver === 'undefined') return;
			const ro = new ResizeObserver(update);
			ro.observe(el);
			return () => ro.disconnect();
		}, [isVertical]);

		useIsomorphicLayoutEffect(() => {
			if (typeof ResizeObserver === 'undefined') return;
			const ro = new ResizeObserver((entries) => {
				let changed = false;
				for (const entry of entries) {
					const target = entry.target as HTMLElement;
					const index = Number(target.dataset.index);
					const size = isVertical ? target.offsetHeight : target.offsetWidth;
					if (size > 0 && measuredRef.current.get(index) !== size) {
						measuredRef.current.set(index, size);
						changed = true;
					}
				}
				if (changed) bumpVersion();
			});
			observerRef.current = ro;
			return () => {
				ro.disconnect();
				observerRef.current = null;
			};
		}, [isVertical]);

		const setItemRef = useCallback(
			(index: number) => (node: HTMLElement | null) => {
				const ro = observerRef.current;
				const prev = elementsRef.current.get(index);
				if (prev && prev !== node) {
					ro?.unobserve(prev);
					elementsRef.current.delete(index);
				}
				if (node) {
					node.dataset.index = String(index);
					elementsRef.current.set(index, node);
					ro?.observe(node);
				}
			},
			[],
		);

		const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
			const el = e.currentTarget;
			setScrollOffset(isVertical ? el.scrollTop : el.scrollLeft);
			rest.onScroll?.(e);
		};

		return (
			<div
				ref={mergedRef}
				className={className}
				data-orientation={orientation}
				style={{
					position: 'relative',
					overflowY: isVertical ? 'auto' : 'hidden',
					overflowX: isVertical ? 'hidden' : 'auto',
					...style,
				}}
				{...rest}
				onScroll={handleScroll}>
				<div
					data-virtualizer-sizer=''
					style={
						isVertical ?
							{ position: 'relative', width: '100%', height: totalSize }
						:	{ position: 'relative', height: '100%', width: totalSize }
					}>
					{virtualItems.map((item) => (
						<div
							key={getItemKey ? getItemKey(item.index) : item.index}
							ref={setItemRef(item.index)}
							data-virtual-item=''
							data-index={item.index}
							style={
								isVertical ?
									{ position: 'absolute', top: item.start, left: 0, width: '100%' }
								:	{ position: 'absolute', left: item.start, top: 0, height: '100%' }
							}>
							{children(item)}
						</div>
					))}
				</div>
			</div>
		);
	},
);

Root.displayName = 'Virtualizer.Root';

export const Virtualizer = {
	Root,
};
