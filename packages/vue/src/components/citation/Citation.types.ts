// ---------------------------------------------------------------------------
// Source
// ---------------------------------------------------------------------------

export interface CitationSource {
	/** Stable identifier referenced by `Citation.Ref`'s `for` prop. */
	id: string;
	/** Marker label override. Defaults to the 1-based position. */
	label?: string;
	/** Human-readable title shown in the footnote list. */
	title?: string;
	/** Link to the source. */
	url?: string;
	/** Optional excerpt/snippet for the footnote list. */
	excerpt?: string;
}

export interface CitationRenderProps {
	/** The resolved source. */
	source: CitationSource;
	/** 1-based position in the `sources` array. */
	index: number;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

export interface CitationContextValue {
	sources: CitationSource[];
	getSource: (id: string) => CitationSource | undefined;
	/** 1-based index, or `0` when the id is unknown. */
	getIndex: (id: string) => number;
	getRefId: (id: string) => string;
	getFootnoteId: (id: string) => string;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

export interface CitationRootProps {
	/** Ordered list of sources. Numbering follows array order. */
	sources: CitationSource[];
	class?: string;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

export interface CitationRefProps {
	/** Id of the source this reference points to. */
	for: string;
	class?: string;
}

export interface CitationListProps {
	class?: string;
}
