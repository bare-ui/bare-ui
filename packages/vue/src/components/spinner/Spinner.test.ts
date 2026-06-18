import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { Spinner } from '.';

describe('Spinner', () => {
	it('renders a status with default label', () => {
		render(Spinner);
		const status = screen.getByRole('status');
		expect(status).toHaveAttribute('aria-label', 'Loading');
	});

	it('uses a custom label', () => {
		render(Spinner, { props: { label: 'Fetching data' } });
		expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Fetching data');
	});
});
