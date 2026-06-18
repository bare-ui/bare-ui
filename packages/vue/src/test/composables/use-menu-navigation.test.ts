import { fireEvent, render } from '@testing-library/vue';
import { defineComponent, h, nextTick, ref } from 'vue';
import { useMenuNavigation } from '@/composables/use-menu-navigation';

/**
 * `useMenuNavigation` runs inside component setup (it relies on `onMounted` and a
 * `flush:'post'` watch on `open`). This harness drives `open` via a module-scoped
 * ref and renders a trigger button plus a `v-if`-style `role="menu"` container.
 * Toggling `open` then awaiting `nextTick()` lets the post-flush watch run before
 * we assert. Because the watch is `flush:'post'`, a single `nextTick()` after the
 * DOM is patched is enough for activate/deactivate to have fired.
 */
function mountMenu(options: { focusFirstOnOpen?: boolean; onClose?: () => void } = {}) {
	const open = ref(false);
	const Harness = defineComponent({
		setup() {
			const menuRef = ref<HTMLElement | null>(null);
			const { onKeyDown } = useMenuNavigation(menuRef, {
				open: () => open.value,
				onClose: options.onClose,
				focusFirstOnOpen: options.focusFirstOnOpen,
			});
			return () =>
				h('div', [
					h('button', { 'data-testid': 'trigger' }, 'Open'),
					open.value
						? h('div', { ref: menuRef, role: 'menu', onKeydown: onKeyDown }, [
								h('button', { role: 'menuitem', 'data-testid': 'apple' }, 'Apple'),
								h(
									'button',
									{ role: 'menuitem', 'aria-disabled': 'true', 'data-testid': 'banana' },
									'Banana',
								),
								h('button', { role: 'menuitem', 'data-testid': 'cherry' }, 'Cherry'),
								h('button', { role: 'menuitem', 'data-testid': 'cranberry' }, 'Cranberry'),
							])
						: null,
				]);
		},
	});
	const utils = render(Harness);
	return { open, ...utils };
}

describe('useMenuNavigation', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	it('focuses the first enabled item and applies roving on open', async () => {
		const { open, getByTestId } = mountMenu();
		open.value = true;
		await nextTick();

		expect(document.activeElement).toBe(getByTestId('apple'));
		expect(getByTestId('apple').tabIndex).toBe(0);
		expect(getByTestId('cherry').tabIndex).toBe(-1);
		expect(getByTestId('cranberry').tabIndex).toBe(-1);
	});

	it('applies roving but does not move focus when focusFirstOnOpen is false', async () => {
		const { open, getByTestId } = mountMenu({ focusFirstOnOpen: false });
		const trigger = getByTestId('trigger');
		trigger.focus();
		open.value = true;
		await nextTick();

		expect(getByTestId('apple').tabIndex).toBe(0);
		expect(document.activeElement).toBe(trigger);
	});

	it('ArrowDown moves to the next enabled item, skips disabled, and wraps', async () => {
		const { open, getByTestId } = mountMenu();
		open.value = true;
		await nextTick();
		const menu = getByTestId('apple').closest('[role="menu"]')!;

		expect(document.activeElement).toBe(getByTestId('apple'));
		fireEvent.keyDown(menu, { key: 'ArrowDown' });
		expect(document.activeElement).toBe(getByTestId('cherry'));
		fireEvent.keyDown(menu, { key: 'ArrowDown' });
		expect(document.activeElement).toBe(getByTestId('cranberry'));
		fireEvent.keyDown(menu, { key: 'ArrowDown' });
		expect(document.activeElement).toBe(getByTestId('apple'));
	});

	it('ArrowUp from the first enabled item wraps to the last enabled item', async () => {
		const { open, getByTestId } = mountMenu();
		open.value = true;
		await nextTick();
		const menu = getByTestId('apple').closest('[role="menu"]')!;

		expect(document.activeElement).toBe(getByTestId('apple'));
		fireEvent.keyDown(menu, { key: 'ArrowUp' });
		expect(document.activeElement).toBe(getByTestId('cranberry'));
	});

	it('Home focuses the first enabled and End focuses the last enabled item', async () => {
		const { open, getByTestId } = mountMenu();
		open.value = true;
		await nextTick();
		const menu = getByTestId('apple').closest('[role="menu"]')!;

		fireEvent.keyDown(menu, { key: 'End' });
		expect(document.activeElement).toBe(getByTestId('cranberry'));
		fireEvent.keyDown(menu, { key: 'Home' });
		expect(document.activeElement).toBe(getByTestId('apple'));
	});

	it('Arrow/Home/End call preventDefault', async () => {
		const { open, getByTestId } = mountMenu();
		open.value = true;
		await nextTick();
		const menu = getByTestId('apple').closest('[role="menu"]')!;

		// jsdom: dispatchEvent returns false when a cancelable event was prevented.
		// (fireEvent from @testing-library/vue returns a Promise, so dispatch directly.)
		const dispatch = (key: string) =>
			menu.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
		expect(dispatch('ArrowDown')).toBe(false);
		expect(dispatch('ArrowUp')).toBe(false);
		expect(dispatch('Home')).toBe(false);
		expect(dispatch('End')).toBe(false);
	});

	it('keeps exactly one enabled item with tabIndex 0 after navigating', async () => {
		const { open, getByTestId } = mountMenu();
		open.value = true;
		await nextTick();
		const menu = getByTestId('apple').closest('[role="menu"]')!;

		fireEvent.keyDown(menu, { key: 'ArrowDown' });
		fireEvent.keyDown(menu, { key: 'ArrowDown' });

		const enabled = [getByTestId('apple'), getByTestId('cherry'), getByTestId('cranberry')];
		const zeroTab = enabled.filter((el) => el.tabIndex === 0);
		expect(zeroTab).toHaveLength(1);
		expect(zeroTab[0]).toBe(getByTestId('cranberry'));
	});

	it('typeahead with a single char focuses the matching item', async () => {
		const { open, getByTestId } = mountMenu();
		open.value = true;
		await nextTick();
		const menu = getByTestId('apple').closest('[role="menu"]')!;

		expect(document.activeElement).toBe(getByTestId('apple'));
		fireEvent.keyDown(menu, { key: 'c' });
		expect(document.activeElement).toBe(getByTestId('cherry'));
	});

	it('typeahead accumulates a multi-char buffer within the reset window', async () => {
		const { open, getByTestId } = mountMenu();
		open.value = true;
		await nextTick();
		const menu = getByTestId('apple').closest('[role="menu"]')!;

		expect(document.activeElement).toBe(getByTestId('apple'));
		// "c" then "r" in the same tick accumulates to "cr" -> Cranberry.
		fireEvent.keyDown(menu, { key: 'c' });
		fireEvent.keyDown(menu, { key: 'r' });
		expect(document.activeElement).toBe(getByTestId('cranberry'));
	});

	it('Tab calls onClose', async () => {
		const onClose = vi.fn();
		const { open, getByTestId } = mountMenu({ onClose });
		open.value = true;
		await nextTick();
		const menu = getByTestId('apple').closest('[role="menu"]')!;

		fireEvent.keyDown(menu, { key: 'Tab' });
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('restores focus to the previously-focused element on close', async () => {
		const { open, getByTestId } = mountMenu();
		const trigger = getByTestId('trigger');
		trigger.focus();
		open.value = true;
		await nextTick();
		expect(document.activeElement).toBe(getByTestId('apple'));

		open.value = false;
		await nextTick();
		expect(document.activeElement).toBe(trigger);
	});
});
