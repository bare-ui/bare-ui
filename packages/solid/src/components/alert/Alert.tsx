import { createContext, createEffect, createSignal, Show, splitProps, useContext, type JSX } from 'solid-js';
import { createInteractiveState } from '@/primitives/create-interactive-state';
import { createTimeout } from '@/primitives/create-timeout';
import { mergeProps } from '@/utils/merge-props';
import type {
	AlertContextValue,
	AlertDescriptionProps,
	AlertDismissProps,
	AlertRootProps,
	AlertTitleProps,
} from './Alert.types';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const AlertContext = createContext<AlertContextValue | null>(null);

function useAlertContext(): AlertContextValue {
	const ctx = useContext(AlertContext);
	if (!ctx) {
		throw new Error('[wire-ui] Alert sub-components must be used inside <Alert.Root>');
	}
	return ctx;
}

// ---------------------------------------------------------------------------
// Alert.Root
// ---------------------------------------------------------------------------

/**
 * The container for the Alert. Manages dismissal state and exposes:
 * - `data-status` — for styling by status ('success', 'warning', 'danger', etc.)
 *
 * Renders nothing once dismissed.
 *
 * @example
 * <Alert.Root status="success" isAutoDismissable onDismiss={() => console.log('dismissed')}>
 *   <Alert.Title>Success!</Alert.Title>
 *   <Alert.Description>Your changes were saved.</Alert.Description>
 *   <Alert.Dismiss aria-label="Close" />
 * </Alert.Root>
 */
function Root(props: AlertRootProps) {
	const [local, rest] = splitProps(props, [
		'status',
		'isAutoDismissable',
		'dismissCountdown',
		'onDismiss',
		'children',
	]);

	const [dismissed, setDismissed] = createSignal(false);

	const dismiss = () => {
		setDismissed(true);
		local.onDismiss?.();
	};

	const { start, stop } = createTimeout(dismiss, () => local.dismissCountdown ?? 3000, { autoStart: false });
	createEffect(() => (local.isAutoDismissable ? start() : stop()));

	const ctxValue: AlertContextValue = {
		get status() {
			return local.status;
		},
		dismiss,
	};

	return (
		<Show when={!dismissed()}>
			<AlertContext.Provider value={ctxValue}>
				<div
					role='alert'
					data-status={local.status}
					{...rest}>
					{local.children}
				</div>
			</AlertContext.Provider>
		</Show>
	);
}

// ---------------------------------------------------------------------------
// Alert.Title
// ---------------------------------------------------------------------------

function Title(props: AlertTitleProps) {
	const [local, rest] = splitProps(props, ['children']);
	return (
		<p
			data-part='title'
			{...rest}>
			{local.children}
		</p>
	);
}

// ---------------------------------------------------------------------------
// Alert.Description
// ---------------------------------------------------------------------------

function Description(props: AlertDescriptionProps) {
	const [local, rest] = splitProps(props, ['children']);
	return (
		<p
			data-part='description'
			{...rest}>
			{local.children}
		</p>
	);
}

// ---------------------------------------------------------------------------
// Alert.Dismiss
// ---------------------------------------------------------------------------

/**
 * The dismiss button. Fires the Root's dismiss handler when clicked.
 * Tracks hover/focus-visible/active state via data attributes.
 */
function Dismiss(props: AlertDismissProps) {
	const [local, rest] = splitProps(props, ['children', 'onClick']);
	const ctx = useAlertContext();
	const state = createInteractiveState();

	// Compose consumer-provided handlers (in `rest`) with the interactive-state
	// handlers — both fire when an event triggers (consumer first, then ours).
	const merged = mergeProps(rest, state.handlers);

	const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
		ctx.dismiss();
		const userOnClick = local.onClick;
		if (typeof userOnClick === 'function') {
			(userOnClick as (event: typeof e) => void)(e);
		}
	};

	return (
		<button
			type='button'
			aria-label='Dismiss'
			{...state.dataAttributes}
			{...merged}
			onClick={handleClick}>
			{local.children}
		</button>
	);
}

// ---------------------------------------------------------------------------
// Compound export
// ---------------------------------------------------------------------------

export const Alert = {
	Root,
	Title,
	Description,
	Dismiss,
};

// Named exports expose the sub-components to Storybook's docgen (public API stays `Alert.*`).
export { Root, Title, Description, Dismiss };
