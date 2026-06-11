import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { h } from 'vue';
import { expectExposedAs } from '@/test/sr';
import { Skeleton } from '.';

describe('Skeleton — screen reader semantics', () => {
	it('exposes a busy live status announcing that content is loading', () => {
		render(Skeleton);
		// SR hears the polite status named "Loading" (via aria-label) and sees aria-busy so it can wait.
		const status = expectExposedAs('status', 'Loading');
		expect(status).toHaveAttribute('aria-busy', 'true');
		expect(status).toHaveAttribute('aria-live', 'polite');
	});

	it('lets the consumer override the announced loading label', () => {
		render(Skeleton, { props: { ariaLabel: 'Loading profile' } });
		expectExposedAs('status', 'Loading profile');
	});

	it('drops the status entirely once real content replaces the placeholder', () => {
		render(Skeleton, {
			props: { loading: false },
			slots: { default: () => h('p', null, 'Loaded content') },
		});
		// No lingering busy region; the SR reads only the real content.
		expect(screen.queryByRole('status')).toBeNull();
		expect(screen.getByText('Loaded content')).toBeInTheDocument();
	});
});
