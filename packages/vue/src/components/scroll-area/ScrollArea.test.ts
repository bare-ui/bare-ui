import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/vue';
import { h, nextTick } from 'vue';
import { ScrollArea } from '.';

function mockMetrics(el: HTMLElement, m: { client: number; scroll: number; offset: number }, vertical = true) {
	Object.defineProperty(el, vertical ? 'clientHeight' : 'clientWidth', { value: m.client, configurable: true });
	Object.defineProperty(el, vertical ? 'scrollHeight' : 'scrollWidth', { value: m.scroll, configurable: true });
	Object.defineProperty(el, vertical ? 'scrollTop' : 'scrollLeft', { value: m.offset, writable: true, configurable: true });
}

describe('ScrollArea', () => {
	it('viewport scrolls and hides the native scrollbar', () => {
		const { container } = render({
			setup() {
				return () =>
					h(ScrollArea.Root, null, () => [
						h(ScrollArea.Viewport, null, () => 'content'),
					]);
			},
		});
		const vp = container.querySelector('[data-scroll-area-viewport]') as HTMLElement;
		expect(vp.style.overflow).toBe('auto');
		expect(vp.style.scrollbarWidth).toBe('none');
	});

	it('hides the scrollbar when content does not overflow', () => {
		const { container } = render({
			setup() {
				return () =>
					h(ScrollArea.Root, null, () => [
						h(ScrollArea.Viewport, null, () => 'content'),
						h(ScrollArea.Scrollbar, { orientation: 'vertical' }, () => [
							h(ScrollArea.Thumb),
						]),
					]);
			},
		});
		expect(container.querySelector('[data-scroll-area-scrollbar]')).toBeNull();
	});

	it('renders a forceMount scrollbar with data-state hidden when no overflow', () => {
		const { container } = render({
			setup() {
				return () =>
					h(ScrollArea.Root, null, () => [
						h(ScrollArea.Viewport, null, () => 'content'),
						h(ScrollArea.Scrollbar, { forceMount: true, orientation: 'vertical' }, () => [
							h(ScrollArea.Thumb),
						]),
					]);
			},
		});
		expect(container.querySelector('[data-scroll-area-scrollbar]')).toHaveAttribute('data-state', 'hidden');
	});

	it('computes thumb size and position from scroll metrics', async () => {
		const { container } = render({
			setup() {
				return () =>
					h(ScrollArea.Root, null, () => [
						h(ScrollArea.Viewport, null, () => 'content'),
						h(ScrollArea.Scrollbar, { forceMount: true, orientation: 'vertical' }, () => [
							h(ScrollArea.Thumb),
						]),
					]);
			},
		});
		const vp = container.querySelector('[data-scroll-area-viewport]') as HTMLElement;

		mockMetrics(vp, { client: 100, scroll: 400, offset: 0 });
		fireEvent.scroll(vp);
		await nextTick();
		const thumb = container.querySelector('[data-scroll-area-thumb]') as HTMLElement;
		// 100 / 400 = 25%
		expect(thumb.style.height).toBe('25%');
		expect(thumb.style.top).toBe('0%');

		mockMetrics(vp, { client: 100, scroll: 400, offset: 300 });
		fireEvent.scroll(vp);
		await nextTick();
		// scrolled to the bottom -> offset = 100% - 25% = 75%
		expect(thumb.style.top).toBe('75%');
	});

	it('becomes visible once content overflows', async () => {
		const { container } = render({
			setup() {
				return () =>
					h(ScrollArea.Root, null, () => [
						h(ScrollArea.Viewport, null, () => 'content'),
						h(ScrollArea.Scrollbar, { orientation: 'vertical' }, () => [
							h(ScrollArea.Thumb),
						]),
					]);
			},
		});
		const vp = container.querySelector('[data-scroll-area-viewport]') as HTMLElement;
		mockMetrics(vp, { client: 100, scroll: 500, offset: 0 });
		fireEvent.scroll(vp);
		await nextTick();
		expect(container.querySelector('[data-scroll-area-scrollbar]')).toHaveAttribute('data-state', 'visible');
	});

	it('supports a horizontal scrollbar', async () => {
		const { container } = render({
			setup() {
				return () =>
					h(ScrollArea.Root, null, () => [
						h(ScrollArea.Viewport, null, () => 'content'),
						h(ScrollArea.Scrollbar, { forceMount: true, orientation: 'horizontal' }, () => [
							h(ScrollArea.Thumb),
						]),
					]);
			},
		});
		const vp = container.querySelector('[data-scroll-area-viewport]') as HTMLElement;
		mockMetrics(vp, { client: 200, scroll: 800, offset: 0 }, false);
		fireEvent.scroll(vp);
		await nextTick();
		const thumb = container.querySelector('[data-scroll-area-thumb]') as HTMLElement;
		expect(thumb.style.width).toBe('25%');
	});

	it('throws when Viewport is used outside Root', () => {
		const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
		expect(() => render({
			setup() {
				return () => h(ScrollArea.Viewport, null, () => 'x');
			},
		})).toThrow(/ScrollArea.Root/);
		spy.mockRestore();
	});

	it('throws when Thumb is used outside Scrollbar', () => {
		const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
		expect(() => render({
			setup() {
				return () =>
					h(ScrollArea.Root, null, () => [
						h(ScrollArea.Thumb),
					]);
			},
		})).toThrow(/ScrollArea.Scrollbar/);
		spy.mockRestore();
	});
});
