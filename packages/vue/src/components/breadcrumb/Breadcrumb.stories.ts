import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h } from 'vue';
import { Breadcrumb } from '.';

const meta = {
	title: 'Layout/Breadcrumb',
	component: Breadcrumb.Root,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'Navigation trail with semantic <nav> + <ol>, current-page marking, and customizable separator.',
			},
		},
	},
} satisfies Meta<typeof Breadcrumb.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const linkCls = 'text-sm text-[#6b7280] hover:text-black hover:underline';
const itemCurrentCls = 'text-sm font-medium text-black';
const sepCls = 'mx-2 text-[#6b7280]';
const listCls = 'flex items-center';

export const Default: Story = {
	render: () => ({
		setup: () => () =>
			h(Breadcrumb.Root, {}, () => [
				h(Breadcrumb.List, { class: listCls }, () => [
					h(Breadcrumb.Item, {}, () => [
						h(Breadcrumb.Link, { href: '#', class: linkCls }, () => 'Home'),
					]),
					h(Breadcrumb.Separator, { class: sepCls }),
					h(Breadcrumb.Item, {}, () => [
						h(Breadcrumb.Link, { href: '#', class: linkCls }, () => 'Settings'),
					]),
					h(Breadcrumb.Separator, { class: sepCls }),
					h(Breadcrumb.Item, { current: true, class: itemCurrentCls }, () => 'Profile'),
				]),
			]),
	}),
};

export const Composed: Story = {
	render: () => ({
		setup: () => () =>
			h(Breadcrumb.Root, {}, () => [
				h(Breadcrumb.List, { class: listCls }, () => [
					h(Breadcrumb.Item, {}, () => [
						h(Breadcrumb.Link, { href: '#', class: linkCls }, () => 'Home'),
					]),
					h(Breadcrumb.Separator, { class: sepCls }, () => '›'),
					h(Breadcrumb.Item, {}, () => [
						h(Breadcrumb.Link, { href: '#', class: linkCls }, () => 'Docs'),
					]),
					h(Breadcrumb.Separator, { class: sepCls }, () => '›'),
					h(Breadcrumb.Item, {}, () => [
						h(Breadcrumb.Link, { href: '#', class: linkCls }, () => 'Components'),
					]),
					h(Breadcrumb.Separator, { class: sepCls }, () => '›'),
					h(Breadcrumb.Item, { current: true, class: itemCurrentCls }, () => 'Breadcrumb'),
				]),
			]),
	}),
};

const homeIcon = () =>
	h('svg', { class: 'size-4', viewBox: '0 0 20 20', fill: 'currentColor' }, [
		h('path', { d: 'M10 2L2 9h2v7h4v-5h4v5h4V9h2L10 2z' }),
	]);

const arrowIcon = () =>
	h('svg', { class: 'inline size-3', viewBox: '0 0 20 20', fill: 'currentColor' }, [
		h('path', { d: 'M7 5l5 5-5 5V5z' }),
	]);

export const Complex: Story = {
	render: () => ({
		setup: () => () =>
			h(Breadcrumb.Root, {}, () => [
				h(Breadcrumb.List, { class: listCls }, () => [
					h(Breadcrumb.Item, {}, () => [
						h(
							Breadcrumb.Link,
							{ href: '#', class: `${linkCls} flex items-center gap-1` },
							() => [homeIcon(), 'Home'],
						),
					]),
					h(Breadcrumb.Separator, { class: sepCls }, () => arrowIcon()),
					h(Breadcrumb.Item, {}, () => [
						h(Breadcrumb.Link, { href: '#', class: linkCls }, () => 'Projects'),
					]),
					h(Breadcrumb.Separator, { class: sepCls }, () => arrowIcon()),
					h(Breadcrumb.Item, {}, () => [
						h('span', { class: 'text-sm text-[#6b7280]' }, '…'),
					]),
					h(Breadcrumb.Separator, { class: sepCls }, () => arrowIcon()),
					h(Breadcrumb.Item, { current: true, class: itemCurrentCls }, () => 'Q4 Roadmap'),
				]),
			]),
	}),
};
