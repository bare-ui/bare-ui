import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@solidjs/testing-library';
import { Avatar } from './Avatar';

describe('Avatar', () => {
	it('renders Root with data-status="loading" initially when src is provided', () => {
		render(() => (
			<Avatar.Root data-testid='root'>
				<Avatar.Image
					src='avatar.jpg'
					alt='User'
				/>
				<Avatar.Fallback>JD</Avatar.Fallback>
			</Avatar.Root>
		));
		expect(screen.getByTestId('root')).toHaveAttribute('data-status', 'loading');
	});

	it('shows Fallback while loading', () => {
		render(() => (
			<Avatar.Root>
				<Avatar.Image
					src='avatar.jpg'
					alt='User'
				/>
				<Avatar.Fallback>JD</Avatar.Fallback>
			</Avatar.Root>
		));
		expect(screen.getByText('JD')).toBeInTheDocument();
	});

	it('hides Fallback after image loads successfully', async () => {
		render(() => (
			<Avatar.Root>
				<Avatar.Image
					src='avatar.jpg'
					alt='User'
					data-testid='img'
				/>
				<Avatar.Fallback>JD</Avatar.Fallback>
			</Avatar.Root>
		));
		const img = screen.getByTestId('img');
		img.dispatchEvent(new Event('load'));
		await waitFor(() => expect(screen.queryByText('JD')).toBeNull());
	});

	it('keeps Fallback visible on image error', async () => {
		render(() => (
			<Avatar.Root>
				<Avatar.Image
					src='bad-url.jpg'
					alt='User'
					data-testid='img'
				/>
				<Avatar.Fallback>JD</Avatar.Fallback>
			</Avatar.Root>
		));
		const img = screen.getByTestId('img');
		img.dispatchEvent(new Event('error'));
		await waitFor(() => expect(screen.getByText('JD')).toBeInTheDocument());
	});

	it('does not render Image when src is empty', () => {
		render(() => (
			<Avatar.Root>
				<Avatar.Image
					src=''
					alt='User'
				/>
				<Avatar.Fallback>JD</Avatar.Fallback>
			</Avatar.Root>
		));
		expect(screen.queryByRole('img')).toBeNull();
		expect(screen.getByText('JD')).toBeInTheDocument();
	});

	it('root data-status updates to "loaded" after image loads', async () => {
		render(() => (
			<Avatar.Root data-testid='root'>
				<Avatar.Image
					src='avatar.jpg'
					alt='User'
					data-testid='img'
				/>
				<Avatar.Fallback>JD</Avatar.Fallback>
			</Avatar.Root>
		));
		const img = screen.getByTestId('img');
		img.dispatchEvent(new Event('load'));
		await waitFor(() => expect(screen.getByTestId('root')).toHaveAttribute('data-status', 'loaded'));
	});

	it('root data-status updates to "error" on image error', async () => {
		render(() => (
			<Avatar.Root data-testid='root'>
				<Avatar.Image
					src='bad.jpg'
					alt='User'
					data-testid='img'
				/>
				<Avatar.Fallback>JD</Avatar.Fallback>
			</Avatar.Root>
		));
		const img = screen.getByTestId('img');
		img.dispatchEvent(new Event('error'));
		await waitFor(() => expect(screen.getByTestId('root')).toHaveAttribute('data-status', 'error'));
	});

	it('Fallback with delayMs=0 renders immediately', () => {
		render(() => (
			<Avatar.Root>
				<Avatar.Fallback delayMs={0}>JD</Avatar.Fallback>
			</Avatar.Root>
		));
		expect(screen.getByText('JD')).toBeInTheDocument();
	});

	// Suppress unused import warning — vi is referenced by other test files in this package
	void vi;
});
