import { onUnmounted, ref, type Ref } from 'vue';

export interface UseCopyToClipboardOptions {
	/** Milliseconds before `copied` resets to `false`. Defaults to 2000. Set to 0 to disable auto-reset. */
	resetAfter?: number;
}

export interface UseCopyToClipboardResult {
	/** The most recently copied value, or `null` if nothing has been copied. */
	value: Ref<string | null>;
	/** `true` between a successful copy and the `resetAfter` timeout. */
	copied: Ref<boolean>;
	/** Most recent error, or `null` if the last copy succeeded. */
	error: Ref<Error | null>;
	/** Copy `text` to the clipboard. Resolves to `true` on success. */
	copy: (text: string) => Promise<boolean>;
	/** Manually reset `copied`, `value`, and `error` to their initial state. */
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
 * <button @click="copy(code)">{{ copied ? 'Copied!' : 'Copy' }}</button>
 */
export function useCopyToClipboard(options: UseCopyToClipboardOptions = {}): UseCopyToClipboardResult {
	const { resetAfter = 2000 } = options;
	const value = ref<string | null>(null);
	const copied = ref(false);
	const error = ref<Error | null>(null);
	let timer: ReturnType<typeof setTimeout> | null = null;

	function reset() {
		if (timer) clearTimeout(timer);
		timer = null;
		copied.value = false;
		value.value = null;
		error.value = null;
	}

	async function copy(text: string): Promise<boolean> {
		try {
			await writeText(text);
			value.value = text;
			copied.value = true;
			error.value = null;
			if (timer) clearTimeout(timer);
			if (resetAfter > 0) {
				timer = setTimeout(() => {
					copied.value = false;
				}, resetAfter);
			}
			return true;
		} catch (e) {
			error.value = e instanceof Error ? e : new Error(String(e));
			copied.value = false;
			return false;
		}
	}

	onUnmounted(() => {
		if (timer) clearTimeout(timer);
	});

	return { value, copied, error, copy, reset };
}
