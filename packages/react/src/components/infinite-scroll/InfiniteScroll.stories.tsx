import { useCallback, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { InfiniteScroll } from './InfiniteScroll';

const meta = {
	title: 'Layout/InfiniteScroll',
	component: InfiniteScroll.Root,
	subcomponents: {
		'InfiniteScroll.Sentinel': InfiniteScroll.Sentinel,
		'InfiniteScroll.Loader': InfiniteScroll.Loader,
		'InfiniteScroll.EndMessage': InfiniteScroll.EndMessage,
	},
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

// Shared simulated-pagination hook for the stories below.
function usePagedItems(page: number, total: number, delay = 600) {
	const [items, setItems] = useState(() => Array.from({ length: page }, (_, i) => i));
	const [loading, setLoading] = useState(false);
	const loadingRef = useRef(false);

	const loadMore = useCallback(() => {
		if (loadingRef.current) return;
		loadingRef.current = true;
		setLoading(true);
		globalThis.setTimeout(() => {
			setItems((prev) => [...prev, ...Array.from({ length: page }, (_, i) => prev.length + i)]);
			setLoading(false);
			loadingRef.current = false;
		}, delay);
	}, [page, delay]);

	return { items, loading, loadMore, hasMore: items.length < total };
}

export const Default: Story = {
	render: () => {
		const { items, loading, loadMore, hasMore } = usePagedItems(PAGE, TOTAL);

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

export const Composed: Story = {
	render: () => {
		const { items, loading, loadMore, hasMore } = usePagedItems(12, 48, 700);

		return (
			<InfiniteScroll.Root
				onLoadMore={loadMore}
				hasMore={hasMore}
				loading={loading}
				rootMargin='160px'
				className='h-96 w-80 overflow-auto rounded-xl border border-[#e5e7eb] p-3'>
				<div className='grid grid-cols-3 gap-2'>
					{items.map((i) => (
						<div
							key={i}
							className='flex aspect-square items-center justify-center rounded-lg text-xs font-medium text-white'
							style={{ backgroundColor: `hsl(${(i * 37) % 360} 65% 55%)` }}>
							{i + 1}
						</div>
					))}
				</div>
				<InfiniteScroll.Loader className='flex justify-center py-4'>
					<span className='size-5 animate-spin rounded-full border-2 border-[#e5e7eb] border-t-black' />
				</InfiniteScroll.Loader>
				<InfiniteScroll.EndMessage className='py-4 text-center text-xs text-[#9ca3af]'>
					All {48} tiles loaded
				</InfiniteScroll.EndMessage>
				<InfiniteScroll.Sentinel className='h-px' />
			</InfiniteScroll.Root>
		);
	},
};

export const Complex: Story = {
	render: () => {
		const { items, loading, loadMore, hasMore } = usePagedItems(8, 40, 800);
		const actors = ['Ada', 'Grace', 'Alan', 'Katherine', 'Linus'];
		const verbs = ['commented on', 'merged', 'opened', 'closed', 'reviewed'];

		return (
			<InfiniteScroll.Root
				onLoadMore={loadMore}
				hasMore={hasMore}
				loading={loading}
				rootMargin='100px'
				className='h-[28rem] w-96 overflow-auto rounded-xl border border-[#e5e7eb] bg-white'>
				<header className='sticky top-0 border-b border-[#e5e7eb] bg-white/90 px-4 py-3 backdrop-blur'>
					<p className='text-sm font-semibold text-black'>Activity</p>
				</header>
				<ul className='divide-y divide-[#f3f4f6]'>
					{items.map((i) => {
						const actor = actors[i % actors.length];
						return (
							<li
								key={i}
								className='flex items-start gap-3 px-4 py-3'>
								<span className='inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-black text-xs font-medium text-white'>
									{actor[0]}
								</span>
								<div className='min-w-0'>
									<p className='text-sm text-black'>
										<span className='font-medium'>{actor}</span> {verbs[i % verbs.length]}{' '}
										<span className='text-[#374151]'>PR #{1000 + i}</span>
									</p>
									<p className='text-xs text-[#9ca3af]'>{i + 1} minutes ago</p>
								</div>
							</li>
						);
					})}
				</ul>
				<InfiniteScroll.Loader className='flex items-center justify-center gap-2 py-4 text-sm text-[#6b7280]'>
					<span className='size-4 animate-spin rounded-full border-2 border-[#e5e7eb] border-t-black' />
					Loading activity…
				</InfiniteScroll.Loader>
				<InfiniteScroll.EndMessage className='py-4 text-center text-xs text-[#9ca3af]'>
					You’re all caught up
				</InfiniteScroll.EndMessage>
				<InfiniteScroll.Sentinel />
			</InfiniteScroll.Root>
		);
	},
};
