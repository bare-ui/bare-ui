import { createSignal, onCleanup, onMount } from 'solid-js';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
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
		<p class='max-w-md font-mono text-sm leading-relaxed text-black'>
			<Typewriter.Root {...args} />
		</p>
	),
};

export const Composed: Story = {
	render: () => (
		<>
			<style>{blinkCss}</style>
			<div class='flex max-w-md flex-col gap-8'>
				<div>
					<p class='mb-1.5 text-xs font-medium text-[#6b7280]'>With blinking cursor</p>
					<p class='font-mono text-sm leading-relaxed text-black'>
						<Typewriter.Root
							text='Composing a reply…'
							speed={45}>
							<Typewriter.Text />
							<Typewriter.Cursor
								keepMounted
								class='wire-cursor ml-0.5 inline-block w-[1ch] text-black'>
								▋
							</Typewriter.Cursor>
						</Typewriter.Root>
					</p>
				</div>

				<div>
					<p class='mb-1.5 text-xs font-medium text-[#6b7280]'>Word-by-word reveal</p>
					<p class='text-base leading-relaxed text-black'>
						<Typewriter.Root
							text='Revealing one whole word at a time feels more natural for prose.'
							mode='word'
							speed={120}
						/>
					</p>
				</div>

				<div>
					<p class='mb-1.5 text-xs font-medium text-[#6b7280]'>Render-prop progress</p>
					<Typewriter.Root
						text='Drive your own UI from the reveal state.'
						speed={35}>
						{({ displayed, progress, isDone }) => (
							<div class='space-y-2'>
								<p class='font-mono text-sm text-black'>{displayed}</p>
								<div class='h-1 w-full overflow-hidden rounded-full bg-[#e5e7eb]'>
									<div
										class='h-full bg-black transition-[width]'
										style={{ width: `${Math.round(progress * 100)}%` }}
									/>
								</div>
								<p class='text-xs text-[#6b7280]'>
									{isDone ? 'Done' : `${Math.round(progress * 100)}%`}
								</p>
							</div>
						)}
					</Typewriter.Root>
				</div>
			</div>
		</>
	),
};

export const Complex: Story = {
	render: () => {
		const full =
			'Streaming works by appending tokens to the `text` prop. The Typewriter reveals them at a steady cadence, smoothing out a bursty network stream.';
		const [text, setText] = createSignal('');

		onMount(() => {
			const words = full.split(' ');
			let i = 0;
			const id = setInterval(() => {
				i += 1;
				setText(words.slice(0, i).join(' '));
				if (i >= words.length) clearInterval(id);
			}, 90);
			onCleanup(() => clearInterval(id));
		});

		return (
			<>
				<style>{blinkCss}</style>
				<div class='w-full max-w-md rounded-xl border border-[#e5e7eb] bg-white p-4 shadow-sm'>
					<div class='flex items-start gap-3'>
						<div class='flex size-8 shrink-0 items-center justify-center rounded-full bg-black text-xs font-bold text-white'>
							AI
						</div>
						<div class='flex-1'>
							<p class='mb-1 text-xs font-medium text-[#6b7280]'>Assistant</p>
							<p class='text-sm leading-relaxed text-[#374151]'>
								<Typewriter.Root
									text={text()}
									speed={20}>
									<Typewriter.Text />
									<Typewriter.Cursor class='wire-cursor ml-0.5 inline-block w-[1ch] text-black'>
										▋
									</Typewriter.Cursor>
								</Typewriter.Root>
							</p>
						</div>
					</div>
				</div>
			</>
		);
	},
};
