import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import type { OTPContextValue, OTPRootProps, OTPSeparatorProps, OTPSlotProps } from './OTP.types';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const OTPContext = createContext<OTPContextValue | null>(null);

function useOTPContext() {
	const context = useContext(OTPContext);
	if (!context) {
		throw new globalThis.Error('OTP.Slot and OTP.Separator must be used within OTP.Root');
	}
	return context;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toChars(value: string, length: number): string[] {
	return value.split('').slice(0, length).concat(Array<string>(length).fill('')).slice(0, length);
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

const Root = React.forwardRef<HTMLDivElement, OTPRootProps>(
	(
		{
			length = 6,
			value: controlledValue,
			defaultValue = '',
			onChange,
			onComplete,
			pattern = 'numeric',
			disabled = false,
			className,
			children,
			...rest
		},
		ref,
	) => {
		const [uncontrolledChars, setUncontrolledChars] = useState<string[]>(() => toChars(defaultValue, length));
		const inputRefs = useRef<(HTMLInputElement | null)[]>(Array<null>(length).fill(null));

		const isControlled = controlledValue !== undefined;
		const chars = isControlled ? toChars(controlledValue, length) : uncontrolledChars;
		const isComplete = chars.every((c) => c !== '');

		const isAllowed = useCallback(
			(char: string) => {
				if (pattern === 'numeric') return /^[0-9]$/.test(char);
				return /^[0-9a-zA-Z]$/.test(char);
			},
			[pattern],
		);

		const commit = useCallback(
			(newChars: string[]) => {
				if (!isControlled) setUncontrolledChars(newChars);
				const value = newChars.join('');
				onChange?.(value);
				if (newChars.every((c) => c !== '')) onComplete?.(value);
			},
			[isControlled, onChange, onComplete],
		);

		const registerRef = useCallback((index: number, el: HTMLInputElement | null) => {
			inputRefs.current[index] = el;
		}, []);

		const handleChange = useCallback(
			(index: number, raw: string) => {
				// raw may be "" (delete) or 1–2 chars (type over existing)
				const char = raw.slice(-1);
				if (char && !isAllowed(char)) return;

				const next = [...chars];
				next[index] = char;
				commit(next);

				if (char && index < length - 1) {
					inputRefs.current[index + 1]?.focus();
				}
			},
			[chars, isAllowed, commit, length],
		);

		const handleKeyDown = useCallback(
			(index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
				if (e.key === 'Backspace') {
					e.preventDefault();
					if (chars[index]) {
						const next = [...chars];
						next[index] = '';
						commit(next);
					} else if (index > 0) {
						const next = [...chars];
						next[index - 1] = '';
						commit(next);
						inputRefs.current[index - 1]?.focus();
					}
				} else if (e.key === 'ArrowLeft') {
					e.preventDefault();
					if (index > 0) inputRefs.current[index - 1]?.focus();
				} else if (e.key === 'ArrowRight') {
					e.preventDefault();
					if (index < length - 1) inputRefs.current[index + 1]?.focus();
				}
			},
			[chars, commit, length],
		);

		const handlePaste = useCallback(
			(index: number, e: React.ClipboardEvent<HTMLInputElement>) => {
				e.preventDefault();
				const pasted = e.clipboardData
					.getData('text')
					.split('')
					.filter((c) => isAllowed(c))
					.slice(0, length - index);

				if (pasted.length === 0) return;

				const next = [...chars];
				pasted.forEach((c, i) => {
					if (index + i < length) next[index + i] = c;
				});
				commit(next);

				const nextFocus = Math.min(index + pasted.length, length - 1);
				inputRefs.current[nextFocus]?.focus();
			},
			[chars, isAllowed, commit, length],
		);

		return (
			<OTPContext.Provider
				value={{
					chars,
					length,
					disabled,
					isComplete,
					registerRef,
					handleChange,
					handleKeyDown,
					handlePaste,
				}}>
				<div
					ref={ref}
					className={className}
					data-complete={isComplete ? '' : undefined}
					data-disabled={disabled ? '' : undefined}
					{...rest}>
					{children}
				</div>
			</OTPContext.Provider>
		);
	},
);

Root.displayName = 'OTP.Root';

// ---------------------------------------------------------------------------
// Slot
// ---------------------------------------------------------------------------

const Slot = React.forwardRef<HTMLInputElement, OTPSlotProps>(({ index, className, ...rest }, externalRef) => {
	const { chars, disabled, isComplete, registerRef, handleChange, handleKeyDown, handlePaste } = useOTPContext();
	const char = chars[index] ?? '';
	const [isFocused, setIsFocused] = useState(false);

	return (
		<input
			ref={(el) => {
				registerRef(index, el);
				if (typeof externalRef === 'function') externalRef(el);
				else if (externalRef) externalRef.current = el;
			}}
			type='text'
			inputMode='numeric'
			autoComplete='one-time-code'
			maxLength={2}
			value={char}
			disabled={disabled}
			className={className}
			data-active={isFocused ? '' : undefined}
			data-filled={char ? '' : undefined}
			data-complete={isComplete ? '' : undefined}
			data-disabled={disabled ? '' : undefined}
			aria-label={`Digit ${index + 1}`}
			onChange={(e) => handleChange(index, e.target.value)}
			onKeyDown={(e) => handleKeyDown(index, e)}
			onFocus={(e) => {
				setIsFocused(true);
				e.target.select();
			}}
			onBlur={() => setIsFocused(false)}
			onPaste={(e) => handlePaste(index, e)}
			{...rest}
		/>
	);
});

Slot.displayName = 'OTP.Slot';

// ---------------------------------------------------------------------------
// Separator
// ---------------------------------------------------------------------------

const Separator = React.forwardRef<HTMLSpanElement, OTPSeparatorProps>(
	({ children = '–', className, ...rest }, ref) => (
		<span
			ref={ref}
			className={className}
			aria-hidden='true'
			role='separator'
			{...rest}>
			{children}
		</span>
	),
);

Separator.displayName = 'OTP.Separator';

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const OTP = {
	Root,
	Slot,
	Separator,
};

// Named exports expose the sub-components to Storybook's react-docgen (public API stays `OTP.*`).
export { Root, Slot, Separator };
