import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { AspectRatio } from '.';

describe('AspectRatio', () => {
	it('renders children with data-ratio reflecting the prop', () => {
		render(AspectRatio, {
			props: { ratio: 16 / 9 },
			attrs: { 'data-testid': 'ar' },
			slots: { default: '<img alt="" src="" />' },
		});
		const el = screen.getByTestId('ar');
		expect(el).toHaveAttribute('data-ratio', String(16 / 9));
	});

	it('defaults to ratio 1 (square)', () => {
		render(AspectRatio, {
			attrs: { 'data-testid': 'ar' },
			slots: { default: 'x' },
		});
		const el = screen.getByTestId('ar');
		expect(el).toHaveAttribute('data-ratio', '1');
	});
});
