import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { h } from 'vue';
import { Stat } from '.';

describe('Stat', () => {
	it('renders label, value and help text', () => {
		render({
			setup() {
				return () =>
					h(Stat.Root, null, () => [
						h(Stat.Label, null, () => 'Revenue'),
						h(Stat.Value, null, () => '$12,400'),
						h(Stat.HelpText, null, () => 'vs last month'),
					]);
			},
		});
		expect(screen.getByText('Revenue')).toBeInTheDocument();
		expect(screen.getByText('$12,400')).toBeInTheDocument();
		expect(screen.getByText('vs last month')).toBeInTheDocument();
		expect(screen.getByRole('group')).toBeInTheDocument();
	});

	it('renders the value prop as a fallback when there are no children', () => {
		const { container } = render({
			setup() {
				return () => h(Stat.Value, { value: 42 });
			},
		});
		expect(container.firstElementChild).toHaveTextContent('42');
	});

	it('renders a zero value', () => {
		const { container } = render({
			setup() {
				return () => h(Stat.Value, { value: 0 });
			},
		});
		expect(container.firstElementChild).toHaveTextContent('0');
	});

	it('lets children override the value prop', () => {
		render({
			setup() {
				return () => h(Stat.Value, { value: 42 }, () => '$42.00');
			},
		});
		expect(screen.getByText('$42.00')).toBeInTheDocument();
		expect(screen.queryByText('42')).toBeNull();
	});

	it('infers delta direction from a positive value', () => {
		render({
			setup() {
				return () => h(Stat.Delta, { value: 12.5 }, () => '+12.5%');
			},
		});
		expect(screen.getByText('+12.5%')).toHaveAttribute('data-direction', 'increase');
	});

	it('infers decrease from a negative value', () => {
		const { container } = render({
			setup() {
				return () => h(Stat.Delta, { value: -3 });
			},
		});
		expect(container.firstElementChild).toHaveAttribute('data-direction', 'decrease');
		expect(container.firstElementChild).toHaveTextContent('-3');
	});

	it('treats zero as neutral', () => {
		const { container } = render({
			setup() {
				return () => h(Stat.Delta, { value: 0 });
			},
		});
		expect(container.firstElementChild).toHaveAttribute('data-direction', 'neutral');
	});

	it('lets an explicit direction override the value sign', () => {
		render({
			setup() {
				return () => h(Stat.Delta, { value: 5, direction: 'decrease' }, () => '5');
			},
		});
		expect(screen.getByText('5')).toHaveAttribute('data-direction', 'decrease');
	});

	it('renders a sparkline polyline from data', () => {
		const { container } = render({
			setup() {
				return () => h(Stat.Sparkline, { data: [1, 4, 2, 8, 5] });
			},
		});
		const poly = container.querySelector('polyline');
		expect(poly).toBeInTheDocument();
		const points = poly!.getAttribute('points')!.split(' ');
		expect(points).toHaveLength(5);
		// first point at x=0, last at x=width(100)
		expect(points[0].startsWith('0.00,')).toBe(true);
		expect(points[4].startsWith('100.00,')).toBe(true);
	});

	it('renders nothing for a sparkline with fewer than 2 points', () => {
		const { container } = render({
			setup() {
				return () => h(Stat.Sparkline, { data: [5] });
			},
		});
		expect(container.querySelector('svg')).toBeNull();
	});

	it('marks the sparkline as decorative', () => {
		const { container } = render({
			setup() {
				return () => h(Stat.Sparkline, { data: [1, 2, 3] });
			},
		});
		expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
	});

	it('forwards class and data attributes to Root', () => {
		render({
			setup() {
				return () => h(Stat.Root, { class: 'my-stat', 'data-testid': 'root' });
			},
		});
		expect(screen.getByTestId('root')).toHaveClass('my-stat');
	});
});
