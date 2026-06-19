import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { expect } from 'vitest'
import { TABS, type TabsFixture } from '../fixtures'
import type { ParitySuite } from '../types'

const [one, two, three] = TABS.tabs
const tab = (name: string) => screen.getByRole('tab', { name })

export const tabsSuite: ParitySuite<TabsFixture> = {
	component: 'Tabs',
	fixtures: ['default'],
	scenarios: [
		{
			name: 'renders a tablist with three tabs and only the active panel',
			fixture: 'default',
			run: async () => {
				expect(screen.getByRole('tablist')).toBeTruthy()
				expect(screen.getAllByRole('tab')).toHaveLength(3)
				expect(screen.getByText(one.panel)).toBeTruthy()
				expect(screen.queryByText(two.panel)).toBeNull()
			},
		},
		{
			name: 'clicking a tab activates its panel (data-state + aria-selected)',
			fixture: 'default',
			run: async () => {
				const user = userEvent.setup()
				await user.click(tab(two.label))
				expect(tab(two.label).getAttribute('aria-selected')).toBe('true')
				expect(tab(two.label).getAttribute('data-state')).toBe('active')
				expect(tab(one.label).getAttribute('data-state')).toBe('inactive')
				expect(screen.getByText(two.panel)).toBeTruthy()
				expect(screen.queryByText(one.panel)).toBeNull()
			},
		},
		{
			name: 'ArrowRight moves focus along the tablist (roving tabindex)',
			fixture: 'default',
			run: async () => {
				const user = userEvent.setup()
				tab(one.label).focus()
				await user.keyboard('{ArrowRight}')
				expect(document.activeElement).toBe(tab(two.label))
			},
		},
		{
			name: 'ArrowRight skips the disabled tab',
			fixture: 'default',
			run: async () => {
				const user = userEvent.setup()
				tab(two.label).focus()
				// three is disabled, so focus wraps past it back to one
				await user.keyboard('{ArrowRight}')
				expect(document.activeElement).toBe(tab(one.label))
				expect(document.activeElement).not.toBe(tab(three.label))
			},
		},
	],
}
