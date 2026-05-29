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

export const Default: Story = {
	render: () => {
		const [items, setItems] = createSignal(Array.from({ length: PAGE }, (_, i) => i));
		const [loading, setLoading] = createSignal(false);
		let loadingRef = false;

		const loadMore = () => {
			if (loadingRef) return;
			loadingRef = true;
			setLoading(true);
			globalThis.setTimeout(() => {
				setItems((prev) => [...prev, ...Array.from({ length: PAGE }, (_, i) => prev.length + i)]);
				setLoading(false);
				loadingRef = false;
			}, 600);
		};

		const hasMore = () => items().length < TOTAL;

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
