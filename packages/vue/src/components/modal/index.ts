import ModalRoot from './ModalRoot.vue';
import ModalPortal from './ModalPortal.vue';
import ModalOverlay from './ModalOverlay.vue';
import ModalContent from './ModalContent.vue';
import ModalClose from './ModalClose.vue';

export const Modal = { Root: ModalRoot, Portal: ModalPortal, Overlay: ModalOverlay, Content: ModalContent, Close: ModalClose };
export type {
	ModalRootProps,
	ModalPortalProps,
	ModalOverlayProps,
	ModalContentProps,
	ModalCloseProps,
} from './Modal.types';
