import { useRef } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useMenuNavigation } from '@/hooks/use-menu-navigation';

function Harness({ open, focusFirstOnOpen, onClose }: { open: boolean; focusFirstOnOpen?: boolean; onClose?: () => void }) {
	const menuRef = useRef<HTMLDivElement>(null);
	const { onKeyDown } = useMenuNavigation(menuRef, { open, onClose, focusFirstOnOpen });
	return (
		<>
			<button data-testid='trigger'>Open</button>
			{open && (
				<div ref={menuRef} role='menu' onKeyDown={onKeyDown}>
					<button role='menuitem'>Apple</button>
					<button role='menuitem' aria-disabled='true'>
						Banana
					</button>
					<button role='menuitem'>Cherry</button>
					<button role='menuitem'>Cranberry</button>
				</div>
			)}
		</>
	);
}

function getItem(name: string): HTMLElement {
	return screen.getByRole('menuitem', { name });
}

describe('useMenuNavigation', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	it('focuses the first enabled item and applies roving tabindex on open', () => {
		render(<Harness open />);
		const apple = getItem('Apple');
		expect(document.activeElement).toBe(apple);
		expect(apple.tabIndex).toBe(0);
		expect(getItem('Cherry').tabIndex).toBe(-1);
		expect(getItem('Cranberry').tabIndex).toBe(-1);
	});

	it('applies roving but does not move focus when focusFirstOnOpen is false', () => {
		render(<Harness open={false} focusFirstOnOpen={false} />);
		const trigger = screen.getByTestId('trigger');
		trigger.focus();
		expect(document.activeElement).toBe(trigger);

		render(<Harness open focusFirstOnOpen={false} />);
		expect(getItem('Apple').tabIndex).toBe(0);
		expect(document.activeElement).toBe(trigger);
	});

	it('ArrowDown moves to the next enabled item, skips disabled, and wraps', () => {
		render(<Harness open />);
		const menu = screen.getByRole('menu');
		expect(document.activeElement).toBe(getItem('Apple'));

		fireEvent.keyDown(menu, { key: 'ArrowDown' });
		expect(document.activeElement).toBe(getItem('Cherry'));

		fireEvent.keyDown(menu, { key: 'ArrowDown' });
		expect(document.activeElement).toBe(getItem('Cranberry'));

		fireEvent.keyDown(menu, { key: 'ArrowDown' });
		expect(document.activeElement).toBe(getItem('Apple'));
	});

	it('ArrowUp from the first enabled item wraps to the last enabled item', () => {
		render(<Harness open />);
		const menu = screen.getByRole('menu');
		expect(document.activeElement).toBe(getItem('Apple'));

		fireEvent.keyDown(menu, { key: 'ArrowUp' });
		expect(document.activeElement).toBe(getItem('Cranberry'));
	});

	it('Home focuses the first enabled item and End focuses the last enabled item', () => {
		render(<Harness open />);
		const menu = screen.getByRole('menu');

		fireEvent.keyDown(menu, { key: 'End' });
		expect(document.activeElement).toBe(getItem('Cranberry'));

		fireEvent.keyDown(menu, { key: 'Home' });
		expect(document.activeElement).toBe(getItem('Apple'));
	});

	it('calls preventDefault for Arrow/Home/End keys', () => {
		render(<Harness open />);
		const menu = screen.getByRole('menu');
		expect(fireEvent.keyDown(menu, { key: 'ArrowDown' })).toBe(false);
		expect(fireEvent.keyDown(menu, { key: 'ArrowUp' })).toBe(false);
		expect(fireEvent.keyDown(menu, { key: 'Home' })).toBe(false);
		expect(fireEvent.keyDown(menu, { key: 'End' })).toBe(false);
	});

	it('keeps exactly one enabled item tabbable after navigating', () => {
		render(<Harness open />);
		const menu = screen.getByRole('menu');
		fireEvent.keyDown(menu, { key: 'ArrowDown' });

		const tabbable = [getItem('Apple'), getItem('Cherry'), getItem('Cranberry')].filter((el) => el.tabIndex === 0);
		expect(tabbable).toHaveLength(1);
		expect(tabbable[0]).toBe(getItem('Cherry'));
	});

	it('typeahead with a single char focuses the next enabled item starting with it', () => {
		render(<Harness open />);
		const menu = screen.getByRole('menu');
		expect(document.activeElement).toBe(getItem('Apple'));

		fireEvent.keyDown(menu, { key: 'c' });
		expect(document.activeElement).toBe(getItem('Cherry'));
	});

	it('typeahead accumulates a multi-char buffer within the reset window', () => {
		render(<Harness open />);
		const menu = screen.getByRole('menu');
		expect(document.activeElement).toBe(getItem('Apple'));

		fireEvent.keyDown(menu, { key: 'c' });
		fireEvent.keyDown(menu, { key: 'r' });
		expect(document.activeElement).toBe(getItem('Cranberry'));
	});

	it('calls onClose on Tab', () => {
		const onClose = vi.fn();
		render(<Harness open onClose={onClose} />);
		const menu = screen.getByRole('menu');

		fireEvent.keyDown(menu, { key: 'Tab' });
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('restores focus to the trigger on close', () => {
		const { rerender } = render(<Harness open={false} />);
		const trigger = screen.getByTestId('trigger');
		trigger.focus();
		expect(document.activeElement).toBe(trigger);

		rerender(<Harness open />);
		expect(document.activeElement).toBe(getItem('Apple'));

		rerender(<Harness open={false} />);
		expect(document.activeElement).toBe(trigger);
	});
});
