import { describe, it, expect } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { expectExposedAs } from '@/test/sr';
import { Avatar } from './Avatar';

describe('Avatar — screen reader semantics', () => {
	it('exposes the loaded image with its alt as the accessible name', async () => {
		render(
			<Avatar.Root>
				<Avatar.Image
					src='avatar.jpg'
					alt='Jane Doe'
					data-testid='img'
				/>
				<Avatar.Fallback>JD</Avatar.Fallback>
			</Avatar.Root>,
		);
		// The image is display:none until it loads, so it only enters the a11y tree once shown.
		await act(async () => {
			screen.getByTestId('img').dispatchEvent(new Event('load'));
		});
		// SR navigates to the image by role and announces "Jane Doe, image".
		expectExposedAs('img', 'Jane Doe');
	});

	it('hides a decorative avatar image from the a11y tree with empty alt', () => {
		render(
			<Avatar.Root>
				<Avatar.Image
					src='avatar.jpg'
					alt=''
				/>
				<Avatar.Fallback>JD</Avatar.Fallback>
			</Avatar.Root>,
		);
		// alt="" removes the image from the accessibility tree entirely.
		expect(screen.queryByRole('img')).toBeNull();
	});

	it('announces the fallback initials text when no image is present', () => {
		render(
			<Avatar.Root>
				<Avatar.Fallback>JD</Avatar.Fallback>
			</Avatar.Root>,
		);
		// With no <img>, the initials text is the only thing a SR can read.
		expect(screen.queryByRole('img')).toBeNull();
		expect(screen.getByText('JD')).toBeInTheDocument();
	});

	it('reads the fallback (not a broken image) after the image errors', async () => {
		render(
			<Avatar.Root>
				<Avatar.Image
					src='bad.jpg'
					alt='Jane Doe'
					data-testid='img'
				/>
				<Avatar.Fallback>JD</Avatar.Fallback>
			</Avatar.Root>,
		);
		const img = screen.getByTestId('img');
		await act(async () => {
			img.dispatchEvent(new Event('error'));
		});
		// The image stays in the tree but the visible/announced content is the fallback.
		expect(screen.getByText('JD')).toBeInTheDocument();
	});
});
