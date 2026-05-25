import DiffRoot from './DiffRoot.vue';
import DiffUnified from './DiffUnified.vue';
import DiffSplit from './DiffSplit.vue';
import DiffStats from './DiffStats.vue';

export const Diff = {
	Root: DiffRoot,
	Unified: DiffUnified,
	Split: DiffSplit,
	Stats: DiffStats,
};

export type {
	DiffRootProps,
	DiffUnifiedProps,
	DiffSplitProps,
	DiffStatsProps,
	DiffLine,
	DiffLineType,
	DiffRow,
	DiffStats,
} from './Diff.types';
