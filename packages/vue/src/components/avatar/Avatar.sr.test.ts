import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { h, nextTick } from 'vue';
import { expectExposedAs } from '@/test/sr';
import { Avatar } from '.';

describe('Avatar — screen reader semantics', () => {
	it('exposes the loaded image with its alt as the accessible name', async () => {
		const { getByTestId } = render({
			setup: () => () =>
				h(Avatar.Root, null, () => [
					h(Avatar.Image, { src: 'avatar.jpg', alt: 'Jane Doe', 'data-testid': 'img' }),
					h(Avatar.Fallback, null, () => 'JD'),
				]),
		});
		// The image is display:none until it loads, so it only enters the a11y tree once shown.
		const img = getByTestId('img');
		img.dispatchEvent(new Event('load'));
		await nextTick();
		// SR navigates to the image by role and announces "Jane Doe, image".
		expectExposedAs('img', 'Jane Doe');
	});

	it('hides a decorative avatar image from the a11y tree with empty alt', () => {
		render({
			setup: () => () =>
				h(Avatar.Root, null, () => [
					h(Avatar.Image, { src: 'avatar.jpg', alt: '' }),
					h(Avatar.Fallback, null, () => 'JD'),
				]),
		});
		// alt="" removes the image from the accessibility tree entirely.
		expect(screen.queryByRole('img')).toBeNull();
	});

	it('announces the fallback initials text when no image is present', () => {
		render({
			setup: () => () =>
				h(Avatar.Root, null, () => [
					h(Avatar.Fallback, null, () => 'JD'),
				]),
		});
		// With no <img>, the initials text is the only thing a SR can read.
		expect(screen.queryByRole('img')).toBeNull();
		expect(screen.getByText('JD')).toBeInTheDocument();
	});

	it('reads the fallback (not a broken image) after the image errors', async () => {
		const { getByTestId } = render({
			setup: () => () =>
				h(Avatar.Root, null, () => [
					h(Avatar.Image, { src: 'bad.jpg', alt: 'Jane Doe', 'data-testid': 'img' }),
					h(Avatar.Fallback, null, () => 'JD'),
				]),
		});
		const img = getByTestId('img');
		img.dispatchEvent(new Event('error'));
		await nextTick();
		// The image stays in the tree but the visible/announced content is the fallback.
		expect(screen.getByText('JD')).toBeInTheDocument();
	});
});