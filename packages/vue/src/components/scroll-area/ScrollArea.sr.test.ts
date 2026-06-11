/**
 * Screen-reader semantics for ScrollArea. The viewport hides the native
 * scrollbar, so the scrollable region must stay keyboard-reachable (tabIndex=0)
 * and be labellable, otherwise keyboard/SR users can't reach the content the
 * custom scrollbar scrolls. The custom scrollbar/thumb are pointer-only
 * decoration and must not pollute the a11y tree.
 */
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/vue';
import { ScrollArea } from '.';

const {
	Root: ScrollAreaRoot,
	Viewport: ScrollAreaViewport,
	Scrollbar: ScrollAreaScrollbar,
	Thumb: ScrollAreaThumb,
} = ScrollArea;

describe('ScrollArea — screen reader semantics', () => {
	it('makes the scrollable viewport keyboard-reachable', () => {
		const { container } = render({
			template: `
				<ScrollAreaRoot>
					<ScrollAreaViewport>content</ScrollAreaViewport>
				</ScrollAreaRoot>
			`,
			components: { ScrollAreaRoot, ScrollAreaViewport },
		});
		const vp = container.querySelector('[data-scroll-area-viewport]') as HTMLElement;
		// tabIndex=0 lets keyboard-only and SR users focus and scroll the region.
		expect(vp).toHaveAttribute('tabindex', '0');
	});

	it('lets the viewport carry a consumer label so SR users can identify the region', () => {
		const { container } = render({
			template: `
				<ScrollAreaRoot>
					<ScrollAreaViewport aria-label="Changelog">content</ScrollAreaViewport>
				</ScrollAreaRoot>
			`,
			components: { ScrollAreaRoot, ScrollAreaViewport },
		});
		const vp = container.querySelector('[data-scroll-area-viewport]') as HTMLElement;
		expect(vp).toHaveAttribute('aria-label', 'Changelog');
	});

	it('exposes the readable content inside the viewport', () => {
		const { getByText } = render({
			template: `
				<ScrollAreaRoot>
					<ScrollAreaViewport>
						<p>Release notes go here.</p>
					</ScrollAreaViewport>
				</ScrollAreaRoot>
			`,
			components: { ScrollAreaRoot, ScrollAreaViewport },
		});
		expect(getByText('Release notes go here.')).toBeInTheDocument();
	});

	it('keeps the custom scrollbar and thumb out of the a11y tree (no role)', () => {
		const { container } = render({
			template: `
				<ScrollAreaRoot>
					<ScrollAreaViewport>content</ScrollAreaViewport>
					<ScrollAreaScrollbar :forceMount="true" orientation="vertical">
						<ScrollAreaThumb />
					</ScrollAreaScrollbar>
				</ScrollAreaRoot>
			`,
			components: { ScrollAreaRoot, ScrollAreaViewport, ScrollAreaScrollbar, ScrollAreaThumb },
		});
		// The decorative scrollbar/thumb are pointer-only; SR scrolls via the viewport.
		expect(container.querySelector('[data-scroll-area-scrollbar]')).not.toHaveAttribute('role');
		expect(container.querySelector('[data-scroll-area-thumb]')).not.toHaveAttribute('role');
	});
});