import { createContext, useContext, splitProps, mergeProps as solidMergeProps, For, type JSX } from 'solid-js';
import { createCopyToClipboard } from '@/primitives/create-copy-to-clipboard';
import type {
	CodeBlockCodeProps,
	CodeBlockContextValue,
	CodeBlockCopyButtonProps,
	CodeBlockLine,
	CodeBlockLinesProps,
	CodeBlockRootProps,
} from './CodeBlock.types';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const CodeBlockContext = createContext<CodeBlockContextValue | null>(null);

function useCodeBlockContext() {
	const ctx = useContext(CodeBlockContext);
	if (!ctx) throw new Error('CodeBlock sub-components must be used within CodeBlock.Root');
	return ctx;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

function Root(props: CodeBlockRootProps) {
	const merged = solidMergeProps({ startLine: 1, copyResetAfter: 2000 }, props);
	const [local, rest] = splitProps(merged, [
		'code',
		'language',
		'diff',
		'highlightLines',
		'startLine',
		'copyResetAfter',
		'class',
		'children',
	]);

	// `resetAfter` is read once at setup (the primitive captures it), matching React.
	// eslint-disable-next-line solid/reactivity
	const { copy: copyText, copied } = createCopyToClipboard({ resetAfter: local.copyResetAfter });

	const lines = (): CodeBlockLine[] => {
		const highlightSet = new Set(local.highlightLines ?? []);
		// Split on newlines but drop a single trailing empty line so a code
		// string ending in "\n" doesn't render a phantom blank row.
		const raw = local.code.split('\n');
		if (raw.length > 1 && raw[raw.length - 1] === '') raw.pop();
		return raw.map((content, i) => {
			const number = local.startLine + i;
			return {
				number,
				content,
				diff: local.diff?.[number],
				highlighted: highlightSet.has(number),
			};
		});
	};

	const ctx: CodeBlockContextValue = {
		get code() {
			return local.code;
		},
		get language() {
			return local.language;
		},
		get lines() {
			return lines();
		},
		get copied() {
			return copied();
		},
		copy: () => void copyText(local.code),
	};

	return (
		<CodeBlockContext.Provider value={ctx}>
			<div
				class={local.class}
				data-language={local.language || undefined}
				{...rest}>
				{local.children}
			</div>
		</CodeBlockContext.Provider>
	);
}

// ---------------------------------------------------------------------------
// Code (pre/code wrapper)
// ---------------------------------------------------------------------------

function Code(props: CodeBlockCodeProps) {
	const [local, rest] = splitProps(props, ['class', 'children']);
	const ctx = useCodeBlockContext();
	return (
		<pre
			class={local.class}
			data-language={ctx.language || undefined}
			{...rest}>
			<code data-language={ctx.language || undefined}>{local.children}</code>
		</pre>
	);
}

// ---------------------------------------------------------------------------
// Lines (render-prop over each line)
// ---------------------------------------------------------------------------

function Lines(props: CodeBlockLinesProps) {
	const ctx = useCodeBlockContext();
	return (
		<For each={ctx.lines}>
			{(line) => (
				<span
					data-line=''
					data-line-number={line.number}
					data-diff={line.diff}
					data-highlighted={line.highlighted ? '' : undefined}
					style={{ display: 'block' }}>
					{props.children({ line })}
				</span>
			)}
		</For>
	);
}

// ---------------------------------------------------------------------------
// CopyButton
// ---------------------------------------------------------------------------

function CopyButton(props: CodeBlockCopyButtonProps) {
	const [local, rest] = splitProps(props, ['class', 'children', 'onClick']);
	const ctx = useCodeBlockContext();

	const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
		ctx.copy();
		const userOnClick = local.onClick;
		if (typeof userOnClick === 'function') {
			(userOnClick as (event: typeof e) => void)(e);
		}
	};

	return (
		<button
			type='button'
			aria-label={ctx.copied ? 'Copied' : 'Copy code'}
			class={local.class}
			data-copied={ctx.copied ? '' : undefined}
			{...rest}
			onClick={handleClick}>
			{typeof local.children === 'function' ? local.children({ copied: ctx.copied }) : local.children}
		</button>
	);
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const CodeBlock = {
	Root,
	Code,
	Lines,
	CopyButton,
};

export { Root, Code, Lines, CopyButton };
