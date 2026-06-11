/**
 * Screen-reader semantics for EmptyState. The placeholder is a polite status
 * region so SR users are told when a view is empty; the title is a heading, the
 * description is readable, the actions are reachable, and the decorative media
 * (icon/illustration) is hidden from the a11y tree.
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { expectExposedAs } from '@/test/sr';
import { EmptyState } from '.';

const {
	Root: EmptyStateRoot,
	Media: EmptyStateMedia,
	Title: EmptyStateTitle,
	Description: EmptyStateDescription,
	Actions: EmptyStateActions,
} = EmptyState;

function renderEmpty() {
	return render({
		template: `
			<EmptyStateRoot>
				<EmptyStateMedia data-testid="media">📭</EmptyStateMedia>
				<EmptyStateTitle>No messages yet</EmptyStateTitle>
				<EmptyStateDescription>Start a conversation to see it here.</EmptyStateDescription>
				<EmptyStateActions>
					<button>New message</button>
				</EmptyStateActions>
			</EmptyStateRoot>
		`,
		components: {
			EmptyStateRoot,
			EmptyStateMedia,
			EmptyStateTitle,
			EmptyStateDescription,
			EmptyStateActions,
		},
	});
}

describe('EmptyState — screen reader semantics', () => {
	it('exposes the placeholder as a status region', () => {
		renderEmpty();
		// role=status is a polite live region: SR announces the empty state when it appears.
		expect(screen.getByRole('status')).toBeInTheDocument();
	});

	it('exposes the title as a heading and the description as readable text', () => {
		renderEmpty();
		expectExposedAs('heading', 'No messages yet');
		expect(screen.getByText('Start a conversation to see it here.')).toBeInTheDocument();
	});

	it('exposes the action as a reachable button', () => {
		renderEmpty();
		expectExposedAs('button', 'New message');
	});

	it('hides the decorative media (icon/illustration) from the a11y tree', () => {
		renderEmpty();
		// The emoji/illustration carries no meaning beyond the title/description.
		expect(screen.getByTestId('media')).toHaveAttribute('aria-hidden', 'true');
	});
});
