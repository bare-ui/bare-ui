import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
	it('renders the compound parts', () => {
		render(
			<EmptyState.Root>
				<EmptyState.Media data-testid='media'>icon</EmptyState.Media>
				<EmptyState.Title>No results</EmptyState.Title>
				<EmptyState.Description>Try a different search.</EmptyState.Description>
				<EmptyState.Actions>
					<button>Clear</button>
				</EmptyState.Actions>
			</EmptyState.Root>,
		);
		expect(screen.getByRole('heading', { name: 'No results' })).toBeInTheDocument();
		expect(screen.getByText('Try a different search.')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
	});

	it('Root is an aria status region', () => {
		render(<EmptyState.Root>empty</EmptyState.Root>);
		expect(screen.getByRole('status')).toHaveTextContent('empty');
	});

	it('Media is hidden from assistive tech', () => {
		render(
			<EmptyState.Root>
				<EmptyState.Media data-testid='media'>★</EmptyState.Media>
			</EmptyState.Root>,
		);
		expect(screen.getByTestId('media')).toHaveAttribute('aria-hidden', 'true');
	});

	it('forwards className and props', () => {
		render(
			<EmptyState.Root
				className='es'
				data-testid='root'
			/>,
		);
		expect(screen.getByTestId('root')).toHaveClass('es');
	});
});
