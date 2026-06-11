/**
 * Screen-reader semantics for Diff. Diff is a headless renderer: it adds no ARIA
 * roles of its own, so add/remove status must not be conveyed by color alone —
 * the consumer supplies the accessible status text. These tests assert the
 * content is readable, the line type is available to drive that text, and the
 * stats summary can be announced.
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { h } from 'vue';
import { Diff } from '.';
import type { DiffLine } from './Diff.types';

const OLD = 'line one\nline two\nline three';
const NEW = 'line one\nline 2\nline three\nline four';

describe('Diff — screen reader semantics', () => {
	it('exposes each line type so consumers can announce add/remove beyond color', () => {
		const { container } = render({
			setup() {
				return () =>
					h(Diff.Root, { oldValue: OLD, newValue: NEW }, () =>
						h(Diff.Unified, null, {
							default: ({ line }: { line: DiffLine }) =>
								h('span', null, [
									line.type === 'insert'
										? h('span', { class: 'sr-only' }, 'Added: ')
										: null,
									line.type === 'delete'
										? h('span', { class: 'sr-only' }, 'Removed: ')
										: null,
									line.content,
								]),
						}),
					);
			},
		});
		// The line type drives a textual cue, not just a colored row.
		const inserted = container.querySelector('[data-type="insert"]') as HTMLElement;
		expect(inserted).toHaveTextContent('Added: line 2');
		const removed = container.querySelector('[data-type="delete"]') as HTMLElement;
		expect(removed).toHaveTextContent('Removed: line two');
	});

	it('exposes the diff content as readable text', () => {
		const { container } = render({
			setup() {
				return () =>
					h(Diff.Root, { oldValue: OLD, newValue: NEW }, () =>
						h(Diff.Unified, null, {
							default: ({ line }: { line: DiffLine }) => h('span', null, line.content),
						}),
					);
			},
		});
		const view = container.querySelector('[data-diff-view="unified"]') as HTMLElement;
		expect(view).toHaveTextContent('line one');
		expect(view).toHaveTextContent('line four');
	});

	it('does not impose misleading ARIA roles on its structural wrappers', () => {
		const { container } = render({
			setup() {
				return () =>
					h(Diff.Root, { oldValue: OLD, newValue: NEW }, () =>
						h(Diff.Unified, null, {
							default: ({ line }: { line: DiffLine }) => h('span', null, line.content),
						}),
					);
			},
		});
		expect(container.querySelector('[data-diff-view]')).not.toHaveAttribute('role');
		expect(container.querySelector('[data-diff-line]')).not.toHaveAttribute('role');
	});

	it('exposes the stats summary as announceable text', () => {
		render({
			setup() {
				return () =>
					h(Diff.Root, { oldValue: OLD, newValue: NEW }, () =>
						h(Diff.Stats, null, {
							default: ({
								additions,
								deletions,
							}: {
								additions: number;
								deletions: number;
							}) => h('span', null, `${additions} additions, ${deletions} deletions`),
						}),
					);
			},
		});
		expect(screen.getByText('2 additions, 1 deletions')).toBeInTheDocument();
	});
});
