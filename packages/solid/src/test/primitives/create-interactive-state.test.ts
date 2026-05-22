import { createRoot, createSignal } from 'solid-js';
import { createInteractiveState } from '@/primitives/create-interactive-state';

function makeFocusEvent(currentTarget: Element, matches: boolean): FocusEvent {
	(currentTarget as Element & { matches: () => boolean }).matches = () => matches;
	return { currentTarget } as unknown as FocusEvent;
}

describe('createInteractiveState', () => {
	it('starts with all flags false', () => {
		createRoot((dispose) => {
			const { isHovered, isFocusVisible, isActive } = createInteractiveState();
			expect(isHovered()).toBe(false);
			expect(isFocusVisible()).toBe(false);
			expect(isActive()).toBe(false);
			dispose();
		});
	});

	it('toggles isHovered on mouseenter/mouseleave', () => {
		createRoot((dispose) => {
			const state = createInteractiveState();
			state.handlers.onMouseEnter();
			expect(state.isHovered()).toBe(true);
			state.handlers.onMouseLeave();
			expect(state.isHovered()).toBe(false);
			dispose();
		});
	});

	it('mouseleave also clears active', () => {
		createRoot((dispose) => {
			const state = createInteractiveState();
			state.handlers.onPointerDown();
			expect(state.isActive()).toBe(true);
			state.handlers.onMouseLeave();
			expect(state.isActive()).toBe(false);
			dispose();
		});
	});

	it('focus sets isFocusVisible only when :focus-visible matches', () => {
		createRoot((dispose) => {
			const state = createInteractiveState();
			const el = document.createElement('button');
			state.handlers.onFocus(makeFocusEvent(el, true) as never);
			expect(state.isFocusVisible()).toBe(true);
			state.handlers.onBlur();
			expect(state.isFocusVisible()).toBe(false);
			dispose();
		});
	});

	it('focus does not set isFocusVisible when matches() returns false', () => {
		createRoot((dispose) => {
			const state = createInteractiveState();
			const el = document.createElement('button');
			state.handlers.onFocus(makeFocusEvent(el, false) as never);
			expect(state.isFocusVisible()).toBe(false);
			dispose();
		});
	});

	it('isActive toggles on pointerdown/pointerup', () => {
		createRoot((dispose) => {
			const state = createInteractiveState();
			state.handlers.onPointerDown();
			expect(state.isActive()).toBe(true);
			state.handlers.onPointerUp();
			expect(state.isActive()).toBe(false);
			dispose();
		});
	});

	it('isActive toggles on Space and Enter keys', () => {
		createRoot((dispose) => {
			const state = createInteractiveState();
			state.handlers.onKeyDown({ key: ' ' } as never);
			expect(state.isActive()).toBe(true);
			state.handlers.onKeyUp({ key: ' ' } as never);
			expect(state.isActive()).toBe(false);
			state.handlers.onKeyDown({ key: 'Enter' } as never);
			expect(state.isActive()).toBe(true);
			state.handlers.onKeyUp({ key: 'Enter' } as never);
			expect(state.isActive()).toBe(false);
			dispose();
		});
	});

	it('does not toggle isActive for other keys', () => {
		createRoot((dispose) => {
			const state = createInteractiveState();
			state.handlers.onKeyDown({ key: 'a' } as never);
			expect(state.isActive()).toBe(false);
			dispose();
		});
	});

	it('disabled prevents hover and active state changes (reactive via getter)', () => {
		createRoot((dispose) => {
			const [disabled] = createSignal(true);
			const state = createInteractiveState({
				get disabled() {
					return disabled();
				},
			});
			state.handlers.onMouseEnter();
			state.handlers.onPointerDown();
			state.handlers.onKeyDown({ key: ' ' } as never);
			expect(state.isHovered()).toBe(false);
			expect(state.isActive()).toBe(false);
			dispose();
		});
	});

	it('dataAttributes mirror the current state', () => {
		createRoot((dispose) => {
			const state = createInteractiveState();
			state.handlers.onMouseEnter();
			state.handlers.onPointerDown();
			expect(state.dataAttributes['data-hover']).toBe('');
			expect(state.dataAttributes['data-active']).toBe('');
			expect(state.dataAttributes['data-focus-visible']).toBeUndefined();
			dispose();
		});
	});

	it('dataAttributes include data-disabled when disabled', () => {
		createRoot((dispose) => {
			const state = createInteractiveState({ disabled: true });
			expect(state.dataAttributes['data-disabled']).toBe('');
			dispose();
		});
	});
});
