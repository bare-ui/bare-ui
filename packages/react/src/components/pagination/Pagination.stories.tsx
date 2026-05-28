import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
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
				component: 'Page navigation with sibling/boundary pages and ellipsis. Headless — render-prop emits item sequence.',
			},
		},
	},
} satisfies Meta<typeof Pagination.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const listCls = 'flex items-center gap-1';
const navBtnCls = 'cursor-pointer rounded-[8px] border border-black bg-white px-3 py-1.5 text-sm text-black hover:bg-[#f5f5f5] disabled:cursor-not-allowed disabled:opacity-40';
const pageBtnCls = 'cursor-pointer rounded-[8px] border border-black bg-white min-w-[36px] px-2 py-1.5 text-sm text-black hover:bg-[#f5f5f5] data-[active]:bg-black data-[active]:text-white';

export const Default: Story = {
	render: () => (
		<Pagination.Root totalPages={5}>
			<Pagination.List className={listCls}>
				<li><Pagination.Previous className={navBtnCls}>Prev</Pagination.Previous></li>
				<Pagination.Items>
					{(item, i) =>
						item === 'ellipsis' ? (
							<Pagination.Ellipsis key={`e-${i}`} className='px-2 text-[#6b7280]' />
						) : (
							<Pagination.Item key={item} page={item} className='' >
								<span className={pageBtnCls}>{item}</span>
							</Pagination.Item>
						)
					}
				</Pagination.Items>
				<li><Pagination.Next className={navBtnCls}>Next</Pagination.Next></li>
			</Pagination.List>
		</Pagination.Root>
	),
};

export const Composed: Story = {
	render: () => {
		const [page, setPage] = useState(7);
		return (
			<div className='flex flex-col items-center gap-2'>
				<Pagination.Root totalPages={20} page={page} onChange={setPage}>
					<Pagination.List className={listCls}>
						<li><Pagination.Previous className={navBtnCls}>‹</Pagination.Previous></li>
						<Pagination.Items>
							{(item, i) =>
								item === 'ellipsis' ? (
									<Pagination.Ellipsis key={`e-${i}`} className='px-2 text-[#6b7280]' />
								) : (
									<Pagination.Item key={item} page={item}>
										<span className={pageBtnCls}>{item}</span>
									</Pagination.Item>
								)
							}
						</Pagination.Items>
						<li><Pagination.Next className={navBtnCls}>›</Pagination.Next></li>
					</Pagination.List>
				</Pagination.Root>
				<p className='text-xs text-[#6b7280]'>Page <span className='font-medium text-black'>{page}</span> of 20</p>
			</div>
		);
	},
};

export const Complex: Story = {
	render: () => {
		const [page, setPage] = useState(15);
		const totalItems = 247;
		const perPage = 10;
		const totalPages = Math.ceil(totalItems / perPage);
		const from = (page - 1) * perPage + 1;
		const to = Math.min(page * perPage, totalItems);

		return (
			<div className='flex flex-col items-center gap-3'>
				<Pagination.Root totalPages={totalPages} page={page} onChange={setPage} siblingCount={2}>
					<Pagination.List className={listCls}>
						<li><Pagination.Previous className={navBtnCls}>« First</Pagination.Previous></li>
						<Pagination.Items>
							{(item, i) =>
								item === 'ellipsis' ? (
									<Pagination.Ellipsis key={`e-${i}`} className='px-2 text-[#6b7280]' />
								) : (
									<Pagination.Item key={item} page={item}>
										<span className={pageBtnCls}>{item}</span>
									</Pagination.Item>
								)
							}
						</Pagination.Items>
						<li><Pagination.Next className={navBtnCls}>Last »</Pagination.Next></li>
					</Pagination.List>
				</Pagination.Root>
				<p className='text-xs text-[#6b7280]'>
					Showing <span className='font-medium text-black'>{from}–{to}</span> of <span className='font-medium text-black'>{totalItems}</span>
				</p>
			</div>
		);
	},
};
