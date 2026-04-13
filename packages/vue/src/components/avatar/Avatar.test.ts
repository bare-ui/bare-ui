import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/vue';
import { h, nextTick } from 'vue';
import { Avatar } from '.';

describe('Avatar', () => {
	it('root starts with data-status="loading"', () => {
		const { container } = render({
			setup: () => () =>
				h(Avatar.Root, null, () => [
					h(Avatar.Image, { src: 'test.jpg', alt: 'Test' }),
					h(Avatar.Fallback, null, () => 'JD'),
				]),
		});
		expect(container.firstChild).toHaveAttribute('data-status', 'loading');
	});

	it('fallback is visible while loading', () => {
		const { getByText } = render({
			setup: () => () =>
				h(Avatar.Root, null, () => [
					h(Avatar.Image, { src: 'test.jpg' }),
					h(Avatar.Fallback, null, () => 'JD'),
				]),
		});
		expect(getByText('JD')).toBeInTheDocument();
	});

	it('image not rendered when src is empty', () => {
		const { container } = render({
			setup: () => () =>
				h(Avatar.Root, null, () => [
					h(Avatar.Image, {}),
					h(Avatar.Fallback, null, () => 'JD'),
				]),
		});
		expect(container.querySelector('img')).toBeNull();
	});

	it('root data-status updates to "error" when no src', async () => {
		const { container } = render({
			setup: () => () =>
				h(Avatar.Root, null, () => [
					h(Avatar.Image, {}),
					h(Avatar.Fallback, null, () => 'JD'),
				]),
		});
		await nextTick();
		expect(container.firstChild).toHaveAttribute('data-status', 'error');
	});

	it('applies className to root', () => {
		const { container } = render({
			setup: () => () =>
				h(Avatar.Root, { class: 'my-avatar' }, () => h(Avatar.Fallback, null, () => 'JD')),
		});
		expect(container.firstChild).toHaveClass('my-avatar');
	});
});
