import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { useId } from '@/hooks/use-id';
import type {
	CitationContextValue,
	CitationListProps,
	CitationRefProps,
	CitationRootProps,
	CitationSource,
} from './Citation.types';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const CitationContext = createContext<CitationContextValue | null>(null);

function useCitationContext() {
	const ctx = useContext(CitationContext);
	if (!ctx) throw new globalThis.Error('Citation.Ref/List must be used within Citation.Root');
	return ctx;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

const Root = React.forwardRef<HTMLDivElement, CitationRootProps>(
	({ sources, className, children, ...rest }, ref) => {
		const baseId = useId('citation');

		const index = useMemo(() => {
			const map = new Map<string, number>();
			sources.forEach((s, i) => map.set(s.id, i + 1));
			return map;
		}, [sources]);

		const getSource = useCallback((id: string) => sources.find((s) => s.id === id), [sources]);
		const getIndex = useCallback((id: string) => index.get(id) ?? 0, [index]);
		const getRefId = useCallback((id: string) => `${baseId}-ref-${id}`, [baseId]);
		const getFootnoteId = useCallback((id: string) => `${baseId}-note-${id}`, [baseId]);

		const ctx = useMemo<CitationContextValue>(
			() => ({ sources, getSource, getIndex, getRefId, getFootnoteId }),
			[sources, getSource, getIndex, getRefId, getFootnoteId],
		);

		return (
			<CitationContext.Provider value={ctx}>
				<div
					ref={ref}
					className={className}
					{...rest}>
					{children}
				</div>
			</CitationContext.Provider>
		);
	},
);

Root.displayName = 'Citation.Root';

// ---------------------------------------------------------------------------
// Ref — inline marker
// ---------------------------------------------------------------------------

const Ref = React.forwardRef<HTMLAnchorElement, CitationRefProps>(
	({ for: forId, children, className, ...rest }, ref) => {
		const ctx = useCitationContext();
		const source = ctx.getSource(forId);
		if (!source) return null;

		const index = ctx.getIndex(forId);
		const label = source.label ?? String(index);
		const footnoteId = ctx.getFootnoteId(forId);

		return (
			<a
				ref={ref}
				id={ctx.getRefId(forId)}
				href={`#${footnoteId}`}
				role='doc-noteref'
				aria-describedby={footnoteId}
				data-citation=''
				data-index={index}
				className={className}
				{...rest}>
				{typeof children === 'function' ?
					children({ source, index })
				: children !== undefined ?
					children
				:	<sup>{label}</sup>}
			</a>
		);
	},
);

Ref.displayName = 'Citation.Ref';

// ---------------------------------------------------------------------------
// List — footnotes
// ---------------------------------------------------------------------------

const defaultFootnote = (source: CitationSource) => {
	const text = source.title ?? source.url ?? source.id;
	return source.url ?
		<a
			href={source.url}
			target='_blank'
			rel='noreferrer'>
			{text}
		</a>
	:	<span>{text}</span>;
};

const List = React.forwardRef<HTMLOListElement, CitationListProps>(({ children, className, ...rest }, ref) => {
	const ctx = useCitationContext();
	return (
		<ol
			ref={ref}
			className={className}
			{...rest}>
			{ctx.sources.map((source, i) => {
				const index = i + 1;
				return (
					<li
						key={source.id}
						id={ctx.getFootnoteId(source.id)}
						role='doc-endnote'
						data-citation-source=''
						data-index={index}>
						{children ? children({ source, index }) : defaultFootnote(source)}
					</li>
				);
			})}
		</ol>
	);
});

List.displayName = 'Citation.List';

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const Citation = {
	Root,
	Ref,
	List,
};
