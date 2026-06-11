import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/vue';
import { h } from 'vue';
import { expectExposedAs } from '@/test/sr';
import { Icon } from '.';

const testIcons = {
	home: '<svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>',
} as Partial<Record<string, string>>;

describe('Icon — screen reader semantics', () => {
	it('hides a decorative icon (no label) from the a11y tree', () => {
		const { container } = render({
			setup: () => () =>
				h(Icon, { type: 'home', icons: testIcons }),
		});
		const svg = container.querySelector('svg')!;
		// A label-less icon is presentation; SRs must not announce it.
		expect(svg).toHaveAttribute('aria-hidden', 'true');
		expect(svg).toHaveAttribute('focusable', 'false');
	});

	it('exposes a labelled icon as an image with its accessible name', () => {
		render({
			setup: () => () =>
				h(Icon, { type: 'home', icons: testIcons, label: 'Home' }),
		});
		// A meaningful icon becomes role="img" named by its label and drops aria-hidden.
		const svg = expectExposedAs('img', 'Home');
		expect(svg).not.toHaveAttribute('aria-hidden');
	});
});
