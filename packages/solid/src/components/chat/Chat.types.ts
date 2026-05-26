import type { JSX } from 'solid-js';

// ---------------------------------------------------------------------------
// Context (composer state shared by Input / Composer / Send)
// ---------------------------------------------------------------------------

export interface ChatContextValue {
	value: string;
	setValue: (value: string) => void;
	submit: () => void;
	isStreaming: boolean;
	disabled: boolean;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

export interface ChatRootProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onSubmit'> {
	/** Controlled composer value. */
	value?: string;
	/** Initial composer value (uncontrolled). */
	defaultValue?: string;
	/** Called when the composer text changes. */
	onValueChange?: (value: string) => void;
	/** Called on submit with the current value. The composer clears afterwards. */
	onSubmit?: (value: string) => void;
	/** When true, the assistant is responding — submission is blocked. */
	isStreaming?: boolean;
	/** Disable the composer. */
	disabled?: boolean;
}

// ---------------------------------------------------------------------------
// List (virtualized)
// ---------------------------------------------------------------------------

export interface ChatListProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children'> {
	/** Total number of messages. */
	count: number;
	/** Estimated row height in px before measurement. Default `72`. */
	estimateItemHeight?: number;
	/** Extra rows rendered above/below the viewport. Default `6`. */
	overscan?: number;
	/** Keep the view pinned to the newest message (great for streaming). Default `true`. */
	stickToBottom?: boolean;
	/** Render a single message by index. */
	children: (props: { index: number }) => JSX.Element;
}

// ---------------------------------------------------------------------------
// Message
// ---------------------------------------------------------------------------

export interface ChatMessageProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'role'> {
	/** Who sent the message — surfaced as `data-role`. */
	role?: 'user' | 'assistant' | 'system' | (string & {});
	/** Mark the message as actively streaming — surfaced as `data-streaming`. */
	streaming?: boolean;
}

// ---------------------------------------------------------------------------
// Composer / Input / Send
// ---------------------------------------------------------------------------

export type ChatComposerProps = JSX.FormHTMLAttributes<HTMLFormElement>;

export interface ChatInputProps extends JSX.TextareaHTMLAttributes<HTMLTextAreaElement> {
	/** Submit on Enter (Shift+Enter inserts a newline). Default `true`. */
	submitOnEnter?: boolean;
	/** Auto-grow the textarea to fit its content. Default `true`. */
	autoResize?: boolean;
}

export type ChatSendProps = JSX.ButtonHTMLAttributes<HTMLButtonElement>;
