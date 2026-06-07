import {
	createContext,
	createEffect,
	createMemo,
	createSignal,
	onCleanup,
	splitProps,
	useContext,
	For,
	type JSX,
} from 'solid-js';
import { createControllableState } from '@/primitives/create-controllable-state';
import { createMergedRefs } from '@/primitives/create-merged-refs';
import type {
	ChatComposerProps,
	ChatContextValue,
	ChatInputProps,
	ChatListProps,
	ChatMessageProps,
	ChatRootProps,
	ChatSendProps,
} from './Chat.types';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const ChatContext = createContext<ChatContextValue | null>(null);

function useChatContext() {
	const ctx = useContext(ChatContext);
	if (!ctx) throw new Error('Chat.Input/Composer/Send must be used within Chat.Root');
	return ctx;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

function Root(props: ChatRootProps & { ref?: (el: HTMLDivElement) => void }) {
	const [local, rest] = splitProps(props, [
		'value',
		'defaultValue',
		'onValueChange',
		'onSubmit',
		'isStreaming',
		'disabled',
		'class',
		'children',
		'ref',
	]);

	const [value, setValueState] = createControllableState<string>({
		get value() {
			return local.value;
		},
		defaultValue: local.defaultValue ?? '',
		get onChange() {
			return local.onValueChange;
		},
	});

	const isStreaming = () => local.isStreaming ?? false;
	const disabled = () => local.disabled ?? false;

	const setValue = (next: string) => setValueState(next);

	const submit = () => {
		if (disabled() || isStreaming()) return;
		const current = value();
		if (!current.trim()) return;
		local.onSubmit?.(current);
		setValueState('');
	};

	const ctxValue: ChatContextValue = {
		get value() {
			return value();
		},
		setValue,
		submit,
		get isStreaming() {
			return isStreaming();
		},
		get disabled() {
			return disabled();
		},
	};

	return (
		<ChatContext.Provider value={ctxValue}>
			<div
				ref={local.ref}
				class={local.class}
				data-streaming={isStreaming() ? '' : undefined}
				{...rest}>
				{local.children}
			</div>
		</ChatContext.Provider>
	);
}

// ---------------------------------------------------------------------------
// List (virtualized, stick-to-bottom)
// ---------------------------------------------------------------------------

function List(props: ChatListProps & { ref?: (el: HTMLDivElement) => void }) {
	const [local, rest] = splitProps(props, [
		'count',
		'estimateItemHeight',
		'overscan',
		'stickToBottom',
		'class',
		'style',
		'children',
		'onScroll',
		'ref',
	]);

	const estimateItemHeight = () => local.estimateItemHeight ?? 72;
	const overscan = () => local.overscan ?? 6;

	let scrollEl: HTMLDivElement | undefined;
	const mergedRef = createMergedRefs<HTMLDivElement>(
		(el) => (scrollEl = el),
		(el) => local.ref?.(el),
	);

	// Plain mutable registries — survive re-renders without triggering effect loops.
	const measured = new Map<number, number>();
	const elements = new Map<number, HTMLElement>();
	let observer: ResizeObserver | null = null;

	// Bump to force the offsets memo to re-eval once a measured size changes.
	const [version, setVersion] = createSignal(0);
	const bumpVersion = () => setVersion((x) => x + 1);

	const [scrollTop, setScrollTop] = createSignal(0);
	const [viewportHeight, setViewportHeight] = createSignal(0);
	// Whether the user is pinned to the bottom of the list. Read the initial
	// `stickToBottom` once at setup — it is not meant to react after mount.
	// eslint-disable-next-line solid/reactivity
	let stick = local.stickToBottom ?? true;

	// Prefix-sum offsets. Measured heights win once known (>0); estimate otherwise.
	const offsets = createMemo(() => {
		version(); // track
		const count = local.count;
		const est = estimateItemHeight();
		const arr = new Array<number>(count + 1);
		arr[0] = 0;
		for (let i = 0; i < count; i++) {
			const m = measured.get(i);
			arr[i + 1] = arr[i] + (m && m > 0 ? m : est);
		}
		return arr;
	});

	const totalHeight = () => offsets()[local.count] ?? 0;

	const window = createMemo(() => {
		const count = local.count;
		if (count === 0) return { start: 0, end: 0 };
		const off = offsets();
		const so = scrollTop();
		const vp = viewportHeight();
		const ov = overscan();
		let s = 0;
		while (s < count && off[s + 1] <= so) s++;
		let e = s;
		const bottom = so + vp;
		while (e < count && off[e] < bottom) e++;
		return { start: Math.max(0, s - ov), end: Math.min(count, e + ov) };
	});

	const indices = createMemo(() => {
		const { start, end } = window();
		const arr: number[] = [];
		for (let index = start; index < end; index++) arr.push(index);
		return arr;
	});

	// Measure the viewport and keep it in sync with container resizes.
	createEffect(() => {
		const el = scrollEl;
		if (!el) return;
		const update = () => setViewportHeight(el.clientHeight);
		update();
		if (typeof ResizeObserver === 'undefined') return;
		const ro = new ResizeObserver(update);
		ro.observe(el);
		onCleanup(() => ro.disconnect());
	});

	// Per-item measurement (handles messages growing while streaming).
	createEffect(() => {
		if (typeof ResizeObserver === 'undefined') return;
		const ro = new ResizeObserver((entries) => {
			let changed = false;
			for (const entry of entries) {
				const target = entry.target as HTMLElement;
				const index = Number(target.dataset.index);
				const h = target.offsetHeight;
				if (h > 0 && measured.get(index) !== h) {
					measured.set(index, h);
					changed = true;
				}
			}
			if (changed) bumpVersion();
		});
		observer = ro;
		for (const node of elements.values()) ro.observe(node);
		onCleanup(() => {
			ro.disconnect();
			observer = null;
		});
	});

	const setItemRef = (index: number) => (node: HTMLElement | null) => {
		const ro = observer;
		const prev = elements.get(index);
		if (prev && prev !== node) {
			ro?.unobserve(prev);
			elements.delete(index);
		}
		if (node) {
			node.dataset.index = String(index);
			elements.set(index, node);
			ro?.observe(node);
		}
	};

	// Pin to the newest message while the user is at the bottom.
	createEffect(() => {
		void local.count; // track
		void totalHeight(); // track
		if (!stick) return;
		const el = scrollEl;
		if (el) el.scrollTop = el.scrollHeight;
	});

	const handleScroll: JSX.EventHandler<HTMLDivElement, Event> = (e) => {
		const el = e.currentTarget;
		setScrollTop(el.scrollTop);
		stick = el.scrollHeight - el.scrollTop - el.clientHeight < 24;
		const userOnScroll = local.onScroll;
		if (typeof userOnScroll === 'function') {
			(userOnScroll as (event: typeof e) => void)(e);
		}
	};

	const rootStyle = (): JSX.CSSProperties => {
		const ours: JSX.CSSProperties = { 'overflow-y': 'auto', position: 'relative' };
		const user = local.style;
		if (typeof user === 'string' || !user) return ours;
		return { ...ours, ...(user as JSX.CSSProperties) };
	};

	return (
		<div
			ref={mergedRef}
			role='log'
			aria-live='polite'
			aria-relevant='additions'
			tabindex={0}
			class={local.class}
			style={rootStyle()}
			{...rest}
			onScroll={handleScroll}>
			<div
				data-chat-list-sizer=''
				style={{ position: 'relative', width: '100%', height: `${totalHeight()}px` }}>
				<For each={indices()}>
					{(index) => (
						<div
							ref={setItemRef(index)}
							data-chat-item=''
							data-index={index}
							style={{ position: 'absolute', top: `${offsets()[index]}px`, left: '0', width: '100%' }}>
							{local.children({ index })}
						</div>
					)}
				</For>
			</div>
		</div>
	);
}

// ---------------------------------------------------------------------------
// Message
// ---------------------------------------------------------------------------

function Message(props: ChatMessageProps & { ref?: (el: HTMLDivElement) => void }) {
	const [local, rest] = splitProps(props, ['role', 'streaming', 'class', 'children', 'ref']);
	return (
		<div
			ref={local.ref}
			data-role={local.role ?? 'user'}
			data-streaming={local.streaming ? '' : undefined}
			class={local.class}
			{...rest}>
			{local.children}
		</div>
	);
}

// ---------------------------------------------------------------------------
// Composer (form)
// ---------------------------------------------------------------------------

function Composer(props: ChatComposerProps & { ref?: (el: HTMLFormElement) => void }) {
	const [local, rest] = splitProps(props, ['class', 'children', 'onSubmit', 'ref']);
	const ctx = useChatContext();

	const handleSubmit: JSX.EventHandler<HTMLFormElement, SubmitEvent> = (e) => {
		e.preventDefault();
		ctx.submit();
		const userOnSubmit = local.onSubmit;
		if (typeof userOnSubmit === 'function') {
			(userOnSubmit as (event: typeof e) => void)(e);
		}
	};

	return (
		<form
			ref={local.ref}
			class={local.class}
			{...rest}
			onSubmit={handleSubmit}>
			{local.children}
		</form>
	);
}

// ---------------------------------------------------------------------------
// Input (auto-grow textarea)
// ---------------------------------------------------------------------------

function Input(props: ChatInputProps & { ref?: (el: HTMLTextAreaElement) => void }) {
	const [local, rest] = splitProps(props, [
		'submitOnEnter',
		'autoResize',
		'class',
		'onKeyDown',
		'onInput',
		'ref',
	]);
	const ctx = useChatContext();

	const submitOnEnter = () => local.submitOnEnter ?? true;
	const autoResize = () => local.autoResize ?? true;

	let inputEl: HTMLTextAreaElement | undefined;
	const mergedRef = createMergedRefs<HTMLTextAreaElement>(
		(el) => (inputEl = el),
		(el) => local.ref?.(el),
	);

	createEffect(() => {
		void ctx.value; // track
		if (!autoResize()) return;
		const el = inputEl;
		if (!el) return;
		el.style.height = 'auto';
		el.style.height = `${el.scrollHeight}px`;
	});

	const handleInput: JSX.InputEventHandler<HTMLTextAreaElement, InputEvent> = (e) => {
		ctx.setValue(e.currentTarget.value);
		const userOnInput = local.onInput;
		if (typeof userOnInput === 'function') {
			(userOnInput as (event: typeof e) => void)(e);
		}
	};

	const handleKeyDown: JSX.EventHandler<HTMLTextAreaElement, KeyboardEvent> = (e) => {
		const userOnKeyDown = local.onKeyDown;
		if (typeof userOnKeyDown === 'function') {
			(userOnKeyDown as (event: typeof e) => void)(e);
		}
		if (e.defaultPrevented) return;
		if (submitOnEnter() && e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
			e.preventDefault();
			ctx.submit();
		}
	};

	return (
		<textarea
			ref={mergedRef}
			value={ctx.value}
			disabled={ctx.disabled}
			aria-disabled={ctx.disabled || undefined}
			class={local.class}
			{...rest}
			onInput={handleInput}
			onKeyDown={handleKeyDown}
		/>
	);
}

// ---------------------------------------------------------------------------
// Send
// ---------------------------------------------------------------------------

function Send(props: ChatSendProps & { ref?: (el: HTMLButtonElement) => void }) {
	const [local, rest] = splitProps(props, ['class', 'children', 'disabled', 'onClick', 'ref']);
	const ctx = useChatContext();

	const isDisabled = () =>
		local.disabled ?? (ctx.disabled || ctx.isStreaming || ctx.value.trim().length === 0);

	const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
		ctx.submit();
		const userOnClick = local.onClick;
		if (typeof userOnClick === 'function') {
			(userOnClick as (event: typeof e) => void)(e);
		}
	};

	return (
		<button
			ref={local.ref}
			type='button'
			disabled={isDisabled()}
			class={local.class}
			data-streaming={ctx.isStreaming ? '' : undefined}
			{...rest}
			onClick={handleClick}>
			{local.children}
		</button>
	);
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const Chat = {
	Root,
	List,
	Message,
	Composer,
	Input,
	Send,
};

// Named exports expose the sub-components to Storybook's docgen (public API stays `Chat.*`).
export { Root, List, Message, Composer, Input, Send };
