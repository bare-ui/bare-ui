import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { h } from 'vue';
import { expectExposedAs, accessibleNameVia } from '@/test/sr';
import { Card } from '.';

describe('Card — screen reader semantics', () => {
	it('adds no spurious role by default — a plain card is transparent to the a11y tree', () => {
		render({
			setup: () => () =>
				h(Card, { 'data-testid': 'card' }, () => 'Just content'),
		});
		const card = screen.getByTestId('card');
		// A decorative container should not invent landmark/region semantics.
		expect(card).not.toHaveAttribute('role');
		expect(card).not.toHaveAttribute('aria-label');
		// Its children remain readable; the wrapper itself announces nothing extra.
		expect(screen.getByText('Just content')).toBeInTheDocument();
	});

	it('becomes a named region when the consumer opts into landmark semantics', () => {
		render({
			setup: () => () =>
				h(Card, { role: 'region', 'aria-label': 'Billing summary' }, () => 'content'),
		});
		expectExposedAs('region', 'Billing summary');
	});

	it('derives its accessible name from a heading via aria-labelledby', () => {
		render({
			setup: () => () =>
				h(
					Card,
					{ role: 'region', 'aria-labelledby': 'card-title', 'data-testid': 'card' },
					() => h('h2', { id: 'card-title' }, 'Monthly report'),
				),
		});
		expect(accessibleNameVia(screen.getByTestId('card'))).toBe('Monthly report');
	});
});