import { describe, it, expect } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { expectExposedAs } from '@/test/sr';
import { Image } from './Image';

describe('Image — screen reader semantics', () => {
	it('exposes the loaded image with its alt as the accessible name', async () => {
		const { container } = render(
			<Image
				src='photo.jpg'
				alt='A golden retriever puppy'
			/>,
		);
		// The img is display:none until it loads, entering the a11y tree once shown.
		await act(async () => {
			container.querySelector('img')!.dispatchEvent(new Event('load'));
		});
		// SR announces "A golden retriever puppy, image".
		expectExposedAs('img', 'A golden retriever puppy');
	});

	it('hides a decorative image (empty alt) from the a11y tree', () => {
		render(
			<Image
				src='divider-flourish.png'
				alt=''
			/>,
		);
		// alt="" marks the image as presentational; SRs skip it.
		expect(screen.queryByRole('img')).toBeNull();
	});

	it('carries no spurious SR text on the loading placeholder', () => {
		const { container } = render(
			<Image
				src='photo.jpg'
				alt='Team photo'
			/>,
		);
		// While loading the img is display:none (out of the a11y tree) and the loader
		// placeholder is a bare div — neither announces stray text to a SR.
		expect(screen.queryByRole('img')).toBeNull();
		const loader = container.querySelector('[data-part="loader"]')!;
		expect(loader.textContent).toBe('');
	});
});
