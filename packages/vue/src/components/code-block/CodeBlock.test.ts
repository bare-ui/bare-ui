import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { h } from 'vue';
import { CodeBlock } from '.';
import type { CodeBlockLine } from '.';

function renderBlock(props: Partial<{
	code: string;
	language: string;
	diff: Record<number, 'add' | 'remove'>;
	highlightLines: number[];
	startLine: number;
	copyResetAfter: number;
}> = {}) {
	return render({
		setup() {
			return () =>
				h(
					CodeBlock.Root,
					{
						code: 'const a = 1\nconst b = 2\nconst c = 3',
						language: 'ts',
						...props,
					},
					() => [
						h(CodeBlock.CopyButton, null, ({ copied }: { copied: boolean }) =>
							copied ? 'Copied' : 'Copy',
						),
						h(CodeBlock.Code, null, () =>
							h(
								CodeBlock.Lines,
								null,
								({ line }: { line: CodeBlockLine }) => [
									h('span', { 'data-testid': 'gutter' }, line.number),
									h('span', null, line.content),
								],
							),
						),
					],
				);
		},
	});
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
		btn.click();

		expect(writeText).toHaveBeenCalledWith('const a = 1\nconst b = 2\nconst c = 3');
		await vi.waitFor(() => expect(screen.getByRole('button')).toHaveAttribute('data-copied', ''));
		expect(btn).toHaveTextContent('Copied');
	});

	it('throws when used outside Root', () => {
		const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
		expect(() => render({ setup: () => () => h(CodeBlock.Code) })).toThrow(/CodeBlock.Root/);
		spy.mockRestore();
	});
});
