import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AspectRatio } from './AspectRatio';

describe('AspectRatio', () => {
	it('renders children with data-ratio reflecting the prop', () => {
		render(
			<AspectRatio
				ratio={16 / 9}
				data-testid='ar'>
				<img alt='' src='' />
			</AspectRatio>,
		);
		const el = screen.getByTestId('ar');
		expect(el).toHaveAttribute('data-ratio', String(16 / 9));
	});

	it('defaults to ratio 1 (square)', () => {
		render(<AspectRatio data-testid='ar'>x</AspectRatio>);
		const el = screen.getByTestId('ar');
		expect(el).toHaveAttribute('data-ratio', '1');
	});
});
