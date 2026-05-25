import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/vue';
import { h, defineComponent, ref, nextTick } from 'vue';
import { ColorPicker } from '.';
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

function renderPicker(props: { defaultValue?: string; value?: string; onChange?: (hex: string) => void } = {}) {
	return render({
		setup() {
			return () =>
				h(
					ColorPicker.Root,
					{ defaultValue: '#ff0000', ...props },
					() => [
						h(ColorPicker.Area, { 'data-testid': 'area' }, () =>
							h(ColorPicker.AreaThumb, { 'data-testid': 'area-thumb' }),
						),
						h(ColorPicker.Hue, { 'data-testid': 'hue' }, () =>
							h(ColorPicker.HueThumb, { 'data-testid': 'hue-thumb' }),
						),
						h(ColorPicker.Alpha, { 'data-testid': 'alpha' }, () =>
							h(ColorPicker.AlphaThumb, {}),
						),
						h(ColorPicker.Swatch, { 'data-testid': 'swatch' }),
						h(ColorPicker.Input, {}),
					],
				);
		},
	});
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
		area.getBoundingClientRect = () => ({ left: 0, top: 0, width: 100, height: 100, right: 100, bottom: 100, x: 0, y: 0, toJSON: () => {} });
		fireEvent.pointerDown(area, { clientX: 50, clientY: 50 });
		expect(onChange).toHaveBeenCalled();
	});

	it('changes hue with arrow keys', async () => {
		const onChange = vi.fn();
		renderPicker({ onChange });
		const hue = screen.getByTestId('hue');
		fireEvent.keyDown(hue, { key: 'ArrowRight' });
		expect(onChange).toHaveBeenCalled();
		await nextTick();
		expect(hue).toHaveAttribute('aria-valuenow', '1');
	});

	it('adjusts alpha and emits an 8-digit hex', () => {
		const onChange = vi.fn();
		renderPicker({ onChange });
		const alpha = screen.getByTestId('alpha');
		alpha.getBoundingClientRect = () => ({ left: 0, top: 0, width: 100, height: 10, right: 100, bottom: 10, x: 0, y: 0, toJSON: () => {} });
		fireEvent.pointerDown(alpha, { clientX: 50, clientY: 5 });
		expect(onChange).toHaveBeenCalled();
		const lastCall = onChange.mock.calls.at(-1)![0] as string;
		expect(lastCall.length).toBe(9); // #rrggbbaa
	});

	it('commits a typed hex value', async () => {
		const onChange = vi.fn();
		renderPicker({ onChange });
		const input = screen.getByLabelText('Hex color');
		// Simulate typing a full valid hex
		fireEvent.input(input, { target: { value: '#00ff00' } });
		expect(onChange).toHaveBeenCalledWith('#00ff00');
	});

	it('ignores invalid typed hex', async () => {
		const onChange = vi.fn();
		renderPicker({ onChange });
		const input = screen.getByLabelText('Hex color');
		fireEvent.input(input, { target: { value: 'zzz' } });
		expect(onChange).not.toHaveBeenCalled();
	});

	it('supports controlled value', async () => {
		const colorRef = ref('#ff0000');
		const { rerender } = render(
			defineComponent({
				setup() {
					return () =>
						h(
							ColorPicker.Root,
							{ value: colorRef.value },
							() => h(ColorPicker.Swatch, { 'data-testid': 'swatch' }),
						);
				},
			}),
		);
		expect(screen.getByTestId('swatch').style.backgroundColor).toBe('rgb(255, 0, 0)');
		colorRef.value = '#0000ff';
		await rerender({});
		expect(screen.getByTestId('swatch').style.backgroundColor).toBe('rgb(0, 0, 255)');
	});

	it('throws when a part is used outside Root', () => {
		const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
		expect(() =>
			render({
				setup() {
					return () => h(ColorPicker.Swatch, {});
				},
			}),
		).toThrow(/ColorPicker.Root/);
		spy.mockRestore();
	});
});
