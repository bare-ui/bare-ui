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

const bubbleCls = (isUser: boolean) =>
	`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
		isUser ? 'bg-black text-white' : 'bg-[#f3f4f6] text-black'
	}`;

export const Default: Story = {
	render: () => ({
		setup() {
			const messages = ref<Msg[]>([...seed]);
			let nextId = seed.length;

			function send(text: string) {
				messages.value.push({ id: nextId++, role: 'user', text });
			}

			return () =>
				h(
					Chat.Root,
					{
						onSubmit: send,
						class: 'mx-auto flex h-[420px] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white',
					},
					() => [
						h(
							Chat.List,
							{ count: messages.value.length, estimateItemHeight: 88, class: 'flex-1 px-4 py-3' },
							{
								default: ({ index }: { index: number }) => {
									const msg = messages.value[index];
									if (!msg) return null;
									const isUser = msg.role === 'user';
									return h(
										Chat.Message,
										{
											role: msg.role,
											class: `flex py-2 ${isUser ? 'justify-end' : 'justify-start'}`,
										},
										() => h('div', { class: bubbleCls(isUser) }, msg.text),
									);
								},
							},
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
				);
		},
	}),
};

export const Composed: Story = {
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
				setTimeout(() => {
					const msg = messages.value[botIndex];
					if (msg) msg.streaming = false;
					streaming.value = false;
				}, REPLY.length * 18 + 200);
			}

			return () =>
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
							{
								default: ({ index }: { index: number }) => {
									const msg = messages.value[index];
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
												{ class: bubbleCls(isUser) },
												msg.streaming
													? [
															h(Typewriter.Root, { text: msg.text, speed: 18 }, () => [
																h(Typewriter.Text),
																h(
																	Typewriter.Cursor,
																	{ class: 'ml-0.5 inline-block animate-pulse' },
																	() => '▋',
																),
															]),
														]
													: msg.text,
											),
									);
								},
							},
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
				);
		},
	}),
};

export const Complex: Story = {
	render: () => ({
		setup() {
			const count = 5000;
			return () =>
				h(
					'div',
					{
						class: 'mx-auto flex h-[560px] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white',
					},
					[
						h(
							'div',
							{ class: 'flex items-center justify-between border-b border-[#e5e7eb] px-4 py-3' },
							[
								h('div', { class: 'flex items-center gap-2' }, [
									h(
										'span',
										{
											class: 'inline-flex h-8 w-8 items-center justify-center rounded-full bg-black text-xs text-white',
										},
										'AI',
									),
									h('div', { class: 'text-sm font-medium text-black' }, 'Support thread'),
								]),
								h(
									'span',
									{ class: 'text-xs text-[#9ca3af]' },
									`${count.toLocaleString()} messages`,
								),
							],
						),
						h(
							Chat.List,
							{ count, estimateItemHeight: 64, class: 'flex-1 px-4 py-2' },
							{
								default: ({ index }: { index: number }) => {
									const isUser = index % 2 !== 0;
									return h(
										Chat.Message,
										{
											role: isUser ? 'user' : 'assistant',
											class: `flex py-2 ${isUser ? 'justify-end' : 'justify-start'}`,
										},
										() => h('div', { class: bubbleCls(isUser) }, `Message #${index}`),
									);
								},
							},
						),
						h(
							'div',
							{ class: 'border-t border-[#e5e7eb] px-4 py-2 text-center text-xs text-[#9ca3af]' },
							'Only the visible rows are mounted — the list is virtualized.',
						),
					],
				);
		},
	}),
};
