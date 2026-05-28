import React, { createContext, useContext, useMemo } from 'react';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
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
	if (!ctx) throw new globalThis.Error('CodeBlock sub-components must be used within CodeBlock.Root');
	return ctx;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

const Root = React.forwardRef<HTMLDivElement, CodeBlockRootProps>(
	(
		{
			code,
			language,
			diff,
			highlightLines,
			startLine = 1,
			copyResetAfter = 2000,
			className,
			children,
			...rest
		},
		ref,
	) => {
		const { copy: copyText, copied } = useCopyToClipboard({ resetAfter: copyResetAfter });

		const lines = useMemo<CodeBlockLine[]>(() => {
			const highlightSet = new Set(highlightLines ?? []);
			// Split on newlines but drop a single trailing empty line so a code
			// string ending in "\n" doesn't render a phantom blank row.
			const raw = code.split('\n');
			if (raw.length > 1 && raw[raw.length - 1] === '') raw.pop();
			return raw.map((content, i) => {
				const number = startLine + i;
				return {
					number,
					content,
					diff: diff?.[number],
					highlighted: highlightSet.has(number),
				};
			});
		}, [code, diff, highlightLines, startLine]);

		const ctx = useMemo<CodeBlockContextValue>(
			() => ({
				code,
				language,
				lines,
				copied,
				copy: () => void copyText(code),
			}),
			[code, language, lines, copied, copyText],
		);

		return (
			<CodeBlockContext.Provider value={ctx}>
				<div
					ref={ref}
					className={className}
					data-language={language || undefined}
					{...rest}>
					{children}
				</div>
			</CodeBlockContext.Provider>
		);
	},
);

Root.displayName = 'CodeBlock.Root';

// ---------------------------------------------------------------------------
// Code (pre/code wrapper)
// ---------------------------------------------------------------------------

const Code = React.forwardRef<HTMLPreElement, CodeBlockCodeProps>(({ className, children, ...rest }, ref) => {
	const ctx = useCodeBlockContext();
	return (
		<pre
			ref={ref}
			className={className}
			data-language={ctx.language || undefined}
			{...rest}>
			<code data-language={ctx.language || undefined}>{children}</code>
		</pre>
	);
});

Code.displayName = 'CodeBlock.Code';

// ---------------------------------------------------------------------------
// Lines (render-prop over each line)
// ---------------------------------------------------------------------------

const Lines: React.FC<CodeBlockLinesProps> = ({ children }) => {
	const ctx = useCodeBlockContext();
	return (
		<>
			{ctx.lines.map((line) => (
				<span
					key={line.number}
					data-line=''
					data-line-number={line.number}
					data-diff={line.diff}
					data-highlighted={line.highlighted ? '' : undefined}
					style={{ display: 'block' }}>
					{children({ line })}
				</span>
			))}
		</>
	);
};

Lines.displayName = 'CodeBlock.Lines';

// ---------------------------------------------------------------------------
// CopyButton
// ---------------------------------------------------------------------------

const CopyButton = React.forwardRef<HTMLButtonElement, CodeBlockCopyButtonProps>(
	({ className, children, onClick, ...rest }, ref) => {
		const ctx = useCodeBlockContext();
		return (
			<button
				ref={ref}
				type='button'
				aria-label={ctx.copied ? 'Copied' : 'Copy code'}
				className={className}
				data-copied={ctx.copied ? '' : undefined}
				{...rest}
				onClick={(e) => {
					ctx.copy();
					onClick?.(e);
				}}>
				{typeof children === 'function' ? children({ copied: ctx.copied }) : children}
			</button>
		);
	},
);

CopyButton.displayName = 'CodeBlock.CopyButton';

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const CodeBlock = {
	Root,
	Code,
	Lines,
	CopyButton,
};

// Named exports expose the sub-components to Storybook's react-docgen (public API stays `CodeBlock.*`).
export { Root, Code, Lines, CopyButton };
