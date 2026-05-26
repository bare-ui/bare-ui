import type { HSVA, RGBA } from './ColorPicker.types';

export function clamp(n: number, min: number, max: number) {
	return Math.min(Math.max(n, min), max);
}

export function hsvToRgb(h: number, s: number, v: number): { r: number; g: number; b: number } {
	const sat = s / 100;
	const val = v / 100;
	const c = val * sat;
	const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
	const m = val - c;
	let rgb: [number, number, number];
	if (h < 60) rgb = [c, x, 0];
	else if (h < 120) rgb = [x, c, 0];
	else if (h < 180) rgb = [0, c, x];
	else if (h < 240) rgb = [0, x, c];
	else if (h < 300) rgb = [x, 0, c];
	else rgb = [c, 0, x];
	return {
		r: Math.round((rgb[0] + m) * 255),
		g: Math.round((rgb[1] + m) * 255),
		b: Math.round((rgb[2] + m) * 255),
	};
}

export function rgbToHsv(r: number, g: number, b: number): { h: number; s: number; v: number } {
	const rn = r / 255;
	const gn = g / 255;
	const bn = b / 255;
	const max = Math.max(rn, gn, bn);
	const min = Math.min(rn, gn, bn);
	const d = max - min;
	let h = 0;
	if (d !== 0) {
		if (max === rn) h = ((gn - bn) / d) % 6;
		else if (max === gn) h = (bn - rn) / d + 2;
		else h = (rn - gn) / d + 4;
		h *= 60;
		if (h < 0) h += 360;
	}
	const s = max === 0 ? 0 : d / max;
	return { h, s: s * 100, v: max * 100 };
}

function toHex(n: number) {
	return clamp(Math.round(n), 0, 255).toString(16).padStart(2, '0');
}

export function hsvaToRgba(hsva: HSVA): RGBA {
	const { r, g, b } = hsvToRgb(hsva.h, hsva.s, hsva.v);
	return { r, g, b, a: hsva.a };
}

export function hsvaToHex(hsva: HSVA, withAlpha = true): string {
	const { r, g, b } = hsvToRgb(hsva.h, hsva.s, hsva.v);
	const base = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
	return withAlpha && hsva.a < 1 ? `${base}${toHex(hsva.a * 255)}` : base;
}

/** Parse a hex string into HSVA. Returns `null` if invalid. */
export function hexToHsva(hex: string): HSVA | null {
	let value = hex.trim().replace(/^#/, '');
	if (/^[0-9a-fA-F]{3}$/.test(value)) {
		value = value
			.split('')
			.map((c) => c + c)
			.join('');
	} else if (/^[0-9a-fA-F]{4}$/.test(value)) {
		value = value
			.split('')
			.map((c) => c + c)
			.join('');
	}
	if (!/^[0-9a-fA-F]{6}$/.test(value) && !/^[0-9a-fA-F]{8}$/.test(value)) return null;
	const r = parseInt(value.slice(0, 2), 16);
	const g = parseInt(value.slice(2, 4), 16);
	const b = parseInt(value.slice(4, 6), 16);
	const a = value.length === 8 ? parseInt(value.slice(6, 8), 16) / 255 : 1;
	const { h, s, v } = rgbToHsv(r, g, b);
	return { h, s, v, a };
}
