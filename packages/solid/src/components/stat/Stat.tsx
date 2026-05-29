import { mergeProps, Show, splitProps } from 'solid-js';
import type {
	StatDeltaProps,
	StatDirection,
	StatHelpTextProps,
	StatLabelProps,
	StatRootProps,
	StatSparklineProps,
	StatValueProps,
} from './Stat.types';

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

function Root(props: StatRootProps) {
	const [local, rest] = splitProps(props, ['class', 'children']);

	return (
		<div
			role='group'
			class={local.class}
			{...rest}>
			{local.children}
		</div>
	);
}

// ---------------------------------------------------------------------------
// Label
// ---------------------------------------------------------------------------

function Label(props: StatLabelProps) {
	const [local, rest] = splitProps(props, ['class', 'children']);

	return (
		<span
			class={local.class}
			{...rest}>
			{local.children}
		</span>
	);
}

// ---------------------------------------------------------------------------
// Value
// ---------------------------------------------------------------------------

function Value(props: StatValueProps) {
	const [local, rest] = splitProps(props, ['class', 'children']);

	return (
		<span
			class={local.class}
			{...rest}>
			{local.children}
		</span>
	);
}

// ---------------------------------------------------------------------------
// Delta
// ---------------------------------------------------------------------------

function resolveDirection(value: number | undefined, direction: StatDirection | undefined): StatDirection {
	if (direction) return direction;
	if (value === undefined) return 'neutral';
	if (value > 0) return 'increase';
	if (value < 0) return 'decrease';
	return 'neutral';
}

function Delta(props: StatDeltaProps) {
	const [local, rest] = splitProps(props, ['value', 'direction', 'class', 'children']);

	const resolved = () => resolveDirection(local.value, local.direction);

	return (
		<span
			class={local.class}
			data-direction={resolved()}
			{...rest}>
			{local.children ?? (local.value !== undefined ? local.value : null)}
		</span>
	);
}

// ---------------------------------------------------------------------------
// HelpText
// ---------------------------------------------------------------------------

function HelpText(props: StatHelpTextProps) {
	const [local, rest] = splitProps(props, ['class', 'children']);

	return (
		<span
			class={local.class}
			{...rest}>
			{local.children}
		</span>
	);
}

// ---------------------------------------------------------------------------
// Sparkline
// ---------------------------------------------------------------------------

function Sparkline(props: StatSparklineProps) {
	const merged = mergeProps({ width: 100, height: 24, strokeWidth: 1.5 }, props);
	const [local, rest] = splitProps(merged, ['data', 'width', 'height', 'strokeWidth', 'class']);

	const points = () => {
		const data = local.data;
		const width = local.width;
		const height = local.height;
		const strokeWidth = local.strokeWidth;

		const min = Math.min(...data);
		const max = Math.max(...data);
		const span = max - min;
		const stepX = width / (data.length - 1);
		// Inset by half the stroke so the line never clips at the edges.
		const pad = strokeWidth / 2;
		const usableHeight = height - strokeWidth;

		return data
			.map((v, i) => {
				const x = i * stepX;
				const y = span === 0 ? height / 2 : pad + usableHeight - ((v - min) / span) * usableHeight;
				return `${x.toFixed(2)},${y.toFixed(2)}`;
			})
			.join(' ');
	};

	return (
		<Show when={local.data.length >= 2}>
			<svg
				viewBox={`0 0 ${local.width} ${local.height}`}
				width={local.width}
				height={local.height}
				preserveAspectRatio='none'
				aria-hidden='true'
				class={local.class}
				{...rest}>
				<polyline
					points={points()}
					fill='none'
					stroke='currentColor'
					stroke-width={local.strokeWidth}
					stroke-linecap='round'
					stroke-linejoin='round'
				/>
			</svg>
		</Show>
	);
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const Stat = {
	Root,
	Label,
	Value,
	Delta,
	HelpText,
	Sparkline,
};

export { Root, Label, Value, Delta, HelpText, Sparkline };
