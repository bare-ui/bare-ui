import { describe, it, expect } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import { Timeago } from './Timeago';

describe('Timeago', () => {
	it('renders a <time> element', () => {
		render(() => <Timeago datetime={new Date()} />);
		expect(screen.getByText(/.+/).closest('time')).toBeInTheDocument();
	});

	it('shows "Just Now" for very recent timestamps', () => {
		render(() => (
			<Timeago
				datetime={new Date()}
				isDuration
			/>
		));
		expect(screen.getByText('Just Now')).toBeInTheDocument();
	});

	it('shows time-only when timeOnly=true', () => {
		const date = new Date('2025-01-15T14:30:00');
		render(() => (
			<Timeago
				datetime={date}
				timeOnly
			/>
		));
		expect(screen.getByText('14:30')).toBeInTheDocument();
	});

	it('shows duration in minutes for recent past', () => {
		const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
		render(() => (
			<Timeago
				datetime={fiveMinutesAgo}
				isDuration
			/>
		));
		expect(screen.getByText('5 minutes ago')).toBeInTheDocument();
	});

	it('shows duration in hours for older timestamps', () => {
		const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
		render(() => (
			<Timeago
				datetime={twoHoursAgo}
				isDuration
			/>
		));
		expect(screen.getByText('2 hours ago')).toBeInTheDocument();
	});

	it('shows "Today, HH:MM" for same-day timestamps', () => {
		const now = new Date();
		const sameDay = new Date(now);
		sameDay.setHours(9, 0, 0, 0);
		render(() => <Timeago datetime={sameDay} />);
		expect(screen.getByText(/Today, 09:00/)).toBeInTheDocument();
	});

	it('accepts string datetime', () => {
		render(() => (
			<Timeago
				datetime={new Date().toISOString()}
				isDuration
			/>
		));
		expect(screen.getByText('Just Now')).toBeInTheDocument();
	});

	it('accepts numeric timestamp', () => {
		render(() => (
			<Timeago
				datetime={Date.now()}
				isDuration
			/>
		));
		expect(screen.getByText('Just Now')).toBeInTheDocument();
	});

	it('applies class', () => {
		render(() => (
			<Timeago
				datetime={new Date()}
				class='my-time'
			/>
		));
		expect(document.querySelector('time')).toHaveClass('my-time');
	});
});
