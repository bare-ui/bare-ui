/**
 * Screen-reader semantics for ProgressBar. SR announces a progressbar by its
 * name and current value within min/max; the value must update as it advances.
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import { createSignal } from 'solid-js';
import { ProgressBar } from './ProgressBar';
import { expectExposedAs } from '@/test/sr';

describe('ProgressBar — screen reader semantics', () => {
	it('is exposed as a progressbar with name and value range', () => {
		render(() => (
			<ProgressBar
				percentage={40}
				aria-label='Upload'
			/>
		));
		const bar = expectExposedAs('progressbar', 'Upload');
		expect(bar).toHaveAttribute('aria-valuenow', '40');
		expect(bar).toHaveAttribute('aria-valuemin', '0');
		expect(bar).toHaveAttribute('aria-valuemax', '100');
	});

	it('updates the announced value as progress advances', () => {
		const [pct, setPct] = createSignal(40);
		render(() => (
			<ProgressBar
				percentage={pct()}
				aria-label='Upload'
			/>
		));
		setPct(75);
		expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '75');
	});

	it('clamps the announced value to the 0–100 range', () => {
		render(() => (
			<ProgressBar
				percentage={140}
				aria-label='Upload'
			/>
		));
		expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
	});
});
