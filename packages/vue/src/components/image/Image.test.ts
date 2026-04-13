import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/vue';
import { Image } from '.';

describe('Image', () => {
	it('renders a wrapper div', () => {
		const { container } = render(Image, { props: { src: 'test.jpg' } });
		expect(container.firstChild?.nodeName).toBe('DIV');
	});

	it('shows loader when not loaded', () => {
		const { container } = render(Image, { props: { src: 'test.jpg' } });
		expect(container.querySelector('[data-part="loader"]')).toBeInTheDocument();
	});

	it('hides image when not loaded', () => {
		const { container } = render(Image, { props: { src: 'test.jpg' } });
		const img = container.querySelector('[data-part="image"]') as HTMLElement;
		expect(img.style.display).toBe('none');
	});

	it('sets data-position attribute', () => {
		const { container } = render(Image, { props: { src: 'test.jpg', position: 'center' } });
		expect(container.firstChild).toHaveAttribute('data-position', 'center');
	});

	it('applies className', () => {
		const { container } = render(Image, { props: { src: 'test.jpg' }, attrs: { class: 'my-image' } });
		expect(container.firstChild).toHaveClass('my-image');
	});

	it('sets alt attribute', () => {
		const { container } = render(Image, { props: { src: 'test.jpg', alt: 'Test image' } });
		const img = container.querySelector('img');
		expect(img).toHaveAttribute('alt', 'Test image');
	});

	it('sets src attribute', () => {
		const { container } = render(Image, { props: { src: 'test.jpg' } });
		const img = container.querySelector('img');
		expect(img).toHaveAttribute('src', 'test.jpg');
	});
});
