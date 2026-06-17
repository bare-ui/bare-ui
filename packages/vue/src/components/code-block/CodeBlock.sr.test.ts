/**
 * Screen-reader semantics for CodeBlock. The copy control must be exposed as a
 * button whose accessible name describes the action and flips to a "Copied"
 * confirmation after activation, and the source code must be readable text in
 * a <pre>/<code> structure so SR users can review it.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/vue';
import { h } from 'vue';
import { expectExposedAs } from '@/test/sr';
import { CodeBlock } from '.';
import type { CodeBlockLine } from '.';

function renderBlock(
	props: Partial<{
		code: string;
		language: string;
		diff: Record<number, 'add' | 'remove'>;
		highlightLines: number[];
		startLine: number;
		copyResetAfter: number;
	}> = {},
) {
	return render({
		setup() {
			return () =>
				h(
					CodeBlock.Root,
					{
						code: 'const a = 1\nconst b = 2',
						language: 'ts',
						...props,
					},
					() => [
						h(CodeBlock.CopyButton, null, {
							default: ({ copied }: { copied: boolean }) => (copied ? 'Copied' : 'Copy'),
						}),
						h(CodeBlock.Code, null, () =>
							h(CodeBlock.Lines, null, {
								default: ({ line }: { line: CodeBlockLine }) => h('span', null, line.content),
							}),
						),
					],
				);
		},
	});
}

describe('CodeBlock — screen reader semantics', () => {
	it('exposes the copy control as a button with an action name', () => {
		renderBlock();
		// The visible "Copy" glyph is overridden; SR announces "Copy code, button".
		expectExposedAs('button', 'Copy code');
	});

	it('flips the copy button name to a "Copied" confirmation after activation', async () => {
		const writeText = vi.fn().mockResolvedValue(undefined);
		Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
		renderBlock();

		screen.getByRole('button', { name: 'Copy code' }).click();
		// The accessible name changes to "Copied", which SR re-announces on focus.
		await waitFor(() => expectExposedAs('button', 'Copied'));
	});

	it('exposes the source code as readable text', () => {
		const { container } = renderBlock();
		const code = container.querySelector('pre code') as HTMLElement;
		expect(code).toHaveTextContent('const a = 1');
		expect(code).toHaveTextContent('const b = 2');
	});
});
