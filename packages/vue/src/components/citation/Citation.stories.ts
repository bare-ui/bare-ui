import { h } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { Citation } from '.';
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
	render: () => ({
		setup: () => () =>
			h(
				Citation.Root,
				{ sources, class: 'max-w-lg space-y-4 text-sm text-[#374151]' },
				() => [
					h('p', { class: 'leading-relaxed' }, [
						'A ',
						h('code', null, '200 OK'),
						' response means the request succeeded',
						h(Citation.Ref, { for: 'rfc', class: markerCls }),
						'. Status codes are grouped into five classes, from informational to server error',
						h(Citation.Ref, { for: 'mdn', class: markerCls }),
						'.',
					]),
					h(
						Citation.List,
						{ class: 'space-y-1 border-t border-[#e5e7eb] pt-3 text-xs text-[#6b7280]' },
						({ index, source }: { index: number; source: CitationSource }) =>
							h('div', { class: 'flex gap-2' }, [
								h('span', { class: 'font-semibold text-[#4338ca]' }, `${index}.`),
								h('a', { href: source.url, target: '_blank', rel: 'noreferrer', class: 'hover:underline' }, source.title),
							]),
					),
				],
			),
	}),
};

export const CustomMarker: Story = {
	render: () => ({
		setup: () => () =>
			h(
				Citation.Root,
				{ sources, class: 'max-w-lg space-y-4 text-sm text-[#374151]' },
				() => [
					h('p', { class: 'leading-relaxed' }, [
						'HTTP semantics are defined in the spec',
						h(
							Citation.Ref,
							{ for: 'rfc', class: 'mx-0.5 rounded-full bg-black px-1.5 text-[0.65rem] font-semibold text-white no-underline' },
							({ source }: { source: CitationSource }) => source.title?.split(' ')[1],
						),
						'.',
					]),
					h(Citation.List, { class: 'space-y-1 border-t border-[#e5e7eb] pt-3 text-xs text-[#6b7280]' }),
				],
			),
	}),
};
