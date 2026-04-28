import { describe, it, expect, vi } from 'vitest';
import { render, waitFor } from '@solidjs/testing-library';
import { Image } from './Image';

describe('Image', () => {
	it('renders a wrapper div and img', () => {
		const { container } = render(() => (
			<Image
				src='photo.jpg'
				alt='A photo'
			/>
		));
		expect(container.firstChild?.nodeName).toBe('DIV');
		expect(container.querySelector('img')).toBeInTheDocument();
	});

	it('shows loader placeholder before image loads', () => {
		const { container } = render(() => (
			<Image
				src='photo.jpg'
				alt='A photo'
			/>
		));
		expect(container.querySelector('[data-part="loader"]')).toBeInTheDocument();
	});

	it('img is hidden before load', () => {
		const { container } = render(() => (
			<Image
				src='photo.jpg'
				alt='A photo'
			/>
		));
		const img = container.querySelector('img') as HTMLElement;
		expect(img.style.display).toBe('none');
	});

	it('hides loader and shows img after load event', async () => {
		const { container } = render(() => (
			<Image
				src='photo.jpg'
				alt='A photo'
			/>
		));
		const img = container.querySelector('img')!;
		img.dispatchEvent(new Event('load'));
		await waitFor(() => {
			expect(container.querySelector('[data-part="loader"]')).toBeNull();
			expect(img.style.display).toBe('');
		});
	});

	it('img has data-loaded after load', async () => {
		const { container } = render(() => (
			<Image
				src='photo.jpg'
				alt='A photo'
			/>
		));
		const img = container.querySelector('img')!;
		img.dispatchEvent(new Event('load'));
		await waitFor(() => expect(img).toHaveAttribute('data-loaded'));
	});

	it('hides loader on error too', async () => {
		const { container } = render(() => (
			<Image
				src='bad.jpg'
				alt='Bad'
			/>
		));
		const img = container.querySelector('img')!;
		img.dispatchEvent(new Event('error'));
		await waitFor(() => expect(container.querySelector('[data-part="loader"]')).toBeNull());
	});

	it('fires onImageLoaded callback after load', async () => {
		const onImageLoaded = vi.fn();
		const { container } = render(() => (
			<Image
				src='photo.jpg'
				alt='A photo'
				onImageLoaded={onImageLoaded}
			/>
		));
		const img = container.querySelector('img')!;
		img.dispatchEvent(new Event('load'));
		await waitFor(() => expect(onImageLoaded).toHaveBeenCalledTimes(1));
	});

	it('sets data-position from position prop', () => {
		const { container } = render(() => (
			<Image
				src='photo.jpg'
				alt='A photo'
				position='center'
			/>
		));
		expect(container.firstChild).toHaveAttribute('data-position', 'center');
	});

	it('applies class to wrapper', () => {
		const { container } = render(() => (
			<Image
				src='photo.jpg'
				alt='A photo'
				class='my-image'
			/>
		));
		expect(container.firstChild).toHaveClass('my-image');
	});
});
