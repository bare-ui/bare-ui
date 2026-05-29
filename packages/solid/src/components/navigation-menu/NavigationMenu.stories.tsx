import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { For } from 'solid-js';
import { NavigationMenu } from './NavigationMenu';

const meta = {
	title: 'Layout/NavigationMenu',
	component: NavigationMenu.Root,
	subcomponents: {
		'NavigationMenu.List': NavigationMenu.List,
		'NavigationMenu.Item': NavigationMenu.Item,
		'NavigationMenu.Trigger': NavigationMenu.Trigger,
		'NavigationMenu.Content': NavigationMenu.Content,
		'NavigationMenu.Link': NavigationMenu.Link,
	},
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
const contentCls = 'absolute left-0 top-full z-10 mt-2 min-w-[280px] rounded-[20px] border border-black bg-white p-3';

export const Default: Story = {
	render: () => (
		<NavigationMenu.Root class={navCls}>
			<NavigationMenu.List class={listCls}>
				<NavigationMenu.Item>
					<NavigationMenu.Link
						href='#home'
						active
						class={linkCls}>
						Home
					</NavigationMenu.Link>
				</NavigationMenu.Item>
				<NavigationMenu.Item value='products'>
					<div class='relative'>
						<NavigationMenu.Trigger class={triggerCls}>Products</NavigationMenu.Trigger>
						<NavigationMenu.Content class={contentCls}>
							<div class='flex flex-col gap-1'>
								<NavigationMenu.Link
									href='#design'
									class='block rounded-[6px] px-3 py-2 text-sm text-black hover:bg-[#f5f5f5]'>
									<p class='font-medium'>Design</p>
									<p class='text-xs text-[#6b7280]'>Templates and components</p>
								</NavigationMenu.Link>
								<NavigationMenu.Link
									href='#dev'
									class='block rounded-[6px] px-3 py-2 text-sm text-black hover:bg-[#f5f5f5]'>
									<p class='font-medium'>Develop</p>
									<p class='text-xs text-[#6b7280]'>SDKs and APIs</p>
								</NavigationMenu.Link>
							</div>
						</NavigationMenu.Content>
					</div>
				</NavigationMenu.Item>
				<NavigationMenu.Item>
					<NavigationMenu.Link
						href='#pricing'
						class={linkCls}>
						Pricing
					</NavigationMenu.Link>
				</NavigationMenu.Item>
			</NavigationMenu.List>
		</NavigationMenu.Root>
	),
};

export const Composed: Story = {
	render: () => (
		<NavigationMenu.Root class={navCls}>
			<NavigationMenu.List class={listCls}>
				<NavigationMenu.Item value='solutions'>
					<div class='relative'>
						<NavigationMenu.Trigger class={triggerCls}>Solutions</NavigationMenu.Trigger>
						<NavigationMenu.Content class='absolute left-0 top-full z-10 mt-2 grid w-[420px] grid-cols-2 gap-1 rounded-[20px] border border-black bg-white p-3'>
							<For
								each={[
									{ title: 'For Engineers', desc: 'Ship faster with primitives' },
									{ title: 'For Designers', desc: 'Match Figma to code' },
									{ title: 'For Teams', desc: 'Shared design system' },
									{ title: 'For Enterprise', desc: 'Audit-ready and accessible' },
								]}>
								{(it) => (
									<NavigationMenu.Link
										href='#'
										class='block rounded-[6px] px-3 py-2 text-sm text-black hover:bg-[#f5f5f5]'>
										<p class='font-medium'>{it.title}</p>
										<p class='text-xs text-[#6b7280]'>{it.desc}</p>
									</NavigationMenu.Link>
								)}
							</For>
						</NavigationMenu.Content>
					</div>
				</NavigationMenu.Item>
				<NavigationMenu.Item value='resources'>
					<div class='relative'>
						<NavigationMenu.Trigger class={triggerCls}>Resources</NavigationMenu.Trigger>
						<NavigationMenu.Content class={contentCls}>
							<div class='flex flex-col gap-1'>
								<NavigationMenu.Link
									href='#docs'
									class='block rounded-[6px] px-3 py-2 text-sm text-black hover:bg-[#f5f5f5]'>
									Docs
								</NavigationMenu.Link>
								<NavigationMenu.Link
									href='#blog'
									class='block rounded-[6px] px-3 py-2 text-sm text-black hover:bg-[#f5f5f5]'>
									Blog
								</NavigationMenu.Link>
								<NavigationMenu.Link
									href='#support'
									class='block rounded-[6px] px-3 py-2 text-sm text-black hover:bg-[#f5f5f5]'>
									Support
								</NavigationMenu.Link>
							</div>
						</NavigationMenu.Content>
					</div>
				</NavigationMenu.Item>
			</NavigationMenu.List>
		</NavigationMenu.Root>
	),
};

export const Complex: Story = {
	render: () => (
		<NavigationMenu.Root class='flex w-full max-w-3xl items-center justify-between rounded-[8px] border border-black bg-white px-3 py-2'>
			<div class='flex items-center gap-1'>
				<span class='px-2 py-1 text-sm font-bold text-black'>wire-ui</span>
				<NavigationMenu.List class={listCls}>
					<NavigationMenu.Item value='product'>
						<div class='relative'>
							<NavigationMenu.Trigger class={triggerCls}>Product</NavigationMenu.Trigger>
							<NavigationMenu.Content class='absolute left-0 top-full z-10 mt-2 grid w-[480px] grid-cols-2 gap-1 rounded-[20px] border border-black bg-white p-3'>
								<NavigationMenu.Link
									href='#components'
									class='block rounded-[6px] px-3 py-2 text-sm text-black hover:bg-[#f5f5f5]'>
									<p class='font-medium'>Components</p>
									<p class='text-xs text-[#6b7280]'>50+ headless primitives</p>
								</NavigationMenu.Link>
								<NavigationMenu.Link
									href='#hooks'
									class='block rounded-[6px] px-3 py-2 text-sm text-black hover:bg-[#f5f5f5]'>
									<p class='font-medium'>Hooks</p>
									<p class='text-xs text-[#6b7280]'>Reusable behaviors</p>
								</NavigationMenu.Link>
								<NavigationMenu.Link
									href='#theming'
									class='block rounded-[6px] px-3 py-2 text-sm text-black hover:bg-[#f5f5f5]'>
									<p class='font-medium'>Theming</p>
									<p class='text-xs text-[#6b7280]'>data-* style hooks</p>
								</NavigationMenu.Link>
								<NavigationMenu.Link
									href='#cli'
									class='block rounded-[6px] px-3 py-2 text-sm text-black hover:bg-[#f5f5f5]'>
									<p class='font-medium'>CLI</p>
									<p class='text-xs text-[#6b7280]'>Scaffold a starter</p>
								</NavigationMenu.Link>
							</NavigationMenu.Content>
						</div>
					</NavigationMenu.Item>
					<NavigationMenu.Item>
						<NavigationMenu.Link
							href='#docs'
							class={linkCls}>
							Docs
						</NavigationMenu.Link>
					</NavigationMenu.Item>
					<NavigationMenu.Item>
						<NavigationMenu.Link
							href='#showcase'
							active
							class={linkCls}>
							Showcase
						</NavigationMenu.Link>
					</NavigationMenu.Item>
				</NavigationMenu.List>
			</div>
			<NavigationMenu.List class='flex items-center gap-2'>
				<NavigationMenu.Item>
					<NavigationMenu.Link
						href='#login'
						class={linkCls}>
						Sign in
					</NavigationMenu.Link>
				</NavigationMenu.Item>
				<NavigationMenu.Item>
					<NavigationMenu.Link
						href='#start'
						class='rounded-[6px] border border-black bg-black px-3 py-1 text-sm font-medium text-white hover:bg-[#333]'>
						Get started
					</NavigationMenu.Link>
				</NavigationMenu.Item>
			</NavigationMenu.List>
		</NavigationMenu.Root>
	),
};
