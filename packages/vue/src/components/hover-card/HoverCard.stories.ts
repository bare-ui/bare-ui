import { h } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { HoverCard } from '.';

const meta = {
	title: 'Overlays/HoverCard',
	component: HoverCard.Root,
	subcomponents: {
		'HoverCard.Trigger': HoverCard.Trigger,
		'HoverCard.Content': HoverCard.Content,
	},
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'A richer, interactive alternative to Tooltip — opens on hover/focus after a delay and stays open while you move into the card. Content is fully interactive (links, buttons).',
			},
		},
	},
} satisfies Meta<typeof HoverCard.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const cardCls = 'w-64 rounded-xl border border-[#e5e7eb] bg-white p-4 text-sm shadow-lg';

export const Default: Story = {
	render: () => ({
		setup: () => () =>
			h('div', { class: 'flex justify-center p-16' }, [
				h(HoverCard.Root, null, () => [
					h(
						HoverCard.Trigger,
						{ class: 'cursor-pointer font-medium text-[#4338ca] underline underline-offset-2' },
						() => '@wire-ui',
					),
					h(
						HoverCard.Content,
						{ class: 'w-64 rounded-xl border border-[#e5e7eb] bg-white p-4 text-sm shadow-lg' },
						() => [
							h('div', { class: 'flex items-center gap-3' }, [
								h(
									'div',
									{
										class: 'flex size-10 items-center justify-center rounded-full bg-black text-sm font-bold text-white',
									},
									'W',
								),
								h('div', {}, [
									h('p', { class: 'font-semibold text-black' }, 'Wire UI'),
									h('p', { class: 'text-xs text-[#6b7280]' }, '@wire-ui'),
								]),
							]),
							h(
								'p',
								{ class: 'mt-3 text-[#374151]' },
								'Headless, AI-native component primitives with zero CSS.',
							),
							h('div', { class: 'mt-3 flex gap-3 text-xs text-[#6b7280]' }, [
								h('span', {}, [h('b', { class: 'text-black' }, '1.2k'), ' Following']),
								h('span', {}, [h('b', { class: 'text-black' }, '18.3k'), ' Followers']),
							]),
						],
					),
				]),
			]),
	}),
};

const sideCardCls =
	'w-56 rounded-lg border border-[#e5e7eb] bg-white p-3 text-sm text-[#374151] shadow-lg';
const sideTriggerCls = 'rounded-lg border border-[#d1d5db] px-3 py-1.5 text-sm';

export const Composed: Story = {
	render: () => ({
		setup: () => () =>
			h('div', { class: 'flex items-center justify-center gap-16 p-24' }, [
				h(HoverCard.Root, { openDelay: 150 }, () => [
					h(HoverCard.Trigger, { class: sideTriggerCls }, () => 'Top'),
					h(
						HoverCard.Content,
						{ side: 'top', class: sideCardCls },
						() => 'This card appears above the trigger and stays open while hovered.',
					),
				]),
				h(HoverCard.Root, { openDelay: 150 }, () => [
					h(HoverCard.Trigger, { class: sideTriggerCls }, () => 'Bottom'),
					h(
						HoverCard.Content,
						{ side: 'bottom', class: sideCardCls },
						() => 'This one drops below — the default side, with interactive links you can move into.',
					),
				]),
				h(HoverCard.Root, { openDelay: 150 }, () => [
					h(HoverCard.Trigger, { class: sideTriggerCls }, () => 'Right'),
					h(
						HoverCard.Content,
						{ side: 'right', class: sideCardCls },
						() => 'Rendered to the right of the trigger.',
					),
				]),
			]),
	}),
};

export const Complex: Story = {
	render: () => ({
		setup: () => () =>
			h('div', { class: 'mx-auto max-w-md p-16 text-sm leading-relaxed text-[#374151]' }, [
				h('p', {}, [
					'The release was led by ',
					h(HoverCard.Root, null, () => [
						h(
							HoverCard.Trigger,
							{ class: 'cursor-pointer font-medium text-[#4338ca] underline underline-offset-2' },
							() => '@grace',
						),
						h(HoverCard.Content, { side: 'top', class: cardCls }, () => [
							h('div', { class: 'flex items-center gap-3' }, [
								h(
									'div',
									{
										class: 'flex size-10 items-center justify-center rounded-full bg-black text-sm font-bold text-white',
									},
									'G',
								),
								h('div', {}, [
									h('p', { class: 'font-semibold text-black' }, 'Grace Hopper'),
									h('p', { class: 'text-xs text-[#6b7280]' }, '@grace · Staff Engineer'),
								]),
							]),
							h(
								'p',
								{ class: 'mt-3 text-[#374151]' },
								'Builds compilers and ships releases on Fridays anyway.',
							),
							h(
								'button',
								{
									class: 'mt-3 w-full rounded-lg bg-black py-1.5 text-xs font-medium text-white hover:bg-[#333]',
								},
								'Follow',
							),
						]),
					]),
					' with help from the platform team. Hover any name to preview their profile before navigating.',
				]),
			]),
	}),
};
