import type { Meta, StoryObj } from '@storybook/react-vite'
import { Timeago } from './Timeago'

const meta = {
	title: 'Components/Timeago',
	component: Timeago,
	tags: ['autodocs'],
} satisfies Meta<typeof Timeago>

export default meta

export const RecentDate = {
	render: () => {
		const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)

		return (
			<div className="flex flex-col gap-4">
				<div>
					<span className="text-sm font-medium text-gray-500">
						Duration (5 minutes ago):
					</span>
					<Timeago
						datetime={fiveMinutesAgo}
						isDuration
						className="ml-2 text-sm text-gray-700"
					/>
				</div>
				<div>
					<span className="text-sm font-medium text-gray-500">Full date/time:</span>
					<Timeago datetime={fiveMinutesAgo} className="ml-2 text-sm text-gray-700" />
				</div>
				<div>
					<span className="text-sm font-medium text-gray-500">Time only:</span>
					<Timeago
						datetime={fiveMinutesAgo}
						timeOnly
						className="ml-2 text-sm text-gray-700"
					/>
				</div>
			</div>
		)
	},
} satisfies StoryObj

export const OlderDate = {
	render: () => {
		const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
		const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
		const lastYear = new Date('2025-06-15T10:30:00')

		return (
			<div className="flex flex-col gap-4">
				<div>
					<span className="text-sm font-medium text-gray-500">3 days ago:</span>
					<Timeago datetime={threeDaysAgo} className="ml-2 text-sm text-gray-700" />
				</div>
				<div>
					<span className="text-sm font-medium text-gray-500">2 weeks ago:</span>
					<Timeago datetime={twoWeeksAgo} className="ml-2 text-sm text-gray-700" />
				</div>
				<div>
					<span className="text-sm font-medium text-gray-500">Last year:</span>
					<Timeago datetime={lastYear} className="ml-2 text-sm text-gray-700" />
				</div>
				<div>
					<span className="text-sm font-medium text-gray-500">
						3 days ago (duration):
					</span>
					<Timeago
						datetime={threeDaysAgo}
						isDuration
						className="ml-2 text-sm text-gray-700"
					/>
				</div>
			</div>
		)
	},
} satisfies StoryObj
