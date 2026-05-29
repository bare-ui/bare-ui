import { createContext, createMemo, useContext, splitProps, Show, For, type JSX } from 'solid-js';
import { createId } from '@/primitives/create-id';
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
	if (!ctx) throw new Error('Citation.Ref/List must be used within Citation.Root');
	return ctx;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

function Root(props: CitationRootProps) {
	const [local, rest] = splitProps(props, ['sources', 'class', 'children']);
	const baseId = createId('citation');

	const index = createMemo(() => {
		const map = new Map<string, number>();
		local.sources.forEach((s, i) => map.set(s.id, i + 1));
		return map;
	});

	const getSource = (id: string) => local.sources.find((s) => s.id === id);
	const getIndex = (id: string) => index().get(id) ?? 0;
	const getRefId = (id: string) => `${baseId}-ref-${id}`;
	const getFootnoteId = (id: string) => `${baseId}-note-${id}`;

	const ctx: CitationContextValue = {
		get sources() {
			return local.sources;
		},
		getSource,
		getIndex,
		getRefId,
		getFootnoteId,
	};

	return (
		<CitationContext.Provider value={ctx}>
			<div
				class={local.class}
				{...rest}>
				{local.children}
			</div>
		</CitationContext.Provider>
	);
}

// ---------------------------------------------------------------------------
// Ref — inline marker
// ---------------------------------------------------------------------------

function Ref(props: CitationRefProps) {
	const [local, rest] = splitProps(props, ['for', 'children', 'class']);
	const ctx = useCitationContext();

	const source = () => ctx.getSource(local.for);
	const index = () => ctx.getIndex(local.for);
	const label = () => source()?.label ?? String(index());
	const footnoteId = () => ctx.getFootnoteId(local.for);

	return (
		<Show when={source()}>
			{(src) => (
				<a
					id={ctx.getRefId(local.for)}
					href={`#${footnoteId()}`}
					// `doc-noteref` is a valid ARIA DPUB role outside Solid's typed union.
					role={'doc-noteref' as JSX.AnchorHTMLAttributes<HTMLAnchorElement>['role']}
					aria-describedby={footnoteId()}
					data-citation=''
					data-index={index()}
					class={local.class}
					{...rest}>
					{typeof local.children === 'function' ?
						local.children({ source: src(), index: index() })
					: local.children !== undefined ?
						(local.children as JSX.Element)
					:	<sup>{label()}</sup>}
				</a>
			)}
		</Show>
	);
}

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

function List(props: CitationListProps) {
	const [local, rest] = splitProps(props, ['children', 'class']);
	const ctx = useCitationContext();

	return (
		<ol
			class={local.class}
			{...rest}>
			<For each={ctx.sources}>
				{(source, i) => (
					<li
						id={ctx.getFootnoteId(source.id)}
						// `doc-endnote` is a valid ARIA DPUB role outside Solid's typed union.
						role={'doc-endnote' as JSX.HTMLAttributes<HTMLLIElement>['role']}
						data-citation-source=''
						data-index={i() + 1}>
						{local.children ? local.children({ source, index: i() + 1 }) : defaultFootnote(source)}
					</li>
				)}
			</For>
		</ol>
	);
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const Citation = {
	Root,
	Ref,
	List,
};

// Named exports expose the sub-components to Storybook's docgen (public API stays `Citation.*`).
export { Root, Ref, List };
