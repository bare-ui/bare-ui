import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Toolbar } from './Toolbar';

const meta = {
	title: 'Layout/Toolbar',
	component: Toolbar.Root,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'An accessible `role="toolbar"` wrapper with roving tabindex — the group is a single tab stop and arrow keys move focus between items (Home/End jump to ends).',
			},
		},
	},
} satisfies Meta<typeof Toolbar.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const btnCls =
	'flex size-9 items-center justify-center rounded-md text-sm text-[#374151] hover:bg-[#f3f4f6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-black aria-pressed:bg-[#e5e7eb]';

export const Default: Story = {
	render: () => (
		<Toolbar.Root
			aria-label='Text formatting'
			class='inline-flex items-center gap-1 rounded-lg border border-[#e5e7eb] bg-white p-1'>
			<Toolbar.Button
				class={btnCls}
				aria-label='Bold'>
				<b>B</b>
			</Toolbar.Button>
			<Toolbar.Button
				class={btnCls}
				aria-label='Italic'>
				<i>I</i>
			</Toolbar.Button>
			<Toolbar.Button
				class={`${btnCls} underline`}
				aria-label='Underline'>
				U
			</Toolbar.Button>
			<Toolbar.Separator class='mx-1 h-5 w-px bg-[#e5e7eb]' />
			<Toolbar.Button
				class={btnCls}
				aria-label='Align left'>
				⬅
			</Toolbar.Button>
			<Toolbar.Button
				class={btnCls}
				aria-label='Align center'>
				⬌
			</Toolbar.Button>
			<Toolbar.Separator class='mx-1 h-5 w-px bg-[#e5e7eb]' />
			<Toolbar.Link
				href='#'
				class={`${btnCls} w-auto px-2`}>
				Help
			</Toolbar.Link>
		</Toolbar.Root>
	),
};

export const Vertical: Story = {
	render: () => (
		<Toolbar.Root
			orientation='vertical'
			aria-label='Tools'
			class='inline-flex flex-col items-center gap-1 rounded-lg border border-[#e5e7eb] bg-white p-1'>
			<Toolbar.Button
				class={btnCls}
				aria-label='Move'>
				✥
			</Toolbar.Button>
			<Toolbar.Button
				class={btnCls}
				aria-label='Draw'>
				✎
			</Toolbar.Button>
			<Toolbar.Separator class='my-1 h-px w-5 bg-[#e5e7eb]' />
			<Toolbar.Button
				class={btnCls}
				aria-label='Erase'>
				⌫
			</Toolbar.Button>
		</Toolbar.Root>
	),
};
