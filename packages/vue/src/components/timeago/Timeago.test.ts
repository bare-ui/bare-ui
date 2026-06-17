import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { h } from 'vue';
import { Timeago } from '.';
import type { TimeagoProps } from '.';

function renderTimeago(props: TimeagoProps) {
	return render({
		setup() {
			return () => h(Timeago, { ...props });
		},
	});
}

describe('Timeago', () => {
	it('renders a <time> element', () => {
		renderTimeago({ datetime: new Date() });
		expect(screen.getByText(/.+/).closest('time')).toBeInTheDocument();
	});

	it('shows "Just Now" for very recent timestamps', () => {
		renderTimeago({ datetime: new Date(), isDuration: true });
		expect(screen.getByText('Just Now')).toBeInTheDocument();
	});

	it('shows time-only when timeOnly=true', () => {
		const date = new Date('2025-01-15T14:30:00');
		renderTimeago({ datetime: date, timeOnly: true });
		expect(screen.getByText('14:30')).toBeInTheDocument();
	});

	it('shows duration in minutes for recent past', () => {
		const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
		renderTimeago({ datetime: fiveMinutesAgo, isDuration: true });
		expect(screen.getByText('5 minutes ago')).toBeInTheDocument();
	});

	it('shows duration in hours for older timestamps', () => {
		const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
		renderTimeago({ datetime: twoHoursAgo, isDuration: true });
		expect(screen.getByText('2 hours ago')).toBeInTheDocument();
	});

	it('shows "Today, HH:MM" for same-day timestamps', () => {
		const now = new Date();
		const sameDay = new Date(now);
		sameDay.setHours(9, 0, 0, 0);
		renderTimeago({ datetime: sameDay });
		expect(screen.getByText(/Today, 09:00/)).toBeInTheDocument();
	});

	it('accepts string datetime', () => {
		renderTimeago({ datetime: new Date().toISOString(), isDuration: true });
		expect(screen.getByText('Just Now')).toBeInTheDocument();
	});

	it('accepts numeric timestamp', () => {
		renderTimeago({ datetime: Date.now(), isDuration: true });
		expect(screen.getByText('Just Now')).toBeInTheDocument();
	});

	it('applies className', () => {
		renderTimeago({ datetime: new Date(), class: 'my-time' });
		expect(document.querySelector('time')).toHaveClass('my-time');
	});
});
