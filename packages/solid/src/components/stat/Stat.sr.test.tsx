import { describe, it, expect } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import { expectExposedAs, accessibleNameVia } from '@/test/sr';
import { Stat } from './Stat';

describe('Stat — screen reader semantics', () => {
	it('groups the metric so its parts are read together', () => {
		render(() => (
			<Stat.Root>
				<Stat.Label>Revenue</Stat.Label>
				<Stat.Value>$12,400</Stat.Value>
			</Stat.Root>
		));
		// role=group lets the SR treat label + value as one unit.
		expect(screen.getByRole('group')).toBeInTheDocument();
	});

	it('associates the value with its label via aria-labelledby so the number is announced with context', () => {
		render(() => (
			<Stat.Root aria-labelledby='stat-label'>
				<Stat.Label id='stat-label'>Monthly revenue</Stat.Label>
				<Stat.Value>$48,250</Stat.Value>
			</Stat.Root>
		));
		// Consumer wires the group's name to the label id; the value is now announced
		// as "Monthly revenue, group" rather than a bare, contextless number.
		const group = expectExposedAs('group', 'Monthly revenue');
		expect(accessibleNameVia(group)).toBe('Monthly revenue');
	});

	it('keeps the delta text readable alongside its direction', () => {
		render(() => <Stat.Delta value={12.5}>+12.5%</Stat.Delta>);
		// The sign/direction is conveyed visually via data-direction, but the human
		// text (+12.5%) is what the SR reads — direction must not be SR-only data.
		const delta = screen.getByText('+12.5%');
		expect(delta).toHaveAttribute('data-direction', 'increase');
		expect(delta).toHaveTextContent('+12.5%');
	});

	it('hides the decorative sparkline from assistive tech', () => {
		const { container } = render(() => <Stat.Sparkline data={[1, 4, 2, 8, 5]} />);
		// The trend chart duplicates the value/delta; it must not add noise for SR.
		expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
	});
});
