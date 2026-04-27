import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { createSignal, For, Show } from 'solid-js';
import { Password } from './Password';

const meta = {
	title: 'Forms/Password',
	component: Password.Root,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Password input with visibility toggle.',
			},
		},
	},
} satisfies Meta<typeof Password.Root>;

export default meta;

const fieldCls =
	'w-full rounded-[8px] bg-white border border-black px-3 py-2 pr-10 text-sm outline-none transition focus:ring-2 focus:ring-black focus:ring-offset-1';

const toggleCls =
	'group absolute inset-y-0 right-0 flex items-center px-3 text-[#6b7280] outline-none transition hover:text-black data-[visible]:text-black';

const EyeIcon = () => (
	<svg
		class='size-4'
		viewBox='0 0 20 20'
		fill='currentColor'>
		<path d='M10 12a2 2 0 100-4 2 2 0 000 4z' />
		<path
			fill-rule='evenodd'
			d='M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z'
			clip-rule='evenodd'
		/>
	</svg>
);

const EyeOffIcon = () => (
	<svg
		class='size-4'
		viewBox='0 0 20 20'
		fill='currentColor'>
		<path
			fill-rule='evenodd'
			d='M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z'
			clip-rule='evenodd'
		/>
		<path d='M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.064 7 9.542 7 .847 0 1.669-.105 2.454-.303z' />
	</svg>
);

const ToggleButton = () => (
	<Password.Toggle class={toggleCls}>
		<span class='group-data-[visible]:hidden'>
			<EyeIcon />
		</span>
		<span class='hidden group-data-[visible]:block'>
			<EyeOffIcon />
		</span>
	</Password.Toggle>
);

export const Default: StoryObj = {
	render: () => (
		<Password.Root class='flex w-full max-w-xs flex-col gap-1.5'>
			<Password.Label class='text-sm font-medium text-black'>Password</Password.Label>
			<div class='relative'>
				<Password.Field
					placeholder='••••••••'
					class={fieldCls}
				/>
				<ToggleButton />
			</div>
		</Password.Root>
	),
};

export const Composed: StoryObj = {
	render: () => (
		<div class='flex flex-col gap-4 max-w-xs'>
			<Password.Root class='flex flex-col gap-1.5'>
				<Password.Label class='text-sm font-medium text-black'>New password</Password.Label>
				<div class='relative'>
					<Password.Field
						placeholder='••••••••'
						class={fieldCls}
					/>
					<ToggleButton />
				</div>
			</Password.Root>
			<Password.Root class='flex flex-col gap-1.5'>
				<Password.Label class='text-sm font-medium text-black'>Confirm password</Password.Label>
				<div class='relative'>
					<Password.Field
						placeholder='••••••••'
						class={fieldCls}
					/>
					<ToggleButton />
				</div>
			</Password.Root>
		</div>
	),
};

export const Complex: StoryObj = {
	render: () => {
		const [pw, setPw] = createSignal('');

		const getStrength = (len: number): number => {
			if (len >= 12) return 4;
			if (len >= 8) return 3;
			if (len >= 4) return 2;
			if (len > 0) return 1;
			return 0;
		};

		const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
		const strength = () => getStrength(pw().length);

		return (
			<div class='flex flex-col gap-4 max-w-xs'>
				<Password.Root
					value={pw()}
					onChange={setPw}
					class='flex flex-col gap-1.5'>
					<Password.Label class='text-sm font-medium text-black'>Password</Password.Label>
					<div class='relative'>
						<Password.Field
							placeholder='••••••••'
							class={fieldCls}
						/>
						<ToggleButton />
					</div>
				</Password.Root>
				<div class='flex flex-col gap-1.5'>
					<div class='flex gap-1.5'>
						<For each={[1, 2, 3, 4]}>
							{(i) => <div class={`h-1 flex-1 rounded-full ${i <= strength() ? 'bg-black' : 'bg-[#e5e5e5]'}`} />}
						</For>
					</div>
					<Show when={strength() > 0}>
						<p class='text-xs text-[#6b7280]'>{strengthLabels[strength()]}</p>
					</Show>
				</div>
			</div>
		);
	},
};
