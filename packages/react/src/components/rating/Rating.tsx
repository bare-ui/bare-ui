'use client';

import React, { useState } from 'react';
import { useControllableState } from '@/hooks/use-controllable-state';
import type { RatingProps } from './Rating.types';

// ---------------------------------------------------------------------------
// Star SVG
// ---------------------------------------------------------------------------

const StarIcon = () => (
	<svg
		viewBox='0 0 20 20'
		fill='currentColor'
		aria-hidden='true'
		className='size-full'>
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
 * Style freely via `starClassName` and `[data-*]:` Tailwind variants.
 *
 * @example
 * <Rating
 *   defaultValue={3}
 *   onChange={(v) => console.log(v)}
 *   starClassName="size-6 text-gray-300 [data-highlighted]:text-yellow-400 [data-filled]:text-yellow-400"
 * />
 */
const Rating = React.forwardRef<HTMLDivElement, RatingProps>(
	(
		{
			value: controlledValue,
			defaultValue = 0,
			onChange,
			max = 5,
			disabled = false,
			readOnly = false,
			className,
			starClassName,
			...rest
		},
		ref,
	) => {
		const [selectedValue, setSelectedValue] = useControllableState<number>({
			value: controlledValue,
			defaultValue,
			onChange,
		});
		const [hoverValue, setHoverValue] = useState(0);

		const displayValue = hoverValue || selectedValue;
		const interactive = !disabled && !readOnly;

		// Roving tabindex: the group is a single tab stop. The selected star (or the
		// first when nothing is selected) is the one tabbable star; arrow keys then
		// move focus and selection between stars.
		const tabbableStar = selectedValue >= 1 ? selectedValue : 1;

		const handleSelect = (star: number) => {
			if (!interactive) return;
			setSelectedValue(star);
		};

		const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, star: number) => {
			if (!interactive) return;
			let next: number | null = null;
			switch (e.key) {
				case 'ArrowRight':
				case 'ArrowUp':
					next = Math.min(max, star + 1);
					break;
				case 'ArrowLeft':
				case 'ArrowDown':
					next = Math.max(1, star - 1);
					break;
				case 'Home':
					next = 1;
					break;
				case 'End':
					next = max;
					break;
			}
			if (next === null) return;
			e.preventDefault();
			setSelectedValue(next);
			// Move focus to the star the arrow keys landed on (roving tabindex).
			const buttons = e.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('button');
			buttons?.[next - 1]?.focus();
		};

		return (
			<div
				ref={ref}
				className={className}
				role={readOnly ? 'img' : 'group'}
				aria-label={readOnly ? `Rating: ${selectedValue} out of ${max}` : 'Rating'}
				data-disabled={disabled ? '' : undefined}
				data-readonly={readOnly ? '' : undefined}
				{...rest}>
				{Array.from({ length: max }, (_, i) => i + 1).map((star) => (
					<button
						key={star}
						type='button'
						disabled={disabled || readOnly}
						// Roving tabindex: only one star is tabbable; arrows move between them.
						tabIndex={readOnly ? -1 : star === tabbableStar ? 0 : -1}
						className={starClassName}
						aria-pressed={readOnly ? undefined : star <= selectedValue}
						data-filled={star <= selectedValue ? '' : undefined}
						data-highlighted={star <= displayValue ? '' : undefined}
						data-disabled={disabled ? '' : undefined}
						aria-label={`${star} out of ${max} stars`}
						onClick={() => handleSelect(star)}
						onKeyDown={(e) => handleKeyDown(e, star)}
						onMouseEnter={() => {
							if (interactive) setHoverValue(star);
						}}
						onMouseLeave={() => setHoverValue(0)}>
						<StarIcon />
					</button>
				))}
			</div>
		);
	},
);

Rating.displayName = 'Rating';

export { Rating };
