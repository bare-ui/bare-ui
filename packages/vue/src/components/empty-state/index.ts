import EmptyStateRoot from './EmptyStateRoot.vue';
import EmptyStateMedia from './EmptyStateMedia.vue';
import EmptyStateTitle from './EmptyStateTitle.vue';
import EmptyStateDescription from './EmptyStateDescription.vue';
import EmptyStateActions from './EmptyStateActions.vue';

export const EmptyState = {
	Root: EmptyStateRoot,
	Media: EmptyStateMedia,
	Title: EmptyStateTitle,
	Description: EmptyStateDescription,
	Actions: EmptyStateActions,
};

export type {
	EmptyStateRootProps,
	EmptyStateMediaProps,
	EmptyStateTitleProps,
	EmptyStateDescriptionProps,
	EmptyStateActionsProps,
} from './EmptyState.types';
