import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toast, useToast } from './Toast';

const meta = {
	title: 'Feedback/Toast',
	component: Toast.Provider,
	subcomponents: {
		'Toast.Viewport': Toast.Viewport,
		'Toast.Root': Toast.Root,
		'Toast.Title': Toast.Title,
		'Toast.Description': Toast.Description,
		'Toast.Close': Toast.Close,
	},
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Imperative notification system. Wrap your app in <Toast.Provider>, render <Toast.Viewport>, and call useToast().toast(...) from anywhere.',
			},
		},
	},
} satisfies Meta<typeof Toast.Provider>;

export default meta;
type Story = StoryObj<typeof meta>;

const triggerCls =
	'inline-flex cursor-pointer items-center rounded-[8px] border border-black bg-black px-4 py-2 text-sm font-medium text-white hover:bg-[#333]';

const toastCls =
	'flex items-start gap-3 rounded-[8px] border border-black bg-white px-4 py-3 shadow-sm w-80 data-[status=success]:bg-[#f5f5f5] data-[status=warning]:bg-[#f5f5f5] data-[status=danger]:bg-[#f5f5f5]';

const closeCls =
	'shrink-0 rounded-[8px] p-1 text-black hover:bg-[#e5e5e5] [data-focus-visible]:ring-2 [data-focus-visible]:ring-black';

const viewportCls = 'fixed bottom-4 right-4 z-50 flex flex-col gap-2';

const Demo = () => {
	const { toast } = useToast();
	return (
		<div className='flex flex-wrap gap-2'>
			<button
				className={triggerCls}
				onClick={() => toast({ title: 'Saved', description: 'Your changes are saved.', status: 'success' })}>
				Show success
			</button>
			<button
				className={triggerCls}
				onClick={() =>
					toast({ title: 'Heads up', description: 'You have unsaved changes.', status: 'warning' })
				}>
				Show warning
			</button>
			<button
				className={triggerCls}
				onClick={() => toast({ title: 'Error', description: 'Something went wrong.', status: 'danger' })}>
				Show error
			</button>
		</div>
	);
};

const PersistentDemo = () => {
	const { toast } = useToast();
	return (
		<button
			className={triggerCls}
			onClick={() =>
				toast({
					id: 'persistent',
					title: 'Persistent',
					description: 'This toast stays until dismissed.',
					duration: 0,
				})
			}>
			Show persistent
		</button>
	);
};

const ToastUI = ({
	title,
	description,
	dismiss,
}: {
	title: React.ReactNode;
	description?: React.ReactNode;
	dismiss: () => void;
}) => (
	<Toast.Root className={toastCls}>
		<div className='flex-1'>
			{title && <Toast.Title className='text-sm font-semibold text-black'>{title}</Toast.Title>}
			{description && <Toast.Description className='mt-0.5 text-sm text-[#6b7280]'>{description}</Toast.Description>}
		</div>
		<Toast.Close className={closeCls} onClick={dismiss}>×</Toast.Close>
	</Toast.Root>
);

export const Default: Story = {
	render: () => (
		<Toast.Provider>
			<Demo />
			<Toast.Viewport className={viewportCls}>
				{(t, dismiss) => <ToastUI key={t.id} title={t.title} description={t.description} dismiss={dismiss} />}
			</Toast.Viewport>
		</Toast.Provider>
	),
};

export const Composed: Story = {
	render: () => (
		<Toast.Provider defaultDuration={3000}>
			<PersistentDemo />
			<p className='mt-3 text-xs text-[#6b7280]'>
				Default toasts auto-dismiss after 3s. Persistent toast stays until you close it.
			</p>
			<Toast.Viewport className={viewportCls}>
				{(t, dismiss) => <ToastUI key={t.id} title={t.title} description={t.description} dismiss={dismiss} />}
			</Toast.Viewport>
		</Toast.Provider>
	),
};

const StackingDemo = () => {
	const { toast } = useToast();
	return (
		<button
			className={triggerCls}
			onClick={() => {
				toast({ title: 'Uploaded', description: 'design-mock.png', status: 'success' });
				setTimeout(() => toast({ title: 'Synced', description: 'All changes pushed.' }), 250);
				setTimeout(
					() => toast({ title: 'Reminder', description: 'You have a meeting in 10 min.' }),
					500,
				);
			}}>
			Stack 3 toasts
		</button>
	);
};

export const Complex: Story = {
	render: () => (
		<Toast.Provider defaultDuration={5000}>
			<StackingDemo />
			<Toast.Viewport className={viewportCls}>
				{(t, dismiss) => (
					<Toast.Root key={t.id} className={toastCls}>
						<div className='flex-1'>
							<div className='flex items-center gap-2'>
								<span
									className='inline-block size-2 rounded-full data-[status=success]:bg-black data-[status=warning]:bg-black data-[status=danger]:bg-black'
									data-status={t.status ?? 'default'}
								/>
								<Toast.Title className='text-sm font-semibold text-black'>{t.title}</Toast.Title>
							</div>
							{t.description && (
								<Toast.Description className='mt-1 text-sm text-[#6b7280]'>
									{t.description}
								</Toast.Description>
							)}
						</div>
						<Toast.Close className={closeCls} onClick={dismiss}>×</Toast.Close>
					</Toast.Root>
				)}
			</Toast.Viewport>
		</Toast.Provider>
	),
};
