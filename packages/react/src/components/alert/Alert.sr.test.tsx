import { describe, it } from 'vitest';
import { render } from '@testing-library/react';
import { expectExposedAs, expectAnnounced } from '@/test/sr';
import { Alert } from './Alert';

describe('Alert — screen reader semantics', () => {
	it('exposes the container as role=alert (no accessible name required)', () => {
		render(
			<Alert.Root status='danger'>
				<Alert.Title>Payment failed</Alert.Title>
				<Alert.Description>Your card was declined.</Alert.Description>
			</Alert.Root>,
		);
		// role=alert is an implicit assertive live region, identified by role alone.
		expectExposedAs('alert', '');
	});

	it('announces the title and description assertively via the live region', () => {
		render(
			<Alert.Root status='danger'>
				<Alert.Title>Payment failed</Alert.Title>
				<Alert.Description>Your card was declined.</Alert.Description>
			</Alert.Root>,
		);
		// The whole alert subtree is announced the moment it mounts.
		expectAnnounced('Payment failed');
		expectAnnounced('Your card was declined.');
	});

	it('keeps the dismiss control reachable by its accessible name', () => {
		render(
			<Alert.Root>
				<Alert.Title>Heads up</Alert.Title>
				<Alert.Dismiss aria-label='Close alert' />
			</Alert.Root>,
		);
		// Consumer-supplied name; the button is navigable as a named control.
		expectExposedAs('button', 'Close alert');
	});

	it('falls back to a built-in dismiss label when none is supplied', () => {
		render(
			<Alert.Root>
				<Alert.Title>Heads up</Alert.Title>
				<Alert.Dismiss />
			</Alert.Root>,
		);
		expectExposedAs('button', 'Dismiss');
	});
});
