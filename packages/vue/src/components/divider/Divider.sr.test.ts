import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { h } from 'vue';
import { expectExposedAs } from '@/test/sr';
import { Divider } from '.';

describe('Divider — screen reader semantics', () => {
	it('exposes a semantic divider as a separator with its orientation', () => {
		render({
			setup: () => () =>
				h(Divider, { decorative: false, 'aria-orientation': 'vertical' }),
		});
		const sep = expectExposedAs('separator');
		expect(sep).toHaveAttribute('aria-orientation', 'vertical');
	});

	it('hides a decorative divider from the a11y tree (role=none + aria-hidden)', () => {
		const { container } = render({
			setup: () => () => h(Divider),
		});
		const el = container.firstChild as HTMLElement;
		expect(el).toHaveAttribute('role', 'none');
		expect(el).toHaveAttribute('aria-hidden', 'true');
		expect(screen.queryByRole('separator')).toBeNull();
	});
});