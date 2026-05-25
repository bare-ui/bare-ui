import { h } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { HoverCard } from '.';

const meta = {
	title: 'Overlays/HoverCard',
	component: HoverCard.Root,
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

export const SideTop: Story = {
	render: () => ({
		setup: () => () =>
			h('div', { class: 'flex justify-center p-24' }, [
				h(HoverCard.Root, { openDelay: 150 }, () => [
					h(
						HoverCard.Trigger,
						{ class: 'rounded-lg border border-[#d1d5db] px-3 py-1.5 text-sm' },
						() => 'Hover me',
					),
					h(
						HoverCard.Content,
						{
							side: 'top',
							class: 'w-56 rounded-lg border border-[#e5e7eb] bg-white p-3 text-sm text-[#374151] shadow-lg',
						},
						() => 'This card appears above the trigger and stays open while hovered.',
					),
				]),
			]),
	}),
};
