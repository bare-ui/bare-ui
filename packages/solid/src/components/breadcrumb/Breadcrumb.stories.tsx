import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Breadcrumb } from './Breadcrumb';

const meta = {
	title: 'Layout/Breadcrumb',
	component: Breadcrumb.Root,
	subcomponents: {
		'Breadcrumb.List': Breadcrumb.List,
		'Breadcrumb.Item': Breadcrumb.Item,
		'Breadcrumb.Link': Breadcrumb.Link,
		'Breadcrumb.Separator': Breadcrumb.Separator,
	},
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Navigation trail with semantic <nav> + <ol>, current-page marking, and customizable separator.',
			},
		},
	},
} satisfies Meta<typeof Breadcrumb.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const linkCls = 'text-sm text-[#6b7280] hover:text-black hover:underline';
const itemCurrentCls = 'text-sm font-medium text-black';
const sepCls = 'mx-2 text-[#6b7280]';
const listCls = 'flex items-center';

export const Default: Story = {
	render: () => (
		<Breadcrumb.Root>
			<Breadcrumb.List class={listCls}>
				<Breadcrumb.Item>
					<Breadcrumb.Link
						href='#'
						class={linkCls}>
						Home
					</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator class={sepCls} />
				<Breadcrumb.Item>
					<Breadcrumb.Link
						href='#'
						class={linkCls}>
						Settings
					</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator class={sepCls} />
				<Breadcrumb.Item
					current
					class={itemCurrentCls}>
					Profile
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
	),
};

export const Composed: Story = {
	render: () => (
		<Breadcrumb.Root>
			<Breadcrumb.List class={listCls}>
				<Breadcrumb.Item>
					<Breadcrumb.Link
						href='#'
						class={linkCls}>
						Home
					</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator class={sepCls}>›</Breadcrumb.Separator>
				<Breadcrumb.Item>
					<Breadcrumb.Link
						href='#'
						class={linkCls}>
						Docs
					</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator class={sepCls}>›</Breadcrumb.Separator>
				<Breadcrumb.Item>
					<Breadcrumb.Link
						href='#'
						class={linkCls}>
						Components
					</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator class={sepCls}>›</Breadcrumb.Separator>
				<Breadcrumb.Item
					current
					class={itemCurrentCls}>
					Breadcrumb
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
	),
};

export const Complex: Story = {
	render: () => (
		<Breadcrumb.Root>
			<Breadcrumb.List class={listCls}>
				<Breadcrumb.Item>
					<Breadcrumb.Link
						href='#'
						class={`${linkCls} flex items-center gap-1`}>
						<svg
							class='size-4'
							viewBox='0 0 20 20'
							fill='currentColor'>
							<path d='M10 2L2 9h2v7h4v-5h4v5h4V9h2L10 2z' />
						</svg>
						Home
					</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator class={sepCls}>
					<svg
						class='inline size-3'
						viewBox='0 0 20 20'
						fill='currentColor'>
						<path d='M7 5l5 5-5 5V5z' />
					</svg>
				</Breadcrumb.Separator>
				<Breadcrumb.Item>
					<Breadcrumb.Link
						href='#'
						class={linkCls}>
						Projects
					</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator class={sepCls}>
					<svg
						class='inline size-3'
						viewBox='0 0 20 20'
						fill='currentColor'>
						<path d='M7 5l5 5-5 5V5z' />
					</svg>
				</Breadcrumb.Separator>
				<Breadcrumb.Item>
					<span class='text-sm text-[#6b7280]'>…</span>
				</Breadcrumb.Item>
				<Breadcrumb.Separator class={sepCls}>
					<svg
						class='inline size-3'
						viewBox='0 0 20 20'
						fill='currentColor'>
						<path d='M7 5l5 5-5 5V5z' />
					</svg>
				</Breadcrumb.Separator>
				<Breadcrumb.Item
					current
					class={itemCurrentCls}>
					Q4 Roadmap
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
	),
};
