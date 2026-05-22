import { ref } from 'vue';
import { useInteractiveState } from '@/composables/use-interactive-state';

function makeEvent(currentTarget: Element, matches: boolean): FocusEvent {
	(currentTarget as Element & { matches: () => boolean }).matches = () => matches;
	return { currentTarget } as unknown as FocusEvent;
}

describe('useInteractiveState', () => {
	it('starts with all flags false', () => {
		const { isHovered, isFocusVisible, isActive } = useInteractiveState();
		expect(isHovered.value).toBe(false);
		expect(isFocusVisible.value).toBe(false);
		expect(isActive.value).toBe(false);
	});

	it('toggles isHovered on mouseenter/mouseleave', () => {
		const state = useInteractiveState();
		state.handlers.onMouseenter();
		expect(state.isHovered.value).toBe(true);
		state.handlers.onMouseleave();
		expect(state.isHovered.value).toBe(false);
	});

	it('mouseleave also clears active', () => {
		const state = useInteractiveState();
		state.handlers.onPointerdown();
		expect(state.isActive.value).toBe(true);
		state.handlers.onMouseleave();
		expect(state.isActive.value).toBe(false);
	});

	it('focus sets isFocusVisible only when :focus-visible matches', () => {
		const state = useInteractiveState();
		const el = document.createElement('button');
		state.handlers.onFocus(makeEvent(el, true));
		expect(state.isFocusVisible.value).toBe(true);
		state.handlers.onBlur();
		expect(state.isFocusVisible.value).toBe(false);
	});

	it('focus does not set isFocusVisible when matches() returns false', () => {
		const state = useInteractiveState();
		const el = document.createElement('button');
		state.handlers.onFocus(makeEvent(el, false));
		expect(state.isFocusVisible.value).toBe(false);
	});

	it('isActive toggles on pointerdown/pointerup', () => {
		const state = useInteractiveState();
		state.handlers.onPointerdown();
		expect(state.isActive.value).toBe(true);
		state.handlers.onPointerup();
		expect(state.isActive.value).toBe(false);
	});

	it('isActive toggles on Space and Enter keys', () => {
		const state = useInteractiveState();
		state.handlers.onKeydown({ key: ' ' } as KeyboardEvent);
		expect(state.isActive.value).toBe(true);
		state.handlers.onKeyup({ key: ' ' } as KeyboardEvent);
		expect(state.isActive.value).toBe(false);
		state.handlers.onKeydown({ key: 'Enter' } as KeyboardEvent);
		expect(state.isActive.value).toBe(true);
		state.handlers.onKeyup({ key: 'Enter' } as KeyboardEvent);
		expect(state.isActive.value).toBe(false);
	});

	it('does not toggle isActive for other keys', () => {
		const state = useInteractiveState();
		state.handlers.onKeydown({ key: 'a' } as KeyboardEvent);
		expect(state.isActive.value).toBe(false);
	});

	it('disabled prevents hover and active state changes', () => {
		const disabled = ref(true);
		const state = useInteractiveState({ disabled });
		state.handlers.onMouseenter();
		state.handlers.onPointerdown();
		state.handlers.onKeydown({ key: ' ' } as KeyboardEvent);
		expect(state.isHovered.value).toBe(false);
		expect(state.isActive.value).toBe(false);
	});

	it('dataAttributes mirror the current state', () => {
		const state = useInteractiveState();
		state.handlers.onMouseenter();
		state.handlers.onPointerdown();
		expect(state.dataAttributes.value).toMatchObject({
			'data-hover': '',
			'data-active': '',
		});
		expect(state.dataAttributes.value['data-focus-visible']).toBeUndefined();
	});

	it('dataAttributes include data-disabled when disabled', () => {
		const state = useInteractiveState({ disabled: true });
		expect(state.dataAttributes.value['data-disabled']).toBe('');
	});
});
