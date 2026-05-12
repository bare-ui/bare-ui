import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Spinner } from './Spinner';

const meta = {
	title: 'Feedback/Spinner',
	component: Spinner,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: { component: 'Accessible loading indicator with role=status and visually-hidden label.' },
		},
	},
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

const Ring = (props: { size?: number }) => {
	const size = () => props.size ?? 24;
	return (
		<svg
			width={size()}
			height={size()}
			viewBox='0 0 24 24'
			fill='none'
			style={{ animation: 'spin 1s linear infinite' }}>
			<style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
			<circle
				cx='12'
				cy='12'
				r='10'
				stroke='#e5e5e5'
				stroke-width='2'
			/>
			<path
				d='M22 12a10 10 0 0 0-10-10'
				stroke='black'
				stroke-width='2'
				stroke-linecap='round'
			/>
		</svg>
	);
};

export const Default: Story = {
	render: () => (
		<Spinner>
			<Ring />
		</Spinner>
	),
};

export const Composed: Story = {
	render: () => (
		<div class='flex items-center gap-6'>
			<Spinner label='Small'>
				<Ring size={16} />
			</Spinner>
			<Spinner label='Medium'>
				<Ring size={24} />
			</Spinner>
			<Spinner label='Large'>
				<Ring size={40} />
			</Spinner>
		</div>
	),
};

export const Complex: Story = {
	render: () => (
		<div class='flex items-center gap-3 rounded-[8px] border border-black bg-white px-4 py-3 text-sm text-black'>
			<Spinner label='Saving changes'>
				<Ring size={18} />
			</Spinner>
			<span>Saving changes…</span>
		</div>
	),
};
