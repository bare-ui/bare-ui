import {
	createContext,
	createEffect,
	createMemo,
	createSignal,
	onCleanup,
	onMount,
	splitProps,
	useContext,
	type JSX,
} from 'solid-js';
import { createId } from '@/primitives/create-id';
import { createMergedRefs } from '@/primitives/create-merged-refs';
import type { PanelConfig, PanelGroupProps, PanelHandleProps, PanelOrientation, PanelProps } from './ResizablePanels.types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function clamp(v: number, min: number, max: number) {
	return Math.min(Math.max(v, min), max);
}

function distributeRemaining(configs: PanelConfig[]): number[] {
	const explicit = configs.map((p) => p.defaultSize);
	const known = explicit.filter((s): s is number => typeof s === 'number');
	const knownSum = known.reduce((a, b) => a + b, 0);
	const remaining = Math.max(0, 100 - knownSum);
	const unknownCount = configs.length - known.length;
	const evenShare = unknownCount > 0 ? remaining / unknownCount : 0;
	return explicit.map((s) => (typeof s === 'number' ? s : evenShare));
}

interface PanelEntry {
	id: string;
	config: PanelConfig;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface InternalGroupContext {
	readonly orientation: PanelOrientation;
	getPanelSize: (id: string) => number;
	getPanelIndex: (id: string) => number;
	registerPanel: (id: string, config: PanelConfig) => void;
	updatePanel: (id: string, config: PanelConfig) => void;
	unregisterPanel: (id: string) => void;
	registerHandle: (id: string) => void;
	unregisterHandle: (id: string) => void;
	getHandleIndex: (id: string) => number;
	getHandleValues: (id: string) => { now: number; min: number; max: number } | null;
	startDrag: (handleId: string, pointer: { x: number; y: number }) => void;
}

const PanelGroupContext = createContext<InternalGroupContext | null>(null);

function useGroupContext() {
	const ctx = useContext(PanelGroupContext);
	if (!ctx) throw new Error('Panel components must be used within ResizablePanels.Group');
	return ctx;
}

// ---------------------------------------------------------------------------
// Group
// ---------------------------------------------------------------------------

function Group(props: PanelGroupProps) {
	const [local, rest] = splitProps(props, [
		'orientation',
		'sizes',
		'defaultSizes',
		'onSizesChange',
		'class',
		'children',
		'style',
		'ref',
	]);

	const orientation = (): PanelOrientation => local.orientation ?? 'horizontal';

	let containerEl: HTMLDivElement | undefined;
	const mergedRef = createMergedRefs<HTMLDivElement>(
		(el) => (containerEl = el),
		(el) => (local.ref as ((el: HTMLDivElement) => void) | undefined)?.(el),
	);

	// Stable mutable registries — survive re-renders without triggering effect loops.
	const panels: PanelEntry[] = [];
	const handles: string[] = [];

	// Bump to force memo re-eval when registry mutates.
	const [registryVersion, setRegistryVersion] = createSignal(0);
	const bump = () => setRegistryVersion((v) => v + 1);

	const [uncontrolled, setUncontrolled] = createSignal<number[]>(local.defaultSizes ?? []);
	const isControlled = () => local.sizes !== undefined;

	// Compute the active sizes for the current panel count.
	const sizes = createMemo(() => {
		registryVersion(); // track
		if (panels.length === 0) return [] as number[];
		if (isControlled() && local.sizes && local.sizes.length === panels.length) {
			return local.sizes;
		}
		const unc = uncontrolled();
		if (!isControlled() && unc.length === panels.length) return unc;
		return distributeRemaining(panels.map((p) => p.config));
	});

	// Sync uncontrolled state to panel count whenever the registry changes.
	createEffect(() => {
		registryVersion(); // track
		if (isControlled()) return;
		if (panels.length === 0) return;
		if (uncontrolled().length === panels.length) return;
		setUncontrolled(distributeRemaining(panels.map((p) => p.config)));
	});

	const setSizes = (next: number[]) => {
		if (!isControlled()) setUncontrolled(next);
		local.onSizesChange?.(next);
	};

	// --- Registry APIs ----------------------------------------------------
	const registerPanel = (id: string, config: PanelConfig) => {
		if (panels.some((p) => p.id === id)) return;
		panels.push({ id, config });
		bump();
	};
	const updatePanel = (id: string, config: PanelConfig) => {
		const entry = panels.find((p) => p.id === id);
		if (!entry) return;
		const same =
			entry.config.defaultSize === config.defaultSize &&
			entry.config.minSize === config.minSize &&
			entry.config.maxSize === config.maxSize;
		if (same) return;
		entry.config = config;
		bump();
	};
	const unregisterPanel = (id: string) => {
		const before = panels.length;
		const idx = panels.findIndex((p) => p.id === id);
		if (idx >= 0) panels.splice(idx, 1);
		if (panels.length !== before) bump();
	};
	const registerHandle = (id: string) => {
		if (handles.includes(id)) return;
		handles.push(id);
		bump();
	};
	const unregisterHandle = (id: string) => {
		const before = handles.length;
		const idx = handles.indexOf(id);
		if (idx >= 0) handles.splice(idx, 1);
		if (handles.length !== before) bump();
	};

	// `panels` is a plain array; reads inside these helpers aren't tracked
	// directly. Reading `registryVersion()` in the index helpers makes consumers
	// (Panel's style effect) re-run when panels register/unregister, picking up
	// the new index without needing a separate signal per panel.
	const getPanelIndex = (id: string) => {
		registryVersion();
		return panels.findIndex((p) => p.id === id);
	};
	const getHandleIndex = (id: string) => {
		registryVersion();
		return handles.indexOf(id);
	};
	// Always read `sizes()` first so callers subscribe even when the panel
	// isn't registered yet (idx < 0 at first render, before onMount). Otherwise
	// the initial Panel style effect would short-circuit before touching the
	// signal and never re-run when the user drags.
	const getPanelSize = (id: string) => {
		const allSizes = sizes();
		const idx = panels.findIndex((p) => p.id === id);
		if (idx < 0) return 0;
		return allSizes[idx] ?? panels[idx].config.defaultSize ?? 0;
	};

	// A handle at index k controls the boundary between panel k and panel k+1.
	// Per the ARIA window-splitter pattern, expose the *primary* (preceding) panel's
	// current/min/max size as aria-valuenow/min/max so AT can announce the split.
	// Read `sizes()` first so consumers (the Handle) subscribe and re-run on drag.
	const getHandleValues = (id: string) => {
		const allSizes = sizes();
		const handleIndex = handles.indexOf(id);
		if (handleIndex < 0) return null;
		const panel = panels[handleIndex];
		if (!panel) return null;
		const now = allSizes[handleIndex] ?? panel.config.defaultSize ?? 0;
		const min = panel.config.minSize ?? 0;
		const max = panel.config.maxSize ?? 100;
		return { now: Math.round(now), min: Math.round(min), max: Math.round(max) };
	};

	// --- Drag handling ----------------------------------------------------
	let dragState: {
		handleIndex: number;
		startSizes: number[];
		startPos: number;
		containerLength: number;
	} | null = null;

	const startDrag = (handleId: string, pointer: { x: number; y: number }) => {
		const rect = containerEl?.getBoundingClientRect();
		if (!rect) return;
		const handleIndex = handles.indexOf(handleId);
		if (handleIndex < 0) return;
		const horizontal = orientation() === 'horizontal';
		dragState = {
			handleIndex,
			startSizes: sizes().slice(),
			startPos: horizontal ? pointer.x : pointer.y,
			containerLength: horizontal ? rect.width : rect.height,
		};
	};

	createEffect(() => {
		const handleMove = (e: PointerEvent) => {
			const drag = dragState;
			if (!drag) return;
			const horizontal = orientation() === 'horizontal';
			const currentPos = horizontal ? e.clientX : e.clientY;
			const deltaPx = currentPos - drag.startPos;
			const deltaPct = (deltaPx / drag.containerLength) * 100;

			const aIdx = drag.handleIndex;
			const bIdx = drag.handleIndex + 1;
			if (aIdx < 0 || bIdx >= drag.startSizes.length || bIdx >= panels.length) return;

			const aCfg = panels[aIdx].config;
			const bCfg = panels[bIdx].config;
			const aMin = aCfg.minSize ?? 0;
			const aMax = aCfg.maxSize ?? 100;
			const bMin = bCfg.minSize ?? 0;
			const bMax = bCfg.maxSize ?? 100;

			const next = drag.startSizes.slice();
			let newA = clamp(next[aIdx] + deltaPct, aMin, aMax);
			let newB = next[bIdx] - (newA - next[aIdx]);
			if (newB < bMin) {
				newB = bMin;
				newA = next[aIdx] + (next[bIdx] - newB);
			} else if (newB > bMax) {
				newB = bMax;
				newA = next[aIdx] + (next[bIdx] - newB);
			}
			next[aIdx] = newA;
			next[bIdx] = newB;
			setSizes(next);
		};
		const handleUp = () => {
			dragState = null;
		};
		window.addEventListener('pointermove', handleMove);
		window.addEventListener('pointerup', handleUp);
		window.addEventListener('pointercancel', handleUp);
		onCleanup(() => {
			window.removeEventListener('pointermove', handleMove);
			window.removeEventListener('pointerup', handleUp);
			window.removeEventListener('pointercancel', handleUp);
		});
	});

	const ctxValue: InternalGroupContext = {
		get orientation() {
			return orientation();
		},
		getPanelSize,
		getPanelIndex,
		registerPanel,
		updatePanel,
		unregisterPanel,
		registerHandle,
		unregisterHandle,
		getHandleIndex,
		getHandleValues,
		startDrag,
	};

	const mergedStyle = (): JSX.CSSProperties | string | undefined => {
		const ours: JSX.CSSProperties = {
			display: 'flex',
			'flex-direction': orientation() === 'horizontal' ? 'row' : 'column',
			width: '100%',
			height: '100%',
		};
		const user = local.style;
		if (typeof user === 'string' || !user) return ours;
		return { ...ours, ...(user as JSX.CSSProperties) };
	};

	return (
		<PanelGroupContext.Provider value={ctxValue}>
			<div
				ref={mergedRef}
				data-orientation={orientation()}
				class={local.class}
				style={mergedStyle()}
				{...rest}>
				{local.children}
			</div>
		</PanelGroupContext.Provider>
	);
}

// ---------------------------------------------------------------------------
// Panel
// ---------------------------------------------------------------------------

function Panel(props: PanelProps) {
	const [local, rest] = splitProps(props, ['defaultSize', 'minSize', 'maxSize', 'children', 'class', 'style']);
	const ctx = useGroupContext();
	const id = createId();

	const config = createMemo<PanelConfig>(() => ({
		defaultSize: local.defaultSize,
		minSize: local.minSize,
		maxSize: local.maxSize,
	}));

	onMount(() => {
		ctx.registerPanel(id, config());
		onCleanup(() => ctx.unregisterPanel(id));
	});

	createEffect(() => {
		ctx.updatePanel(id, config());
	});

	const effectiveSize = () => {
		// Call getPanelSize unconditionally so the surrounding render effect
		// subscribes to the group's sizes signal even at first paint, before
		// onMount has registered this panel.
		const fromGroup = ctx.getPanelSize(id);
		const idx = ctx.getPanelIndex(id);
		return idx >= 0 ? fromGroup : (local.defaultSize ?? 0);
	};

	const sizeStyle = (): JSX.CSSProperties =>
		ctx.orientation === 'horizontal'
			? {
					'flex-basis': `${effectiveSize()}%`,
					'flex-grow': 0,
					'flex-shrink': 0,
					'min-width': 0,
					overflow: 'auto',
				}
			: {
					'flex-basis': `${effectiveSize()}%`,
					'flex-grow': 0,
					'flex-shrink': 0,
					'min-height': 0,
					overflow: 'auto',
				};

	const mergedStyle = (): JSX.CSSProperties | string | undefined => {
		const ours = sizeStyle();
		const user = local.style;
		if (typeof user === 'string' || !user) return ours;
		return { ...ours, ...(user as JSX.CSSProperties) };
	};

	return (
		<div
			class={local.class}
			data-panel=''
			data-orientation={ctx.orientation}
			style={mergedStyle()}
			{...rest}>
			{local.children}
		</div>
	);
}

// ---------------------------------------------------------------------------
// Handle
// ---------------------------------------------------------------------------

function Handle(props: PanelHandleProps & { 'aria-label'?: string }) {
	const [local, rest] = splitProps(props, ['disabled', 'class', 'style', 'onPointerDown', 'aria-label']);
	const ctx = useGroupContext();
	const id = createId();

	onMount(() => {
		ctx.registerHandle(id);
		onCleanup(() => ctx.unregisterHandle(id));
	});

	const handlePointerDown: JSX.EventHandler<HTMLDivElement, PointerEvent> = (e) => {
		if (local.disabled) return;
		(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
		ctx.startDrag(id, { x: e.clientX, y: e.clientY });
		const userOnPointerDown = local.onPointerDown;
		if (typeof userOnPointerDown === 'function') {
			(userOnPointerDown as (event: typeof e) => void)(e);
		}
	};

	const cursor = () => (ctx.orientation === 'horizontal' ? 'col-resize' : 'row-resize');

	// A focusable role="separator" is a window splitter and REQUIRES aria-valuenow.
	const values = () => ctx.getHandleValues(id);

	const mergedStyle = (): JSX.CSSProperties | string | undefined => {
		const ours: JSX.CSSProperties = {
			cursor: local.disabled ? 'default' : cursor(),
			'touch-action': 'none',
			'flex-shrink': 0,
		};
		const user = local.style;
		if (typeof user === 'string' || !user) return ours;
		return { ...ours, ...(user as JSX.CSSProperties) };
	};

	return (
		<div
			role='separator'
			aria-orientation={ctx.orientation === 'horizontal' ? 'vertical' : 'horizontal'}
			aria-label={local['aria-label'] ?? 'Resize handle'}
			aria-valuenow={values()?.now}
			aria-valuemin={values()?.min}
			aria-valuemax={values()?.max}
			tabIndex={local.disabled ? -1 : 0}
			data-handle=''
			data-orientation={ctx.orientation}
			data-disabled={local.disabled ? '' : undefined}
			class={local.class}
			style={mergedStyle()}
			onPointerDown={handlePointerDown}
			{...rest}
		/>
	);
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const ResizablePanels = { Group, Panel, Handle };

export { Group, Panel, Handle };
