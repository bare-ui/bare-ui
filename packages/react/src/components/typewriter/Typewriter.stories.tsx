import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Typewriter } from './Typewriter';

const meta = {
	title: 'AI/Typewriter',
	component: Typewriter.Root,
	subcomponents: {
		'Typewriter.Text': Typewriter.Text,
		'Typewriter.Cursor': Typewriter.Cursor,
	},
	tags: ['autodocs'],
	args: { text: 'The quick brown fox jumps over the lazy dog.', speed: 35 },
	parameters: {
		docs: {
			description: {
				component:
					'Token-by-token reveal with cursor state and configurable cadence. Streaming-aware — grow the `text` prop as tokens arrive and the reveal continues from where it left off.',
			},
		},
	},
} satisfies Meta<typeof Typewriter.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const blinkCss =
	'@keyframes wire-blink { 0%, 49% { opacity: 1 } 50%, 100% { opacity: 0 } } .wire-cursor { animation: wire-blink 1s step-end infinite }';

export const Default: Story = {
	render: (args) => (
		<p className='max-w-md font-mono text-sm leading-relaxed text-black'>
			<Typewriter.Root {...args} />
		</p>
	),
};

export const WithCursor: Story = {
	render: (args) => (
		<>
			<style>{blinkCss}</style>
			<p className='max-w-md font-mono text-sm leading-relaxed text-black'>
				<Typewriter.Root {...args}>
					<Typewriter.Text />
					<Typewriter.Cursor
						keepMounted
						className='wire-cursor ml-0.5 inline-block w-[1ch] text-black'>
						▋
					</Typewriter.Cursor>
				</Typewriter.Root>
			</p>
		</>
	),
};

export const WordByWord: Story = {
	args: { mode: 'word', speed: 120 },
	render: (args) => (
		<p className='max-w-md text-base leading-relaxed text-black'>
			<Typewriter.Root {...args} />
		</p>
	),
};

export const RenderProp: Story = {
	render: (args) => (
		<Typewriter.Root {...args}>
			{({ displayed, progress, isDone }) => (
				<div className='max-w-md space-y-2'>
					<p className='font-mono text-sm text-black'>{displayed}</p>
					<div className='h-1 w-full overflow-hidden rounded-full bg-[#e5e7eb]'>
						<div
							className='h-full bg-black transition-[width]'
							style={{ width: `${Math.round(progress * 100)}%` }}
						/>
					</div>
					<p className='text-xs text-[#6b7280]'>{isDone ? 'Done' : `${Math.round(progress * 100)}%`}</p>
				</div>
			)}
		</Typewriter.Root>
	),
};

/** Simulates a streamed response: `text` grows over time and the reveal keeps up. */
export const Streaming: Story = {
	render: () => {
		const full =
			'Streaming works by appending tokens to the `text` prop. The Typewriter reveals them at a steady cadence, smoothing out a bursty network stream.';
		const [text, setText] = useState('');

		useEffect(() => {
			const words = full.split(' ');
			let i = 0;
			const id = setInterval(() => {
				i += 1;
				setText(words.slice(0, i).join(' '));
				if (i >= words.length) clearInterval(id);
			}, 90);
			return () => clearInterval(id);
		}, []);

		return (
			<>
				<style>{blinkCss}</style>
				<p className='max-w-md text-sm leading-relaxed text-black'>
					<Typewriter.Root
						text={text}
						speed={20}>
						<Typewriter.Text />
						<Typewriter.Cursor className='wire-cursor ml-0.5 inline-block w-[1ch]'>▋</Typewriter.Cursor>
					</Typewriter.Root>
				</p>
			</>
		);
	},
};
