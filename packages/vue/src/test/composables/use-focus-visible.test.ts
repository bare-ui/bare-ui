import { useFocusVisible } from '@/composables/use-focus-visible';

describe('useFocusVisible', () => {
	it('starts with isFocusVisible false', () => {
		const { isFocusVisible } = useFocusVisible();
		expect(isFocusVisible.value).toBe(false);
	});

	it('sets isFocusVisible to true when the focused element matches :focus-visible', () => {
		const { isFocusVisible, focusHandlers } = useFocusVisible();
		const el = document.createElement('button');
		const matches = vi.fn().mockReturnValue(true);
		el.matches = matches;
		const event = { currentTarget: el } as unknown as FocusEvent;
		focusHandlers.onFocus(event);
		expect(matches).toHaveBeenCalledWith(':focus-visible');
		expect(isFocusVisible.value).toBe(true);
	});

	it('sets isFocusVisible to false when matches returns false', () => {
		const { isFocusVisible, focusHandlers } = useFocusVisible();
		const el = document.createElement('button');
		el.matches = () => false;
		focusHandlers.onFocus({ currentTarget: el } as unknown as FocusEvent);
		expect(isFocusVisible.value).toBe(false);
	});

	it('handles matches() throwing without crashing', () => {
		const { isFocusVisible, focusHandlers } = useFocusVisible();
		const el = document.createElement('button');
		el.matches = () => {
			throw new Error('boom');
		};
		focusHandlers.onFocus({ currentTarget: el } as unknown as FocusEvent);
		expect(isFocusVisible.value).toBe(false);
	});

	it('resets to false on blur', () => {
		const { isFocusVisible, focusHandlers } = useFocusVisible();
		const el = document.createElement('button');
		el.matches = () => true;
		focusHandlers.onFocus({ currentTarget: el } as unknown as FocusEvent);
		expect(isFocusVisible.value).toBe(true);
		focusHandlers.onBlur();
		expect(isFocusVisible.value).toBe(false);
	});

	it('handles a null currentTarget gracefully', () => {
		const { isFocusVisible, focusHandlers } = useFocusVisible();
		focusHandlers.onFocus({ currentTarget: null } as unknown as FocusEvent);
		expect(isFocusVisible.value).toBe(false);
	});
});
