<script setup lang="ts">
import { useCitationContext } from './keys';
import { sanitizeUrl } from '@/utils/sanitize-url';
import type { CitationRenderProps } from './Citation.types';

defineOptions({ name: 'CitationList' });

const ctx = useCitationContext();

function slotProps(index: number): CitationRenderProps {
	return { source: ctx.sources[index - 1], index };
}

// Sanitize the destination so a malicious `source.url` can't smuggle a
// `javascript:` payload into the footnote link; fall back to plain text.
function safeHref(url?: string): string | undefined {
	return sanitizeUrl(url);
}
</script>

<template>
	<ol>
		<li
			v-for="(source, i) in ctx.sources"
			:id="ctx.getFootnoteId(source.id)"
			:key="source.id"
			role="doc-endnote"
			data-citation-source=""
			:data-index="i + 1">
			<slot v-bind="slotProps(i + 1)">
				<a
					v-if="safeHref(source.url)"
					:href="safeHref(source.url)"
					target="_blank"
					rel="noreferrer">{{ source.title ?? source.url ?? source.id }}</a>
				<span v-else>{{ source.title ?? source.id }}</span>
			</slot>
		</li>
	</ol>
</template>
