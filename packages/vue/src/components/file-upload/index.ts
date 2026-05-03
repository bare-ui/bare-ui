import FileUploadRoot from './FileUploadRoot.vue';
import FileUploadInput from './FileUploadInput.vue';
import FileUploadTrigger from './FileUploadTrigger.vue';
import FileUploadDropzone from './FileUploadDropzone.vue';
import FileUploadItems from './FileUploadItems.vue';

export const FileUpload = {
	Root: FileUploadRoot,
	Input: FileUploadInput,
	Trigger: FileUploadTrigger,
	Dropzone: FileUploadDropzone,
	Items: FileUploadItems,
};

export type {
	FileUploadRootProps,
	FileUploadInputProps,
	FileUploadTriggerProps,
	FileUploadDropzoneProps,
} from './FileUpload.types';
