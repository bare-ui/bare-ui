import TypewriterRoot from './TypewriterRoot.vue';
import TypewriterText from './TypewriterText.vue';
import TypewriterCursor from './TypewriterCursor.vue';

export const Typewriter = {
	Root: TypewriterRoot,
	Text: TypewriterText,
	Cursor: TypewriterCursor,
};

export type {
	TypewriterRootProps,
	TypewriterTextProps,
	TypewriterCursorProps,
	TypewriterState,
	TypewriterMode,
	TypewriterContextValue,
} from './Typewriter.types';
