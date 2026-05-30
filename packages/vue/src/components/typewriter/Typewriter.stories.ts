import { h, ref, onMounted, onUnmounted } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { Typewriter } from '.';

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

const blinkStyle = `
@keyframes wire-blink { 0%, 49% { opacity: 1 } 50%, 100% { opacity: 0 } }
.wire-cursor { animation: wire-blink 1s step-end infinite }
`;

export const Default: Story = {
	render: (args) => ({
		setup: () => () =>
			h(
				'p',
				{ class: 'max-w-md font-mono text-sm leading-relaxed text-black' },
				[h(Typewriter.Root, args)],
			),
	}),
};

export const WithCursor: Story = {
	render: (args) => ({
		setup: () => () =>
			h('div', null, [
				h('style', null, blinkStyle),
				h(
					'p',
					{ class: 'max-w-md font-mono text-sm leading-relaxed text-black' },
					[
						h(Typewriter.Root, args, () => [
							h(Typewriter.Text),
							h(
								Typewriter.Cursor,
								{ keepMounted: true, class: 'wire-cursor ml-0.5 inline-block w-[1ch] text-black' },
								() => '▋',
							),
						]),
					],
				),
			]),
	}),
};

export const WordByWord: Story = {
	args: { mode: 'word', speed: 120 },
	render: (args) => ({
		setup: () => () =>
			h(
				'p',
				{ class: 'max-w-md text-base leading-relaxed text-black' },
				[h(Typewriter.Root, args)],
			),
	}),
};

export const RenderProp: Story = {
	render: (args) => ({
		setup: () => () =>
			h(Typewriter.Root, args, {
				default: ({ displayed, progress, isDone }: { displayed: string; progress: number; isDone: boolean }) =>
					h('div', { class: 'max-w-md space-y-2' }, [
						h('p', { class: 'font-mono text-sm text-black' }, displayed),
						h('div', { class: 'h-1 w-full overflow-hidden rounded-full bg-[#e5e7eb]' }, [
							h('div', {
								class: 'h-full bg-black transition-[width]',
								style: { width: `${Math.round(progress * 100)}%` },
							}),
						]),
						h(
							'p',
							{ class: 'text-xs text-[#6b7280]' },
							isDone ? 'Done' : `${Math.round(progress * 100)}%`,
						),
					]),
			}),
	}),
};

/** Simulates a streamed response: `text` grows over time and the reveal keeps up. */
export const Streaming: Story = {
	render: () => ({
		setup() {
			const full =
				'Streaming works by appending tokens to the `text` prop. The Typewriter reveals them at a steady cadence, smoothing out a bursty network stream.';
			const text = ref('');

			let intervalId: ReturnType<typeof setInterval>;
			onMounted(() => {
				const words = full.split(' ');
				let i = 0;
				intervalId = setInterval(() => {
					i += 1;
					text.value = words.slice(0, i).join(' ');
					if (i >= words.length) clearInterval(intervalId);
				}, 90);
			});
			onUnmounted(() => clearInterval(intervalId));

			return () =>
				h('div', null, [
					h('style', null, blinkStyle),
					h(
						'p',
						{ class: 'max-w-md text-sm leading-relaxed text-black' },
						[
							h(Typewriter.Root, { text: text.value, speed: 20 }, () => [
								h(Typewriter.Text),
								h(
									Typewriter.Cursor,
									{ class: 'wire-cursor ml-0.5 inline-block w-[1ch]' },
									() => '▋',
								),
							]),
						],
					),
				]);
		},
	}),
};
