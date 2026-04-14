import type { Meta, StoryObj } from '@storybook/react-vite';
import { Timeago } from './Timeago';

const meta = {
	title: 'Components/Timeago',
	component: Timeago,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Relative time display with duration, full date/time, and time-only formats.',
			},
		},
	},
} satisfies Meta<typeof Timeago>;

export default meta;

export const Default = {
	render: () => {
		const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

		return (
			<div>
				<span className='text-sm font-medium text-[#6b7280]'>Duration: </span>
				<Timeago datetime={fiveMinutesAgo} isDuration className='text-sm text-black' />
			</div>
		);
	},
} satisfies StoryObj;

export const Composed = {
	render: () => {
		const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

		return (
			<div className='flex flex-col gap-3'>
				<div>
					<span className='text-sm font-medium text-[#6b7280]'>Duration: </span>
					<Timeago datetime={fiveMinutesAgo} isDuration className='text-sm text-black' />
				</div>
				<div>
					<span className='text-sm font-medium text-[#6b7280]'>Full date/time: </span>
					<Timeago datetime={fiveMinutesAgo} className='text-sm text-black' />
				</div>
				<div>
					<span className='text-sm font-medium text-[#6b7280]'>Time only: </span>
					<Timeago datetime={fiveMinutesAgo} timeOnly className='text-sm text-black' />
				</div>
			</div>
		);
	},
} satisfies StoryObj;

export const Complex = {
	render: () => {
		const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
		const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
		const lastYear = new Date('2025-06-15T10:30:00');

		return (
			<div className='flex flex-col gap-3'>
				<div>
					<span className='text-sm font-medium text-[#6b7280]'>3 days ago: </span>
					<Timeago datetime={threeDaysAgo} className='text-sm text-black' />
				</div>
				<div>
					<span className='text-sm font-medium text-[#6b7280]'>2 weeks ago: </span>
					<Timeago datetime={twoWeeksAgo} className='text-sm text-black' />
				</div>
				<div>
					<span className='text-sm font-medium text-[#6b7280]'>Last year: </span>
					<Timeago datetime={lastYear} className='text-sm text-black' />
				</div>
			</div>
		);
	},
} satisfies StoryObj;
