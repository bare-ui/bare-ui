import type { JSX } from 'solid-js';

export interface HSVA {
	/** Hue, 0–360. */
	h: number;
	/** Saturation, 0–100. */
	s: number;
	/** Value/brightness, 0–100. */
	v: number;
	/** Alpha, 0–1. */
	a: number;
}

export interface RGBA {
	r: number;
	g: number;
	b: number;
	a: number;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

export interface ColorPickerContextValue {
	hsva: HSVA;
	rgba: RGBA;
	hex: string;
	/** Solid hue color (full S/V) — useful for the saturation area background. */
	hueColor: string;
	setSaturationValue: (s: number, v: number) => void;
	setHue: (h: number) => void;
	setAlpha: (a: number) => void;
	setHex: (hex: string) => void;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

export interface ColorPickerRootProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onChange'> {
	/** Controlled value as a hex string (`#rgb`, `#rrggbb`, or `#rrggbbaa`). */
	value?: string;
	/** Initial value (uncontrolled). Default `'#000000'`. */
	defaultValue?: string;
	/** Called with the hex string whenever the color changes. */
	onChange?: (hex: string) => void;
	/** Enable the alpha channel. Default `true`. */
	alpha?: boolean;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

export type ColorPickerAreaProps = JSX.HTMLAttributes<HTMLDivElement>;
export type ColorPickerAreaThumbProps = JSX.HTMLAttributes<HTMLDivElement>;
export type ColorPickerHueProps = JSX.HTMLAttributes<HTMLDivElement>;
export type ColorPickerHueThumbProps = JSX.HTMLAttributes<HTMLDivElement>;
export type ColorPickerAlphaProps = JSX.HTMLAttributes<HTMLDivElement>;
export type ColorPickerAlphaThumbProps = JSX.HTMLAttributes<HTMLDivElement>;
export type ColorPickerSwatchProps = JSX.HTMLAttributes<HTMLDivElement>;
export type ColorPickerInputProps = Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>;
