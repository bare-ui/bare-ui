import React from 'react';

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

export interface CitationRootProps extends React.HTMLAttributes<HTMLDivElement> {
	/** Ordered list of sources. Numbering follows array order. */
	sources: CitationSource[];
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

export interface CitationRefProps
	extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'href'> {
	/** Id of the source this reference points to. */
	for: string;
	/** Static content or a render function. Defaults to a `<sup>` marker. */
	children?: React.ReactNode | ((props: CitationRenderProps) => React.ReactNode);
}

export interface CitationListProps extends Omit<React.OlHTMLAttributes<HTMLOListElement>, 'children'> {
	/** Render a single footnote. Defaults to a title + link row. */
	children?: (props: CitationRenderProps) => React.ReactNode;
}
