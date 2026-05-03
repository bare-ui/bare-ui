import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h } from 'vue';
import { AspectRatio } from '.';

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

const Placeholder = (props: { label: string }) =>
	h(
		'div',
		{
			class: 'flex h-full w-full items-center justify-center border border-black bg-[#f5f5f5] text-sm text-black',
		},
		props.label,
	);

export const Default: Story = {
	render: () => ({
		setup: () => () =>
			h('div', { class: 'w-full max-w-md' }, [
				h(AspectRatio, { ratio: 16 / 9 }, () => h(Placeholder, { label: '16 / 9' })),
			]),
	}),
};

export const Composed: Story = {
	render: () => ({
		setup: () => () =>
			h('div', { class: 'grid grid-cols-3 gap-4 w-full max-w-2xl' }, [
				h(AspectRatio, { ratio: 1 }, () => h(Placeholder, { label: '1:1' })),
				h(AspectRatio, { ratio: 4 / 3 }, () => h(Placeholder, { label: '4:3' })),
				h(AspectRatio, { ratio: 3 / 4 }, () => h(Placeholder, { label: '3:4' })),
			]),
	}),
};

export const Complex: Story = {
	render: () => ({
		setup: () => () =>
			h('div', { class: 'grid grid-cols-2 gap-4 w-full max-w-2xl' }, [
				h('div', {}, [
					h(
						'p',
						{ class: 'text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-2' },
						'Cinematic 21:9',
					),
					h(AspectRatio, { ratio: 21 / 9 }, () => h(Placeholder, { label: '21:9' })),
				]),
				h('div', {}, [
					h(
						'p',
						{ class: 'text-xs font-medium uppercase tracking-wide text-[#6b7280] mb-2' },
						'Square 1:1',
					),
					h(AspectRatio, { ratio: 1 }, () => h(Placeholder, { label: '1:1' })),
				]),
			]),
	}),
};
