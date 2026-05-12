import PanelGroup from './PanelGroup.vue';
import Panel from './Panel.vue';
import PanelHandle from './PanelHandle.vue';

export const ResizablePanels = { Group: PanelGroup, Panel, Handle: PanelHandle };

export type {
	PanelGroupProps,
	PanelProps,
	PanelHandleProps,
	PanelOrientation,
} from './ResizablePanels.types';
