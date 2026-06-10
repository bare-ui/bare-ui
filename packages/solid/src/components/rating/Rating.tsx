'use client';

import { createSignal, For, splitProps } from 'solid-js';
import { createControllableState } from '@/primitives/create-controllable-state';
import { getDirection } from '@/primitives/create-direction';
import { useWireUI } from '@/context/wire-ui-context';
import type { RatingProps } from './Rating.types';

// ---------------------------------------------------------------------------
// Star SVG
// ---------------------------------------------------------------------------

const StarIcon = () => (
	<svg
		viewBox='0 0 20 20'
		fill='currentColor'
		aria-hidden='true'
		class='size-full'>
		<path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
	</svg>
);

// ---------------------------------------------------------------------------
// Rating
// ---------------------------------------------------------------------------

/**
 * A headless n-star rating widget.
 *
 * State is exposed via data attributes on each star button:
 *   data-filled      — star is at or below the selected value
 *   data-highlighted — star is at or below the current hover/selected value
 *   data-disabled    — component is disabled
 *
 * Style freely via `starClass` and `[data-*]:` Tailwind variants.
 *
 * @example
 * <Rating
 *   defaultValue={3}
 *   onChange={(v) => console.log(v)}
 *   starClass="size-6 text-gray-300 [data-highlighted]:text-yellow-400 [data-filled]:text-yellow-400"
 * />
 */
function Rating(props: RatingProps) {
	const [local, rest] = splitProps(props, [
		'value',
		'defaultValue',
		'onChange',
		'max',
		'disabled',
		'readOnly',
		'class',
		'starClass',
	]);

	const [selectedValue, setSelectedValue] = createControllableState<number>({
		get value() {
			return local.value;
		},
		defaultValue: local.defaultValue ?? 0,
		get onChange() {
			return local.onChange;
		},
	});
	const [hoverValue, setHoverValue] = createSignal(0);
	const wire = useWireUI();

	const displayValue = () => hoverValue() || selectedValue();
	const max = () => local.max ?? 5;
	const disabled = () => !!local.disabled;
	const readOnly = () => !!local.readOnly;
	const interactive = () => !disabled() && !readOnly();

	// Roving tabindex: the group is a single tab stop. The selected star (or the
	// first when nothing is selected) is the one tabbable star; arrow keys then
	// move focus and selection between stars.
	const tabbableStar = () => (selectedValue() >= 1 ? selectedValue() : 1);

	const handleSelect = (star: number) => {
		if (!interactive()) return;
		setSelectedValue(star);
	};

	const handleKeyDown = (e: KeyboardEvent & { currentTarget: HTMLButtonElement }, star: number) => {
		if (!interactive()) return;
		// RTL mirrors the horizontal arrows; vertical arrows are unaffected.
		const rtl = getDirection(e.currentTarget) === 'rtl';
		const incKey = rtl ? 'ArrowLeft' : 'ArrowRight';
		const decKey = rtl ? 'ArrowRight' : 'ArrowLeft';
		let next: number | null = null;
		if (e.key === incKey || e.key === 'ArrowUp') next = Math.min(max(), star + 1);
		else if (e.key === decKey || e.key === 'ArrowDown') next = Math.max(1, star - 1);
		else if (e.key === 'Home') next = 1;
		else if (e.key === 'End') next = max();
		if (next === null) return;
		e.preventDefault();
		setSelectedValue(next);
		// Move focus to the star the arrow keys landed on (roving tabindex).
		const buttons = e.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('button');
		buttons?.[next - 1]?.focus();
	};

	const stars = () => Array.from({ length: max() }, (_, i) => i + 1);

	return (
		<div
			class={local.class}
			role={readOnly() ? 'img' : 'group'}
			aria-label={
					readOnly() ? wire.messages.rating.valueText(selectedValue(), max()) : wire.messages.rating.label
				}
			data-disabled={disabled() ? '' : undefined}
			data-readonly={readOnly() ? '' : undefined}
			{...rest}>
			<For each={stars()}>
				{(star) => (
					<button
						type='button'
						disabled={disabled() || readOnly()}
						// Roving tabindex: only one star is tabbable; arrows move between them.
						tabIndex={readOnly() ? -1 : star === tabbableStar() ? 0 : -1}
						class={local.starClass}
						aria-pressed={readOnly() ? undefined : star <= selectedValue()}
						data-filled={star <= selectedValue() ? '' : undefined}
						data-highlighted={star <= displayValue() ? '' : undefined}
						data-disabled={disabled() ? '' : undefined}
						aria-label={wire.messages.rating.starText(star, max())}
						onClick={() => handleSelect(star)}
						onKeyDown={(e) => handleKeyDown(e, star)}
						onMouseEnter={() => {
							if (interactive()) setHoverValue(star);
						}}
						onMouseLeave={() => setHoverValue(0)}>
						<StarIcon />
					</button>
				)}
			</For>
		</div>
	);
}

export { Rating };