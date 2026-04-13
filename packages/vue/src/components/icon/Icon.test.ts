import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/vue';
import { Icon } from '.';

const testIcons = {
	alert: '<svg viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2z"/></svg>',
	home: '<svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="5"/></svg>',
};

describe('Icon', () => {
	it('renders an SVG element', () => {
		const { container } = render(Icon, { props: { type: 'alert', icons: testIcons } });
		expect(container.querySelector('svg')).toBeInTheDocument();
	});

	it('returns null when icon is not found', () => {
		const { container } = render(Icon, { props: { type: 'alert', icons: {} } });
		expect(container.querySelector('svg')).toBeNull();
	});

	it('parses viewBox from the SVG string', () => {
		const { container } = render(Icon, { props: { type: 'alert', icons: testIcons } });
		expect(container.querySelector('svg')).toHaveAttribute('viewBox', '0 0 24 24');
	});

	it('sets data-name to the icon type', () => {
		const { container } = render(Icon, { props: { type: 'alert', icons: testIcons } });
		expect(container.querySelector('svg')).toHaveAttribute('data-name', 'alert');
	});

	it('sets data-size attribute', () => {
		const { container } = render(Icon, { props: { type: 'alert', size: 'large', icons: testIcons } });
		expect(container.querySelector('svg')).toHaveAttribute('data-size', 'large');
	});

	it('is decorative (aria-hidden) when no label', () => {
		const { container } = render(Icon, { props: { type: 'alert', icons: testIcons } });
		expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
	});

	it('has aria-label when label is provided', () => {
		const { container } = render(Icon, { props: { type: 'alert', label: 'Warning', icons: testIcons } });
		const svg = container.querySelector('svg');
		expect(svg).toHaveAttribute('aria-label', 'Warning');
		expect(svg).not.toHaveAttribute('aria-hidden');
	});

	it('has role="img"', () => {
		const { container } = render(Icon, { props: { type: 'alert', icons: testIcons } });
		expect(container.querySelector('svg')).toHaveAttribute('role', 'img');
	});

	it('has focusable="false"', () => {
		const { container } = render(Icon, { props: { type: 'alert', icons: testIcons } });
		expect(container.querySelector('svg')).toHaveAttribute('focusable', 'false');
	});
});
