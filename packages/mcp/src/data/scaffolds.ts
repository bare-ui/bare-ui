import type { ScaffoldData } from "./types.js";

// ────────────────────────────────────────────────────────────────────
// Composed scaffolds for the AI-native primitives
//
// `components[].frameworks[fw].basicExample` shows one component on its own.
// A scaffold is the next step up: a complete, ready-to-style file that wires
// several primitives to real state and a transport, so "build a chat UI" is a
// paste rather than an assembly job.
//
// Every scaffold is a whole file — imports included — because that is how they
// are consumed (a new file, or an empty SFC). Indentation is two spaces, the
// catalog convention; editors re-indent to the user's settings.
// ────────────────────────────────────────────────────────────────────

/**
 * Shared across the three frameworks: Wire UI never fetches. The transport is
 * always a clearly-marked stub the consumer swaps out, and the only contract
 * the primitives need is "the text grows over time".
 */
export const scaffolds: ScaffoldData[] = [
	{
		name: "chat",
		title: "Streaming chat",
		description:
			"A working chat surface: virtualized message list, streaming-aware composer, and assistant replies revealed token-by-token through Typewriter.",
		components: ["Chat", "Typewriter"],
		hooks: [],
		notes: [
			"Submission is blocked while isStreaming is true, so the composer needs no disabled wiring of its own.",
			"Chat.List is virtualized — it takes a count and resolves each message by index rather than mapping children.",
			"Typewriter continues from where it left off as text grows, which is why resetOnTextChange is left at its default.",
		],
		frameworks: {
			react: {
				source: `import { useState } from 'react';
import { Chat, Typewriter } from '@wire-ui/react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

/**
 * Swap in your own transport — SSE, WebSocket, or an SDK's async iterator. The
 * primitives only need the message text to grow over time.
 */
async function* streamReply(prompt: string): AsyncGenerator<string> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });
  if (!response.body) throw new Error('No response body.');

  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
  for (;;) {
    const { value, done } = await reader.read();
    if (done) return;
    if (value) yield value;
  }
}

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  async function send(prompt: string) {
    const replyId = crypto.randomUUID();
    setMessages((previous) => [
      ...previous,
      { id: crypto.randomUUID(), role: 'user', text: prompt },
      { id: replyId, role: 'assistant', text: '' },
    ]);
    setIsStreaming(true);
    try {
      for await (const token of streamReply(prompt)) {
        setMessages((previous) =>
          previous.map((message) =>
            message.id === replyId ? { ...message, text: message.text + token } : message,
          ),
        );
      }
    } finally {
      setIsStreaming(false);
    }
  }

  return (
    <Chat.Root onSubmit={send} isStreaming={isStreaming}>
      <Chat.List count={messages.length}>
        {({ index }) => (
          <Chat.Message
            role={messages[index].role}
            streaming={isStreaming && index === messages.length - 1}
          >
            {messages[index].role === 'assistant' ? (
              <Typewriter.Root text={messages[index].text} speed={12}>
                <Typewriter.Text />
                <Typewriter.Cursor>▋</Typewriter.Cursor>
              </Typewriter.Root>
            ) : (
              messages[index].text
            )}
          </Chat.Message>
        )}
      </Chat.List>
      <Chat.Composer>
        <Chat.Input placeholder="Ask anything…" />
        <Chat.Send>Send</Chat.Send>
      </Chat.Composer>
    </Chat.Root>
  );
}`,
			},
			vue: {
				source: `<script setup lang="ts">
import { ref } from 'vue';
import { Chat, Typewriter } from '@wire-ui/vue';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

const messages = ref<Message[]>([]);
const isStreaming = ref(false);

/**
 * Swap in your own transport — SSE, WebSocket, or an SDK's async iterator. The
 * primitives only need the message text to grow over time.
 */
async function* streamReply(prompt: string): AsyncGenerator<string> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });
  if (!response.body) throw new Error('No response body.');

  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
  for (;;) {
    const { value, done } = await reader.read();
    if (done) return;
    if (value) yield value;
  }
}

async function send(prompt: string) {
  messages.value.push(
    { id: crypto.randomUUID(), role: 'user', text: prompt },
    { id: crypto.randomUUID(), role: 'assistant', text: '' },
  );
  // Append through the reactive array, not a captured object reference.
  const replyIndex = messages.value.length - 1;

  isStreaming.value = true;
  try {
    for await (const token of streamReply(prompt)) {
      messages.value[replyIndex].text += token;
    }
  } finally {
    isStreaming.value = false;
  }
}
</script>

<template>
  <Chat.Root :on-submit="send" :is-streaming="isStreaming">
    <Chat.List :count="messages.length" v-slot="{ index }">
      <Chat.Message
        :role="messages[index].role"
        :streaming="isStreaming && index === messages.length - 1"
      >
        <Typewriter.Root
          v-if="messages[index].role === 'assistant'"
          :text="messages[index].text"
          :speed="12"
        >
          <Typewriter.Text />
          <Typewriter.Cursor>▋</Typewriter.Cursor>
        </Typewriter.Root>
        <template v-else>{{ messages[index].text }}</template>
      </Chat.Message>
    </Chat.List>
    <Chat.Composer>
      <Chat.Input placeholder="Ask anything…" />
      <Chat.Send>Send</Chat.Send>
    </Chat.Composer>
  </Chat.Root>
</template>`,
			},
			solid: {
				source: `import { createSignal } from 'solid-js';
import { Chat, Typewriter } from '@wire-ui/solid';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

/**
 * Swap in your own transport — SSE, WebSocket, or an SDK's async iterator. The
 * primitives only need the message text to grow over time.
 */
async function* streamReply(prompt: string): AsyncGenerator<string> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });
  if (!response.body) throw new Error('No response body.');

  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
  for (;;) {
    const { value, done } = await reader.read();
    if (done) return;
    if (value) yield value;
  }
}

export function ChatPanel() {
  const [messages, setMessages] = createSignal<Message[]>([]);
  const [isStreaming, setIsStreaming] = createSignal(false);

  async function send(prompt: string) {
    const replyId = crypto.randomUUID();
    setMessages((previous) => [
      ...previous,
      { id: crypto.randomUUID(), role: 'user', text: prompt },
      { id: replyId, role: 'assistant', text: '' },
    ]);
    setIsStreaming(true);
    try {
      for await (const token of streamReply(prompt)) {
        setMessages((previous) =>
          previous.map((message) =>
            message.id === replyId ? { ...message, text: message.text + token } : message,
          ),
        );
      }
    } finally {
      setIsStreaming(false);
    }
  }

  return (
    <Chat.Root onSubmit={send} isStreaming={isStreaming()}>
      <Chat.List count={messages().length}>
        {({ index }) => (
          <Chat.Message
            role={messages()[index].role}
            streaming={isStreaming() && index === messages().length - 1}
          >
            {messages()[index].role === 'assistant' ? (
              <Typewriter.Root text={messages()[index].text} speed={12}>
                <Typewriter.Text />
                <Typewriter.Cursor>▋</Typewriter.Cursor>
              </Typewriter.Root>
            ) : (
              messages()[index].text
            )}
          </Chat.Message>
        )}
      </Chat.List>
      <Chat.Composer>
        <Chat.Input placeholder="Ask anything…" />
        <Chat.Send>Send</Chat.Send>
      </Chat.Composer>
    </Chat.Root>
  );
}`,
			},
		},
	},

	{
		name: "stream",
		title: "Token stream",
		description:
			"Reveal a streamed response token-by-token with Typewriter: accumulate the response into one growing string and let the reveal keep its own cadence.",
		components: ["Typewriter"],
		hooks: [],
		notes: [
			"resetOnTextChange stays at its default (false) so each arriving token continues the reveal rather than restarting it.",
			"The reveal cadence is independent of the network — a fast stream still reads at `speed`.",
			"Typewriter.Cursor unmounts once the reveal finishes; pass keepMounted to keep it.",
		],
		frameworks: {
			react: {
				source: `import { useEffect, useState } from 'react';
import { Typewriter } from '@wire-ui/react';

/**
 * Accumulates a streamed response into one growing string. Swap fetch for your
 * own transport — SSE, WebSocket, or an SDK's async iterator.
 */
function useStreamedText(url: string): string {
  const [text, setText] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      const response = await fetch(url, { signal: controller.signal });
      if (!response.body) return;

      const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
      for (;;) {
        const { value, done } = await reader.read();
        if (done) return;
        if (value) setText((previous) => previous + value);
      }
    })().catch(() => {
      // Aborted on unmount, or the request failed — nothing left to reveal.
    });

    return () => controller.abort();
  }, [url]);

  return text;
}

export function StreamedReply() {
  const text = useStreamedText('/api/completion');

  return (
    <Typewriter.Root text={text} speed={18} mode="word">
      <Typewriter.Text />
      <Typewriter.Cursor>▋</Typewriter.Cursor>
    </Typewriter.Root>
  );
}`,
			},
			vue: {
				source: `<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { Typewriter } from '@wire-ui/vue';

const props = defineProps<{ url: string }>();

const text = ref('');
const controller = new AbortController();

/**
 * Accumulates a streamed response into one growing string. Swap fetch for your
 * own transport — SSE, WebSocket, or an SDK's async iterator.
 */
onMounted(async () => {
  try {
    const response = await fetch(props.url, { signal: controller.signal });
    if (!response.body) return;

    const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
    for (;;) {
      const { value, done } = await reader.read();
      if (done) return;
      if (value) text.value += value;
    }
  } catch {
    // Aborted on unmount, or the request failed — nothing left to reveal.
  }
});

onUnmounted(() => controller.abort());
</script>

<template>
  <Typewriter.Root :text="text" :speed="18" mode="word">
    <Typewriter.Text />
    <Typewriter.Cursor>▋</Typewriter.Cursor>
  </Typewriter.Root>
</template>`,
			},
			solid: {
				source: `import { createSignal, onCleanup } from 'solid-js';
import { Typewriter } from '@wire-ui/solid';

/**
 * Accumulates a streamed response into one growing string. Swap fetch for your
 * own transport — SSE, WebSocket, or an SDK's async iterator.
 */
function createStreamedText(url: string) {
  const [text, setText] = createSignal('');
  const controller = new AbortController();
  onCleanup(() => controller.abort());

  (async () => {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.body) return;

    const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
    for (;;) {
      const { value, done } = await reader.read();
      if (done) return;
      if (value) setText((previous) => previous + value);
    }
  })().catch(() => {
    // Aborted on cleanup, or the request failed — nothing left to reveal.
  });

  return text;
}

export function StreamedReply() {
  const text = createStreamedText('/api/completion');

  return (
    <Typewriter.Root text={text()} speed={18} mode="word">
      <Typewriter.Text />
      <Typewriter.Cursor>▋</Typewriter.Cursor>
    </Typewriter.Root>
  );
}`,
			},
		},
	},

	{
		name: "markdown",
		title: "Markdown message",
		description:
			"Render assistant Markdown through your own parser, overriding just the node types you care about. Wire UI supplies the render parts; you own every element.",
		components: ["Markdown"],
		hooks: [],
		notes: [
			"Overrides merge over the built-in renderers, so naming one node type leaves the rest alone.",
			"Node shape mirrors mdast, so remark output passes through unchanged; the stub parser here is a placeholder to replace.",
			"The overrides ship no classes on purpose — add your own styling hooks, or style the semantic elements directly.",
		],
		frameworks: {
			react: {
				source: `import { Markdown, type MarkdownComponents, type MarkdownNode } from '@wire-ui/react';

/**
 * Wire your own parser in here — Wire UI never parses Markdown. remark's mdast
 * output passes straight through:
 *
 *   import { fromMarkdown } from 'mdast-util-from-markdown';
 *   const parse = (content: string) => fromMarkdown(content).children;
 */
function parse(content: string): MarkdownNode[] {
  return content.split(/\\n{2,}/).map((block) => ({
    type: 'paragraph',
    children: [{ type: 'text', value: block }],
  }));
}

/** Only the node types named here change; the rest keep their defaults. */
const components: MarkdownComponents = {
  heading: ({ node, children }) => {
    const Tag = \`h\${Math.min(Math.max(node.depth ?? 1, 1), 6)}\` as 'h1';
    return <Tag>{children}</Tag>;
  },
  code: ({ node }) => (
    <pre data-language={node.lang || undefined}>
      <code>{node.value}</code>
    </pre>
  ),
  link: ({ node, children }) => (
    <a href={node.url} rel="noreferrer noopener" target="_blank">
      {children}
    </a>
  ),
};

export function MarkdownMessage({ content }: { content: string }) {
  return <Markdown content={content} parse={parse} components={components} />;
}`,
			},
			vue: {
				source: `<script setup lang="ts">
import { h } from 'vue';
import { Markdown, type MarkdownComponents, type MarkdownNode } from '@wire-ui/vue';

defineProps<{ content: string }>();

/**
 * Wire your own parser in here — Wire UI never parses Markdown. remark's mdast
 * output passes straight through:
 *
 *   import { fromMarkdown } from 'mdast-util-from-markdown';
 *   const parse = (content: string) => fromMarkdown(content).children;
 */
function parse(source: string): MarkdownNode[] {
  return source.split(/\\n{2,}/).map((block) => ({
    type: 'paragraph',
    children: [{ type: 'text', value: block }],
  }));
}

/**
 * Only the node types named here change; the rest keep their defaults. Each
 * renderer receives the node, with the pre-rendered children as its slot.
 */
const components: MarkdownComponents = {
  heading: (props, { slots }) =>
    h(\`h\${Math.min(Math.max(props.node.depth ?? 1, 1), 6)}\`, slots.default?.()),
  code: (props) =>
    h('pre', { 'data-language': props.node.lang || undefined }, [h('code', props.node.value)]),
  link: (props, { slots }) =>
    h('a', { href: props.node.url, rel: 'noreferrer noopener', target: '_blank' }, slots.default?.()),
};
</script>

<template>
  <Markdown :content="content" :parse="parse" :components="components" />
</template>`,
			},
			solid: {
				source: `import { Dynamic } from 'solid-js/web';
import { Markdown, type MarkdownComponents, type MarkdownNode } from '@wire-ui/solid';

/**
 * Wire your own parser in here — Wire UI never parses Markdown. remark's mdast
 * output passes straight through:
 *
 *   import { fromMarkdown } from 'mdast-util-from-markdown';
 *   const parse = (content: string) => fromMarkdown(content).children;
 */
function parse(content: string): MarkdownNode[] {
  return content.split(/\\n{2,}/).map((block) => ({
    type: 'paragraph',
    children: [{ type: 'text', value: block }],
  }));
}

/** Only the node types named here change; the rest keep their defaults. */
const components: MarkdownComponents = {
  heading: (props) => (
    <Dynamic component={\`h\${Math.min(Math.max(props.node.depth ?? 1, 1), 6)}\`}>
      {props.children}
    </Dynamic>
  ),
  code: (props) => (
    <pre data-language={props.node.lang || undefined}>
      <code>{props.node.value}</code>
    </pre>
  ),
  link: (props) => (
    <a href={props.node.url} rel="noreferrer noopener" target="_blank">
      {props.children}
    </a>
  ),
};

export function MarkdownMessage(props: { content: string }) {
  return <Markdown content={props.content} parse={parse} components={components} />;
}`,
			},
		},
	},
];
