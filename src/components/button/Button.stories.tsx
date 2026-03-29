import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from './Button'

const meta = {
	title: 'Components/Button',
	component: Button,
	tags: ['autodocs'],
} satisfies Meta<typeof Button>

export default meta

// ---------------------------------------------------------------------------
// Default — renders an unstyled native <button>
// ---------------------------------------------------------------------------

export const Default: StoryObj = {
	render: () => <Button>Button</Button>,
}

// ---------------------------------------------------------------------------
// Styled — demonstrates data-attribute-driven styling with Tailwind
// ---------------------------------------------------------------------------

export const Styled: StoryObj = {
	render: () => (
		<Button
			className={[
				'inline-flex cursor-pointer items-center justify-center rounded-md px-4 py-2',
				'bg-indigo-600 text-sm font-medium text-white outline-none',
				'[data-hover]:bg-indigo-700',
				'[data-active]:scale-95',
				'[data-focus-visible]:ring-2 [data-focus-visible]:ring-indigo-400 [data-focus-visible]:ring-offset-2',
				'[data-disabled]:cursor-not-allowed [data-disabled]:opacity-50',
			].join(' ')}
		>
			Styled Button
		</Button>
	),
}

// ---------------------------------------------------------------------------
// Disabled
// ---------------------------------------------------------------------------

export const Disabled: StoryObj = {
	render: () => (
		<Button
			disabled
			className={[
				'inline-flex cursor-pointer items-center justify-center rounded-md px-4 py-2',
				'bg-indigo-600 text-sm font-medium text-white outline-none',
				'[data-hover]:bg-indigo-700',
				'[data-active]:scale-95',
				'[data-disabled]:cursor-not-allowed [data-disabled]:opacity-50',
			].join(' ')}
		>
			Disabled Button
		</Button>
	),
}

// ---------------------------------------------------------------------------
// AsChild with anchor — renders as <a> but with full Button behaviour
// ---------------------------------------------------------------------------

export const AsChildAnchor: StoryObj = {
	render: () => (
		<Button asChild>
			<a
				href="https://example.com"
				target="_blank"
				rel="noopener noreferrer"
				className={[
					'inline-flex cursor-pointer items-center justify-center rounded-md px-4 py-2',
					'bg-indigo-600 text-sm font-medium text-white no-underline outline-none',
					'[data-hover]:bg-indigo-700',
					'[data-active]:scale-95',
					'[data-focus-visible]:ring-2 [data-focus-visible]:ring-indigo-400 [data-focus-visible]:ring-offset-2',
				].join(' ')}
			>
				Open example.com →
			</a>
		</Button>
	),
}

// ---------------------------------------------------------------------------
// AsChild with a custom component
// ---------------------------------------------------------------------------

function CustomLink({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
	return (
		<a href={href} {...props}>
			{children}
		</a>
	)
}

export const AsChildCustomComponent: StoryObj = {
	render: () => (
		<Button asChild>
			<CustomLink
				href="#custom"
				className={[
					'inline-flex cursor-pointer items-center justify-center rounded-md px-4 py-2',
					'bg-emerald-600 text-sm font-medium text-white no-underline outline-none',
					'[data-hover]:bg-emerald-700',
					'[data-active]:scale-95',
					'[data-focus-visible]:ring-2 [data-focus-visible]:ring-emerald-400 [data-focus-visible]:ring-offset-2',
				].join(' ')}
			>
				Custom Link Component
			</CustomLink>
		</Button>
	),
}

// ---------------------------------------------------------------------------
// AutoFocus — data-autofocus applied when autoFocus prop is set
// ---------------------------------------------------------------------------

export const AutoFocus: StoryObj = {
	render: () => (
		<Button
			autoFocus
			className={[
				'inline-flex cursor-pointer items-center justify-center rounded-md px-4 py-2',
				'bg-indigo-600 text-sm font-medium text-white outline-none',
				'[data-hover]:bg-indigo-700',
				'[data-autofocus]:ring-2 [data-autofocus]:ring-yellow-400 [data-autofocus]:ring-offset-2',
			].join(' ')}
		>
			Auto-focused Button
		</Button>
	),
}

// ---------------------------------------------------------------------------
// Submit in form — type="submit" inside a <form>
// ---------------------------------------------------------------------------

export const SubmitInForm: StoryObj = {
	render: () => (
		<form
			onSubmit={(e) => {
				e.preventDefault()
				alert('Form submitted!')
			}}
			className="flex flex-col gap-3"
		>
			<input
				type="text"
				placeholder="Enter something..."
				className="rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
			/>
			<Button
				type="submit"
				className={[
					'inline-flex cursor-pointer items-center justify-center rounded-md px-4 py-2',
					'bg-indigo-600 text-sm font-medium text-white outline-none',
					'[data-hover]:bg-indigo-700',
					'[data-active]:scale-95',
					'[data-focus-visible]:ring-2 [data-focus-visible]:ring-indigo-400 [data-focus-visible]:ring-offset-2',
				].join(' ')}
			>
				Submit
			</Button>
		</form>
	),
}

// ---------------------------------------------------------------------------
// Data attributes showcase — shows all tracked states simultaneously
// ---------------------------------------------------------------------------

export const DataAttributesShowcase: StoryObj = {
	render: () => {
		return (
			<div className="flex flex-col gap-6">
				<p className="text-sm text-gray-500">
					Hover, click, tab to each button and inspect the DOM — data attributes
					appear/disappear in real time.
				</p>
				<div className="flex flex-wrap gap-4">
					<Button
						className={[
							'cursor-pointer rounded-md border border-indigo-300 bg-white px-4 py-2 text-sm text-indigo-700 outline-none',
							'[data-hover]:bg-indigo-50',
							'[data-active]:bg-indigo-100 [data-active]:scale-95',
							'[data-focus-visible]:ring-2 [data-focus-visible]:ring-indigo-400',
						].join(' ')}
					>
						Hover me
					</Button>

					<Button
						className={[
							'cursor-pointer rounded-md border border-indigo-300 bg-white px-4 py-2 text-sm text-indigo-700 outline-none',
							'[data-hover]:bg-indigo-50',
							'[data-active]:bg-indigo-100 [data-active]:scale-95',
							'[data-focus-visible]:ring-2 [data-focus-visible]:ring-indigo-400',
						].join(' ')}
					>
						Tab to me
					</Button>

					<Button
						disabled
						className={[
							'cursor-not-allowed rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-gray-400 outline-none',
							'[data-disabled]:opacity-60',
						].join(' ')}
					>
						Disabled
					</Button>
				</div>
			</div>
		)
	},
}
