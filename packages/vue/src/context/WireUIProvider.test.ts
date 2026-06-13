import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { WireUIProvider } from '.';
import { Calendar } from '../components/calendar';
import { NumberInput } from '../components/number-input';
import { Timeago } from '../components/timeago';

const calendarComponents = {
	WireUIProvider,
	CalendarRoot: Calendar.Root,
	CalendarNav: Calendar.Nav,
	CalendarPrevButton: Calendar.PrevButton,
	CalendarNextButton: Calendar.NextButton,
	CalendarTitle: Calendar.Title,
};

const numberInputComponents = {
	WireUIProvider,
	NumberInputRoot: NumberInput.Root,
	NumberInputField: NumberInput.Field,
	NumberInputIncrement: NumberInput.Increment,
	NumberInputDecrement: NumberInput.Decrement,
};

describe('WireUIProvider', () => {
	it('propagates locale to Calendar (localized month title + nav labels)', () => {
		render({
			components: calendarComponents,
			setup: () => ({ month: new Date(2025, 0, 1) }),
			template: `
				<WireUIProvider locale="de-DE">
					<CalendarRoot :defaultMonth="month">
						<CalendarNav>
							<CalendarPrevButton />
							<CalendarTitle />
							<CalendarNextButton />
						</CalendarNav>
					</CalendarRoot>
				</WireUIProvider>
			`,
		});
		expect(screen.getByText('Januar 2025')).toBeInTheDocument();
		// Nav aria-labels stay the default English strings unless overridden via messages.
		expect(screen.getByLabelText('Previous month')).toBeInTheDocument();
	});

	it('lets messages override translatable strings', () => {
		render({
			components: calendarComponents,
			setup: () => ({
				month: new Date(2025, 0, 1),
				messages: { calendar: { previousMonth: 'Voriger Monat', nextMonth: 'Nächster Monat' } },
			}),
			template: `
				<WireUIProvider locale="de-DE" :messages="messages">
					<CalendarRoot :defaultMonth="month">
						<CalendarPrevButton />
						<CalendarNextButton />
					</CalendarRoot>
				</WireUIProvider>
			`,
		});
		expect(screen.getByLabelText('Voriger Monat')).toBeInTheDocument();
		expect(screen.getByLabelText('Nächster Monat')).toBeInTheDocument();
	});

	it('propagates locale to NumberInput formatting when formatOptions is set', () => {
		render({
			components: numberInputComponents,
			setup: () => ({ formatOptions: { minimumFractionDigits: 1 } }),
			template: `
				<WireUIProvider locale="de-DE">
					<NumberInputRoot :defaultValue="1234.5" :formatOptions="formatOptions">
						<NumberInputField />
					</NumberInputRoot>
				</WireUIProvider>
			`,
		});
		expect(screen.getByRole('spinbutton')).toHaveValue('1.234,5');
	});

	it('localizes NumberInput increment/decrement labels via messages', () => {
		render({
			components: numberInputComponents,
			setup: () => ({ messages: { numberInput: { increment: 'Erhöhen', decrement: 'Verringern' } } }),
			template: `
				<WireUIProvider :messages="messages">
					<NumberInputRoot :defaultValue="1">
						<NumberInputIncrement />
						<NumberInputDecrement />
					</NumberInputRoot>
				</WireUIProvider>
			`,
		});
		expect(screen.getByLabelText('Erhöhen')).toBeInTheDocument();
		expect(screen.getByLabelText('Verringern')).toBeInTheDocument();
	});

	it('propagates locale to Timeago relative-time output', () => {
		const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
		render({
			components: { WireUIProvider, Timeago },
			setup: () => ({ datetime: fiveMinutesAgo }),
			template: `
				<WireUIProvider locale="de-DE">
					<Timeago :datetime="datetime" isDuration />
				</WireUIProvider>
			`,
		});
		expect(screen.getByText('vor 5 Minuten')).toBeInTheDocument();
	});

	it('an explicit locale prop overrides the provider', () => {
		const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
		render({
			components: { WireUIProvider, Timeago },
			setup: () => ({ datetime: fiveMinutesAgo }),
			template: `
				<WireUIProvider locale="de-DE">
					<Timeago :datetime="datetime" isDuration locale="en-US" />
				</WireUIProvider>
			`,
		});
		expect(screen.getByText('5 minutes ago')).toBeInTheDocument();
	});

	it('falls back to en-US defaults with no provider', () => {
		const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
		render({
			components: { Timeago },
			setup: () => ({ datetime: fiveMinutesAgo }),
			template: `<Timeago :datetime="datetime" isDuration />`,
		});
		expect(screen.getByText('5 minutes ago')).toBeInTheDocument();
	});

	it('merges nested providers (child inherits parent locale, overrides messages)', () => {
		render({
			components: calendarComponents,
			setup: () => ({
				month: new Date(2025, 0, 1),
				outer: { calendar: { previousMonth: 'A' } },
				inner: { calendar: { nextMonth: 'B' } },
			}),
			template: `
				<WireUIProvider locale="de-DE" :messages="outer">
					<WireUIProvider :messages="inner">
						<CalendarRoot :defaultMonth="month">
							<CalendarTitle />
							<CalendarPrevButton />
							<CalendarNextButton />
						</CalendarRoot>
					</WireUIProvider>
				</WireUIProvider>
			`,
		});
		// Inherited parent locale.
		expect(screen.getByText('Januar 2025')).toBeInTheDocument();
		// Parent + child message overrides both apply.
		expect(screen.getByLabelText('A')).toBeInTheDocument();
		expect(screen.getByLabelText('B')).toBeInTheDocument();
	});
});
