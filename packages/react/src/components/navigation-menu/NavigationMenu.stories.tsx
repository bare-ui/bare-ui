import type { Meta, StoryObj } from '@storybook/react-vite';
import { NavigationMenu } from './NavigationMenu';

const meta = {
	title: 'Layout/NavigationMenu',
	component: NavigationMenu.Root,
	tags: ['autodocs'],
	parameters: {
		docs: { description: { component: 'Top navigation with hover-driven dropdown panels (mega menu support).' } },
	},
} satisfies Meta<typeof NavigationMenu.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const navCls = 'inline-flex items-center gap-1 rounded-[8px] border border-black bg-white px-2 py-1.5';
const listCls = 'flex items-center gap-1';
const triggerCls = 'cursor-pointer rounded-[6px] px-3 py-1 text-sm font-medium text-black outline-none hover:bg-[#f5f5f5] data-[state=open]:bg-[#f5f5f5]';
const linkCls = 'cursor-pointer rounded-[6px] px-3 py-1 text-sm font-medium text-black outline-none hover:bg-[#f5f5f5] data-[active]:bg-black data-[active]:text-white';
const contentCls = 'absolute left-0 top-full z-10 mt-2 min-w-[280px] rounded-[20px] border border-black bg-white p-3';

export const Default: Story = {
	render: () => (
		<NavigationMenu.Root className={navCls}>
			<NavigationMenu.List className={listCls}>
				<NavigationMenu.Item>
					<NavigationMenu.Link href='#home' active className={linkCls}>Home</NavigationMenu.Link>
				</NavigationMenu.Item>
				<NavigationMenu.Item value='products'>
					<div className='relative'>
						<NavigationMenu.Trigger className={triggerCls}>Products</NavigationMenu.Trigger>
						<NavigationMenu.Content className={contentCls}>
							<div className='flex flex-col gap-1'>
								<NavigationMenu.Link href='#design' className='block rounded-[6px] px-3 py-2 text-sm text-black hover:bg-[#f5f5f5]'>
									<p className='font-medium'>Design</p>
									<p className='text-xs text-[#6b7280]'>Templates and components</p>
								</NavigationMenu.Link>
								<NavigationMenu.Link href='#dev' className='block rounded-[6px] px-3 py-2 text-sm text-black hover:bg-[#f5f5f5]'>
									<p className='font-medium'>Develop</p>
									<p className='text-xs text-[#6b7280]'>SDKs and APIs</p>
								</NavigationMenu.Link>
							</div>
						</NavigationMenu.Content>
					</div>
				</NavigationMenu.Item>
				<NavigationMenu.Item>
					<NavigationMenu.Link href='#pricing' className={linkCls}>Pricing</NavigationMenu.Link>
				</NavigationMenu.Item>
			</NavigationMenu.List>
		</NavigationMenu.Root>
	),
};

export const Composed: Story = {
	render: () => (
		<NavigationMenu.Root className={navCls}>
			<NavigationMenu.List className={listCls}>
				<NavigationMenu.Item value='solutions'>
					<div className='relative'>
						<NavigationMenu.Trigger className={triggerCls}>Solutions</NavigationMenu.Trigger>
						<NavigationMenu.Content className='absolute left-0 top-full z-10 mt-2 grid w-[420px] grid-cols-2 gap-1 rounded-[20px] border border-black bg-white p-3'>
							{[
								{ title: 'For Engineers', desc: 'Ship faster with primitives' },
								{ title: 'For Designers', desc: 'Match Figma to code' },
								{ title: 'For Teams', desc: 'Shared design system' },
								{ title: 'For Enterprise', desc: 'Audit-ready and accessible' },
							].map((it) => (
								<NavigationMenu.Link
									key={it.title}
									href='#'
									className='block rounded-[6px] px-3 py-2 text-sm text-black hover:bg-[#f5f5f5]'>
									<p className='font-medium'>{it.title}</p>
									<p className='text-xs text-[#6b7280]'>{it.desc}</p>
								</NavigationMenu.Link>
							))}
						</NavigationMenu.Content>
					</div>
				</NavigationMenu.Item>
				<NavigationMenu.Item value='resources'>
					<div className='relative'>
						<NavigationMenu.Trigger className={triggerCls}>Resources</NavigationMenu.Trigger>
						<NavigationMenu.Content className={contentCls}>
							<div className='flex flex-col gap-1'>
								<NavigationMenu.Link href='#docs' className='block rounded-[6px] px-3 py-2 text-sm text-black hover:bg-[#f5f5f5]'>Docs</NavigationMenu.Link>
								<NavigationMenu.Link href='#blog' className='block rounded-[6px] px-3 py-2 text-sm text-black hover:bg-[#f5f5f5]'>Blog</NavigationMenu.Link>
								<NavigationMenu.Link href='#support' className='block rounded-[6px] px-3 py-2 text-sm text-black hover:bg-[#f5f5f5]'>Support</NavigationMenu.Link>
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
		<NavigationMenu.Root className='flex w-full max-w-3xl items-center justify-between rounded-[8px] border border-black bg-white px-3 py-2'>
			<div className='flex items-center gap-1'>
				<span className='px-2 py-1 text-sm font-bold text-black'>wire-ui</span>
				<NavigationMenu.List className={listCls}>
					<NavigationMenu.Item value='product'>
						<div className='relative'>
							<NavigationMenu.Trigger className={triggerCls}>Product</NavigationMenu.Trigger>
							<NavigationMenu.Content className='absolute left-0 top-full z-10 mt-2 grid w-[480px] grid-cols-2 gap-1 rounded-[20px] border border-black bg-white p-3'>
								<NavigationMenu.Link href='#components' className='block rounded-[6px] px-3 py-2 text-sm text-black hover:bg-[#f5f5f5]'>
									<p className='font-medium'>Components</p>
									<p className='text-xs text-[#6b7280]'>50+ headless primitives</p>
								</NavigationMenu.Link>
								<NavigationMenu.Link href='#hooks' className='block rounded-[6px] px-3 py-2 text-sm text-black hover:bg-[#f5f5f5]'>
									<p className='font-medium'>Hooks</p>
									<p className='text-xs text-[#6b7280]'>Reusable behaviors</p>
								</NavigationMenu.Link>
								<NavigationMenu.Link href='#theming' className='block rounded-[6px] px-3 py-2 text-sm text-black hover:bg-[#f5f5f5]'>
									<p className='font-medium'>Theming</p>
									<p className='text-xs text-[#6b7280]'>data-* style hooks</p>
								</NavigationMenu.Link>
								<NavigationMenu.Link href='#cli' className='block rounded-[6px] px-3 py-2 text-sm text-black hover:bg-[#f5f5f5]'>
									<p className='font-medium'>CLI</p>
									<p className='text-xs text-[#6b7280]'>Scaffold a starter</p>
								</NavigationMenu.Link>
							</NavigationMenu.Content>
						</div>
					</NavigationMenu.Item>
					<NavigationMenu.Item>
						<NavigationMenu.Link href='#docs' className={linkCls}>Docs</NavigationMenu.Link>
					</NavigationMenu.Item>
					<NavigationMenu.Item>
						<NavigationMenu.Link href='#showcase' active className={linkCls}>Showcase</NavigationMenu.Link>
					</NavigationMenu.Item>
				</NavigationMenu.List>
			</div>
			<NavigationMenu.List className='flex items-center gap-2'>
				<NavigationMenu.Item>
					<NavigationMenu.Link href='#login' className={linkCls}>Sign in</NavigationMenu.Link>
				</NavigationMenu.Item>
				<NavigationMenu.Item>
					<NavigationMenu.Link href='#start' className='rounded-[6px] border border-black bg-black px-3 py-1 text-sm font-medium text-white hover:bg-[#333]'>
						Get started
					</NavigationMenu.Link>
				</NavigationMenu.Item>
			</NavigationMenu.List>
		</NavigationMenu.Root>
	),
};
