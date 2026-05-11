import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { AspectRatio } from './AspectRatio';

const meta = {
	title: 'Layout/AspectRatio',
	component: AspectRatio,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Maintains a width-to-height ratio for its child via CSS aspect-ratio.',
			},
		},
	},
} satisfies Meta<typeof AspectRatio>;

export default meta;
type Story = StoryObj<typeof meta>;

const Placeholder = (props: { label: string }) => (
	<div class='flex h-full w-full items-center justify-center border border-black bg-[#f5f5f5] text-sm text-black'>
		{props.label}
	</div>
);

export const Default: Story = {
	render: () => (
		<div class='w-full max-w-md'>
			<AspectRatio ratio={16 / 9}>
				<Placeholder label='16 / 9' />
			</AspectRatio>
		</div>
	),
};

export const Composed: Story = {
	render: () => (
		<div class='grid grid-cols-3 gap-4 w-full max-w-2xl'>
			<AspectRatio ratio={1}>
				<Placeholder label='1:1' />
			</AspectRatio>
			<AspectRatio ratio={4 / 3}>
				<Placeholder label='4:3' />
			</AspectRatio>
			<AspectRatio ratio={3 / 4}>
				<Placeholder label='3:4' />
			</AspectRatio>
		</div>
	),
};

export const Complex: Story = {
	render: () => (
		<div class='grid grid-cols-2 gap-4 w-full max-w-2xl'>
			<div>
				<p class='text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-2'>Cinematic 21:9</p>
				<AspectRatio ratio={21 / 9}>
					<Placeholder label='21:9' />
				</AspectRatio>
			</div>
			<div>
				<p class='text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-2'>Square 1:1</p>
				<AspectRatio ratio={1}>
					<Placeholder label='1:1' />
				</AspectRatio>
			</div>
		</div>
	),
};
