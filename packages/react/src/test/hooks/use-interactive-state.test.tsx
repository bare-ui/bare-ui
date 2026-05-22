import { renderHook, render, act, fireEvent } from '@testing-library/react';
import { useInteractiveState } from '@/hooks/use-interactive-state';

describe('useInteractiveState', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	it('returns false flags and no data attributes initially', () => {
		const { result } = renderHook(() => useInteractiveState());
		expect(result.current.isHovered).toBe(false);
		expect(result.current.isFocusVisible).toBe(false);
		expect(result.current.isActive).toBe(false);
		expect(result.current.dataAttributes['data-hover']).toBeUndefined();
		expect(result.current.dataAttributes['data-active']).toBeUndefined();
		expect(result.current.dataAttributes['data-focus-visible']).toBeUndefined();
		expect(result.current.dataAttributes['data-disabled']).toBeUndefined();
	});

	it('sets data-disabled when disabled is true', () => {
		const { result } = renderHook(() => useInteractiveState({ disabled: true }));
		expect(result.current.dataAttributes['data-disabled']).toBe('');
	});

	it('sets data-hover on mouse enter and clears it on leave', () => {
		const { result } = renderHook(() => useInteractiveState());
		act(() => result.current.handlers.onMouseEnter());
		expect(result.current.isHovered).toBe(true);
		expect(result.current.dataAttributes['data-hover']).toBe('');

		act(() => result.current.handlers.onMouseLeave());
		expect(result.current.isHovered).toBe(false);
		expect(result.current.dataAttributes['data-hover']).toBeUndefined();
	});

	it('does not set hover state when disabled', () => {
		const { result } = renderHook(() => useInteractiveState({ disabled: true }));
		act(() => result.current.handlers.onMouseEnter());
		expect(result.current.isHovered).toBe(false);
	});

	it('sets data-active on pointer down and clears it on pointer up', () => {
		const { result } = renderHook(() => useInteractiveState());
		act(() => result.current.handlers.onPointerDown());
		expect(result.current.isActive).toBe(true);
		expect(result.current.dataAttributes['data-active']).toBe('');

		act(() => result.current.handlers.onPointerUp());
		expect(result.current.isActive).toBe(false);
		expect(result.current.dataAttributes['data-active']).toBeUndefined();
	});

	it('does not activate on pointer down when disabled', () => {
		const { result } = renderHook(() => useInteractiveState({ disabled: true }));
		act(() => result.current.handlers.onPointerDown());
		expect(result.current.isActive).toBe(false);
	});

	it('activates on Space/Enter keydown and deactivates on keyup', () => {
		const { result } = renderHook(() => useInteractiveState());
		act(() => result.current.handlers.onKeyDown({ key: 'Enter' } as React.KeyboardEvent));
		expect(result.current.isActive).toBe(true);

		act(() => result.current.handlers.onKeyUp({ key: 'Enter' } as React.KeyboardEvent));
		expect(result.current.isActive).toBe(false);

		act(() => result.current.handlers.onKeyDown({ key: ' ' } as React.KeyboardEvent));
		expect(result.current.isActive).toBe(true);

		act(() => result.current.handlers.onKeyUp({ key: ' ' } as React.KeyboardEvent));
		expect(result.current.isActive).toBe(false);
	});

	it('ignores other keys for active state', () => {
		const { result } = renderHook(() => useInteractiveState());
		act(() => result.current.handlers.onKeyDown({ key: 'a' } as React.KeyboardEvent));
		expect(result.current.isActive).toBe(false);
	});

	it('sets data-focus-visible on focus when :focus-visible matches, and clears it on blur', () => {
		const Box = () => {
			const { handlers, dataAttributes } = useInteractiveState();
			return (
				<button
					data-testid='target'
					{...handlers}
					{...dataAttributes}
				/>
			);
		};
		const { getByTestId } = render(<Box />);
		const el = getByTestId('target');
		const originalMatches = el.matches.bind(el);
		el.matches = (selector: string) => (selector === ':focus-visible' ? true : originalMatches(selector));

		act(() => {
			fireEvent.focus(el);
		});
		expect(el.getAttribute('data-focus-visible')).toBe('');

		act(() => {
			fireEvent.blur(el);
		});
		expect(el.getAttribute('data-focus-visible')).toBeNull();
	});

	it('does not set data-focus-visible on focus when :focus-visible does not match', () => {
		const Box = () => {
			const { handlers, dataAttributes } = useInteractiveState();
			return (
				<button
					data-testid='target'
					{...handlers}
					{...dataAttributes}
				/>
			);
		};
		const { getByTestId } = render(<Box />);
		const el = getByTestId('target');
		const originalMatches = el.matches.bind(el);
		el.matches = (selector: string) => (selector === ':focus-visible' ? false : originalMatches(selector));

		act(() => {
			fireEvent.focus(el);
		});
		expect(el.getAttribute('data-focus-visible')).toBeNull();
	});

	it('clears active state when leaving the element with the pointer down', () => {
		const { result } = renderHook(() => useInteractiveState());
		act(() => result.current.handlers.onMouseEnter());
		act(() => result.current.handlers.onPointerDown());
		expect(result.current.isActive).toBe(true);

		act(() => result.current.handlers.onMouseLeave());
		expect(result.current.isActive).toBe(false);
		expect(result.current.isHovered).toBe(false);
	});
});
