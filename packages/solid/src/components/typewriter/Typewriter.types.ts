import type { JSX } from 'solid-js';

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

export type TypewriterMode = 'char' | 'word';

export interface TypewriterState {
	/** The portion of `text` that is currently revealed */
	displayed: string;
	/** True while tokens are still being revealed */
	isTyping: boolean;
	/** True once all of `text` has been revealed */
	isDone: boolean;
	/** Fraction revealed, 0–1 */
	progress: number;
}

export type TypewriterContextValue = TypewriterState;

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

export interface TypewriterRootProps extends Omit<JSX.HTMLAttributes<HTMLSpanElement>, 'children'> {
	/**
	 * Full text to reveal. Grow this value over time (e.g. from a streamed
	 * response) and the reveal continues from where it left off.
	 */
	text: string;
	/** Milliseconds per revealed token (char or word). Default `30`. */
	speed?: number;
	/** Reveal one character or one whole word per tick. Default `'char'`. */
	mode?: TypewriterMode;
	/** Delay in ms before the first token is revealed. Default `0`. */
	startDelay?: number;
	/** Begin revealing automatically on mount. Default `true`. */
	autoStart?: boolean;
	/**
	 * Restart from the beginning whenever `text` changes instead of continuing.
	 * Leave `false` (default) for streaming, where `text` grows incrementally.
	 */
	resetOnTextChange?: boolean;
	/** Clear and retype once complete. Default `false`. */
	loop?: boolean;
	/** ms to wait before looping when `loop` is set. Default `1000`. */
	loopDelay?: number;
	/** Called once all text has been revealed. */
	onComplete?: () => void;
	/**
	 * Either standard children (compose with `Typewriter.Text` / `Typewriter.Cursor`)
	 * or a render function receiving the current reveal state. When omitted, the
	 * revealed text is rendered directly.
	 */
	children?: JSX.Element | ((state: TypewriterState) => JSX.Element);
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

export type TypewriterTextProps = JSX.HTMLAttributes<HTMLSpanElement>;

export interface TypewriterCursorProps extends JSX.HTMLAttributes<HTMLSpanElement> {
	/**
	 * Keep the cursor mounted after typing finishes. When `false` (default) the
	 * cursor unmounts once `isDone` is true.
	 */
	keepMounted?: boolean;
}
