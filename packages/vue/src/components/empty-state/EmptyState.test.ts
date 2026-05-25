import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { h } from 'vue';
import { EmptyState } from '.';

describe('EmptyState', () => {
	it('renders the compound parts', () => {
		render({
			setup() {
				return () =>
					h(EmptyState.Root, null, () => [
						h(EmptyState.Media, { 'data-testid': 'media' }, () => 'icon'),
						h(EmptyState.Title, null, () => 'No results'),
						h(EmptyState.Description, null, () => 'Try a different search.'),
						h(EmptyState.Actions, null, () => h('button', null, 'Clear')),
					]);
			},
		});
		expect(screen.getByRole('heading', { name: 'No results' })).toBeInTheDocument();
		expect(screen.getByText('Try a different search.')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
	});

	it('Root is an aria status region', () => {
		render({
			setup() {
				return () => h(EmptyState.Root, null, () => 'empty');
			},
		});
		expect(screen.getByRole('status')).toHaveTextContent('empty');
	});

	it('Media is hidden from assistive tech', () => {
		render({
			setup() {
				return () =>
					h(EmptyState.Root, null, () => [
						h(EmptyState.Media, { 'data-testid': 'media' }, () => '★'),
					]);
			},
		});
		expect(screen.getByTestId('media')).toHaveAttribute('aria-hidden', 'true');
	});

	it('forwards class and props', () => {
		render({
			setup() {
				return () => h(EmptyState.Root, { class: 'es', 'data-testid': 'root' });
			},
		});
		expect(screen.getByTestId('root')).toHaveClass('es');
	});
});
