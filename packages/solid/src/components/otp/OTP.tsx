import { createContext, createSignal, splitProps, useContext } from 'solid-js';
import type { OTPContextValue, OTPRootProps, OTPSeparatorProps, OTPSlotProps } from './OTP.types';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const OTPContext = createContext<OTPContextValue | null>(null);

function useOTPContext() {
	const context = useContext(OTPContext);
	if (!context) {
		throw new Error('OTP.Slot and OTP.Separator must be used within OTP.Root');
	}
	return context;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toChars(value: string, length: number): string[] {
	return value
		.split('')
		.slice(0, length)
		.concat(Array<string>(length).fill(''))
		.slice(0, length);
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

function Root(props: OTPRootProps) {
	const [local, rest] = splitProps(props, [
		'length',
		'value',
		'defaultValue',
		'onChange',
		'onComplete',
		'pattern',
		'disabled',
		'class',
		'children',
	]);

	const length = () => local.length ?? 6;
	const pattern = () => local.pattern ?? 'numeric';
	const disabled = () => !!local.disabled;

	const [uncontrolledChars, setUncontrolledChars] = createSignal<string[]>(toChars(local.defaultValue ?? '', length()));
	// Sparse array — sized as Slots register themselves on mount.
	const inputRefs: (HTMLInputElement | null)[] = [];

	const isControlled = () => local.value !== undefined;
	const chars = () => (isControlled() ? toChars(local.value ?? '', length()) : uncontrolledChars());
	const isComplete = () => chars().every((c) => c !== '');

	const isAllowed = (char: string) => {
		if (pattern() === 'numeric') return /^[0-9]$/.test(char);
		return /^[0-9a-zA-Z]$/.test(char);
	};

	const commit = (newChars: string[]) => {
		if (!isControlled()) setUncontrolledChars(newChars);
		const value = newChars.join('');
		local.onChange?.(value);
		if (newChars.every((c) => c !== '')) local.onComplete?.(value);
	};

	const registerRef = (index: number, el: HTMLInputElement | null) => {
		inputRefs[index] = el;
	};

	const handleChange = (index: number, raw: string) => {
		// raw may be "" (delete) or 1–2 chars (type over existing)
		const char = raw.slice(-1);
		if (char && !isAllowed(char)) {
			// Solid doesn't auto-reset the DOM input when the signal value is
			// unchanged — force it back so the rejected char doesn't linger.
			const el = inputRefs[index];
			if (el) el.value = chars()[index] ?? '';
			return;
		}

		const next = [...chars()];
		next[index] = char;
		commit(next);

		if (char && index < length() - 1) {
			inputRefs[index + 1]?.focus();
		}
	};

	const handleKeyDown = (index: number, e: KeyboardEvent) => {
		if (e.key === 'Backspace') {
			e.preventDefault();
			const current = chars();
			if (current[index]) {
				const next = [...current];
				next[index] = '';
				commit(next);
			} else if (index > 0) {
				const next = [...current];
				next[index - 1] = '';
				commit(next);
				inputRefs[index - 1]?.focus();
			}
		} else if (e.key === 'ArrowLeft') {
			e.preventDefault();
			if (index > 0) inputRefs[index - 1]?.focus();
		} else if (e.key === 'ArrowRight') {
			e.preventDefault();
			if (index < length() - 1) inputRefs[index + 1]?.focus();
		}
	};

	const handlePaste = (index: number, e: ClipboardEvent) => {
		e.preventDefault();
		const data = e.clipboardData?.getData('text') ?? '';
		const pasted = data
			.split('')
			.filter((c) => isAllowed(c))
			.slice(0, length() - index);

		if (pasted.length === 0) return;

		const next = [...chars()];
		pasted.forEach((c, i) => {
			if (index + i < length()) next[index + i] = c;
		});
		commit(next);

		const nextFocus = Math.min(index + pasted.length, length() - 1);
		inputRefs[nextFocus]?.focus();
	};

	const ctxValue: OTPContextValue = {
		get chars() {
			return chars();
		},
		get length() {
			return length();
		},
		get disabled() {
			return disabled();
		},
		get isComplete() {
			return isComplete();
		},
		registerRef,
		handleChange,
		handleKeyDown,
		handlePaste,
	};

	return (
		<OTPContext.Provider value={ctxValue}>
			<div
				class={local.class}
				data-complete={isComplete() ? '' : undefined}
				data-disabled={disabled() ? '' : undefined}
				{...rest}>
				{local.children}
			</div>
		</OTPContext.Provider>
	);
}

// ---------------------------------------------------------------------------
// Slot
// ---------------------------------------------------------------------------

function Slot(props: OTPSlotProps) {
	const [local, rest] = splitProps(props, ['index', 'class']);
	const ctx = useOTPContext();
	const [isFocused, setIsFocused] = createSignal(false);

	const char = () => ctx.chars[local.index] ?? '';

	return (
		<input
			ref={(el) => ctx.registerRef(local.index, el)}
			type='text'
			inputMode='numeric'
			autocomplete='one-time-code'
			maxLength={2}
			value={char()}
			disabled={ctx.disabled}
			class={local.class}
			data-active={isFocused() ? '' : undefined}
			data-filled={char() ? '' : undefined}
			data-complete={ctx.isComplete ? '' : undefined}
			data-disabled={ctx.disabled ? '' : undefined}
			aria-label={`Digit ${local.index + 1}`}
			onInput={(e) => ctx.handleChange(local.index, e.currentTarget.value)}
			onKeyDown={(e) => ctx.handleKeyDown(local.index, e)}
			onFocus={(e) => {
				setIsFocused(true);
				e.currentTarget.select();
			}}
			onBlur={() => setIsFocused(false)}
			onPaste={(e) => ctx.handlePaste(local.index, e)}
			{...rest}
		/>
	);
}

// ---------------------------------------------------------------------------
// Separator
// ---------------------------------------------------------------------------

function Separator(props: OTPSeparatorProps) {
	const [local, rest] = splitProps(props, ['children', 'class']);

	return (
		<span
			class={local.class}
			aria-hidden='true'
			role='separator'
			{...rest}>
			{local.children ?? '–'}
		</span>
	);
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const OTP = {
	Root,
	Slot,
	Separator,
};
