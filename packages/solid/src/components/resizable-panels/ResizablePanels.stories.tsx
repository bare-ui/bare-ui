import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { ResizablePanels } from './ResizablePanels';

const meta = {
	title: 'Layout/ResizablePanels',
	component: ResizablePanels.Group,
	subcomponents: {
		'ResizablePanels.Panel': ResizablePanels.Panel,
		'ResizablePanels.Handle': ResizablePanels.Handle,
	},
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Drag-to-resize panel layout. Horizontal or vertical, with min/max size constraints per panel.',
			},
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
		<div
			style={{ width: '100%', height: '250px' }}
			class='border border-black rounded-[8px] overflow-hidden'>
			<ResizablePanels.Group orientation='horizontal'>
				<ResizablePanels.Panel
					defaultSize={50}
					class={panelCls}>
					Left
				</ResizablePanels.Panel>
				<ResizablePanels.Handle class={handleHCls} />
				<ResizablePanels.Panel
					defaultSize={50}
					class={panelCls}>
					Right
				</ResizablePanels.Panel>
			</ResizablePanels.Group>
		</div>
	),
};

export const Composed: Story = {
	render: () => (
		<div
			style={{ width: '100%', height: '250px' }}
			class='border border-black rounded-[8px] overflow-hidden'>
			<ResizablePanels.Group orientation='vertical'>
				<ResizablePanels.Panel
					defaultSize={30}
					class={panelCls}>
					Top
				</ResizablePanels.Panel>
				<ResizablePanels.Handle class={handleVCls} />
				<ResizablePanels.Panel
					defaultSize={70}
					class={panelCls}>
					Bottom
				</ResizablePanels.Panel>
			</ResizablePanels.Group>
		</div>
	),
};

export const Complex: Story = {
	render: () => (
		<div
			style={{ width: '100%', height: '320px' }}
			class='border border-black rounded-[8px] overflow-hidden'>
			<ResizablePanels.Group orientation='horizontal'>
				<ResizablePanels.Panel
					defaultSize={20}
					minSize={10}
					maxSize={40}
					class={`${panelCls} flex-col items-start gap-1 p-3`}>
					<p class='text-xs font-medium uppercase tracking-wide text-[#6b7280]'>Sidebar</p>
					<p class='text-xs text-black'>Files</p>
					<p class='text-xs text-black'>Search</p>
					<p class='text-xs text-black'>Git</p>
				</ResizablePanels.Panel>
				<ResizablePanels.Handle class={handleHCls} />
				<ResizablePanels.Panel defaultSize={80}>
					<ResizablePanels.Group orientation='vertical'>
						<ResizablePanels.Panel
							defaultSize={70}
							minSize={30}
							class={`${panelCls} text-xs`}>
							Editor
						</ResizablePanels.Panel>
						<ResizablePanels.Handle class={handleVCls} />
						<ResizablePanels.Panel
							defaultSize={30}
							minSize={10}
							class={`${panelCls} text-xs`}>
							Terminal
						</ResizablePanels.Panel>
					</ResizablePanels.Group>
				</ResizablePanels.Panel>
			</ResizablePanels.Group>
		</div>
	),
};
