import { fireEvent, render, screen } from '@solidjs/testing-library';
import { createSignal, Show } from 'solid-js';
import { createMenuNavigation } from '@/primitives/create-menu-navigation';

function Harness(props: { focusFirstOnOpen?: boolean; onClose?: () => void }) {
	const [open, setOpen] = createSignal(false);
	let menuEl: HTMLDivElement | undefined;
	const { onKeyDown } = createMenuNavigation(() => menuEl, {
		get open() {
			return open();
		},
		get onClose() {
			return props.onClose;
		},
		get focusFirstOnOpen() {
			return props.focusFirstOnOpen;
		},
	});
	return (
		<>
			<button
				data-testid='trigger'
				onClick={() => setOpen((v) => !v)}
			>
				Open
			</button>
			<Show when={open()}>
				<div
					ref={(el) => (menuEl = el)}
					role='menu'
					onKeyDown={onKeyDown}
				>
					<button
						role='menuitem'
						data-testid='apple'
					>
						Apple
					</button>
					<button
						role='menuitem'
						aria-disabled='true'
						data-testid='banana'
					>
						Banana
					</button>
					<button
						role='menuitem'
						data-testid='cherry'
					>
						Cherry
					</button>
					<button
						role='menuitem'
						data-testid='cranberry'
					>
						Cranberry
					</button>
				</div>
			</Show>
		</>
	);
}

function setup(props: { focusFirstOnOpen?: boolean; onClose?: () => void } = {}) {
	render(() => <Harness {...props} />);
	const trigger = screen.getByTestId('trigger');
	return { trigger };
}

function getMenu() {
	return screen.getByRole('menu');
}

function items() {
	return {
		apple: screen.getByTestId('apple'),
		banana: screen.getByTestId('banana'),
		cherry: screen.getByTestId('cherry'),
		cranberry: screen.getByTestId('cranberry'),
	};
}

describe('createMenuNavigation', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	it('focuses the first enabled item on open and applies roving tabindex', async () => {
		const { trigger } = setup();
		fireEvent.click(trigger);
		await Promise.resolve();
		const { apple, cherry, cranberry } = items();
		expect(document.activeElement).toBe(apple);
		expect(apple.tabIndex).toBe(0);
		expect(cherry.tabIndex).toBe(-1);
		expect(cranberry.tabIndex).toBe(-1);
	});

	it('applies roving but does not move focus when focusFirstOnOpen is false', async () => {
		const { trigger } = setup({ focusFirstOnOpen: false });
		trigger.focus();
		expect(document.activeElement).toBe(trigger);
		fireEvent.click(trigger);
		await Promise.resolve();
		const { apple } = items();
		expect(apple.tabIndex).toBe(0);
		expect(document.activeElement).toBe(trigger);
	});

	it('ArrowDown moves to the next enabled item, skipping disabled, and wraps', async () => {
		const { trigger } = setup();
		fireEvent.click(trigger);
		await Promise.resolve();
		const menu = getMenu();
		const { apple, cherry, cranberry } = items();
		expect(document.activeElement).toBe(apple);
		fireEvent.keyDown(menu, { key: 'ArrowDown' });
		expect(document.activeElement).toBe(cherry);
		fireEvent.keyDown(menu, { key: 'ArrowDown' });
		expect(document.activeElement).toBe(cranberry);
		fireEvent.keyDown(menu, { key: 'ArrowDown' });
		expect(document.activeElement).toBe(apple);
	});

	it('ArrowUp from the first enabled item wraps to the last enabled item', async () => {
		const { trigger } = setup();
		fireEvent.click(trigger);
		await Promise.resolve();
		const menu = getMenu();
		const { apple, cranberry } = items();
		expect(document.activeElement).toBe(apple);
		fireEvent.keyDown(menu, { key: 'ArrowUp' });
		expect(document.activeElement).toBe(cranberry);
	});

	it('Home focuses the first enabled item and End focuses the last enabled item', async () => {
		const { trigger } = setup();
		fireEvent.click(trigger);
		await Promise.resolve();
		const menu = getMenu();
		const { apple, cranberry } = items();
		fireEvent.keyDown(menu, { key: 'End' });
		expect(document.activeElement).toBe(cranberry);
		fireEvent.keyDown(menu, { key: 'Home' });
		expect(document.activeElement).toBe(apple);
	});

	it('Arrow/Home/End call preventDefault', async () => {
		const { trigger } = setup();
		fireEvent.click(trigger);
		await Promise.resolve();
		const menu = getMenu();
		expect(fireEvent.keyDown(menu, { key: 'ArrowDown' })).toBe(false);
		expect(fireEvent.keyDown(menu, { key: 'ArrowUp' })).toBe(false);
		expect(fireEvent.keyDown(menu, { key: 'Home' })).toBe(false);
		expect(fireEvent.keyDown(menu, { key: 'End' })).toBe(false);
	});

	it('keeps exactly one enabled item with tabIndex 0 after navigating', async () => {
		const { trigger } = setup();
		fireEvent.click(trigger);
		await Promise.resolve();
		const menu = getMenu();
		fireEvent.keyDown(menu, { key: 'ArrowDown' });
		fireEvent.keyDown(menu, { key: 'ArrowDown' });
		const { apple, cherry, cranberry } = items();
		const tabbable = [apple, cherry, cranberry].filter((el) => el.tabIndex === 0);
		expect(tabbable).toHaveLength(1);
		expect(tabbable[0]).toBe(cranberry);
	});

	it('typeahead with a single char focuses the matching item', async () => {
		const { trigger } = setup();
		fireEvent.click(trigger);
		await Promise.resolve();
		const menu = getMenu();
		const { apple, cherry } = items();
		expect(document.activeElement).toBe(apple);
		fireEvent.keyDown(menu, { key: 'c' });
		expect(document.activeElement).toBe(cherry);
	});

	it('typeahead accumulates a multi-char buffer within the reset window', async () => {
		const { trigger } = setup();
		fireEvent.click(trigger);
		await Promise.resolve();
		const menu = getMenu();
		const { apple, cranberry } = items();
		expect(document.activeElement).toBe(apple);
		fireEvent.keyDown(menu, { key: 'c' });
		fireEvent.keyDown(menu, { key: 'r' });
		expect(document.activeElement).toBe(cranberry);
	});

	it('Tab calls onClose', async () => {
		const onClose = vi.fn();
		const { trigger } = setup({ onClose });
		fireEvent.click(trigger);
		await Promise.resolve();
		const menu = getMenu();
		fireEvent.keyDown(menu, { key: 'Tab' });
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('restores focus to the trigger when the menu closes', async () => {
		const { trigger } = setup();
		trigger.focus();
		expect(document.activeElement).toBe(trigger);
		fireEvent.click(trigger);
		await Promise.resolve();
		expect(document.activeElement).toBe(items().apple);
		fireEvent.click(trigger);
		await Promise.resolve();
		expect(document.activeElement).toBe(trigger);
	});
});
