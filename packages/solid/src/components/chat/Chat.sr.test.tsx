/**
 * Screen-reader semantics for Chat. The message list is a live log: SR announces
 * newly added messages politely, and the scrollable transcript stays
 * keyboard-reachable. The composer field must be a named textbox and a message's
 * author can be exposed via a consumer label.
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import { expectExposedAs } from '@/test/sr';
import { Chat } from './Chat';

describe('Chat — screen reader semantics', () => {
	it('exposes the message list as a polite live log', () => {
		const { container } = render(() => (
			<Chat.List count={1}>{({ index }) => <Chat.Message>{`Msg ${index}`}</Chat.Message>}</Chat.List>
		));
		const log = container.querySelector('[role="log"]') as HTMLElement;
		// New messages are announced without interrupting; only additions matter.
		expect(log).toHaveAttribute('aria-live', 'polite');
		expect(log).toHaveAttribute('aria-relevant', 'additions');
	});

	it('keeps the scrollable transcript keyboard-reachable', () => {
		const { container } = render(() => (
			<Chat.List count={3}>{({ index }) => <div>{`Msg ${index}`}</div>}</Chat.List>
		));
		const log = container.querySelector('[role="log"]') as HTMLElement;
		expect(log).toHaveAttribute('tabindex', '0');
	});

	it('exposes the readable message text inside the log', () => {
		render(() => <Chat.List count={1}>{() => <Chat.Message>Hello there</Chat.Message>}</Chat.List>);
		expect(screen.getByText('Hello there')).toBeInTheDocument();
	});

	it('lets a consumer expose the message author as the accessible name', () => {
		render(() => (
			<Chat.List count={1}>
				{() => (
					<Chat.Message
						role='assistant'
						aria-label='Assistant said'>
						How can I help?
					</Chat.Message>
				)}
			</Chat.List>
		));
		// The author role is data-only; the SR name comes from the consumer label.
		const msg = screen.getByLabelText('Assistant said');
		expect(msg).toHaveAttribute('data-role', 'assistant');
	});

	it('exposes the composer as a named textbox', () => {
		render(() => (
			<Chat.Root>
				<Chat.Composer>
					<Chat.Input aria-label='Message' />
					<Chat.Send>Send</Chat.Send>
				</Chat.Composer>
			</Chat.Root>
		));
		expectExposedAs('textbox', 'Message');
		expectExposedAs('button', 'Send');
	});
});
