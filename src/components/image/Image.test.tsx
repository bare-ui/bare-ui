import { describe, it, expect } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { Image } from './Image';

describe('Image', () => {
	it('renders a wrapper div and img', () => {
		const { container } = render(
			<Image
				src='photo.jpg'
				alt='A photo'
			/>,
		);
		expect(container.firstChild?.nodeName).toBe('DIV');
		expect(container.querySelector('img')).toBeInTheDocument();
	});

	it('shows loader placeholder before image loads', () => {
		const { container } = render(
			<Image
				src='photo.jpg'
				alt='A photo'
			/>,
		);
		expect(container.querySelector('[data-part="loader"]')).toBeInTheDocument();
	});

	it('img is hidden before load', () => {
		const { container } = render(
			<Image
				src='photo.jpg'
				alt='A photo'
			/>,
		);
		const img = container.querySelector('img') as HTMLElement;
		expect(img.style.display).toBe('none');
	});

	it('hides loader and shows img after load event', async () => {
		const { container } = render(
			<Image
				src='photo.jpg'
				alt='A photo'
			/>,
		);
		const img = container.querySelector('img')!;
		await act(async () => {
			img.dispatchEvent(new Event('load'));
		});
		expect(container.querySelector('[data-part="loader"]')).toBeNull();
		expect(img.style.display).toBe('');
	});

	it('img has data-loaded after load', async () => {
		const { container } = render(
			<Image
				src='photo.jpg'
				alt='A photo'
			/>,
		);
		const img = container.querySelector('img')!;
		await act(async () => {
			img.dispatchEvent(new Event('load'));
		});
		expect(img).toHaveAttribute('data-loaded');
	});

	it('hides loader on error too', async () => {
		const { container } = render(
			<Image
				src='bad.jpg'
				alt='Bad'
			/>,
		);
		const img = container.querySelector('img')!;
		await act(async () => {
			img.dispatchEvent(new Event('error'));
		});
		expect(container.querySelector('[data-part="loader"]')).toBeNull();
	});

	it('fires onImageLoaded callback after load', async () => {
		const onImageLoaded = vi.fn();
		const { container } = render(
			<Image
				src='photo.jpg'
				alt='A photo'
				onImageLoaded={onImageLoaded}
			/>,
		);
		const img = container.querySelector('img')!;
		await act(async () => {
			img.dispatchEvent(new Event('load'));
		});
		expect(onImageLoaded).toHaveBeenCalledTimes(1);
	});

	it('sets data-position from position prop', () => {
		const { container } = render(
			<Image
				src='photo.jpg'
				alt='A photo'
				position='center'
			/>,
		);
		expect(container.firstChild).toHaveAttribute('data-position', 'center');
	});

	it('applies className to wrapper', () => {
		const { container } = render(
			<Image
				src='photo.jpg'
				alt='A photo'
				className='my-image'
			/>,
		);
		expect(container.firstChild).toHaveClass('my-image');
	});
});
