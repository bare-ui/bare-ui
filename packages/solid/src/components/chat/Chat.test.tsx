import { describe, it, expect, vi } from 'vitest';
import { createSignal } from 'solid-js';
import { render, screen } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { Chat } from './Chat';

function Composer(props: { isStreaming?: boolean; onSubmit?: (v: string) => void }) {
	return (
		<Chat.Root
			isStreaming={props.isStreaming ?? false}
			onSubmit={props.onSubmit ?? (() => {})}>
			<Chat.Composer>
				<Chat.Input aria-label='message' />
				<Chat.Send>Send</Chat.Send>
			</Chat.Composer>
		</Chat.Root>
	);
}

describe('Chat.Message', () => {
	it('exposes role and streaming as data attributes', () => {
		const [streaming, setStreaming] = createSignal(false);
		render(() => (
			<Chat.Message
				role='assistant'
				streaming={streaming()}
				data-testid='m'>
				Hi
			</Chat.Message>
		));
		const el = screen.getByTestId('m');
		expect(el).toHaveAttribute('data-role', 'assistant');
		expect(el).not.toHaveAttribute('data-streaming');
		// the `role` prop must not leak to the ARIA role attribute
		expect(el).not.toHaveAttribute('role');

		setStreaming(true);
		expect(screen.getByTestId('m')).toHaveAttribute('data-streaming', '');
	});
});

describe('Chat.List (virtualized)', () => {
	it('renders only a window of rows, not the whole list', () => {
		const { container } = render(() => (
			<Chat.List
				count={1000}
				estimateItemHeight={50}>
				{({ index }) => <Chat.Message>{`Msg ${index}`}</Chat.Message>}
			</Chat.List>
		));
		const items = container.querySelectorAll('[data-chat-item]');
		expect(items.length).toBeGreaterThan(0);
		expect(items.length).toBeLessThan(50);
		expect(items[0]).toHaveTextContent('Msg 0');
	});

	it('sizes the scroll area to the full estimated height', () => {
		const { container } = render(() => (
			<Chat.List
				count={1000}
				estimateItemHeight={50}>
				{({ index }) => <div>{index}</div>}
			</Chat.List>
		));
		const sizer = container.querySelector('[data-chat-list-sizer]') as HTMLElement;
		expect(sizer.style.height).toBe('50000px');
	});

	it('renders nothing for an empty list', () => {
		const { container } = render(() => (
			<Chat.List count={0}>{({ index }) => <div>{index}</div>}</Chat.List>
		));
		expect(container.querySelectorAll('[data-chat-item]')).toHaveLength(0);
	});

	it('is an aria live log', () => {
		const { container } = render(() => (
			<Chat.List count={1}>{({ index }) => <div>{index}</div>}</Chat.List>
		));
		const list = container.querySelector('[role="log"]');
		expect(list).toHaveAttribute('aria-live', 'polite');
	});
});

describe('Chat composer', () => {
	it('submits on Enter and clears the input', async () => {
		const user = userEvent.setup();
		const onSubmit = vi.fn();
		render(() => <Composer onSubmit={onSubmit} />);
		const input = screen.getByLabelText('message') as HTMLTextAreaElement;
		await user.type(input, 'hello world');
		await user.keyboard('{Enter}');
		expect(onSubmit).toHaveBeenCalledWith('hello world');
		expect(input.value).toBe('');
	});

	it('inserts a newline on Shift+Enter without submitting', async () => {
		const user = userEvent.setup();
		const onSubmit = vi.fn();
		render(() => <Composer onSubmit={onSubmit} />);
		const input = screen.getByLabelText('message') as HTMLTextAreaElement;
		await user.type(input, 'line one');
		await user.keyboard('{Shift>}{Enter}{/Shift}');
		expect(onSubmit).not.toHaveBeenCalled();
		expect(input.value).toContain('\n');
	});

	it('does not submit empty/whitespace input', async () => {
		const user = userEvent.setup();
		const onSubmit = vi.fn();
		render(() => <Composer onSubmit={onSubmit} />);
		const input = screen.getByLabelText('message');
		await user.type(input, '   ');
		await user.keyboard('{Enter}');
		expect(onSubmit).not.toHaveBeenCalled();
	});

	it('disables Send until there is text', async () => {
		const user = userEvent.setup();
		render(() => <Composer />);
		const send = screen.getByRole('button', { name: 'Send' });
		expect(send).toBeDisabled();
		await user.type(screen.getByLabelText('message'), 'hi');
		expect(send).toBeEnabled();
	});

	it('submits when Send is clicked', async () => {
		const user = userEvent.setup();
		const onSubmit = vi.fn();
		render(() => <Composer onSubmit={onSubmit} />);
		await user.type(screen.getByLabelText('message'), 'ping');
		await user.click(screen.getByRole('button', { name: 'Send' }));
		expect(onSubmit).toHaveBeenCalledWith('ping');
	});

	it('blocks submission while streaming', async () => {
		const user = userEvent.setup();
		const onSubmit = vi.fn();
		render(() => (
			<Composer
				isStreaming
				onSubmit={onSubmit}
			/>
		));
		const input = screen.getByLabelText('message');
		await user.type(input, 'hello');
		await user.keyboard('{Enter}');
		expect(onSubmit).not.toHaveBeenCalled();
		expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled();
	});

	it('throws when Input is used outside Root', () => {
		const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
		expect(() => render(() => <Chat.Input />)).toThrow(/Chat.Root/);
		spy.mockRestore();
	});
});
