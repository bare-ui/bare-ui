import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseCopyToClipboardOptions {
	/** Milliseconds before `copied` resets to `false`. Defaults to 2000. Set to 0 to disable auto-reset. */
	resetAfter?: number;
}

export interface UseCopyToClipboardResult {
	/** The most recently copied value, or `null` if nothing has been copied. */
	value: string | null;
	/** `true` between a successful copy and the `resetAfter` timeout. */
	copied: boolean;
	/** Most recent error, or `null` if the last copy succeeded. */
	error: Error | null;
	/** Copy `text` to the clipboard. Returns `true` on success. */
	copy: (text: string) => Promise<boolean>;
	/** Manually reset `copied` and `value` to their initial state. */
	reset: () => void;
}

async function writeText(text: string): Promise<void> {
	if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
		await navigator.clipboard.writeText(text);
		return;
	}
	// Legacy fallback for non-secure contexts (e.g., http://).
	if (typeof document === 'undefined') throw new Error('Clipboard API unavailable');
	const textarea = document.createElement('textarea');
	textarea.value = text;
	textarea.setAttribute('readonly', '');
	textarea.style.position = 'fixed';
	textarea.style.opacity = '0';
	textarea.style.pointerEvents = 'none';
	document.body.appendChild(textarea);
	textarea.select();
	try {
		const ok = document.execCommand('copy');
		if (!ok) throw new Error('execCommand("copy") failed');
	} finally {
		document.body.removeChild(textarea);
	}
}

/**
 * Copies text to the clipboard and tracks the success state.
 *
 * `copied` flips to `true` on success and auto-resets after `resetAfter` ms (default 2000).
 * Falls back to a hidden `<textarea>` + `execCommand` when `navigator.clipboard`
 * is unavailable (e.g., insecure contexts).
 *
 * @example
 * const { copy, copied } = useCopyToClipboard()
 * <button onClick={() => copy(code)}>{copied ? 'Copied!' : 'Copy'}</button>
 */
export function useCopyToClipboard(options: UseCopyToClipboardOptions = {}): UseCopyToClipboardResult {
	const { resetAfter = 2000 } = options;
	const [value, setValue] = useState<string | null>(null);
	const [copied, setCopied] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(
		() => () => {
			if (timerRef.current) clearTimeout(timerRef.current);
		},
		[],
	);

	const reset = useCallback(() => {
		if (timerRef.current) clearTimeout(timerRef.current);
		setCopied(false);
		setValue(null);
		setError(null);
	}, []);

	const copy = useCallback(
		async (text: string) => {
			try {
				await writeText(text);
				setValue(text);
				setCopied(true);
				setError(null);
				if (timerRef.current) clearTimeout(timerRef.current);
				if (resetAfter > 0) {
					timerRef.current = setTimeout(() => setCopied(false), resetAfter);
				}
				return true;
			} catch (e) {
				setError(e instanceof Error ? e : new Error(String(e)));
				setCopied(false);
				return false;
			}
		},
		[resetAfter],
	);

	return { value, copied, error, copy, reset };
}
