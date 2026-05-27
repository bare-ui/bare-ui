import TabsRoot from './TabsRoot.vue';
import TabsList from './TabsList.vue';
import TabsTrigger from './TabsTrigger.vue';
import TabsContent from './TabsContent.vue';

export const Tabs = { Root: TabsRoot, List: TabsList, Trigger: TabsTrigger, Content: TabsContent };
export type {
	TabsRootProps,
	TabsListProps,
	TabsTriggerProps,
	TabsContentProps,
	TabsOrientation,
	TabsActivationMode,
} from './Tabs.types';
