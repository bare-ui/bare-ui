import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { OTP } from './OTP';

const meta = {
	title: 'Components/OTP',
	component: OTP.Root,
	tags: ['autodocs'],
} satisfies Meta<typeof OTP.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const slotCls = [
	'h-12 w-10 rounded-[8px] border-2 border-black bg-white text-center text-lg font-mono font-semibold text-black',
	'outline-none transition-all caret-transparent',
	'data-[active]:ring-4 data-[active]:ring-black/20',
	'data-[complete]:bg-black data-[complete]:text-white',
	'data-[disabled]:cursor-not-allowed data-[disabled]:bg-[#f5f5f5] data-[disabled]:text-[#9ca3af]',
].join(' ');

export const Default: Story = {
	render: () => (
		<OTP.Root
			length={6}
			onChange={(v) => console.log('otp:', v)}
			onComplete={(v) => console.log('complete:', v)}
			className='flex items-center gap-2'>
			{Array.from({ length: 6 }).map((_, i) => (
				<OTP.Slot key={i} index={i} className={slotCls} />
			))}
		</OTP.Root>
	),
};

export const WithSeparator: Story = {
	render: () => (
		<OTP.Root
			length={6}
			onChange={(v) => console.log('otp:', v)}
			onComplete={(v) => console.log('complete:', v)}
			className='flex items-center gap-2'>
			{[0, 1, 2].map((i) => (
				<OTP.Slot key={i} index={i} className={slotCls} />
			))}
			<OTP.Separator className='text-xl font-light text-black' />
			{[3, 4, 5].map((i) => (
				<OTP.Slot key={i} index={i} className={slotCls} />
			))}
		</OTP.Root>
	),
};

export const FourDigit: Story = {
	render: () => (
		<OTP.Root
			length={4}
			onChange={(v) => console.log('otp:', v)}
			onComplete={(v) => console.log('complete:', v)}
			className='flex items-center gap-3'>
			{Array.from({ length: 4 }).map((_, i) => (
				<OTP.Slot
					key={i}
					index={i}
					className={[
						'h-14 w-12 rounded-[8px] border-2 border-black bg-white text-center text-2xl font-mono font-bold text-black',
						'outline-none transition-all caret-transparent',
						'data-[active]:ring-4 data-[active]:ring-black/20',
						'data-[complete]:bg-black data-[complete]:text-white',
					].join(' ')}
				/>
			))}
		</OTP.Root>
	),
};

export const Alphanumeric: Story = {
	render: () => (
		<div className='flex flex-col gap-3'>
			<p className='text-sm text-[#9ca3af]'>Enter your 6-character invite code</p>
			<OTP.Root
				length={6}
				pattern='alphanumeric'
				onChange={(v) => console.log('code:', v)}
				onComplete={(v) => console.log('complete:', v)}
				className='flex items-center gap-2'>
				{Array.from({ length: 6 }).map((_, i) => (
					<OTP.Slot key={i} index={i} className={slotCls} />
				))}
			</OTP.Root>
		</div>
	),
};

export const WithCompletion: Story = {
	render: () => {
		const [value, setValue] = useState('');
		const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

		const handleComplete = (v: string) => {
			setStatus(v === '123456' ? 'success' : 'error');
		};

		const handleChange = (v: string) => {
			setValue(v);
			if (v.length < 6) setStatus('idle');
		};

		const completeCls = [
			'h-12 w-10 rounded-[8px] border-2 text-center text-lg font-mono font-semibold',
			'outline-none transition-all caret-transparent',
			status === 'success'
				? 'border-black bg-black text-white'
				: status === 'error'
					? 'border-black bg-[#f5f5f5] text-black'
					: 'border-black bg-white text-black data-[active]:ring-4 data-[active]:ring-black/20',
		].join(' ');

		return (
			<div className='flex flex-col gap-3'>
				<p className='text-sm text-[#9ca3af]'>
					Try <span className='font-mono font-medium text-black'>123456</span> for success
				</p>
				<OTP.Root
					value={value}
					onChange={handleChange}
					onComplete={handleComplete}
					length={6}
					className='flex items-center gap-2'>
					{Array.from({ length: 6 }).map((_, i) => (
						<OTP.Slot key={i} index={i} className={completeCls} />
					))}
				</OTP.Root>
				{status === 'success' && <p className='text-sm font-medium text-black'>✓ Code verified</p>}
				{status === 'error' && <p className='text-sm font-medium text-black'>✗ Invalid code, try again</p>}
			</div>
		);
	},
};

export const Disabled: Story = {
	render: () => (
		<OTP.Root length={6} defaultValue='4829' disabled className='flex items-center gap-2'>
			{Array.from({ length: 6 }).map((_, i) => (
				<OTP.Slot key={i} index={i} className={slotCls} />
			))}
		</OTP.Root>
	),
};
