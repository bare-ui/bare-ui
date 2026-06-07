import { describe, it, expect } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import { expectExposedAs, expectAnnounced } from '@/test/sr';
import { Spinner } from './Spinner';

describe('Spinner — screen reader semantics', () => {
	it('exposes a role=status with an accessible name', () => {
		render(() => <Spinner />);
		// Loading indicators must carry a name so SR users know what is busy.
		expectExposedAs('status', 'Loading');
	});

	it('uses a consumer-supplied label as the accessible name', () => {
		render(() => <Spinner label='Saving changes' />);
		expectExposedAs('status', 'Saving changes');
	});

	it('announces the label politely via the live region', () => {
		render(() => <Spinner label='Fetching data' />);
		const status = screen.getByRole('status');
		// Polite so it does not interrupt; status role is implicitly polite, and it
		// also declares aria-live explicitly for cross-AT consistency.
		expect(status).toHaveAttribute('aria-live', 'polite');
		expectAnnounced('Fetching data');
	});

	it('hides the decorative visual from screen readers, leaving only the label', () => {
		const { container } = render(() => (
			<Spinner label='Loading'>
				<svg data-testid='ring' />
			</Spinner>
		));
		// The animated visual is wrapped in an aria-hidden span (decorative by default),
		// so only the label text reaches the SR.
		const decorative = container.querySelector('[aria-hidden="true"]');
		expect(decorative).not.toBeNull();
		expect(decorative).toContainElement(screen.getByTestId('ring'));
	});

	it('exposes the visual to screen readers when decorative=false', () => {
		const { container } = render(() => (
			<Spinner
				label='Loading'
				decorative={false}>
				<svg data-testid='ring' />
			</Spinner>
		));
		// When the consumer opts out, the inner wrapper is no longer hidden.
		const wrapper = screen.getByTestId('ring').parentElement;
		expect(wrapper).not.toHaveAttribute('aria-hidden');
		void container;
	});
});
