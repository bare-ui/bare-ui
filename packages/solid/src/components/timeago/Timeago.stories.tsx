import type { StoryObj } from 'storybook-solidjs-vite';
import { Timeago } from './Timeago';

export default {
	title: 'Media/Timeago',
	component: Timeago,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Relative time display with duration, full date/time, and time-only formats.',
			},
		},
	},
};

export const Default = {
	render: () => {
		const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

		return (
			<div>
				<span class='text-sm font-medium text-[#6b7280]'>Duration: </span>
				<Timeago
					datetime={fiveMinutesAgo}
					isDuration
					class='text-sm text-black'
				/>
			</div>
		);
	},
} satisfies StoryObj;

export const Composed = {
	render: () => {
		const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

		return (
			<div class='flex flex-col gap-3'>
				<div>
					<span class='text-sm font-medium text-[#6b7280]'>Duration: </span>
					<Timeago
						datetime={fiveMinutesAgo}
						isDuration
						class='text-sm text-black'
					/>
				</div>
				<div>
					<span class='text-sm font-medium text-[#6b7280]'>Full date/time: </span>
					<Timeago
						datetime={fiveMinutesAgo}
						class='text-sm text-black'
					/>
				</div>
				<div>
					<span class='text-sm font-medium text-[#6b7280]'>Time only: </span>
					<Timeago
						datetime={fiveMinutesAgo}
						timeOnly
						class='text-sm text-black'
					/>
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
			<div class='flex flex-col gap-3'>
				<div>
					<span class='text-sm font-medium text-[#6b7280]'>3 days ago: </span>
					<Timeago
						datetime={threeDaysAgo}
						class='text-sm text-black'
					/>
				</div>
				<div>
					<span class='text-sm font-medium text-[#6b7280]'>2 weeks ago: </span>
					<Timeago
						datetime={twoWeeksAgo}
						class='text-sm text-black'
					/>
				</div>
				<div>
					<span class='text-sm font-medium text-[#6b7280]'>Last year: </span>
					<Timeago
						datetime={lastYear}
						class='text-sm text-black'
					/>
				</div>
			</div>
		);
	},
} satisfies StoryObj;
