import RichTextRoot from './RichTextRoot.vue';
import RichTextToolbar from './RichTextToolbar.vue';
import RichTextAction from './RichTextAction.vue';
import RichTextEditor from './RichTextEditor.vue';
import RichTextPreview from './RichTextPreview.vue';

export const RichText = {
	Root: RichTextRoot,
	Toolbar: RichTextToolbar,
	Action: RichTextAction,
	Editor: RichTextEditor,
	Preview: RichTextPreview,
};

export type {
	RichTextRootProps,
	RichTextToolbarProps,
	RichTextActionProps,
	RichTextEditorProps,
	RichTextPreviewProps,
	RichTextMode,
} from './RichText.types';
