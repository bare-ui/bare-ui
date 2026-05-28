import { useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Chat } from './Chat';
import { Typewriter } from '../typewriter/Typewriter';

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
	'Great question! Wire UI ships zero CSS — you style everything with className and data-* attributes, so it drops into any design system.';

const bubbleCls = (isUser: boolean) =>
	`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
		isUser ? 'bg-black text-white' : 'bg-[#f3f4f6] text-black'
	}`;

export const Default: Story = {
	render: () => {
		const [messages, setMessages] = useState<Msg[]>(seed);
		const nextId = useRef(seed.length);

		const send = (text: string) => {
			setMessages((m) => [...m, { id: nextId.current++, role: 'user', text }]);
		};

		return (
			<Chat.Root
				onSubmit={send}
				className='mx-auto flex h-[420px] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white'>
				<Chat.List
					count={messages.length}
					estimateItemHeight={88}
					className='flex-1 px-4 py-3'>
					{({ index }) => {
						const msg = messages[index];
						const isUser = msg.role === 'user';
						return (
							<Chat.Message
								role={msg.role}
								className={`flex py-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
								<div className={bubbleCls(isUser)}>{msg.text}</div>
							</Chat.Message>
						);
					}}
				</Chat.List>

				<Chat.Composer className='flex items-end gap-2 border-t border-[#e5e7eb] p-3'>
					<Chat.Input
						aria-label='Message'
						rows={1}
						placeholder='Send a message…'
						className='max-h-32 flex-1 resize-none rounded-xl border border-[#d1d5db] px-3 py-2 text-sm outline-none focus:border-black'
					/>
					<Chat.Send className='rounded-xl bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-40'>
						Send
					</Chat.Send>
				</Chat.Composer>
			</Chat.Root>
		);
	},
};

export const Composed: Story = {
	render: () => {
		const [messages, setMessages] = useState<Msg[]>(seed);
		const [streaming, setStreaming] = useState(false);
		const nextId = useRef(seed.length);

		const send = (text: string) => {
			const userMsg: Msg = { id: nextId.current++, role: 'user', text };
			const botId = nextId.current++;
			setMessages((m) => [...m, userMsg, { id: botId, role: 'assistant', text: REPLY, streaming: true }]);
			setStreaming(true);
			globalThis.setTimeout(
				() => setMessages((m) => m.map((msg) => (msg.id === botId ? { ...msg, streaming: false } : msg))),
				REPLY.length * 18 + 200,
			);
			globalThis.setTimeout(() => setStreaming(false), REPLY.length * 18 + 200);
		};

		return (
			<Chat.Root
				isStreaming={streaming}
				onSubmit={send}
				className='mx-auto flex h-[520px] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white'>
				<Chat.List
					count={messages.length}
					estimateItemHeight={88}
					className='flex-1 px-4 py-3'>
					{({ index }) => {
						const msg = messages[index];
						const isUser = msg.role === 'user';
						return (
							<Chat.Message
								role={msg.role}
								streaming={msg.streaming}
								className={`flex py-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
								<div className={bubbleCls(isUser)}>
									{msg.streaming ?
										<Typewriter.Root
											text={msg.text}
											speed={18}>
											<Typewriter.Text />
											<Typewriter.Cursor className='ml-0.5 inline-block animate-pulse'>
												▋
											</Typewriter.Cursor>
										</Typewriter.Root>
									:	msg.text}
								</div>
							</Chat.Message>
						);
					}}
				</Chat.List>

				<Chat.Composer className='flex items-end gap-2 border-t border-[#e5e7eb] p-3'>
					<Chat.Input
						aria-label='Message'
						rows={1}
						placeholder='Send a message…'
						className='max-h-32 flex-1 resize-none rounded-xl border border-[#d1d5db] px-3 py-2 text-sm outline-none focus:border-black'
					/>
					<Chat.Send className='rounded-xl bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-40'>
						Send
					</Chat.Send>
				</Chat.Composer>
			</Chat.Root>
		);
	},
};

export const Complex: Story = {
	render: () => {
		const count = 5000;
		return (
			<div className='mx-auto flex h-[560px] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white'>
				<div className='flex items-center justify-between border-b border-[#e5e7eb] px-4 py-3'>
					<div className='flex items-center gap-2'>
						<span className='inline-flex h-8 w-8 items-center justify-center rounded-full bg-black text-xs text-white'>
							AI
						</span>
						<div className='text-sm font-medium text-black'>Support thread</div>
					</div>
					<span className='text-xs text-[#9ca3af]'>{count.toLocaleString()} messages</span>
				</div>
				<Chat.List
					count={count}
					estimateItemHeight={64}
					className='flex-1 px-4 py-2'>
					{({ index }) => {
						const isUser = index % 2 !== 0;
						return (
							<Chat.Message
								role={isUser ? 'user' : 'assistant'}
								className={`flex py-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
								<div className={bubbleCls(isUser)}>Message #{index}</div>
							</Chat.Message>
						);
					}}
				</Chat.List>
				<div className='border-t border-[#e5e7eb] px-4 py-2 text-center text-xs text-[#9ca3af]'>
					Only the visible rows are mounted — the list is virtualized.
				</div>
			</div>
		);
	},
};
