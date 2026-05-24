import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { CodeBlock } from './CodeBlock';

function renderBlock(props: Partial<React.ComponentProps<typeof CodeBlock.Root>> = {}) {
	return render(
		<CodeBlock.Root
			code={'const a = 1\nconst b = 2\nconst c = 3'}
			language='ts'
			{...props}>
			<CodeBlock.CopyButton>{({ copied }) => (copied ? 'Copied' : 'Copy')}</CodeBlock.CopyButton>
			<CodeBlock.Code>
				<CodeBlock.Lines>
					{({ line }) => (
						<>
							<span data-testid='gutter'>{line.number}</span>
							<span>{line.content}</span>
						</>
					)}
				</CodeBlock.Lines>
			</CodeBlock.Code>
		</CodeBlock.Root>,
	);
}

describe('CodeBlock', () => {
	it('splits code into numbered lines', () => {
		const { container } = renderBlock();
		const lines = container.querySelectorAll('[data-line]');
		expect(lines).toHaveLength(3);
		expect(lines[0]).toHaveAttribute('data-line-number', '1');
		expect(lines[2]).toHaveAttribute('data-line-number', '3');
		expect(lines[1]).toHaveTextContent('const b = 2');
	});

	it('drops a single trailing newline (no phantom row)', () => {
		const { container } = renderBlock({ code: 'one\ntwo\n' });
		expect(container.querySelectorAll('[data-line]')).toHaveLength(2);
	});

	it('applies startLine offset to line numbers', () => {
		const { container } = renderBlock({ startLine: 10 });
		const lines = container.querySelectorAll('[data-line]');
		expect(lines[0]).toHaveAttribute('data-line-number', '10');
		expect(lines[2]).toHaveAttribute('data-line-number', '12');
	});

	it('marks diff lines via data-diff', () => {
		const { container } = renderBlock({ diff: { 1: 'remove', 2: 'add' } });
		const lines = container.querySelectorAll('[data-line]');
		expect(lines[0]).toHaveAttribute('data-diff', 'remove');
		expect(lines[1]).toHaveAttribute('data-diff', 'add');
		expect(lines[2]).not.toHaveAttribute('data-diff');
	});

	it('marks highlighted lines', () => {
		const { container } = renderBlock({ highlightLines: [2] });
		const lines = container.querySelectorAll('[data-line]');
		expect(lines[1]).toHaveAttribute('data-highlighted', '');
		expect(lines[0]).not.toHaveAttribute('data-highlighted');
	});

	it('surfaces the language as data-language', () => {
		const { container } = renderBlock();
		expect(container.querySelector('pre')).toHaveAttribute('data-language', 'ts');
	});

	it('copies the code and flips the copied state', async () => {
		const writeText = vi.fn().mockResolvedValue(undefined);
		Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
		renderBlock();

		const btn = screen.getByRole('button', { name: 'Copy code' });
		fireEvent.click(btn);

		expect(writeText).toHaveBeenCalledWith('const a = 1\nconst b = 2\nconst c = 3');
		await waitFor(() => expect(screen.getByRole('button')).toHaveAttribute('data-copied', ''));
		expect(btn).toHaveTextContent('Copied');
	});

	it('throws when used outside Root', () => {
		const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
		expect(() => render(<CodeBlock.Code />)).toThrow(/CodeBlock.Root/);
		spy.mockRestore();
	});
});
