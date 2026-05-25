import CitationRoot from './CitationRoot.vue';
import CitationRef from './CitationRef.vue';
import CitationList from './CitationList.vue';

export const Citation = {
	Root: CitationRoot,
	Ref: CitationRef,
	List: CitationList,
};

export type {
	CitationRootProps,
	CitationRefProps,
	CitationListProps,
	CitationSource,
	CitationRenderProps,
	CitationContextValue,
} from './Citation.types';
