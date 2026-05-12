import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h, ref, computed } from 'vue';
import { Pagination } from '.';
import type { PaginationItemValue } from './Pagination.types';

const meta = {
	title: 'Forms/Pagination',
	component: Pagination.Root,
	tags: ['autodocs'],
	args: { totalPages: 10 },
	parameters: {
		docs: {
			description: {
				component:
					'Page navigation with sibling/boundary pages and ellipsis. Headless — render-prop emits item sequence.',
			},
		},
	},
} satisfies Meta<typeof Pagination.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const listCls = 'flex items-center gap-1';
const navBtnCls =
	'cursor-pointer rounded-[8px] border border-black bg-white px-3 py-1.5 text-sm text-black hover:bg-[#f5f5f5] disabled:cursor-not-allowed disabled:opacity-40';
const pageBtnCls =
	'cursor-pointer rounded-[8px] border border-black bg-white min-w-[36px] px-2 py-1.5 text-sm text-black hover:bg-[#f5f5f5] data-[active]:bg-black data-[active]:text-white';

function renderItem(item: PaginationItemValue, index: number) {
	if (item === 'ellipsis') {
		return h(Pagination.Ellipsis, { key: `e-${index}`, class: 'px-2 text-[#6b7280]' });
	}
	return h(Pagination.Item, { key: item, page: item }, () =>
		h('span', { class: pageBtnCls }, item),
	);
}

export const Default: Story = {
	render: () => ({
		setup: () => () =>
			h(Pagination.Root, { totalPages: 5 }, () => [
				h(Pagination.List, { class: listCls }, () => [
					h('li', {}, [h(Pagination.Previous, { class: navBtnCls }, () => 'Prev')]),
					h(
						Pagination.Items,
						{},
						({ item, index }: { item: PaginationItemValue; index: number }) =>
							renderItem(item, index),
					),
					h('li', {}, [h(Pagination.Next, { class: navBtnCls }, () => 'Next')]),
				]),
			]),
	}),
};

export const Composed: Story = {
	render: () => ({
		setup() {
			const page = ref(7);
			return () =>
				h('div', { class: 'flex flex-col items-center gap-2' }, [
					h(
						Pagination.Root,
						{
							totalPages: 20,
							page: page.value,
							onChange: (p: number) => (page.value = p),
						},
						() => [
							h(Pagination.List, { class: listCls }, () => [
								h('li', {}, [h(Pagination.Previous, { class: navBtnCls }, () => '‹')]),
								h(
									Pagination.Items,
									{},
									({ item, index }: { item: PaginationItemValue; index: number }) =>
										renderItem(item, index),
								),
								h('li', {}, [h(Pagination.Next, { class: navBtnCls }, () => '›')]),
							]),
						],
					),
					h('p', { class: 'text-xs text-[#6b7280]' }, [
						'Page ',
						h('span', { class: 'font-medium text-black' }, String(page.value)),
						' of 20',
					]),
				]);
		},
	}),
};

export const Complex: Story = {
	render: () => ({
		setup() {
			const page = ref(15);
			const totalItems = 247;
			const perPage = 10;
			const totalPages = Math.ceil(totalItems / perPage);
			const from = computed(() => (page.value - 1) * perPage + 1);
			const to = computed(() => Math.min(page.value * perPage, totalItems));

			return () =>
				h('div', { class: 'flex flex-col items-center gap-3' }, [
					h(
						Pagination.Root,
						{
							totalPages,
							page: page.value,
							onChange: (p: number) => (page.value = p),
							siblingCount: 2,
						},
						() => [
							h(Pagination.List, { class: listCls }, () => [
								h('li', {}, [
									h(Pagination.Previous, { class: navBtnCls }, () => '« First'),
								]),
								h(
									Pagination.Items,
									{},
									({ item, index }: { item: PaginationItemValue; index: number }) =>
										renderItem(item, index),
								),
								h('li', {}, [
									h(Pagination.Next, { class: navBtnCls }, () => 'Last »'),
								]),
							]),
						],
					),
					h('p', { class: 'text-xs text-[#6b7280]' }, [
						'Showing ',
						h(
							'span',
							{ class: 'font-medium text-black' },
							`${from.value}–${to.value}`,
						),
						' of ',
						h('span', { class: 'font-medium text-black' }, String(totalItems)),
					]),
				]);
		},
	}),
};
