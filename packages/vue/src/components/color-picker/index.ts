import ColorPickerRoot from './ColorPickerRoot.vue';
import ColorPickerArea from './ColorPickerArea.vue';
import ColorPickerAreaThumb from './ColorPickerAreaThumb.vue';
import ColorPickerHue from './ColorPickerHue.vue';
import ColorPickerHueThumb from './ColorPickerHueThumb.vue';
import ColorPickerAlpha from './ColorPickerAlpha.vue';
import ColorPickerAlphaThumb from './ColorPickerAlphaThumb.vue';
import ColorPickerSwatch from './ColorPickerSwatch.vue';
import ColorPickerInput from './ColorPickerInput.vue';

export const ColorPicker = {
	Root: ColorPickerRoot,
	Area: ColorPickerArea,
	AreaThumb: ColorPickerAreaThumb,
	Hue: ColorPickerHue,
	HueThumb: ColorPickerHueThumb,
	Alpha: ColorPickerAlpha,
	AlphaThumb: ColorPickerAlphaThumb,
	Swatch: ColorPickerSwatch,
	Input: ColorPickerInput,
};

export type {
	ColorPickerRootProps,
	ColorPickerAreaProps,
	ColorPickerAreaThumbProps,
	ColorPickerHueProps,
	ColorPickerHueThumbProps,
	ColorPickerAlphaProps,
	ColorPickerAlphaThumbProps,
	ColorPickerSwatchProps,
	ColorPickerInputProps,
	HSVA,
	RGBA,
} from './ColorPicker.types';
