'use client';

import React, {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useReducer,
	useRef,
	useState,
} from 'react';
import { useControllableState } from '@/hooks/use-controllable-state';
import { useIsomorphicLayoutEffect } from '@/hooks/use-isomorphic-layout-effect';
import { useMergedRefs } from '@/hooks/use-merged-refs';
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
	if (!ctx) throw new globalThis.Error('Chat.Input/Composer/Send must be used within Chat.Root');
	return ctx;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

const Root = React.forwardRef<HTMLDivElement, ChatRootProps>(
	(
		{
			value: controlledValue,
			defaultValue = '',
			onValueChange,
			onSubmit,
			isStreaming = false,
			disabled = false,
			className,
			children,
			...rest
		},
		ref,
	) => {
		const [value, setValueState] = useControllableState<string>({
			value: controlledValue,
			defaultValue,
			onChange: onValueChange,
		});

		const setValue = useCallback((next: string) => setValueState(next), [setValueState]);

		const submit = useCallback(() => {
			if (disabled || isStreaming) return;
			if (!value.trim()) return;
			onSubmit?.(value);
			setValueState('');
		}, [disabled, isStreaming, value, onSubmit, setValueState]);

		const ctx = useMemo<ChatContextValue>(
			() => ({ value, setValue, submit, isStreaming, disabled }),
			[value, setValue, submit, isStreaming, disabled],
		);

		return (
			<ChatContext.Provider value={ctx}>
				<div
					ref={ref}
					className={className}
					data-streaming={isStreaming ? '' : undefined}
					{...rest}>
					{children}
				</div>
			</ChatContext.Provider>
		);
	},
);

Root.displayName = 'Chat.Root';

// ---------------------------------------------------------------------------
// List (virtualized, stick-to-bottom)
// ---------------------------------------------------------------------------

const List = React.forwardRef<HTMLDivElement, ChatListProps>(
	(
		{ count, estimateItemHeight = 72, overscan = 6, stickToBottom = true, className, style, children, ...rest },
		ref,
	) => {
		const scrollRef = useRef<HTMLDivElement | null>(null);
		const mergedRef = useMergedRefs(scrollRef, ref);

		const measuredRef = useRef<Map<number, number>>(new Map());
		const elementsRef = useRef<Map<number, HTMLElement>>(new Map());
		const observerRef = useRef<ResizeObserver | null>(null);
		const [version, bumpVersion] = useReducer((x: number) => x + 1, 0);

		const [scrollTop, setScrollTop] = useState(0);
		const [viewportHeight, setViewportHeight] = useState(0);
		const stickRef = useRef(stickToBottom);

		// Prefix-sum offsets. Measured heights win once known (>0); estimate otherwise.
		const offsets = useMemo(() => {
			const arr = new Array<number>(count + 1);
			arr[0] = 0;
			// Reading the measurement registry during render is intentional: `version`
			// bumps whenever a measurement changes, forcing this memo to recompute.
			/* eslint-disable react-hooks/refs */
			const measurements = measuredRef.current;
			for (let i = 0; i < count; i++) {
				const measured = measurements.get(i);
				const h = measured && measured > 0 ? measured : estimateItemHeight;
				arr[i + 1] = arr[i] + h;
			}
			/* eslint-enable react-hooks/refs */
			return arr;
			// `version` bumps whenever a measurement changes.
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [count, estimateItemHeight, version]);

		const totalHeight = offsets[count] ?? 0;

		const { start, end } = useMemo(() => {
			if (count === 0) return { start: 0, end: 0 };
			let s = 0;
			while (s < count && offsets[s + 1] <= scrollTop) s++;
			let e = s;
			const bottom = scrollTop + viewportHeight;
			while (e < count && offsets[e] < bottom) e++;
			return { start: Math.max(0, s - overscan), end: Math.min(count, e + overscan) };
		}, [count, offsets, scrollTop, viewportHeight, overscan]);

		// Measure the viewport and keep it in sync with container resizes.
		useIsomorphicLayoutEffect(() => {
			const el = scrollRef.current;
			if (!el) return;
			const update = () => setViewportHeight(el.clientHeight);
			update();
			if (typeof ResizeObserver === 'undefined') return;
			const ro = new ResizeObserver(update);
			ro.observe(el);
			return () => ro.disconnect();
		}, []);

		// Per-item measurement (handles messages growing while streaming).
		useIsomorphicLayoutEffect(() => {
			if (typeof ResizeObserver === 'undefined') return;
			const ro = new ResizeObserver((entries) => {
				let changed = false;
				for (const entry of entries) {
					const target = entry.target as HTMLElement;
					const index = Number(target.dataset.index);
					const h = target.offsetHeight;
					if (h > 0 && measuredRef.current.get(index) !== h) {
						measuredRef.current.set(index, h);
						changed = true;
					}
				}
				if (changed) bumpVersion();
			});
			observerRef.current = ro;
			return () => {
				ro.disconnect();
				observerRef.current = null;
			};
		}, []);

		const setItemRef = useCallback(
			(index: number) => (node: HTMLElement | null) => {
				const ro = observerRef.current;
				const prev = elementsRef.current.get(index);
				if (prev && prev !== node) {
					ro?.unobserve(prev);
					elementsRef.current.delete(index);
				}
				if (node) {
					node.dataset.index = String(index);
					elementsRef.current.set(index, node);
					ro?.observe(node);
				}
			},
			[],
		);

		// Pin to the newest message while the user is at the bottom.
		useIsomorphicLayoutEffect(() => {
			if (!stickRef.current) return;
			const el = scrollRef.current;
			if (el) el.scrollTop = el.scrollHeight;
		}, [count, totalHeight]);

		const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
			const el = e.currentTarget;
			setScrollTop(el.scrollTop);
			stickRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 24;
			rest.onScroll?.(e);
		};

		const items: React.ReactNode[] = [];
		for (let index = start; index < end; index++) {
			items.push(
				<div
					key={index}
					ref={setItemRef(index)}
					data-chat-item=''
					data-index={index}
					style={{ position: 'absolute', top: offsets[index], left: 0, width: '100%' }}>
					{children({ index })}
				</div>,
			);
		}

		return (
			<div
				ref={mergedRef}
				role='log'
				aria-live='polite'
				aria-relevant='additions'
				tabIndex={0}
				className={className}
				style={{ overflowY: 'auto', position: 'relative', ...style }}
				{...rest}
				onScroll={handleScroll}>
				<div
					data-chat-list-sizer=''
					style={{ position: 'relative', width: '100%', height: totalHeight }}>
					{items}
				</div>
			</div>
		);
	},
);

List.displayName = 'Chat.List';

// ---------------------------------------------------------------------------
// Message
// ---------------------------------------------------------------------------

const Message = React.forwardRef<HTMLDivElement, ChatMessageProps>(
	({ role = 'user', streaming = false, className, children, ...rest }, ref) => (
		<div
			ref={ref}
			data-role={role}
			data-streaming={streaming ? '' : undefined}
			className={className}
			{...rest}>
			{children}
		</div>
	),
);

Message.displayName = 'Chat.Message';

// ---------------------------------------------------------------------------
// Composer (form)
// ---------------------------------------------------------------------------

const Composer = React.forwardRef<HTMLFormElement, ChatComposerProps>(
	({ className, children, onSubmit, ...rest }, ref) => {
		const ctx = useChatContext();
		return (
			<form
				ref={ref}
				className={className}
				{...rest}
				onSubmit={(e) => {
					e.preventDefault();
					ctx.submit();
					onSubmit?.(e);
				}}>
				{children}
			</form>
		);
	},
);

Composer.displayName = 'Chat.Composer';

// ---------------------------------------------------------------------------
// Input (auto-grow textarea)
// ---------------------------------------------------------------------------

const Input = React.forwardRef<HTMLTextAreaElement, ChatInputProps>(
	({ submitOnEnter = true, autoResize = true, className, onKeyDown, onChange, ...rest }, ref) => {
		const ctx = useChatContext();
		const inputRef = useRef<HTMLTextAreaElement | null>(null);
		const mergedRef = useMergedRefs(inputRef, ref);

		useIsomorphicLayoutEffect(() => {
			if (!autoResize) return;
			const el = inputRef.current;
			if (!el) return;
			el.style.height = 'auto';
			el.style.height = `${el.scrollHeight}px`;
		}, [ctx.value, autoResize]);

		return (
			<textarea
				ref={mergedRef}
				value={ctx.value}
				disabled={ctx.disabled}
				aria-disabled={ctx.disabled || undefined}
				className={className}
				{...rest}
				onChange={(e) => {
					ctx.setValue(e.target.value);
					onChange?.(e);
				}}
				onKeyDown={(e) => {
					onKeyDown?.(e);
					if (e.defaultPrevented) return;
					if (submitOnEnter && e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
						e.preventDefault();
						ctx.submit();
					}
				}}
			/>
		);
	},
);

Input.displayName = 'Chat.Input';

// ---------------------------------------------------------------------------
// Send
// ---------------------------------------------------------------------------

const Send = React.forwardRef<HTMLButtonElement, ChatSendProps>(
	({ className, children, disabled, onClick, ...rest }, ref) => {
		const ctx = useChatContext();
		const isDisabled = disabled ?? (ctx.disabled || ctx.isStreaming || ctx.value.trim().length === 0);
		return (
			<button
				ref={ref}
				type='button'
				disabled={isDisabled}
				className={className}
				data-streaming={ctx.isStreaming ? '' : undefined}
				{...rest}
				onClick={(e) => {
					ctx.submit();
					onClick?.(e);
				}}>
				{children}
			</button>
		);
	},
);

Send.displayName = 'Chat.Send';

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

// Named exports expose the sub-components to Storybook's react-docgen (public API stays `Chat.*`).
export { Root, List, Message, Composer, Input, Send };
