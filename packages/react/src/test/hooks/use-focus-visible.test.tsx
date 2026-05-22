import { renderHook, render, act } from '@testing-library/react';
import { useFocusVisible } from '@/hooks/use-focus-visible';

describe('useFocusVisible', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	it('is false initially', () => {
		const { result } = renderHook(() => useFocusVisible());
		expect(result.current.isFocusVisible).toBe(false);
	});

	it('exposes onFocus and onBlur handlers', () => {
		const { result } = renderHook(() => useFocusVisible());
		expect(typeof result.current.focusProps.onFocus).toBe('function');
		expect(typeof result.current.focusProps.onBlur).toBe('function');
	});

	it('becomes true when focus matches :focus-visible (e.g. keyboard navigation)', () => {
		const Button = () => {
			const { isFocusVisible, focusProps } = useFocusVisible();
			return (
				<button
					data-testid='btn'
					data-focus-visible={isFocusVisible ? '' : undefined}
					{...focusProps}
				/>
			);
		};
		const { getByTestId, rerender } = render(<Button />);
		const btn = getByTestId('btn');
		// Force :focus-visible to match for this element.
		const originalMatches = btn.matches.bind(btn);
		btn.matches = (selector: string) => (selector === ':focus-visible' ? true : originalMatches(selector));

		act(() => {
			btn.focus();
		});
		rerender(<Button />);
		expect(btn.getAttribute('data-focus-visible')).toBe('');
	});

	it('stays false when focus does not match :focus-visible (e.g. pointer click)', () => {
		const Button = () => {
			const { isFocusVisible, focusProps } = useFocusVisible();
			return (
				<button
					data-testid='btn'
					data-focus-visible={isFocusVisible ? '' : undefined}
					{...focusProps}
				/>
			);
		};
		const { getByTestId } = render(<Button />);
		const btn = getByTestId('btn');
		const originalMatches = btn.matches.bind(btn);
		btn.matches = (selector: string) => (selector === ':focus-visible' ? false : originalMatches(selector));

		act(() => {
			btn.focus();
		});
		expect(btn.getAttribute('data-focus-visible')).toBeNull();
	});

	it('resets to false on blur after being true', () => {
		const Button = () => {
			const { isFocusVisible, focusProps } = useFocusVisible();
			return (
				<button
					data-testid='btn'
					data-focus-visible={isFocusVisible ? '' : undefined}
					{...focusProps}
				/>
			);
		};
		const { getByTestId } = render(<Button />);
		const btn = getByTestId('btn');
		const originalMatches = btn.matches.bind(btn);
		btn.matches = (selector: string) => (selector === ':focus-visible' ? true : originalMatches(selector));

		act(() => {
			btn.focus();
		});
		expect(btn.getAttribute('data-focus-visible')).toBe('');

		act(() => {
			btn.blur();
		});
		expect(btn.getAttribute('data-focus-visible')).toBeNull();
	});

	it('falls back to false when matches() throws (e.g. unsupported selector)', () => {
		const Button = () => {
			const { isFocusVisible, focusProps } = useFocusVisible();
			return (
				<button
					data-testid='btn'
					data-focus-visible={isFocusVisible ? '' : undefined}
					{...focusProps}
				/>
			);
		};
		const { getByTestId } = render(<Button />);
		const btn = getByTestId('btn');
		btn.matches = () => {
			throw new Error('unsupported');
		};
		act(() => {
			btn.focus();
		});
		expect(btn.getAttribute('data-focus-visible')).toBeNull();
	});

	it('returns stable handler identities across renders', () => {
		const { result, rerender } = renderHook(() => useFocusVisible());
		const firstOnFocus = result.current.focusProps.onFocus;
		const firstOnBlur = result.current.focusProps.onBlur;
		rerender();
		expect(result.current.focusProps.onFocus).toBe(firstOnFocus);
		expect(result.current.focusProps.onBlur).toBe(firstOnBlur);
	});
});
