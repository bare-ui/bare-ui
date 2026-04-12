import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';

const meta = {
	title: 'Components/Button',
	component: Button,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'A native button with full interactive state tracking and asChild polymorphism.',
			},
		},
	},
} satisfies Meta<typeof Button>;

export default meta;

const btnCls = [
	'inline-flex cursor-pointer items-center justify-center rounded-[8px] border-2 border-black px-4 py-2',
	'bg-[#f5f5f5] text-sm font-medium text-black outline-none transition-colors',
	'[data-hover]:bg-black [data-hover]:text-white',
	'[data-active]:scale-95',
	'[data-focus-visible]:ring-2 [data-focus-visible]:ring-blue-500 [data-focus-visible]:ring-offset-2',
	'[data-disabled]:cursor-not-allowed [data-disabled]:opacity-50',
].join(' ');

export const Default: StoryObj = {
	render: () => <Button>Button</Button>,
};

export const Styled: StoryObj = {
	render: () => <Button className={btnCls}>Styled Button</Button>,
};

export const Disabled: StoryObj = {
	render: () => (
		<Button disabled className={btnCls}>
			Disabled Button
		</Button>
	),
};

export const AsChildAnchor: StoryObj = {
	render: () => (
		<Button asChild>
			<a
				href='https://example.com'
				target='_blank'
				rel='noopener noreferrer'
				className={btnCls.replace('cursor-pointer', 'no-underline')}>
				Open example.com →
			</a>
		</Button>
	),
};

function CustomLink({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
	return (
		<a href={href} {...props}>
			{children}
		</a>
	);
}

export const AsChildCustomComponent: StoryObj = {
	render: () => (
		<Button asChild>
			<CustomLink href='#custom' className={btnCls}>
				Custom Link Component
			</CustomLink>
		</Button>
	),
};

export const AutoFocus: StoryObj = {
	render: () => (
		<Button
			autoFocus
			className={[
				'inline-flex cursor-pointer items-center justify-center rounded-[8px] border-2 border-black px-4 py-2',
				'bg-[#f5f5f5] text-sm font-medium text-black outline-none transition-colors',
				'[data-hover]:bg-black [data-hover]:text-white',
				'[data-autofocus]:ring-2 [data-autofocus]:ring-blue-500 [data-autofocus]:ring-offset-2',
			].join(' ')}>
			Auto-focused Button
		</Button>
	),
};

export const SubmitInForm: StoryObj = {
	render: () => (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				alert('Form submitted!');
			}}
			className='flex flex-col gap-3'>
			<input
				type='text'
				placeholder='Enter something...'
				className='rounded-[8px] border-2 border-black px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500'
			/>
			<Button type='submit' className={btnCls}>
				Submit
			</Button>
		</form>
	),
};

export const DataAttributesShowcase: StoryObj = {
	render: () => {
		return (
			<div className='flex flex-col gap-6'>
				<p className='text-sm text-[#9ca3af]'>
					Hover, click, tab to each button and inspect the DOM — data attributes appear/disappear in real time.
				</p>
				<div className='flex flex-wrap gap-4'>
					<Button
						className={[
							'cursor-pointer rounded-[8px] border-2 border-black bg-white px-4 py-2 text-sm text-black outline-none',
							'[data-hover]:bg-black [data-hover]:text-white',
							'[data-active]:scale-95',
							'[data-focus-visible]:ring-2 [data-focus-visible]:ring-blue-500',
						].join(' ')}>
						Hover me
					</Button>

					<Button
						className={[
							'cursor-pointer rounded-[8px] border-2 border-black bg-white px-4 py-2 text-sm text-black outline-none',
							'[data-hover]:bg-black [data-hover]:text-white',
							'[data-active]:scale-95',
							'[data-focus-visible]:ring-2 [data-focus-visible]:ring-blue-500',
						].join(' ')}>
						Tab to me
					</Button>

					<Button
						disabled
						className={[
							'cursor-not-allowed rounded-[8px] border-2 border-black bg-white px-4 py-2 text-sm text-black outline-none',
							'[data-disabled]:opacity-50',
						].join(' ')}>
						Disabled
					</Button>
				</div>
			</div>
		);
	},
};
