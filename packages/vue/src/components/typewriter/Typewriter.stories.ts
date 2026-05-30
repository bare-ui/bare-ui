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

export const Composed: Story = {
	render: () => ({
		setup: () => () =>
			h('div', null, [
				h('style', null, blinkStyle),
				h('div', { class: 'flex max-w-md flex-col gap-8' }, [
					h('div', null, [
						h('p', { class: 'mb-1.5 text-xs font-medium text-[#6b7280]' }, 'With blinking cursor'),
						h('p', { class: 'font-mono text-sm leading-relaxed text-black' }, [
							h(Typewriter.Root, { text: 'Composing a reply…', speed: 45 }, () => [
								h(Typewriter.Text),
								h(
									Typewriter.Cursor,
									{ keepMounted: true, class: 'wire-cursor ml-0.5 inline-block w-[1ch] text-black' },
									() => '▋',
								),
							]),
						]),
					]),

					h('div', null, [
						h('p', { class: 'mb-1.5 text-xs font-medium text-[#6b7280]' }, 'Word-by-word reveal'),
						h('p', { class: 'text-base leading-relaxed text-black' }, [
							h(Typewriter.Root, {
								text: 'Revealing one whole word at a time feels more natural for prose.',
								mode: 'word',
								speed: 120,
							}),
						]),
					]),

					h('div', null, [
						h('p', { class: 'mb-1.5 text-xs font-medium text-[#6b7280]' }, 'Render-prop progress'),
						h(Typewriter.Root, { text: 'Drive your own UI from the reveal state.', speed: 35 }, {
							default: ({ displayed, progress, isDone }: { displayed: string; progress: number; isDone: boolean }) =>
								h('div', { class: 'space-y-2' }, [
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
					]),
				]),
			]),
	}),
};

export const Complex: Story = {
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
					h('div', { class: 'w-full max-w-md rounded-xl border border-[#e5e7eb] bg-white p-4 shadow-sm' }, [
						h('div', { class: 'flex items-start gap-3' }, [
							h(
								'div',
								{
									class: 'flex size-8 shrink-0 items-center justify-center rounded-full bg-black text-xs font-bold text-white',
								},
								'AI',
							),
							h('div', { class: 'flex-1' }, [
								h('p', { class: 'mb-1 text-xs font-medium text-[#6b7280]' }, 'Assistant'),
								h('p', { class: 'text-sm leading-relaxed text-[#374151]' }, [
									h(Typewriter.Root, { text: text.value, speed: 20 }, () => [
										h(Typewriter.Text),
										h(
											Typewriter.Cursor,
											{ class: 'wire-cursor ml-0.5 inline-block w-[1ch] text-black' },
											() => '▋',
										),
									]),
								]),
							]),
						]),
					]),
				]);
		},
	}),
};
