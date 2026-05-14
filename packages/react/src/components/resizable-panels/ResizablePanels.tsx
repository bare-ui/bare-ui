import React, { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useId } from '@/hooks/use-id';
import { useMergedRefs } from '@/hooks/use-merged-refs';
import type {
	PanelConfig,
	PanelGroupContextValue,
	PanelGroupProps,
	PanelHandleProps,
	PanelProps,
} from './ResizablePanels.types';

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
// Context — extended with id-keyed APIs
// ---------------------------------------------------------------------------

interface InternalGroupContext {
	orientation: PanelGroupContextValue['orientation'];
	getPanelSize: (id: string) => number;
	getPanelIndex: (id: string) => number;
	registerPanel: (id: string, config: PanelConfig) => void;
	updatePanel: (id: string, config: PanelConfig) => void;
	unregisterPanel: (id: string) => void;
	registerHandle: (id: string) => void;
	unregisterHandle: (id: string) => void;
	getHandleIndex: (id: string) => number;
	startDrag: (handleId: string, pointer: { x: number; y: number }) => void;
}

const PanelGroupContext = createContext<InternalGroupContext | null>(null);

function useGroupContext() {
	const ctx = useContext(PanelGroupContext);
	if (!ctx) throw new globalThis.Error('Panel components must be used within ResizablePanels.Group');
	return ctx;
}

// ---------------------------------------------------------------------------
// Group
// ---------------------------------------------------------------------------

const Group = React.forwardRef<HTMLDivElement, PanelGroupProps>(
	(
		{
			orientation = 'horizontal',
			sizes: controlledSizes,
			defaultSizes,
			onSizesChange,
			className,
			children,
			style,
			...rest
		},
		ref,
	) => {
		const containerRef = useRef<HTMLDivElement | null>(null);
		const setMergedRef = useMergedRefs<HTMLDivElement>(containerRef, ref);

		// Stable mutable registries — survive re-renders without triggering effect loops.
		const panelsRef = useRef<PanelEntry[]>([]);
		const handlesRef = useRef<string[]>([]);

		// Bump to force re-render when registry mutates.
		const [registryVersion, setRegistryVersion] = useState(0);
		const bump = useCallback(() => setRegistryVersion((v) => v + 1), []);

		const [uncontrolled, setUncontrolled] = useState<number[]>(defaultSizes ?? []);
		const isControlled = controlledSizes !== undefined;

		// Compute the active sizes for the current panel count.
		const sizes = useMemo(() => {
			const panels = panelsRef.current;
			if (panels.length === 0) return [] as number[];
			if (isControlled && controlledSizes && controlledSizes.length === panels.length) {
				return controlledSizes;
			}
			if (!isControlled && uncontrolled.length === panels.length) {
				return uncontrolled;
			}
			// Fallback: distribute defaults until uncontrolled state catches up.
			return distributeRemaining(panels.map((p) => p.config));
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [registryVersion, isControlled, controlledSizes, uncontrolled]);

		// Sync uncontrolled state to panel count whenever the registry changes.
		useEffect(() => {
			if (isControlled) return;
			const panels = panelsRef.current;
			if (panels.length === 0) return;
			if (uncontrolled.length === panels.length) return;
			setUncontrolled(distributeRemaining(panels.map((p) => p.config)));
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [registryVersion, isControlled]);

		const setSizes = useCallback(
			(next: number[]) => {
				if (!isControlled) setUncontrolled(next);
				onSizesChange?.(next);
			},
			[isControlled, onSizesChange],
		);

		// --- Registry APIs (panels + handles) -----------------------------------
		const registerPanel = useCallback(
			(id: string, config: PanelConfig) => {
				if (panelsRef.current.some((p) => p.id === id)) return;
				panelsRef.current.push({ id, config });
				bump();
			},
			[bump],
		);

		const updatePanel = useCallback(
			(id: string, config: PanelConfig) => {
				const entry = panelsRef.current.find((p) => p.id === id);
				if (!entry) return;
				const same =
					entry.config.defaultSize === config.defaultSize &&
					entry.config.minSize === config.minSize &&
					entry.config.maxSize === config.maxSize;
				if (same) return;
				entry.config = config;
				bump();
			},
			[bump],
		);

		const unregisterPanel = useCallback(
			(id: string) => {
				const before = panelsRef.current.length;
				panelsRef.current = panelsRef.current.filter((p) => p.id !== id);
				if (panelsRef.current.length !== before) bump();
			},
			[bump],
		);

		const registerHandle = useCallback(
			(id: string) => {
				if (handlesRef.current.includes(id)) return;
				handlesRef.current.push(id);
				bump();
			},
			[bump],
		);

		const unregisterHandle = useCallback(
			(id: string) => {
				const before = handlesRef.current.length;
				handlesRef.current = handlesRef.current.filter((h) => h !== id);
				if (handlesRef.current.length !== before) bump();
			},
			[bump],
		);

		const getPanelIndex = useCallback((id: string) => panelsRef.current.findIndex((p) => p.id === id), []);
		const getHandleIndex = useCallback((id: string) => handlesRef.current.indexOf(id), []);
		const getPanelSize = useCallback(
			(id: string) => {
				const idx = panelsRef.current.findIndex((p) => p.id === id);
				if (idx < 0) return 0;
				return sizes[idx] ?? panelsRef.current[idx].config.defaultSize ?? 0;
			},
			[sizes],
		);

		// --- Drag handling ------------------------------------------------------
		const dragRef = useRef<{
			handleIndex: number;
			startSizes: number[];
			startPos: number;
			containerLength: number;
		} | null>(null);

		const startDrag = useCallback(
			(handleId: string, pointer: { x: number; y: number }) => {
				const rect = containerRef.current?.getBoundingClientRect();
				if (!rect) return;
				const handleIndex = handlesRef.current.indexOf(handleId);
				if (handleIndex < 0) return;
				const horizontal = orientation === 'horizontal';
				dragRef.current = {
					handleIndex,
					startSizes: sizes.slice(),
					startPos: horizontal ? pointer.x : pointer.y,
					containerLength: horizontal ? rect.width : rect.height,
				};
			},
			[orientation, sizes],
		);

		useEffect(() => {
			const handleMove = (e: PointerEvent) => {
				const drag = dragRef.current;
				if (!drag) return;
				const horizontal = orientation === 'horizontal';
				const currentPos = horizontal ? e.clientX : e.clientY;
				const deltaPx = currentPos - drag.startPos;
				const deltaPct = (deltaPx / drag.containerLength) * 100;

				// Handle index k sits between panel k and panel k+1.
				const aIdx = drag.handleIndex;
				const bIdx = drag.handleIndex + 1;
				const panels = panelsRef.current;
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
				dragRef.current = null;
			};
			window.addEventListener('pointermove', handleMove);
			window.addEventListener('pointerup', handleUp);
			window.addEventListener('pointercancel', handleUp);
			return () => {
				window.removeEventListener('pointermove', handleMove);
				window.removeEventListener('pointerup', handleUp);
				window.removeEventListener('pointercancel', handleUp);
			};
		}, [orientation, setSizes]);

		const ctx = useMemo<InternalGroupContext>(
			() => ({
				orientation,
				getPanelSize,
				getPanelIndex,
				registerPanel,
				updatePanel,
				unregisterPanel,
				registerHandle,
				unregisterHandle,
				getHandleIndex,
				startDrag,
			}),
			[
				orientation,
				getPanelSize,
				getPanelIndex,
				registerPanel,
				updatePanel,
				unregisterPanel,
				registerHandle,
				unregisterHandle,
				getHandleIndex,
				startDrag,
			],
		);

		const groupStyle: React.CSSProperties = {
			display: 'flex',
			flexDirection: orientation === 'horizontal' ? 'row' : 'column',
			width: '100%',
			height: '100%',
			...style,
		};

		return (
			<PanelGroupContext.Provider value={ctx}>
				<div
					ref={setMergedRef}
					data-orientation={orientation}
					className={className}
					style={groupStyle}
					{...rest}>
					{children}
				</div>
			</PanelGroupContext.Provider>
		);
	},
);
Group.displayName = 'ResizablePanels.Group';

// ---------------------------------------------------------------------------
// Panel — registers via stable id, reads its own size
// ---------------------------------------------------------------------------

const Panel = React.forwardRef<HTMLDivElement, PanelProps>(
	({ defaultSize, minSize, maxSize, children, className, style, ...rest }, ref) => {
		const ctx = useGroupContext();
		const id = useId('panel');
		const config = useMemo<PanelConfig>(
			() => ({ defaultSize, minSize, maxSize }),
			[defaultSize, minSize, maxSize],
		);

		// Register on mount; update when config changes; unregister on unmount.
		useLayoutEffect(() => {
			ctx.registerPanel(id, config);
			return () => ctx.unregisterPanel(id);
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [id]);

		useLayoutEffect(() => {
			ctx.updatePanel(id, config);
		}, [id, config, ctx]);

		const size = ctx.getPanelSize(id);
		// Until the panel is registered, fall back to defaultSize so first paint isn't blank.
		const effectiveSize = ctx.getPanelIndex(id) >= 0 ? size : defaultSize ?? 0;

		const sizeStyle: React.CSSProperties =
			ctx.orientation === 'horizontal'
				? { flexBasis: `${effectiveSize}%`, flexGrow: 0, flexShrink: 0, minWidth: 0, overflow: 'auto' }
				: { flexBasis: `${effectiveSize}%`, flexGrow: 0, flexShrink: 0, minHeight: 0, overflow: 'auto' };

		return (
			<div
				ref={ref}
				className={className}
				data-panel=''
				data-orientation={ctx.orientation}
				style={{ ...sizeStyle, ...style }}
				{...rest}>
				{children}
			</div>
		);
	},
);
Panel.displayName = 'ResizablePanels.Panel';

// ---------------------------------------------------------------------------
// Handle — registers via stable id, drag uses that id
// ---------------------------------------------------------------------------

interface InternalHandleProps extends PanelHandleProps {
	'aria-label'?: string;
}

const Handle = React.forwardRef<HTMLDivElement, InternalHandleProps>(
	({ disabled = false, className, style, onPointerDown, 'aria-label': ariaLabel, ...rest }, ref) => {
		const ctx = useGroupContext();
		const id = useId('panel-handle');

		useLayoutEffect(() => {
			ctx.registerHandle(id);
			return () => ctx.unregisterHandle(id);
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [id]);

		const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
			if (disabled) return;
			(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
			ctx.startDrag(id, { x: e.clientX, y: e.clientY });
			onPointerDown?.(e);
		};

		const cursor = ctx.orientation === 'horizontal' ? 'col-resize' : 'row-resize';

		return (
			<div
				ref={ref}
				role='separator'
				aria-orientation={ctx.orientation === 'horizontal' ? 'vertical' : 'horizontal'}
				aria-label={ariaLabel ?? 'Resize handle'}
				tabIndex={disabled ? -1 : 0}
				data-handle=''
				data-orientation={ctx.orientation}
				data-disabled={disabled ? '' : undefined}
				className={className}
				style={{ cursor: disabled ? 'default' : cursor, touchAction: 'none', flexShrink: 0, ...style }}
				onPointerDown={handlePointerDown}
				{...rest}
			/>
		);
	},
);
Handle.displayName = 'ResizablePanels.Handle';

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const ResizablePanels = { Group, Panel, Handle };
