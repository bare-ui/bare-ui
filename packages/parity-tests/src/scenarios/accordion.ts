import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { expect } from 'vitest'
import { ACCORDION, type AccordionFixture } from '../fixtures'
import type { ParitySuite } from '../types'

const [a, b] = ACCORDION.items
const trigger = (name: string) => screen.getByRole('button', { name })

export const accordionSuite: ParitySuite<AccordionFixture> = {
	component: 'Accordion',
	fixtures: ['single', 'multiple'],
	scenarios: [
		{
			name: 'panels are collapsed by default',
			fixture: 'single',
			run: async () => {
				expect(screen.queryByText(a.content)).toBeNull()
				expect(screen.queryByText(b.content)).toBeNull()
				expect(trigger(a.trigger).getAttribute('aria-expanded')).toBe('false')
				expect(trigger(a.trigger).getAttribute('data-state')).toBe('closed')
			},
		},
		{
			name: 'clicking a trigger expands its panel (aria-expanded + data-state)',
			fixture: 'single',
			run: async () => {
				const user = userEvent.setup()
				await user.click(trigger(a.trigger))
				expect(trigger(a.trigger).getAttribute('aria-expanded')).toBe('true')
				expect(trigger(a.trigger).getAttribute('data-state')).toBe('open')
				expect(screen.getByText(a.content)).toBeTruthy()
			},
		},
		{
			name: 'single mode: opening a second item closes the first',
			fixture: 'single',
			run: async () => {
				const user = userEvent.setup()
				await user.click(trigger(a.trigger))
				await user.click(trigger(b.trigger))
				expect(screen.queryByText(a.content)).toBeNull()
				expect(screen.getByText(b.content)).toBeTruthy()
				expect(trigger(a.trigger).getAttribute('aria-expanded')).toBe('false')
				expect(trigger(b.trigger).getAttribute('aria-expanded')).toBe('true')
			},
		},
		{
			name: 'single + collapsible: clicking the open trigger closes it',
			fixture: 'single',
			run: async () => {
				const user = userEvent.setup()
				await user.click(trigger(a.trigger))
				await user.click(trigger(a.trigger))
				expect(screen.queryByText(a.content)).toBeNull()
				expect(trigger(a.trigger).getAttribute('aria-expanded')).toBe('false')
				expect(trigger(a.trigger).getAttribute('data-state')).toBe('closed')
			},
		},
		{
			name: 'multiple mode: items open independently',
			fixture: 'multiple',
			run: async () => {
				const user = userEvent.setup()
				await user.click(trigger(a.trigger))
				await user.click(trigger(b.trigger))
				expect(screen.getByText(a.content)).toBeTruthy()
				expect(screen.getByText(b.content)).toBeTruthy()
				expect(trigger(a.trigger).getAttribute('aria-expanded')).toBe('true')
				expect(trigger(b.trigger).getAttribute('aria-expanded')).toBe('true')
			},
		},
	],
}
