'use client';

import { createContext, createEffect, createSignal, For, onCleanup, splitProps, useContext, type JSX } from 'solid-js';
import { createInteractiveState } from '@/primitives/create-interactive-state';
import { mergeProps } from '@/utils/merge-props';
import type {
	ToastCloseProps,
	ToastContextValue,
	ToastData,
	ToastDescriptionProps,
	ToastProviderProps,
	ToastRootProps,
	ToastStatus,
	ToastTitleProps,
	ToastViewportProps,
} from './Toast.types';

// ---------------------------------------------------------------------------
// Context + primitive
// ---------------------------------------------------------------------------

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
	const ctx = useContext(ToastContext);
	if (!ctx) throw new Error('useToast must be used within Toast.Provider');
	return {
		toast: ctx.add,
		dismiss: ctx.dismiss,
		get toasts() {
			return ctx.toasts;
		},
	};
}

let toastIdCounter = 0;
function makeId() {
	toastIdCounter += 1;
	return `toast-${Date.now().toString(36)}-${toastIdCounter}`;
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

function Provider(props: ToastProviderProps) {
	const [toasts, setToasts] = createSignal<ToastData[]>([]);

	const dismiss = (id: string) => {
		setToasts((prev) => prev.filter((t) => t.id !== id));
	};

	const add = (input: Omit<ToastData, 'id'> & { id?: string }) => {
		const id = input.id ?? makeId();
		setToasts((prev) => [...prev.filter((t) => t.id !== id), { ...input, id }]);
		return id;
	};

	const ctxValue: ToastContextValue = {
		get toasts() {
			return toasts();
		},
		add,
		dismiss,
		get defaultDuration() {
			return props.defaultDuration ?? 5000;
		},
	};

	return <ToastContext.Provider value={ctxValue}>{props.children}</ToastContext.Provider>;
}

// ---------------------------------------------------------------------------
// Viewport — renders the active toasts via render-prop
// ---------------------------------------------------------------------------

function Viewport(props: ToastViewportProps) {
	const [local, rest] = splitProps(props, ['children', 'class']);
	const ctx = useContext(ToastContext);
	if (!ctx) throw new Error('Toast.Viewport must be used within Toast.Provider');

	return (
		<div
			role='region'
			aria-label='Notifications'
			class={local.class}
			{...rest}>
			<For each={ctx.toasts}>
				{(t) => (
					<ToastShell
						toast={t}
						duration={t.duration ?? ctx.defaultDuration}
						onDismiss={() => ctx.dismiss(t.id)}>
						{local.children(t, () => ctx.dismiss(t.id))}
					</ToastShell>
				)}
			</For>
		</div>
	);
}

// ---------------------------------------------------------------------------
// Internal shell — manages auto-dismiss timer per toast
// ---------------------------------------------------------------------------

interface ToastShellProps {
	toast: ToastData;
	duration: number;
	onDismiss: () => void;
	children: JSX.Element;
}

function ToastShell(props: ToastShellProps) {
	let timer: ReturnType<typeof setTimeout> | null = null;
	// Capture initial duration; the createEffect below resets it when the prop
	// changes. Pause-on-hover mutates `remaining` independently of the prop.
	// eslint-disable-next-line solid/reactivity
	let remaining = props.duration;
	let startTime = Date.now();

	const clearTimer = () => {
		if (timer) {
			clearTimeout(timer);
			timer = null;
		}
	};

	const startTimer = () => {
		clearTimer();
		if (remaining <= 0) return;
		startTime = Date.now();
		timer = setTimeout(() => {
			props.onDismiss();
		}, remaining);
	};

	createEffect(() => {
		const d = props.duration;
		// Tracking toast id keeps the timer fresh if the same shell is reused for a different toast.
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		props.toast.id;
		if (d > 0) {
			remaining = d;
			startTimer();
		}
		onCleanup(clearTimer);
	});

	const pauseOnHover = () => props.toast.pauseOnHover !== false;

	const handleEnter = () => {
		if (!pauseOnHover()) return;
		clearTimer();
		remaining = remaining - (Date.now() - startTime);
	};

	const handleLeave = () => {
		if (!pauseOnHover()) return;
		startTimer();
	};

	return (
		<div
			role='status'
			aria-live='polite'
			data-status={props.toast.status ?? 'default'}
			onPointerEnter={handleEnter}
			onPointerLeave={handleLeave}
			onFocus={handleEnter}
			onBlur={handleLeave}>
			{props.children}
		</div>
	);
}

// ---------------------------------------------------------------------------
// Optional presentational subcomponents
// ---------------------------------------------------------------------------

function Root(props: ToastRootProps) {
	const [local, rest] = splitProps(props, ['children', 'class']);
	return (
		<div
			class={local.class}
			{...rest}>
			{local.children}
		</div>
	);
}

function Title(props: ToastTitleProps) {
	const [local, rest] = splitProps(props, ['children', 'class']);
	return (
		<div
			class={local.class}
			{...rest}>
			{local.children}
		</div>
	);
}

function Description(props: ToastDescriptionProps) {
	const [local, rest] = splitProps(props, ['children', 'class']);
	return (
		<div
			class={local.class}
			{...rest}>
			{local.children}
		</div>
	);
}

function Close(props: ToastCloseProps) {
	const [local, rest] = splitProps(props, ['children', 'class', 'onClick']);
	const state = createInteractiveState();
	const merged = mergeProps(rest, state.handlers);

	const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
		const userOnClick = local.onClick;
		if (typeof userOnClick === 'function') {
			(userOnClick as (event: typeof e) => void)(e);
		}
	};

	return (
		<button
			type='button'
			aria-label='Close notification'
			class={local.class}
			{...state.dataAttributes}
			{...merged}
			onClick={handleClick}>
			{local.children}
		</button>
	);
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const Toast = { Provider, Viewport, Root, Title, Description, Close };

export { Provider, Viewport, Root, Title, Description, Close };
export type { ToastStatus, ToastData };