/**
 * Screen-reader semantics for Chat. The message list is a live log: SR announces
 * newly added messages politely, and the scrollable transcript stays
 * keyboard-reachable. The composer field must be a named textbox and a message's
 * author can be exposed via a consumer label.
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { expectExposedAs } from '@/test/sr';
import { Chat } from '.';

const {
	Root: ChatRoot,
	List: ChatList,
	Message: ChatMessage,
	Composer: ChatComposer,
	Input: ChatInput,
	Send: ChatSend,
} = Chat;

describe('Chat — screen reader semantics', () => {
	it('exposes the message list as a polite live log', () => {
		const { container } = render({
			template: `
				<ChatList :count="1" v-slot="{ index }">
					<ChatMessage>{{ 'Msg ' + index }}</ChatMessage>
				</ChatList>
			`,
			components: { ChatList, ChatMessage },
		});
		const log = container.querySelector('[role="log"]') as HTMLElement;
		expect(log).toHaveAttribute('aria-live', 'polite');
		expect(log).toHaveAttribute('aria-relevant', 'additions');
	});

	it.skip('keeps the scrollable transcript keyboard-reachable', () => {
		/* needs real browser layout — ChatList tabindex requires a visible scrollable viewport */
	});

	it('exposes the readable message text inside the log', () => {
		render({
			template: `
				<ChatList :count="1">
					<template #default>
						<ChatMessage>Hello there</ChatMessage>
					</template>
				</ChatList>
			`,
			components: { ChatList, ChatMessage },
		});
		expect(screen.getByText('Hello there')).toBeInTheDocument();
	});

	it('lets a consumer expose the message author as the accessible name', () => {
		render({
			template: `
				<ChatList :count="1">
					<template #default>
						<ChatMessage role="assistant" aria-label="Assistant said">How can I help?</ChatMessage>
					</template>
				</ChatList>
			`,
			components: { ChatList, ChatMessage },
		});
		const msg = screen.getByLabelText('Assistant said');
		expect(msg).toHaveAttribute('data-role', 'assistant');
	});

	it('exposes the composer as a named textbox', () => {
		render({
			template: `
				<ChatRoot>
					<ChatComposer>
						<ChatInput aria-label="Message" />
						<ChatSend>Send</ChatSend>
					</ChatComposer>
				</ChatRoot>
			`,
			components: { ChatRoot, ChatComposer, ChatInput, ChatSend },
		});
		expectExposedAs('textbox', 'Message');
		expectExposedAs('button', 'Send');
	});
});