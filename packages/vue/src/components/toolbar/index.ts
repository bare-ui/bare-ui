import ToolbarRoot from './ToolbarRoot.vue';
import ToolbarButton from './ToolbarButton.vue';
import ToolbarToggle from './ToolbarToggle.vue';
import ToolbarLink from './ToolbarLink.vue';
import ToolbarSeparator from './ToolbarSeparator.vue';

export const Toolbar = {
	Root: ToolbarRoot,
	Button: ToolbarButton,
	Toggle: ToolbarToggle,
	Link: ToolbarLink,
	Separator: ToolbarSeparator,
};

export type {
	ToolbarRootProps,
	ToolbarButtonProps,
	ToolbarToggleProps,
	ToolbarLinkProps,
	ToolbarSeparatorProps,
	ToolbarOrientation,
} from './Toolbar.types';
