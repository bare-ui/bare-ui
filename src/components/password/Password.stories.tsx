import type { Meta, StoryObj } from '@storybook/react-vite'
import { Password } from './Password'

const meta = {
	title: 'Components/Password',
	component: Password.Root,
	tags: ['autodocs'],
} satisfies Meta<typeof Password.Root>

export default meta
type Story = StoryObj<typeof meta>

// ---------------------------------------------------------------------------
// Shared styles
// ---------------------------------------------------------------------------

const fieldCls =
	'w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 data-[invalid]:border-red-400 data-[invalid]:focus:border-red-400 data-[invalid]:focus:ring-red-400'

const toggleCls =
	'group absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 outline-none transition hover:text-gray-600 data-[visible]:text-blue-500'

// Eye open icon
const EyeIcon = () => (
	<svg className="size-4" viewBox="0 0 20 20" fill="currentColor">
		<path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
		<path
			fillRule="evenodd"
			d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
			clipRule="evenodd"
		/>
	</svg>
)

// Eye closed icon
const EyeOffIcon = () => (
	<svg className="size-4" viewBox="0 0 20 20" fill="currentColor">
		<path
			fillRule="evenodd"
			d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
			clipRule="evenodd"
		/>
		<path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.064 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
	</svg>
)

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const Default: Story = {
	render: () => (
		<Password.Root className="w-72">
			<div className="relative">
				<Password.Field placeholder="Enter password" className={fieldCls} />
				<Password.Toggle className={toggleCls}>
					<span className="group-data-[visible]:hidden">
						<EyeIcon />
					</span>
					<span className="hidden group-data-[visible]:block">
						<EyeOffIcon />
					</span>
				</Password.Toggle>
			</div>
		</Password.Root>
	),
}

export const WithLabel: Story = {
	render: () => (
		<Password.Root className="flex w-72 flex-col gap-1.5">
			<Password.Label className="text-sm font-medium text-gray-700">Password</Password.Label>
			<div className="relative">
				<Password.Field placeholder="••••••••" className={fieldCls} />
				<Password.Toggle className={toggleCls}>
					<span className="group-data-[visible]:hidden">
						<EyeIcon />
					</span>
					<span className="hidden group-data-[visible]:block">
						<EyeOffIcon />
					</span>
				</Password.Toggle>
			</div>
		</Password.Root>
	),
}

export const Required: Story = {
	render: () => (
		<Password.Root
			isRequired
			errorMessage={{ required: 'Password is required' }}
			className="flex w-72 flex-col gap-1.5"
		>
			<Password.Label className="text-sm font-medium text-gray-700">Password</Password.Label>
			<div className="relative">
				<Password.Field placeholder="••••••••" className={fieldCls} />
				<Password.Toggle className={toggleCls}>
					<span className="group-data-[visible]:hidden">
						<EyeIcon />
					</span>
					<span className="hidden group-data-[visible]:block">
						<EyeOffIcon />
					</span>
				</Password.Toggle>
			</div>
			<Password.Error className="text-xs text-red-500" />
		</Password.Root>
	),
}

export const ConfirmPassword: Story = {
	render: () => (
		<div className="flex w-72 flex-col gap-4">
			<Password.Root className="flex flex-col gap-1.5">
				<Password.Label className="text-sm font-medium text-gray-700">
					New password
				</Password.Label>
				<div className="relative">
					<Password.Field placeholder="••••••••" className={fieldCls} />
					<Password.Toggle className={toggleCls}>
						<span className="group-data-[visible]:hidden">
							<EyeIcon />
						</span>
						<span className="hidden group-data-[visible]:block">
							<EyeOffIcon />
						</span>
					</Password.Toggle>
				</div>
			</Password.Root>
			<Password.Root className="flex flex-col gap-1.5">
				<Password.Label className="text-sm font-medium text-gray-700">
					Confirm password
				</Password.Label>
				<div className="relative">
					<Password.Field placeholder="••••••••" className={fieldCls} />
					<Password.Toggle className={toggleCls}>
						<span className="group-data-[visible]:hidden">
							<EyeIcon />
						</span>
						<span className="hidden group-data-[visible]:block">
							<EyeOffIcon />
						</span>
					</Password.Toggle>
				</div>
			</Password.Root>
		</div>
	),
}
