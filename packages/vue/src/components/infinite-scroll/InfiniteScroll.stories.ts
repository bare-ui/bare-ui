import { h, ref } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { InfiniteScroll } from '.';

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

// Shared simulated-pagination helper for the stories below.
function usePagedItems(page: number, total: number, delay = 600) {
	const items = ref(Array.from({ length: page }, (_, i) => i));
	const loading = ref(false);
	let loadingFlag = false;

	function loadMore() {
		if (loadingFlag) return;
		loadingFlag = true;
		loading.value = true;
		globalThis.setTimeout(() => {
			items.value = [...items.value, ...Array.from({ length: page }, (_, i) => items.value.length + i)];
			loading.value = false;
			loadingFlag = false;
		}, delay);
	}

	return { items, loading, loadMore, total };
}

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

export const Composed: Story = {
	render: () => ({
		setup() {
			const { items, loading, loadMore, total } = usePagedItems(12, 48, 700);

			return () => {
				const hasMore = items.value.length < total;
				return h(
					InfiniteScroll.Root,
					{
						onLoadMore: loadMore,
						hasMore,
						loading: loading.value,
						rootMargin: '160px',
						class: 'h-96 w-80 overflow-auto rounded-xl border border-[#e5e7eb] p-3',
					},
					() => [
						h(
							'div',
							{ class: 'grid grid-cols-3 gap-2' },
							items.value.map((i) =>
								h(
									'div',
									{
										key: i,
										class: 'flex aspect-square items-center justify-center rounded-lg text-xs font-medium text-white',
										style: { backgroundColor: `hsl(${(i * 37) % 360} 65% 55%)` },
									},
									`${i + 1}`,
								),
							),
						),
						h(InfiniteScroll.Loader, { class: 'flex justify-center py-4' }, () => [
							h('span', {
								class: 'size-5 animate-spin rounded-full border-2 border-[#e5e7eb] border-t-black',
							}),
						]),
						h(
							InfiniteScroll.EndMessage,
							{ class: 'py-4 text-center text-xs text-[#9ca3af]' },
							() => `All ${48} tiles loaded`,
						),
						h(InfiniteScroll.Sentinel, { class: 'h-px' }),
					],
				);
			};
		},
	}),
};

const actors = ['Ada', 'Grace', 'Alan', 'Katherine', 'Linus'];
const verbs = ['commented on', 'merged', 'opened', 'closed', 'reviewed'];

export const Complex: Story = {
	render: () => ({
		setup() {
			const { items, loading, loadMore, total } = usePagedItems(8, 40, 800);

			return () => {
				const hasMore = items.value.length < total;
				return h(
					InfiniteScroll.Root,
					{
						onLoadMore: loadMore,
						hasMore,
						loading: loading.value,
						rootMargin: '100px',
						class: 'h-[28rem] w-96 overflow-auto rounded-xl border border-[#e5e7eb] bg-white',
					},
					() => [
						h(
							'header',
							{
								class: 'sticky top-0 border-b border-[#e5e7eb] bg-white/90 px-4 py-3 backdrop-blur',
							},
							[h('p', { class: 'text-sm font-semibold text-black' }, 'Activity')],
						),
						h(
							'ul',
							{ class: 'divide-y divide-[#f3f4f6]' },
							items.value.map((i) => {
								const actor = actors[i % actors.length];
								return h('li', { key: i, class: 'flex items-start gap-3 px-4 py-3' }, [
									h(
										'span',
										{
											class: 'inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-black text-xs font-medium text-white',
										},
										actor[0],
									),
									h('div', { class: 'min-w-0' }, [
										h('p', { class: 'text-sm text-black' }, [
											h('span', { class: 'font-medium' }, actor),
											` ${verbs[i % verbs.length]} `,
											h('span', { class: 'text-[#374151]' }, `PR #${1000 + i}`),
										]),
										h('p', { class: 'text-xs text-[#9ca3af]' }, `${i + 1} minutes ago`),
									]),
								]);
							}),
						),
						h(
							InfiniteScroll.Loader,
							{ class: 'flex items-center justify-center gap-2 py-4 text-sm text-[#6b7280]' },
							() => [
								h('span', {
									class: 'size-4 animate-spin rounded-full border-2 border-[#e5e7eb] border-t-black',
								}),
								'Loading activity…',
							],
						),
						h(
							InfiniteScroll.EndMessage,
							{ class: 'py-4 text-center text-xs text-[#9ca3af]' },
							() => 'You’re all caught up',
						),
						h(InfiniteScroll.Sentinel),
					],
				);
			};
		},
	}),
};
