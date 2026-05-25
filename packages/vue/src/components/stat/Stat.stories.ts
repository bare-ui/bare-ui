import { h } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { Stat } from '.';

const meta = {
	title: 'Feedback/Stat',
	component: Stat.Root,
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
	render: () => ({
		setup: () => () =>
			h(
				Stat.Root,
				{ class: 'w-56 rounded-xl border border-[#e5e7eb] p-4' },
				() => [
					h(Stat.Label, { class: 'text-sm text-[#6b7280]' }, () => 'Monthly revenue'),
					h('div', { class: 'mt-1 flex items-baseline gap-2' }, [
						h(Stat.Value, { class: 'text-2xl font-semibold text-black' }, () => '$48,250'),
						h(Stat.Delta, { value: 12.5, class: deltaCls }, () => '▲ 12.5%'),
					]),
					h(Stat.HelpText, { class: 'mt-1 text-xs text-[#9ca3af]' }, () => 'vs. previous month'),
				],
			),
	}),
};

export const NumericValue: Story = {
	render: () => ({
		setup: () => () =>
			h(
				Stat.Root,
				{ class: 'w-56 rounded-xl border border-[#e5e7eb] p-4' },
				() => [
					h(Stat.Label, { class: 'text-sm text-[#6b7280]' }, () => 'Open tickets'),
					h('div', { class: 'mt-1 flex items-baseline gap-2' }, [
						// `value` renders directly — no children needed.
						h(Stat.Value, { value: 128, class: 'text-2xl font-semibold text-black' }),
						h(Stat.Delta, { value: -8, class: deltaCls }, () => '▼ 8'),
					]),
					h(Stat.HelpText, { class: 'mt-1 text-xs text-[#9ca3af]' }, () => 'since yesterday'),
				],
			),
	}),
};

export const WithSparkline: Story = {
	render: () => ({
		setup: () => () =>
			h(
				Stat.Root,
				{ class: 'w-64 rounded-xl border border-[#e5e7eb] p-4' },
				() => [
					h('div', { class: 'flex items-start justify-between' }, [
						h('div', null, [
							h(Stat.Label, { class: 'text-sm text-[#6b7280]' }, () => 'Active users'),
							h(Stat.Value, { class: 'mt-1 block text-2xl font-semibold text-black' }, () => '8,942'),
						]),
						h(Stat.Delta, { value: -2.1, class: deltaCls }, () => '▼ 2.1%'),
					]),
					h(Stat.Sparkline, {
						data: [12, 18, 15, 22, 19, 28, 24, 30, 26, 34],
						width: 220,
						height: 40,
						class: 'mt-3 w-full text-black',
					}),
				],
			),
	}),
};

export const Grid: Story = {
	render: () => ({
		setup: () => () => {
			const stats = [
				{ label: 'Orders', value: '1,204', delta: 8.2 },
				{ label: 'Refunds', value: '23', delta: -1.4 },
				{ label: 'Conversion', value: '3.8%', delta: 0 },
			];
			return h('div', { class: 'grid grid-cols-3 gap-3' },
				stats.map((s) =>
					h(
						Stat.Root,
						{ key: s.label, class: 'rounded-xl border border-[#e5e7eb] p-4' },
						() => [
							h(Stat.Label, { class: 'text-xs text-[#6b7280]' }, () => s.label),
							h(Stat.Value, { class: 'mt-1 block text-xl font-semibold text-black' }, () => s.value),
							h(Stat.Delta, { value: s.delta, class: `mt-1 ${deltaCls}` }, () =>
								`${s.delta > 0 ? '+' : ''}${s.delta}%`,
							),
						],
					),
				),
			);
		},
	}),
};
