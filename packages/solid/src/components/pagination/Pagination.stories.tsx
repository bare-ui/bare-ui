import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { createSignal } from 'solid-js';
import { Pagination } from './Pagination';

const meta = {
	title: 'Forms/Pagination',
	component: Pagination.Root,
	subcomponents: {
		'Pagination.List': Pagination.List,
		'Pagination.Items': Pagination.Items,
		'Pagination.Item': Pagination.Item,
		'Pagination.Ellipsis': Pagination.Ellipsis,
	},
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

export const Default: Story = {
	render: () => (
		<Pagination.Root totalPages={5}>
			<Pagination.List class={listCls}>
				<li>
					<Pagination.Previous class={navBtnCls}>Prev</Pagination.Previous>
				</li>
				<Pagination.Items>
					{(item) =>
						item === 'ellipsis' ? (
							<Pagination.Ellipsis class='px-2 text-[#6b7280]' />
						) : (
							<Pagination.Item page={item}>
								<span class={pageBtnCls}>{item}</span>
							</Pagination.Item>
						)
					}
				</Pagination.Items>
				<li>
					<Pagination.Next class={navBtnCls}>Next</Pagination.Next>
				</li>
			</Pagination.List>
		</Pagination.Root>
	),
};

export const Composed: Story = {
	render: () => {
		const [page, setPage] = createSignal(7);
		return (
			<div class='flex flex-col items-center gap-2'>
				<Pagination.Root
					totalPages={20}
					page={page()}
					onChange={setPage}>
					<Pagination.List class={listCls}>
						<li>
							<Pagination.Previous class={navBtnCls}>‹</Pagination.Previous>
						</li>
						<Pagination.Items>
							{(item) =>
								item === 'ellipsis' ? (
									<Pagination.Ellipsis class='px-2 text-[#6b7280]' />
								) : (
									<Pagination.Item page={item}>
										<span class={pageBtnCls}>{item}</span>
									</Pagination.Item>
								)
							}
						</Pagination.Items>
						<li>
							<Pagination.Next class={navBtnCls}>›</Pagination.Next>
						</li>
					</Pagination.List>
				</Pagination.Root>
				<p class='text-xs text-[#6b7280]'>
					Page <span class='font-medium text-black'>{page()}</span> of 20
				</p>
			</div>
		);
	},
};

export const Complex: Story = {
	render: () => {
		const [page, setPage] = createSignal(15);
		const totalItems = 247;
		const perPage = 10;
		const totalPages = Math.ceil(totalItems / perPage);
		const from = () => (page() - 1) * perPage + 1;
		const to = () => Math.min(page() * perPage, totalItems);

		return (
			<div class='flex flex-col items-center gap-3'>
				<Pagination.Root
					totalPages={totalPages}
					page={page()}
					onChange={setPage}
					siblingCount={2}>
					<Pagination.List class={listCls}>
						<li>
							<Pagination.Previous class={navBtnCls}>« First</Pagination.Previous>
						</li>
						<Pagination.Items>
							{(item) =>
								item === 'ellipsis' ? (
									<Pagination.Ellipsis class='px-2 text-[#6b7280]' />
								) : (
									<Pagination.Item page={item}>
										<span class={pageBtnCls}>{item}</span>
									</Pagination.Item>
								)
							}
						</Pagination.Items>
						<li>
							<Pagination.Next class={navBtnCls}>Last »</Pagination.Next>
						</li>
					</Pagination.List>
				</Pagination.Root>
				<p class='text-xs text-[#6b7280]'>
					Showing{' '}
					<span class='font-medium text-black'>
						{from()}–{to()}
					</span>{' '}
					of <span class='font-medium text-black'>{totalItems}</span>
				</p>
			</div>
		);
	},
};
