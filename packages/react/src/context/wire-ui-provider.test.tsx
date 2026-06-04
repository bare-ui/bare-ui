import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WireUIProvider } from './wire-ui-provider';
import { Calendar } from '../components/calendar/Calendar';
import { NumberInput } from '../components/number-input/NumberInput';
import { Timeago } from '../components/timeago/Timeago';

describe('WireUIProvider', () => {
	it('propagates locale to Calendar (localized month title + nav labels)', () => {
		render(
			<WireUIProvider locale='de-DE'>
				<Calendar.Root defaultMonth={new Date(2025, 0, 1)}>
					<Calendar.Nav>
						<Calendar.PrevButton />
						<Calendar.Title />
						<Calendar.NextButton />
					</Calendar.Nav>
				</Calendar.Root>
			</WireUIProvider>,
		);
		expect(screen.getByText('Januar 2025')).toBeInTheDocument();
		// Nav aria-labels fall back to the default German-less strings unless
		// overridden via messages; default English labels remain.
		expect(screen.getByLabelText('Previous month')).toBeInTheDocument();
	});

	it('lets messages override translatable strings', () => {
		render(
			<WireUIProvider
				locale='de-DE'
				messages={{ calendar: { previousMonth: 'Voriger Monat', nextMonth: 'Nächster Monat' } }}>
				<Calendar.Root defaultMonth={new Date(2025, 0, 1)}>
					<Calendar.PrevButton />
					<Calendar.NextButton />
				</Calendar.Root>
			</WireUIProvider>,
		);
		expect(screen.getByLabelText('Voriger Monat')).toBeInTheDocument();
		expect(screen.getByLabelText('Nächster Monat')).toBeInTheDocument();
	});

	it('propagates locale to NumberInput formatting when formatOptions is set', () => {
		render(
			<WireUIProvider locale='de-DE'>
				<NumberInput.Root
					defaultValue={1234.5}
					formatOptions={{ minimumFractionDigits: 1 }}>
					<NumberInput.Field />
				</NumberInput.Root>
			</WireUIProvider>,
		);
		expect(screen.getByRole('spinbutton')).toHaveValue('1.234,5');
	});

	it('localizes NumberInput increment/decrement labels via messages', () => {
		render(
			<WireUIProvider messages={{ numberInput: { increment: 'Erhöhen', decrement: 'Verringern' } }}>
				<NumberInput.Root defaultValue={1}>
					<NumberInput.Increment />
					<NumberInput.Decrement />
				</NumberInput.Root>
			</WireUIProvider>,
		);
		expect(screen.getByLabelText('Erhöhen')).toBeInTheDocument();
		expect(screen.getByLabelText('Verringern')).toBeInTheDocument();
	});

	it('propagates locale to Timeago relative-time output', () => {
		const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
		render(
			<WireUIProvider locale='de-DE'>
				<Timeago datetime={fiveMinutesAgo} isDuration />
			</WireUIProvider>,
		);
		expect(screen.getByText('vor 5 Minuten')).toBeInTheDocument();
	});

	it('an explicit locale prop overrides the provider', () => {
		const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
		render(
			<WireUIProvider locale='de-DE'>
				<Timeago datetime={fiveMinutesAgo} isDuration locale='en-US' />
			</WireUIProvider>,
		);
		expect(screen.getByText('5 minutes ago')).toBeInTheDocument();
	});

	it('falls back to en-US defaults with no provider', () => {
		const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
		render(<Timeago datetime={fiveMinutesAgo} isDuration />);
		expect(screen.getByText('5 minutes ago')).toBeInTheDocument();
	});

	it('merges nested providers (child inherits parent locale, overrides messages)', () => {
		render(
			<WireUIProvider locale='de-DE' messages={{ calendar: { previousMonth: 'A' } }}>
				<WireUIProvider messages={{ calendar: { nextMonth: 'B' } }}>
					<Calendar.Root defaultMonth={new Date(2025, 0, 1)}>
						<Calendar.Title />
						<Calendar.PrevButton />
						<Calendar.NextButton />
					</Calendar.Root>
				</WireUIProvider>
			</WireUIProvider>,
		);
		// Inherited parent locale.
		expect(screen.getByText('Januar 2025')).toBeInTheDocument();
		// Parent + child message overrides both apply.
		expect(screen.getByLabelText('A')).toBeInTheDocument();
		expect(screen.getByLabelText('B')).toBeInTheDocument();
	});
});
