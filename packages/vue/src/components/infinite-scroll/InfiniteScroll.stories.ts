import { h, ref } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { InfiniteScroll } from '.';

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
	render: () => ({
		setup() {
			const items = ref(Array.from({ length: PAGE }, (_, i) => i));
			const loading = ref(false);
			let loadingFlag = false;

			function loadMore() {
				if (loadingFlag) return;
				loadingFlag = true;
				loading.value = true;
				globalThis.setTimeout(() => {
					items.value = [...items.value, ...Array.from({ length: PAGE }, (_, i) => items.value.length + i)];
					loading.value = false;
					loadingFlag = false;
				}, 600);
			}

			return () => {
				const hasMore = items.value.length < TOTAL;
				return h(
					InfiniteScroll.Root,
					{
						onLoadMore: loadMore,
						hasMore,
						loading: loading.value,
						rootMargin: '120px',
						class: 'h-80 w-72 overflow-auto rounded-xl border border-[#e5e7eb]',
					},
					() => [
						h(
							'ul',
							{ class: 'divide-y divide-[#f3f4f6]' },
							items.value.map((i) =>
								h('li', { key: i, class: 'px-4 py-3 text-sm text-black' }, `Item #${i + 1}`),
							),
						),
						h(
							InfiniteScroll.Loader,
							{ class: 'py-4 text-center text-sm text-[#6b7280]' },
							() => 'Loading more…',
						),
						h(
							InfiniteScroll.EndMessage,
							{ class: 'py-4 text-center text-xs text-[#9ca3af]' },
							() => "You’ve reached the end",
						),
						h(InfiniteScroll.Sentinel),
					],
				);
			};
		},
	}),
};
