import type { Meta, StoryObj } from '@storybook/react-vite';
import { Citation } from './Citation';
import type { CitationSource } from './Citation.types';

const meta = {
	title: 'AI/Citation',
	component: Citation.Root,
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
			className='max-w-lg space-y-4 text-sm text-[#374151]'>
			<p className='leading-relaxed'>
				A <code>200 OK</code> response means the request succeeded
				<Citation.Ref
					for='rfc'
					className={markerCls}
				/>
				. Status codes are grouped into five classes, from informational to server error
				<Citation.Ref
					for='mdn'
					className={markerCls}
				/>
				.
			</p>
			<Citation.List className='space-y-1 border-t border-[#e5e7eb] pt-3 text-xs text-[#6b7280]'>
				{({ index, source }) => (
					<div className='flex gap-2'>
						<span className='font-semibold text-[#4338ca]'>{index}.</span>
						<a
							href={source.url}
							target='_blank'
							rel='noreferrer'
							className='hover:underline'>
							{source.title}
						</a>
					</div>
				)}
			</Citation.List>
		</Citation.Root>
	),
};

export const CustomMarker: Story = {
	render: () => (
		<Citation.Root
			sources={sources}
			className='max-w-lg space-y-4 text-sm text-[#374151]'>
			<p className='leading-relaxed'>
				HTTP semantics are defined in the spec
				<Citation.Ref
					for='rfc'
					className='mx-0.5 rounded-full bg-black px-1.5 text-[0.65rem] font-semibold text-white no-underline'>
					{({ source }) => source.title?.split(' ')[1]}
				</Citation.Ref>
				.
			</p>
			<Citation.List className='space-y-1 border-t border-[#e5e7eb] pt-3 text-xs text-[#6b7280]' />
		</Citation.Root>
	),
};
