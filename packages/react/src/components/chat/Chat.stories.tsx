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

export const ChatUI: Story = {
	render: () => {
		const [messages, setMessages] = useState<Msg[]>(seed);
		const [streaming, setStreaming] = useState(false);
		const nextId = useRef(seed.length);

		const send = (text: string) => {
			const userMsg: Msg = { id: nextId.current++, role: 'user', text };
			const botId = nextId.current++;
			setMessages((m) => [...m, userMsg, { id: botId, role: 'assistant', text: REPLY, streaming: true }]);
			setStreaming(true);
			// Stop the streaming flag once the typewriter would finish.
			globalThis.setTimeout(
				() =>
					setMessages((m) => m.map((msg) => (msg.id === botId ? { ...msg, streaming: false } : msg))),
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
								<div
									className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
										isUser ? 'bg-black text-white' : 'bg-[#f3f4f6] text-black'
									}`}>
									{msg.streaming ?
										<Typewriter.Root
											text={msg.text}
											speed={18}>
											<Typewriter.Text />
											<Typewriter.Cursor className='ml-0.5 inline-block animate-pulse'>▋</Typewriter.Cursor>
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

/** A large, virtualized history — only the visible rows are in the DOM. */
export const VirtualizedHistory: Story = {
	render: () => {
		const count = 5000;
		return (
			<Chat.List
				count={count}
				estimateItemHeight={64}
				className='mx-auto h-[480px] w-full max-w-lg rounded-2xl border border-[#e5e7eb] bg-white px-4'>
				{({ index }) => (
					<Chat.Message
						role={index % 2 === 0 ? 'assistant' : 'user'}
						className={`flex py-2 ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
						<div
							className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
								index % 2 === 0 ? 'bg-[#f3f4f6] text-black' : 'bg-black text-white'
							}`}>
							Message #{index}
						</div>
					</Chat.Message>
				)}
			</Chat.List>
		);
	},
};
