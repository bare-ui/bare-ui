import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Divider } from './Divider';

const meta = {
	title: 'Layout/Divider',
	component: Divider,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Horizontal or vertical separator line.',
			},
		},
	},
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<div class='flex flex-col gap-8'>
			<div>
				<p class='text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-3'>Horizontal</p>
				<div class='flex flex-col gap-3'>
					<p class='text-sm text-black'>Item one</p>
					<Divider class='h-px w-full bg-black' />
					<p class='text-sm text-black'>Item two</p>
					<Divider class='h-px w-full bg-black' />
					<p class='text-sm text-black'>Item three</p>
				</div>
			</div>
			<div>
				<p class='text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-3'>Vertical</p>
				<div class='flex h-6 items-center gap-3'>
					<span class='text-sm text-black'>Home</span>
					<Divider
						orientation='vertical'
						class='h-full w-px bg-black'
					/>
					<span class='text-sm text-black'>About</span>
					<Divider
						orientation='vertical'
						class='h-full w-px bg-black'
					/>
					<span class='text-sm text-black'>Contact</span>
				</div>
			</div>
			<div>
				<p class='text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-3'>With label</p>
				<div class='flex w-64 items-center gap-3'>
					<Divider class='h-px flex-1 bg-black' />
					<span class='text-xs font-medium text-[#6b7280]'>OR</span>
					<Divider class='h-px flex-1 bg-black' />
				</div>
			</div>
		</div>
	),
};
