import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { Typewriter } from './Typewriter';

describe('Typewriter', () => {
	beforeEach(() => vi.useFakeTimers());
	afterEach(() => vi.useRealTimers());

	it('reveals text token-by-token over time', () => {
		const { container } = render(
			<Typewriter.Root
				text='Hi'
				speed={10}
			/>,
		);
		expect(container.textContent).toBe('');

		act(() => void vi.advanceTimersByTime(0));
		expect(container.textContent).toBe('H');

		act(() => void vi.advanceTimersByTime(10));
		expect(container.textContent).toBe('Hi');
	});

	it('reveals immediately when autoStart is false stays empty', () => {
		const { container } = render(
			<Typewriter.Root
				text='Hello'
				autoStart={false}
			/>,
		);
		act(() => void vi.advanceTimersByTime(1000));
		expect(container.textContent).toBe('');
	});

	it('respects startDelay before the first token', () => {
		const { container } = render(
			<Typewriter.Root
				text='Yo'
				speed={50}
				startDelay={100}
			/>,
		);
		act(() => void vi.advanceTimersByTime(50));
		expect(container.textContent).toBe('');
		act(() => void vi.advanceTimersByTime(60));
		expect(container.textContent).toBe('Y');
	});

	it('reveals word-by-word in word mode', () => {
		const { container } = render(
			<Typewriter.Root
				text='one two three'
				mode='word'
				speed={10}
			/>,
		);
		act(() => void vi.advanceTimersByTime(0));
		expect(container.textContent).toBe('one ');
		act(() => void vi.advanceTimersByTime(10));
		expect(container.textContent).toBe('one two ');
	});

	it('fires onComplete once when fully revealed', () => {
		const onComplete = vi.fn();
		render(
			<Typewriter.Root
				text='ok'
				speed={5}
				onComplete={onComplete}
			/>,
		);
		act(() => void vi.advanceTimersByTime(100));
		expect(onComplete).toHaveBeenCalledTimes(1);
	});

	it('continues from where it left off when text grows (streaming)', () => {
		const { container, rerender } = render(
			<Typewriter.Root
				text='ab'
				speed={10}
			/>,
		);
		act(() => void vi.advanceTimersByTime(100));
		expect(container.textContent).toBe('ab');

		rerender(
			<Typewriter.Root
				text='abcd'
				speed={10}
			/>,
		);
		act(() => void vi.advanceTimersByTime(0));
		expect(container.textContent).toBe('abc');
		act(() => void vi.advanceTimersByTime(10));
		expect(container.textContent).toBe('abcd');
	});

	it('exposes typing state to a render function', () => {
		render(
			<Typewriter.Root
				text='hi'
				speed={10}>
				{({ displayed, isTyping }) => (
					<span data-testid='out'>
						{displayed}
						{isTyping ? '|' : ''}
					</span>
				)}
			</Typewriter.Root>,
		);
		act(() => void vi.advanceTimersByTime(0));
		expect(screen.getByTestId('out').textContent).toBe('h|');
		act(() => void vi.advanceTimersByTime(10));
		expect(screen.getByTestId('out').textContent).toBe('hi');
	});

	it('Cursor unmounts when done unless keepMounted', () => {
		const { rerender } = render(
			<Typewriter.Root
				text='a'
				speed={5}>
				<Typewriter.Text />
				<Typewriter.Cursor data-testid='cursor'>|</Typewriter.Cursor>
			</Typewriter.Root>,
		);
		expect(screen.getByTestId('cursor')).toBeInTheDocument();
		act(() => void vi.advanceTimersByTime(100));
		expect(screen.queryByTestId('cursor')).toBeNull();

		rerender(
			<Typewriter.Root
				text='a'
				speed={5}>
				<Typewriter.Text />
				<Typewriter.Cursor
					keepMounted
					data-testid='cursor'>
					|
				</Typewriter.Cursor>
			</Typewriter.Root>,
		);
		act(() => void vi.advanceTimersByTime(100));
		expect(screen.getByTestId('cursor')).toBeInTheDocument();
	});

	it('sets data-state and aria-busy during typing', () => {
		const { container } = render(
			<Typewriter.Root
				text='hello'
				speed={10}
			/>,
		);
		const root = container.firstElementChild!;
		expect(root).toHaveAttribute('data-state', 'typing');
		expect(root).toHaveAttribute('aria-busy', 'true');
		act(() => void vi.advanceTimersByTime(200));
		expect(root).toHaveAttribute('data-state', 'done');
		expect(root).not.toHaveAttribute('aria-busy');
	});

	it('throws when Text is used outside Root', () => {
		const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
		expect(() => render(<Typewriter.Text />)).toThrow(/Typewriter.Root/);
		spy.mockRestore();
	});
});
