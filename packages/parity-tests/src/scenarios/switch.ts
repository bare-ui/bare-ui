import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { expect } from 'vitest'
import type { SwitchFixture } from '../fixtures'
import type { ParitySuite } from '../types'

const sw = () => screen.getByRole('switch')

export const switchSuite: ParitySuite<SwitchFixture> = {
	component: 'Switch',
	fixtures: ['default', 'defaultOn', 'disabled'],
	scenarios: [
		{
			name: 'renders role="switch", unchecked by default',
			fixture: 'default',
			run: async () => {
				expect(sw().getAttribute('aria-checked')).toBe('false')
				expect(sw().hasAttribute('data-checked')).toBe(false)
			},
		},
		{
			name: 'clicking toggles aria-checked + data-checked on, then off',
			fixture: 'default',
			run: async () => {
				const user = userEvent.setup()
				await user.click(sw())
				expect(sw().getAttribute('aria-checked')).toBe('true')
				expect(sw().getAttribute('data-checked')).toBe('')
				await user.click(sw())
				expect(sw().getAttribute('aria-checked')).toBe('false')
				expect(sw().hasAttribute('data-checked')).toBe(false)
			},
		},
		{
			name: 'Space key toggles when focused',
			fixture: 'default',
			run: async () => {
				const user = userEvent.setup()
				sw().focus()
				await user.keyboard(' ')
				expect(sw().getAttribute('aria-checked')).toBe('true')
			},
		},
		{
			name: 'defaultChecked renders in the on state',
			fixture: 'defaultOn',
			run: async () => {
				expect(sw().getAttribute('aria-checked')).toBe('true')
				expect(sw().getAttribute('data-checked')).toBe('')
			},
		},
		{
			name: 'disabled: click does not toggle and control is disabled',
			fixture: 'disabled',
			run: async () => {
				const user = userEvent.setup()
				expect((sw() as HTMLButtonElement).disabled).toBe(true)
				await user.click(sw())
				expect(sw().getAttribute('aria-checked')).toBe('false')
			},
		},
	],
}
