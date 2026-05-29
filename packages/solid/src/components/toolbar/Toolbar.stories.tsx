import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Toolbar } from './Toolbar';

const meta = {
	title: 'Layout/Toolbar',
	component: Toolbar.Root,
	subcomponents: {
		'Toolbar.Button': Toolbar.Button,
		'Toolbar.Toggle': Toolbar.Toggle,
		'Toolbar.Link': Toolbar.Link,
		'Toolbar.Separator': Toolbar.Separator,
	},
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
			<Toolbar.Toggle
				class={btnCls}
				aria-label='Bold'>
				<b>B</b>
			</Toolbar.Toggle>
			<Toolbar.Toggle
				class={btnCls}
				aria-label='Italic'>
				<i>I</i>
			</Toolbar.Toggle>
			<Toolbar.Toggle
				class={`${btnCls} underline`}
				aria-label='Underline'>
				U
			</Toolbar.Toggle>
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

export const Composed: Story = {
	render: () => (
		<div class='flex items-start gap-10'>
			<div>
				<p class='mb-2 text-sm font-medium text-[#374151]'>Horizontal</p>
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
				</Toolbar.Root>
			</div>

			<div>
				<p class='mb-2 text-sm font-medium text-[#374151]'>Vertical</p>
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
			</div>

			<div>
				<p class='mb-2 text-sm font-medium text-[#374151]'>No loop</p>
				<Toolbar.Root
					loop={false}
					aria-label='Playback'
					class='inline-flex items-center gap-1 rounded-lg border border-[#e5e7eb] bg-white p-1'>
					<Toolbar.Button
						class={btnCls}
						aria-label='Previous'>
						⏮
					</Toolbar.Button>
					<Toolbar.Button
						class={btnCls}
						aria-label='Play'>
						⏵
					</Toolbar.Button>
					<Toolbar.Button
						class={btnCls}
						aria-label='Next'>
						⏭
					</Toolbar.Button>
				</Toolbar.Root>
			</div>
		</div>
	),
};

export const Complex: Story = {
	render: () => (
		<div class='w-full max-w-lg overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-sm'>
			<Toolbar.Root
				aria-label='Document editor'
				class='flex items-center gap-1 border-b border-[#e5e7eb] bg-[#f5f5f5] px-2 py-1.5'>
				<Toolbar.Button
					class={btnCls}
					aria-label='Undo'>
					↶
				</Toolbar.Button>
				<Toolbar.Button
					class={btnCls}
					aria-label='Redo'>
					↷
				</Toolbar.Button>
				<Toolbar.Separator class='mx-1 h-5 w-px bg-[#e5e7eb]' />
				<Toolbar.Toggle
					class={btnCls}
					aria-label='Bold'
					defaultPressed>
					<b>B</b>
				</Toolbar.Toggle>
				<Toolbar.Toggle
					class={btnCls}
					aria-label='Italic'>
					<i>I</i>
				</Toolbar.Toggle>
				<Toolbar.Toggle
					class={`${btnCls} underline`}
					aria-label='Underline'>
					U
				</Toolbar.Toggle>
				<Toolbar.Separator class='mx-1 h-5 w-px bg-[#e5e7eb]' />
				<Toolbar.Button
					class={btnCls}
					aria-label='Bulleted list'>
					•
				</Toolbar.Button>
				<Toolbar.Button
					class={btnCls}
					aria-label='Insert link'>
					🔗
				</Toolbar.Button>
				<div class='ml-auto'>
					<Toolbar.Link
						href='#'
						class={`${btnCls} w-auto px-2 font-medium`}>
						Share
					</Toolbar.Link>
				</div>
			</Toolbar.Root>
			<div class='space-y-2 p-4 text-sm text-[#374151]'>
				<p class='font-semibold text-black'>Project proposal</p>
				<p>
					Select text and use the toolbar above to format. Arrow keys move focus across the controls as a
					single tab stop.
				</p>
			</div>
		</div>
	),
};
