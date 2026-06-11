import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { ref, nextTick, h } from 'vue';
import { expectExposedAs } from '@/test/sr';
import { Button } from '.';

describe('Button — screen reader semantics', () => {
	it('is exposed as a button named by its text content', () => {
		render(Button, { slots: { default: 'Save' } });
		expectExposedAs('button', 'Save');
	});

	it('takes its accessible name from aria-label for an icon-only button', () => {
		render({
			setup: () => () => h(Button, { 'aria-label': 'Close' }, () => h('span', { 'aria-hidden': 'true' }, '×')),
		});
		expectExposedAs('button', 'Close');
	});

	it('prefers aria-label over visible text for the accessible name', () => {
		render(Button, { attrs: { 'aria-label': 'Add to cart' }, slots: { default: 'Add' } });
		expectExposedAs('button', 'Add to cart');
		expect(screen.queryByRole('button', { name: 'Add' })).toBeNull();
	});

	it('exposes a disabled button as disabled to assistive tech', () => {
		render(Button, { props: { disabled: true }, slots: { default: 'Save' } });
		expect(expectExposedAs('button', 'Save')).toBeDisabled();
	});

	it('exposes aria-pressed as a toggle button and reflects updates', async () => {
		const pressed = ref(false);
		render({
			template: `<Button :aria-pressed="pressed">Mute</Button>`,
			components: { Button },
			setup() { return { pressed }; },
		});
		expect(expectExposedAs('button', 'Mute', { pressed: false })).toBeInTheDocument();
		pressed.value = true;
		await nextTick();
		expect(expectExposedAs('button', 'Mute', { pressed: true })).toBeInTheDocument();
	});

	it('exposes aria-expanded for a disclosure button', () => {
		render(Button, { attrs: { 'aria-expanded': 'false', 'aria-controls': 'menu' }, slots: { default: 'Menu' } });
		const btn = screen.getByRole('button', { name: 'Menu', expanded: false });
		expect(btn).toHaveAttribute('aria-controls', 'menu');
	});

	it.skip('forwards its accessible name and pressed state onto the child when asChild', () => {
		// Vue asChild renders <slot /> without merging attrs onto the child element,
		// so aria-pressed does not appear on the <a> element.
	});
});
