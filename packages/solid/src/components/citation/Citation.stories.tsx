import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Citation } from './Citation';
import type { CitationSource } from './Citation.types';

const meta = {
	title: 'AI/Citation',
	component: Citation.Root,
	subcomponents: {
		'Citation.Ref': Citation.Ref,
		'Citation.List': Citation.List,
	},
	tags: ['autodocs'],
	args: { sources: [] },
	parameters: {
		docs: {
			description: {
				component:
					'Footnote-style references that link inline tokens to a list of sources — the pattern AI assistants use to ground answers. Numbering follows source order; markers and footnotes are both fully renderable.',
			},
		},
	},
} satisfies Meta<typeof Citation.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const sources: CitationSource[] = [
	{
		id: 'rfc',
		title: 'RFC 9110 — HTTP Semantics',
		url: 'https://www.rfc-editor.org/rfc/rfc9110',
		excerpt: 'The 200 status code indicates that the request has succeeded.',
	},
	{
		id: 'mdn',
		title: 'MDN — HTTP response status codes',
		url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status',
		excerpt: 'Responses are grouped in five classes.',
	},
];

const markerCls =
	'ml-0.5 inline-flex items-center rounded bg-[#eef2ff] px-1 text-[0.65rem] font-semibold text-[#4338ca] no-underline align-super hover:bg-[#e0e7ff]';

export const Default: Story = {
	render: () => (
		<Citation.Root
			sources={sources}
			class='max-w-lg space-y-4 text-sm text-[#374151]'>
			<p class='leading-relaxed'>
				A <code>200 OK</code> response means the request succeeded
				<Citation.Ref
					for='rfc'
					class={markerCls}
				/>
				. Status codes are grouped into five classes, from informational to server error
				<Citation.Ref
					for='mdn'
					class={markerCls}
				/>
				.
			</p>
			<Citation.List class='space-y-1 border-t border-[#e5e7eb] pt-3 text-xs text-[#6b7280]'>
				{({ index, source }) => (
					<div class='flex gap-2'>
						<span class='font-semibold text-[#4338ca]'>{index}.</span>
						<a
							href={source.url}
							target='_blank'
							rel='noreferrer'
							class='hover:underline'>
							{source.title}
						</a>
					</div>
				)}
			</Citation.List>
		</Citation.Root>
	),
};

export const Composed: Story = {
	render: () => (
		<div class='max-w-lg space-y-8 text-sm text-[#374151]'>
			<Citation.Root sources={sources}>
				<p class='leading-relaxed'>
					Default <code>&lt;sup&gt;</code> markers number in source order
					<Citation.Ref
						for='rfc'
						class='text-[#4338ca]'
					/>
					<Citation.Ref
						for='mdn'
						class='text-[#4338ca]'
					/>
					.
				</p>
			</Citation.Root>

			<Citation.Root sources={sources}>
				<p class='leading-relaxed'>
					A render function lets a marker show anything — here the source title
					<Citation.Ref
						for='rfc'
						class='mx-0.5 rounded-full bg-black px-1.5 text-[0.65rem] font-semibold text-white no-underline'>
						{({ source }) => source.title?.split(' ')[1]}
					</Citation.Ref>
					.
				</p>
			</Citation.Root>

			<Citation.Root sources={sources}>
				<p class='leading-relaxed'>
					The footnote list defaults to a title + link row, or render your own with excerpts
					<Citation.Ref
						for='mdn'
						class={markerCls}
					/>
					.
				</p>
				<Citation.List class='mt-3 space-y-2 border-t border-[#e5e7eb] pt-3 text-xs text-[#6b7280]'>
					{({ index, source }) => (
						<div class='flex gap-2'>
							<span class='font-semibold text-[#4338ca]'>{index}.</span>
							<div>
								<a
									href={source.url}
									target='_blank'
									rel='noreferrer'
									class='font-medium text-[#374151] hover:underline'>
									{source.title}
								</a>
								<p class='text-[#9ca3af]'>{source.excerpt}</p>
							</div>
						</div>
					)}
				</Citation.List>
			</Citation.Root>
		</div>
	),
};

export const Complex: Story = {
	render: () => {
		const answerSources: CitationSource[] = [
			{
				id: 'react-docs',
				title: 'React — useMemo',
				url: 'https://react.dev/reference/react/useMemo',
				excerpt: 'useMemo caches a calculation result between re-renders.',
			},
			{
				id: 'react-perf',
				title: 'React — Render and Commit',
				url: 'https://react.dev/learn/render-and-commit',
				excerpt: 'React renders components to figure out what to display.',
			},
		];

		return (
			<div class='mx-auto max-w-xl rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm'>
				<div class='mb-3 flex items-center gap-2 text-xs font-medium text-[#6b7280]'>
					<span class='inline-flex h-6 w-6 items-center justify-center rounded-full bg-black text-[0.65rem] text-white'>
						AI
					</span>
					Assistant
				</div>
				<Citation.Root
					sources={answerSources}
					class='space-y-4 text-sm text-[#374151]'>
					<p class='leading-relaxed'>
						<code>useMemo</code> caches a computed value so it is only recalculated when its dependencies
						change
						<Citation.Ref
							for='react-docs'
							class={markerCls}
						/>
						. This avoids redoing expensive work on every render pass
						<Citation.Ref
							for='react-perf'
							class={markerCls}
						/>
						.
					</p>
					<div>
						<p class='mb-2 text-xs font-semibold uppercase tracking-wide text-[#9ca3af]'>Sources</p>
						<Citation.List class='space-y-2 text-xs text-[#6b7280]'>
							{({ index, source }) => (
								<div class='flex gap-2 rounded-lg border border-[#e5e7eb] p-2'>
									<span class='font-semibold text-[#4338ca]'>{index}</span>
									<div>
										<a
											href={source.url}
											target='_blank'
											rel='noreferrer'
											class='font-medium text-[#374151] hover:underline'>
											{source.title}
										</a>
										<p class='text-[#9ca3af]'>{source.excerpt}</p>
									</div>
								</div>
							)}
						</Citation.List>
					</div>
				</Citation.Root>
			</div>
		);
	},
};
