import CodeBlockRoot from './CodeBlockRoot.vue';
import CodeBlockCode from './CodeBlockCode.vue';
import CodeBlockLines from './CodeBlockLines.vue';
import CodeBlockCopyButton from './CodeBlockCopyButton.vue';

export const CodeBlock = {
	Root: CodeBlockRoot,
	Code: CodeBlockCode,
	Lines: CodeBlockLines,
	CopyButton: CodeBlockCopyButton,
};

export type {
	CodeBlockRootProps,
	CodeBlockCodeProps,
	CodeBlockLinesProps,
	CodeBlockCopyButtonProps,
	CodeBlockLine,
	CodeBlockDiffType,
	CodeBlockContextValue,
} from './CodeBlock.types';
