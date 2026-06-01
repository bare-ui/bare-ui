import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { expectExposedAs } from '@/test/sr';
import { Divider } from './Divider';

describe('Divider — screen reader semantics', () => {
	it('exposes a semantic divider as a separator with its orientation', () => {
		render(
			<Divider
				decorative={false}
				aria-orientation='vertical'
			/>,
		);
		const sep = expectExposedAs('separator');
		expect(sep).toHaveAttribute('aria-orientation', 'vertical');
	});

	it('hides a decorative divider from the a11y tree (role=none + aria-hidden)', () => {
		const { container } = render(<Divider />);
		const el = container.firstChild as HTMLElement;
		// Default decorative dividers are purely visual; SRs must skip them.
		expect(el).toHaveAttribute('role', 'none');
		expect(el).toHaveAttribute('aria-hidden', 'true');
		expect(screen.queryByRole('separator')).toBeNull();
	});
});
