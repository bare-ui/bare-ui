/**
 * Screen-reader semantics for CodeBlock. The copy control must be exposed as a
 * button whose accessible name describes the action and flips to a "Copied"
 * confirmation after activation, and the source code must be readable text in
 * a <pre>/<code> structure so SR users can review it.
 */
import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { expectExposedAs } from '@/test/sr';
import { CodeBlock } from './CodeBlock';

function renderBlock(props: Partial<React.ComponentProps<typeof CodeBlock.Root>> = {}) {
	return render(
		<CodeBlock.Root
			code={'const a = 1\nconst b = 2'}
			language='ts'
			{...props}>
			<CodeBlock.CopyButton>{({ copied }) => (copied ? 'Copied' : 'Copy')}</CodeBlock.CopyButton>
			<CodeBlock.Code>
				<CodeBlock.Lines>{({ line }) => <span>{line.content}</span>}</CodeBlock.Lines>
			</CodeBlock.Code>
		</CodeBlock.Root>,
	);
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

		fireEvent.click(screen.getByRole('button', { name: 'Copy code' }));
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
