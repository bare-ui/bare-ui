import EditableRoot from './EditableRoot.vue';
import EditablePreview from './EditablePreview.vue';
import EditableInput from './EditableInput.vue';
import EditableArea from './EditableArea.vue';
import EditableEditTrigger from './EditableEditTrigger.vue';
import EditableSubmitTrigger from './EditableSubmitTrigger.vue';
import EditableCancelTrigger from './EditableCancelTrigger.vue';

export const Editable = {
	Root: EditableRoot,
	Preview: EditablePreview,
	Input: EditableInput,
	Area: EditableArea,
	EditTrigger: EditableEditTrigger,
	SubmitTrigger: EditableSubmitTrigger,
	CancelTrigger: EditableCancelTrigger,
};

export type {
	EditableRootProps,
	EditablePreviewProps,
	EditableInputProps,
	EditableAreaProps,
	EditableEditTriggerProps,
	EditableSubmitTriggerProps,
	EditableCancelTriggerProps,
} from './Editable.types';
