import { describe, it } from 'vitest';
import { render } from '@testing-library/vue';
import { h } from 'vue';
import { expectExposedAs, expectAnnounced } from '@/test/sr';
import { Alert } from '.';

describe('Alert — screen reader semantics', () => {
	it('exposes the container as role=alert (no accessible name required)', () => {
		render({
			setup: () => () =>
				h(Alert.Root, { status: 'danger' }, () => [
					h(Alert.Title, null, () => 'Payment failed'),
					h(Alert.Description, null, () => 'Your card was declined.'),
				]),
		});
		// role=alert is an implicit assertive live region, identified by role alone.
		expectExposedAs('alert', '');
	});

	it('announces the title and description assertively via the live region', () => {
		render({
			setup: () => () =>
				h(Alert.Root, { status: 'danger' }, () => [
					h(Alert.Title, null, () => 'Payment failed'),
					h(Alert.Description, null, () => 'Your card was declined.'),
				]),
		});
		// The whole alert subtree is announced the moment it mounts.
		expectAnnounced('Payment failed');
		expectAnnounced('Your card was declined.');
	});

	it('keeps the dismiss control reachable by its accessible name', () => {
		render({
			setup: () => () =>
				h(Alert.Root, null, () => [
					h(Alert.Title, null, () => 'Heads up'),
					h(Alert.Dismiss, { 'aria-label': 'Close alert' }),
				]),
		});
		// Consumer-supplied name; the button is navigable as a named control.
		expectExposedAs('button', 'Close alert');
	});

	it('falls back to a built-in dismiss label when none is supplied', () => {
		render({
			setup: () => () =>
				h(Alert.Root, null, () => [
					h(Alert.Title, null, () => 'Heads up'),
					h(Alert.Dismiss),
				]),
		});
		expectExposedAs('button', 'Dismiss');
	});
});
