import type { Meta, StoryObj } from '@storybook/react-vite';
import { ContextMenu } from './ContextMenu';

const meta = {
	title: 'Overlays/ContextMenu',
	component: ContextMenu.Root,
	tags: ['autodocs'],
	parameters: {
		docs: { description: { component: 'Right-click triggered menu. Positioned at the cursor; closes on outside click or Escape.' } },
	},
} satisfies Meta<typeof ContextMenu.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const triggerCls = 'flex h-32 w-72 items-center justify-center rounded-[20px] border border-dashed border-black bg-[#f5f5f5] text-sm text-[#6b7280] select-none';
const contentCls = 'min-w-[180px] rounded-[20px] border border-black bg-white p-1';
const itemCls = 'cursor-pointer rounded-[8px] px-3 py-1.5 text-sm text-black outline-none hover:bg-[#f5f5f5] data-[focus-visible]:bg-[#f5f5f5] data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40';
const sepCls = 'my-1 h-px bg-black';

export const Default: Story = {
	render: () => (
		<ContextMenu.Root>
			<ContextMenu.Trigger className={triggerCls}>Right-click here</ContextMenu.Trigger>
			<ContextMenu.Content className={contentCls}>
				<ContextMenu.Item className={itemCls} onSelect={() => alert('Cut')}>Cut</ContextMenu.Item>
				<ContextMenu.Item className={itemCls} onSelect={() => alert('Copy')}>Copy</ContextMenu.Item>
				<ContextMenu.Item className={itemCls} onSelect={() => alert('Paste')}>Paste</ContextMenu.Item>
			</ContextMenu.Content>
		</ContextMenu.Root>
	),
};

export const Composed: Story = {
	render: () => (
		<ContextMenu.Root>
			<ContextMenu.Trigger className={triggerCls}>Right-click for actions</ContextMenu.Trigger>
			<ContextMenu.Content className={contentCls}>
				<ContextMenu.Item className={itemCls}>Open</ContextMenu.Item>
				<ContextMenu.Item className={itemCls}>Open in new tab</ContextMenu.Item>
				<ContextMenu.Separator className={sepCls} />
				<ContextMenu.Item className={itemCls}>Rename</ContextMenu.Item>
				<ContextMenu.Item className={itemCls}>Duplicate</ContextMenu.Item>
				<ContextMenu.Separator className={sepCls} />
				<ContextMenu.Item className={itemCls}>Delete</ContextMenu.Item>
			</ContextMenu.Content>
		</ContextMenu.Root>
	),
};

export const Complex: Story = {
	render: () => (
		<ContextMenu.Root>
			<ContextMenu.Trigger className={triggerCls}>
				<div className='text-center'>
					<p className='text-sm font-medium text-black'>image.png</p>
					<p className='text-xs text-[#6b7280]'>Right-click for options</p>
				</div>
			</ContextMenu.Trigger>
			<ContextMenu.Content className={contentCls}>
				<ContextMenu.Item className={itemCls}>
					<div className='flex items-center justify-between gap-6'>
						<span>Open</span>
						<kbd className='text-[10px] text-[#6b7280]'>⏎</kbd>
					</div>
				</ContextMenu.Item>
				<ContextMenu.Item className={itemCls}>
					<div className='flex items-center justify-between gap-6'>
						<span>Copy</span>
						<kbd className='text-[10px] text-[#6b7280]'>⌘C</kbd>
					</div>
				</ContextMenu.Item>
				<ContextMenu.Item className={itemCls}>
					<div className='flex items-center justify-between gap-6'>
						<span>Move to…</span>
						<span className='text-[10px] text-[#6b7280]'>›</span>
					</div>
				</ContextMenu.Item>
				<ContextMenu.Separator className={sepCls} />
				<ContextMenu.Item className={itemCls} disabled>Move to trash</ContextMenu.Item>
			</ContextMenu.Content>
		</ContextMenu.Root>
	),
};
