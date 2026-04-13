import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/vue';
import { Divider } from '.';

describe('Divider', () => {
	it('renders with role="none" when decorative', () => {
		const { container } = render(Divider);
		expect(container.firstChild).toHaveAttribute('role', 'none');
	});

	it('renders with aria-hidden when decorative', () => {
		const { container } = render(Divider);
		expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
	});

	it('renders with role="separator" when not decorative', () => {
		const { container } = render(Divider, { props: { decorative: false } });
		expect(container.firstChild).toHaveAttribute('role', 'separator');
	});

	it('sets aria-orientation when not decorative', () => {
		const { container } = render(Divider, { props: { decorative: false, orientation: 'vertical' } });
		expect(container.firstChild).toHaveAttribute('aria-orientation', 'vertical');
	});

	it('defaults to horizontal orientation', () => {
		const { container } = render(Divider);
		expect(container.firstChild).toHaveAttribute('data-orientation', 'horizontal');
	});

	it('sets data-orientation to vertical', () => {
		const { container } = render(Divider, { props: { orientation: 'vertical' } });
		expect(container.firstChild).toHaveAttribute('data-orientation', 'vertical');
	});

	it('applies className', () => {
		const { container } = render(Divider, { attrs: { class: 'my-divider' } });
		expect(container.firstChild).toHaveClass('my-divider');
	});
});
