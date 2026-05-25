import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { h } from 'vue';
import { Diff } from '.';
import type { DiffLine, DiffRow } from './Diff.types';

const OLD = 'line one\nline two\nline three';
const NEW = 'line one\nline 2\nline three\nline four';

function renderUnified(oldValue = OLD, newValue = NEW) {
	return render({
		setup() {
			return () =>
				h(Diff.Root, { oldValue, newValue }, () =>
					h(Diff.Unified, null, {
						default: ({ line }: { line: DiffLine }) =>
							h('span', null, `${line.oldLine ?? ''}|${line.newLine ?? ''}|${line.content}`),
					}),
				);
		},
	});
}

describe('Diff', () => {
	it('marks unchanged lines as equal', () => {
		const { container } = renderUnified();
		const equal = container.querySelectorAll('[data-type="equal"]');
		expect(equal).toHaveLength(2); // "line one" and "line three"
		expect(equal[0]).toHaveTextContent('line one');
	});

	it('detects deletions and insertions', () => {
		const { container } = renderUnified();
		expect(container.querySelector('[data-type="delete"]')).toHaveTextContent('line two');
		const inserts = container.querySelectorAll('[data-type="insert"]');
		expect(inserts[0]).toHaveTextContent('line 2');
		expect(inserts[1]).toHaveTextContent('line four');
	});

	it('assigns old/new line numbers correctly', () => {
		const { container } = renderUnified();
		// "line three" is equal: old #3, new #3
		const equalLines = [...container.querySelectorAll('[data-type="equal"]')];
		const three = equalLines.find((el) => el.textContent?.includes('line three'))!;
		expect(three).toHaveTextContent('3|3|line three');
	});

	it('reports additions and deletions stats', () => {
		render({
			setup() {
				return () =>
					h(Diff.Root, { oldValue: OLD, newValue: NEW }, () =>
						h(Diff.Stats, null, {
							default: ({ additions, deletions }: { additions: number; deletions: number }) =>
								h('span', null, `+${additions} -${deletions}`),
						}),
					);
			},
		});
		// inserts: "line 2", "line four" => 2 ; deletes: "line two" => 1
		expect(screen.getByText('+2 -1')).toBeInTheDocument();
	});

	it('pairs a modified line into one split row', () => {
		const { container } = render({
			setup() {
				return () =>
					h(Diff.Root, { oldValue: OLD, newValue: NEW }, () =>
						h(Diff.Split, null, {
							default: ({ left, right }: DiffRow) =>
								h('span', null, [
									h('span', { 'data-side': 'left' }, left?.content ?? ''),
									h('span', { 'data-side': 'right' }, right?.content ?? ''),
								]),
						}),
					);
			},
		});
		const rows = container.querySelectorAll('[data-diff-row]');
		// row 0: equal "line one" both sides
		expect(rows[0]).toHaveAttribute('data-left', 'equal');
		expect(rows[0]).toHaveAttribute('data-right', 'equal');
		// row 1: "line two" deleted | "line 2" inserted -> paired
		expect(rows[1]).toHaveAttribute('data-left', 'delete');
		expect(rows[1]).toHaveAttribute('data-right', 'insert');
		// last row: pure insert "line four" -> only right side
		const last = rows[rows.length - 1];
		expect(last).toHaveAttribute('data-right', 'insert');
		expect(last).not.toHaveAttribute('data-left');
	});

	it('treats identical inputs as all-equal', () => {
		const { container } = renderUnified('same\ntext', 'same\ntext');
		expect(container.querySelectorAll('[data-type="equal"]')).toHaveLength(2);
		expect(container.querySelector('[data-type="insert"]')).toBeNull();
		expect(container.querySelector('[data-type="delete"]')).toBeNull();
	});

	it('handles empty old value as pure insertions', () => {
		const { container } = renderUnified('', 'a\nb');
		expect(container.querySelectorAll('[data-type="insert"]')).toHaveLength(2);
		expect(container.querySelector('[data-type="equal"]')).toBeNull();
	});

	it('throws when used outside Root', () => {
		const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
		expect(() =>
			render({
				setup() {
					return () =>
						h(Diff.Unified, null, {
							default: () => null,
						});
				},
			}),
		).toThrow(/Diff.Root/);
		spy.mockRestore();
	});
});
