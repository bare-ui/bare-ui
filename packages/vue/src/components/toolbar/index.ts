import ToolbarRoot from './ToolbarRoot.vue';
import ToolbarButton from './ToolbarButton.vue';
import ToolbarLink from './ToolbarLink.vue';
import ToolbarSeparator from './ToolbarSeparator.vue';

export const Toolbar = {
	Root: ToolbarRoot,
	Button: ToolbarButton,
	Link: ToolbarLink,
	Separator: ToolbarSeparator,
};

export type {
	ToolbarRootProps,
	ToolbarButtonProps,
	ToolbarLinkProps,
	ToolbarSeparatorProps,
	ToolbarOrientation,
} from './Toolbar.types';
