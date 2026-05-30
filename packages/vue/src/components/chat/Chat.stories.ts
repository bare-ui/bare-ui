import { h, ref } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { Chat } from '.';
import { Typewriter } from '../typewriter';

const meta = {
	title: 'AI/Chat',
	component: Chat.Root,
	subcomponents: {
		'Chat.List': Chat.List,
		'Chat.Message': Chat.Message,
		'Chat.Composer': Chat.Composer,
		'Chat.Input': Chat.Input,
		'Chat.Send': Chat.Send,
	},
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component:
					'Streaming-aware chat primitives: a virtualized `Chat.List`, role-tagged `Chat.Message`, and a `Chat.Composer` + `Chat.Input` + `Chat.Send` that share state through `Chat.Root`. Compose with `Typewriter` and `Markdown` for the message bodies.',
			},
		},
	},
} satisfies Meta<typeof Chat.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

interface Msg {
	id: number;
	role: 'user' | 'assistant';
	text: string;
	streaming?: boolean;
}

const seed: Msg[] = [
	{ id: 0, role: 'assistant', text: 'Hey! Ask me anything about Wire UI.' },
	{ id: 1, role: 'user', text: 'What makes the Chat component special?' },
	{
		id: 2,
		role: 'assistant',
		text: 'It is headless and streaming-aware: the list is virtualized, messages carry a data-role, and it pins to the bottom as new tokens arrive.',
	},
];

const REPLY =
	'Great question! Wire UI ships zero CSS — you style everything with class and data-* attributes, so it drops into any design system.';

const blinkStyle = `
@keyframes wire-blink { 0%, 49% { opacity: 1 } 50%, 100% { opacity: 0 } }
.wire-cursor { animation: wire-blink 1s step-end infinite }
`;

// Renders a single message bubble at the given list index. While a message is
// streaming, its body reveals through Typewriter; otherwise it renders plain.
function renderMessage(messages: Msg[]) {
	return ({ index }: { index: number }) => {
		const msg = messages[index];
		if (!msg) return null;
		const isUser = msg.role === 'user';
		return h(
			Chat.Message,
			{
				role: msg.role,
				streaming: msg.streaming,
				class: `flex py-2 ${isUser ? 'justify-end' : 'justify-start'}`,
			},
			() =>
				h(
					'div',
					{
						class: `max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
							isUser ? 'bg-black text-white' : 'bg-[#f3f4f6] text-black'
						}`,
					},
					msg.streaming
						? [
								h(Typewriter.Root, { text: msg.text, speed: 18 }, () => [
									h(Typewriter.Text),
									h(
										Typewriter.Cursor,
										{ class: 'wire-cursor ml-0.5 inline-block w-[1ch]' },
										() => '▋',
									),
								]),
							]
						: msg.text,
				),
		);
	};
}

export const ChatUI: Story = {
	render: () => ({
		setup() {
			const messages = ref<Msg[]>([...seed]);
			const streaming = ref(false);
			let nextId = seed.length;

			function send(text: string) {
				messages.value.push({ id: nextId++, role: 'user', text });
				const botIndex =
					messages.value.push({ id: nextId++, role: 'assistant', text: REPLY, streaming: true }) - 1;
				streaming.value = true;
				// Drop the streaming flag once the typewriter would finish.
				setTimeout(() => {
					const msg = messages.value[botIndex];
					if (msg) msg.streaming = false;
					streaming.value = false;
				}, REPLY.length * 18 + 200);
			}

			return () =>
				h('div', null, [
					h('style', null, blinkStyle),
					h(
						Chat.Root,
						{
							isStreaming: streaming.value,
							onSubmit: send,
							class: 'mx-auto flex h-[520px] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white',
						},
						() => [
							h(
								Chat.List,
								{ count: messages.value.length, estimateItemHeight: 88, class: 'flex-1 px-4 py-3' },
								{ default: renderMessage(messages.value) },
							),
							h(
								Chat.Composer,
								{ class: 'flex items-end gap-2 border-t border-[#e5e7eb] p-3' },
								() => [
									h(Chat.Input, {
										'aria-label': 'Message',
										rows: 1,
										placeholder: 'Send a message…',
										class: 'max-h-32 flex-1 resize-none rounded-xl border border-[#d1d5db] px-3 py-2 text-sm outline-none focus:border-black',
									}),
									h(
										Chat.Send,
										{
											class: 'rounded-xl bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-40',
										},
										() => 'Send',
									),
								],
							),
						],
					),
				]);
		},
	}),
};

/** A large, virtualized history — only the visible rows are in the DOM. */
export const VirtualizedHistory: Story = {
	render: () => ({
		setup() {
			const count = 5000;
			return () =>
				h(
					Chat.List,
					{
						count,
						estimateItemHeight: 64,
						class: 'mx-auto h-[480px] w-full max-w-lg rounded-2xl border border-[#e5e7eb] bg-white px-4',
					},
					{
						default: ({ index }: { index: number }) => {
							const isAssistant = index % 2 === 0;
							return h(
								Chat.Message,
								{
									role: isAssistant ? 'assistant' : 'user',
									class: `flex py-2 ${isAssistant ? 'justify-start' : 'justify-end'}`,
								},
								() =>
									h(
										'div',
										{
											class: `max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
												isAssistant ? 'bg-[#f3f4f6] text-black' : 'bg-black text-white'
											}`,
										},
										`Message #${index}`,
									),
							);
						},
					},
				);
		},
	}),
};
