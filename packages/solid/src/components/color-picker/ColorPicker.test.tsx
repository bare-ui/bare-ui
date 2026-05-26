import { describe, it, expect, vi } from 'vitest';
import { createSignal, type JSX } from 'solid-js';
import { fireEvent, render, screen } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { ColorPicker } from './ColorPicker';
import { hexToHsva, hsvaToHex } from './color-utils';

describe('color-utils', () => {
	it('round-trips primary colors through hex → hsva → hex', () => {
		for (const hex of ['#ff0000', '#00ff00', '#0000ff', '#ffffff', '#000000', '#123456']) {
			expect(hsvaToHex(hexToHsva(hex)!)).toBe(hex);
		}
	});

	it('parses shorthand and alpha hex', () => {
		expect(hsvaToHex(hexToHsva('#f00')!)).toBe('#ff0000');
		expect(hsvaToHex(hexToHsva('#ff000080')!)).toBe('#ff000080');
	});

	it('returns null for invalid hex', () => {
		expect(hexToHsva('nope')).toBeNull();
		expect(hexToHsva('#12')).toBeNull();
	});
});

function renderPicker(
	props: {
		value?: string;
		defaultValue?: string;
		onChange?: (hex: string) => void;
	} = {},
) {
	return render(() => (
		<ColorPicker.Root
			defaultValue='#ff0000'
			{...props}>
			<ColorPicker.Area data-testid='area'>
				<ColorPicker.AreaThumb data-testid='area-thumb' />
			</ColorPicker.Area>
			<ColorPicker.Hue data-testid='hue'>
				<ColorPicker.HueThumb data-testid='hue-thumb' />
			</ColorPicker.Hue>
			<ColorPicker.Alpha data-testid='alpha'>
				<ColorPicker.AlphaThumb />
			</ColorPicker.Alpha>
			<ColorPicker.Swatch data-testid='swatch' />
			<ColorPicker.Input />
		</ColorPicker.Root>
	));
}

describe('ColorPicker', () => {
	it('reflects the default color in the swatch and input', () => {
		renderPicker();
		expect(screen.getByTestId('swatch').style.backgroundColor).toBe('rgb(255, 0, 0)');
		expect(screen.getByLabelText('Hex color')).toHaveValue('#ff0000');
	});

	it('positions the area thumb from saturation/value', () => {
		renderPicker();
		const thumb = screen.getByTestId('area-thumb');
		// red = full saturation + value
		expect(thumb.style.left).toBe('100%');
		expect(thumb.style.top).toBe('0%');
	});

	it('updates color when dragging in the area', () => {
		const onChange = vi.fn();
		renderPicker({ onChange });
		const area = screen.getByTestId('area');
		area.getBoundingClientRect = () => ({ left: 0, top: 0, width: 100, height: 100 }) as DOMRect;
		fireEvent.pointerDown(area, { clientX: 50, clientY: 50 });
		expect(onChange).toHaveBeenCalled();
	});

	it('changes hue with arrow keys', () => {
		const onChange = vi.fn();
		renderPicker({ onChange });
		const hue = screen.getByTestId('hue');
		fireEvent.keyDown(hue, { key: 'ArrowRight' });
		expect(onChange).toHaveBeenCalled();
		expect(hue).toHaveAttribute('aria-valuenow', '1');
	});

	it('adjusts alpha and emits an 8-digit hex', () => {
		const onChange = vi.fn();
		renderPicker({ onChange });
		const alpha = screen.getByTestId('alpha');
		alpha.getBoundingClientRect = () => ({ left: 0, top: 0, width: 100, height: 10 }) as DOMRect;
		fireEvent.pointerDown(alpha, { clientX: 50, clientY: 5 });
		expect(onChange).toHaveBeenCalled();
		const lastCall = onChange.mock.calls.at(-1)![0] as string;
		expect(lastCall.length).toBe(9); // #rrggbbaa
	});

	it('commits a typed hex value', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		renderPicker({ onChange });
		const input = screen.getByLabelText('Hex color');
		await user.clear(input);
		await user.type(input, '#00ff00');
		expect(onChange).toHaveBeenCalledWith('#00ff00');
	});

	it('ignores invalid typed hex', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		renderPicker({ onChange });
		const input = screen.getByLabelText('Hex color');
		await user.clear(input);
		await user.type(input, 'zzz');
		expect(onChange).not.toHaveBeenCalled();
	});

	it('supports controlled value', () => {
		const [value, setValue] = createSignal('#ff0000');
		render(() => (
			<ColorPicker.Root value={value()}>
				<ColorPicker.Swatch data-testid='swatch' />
			</ColorPicker.Root>
		));
		expect(screen.getByTestId('swatch').style.backgroundColor).toBe('rgb(255, 0, 0)');
		setValue('#0000ff');
		expect(screen.getByTestId('swatch').style.backgroundColor).toBe('rgb(0, 0, 255)');
	});

	it('throws when a part is used outside Root', () => {
		const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
		expect(() => render(() => (<ColorPicker.Swatch />) as unknown as JSX.Element)).toThrow(/ColorPicker.Root/);
		spy.mockRestore();
	});
});
