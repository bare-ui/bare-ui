import { describe, it, expect } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import { Stat } from './Stat';

describe('Stat', () => {
	it('renders label, value and help text', () => {
		render(() => (
			<Stat.Root>
				<Stat.Label>Revenue</Stat.Label>
				<Stat.Value>$12,400</Stat.Value>
				<Stat.HelpText>vs last month</Stat.HelpText>
			</Stat.Root>
		));
		expect(screen.getByText('Revenue')).toBeInTheDocument();
		expect(screen.getByText('$12,400')).toBeInTheDocument();
		expect(screen.getByText('vs last month')).toBeInTheDocument();
		expect(screen.getByRole('group')).toBeInTheDocument();
	});

	it('infers delta direction from a positive value', () => {
		render(() => <Stat.Delta value={12.5}>+12.5%</Stat.Delta>);
		expect(screen.getByText('+12.5%')).toHaveAttribute('data-direction', 'increase');
	});

	it('infers decrease from a negative value', () => {
		const { container } = render(() => <Stat.Delta value={-3} />);
		expect(container.firstElementChild).toHaveAttribute('data-direction', 'decrease');
		expect(container.firstElementChild).toHaveTextContent('-3');
	});

	it('treats zero as neutral', () => {
		const { container } = render(() => <Stat.Delta value={0} />);
		expect(container.firstElementChild).toHaveAttribute('data-direction', 'neutral');
	});

	it('lets an explicit direction override the value sign', () => {
		render(() => (
			<Stat.Delta
				value={5}
				direction='decrease'>
				5
			</Stat.Delta>
		));
		expect(screen.getByText('5')).toHaveAttribute('data-direction', 'decrease');
	});

	it('renders a sparkline polyline from data', () => {
		const { container } = render(() => <Stat.Sparkline data={[1, 4, 2, 8, 5]} />);
		const poly = container.querySelector('polyline');
		expect(poly).toBeInTheDocument();
		const points = poly!.getAttribute('points')!.split(' ');
		expect(points).toHaveLength(5);
		// first point at x=0, last at x=width(100)
		expect(points[0].startsWith('0.00,')).toBe(true);
		expect(points[4].startsWith('100.00,')).toBe(true);
	});

	it('renders nothing for a sparkline with fewer than 2 points', () => {
		const { container } = render(() => <Stat.Sparkline data={[5]} />);
		expect(container.querySelector('svg')).toBeNull();
	});

	it('marks the sparkline as decorative', () => {
		const { container } = render(() => <Stat.Sparkline data={[1, 2, 3]} />);
		expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
	});
});
