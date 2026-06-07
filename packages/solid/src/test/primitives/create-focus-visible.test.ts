import { createFocusVisible } from '@/primitives/create-focus-visible';

function makeEvent(currentTarget: Element, matches: boolean): FocusEvent {
	(currentTarget as Element & { matches: () => boolean }).matches = () => matches;
	return { currentTarget } as unknown as FocusEvent;
}

describe('createFocusVisible', () => {
	it('starts with isFocusVisible false', () => {
		const { isFocusVisible } = createFocusVisible();
		expect(isFocusVisible()).toBe(false);
	});

	it('sets isFocusVisible to true when matches(:focus-visible)', () => {
		const { isFocusVisible, focusProps } = createFocusVisible();
		const el = document.createElement('button');
		focusProps.onFocus(makeEvent(el, true) as never);
		expect(isFocusVisible()).toBe(true);
	});

	it('sets isFocusVisible to false when matches() returns false', () => {
		const { isFocusVisible, focusProps } = createFocusVisible();
		const el = document.createElement('button');
		focusProps.onFocus(makeEvent(el, false) as never);
		expect(isFocusVisible()).toBe(false);
	});

	it('handles matches() throwing without crashing', () => {
		const { isFocusVisible, focusProps } = createFocusVisible();
		const el = document.createElement('button');
		(el as unknown as HTMLElement & { matches: () => boolean }).matches = () => {
			throw new Error('boom');
		};
		focusProps.onFocus({ currentTarget: el } as unknown as FocusEvent as never);
		expect(isFocusVisible()).toBe(false);
	});

	it('resets to false on blur', () => {
		const { isFocusVisible, focusProps } = createFocusVisible();
		const el = document.createElement('button');
		focusProps.onFocus(makeEvent(el, true) as never);
		expect(isFocusVisible()).toBe(true);
		focusProps.onBlur();
		expect(isFocusVisible()).toBe(false);
	});
});
