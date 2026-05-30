import { h } from 'vue';
import type { StoryObj } from '@storybook/vue3-vite';
import { Avatar } from '.';

export default {
	title: 'Media/Avatar',
	component: Avatar,
	subcomponents: {
		'Avatar.Image': Avatar.Image,
		'Avatar.Fallback': Avatar.Fallback,
	},
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'Displays a user image with a text fallback shown while it loads or if it fails. Compose `Avatar.Image` and `Avatar.Fallback` inside `Avatar.Root`; overlap several for a stacked group.',
			},
		},
	},
};

export const Default: StoryObj = {
	render: () => ({
		setup: () => () =>
			h('div', { class: 'flex -space-x-2' }, [
				h(
					Avatar.Root,
					{
						class: 'relative inline-flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-black bg-[#f5f5f5] ring-2 ring-white',
					},
					() => [
						h(Avatar.Image, {
							src: 'https://i.pravatar.cc/150?img=1',
							alt: 'User 1',
							class: 'size-full object-cover',
						}),
						h(Avatar.Fallback, { class: 'text-sm font-medium text-black select-none' }, () => 'U1'),
					],
				),
				h(
					Avatar.Root,
					{
						class: 'relative inline-flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-black bg-[#f5f5f5] ring-2 ring-white',
					},
					() => [
						h(Avatar.Fallback, { class: 'text-sm font-medium text-black select-none' }, () => 'JD'),
					],
				),
				h(
					Avatar.Root,
					{
						class: 'relative inline-flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-black bg-black ring-2 ring-white',
					},
					() => [
						h(Avatar.Fallback, { class: 'text-xs font-medium text-white' }, () => '+9'),
					],
				),
			]),
	}),
};

const rootCls =
	'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-black bg-[#f5f5f5]';

export const Composed: StoryObj = {
	render: () => ({
		setup: () => () =>
			h('div', { class: 'flex items-end gap-6' }, [
				// Loaded image
				h('div', { class: 'flex flex-col items-center gap-2' }, [
					h(Avatar.Root, { class: `${rootCls} size-10` }, () => [
						h(Avatar.Image, {
							src: 'https://i.pravatar.cc/150?img=5',
							alt: 'Loaded',
							class: 'size-full object-cover',
						}),
						h(Avatar.Fallback, { class: 'text-sm font-medium text-black select-none' }, () => 'AB'),
					]),
					h('span', { class: 'text-xs text-[#6b7280]' }, 'Image'),
				]),

				// Initials fallback
				h('div', { class: 'flex flex-col items-center gap-2' }, [
					h(Avatar.Root, { class: `${rootCls} size-10` }, () => [
						h(Avatar.Fallback, { class: 'text-sm font-medium text-black select-none' }, () => 'JD'),
					]),
					h('span', { class: 'text-xs text-[#6b7280]' }, 'Initials'),
				]),

				// Broken src falls back
				h('div', { class: 'flex flex-col items-center gap-2' }, [
					h(Avatar.Root, { class: `${rootCls} size-10` }, () => [
						h(Avatar.Image, {
							src: 'https://invalid.example/nope.png',
							alt: 'Broken',
							class: 'size-full object-cover',
						}),
						h(Avatar.Fallback, { class: 'text-sm font-medium text-black select-none' }, () => '!'),
					]),
					h('span', { class: 'text-xs text-[#6b7280]' }, 'Error'),
				]),

				// Sizes
				h('div', { class: 'flex flex-col items-center gap-2' }, [
					h('div', { class: 'flex items-end gap-2' }, [
						h(Avatar.Root, { class: `${rootCls} size-6` }, () => [
							h(Avatar.Image, {
								src: 'https://i.pravatar.cc/150?img=8',
								alt: 'Small',
								class: 'size-full object-cover',
							}),
							h(Avatar.Fallback, { class: 'text-[10px] font-medium text-black select-none' }, () => 'S'),
						]),
						h(Avatar.Root, { class: `${rootCls} size-10` }, () => [
							h(Avatar.Image, {
								src: 'https://i.pravatar.cc/150?img=8',
								alt: 'Medium',
								class: 'size-full object-cover',
							}),
							h(Avatar.Fallback, { class: 'text-sm font-medium text-black select-none' }, () => 'M'),
						]),
						h(Avatar.Root, { class: `${rootCls} size-16` }, () => [
							h(Avatar.Image, {
								src: 'https://i.pravatar.cc/150?img=8',
								alt: 'Large',
								class: 'size-full object-cover',
							}),
							h(Avatar.Fallback, { class: 'text-lg font-medium text-black select-none' }, () => 'L'),
						]),
					]),
					h('span', { class: 'text-xs text-[#6b7280]' }, 'Sizes'),
				]),
			]),
	}),
};

export const Complex: StoryObj = {
	render: () => ({
		setup() {
			const members = [
				{ name: 'Ada Lovelace', role: 'Engineering', img: 'https://i.pravatar.cc/150?img=1', online: true },
				{ name: 'Grace Hopper', role: 'Design', img: '', online: true },
				{ name: 'Alan Turing', role: 'Research', img: 'https://i.pravatar.cc/150?img=12', online: false },
			];

			const initials = (name: string) =>
				name
					.split(' ')
					.map((n) => n[0])
					.join('');

			return () =>
				h('div', { class: 'w-72 rounded-xl border border-[#e5e7eb] bg-white p-2' }, [
					h(
						'p',
						{ class: 'px-2 py-1.5 text-xs font-medium uppercase tracking-wide text-[#6b7280]' },
						'Team',
					),
					...members.map((m) =>
						h(
							'div',
							{
								key: m.name,
								class: 'flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-[#f5f5f5]',
							},
							[
								h('div', { class: 'relative' }, [
									h(Avatar.Root, { class: `${rootCls} size-10` }, () => [
										h(Avatar.Image, {
											src: m.img,
											alt: m.name,
											class: 'size-full object-cover',
										}),
										h(
											Avatar.Fallback,
											{ class: 'text-sm font-medium text-black select-none' },
											() => initials(m.name),
										),
									]),
									h('span', {
										class: `absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-white ${
											m.online ? 'bg-green-500' : 'bg-[#9ca3af]'
										}`,
									}),
								]),
								h('div', { class: 'min-w-0' }, [
									h('p', { class: 'truncate text-sm font-medium text-black' }, m.name),
									h('p', { class: 'truncate text-xs text-[#6b7280]' }, m.role),
								]),
							],
						),
					),
				]);
		},
	}),
};
