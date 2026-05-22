import { createSignal, onCleanup, type Accessor } from 'solid-js';

export interface CreateCopyToClipboardOptions {
	/** Milliseconds before `copied` resets to `false`. Defaults to 2000. Set to 0 to disable auto-reset. */
	resetAfter?: number;
}

export interface CreateCopyToClipboardResult {
	/** Reactive accessor — the most recently copied value, or `null` if nothing has been copied. */
	value: Accessor<string | null>;
	/** Reactive accessor — `true` between a successful copy and the `resetAfter` timeout. */
	copied: Accessor<boolean>;
	/** Reactive accessor — most recent error, or `null` if the last copy succeeded. */
	error: Accessor<Error | null>;
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
 * const { copy, copied } = createCopyToClipboard()
 * <button onClick={() => copy(code)}>{copied() ? 'Copied!' : 'Copy'}</button>
 */
export function createCopyToClipboard(
	options: CreateCopyToClipboardOptions = {},
): CreateCopyToClipboardResult {
	const { resetAfter = 2000 } = options;
	const [value, setValue] = createSignal<string | null>(null);
	const [copied, setCopied] = createSignal(false);
	const [error, setError] = createSignal<Error | null>(null);
	let timerId: ReturnType<typeof setTimeout> | null = null;

	onCleanup(() => {
		if (timerId !== null) clearTimeout(timerId);
	});

	const reset = () => {
		if (timerId !== null) {
			clearTimeout(timerId);
			timerId = null;
		}
		setCopied(false);
		setValue(null);
		setError(null);
	};

	const copy = async (text: string): Promise<boolean> => {
		try {
			await writeText(text);
			setValue(text);
			setCopied(true);
			setError(null);
			if (timerId !== null) clearTimeout(timerId);
			if (resetAfter > 0) {
				timerId = setTimeout(() => {
					timerId = null;
					setCopied(false);
				}, resetAfter);
			}
			return true;
		} catch (e) {
			setError(e instanceof Error ? e : new Error(String(e)));
			setCopied(false);
			return false;
		}
	};

	return { value, copied, error, copy, reset };
}
