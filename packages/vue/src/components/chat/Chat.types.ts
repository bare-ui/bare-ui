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

export interface ChatRootProps {
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
	class?: string;
}

// ---------------------------------------------------------------------------
// List (virtualized)
// ---------------------------------------------------------------------------

export interface ChatListProps {
	/** Total number of messages. */
	count: number;
	/** Estimated row height in px before measurement. Default `72`. */
	estimateItemHeight?: number;
	/** Extra rows rendered above/below the viewport. Default `6`. */
	overscan?: number;
	/** Keep the view pinned to the newest message (great for streaming). Default `true`. */
	stickToBottom?: boolean;
	class?: string;
}

// ---------------------------------------------------------------------------
// Message
// ---------------------------------------------------------------------------

export interface ChatMessageProps {
	/** Who sent the message — surfaced as `data-role`. */
	role?: 'user' | 'assistant' | 'system' | (string & {});
	/** Mark the message as actively streaming — surfaced as `data-streaming`. */
	streaming?: boolean;
	class?: string;
}

// ---------------------------------------------------------------------------
// Composer / Input / Send
// ---------------------------------------------------------------------------

export interface ChatComposerProps {
	class?: string;
}

export interface ChatInputProps {
	/** Submit on Enter (Shift+Enter inserts a newline). Default `true`. */
	submitOnEnter?: boolean;
	/** Auto-grow the textarea to fit its content. Default `true`. */
	autoResize?: boolean;
	class?: string;
}

export interface ChatSendProps {
	disabled?: boolean;
	class?: string;
}
