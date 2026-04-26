import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { createSignal, Show } from 'solid-js';
import { Rating } from './Rating';

const meta = {
	title: 'Feedback/Rating',
	component: Rating,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Interactive star rating with read-only and disabled states.',
			},
		},
	},
} satisfies Meta<typeof Rating>;

export default meta;
type Story = StoryObj<typeof meta>;

const starCls =
	'size-6 cursor-pointer text-[#e5e5e5] outline-none transition-colors data-[highlighted]:text-black data-[filled]:text-black hover:scale-110 data-[disabled]:cursor-default data-[disabled]:opacity-50';

export const Default: Story = {
	render: () => (
		<Rating
			defaultValue={3}
			class='flex gap-0.5'
			starClass={starCls}
		/>
	),
};

export const Composed: Story = {
	render: () => {
		const [value, setValue] = createSignal(0);
		const labels = ['', 'Terrible', 'Bad', 'Okay', 'Good', 'Excellent'];

		return (
			<div class='flex flex-col items-start gap-2'>
				<Rating
					value={value()}
					onChange={setValue}
					class='flex gap-0.5'
					starClass={starCls}
				/>
				<p class='text-sm text-[#6b7280]'>
					<Show
						when={value() > 0}
						fallback='Select a rating'>
						<span class='font-medium text-black'>{labels[value()]}</span>
					</Show>
				</p>
			</div>
		);
	},
};

export const Complex: Story = {
	render: () => (
		<div class='flex flex-col gap-6 items-center'>
			<div class='flex items-center gap-2'>
				<Rating
					value={4}
					readOnly
					class='flex gap-0.5'
					starClass='size-4 cursor-default text-[#e5e5e5] data-[filled]:text-black'
				/>
				<span class='text-sm font-medium text-black'>4.0</span>
				<span class='text-sm text-[#6b7280]'>(128 reviews)</span>
			</div>
			<div class='flex flex-col gap-4'>
				<div class='flex items-center gap-3'>
					<span class='w-12 text-xs text-[#6b7280]'>Small</span>
					<Rating
						defaultValue={3}
						class='flex gap-0.5'
						starClass='size-4 cursor-pointer text-[#e5e5e5] transition-colors data-[highlighted]:text-black data-[filled]:text-black'
					/>
				</div>
				<div class='flex items-center gap-3'>
					<span class='w-12 text-xs text-[#6b7280]'>Medium</span>
					<Rating
						defaultValue={3}
						class='flex gap-0.5'
						starClass={starCls}
					/>
				</div>
				<div class='flex items-center gap-3'>
					<span class='w-12 text-xs text-[#6b7280]'>Large</span>
					<Rating
						defaultValue={3}
						class='flex gap-0.5'
						starClass='size-9 cursor-pointer text-[#e5e5e5] transition-colors data-[highlighted]:text-black data-[filled]:text-black'
					/>
				</div>
			</div>
		</div>
	),
};
