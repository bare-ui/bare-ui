import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h } from 'vue';
import { NavigationMenu } from '.';

const meta = {
	title: 'Layout/NavigationMenu',
	component: NavigationMenu.Root,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: { component: 'Top navigation with hover-driven dropdown panels (mega menu support).' },
		},
	},
} satisfies Meta<typeof NavigationMenu.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const navCls = 'inline-flex items-center gap-1 rounded-[8px] border border-black bg-white px-2 py-1.5';
const listCls = 'flex items-center gap-1';
const triggerCls =
	'cursor-pointer rounded-[6px] px-3 py-1 text-sm font-medium text-black outline-none hover:bg-[#f5f5f5] data-[state=open]:bg-[#f5f5f5]';
const linkCls =
	'cursor-pointer rounded-[6px] px-3 py-1 text-sm font-medium text-black outline-none hover:bg-[#f5f5f5] data-[active]:bg-black data-[active]:text-white';
const contentCls =
	'absolute left-0 top-full z-10 mt-2 min-w-[280px] rounded-[20px] border border-black bg-white p-3';

export const Default: Story = {
	render: () => ({
		setup: () => () =>
			h(NavigationMenu.Root, { class: navCls }, () => [
				h(NavigationMenu.List, { class: listCls }, () => [
					h(NavigationMenu.Item, {}, () => [
						h(NavigationMenu.Link, { href: '#home', active: true, class: linkCls }, () => 'Home'),
					]),
					h(NavigationMenu.Item, { value: 'products' }, () => [
						h('div', { class: 'relative' }, [
							h(NavigationMenu.Trigger, { class: triggerCls }, () => 'Products'),
							h(NavigationMenu.Content, { class: contentCls }, () => [
								h('div', { class: 'flex flex-col gap-1' }, [
									h(
										NavigationMenu.Link,
										{
											href: '#design',
											class: 'block rounded-[6px] px-3 py-2 text-sm text-black hover:bg-[#f5f5f5]',
										},
										() => [
											h('p', { class: 'font-medium' }, 'Design'),
											h('p', { class: 'text-xs text-[#6b7280]' }, 'Templates and components'),
										],
									),
									h(
										NavigationMenu.Link,
										{
											href: '#dev',
											class: 'block rounded-[6px] px-3 py-2 text-sm text-black hover:bg-[#f5f5f5]',
										},
										() => [
											h('p', { class: 'font-medium' }, 'Develop'),
											h('p', { class: 'text-xs text-[#6b7280]' }, 'SDKs and APIs'),
										],
									),
								]),
							]),
						]),
					]),
					h(NavigationMenu.Item, {}, () => [
						h(NavigationMenu.Link, { href: '#pricing', class: linkCls }, () => 'Pricing'),
					]),
				]),
			]),
	}),
};

export const Composed: Story = {
	render: () => ({
		setup: () => () =>
			h(NavigationMenu.Root, { class: navCls }, () => [
				h(NavigationMenu.List, { class: listCls }, () => [
					h(NavigationMenu.Item, { value: 'solutions' }, () => [
						h('div', { class: 'relative' }, [
							h(NavigationMenu.Trigger, { class: triggerCls }, () => 'Solutions'),
							h(
								NavigationMenu.Content,
								{
									class: 'absolute left-0 top-full z-10 mt-2 grid w-[420px] grid-cols-2 gap-1 rounded-[20px] border border-black bg-white p-3',
								},
								() =>
									[
										{ title: 'For Engineers', desc: 'Ship faster with primitives' },
										{ title: 'For Designers', desc: 'Match Figma to code' },
										{ title: 'For Teams', desc: 'Shared design system' },
										{ title: 'For Enterprise', desc: 'Audit-ready and accessible' },
									].map((it) =>
										h(
											NavigationMenu.Link,
											{
												key: it.title,
												href: '#',
												class: 'block rounded-[6px] px-3 py-2 text-sm text-black hover:bg-[#f5f5f5]',
											},
											() => [
												h('p', { class: 'font-medium' }, it.title),
												h('p', { class: 'text-xs text-[#6b7280]' }, it.desc),
											],
										),
									),
							),
						]),
					]),
					h(NavigationMenu.Item, { value: 'resources' }, () => [
						h('div', { class: 'relative' }, [
							h(NavigationMenu.Trigger, { class: triggerCls }, () => 'Resources'),
							h(NavigationMenu.Content, { class: contentCls }, () => [
								h('div', { class: 'flex flex-col gap-1' }, [
									h(
										NavigationMenu.Link,
										{
											href: '#docs',
											class: 'block rounded-[6px] px-3 py-2 text-sm text-black hover:bg-[#f5f5f5]',
										},
										() => 'Docs',
									),
									h(
										NavigationMenu.Link,
										{
											href: '#blog',
											class: 'block rounded-[6px] px-3 py-2 text-sm text-black hover:bg-[#f5f5f5]',
										},
										() => 'Blog',
									),
									h(
										NavigationMenu.Link,
										{
											href: '#support',
											class: 'block rounded-[6px] px-3 py-2 text-sm text-black hover:bg-[#f5f5f5]',
										},
										() => 'Support',
									),
								]),
							]),
						]),
					]),
				]),
			]),
	}),
};

export const Complex: Story = {
	render: () => ({
		setup: () => () =>
			h(
				NavigationMenu.Root,
				{
					class: 'flex w-full max-w-3xl items-center justify-between rounded-[8px] border border-black bg-white px-3 py-2',
				},
				() => [
					h('div', { class: 'flex items-center gap-1' }, [
						h('span', { class: 'px-2 py-1 text-sm font-bold text-black' }, 'wire-ui'),
						h(NavigationMenu.List, { class: listCls }, () => [
							h(NavigationMenu.Item, { value: 'product' }, () => [
								h('div', { class: 'relative' }, [
									h(NavigationMenu.Trigger, { class: triggerCls }, () => 'Product'),
									h(
										NavigationMenu.Content,
										{
											class: 'absolute left-0 top-full z-10 mt-2 grid w-[480px] grid-cols-2 gap-1 rounded-[20px] border border-black bg-white p-3',
										},
										() =>
											[
												{ title: 'Components', desc: '50+ headless primitives', href: '#components' },
												{ title: 'Hooks', desc: 'Reusable behaviors', href: '#hooks' },
												{ title: 'Theming', desc: 'data-* style hooks', href: '#theming' },
												{ title: 'CLI', desc: 'Scaffold a starter', href: '#cli' },
											].map((it) =>
												h(
													NavigationMenu.Link,
													{
														key: it.title,
														href: it.href,
														class: 'block rounded-[6px] px-3 py-2 text-sm text-black hover:bg-[#f5f5f5]',
													},
													() => [
														h('p', { class: 'font-medium' }, it.title),
														h('p', { class: 'text-xs text-[#6b7280]' }, it.desc),
													],
												),
											),
									),
								]),
							]),
							h(NavigationMenu.Item, {}, () => [
								h(NavigationMenu.Link, { href: '#docs', class: linkCls }, () => 'Docs'),
							]),
							h(NavigationMenu.Item, {}, () => [
								h(
									NavigationMenu.Link,
									{ href: '#showcase', active: true, class: linkCls },
									() => 'Showcase',
								),
							]),
						]),
					]),
					h(NavigationMenu.List, { class: 'flex items-center gap-2' }, () => [
						h(NavigationMenu.Item, {}, () => [
							h(NavigationMenu.Link, { href: '#login', class: linkCls }, () => 'Sign in'),
						]),
						h(NavigationMenu.Item, {}, () => [
							h(
								NavigationMenu.Link,
								{
									href: '#start',
									class: 'rounded-[6px] border border-black bg-black px-3 py-1 text-sm font-medium text-white hover:bg-[#333]',
								},
								() => 'Get started',
							),
						]),
					]),
				],
			),
	}),
};
