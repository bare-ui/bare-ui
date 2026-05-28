import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stat } from './Stat';

const meta = {
	title: 'Feedback/Stat',
	component: Stat.Root,
	subcomponents: {
		'Stat.Label': Stat.Label,
		'Stat.Value': Stat.Value,
		'Stat.Delta': Stat.Delta,
		'Stat.HelpText': Stat.HelpText,
		'Stat.Sparkline': Stat.Sparkline,
	},
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'A KPI / metric display: label, value, a delta that exposes `data-direction` (`increase` / `decrease` / `neutral`), help text, and a built-in inline `Sparkline` (or bring your own chart).',
			},
		},
	},
} satisfies Meta<typeof Stat.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const deltaCls =
	'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium data-[direction=increase]:bg-green-50 data-[direction=increase]:text-green-700 data-[direction=decrease]:bg-red-50 data-[direction=decrease]:text-red-700 data-[direction=neutral]:bg-[#f3f4f6] data-[direction=neutral]:text-[#6b7280]';

export const Default: Story = {
	render: () => (
		<Stat.Root className='w-56 rounded-xl border border-[#e5e7eb] p-4'>
			<Stat.Label className='text-sm text-[#6b7280]'>Monthly revenue</Stat.Label>
			<div className='mt-1 flex items-baseline gap-2'>
				<Stat.Value className='text-2xl font-semibold text-black'>$48,250</Stat.Value>
				<Stat.Delta
					value={12.5}
					className={deltaCls}>
					▲ 12.5%
				</Stat.Delta>
			</div>
			<Stat.HelpText className='mt-1 text-xs text-[#9ca3af]'>vs. previous month</Stat.HelpText>
		</Stat.Root>
	),
};

export const WithSparkline: Story = {
	render: () => (
		<Stat.Root className='w-64 rounded-xl border border-[#e5e7eb] p-4'>
			<div className='flex items-start justify-between'>
				<div>
					<Stat.Label className='text-sm text-[#6b7280]'>Active users</Stat.Label>
					<Stat.Value className='mt-1 block text-2xl font-semibold text-black'>8,942</Stat.Value>
				</div>
				<Stat.Delta
					value={-2.1}
					className={deltaCls}>
					▼ 2.1%
				</Stat.Delta>
			</div>
			<Stat.Sparkline
				data={[12, 18, 15, 22, 19, 28, 24, 30, 26, 34]}
				width={220}
				height={40}
				className='mt-3 w-full text-black'
			/>
		</Stat.Root>
	),
};

export const Grid: Story = {
	render: () => (
		<div className='grid grid-cols-3 gap-3'>
			{[
				{ label: 'Orders', value: '1,204', delta: 8.2 },
				{ label: 'Refunds', value: '23', delta: -1.4 },
				{ label: 'Conversion', value: '3.8%', delta: 0 },
			].map((s) => (
				<Stat.Root
					key={s.label}
					className='rounded-xl border border-[#e5e7eb] p-4'>
					<Stat.Label className='text-xs text-[#6b7280]'>{s.label}</Stat.Label>
					<Stat.Value className='mt-1 block text-xl font-semibold text-black'>{s.value}</Stat.Value>
					<Stat.Delta
						value={s.delta}
						className={`mt-1 ${deltaCls}`}>
						{s.delta > 0 ? '+' : ''}
						{s.delta}%
					</Stat.Delta>
				</Stat.Root>
			))}
		</div>
	),
};
