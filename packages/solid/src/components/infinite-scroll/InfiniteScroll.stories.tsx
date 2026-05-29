import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { createSignal, For } from 'solid-js';
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
					'A sentinel-based load-more primitive built on `createIntersectionObserver`. Render your list, then drop a `Sentinel` at the end — it calls `onLoadMore` as it scrolls into view (gated by `hasMore` / `loading`).',
			},
		},
	},
} satisfies Meta<typeof InfiniteScroll.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const PAGE = 20;
const TOTAL = 80;

// Shared simulated-pagination helper for the stories below.
function usePagedItems(page: number, total: number, delay = 600) {
	const [items, setItems] = createSignal(Array.from({ length: page }, (_, i) => i));
	const [loading, setLoading] = createSignal(false);
	let loadingRef = false;

	const loadMore = () => {
		if (loadingRef) return;
		loadingRef = true;
		setLoading(true);
		globalThis.setTimeout(() => {
			setItems((prev) => [...prev, ...Array.from({ length: page }, (_, i) => prev.length + i)]);
			setLoading(false);
			loadingRef = false;
		}, delay);
	};

	const hasMore = () => items().length < total;

	return { items, loading, loadMore, hasMore };
}

export const Default: Story = {
	render: () => {
		const { items, loading, loadMore, hasMore } = usePagedItems(PAGE, TOTAL);

		return (
			<InfiniteScroll.Root
				onLoadMore={loadMore}
				hasMore={hasMore()}
				loading={loading()}
				rootMargin='120px'
				class='h-80 w-72 overflow-auto rounded-xl border border-[#e5e7eb]'>
				<ul class='divide-y divide-[#f3f4f6]'>
					<For each={items()}>
						{(i) => <li class='px-4 py-3 text-sm text-black'>Item #{i + 1}</li>}
					</For>
				</ul>
				<InfiniteScroll.Loader class='py-4 text-center text-sm text-[#6b7280]'>
					Loading more…
				</InfiniteScroll.Loader>
				<InfiniteScroll.EndMessage class='py-4 text-center text-xs text-[#9ca3af]'>
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
				hasMore={hasMore()}
				loading={loading()}
				rootMargin='160px'
				class='h-96 w-80 overflow-auto rounded-xl border border-[#e5e7eb] p-3'>
				<div class='grid grid-cols-3 gap-2'>
					<For each={items()}>
						{(i) => (
							<div
								class='flex aspect-square items-center justify-center rounded-lg text-xs font-medium text-white'
								style={{ 'background-color': `hsl(${(i * 37) % 360} 65% 55%)` }}>
								{i + 1}
							</div>
						)}
					</For>
				</div>
				<InfiniteScroll.Loader class='flex justify-center py-4'>
					<span class='size-5 animate-spin rounded-full border-2 border-[#e5e7eb] border-t-black' />
				</InfiniteScroll.Loader>
				<InfiniteScroll.EndMessage class='py-4 text-center text-xs text-[#9ca3af]'>
					All {48} tiles loaded
				</InfiniteScroll.EndMessage>
				<InfiniteScroll.Sentinel class='h-px' />
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
				hasMore={hasMore()}
				loading={loading()}
				rootMargin='100px'
				class='h-[28rem] w-96 overflow-auto rounded-xl border border-[#e5e7eb] bg-white'>
				<header class='sticky top-0 border-b border-[#e5e7eb] bg-white/90 px-4 py-3 backdrop-blur'>
					<p class='text-sm font-semibold text-black'>Activity</p>
				</header>
				<ul class='divide-y divide-[#f3f4f6]'>
					<For each={items()}>
						{(i) => {
							const actor = actors[i % actors.length];
							return (
								<li class='flex items-start gap-3 px-4 py-3'>
									<span class='inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-black text-xs font-medium text-white'>
										{actor[0]}
									</span>
									<div class='min-w-0'>
										<p class='text-sm text-black'>
											<span class='font-medium'>{actor}</span> {verbs[i % verbs.length]}{' '}
											<span class='text-[#374151]'>PR #{1000 + i}</span>
										</p>
										<p class='text-xs text-[#9ca3af]'>{i + 1} minutes ago</p>
									</div>
								</li>
							);
						}}
					</For>
				</ul>
				<InfiniteScroll.Loader class='flex items-center justify-center gap-2 py-4 text-sm text-[#6b7280]'>
					<span class='size-4 animate-spin rounded-full border-2 border-[#e5e7eb] border-t-black' />
					Loading activity…
				</InfiniteScroll.Loader>
				<InfiniteScroll.EndMessage class='py-4 text-center text-xs text-[#9ca3af]'>
					You’re all caught up
				</InfiniteScroll.EndMessage>
				<InfiniteScroll.Sentinel />
			</InfiniteScroll.Root>
		);
	},
};
