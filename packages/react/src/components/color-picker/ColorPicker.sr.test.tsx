/**
 * Screen-reader semantics for ColorPicker. Verifies the slider semantics each
 * color channel exposes — accessible name, value range / valuetext, and that the
 * announced value updates on keyboard input — plus the hex field's name and the
 * selected-swatch state a consumer models. Beyond axe's static check.
 */
import { describe, it, expect } from 'vitest';
import { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ColorPicker } from './ColorPicker';
import { expectExposedAs } from '@/test/sr';

function renderPicker(props: Partial<React.ComponentProps<typeof ColorPicker.Root>> = {}) {
	return render(
		<ColorPicker.Root
			defaultValue='#ff0000'
			{...props}>
			<ColorPicker.Area>
				<ColorPicker.AreaThumb />
			</ColorPicker.Area>
			<ColorPicker.Hue>
				<ColorPicker.HueThumb />
			</ColorPicker.Hue>
			<ColorPicker.Alpha>
				<ColorPicker.AlphaThumb />
			</ColorPicker.Alpha>
			<ColorPicker.Swatch />
			<ColorPicker.Input />
		</ColorPicker.Root>,
	);
}

describe('ColorPicker — screen reader semantics', () => {
	it('exposes each channel as a named slider', () => {
		renderPicker();
		expectExposedAs('slider', 'Saturation and brightness');
		expectExposedAs('slider', 'Hue');
		expectExposedAs('slider', 'Alpha');
	});

	it('announces the hue slider value within its 0–360 range', () => {
		renderPicker();
		const hue = screen.getByRole('slider', { name: 'Hue' });
		expect(hue).toHaveAttribute('aria-valuemin', '0');
		expect(hue).toHaveAttribute('aria-valuemax', '360');
		expect(hue).toHaveAttribute('aria-valuenow', '0'); // pure red
	});

	it('announces the alpha slider value within its 0–1 range', () => {
		renderPicker();
		const alpha = screen.getByRole('slider', { name: 'Alpha' });
		expect(alpha).toHaveAttribute('aria-valuemin', '0');
		expect(alpha).toHaveAttribute('aria-valuemax', '1');
		expect(alpha).toHaveAttribute('aria-valuenow', '1'); // fully opaque
	});

	it('gives the area slider a spoken valuetext for saturation + brightness', () => {
		renderPicker();
		const area = screen.getByRole('slider', { name: 'Saturation and brightness' });
		// Pure red = 100% saturation, 100% brightness.
		expect(area).toHaveAttribute('aria-valuetext', 'Saturation 100%, brightness 100%');
	});

	it('updates the announced hue value when the user presses an arrow key', () => {
		renderPicker();
		const hue = screen.getByRole('slider', { name: 'Hue' });
		fireEvent.keyDown(hue, { key: 'ArrowRight' });
		expect(hue).toHaveAttribute('aria-valuenow', '1');
	});

	it('updates the area valuetext announcement on arrow-key input', () => {
		renderPicker();
		const area = screen.getByRole('slider', { name: 'Saturation and brightness' });
		fireEvent.keyDown(area, { key: 'ArrowDown' });
		expect(area).toHaveAttribute('aria-valuetext', 'Saturation 100%, brightness 99%');
	});

	it('names the hex field for SR', () => {
		renderPicker();
		expectExposedAs('textbox', 'Hex color');
	});

	it('reflects swatch selection state when a consumer models presets', async () => {
		function Presets() {
			const [color, setColor] = useState('#ff0000');
			const swatches = ['#ff0000', '#00ff00'];
			return (
				<ColorPicker.Root
					value={color}
					onChange={setColor}>
					<ColorPicker.Swatch />
					{swatches.map((c) => (
						<button
							key={c}
							type='button'
							aria-label={`Use ${c}`}
							aria-pressed={color === c}
							onClick={() => setColor(c)}
						/>
					))}
				</ColorPicker.Root>
			);
		}
		render(<Presets />);
		const red = screen.getByRole('button', { name: 'Use #ff0000', pressed: true });
		const green = screen.getByRole('button', { name: 'Use #00ff00', pressed: false });
		expect(red).toBeInTheDocument();
		await userEvent.click(green);
		expect(screen.getByRole('button', { name: 'Use #00ff00' })).toHaveAttribute('aria-pressed', 'true');
		expect(screen.getByRole('button', { name: 'Use #ff0000' })).toHaveAttribute('aria-pressed', 'false');
	});
});
