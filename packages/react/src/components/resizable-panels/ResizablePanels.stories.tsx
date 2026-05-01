import type { Meta, StoryObj } from '@storybook/react-vite';
import { ResizablePanels } from './ResizablePanels';

const meta = {
	title: 'Layout/ResizablePanels',
	component: ResizablePanels.Group,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: { component: 'Drag-to-resize panel layout. Horizontal or vertical, with min/max size constraints per panel.' },
		},
	},
} satisfies Meta<typeof ResizablePanels.Group>;

export default meta;
type Story = StoryObj<typeof meta>;

const panelCls = 'flex items-center justify-center bg-[#f5f5f5] text-sm font-medium text-black';
const handleHCls = 'w-px bg-black hover:w-1 hover:bg-black transition-all';
const handleVCls = 'h-px bg-black hover:h-1 hover:bg-black transition-all';

export const Default: Story = {
	render: () => (
		<div style={{ width: '100%', height: 250 }} className='border border-black rounded-[8px] overflow-hidden'>
			<ResizablePanels.Group orientation='horizontal'>
				<ResizablePanels.Panel defaultSize={50} className={panelCls}>Left</ResizablePanels.Panel>
				<ResizablePanels.Handle className={handleHCls} />
				<ResizablePanels.Panel defaultSize={50} className={panelCls}>Right</ResizablePanels.Panel>
			</ResizablePanels.Group>
		</div>
	),
};

export const Composed: Story = {
	render: () => (
		<div style={{ width: '100%', height: 250 }} className='border border-black rounded-[8px] overflow-hidden'>
			<ResizablePanels.Group orientation='vertical'>
				<ResizablePanels.Panel defaultSize={30} className={panelCls}>Top</ResizablePanels.Panel>
				<ResizablePanels.Handle className={handleVCls} />
				<ResizablePanels.Panel defaultSize={70} className={panelCls}>Bottom</ResizablePanels.Panel>
			</ResizablePanels.Group>
		</div>
	),
};

export const Complex: Story = {
	render: () => (
		<div style={{ width: '100%', height: 320 }} className='border border-black rounded-[8px] overflow-hidden'>
			<ResizablePanels.Group orientation='horizontal'>
				<ResizablePanels.Panel defaultSize={20} minSize={10} maxSize={40} className={`${panelCls} flex-col items-start gap-1 p-3`}>
					<p className='text-xs font-medium uppercase tracking-wide text-[#6b7280]'>Sidebar</p>
					<p className='text-xs text-black'>Files</p>
					<p className='text-xs text-black'>Search</p>
					<p className='text-xs text-black'>Git</p>
				</ResizablePanels.Panel>
				<ResizablePanels.Handle className={handleHCls} />
				<ResizablePanels.Panel defaultSize={80}>
					<ResizablePanels.Group orientation='vertical'>
						<ResizablePanels.Panel defaultSize={70} minSize={30} className={`${panelCls} text-xs`}>
							Editor
						</ResizablePanels.Panel>
						<ResizablePanels.Handle className={handleVCls} />
						<ResizablePanels.Panel defaultSize={30} minSize={10} className={`${panelCls} text-xs`}>
							Terminal
						</ResizablePanels.Panel>
					</ResizablePanels.Group>
				</ResizablePanels.Panel>
			</ResizablePanels.Group>
		</div>
	),
};
