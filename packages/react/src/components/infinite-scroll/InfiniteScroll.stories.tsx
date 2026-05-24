import { useCallback, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { InfiniteScroll } from './InfiniteScroll';

const meta = {
	title: 'Layout/InfiniteScroll',
	component: InfiniteScroll.Root,
	tags: ['autodocs'],
	args: { onLoadMore: () => {} },
	parameters: {
		docs: {
			description: {
				component:
					'A sentinel-based load-more primitive built on `useIntersectionObserver`. Render your list, then drop a `Sentinel` at the end — it calls `onLoadMore` as it scrolls into view (gated by `hasMore` / `loading`).',
			},
		},
	},
} satisfies Meta<typeof InfiniteScroll.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const PAGE = 20;
const TOTAL = 80;

export const Default: Story = {
	render: () => {
		const [items, setItems] = useState(() => Array.from({ length: PAGE }, (_, i) => i));
		const [loading, setLoading] = useState(false);
		const loadingRef = useRef(false);

		const loadMore = useCallback(() => {
			if (loadingRef.current) return;
			loadingRef.current = true;
			setLoading(true);
			globalThis.setTimeout(() => {
				setItems((prev) => [...prev, ...Array.from({ length: PAGE }, (_, i) => prev.length + i)]);
				setLoading(false);
				loadingRef.current = false;
			}, 600);
		}, []);

		const hasMore = items.length < TOTAL;

		return (
			<InfiniteScroll.Root
				onLoadMore={loadMore}
				hasMore={hasMore}
				loading={loading}
				rootMargin='120px'
				className='h-80 w-72 overflow-auto rounded-xl border border-[#e5e7eb]'>
				<ul className='divide-y divide-[#f3f4f6]'>
					{items.map((i) => (
						<li
							key={i}
							className='px-4 py-3 text-sm text-black'>
							Item #{i + 1}
						</li>
					))}
				</ul>
				<InfiniteScroll.Loader className='py-4 text-center text-sm text-[#6b7280]'>
					Loading more…
				</InfiniteScroll.Loader>
				<InfiniteScroll.EndMessage className='py-4 text-center text-xs text-[#9ca3af]'>
					You’ve reached the end
				</InfiniteScroll.EndMessage>
				<InfiniteScroll.Sentinel />
			</InfiniteScroll.Root>
		);
	},
};
