/**
 * Screen-reader semantics for Tabs. Verifies what VoiceOver/NVDA/JAWS announce
 * and update as the user moves between tabs — beyond axe's static check.
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs } from './Tabs';
import { expectExposedAs, accessibleNameVia } from '@/test/sr';

function renderTabs() {
	return render(
		<Tabs.Root defaultValue='account'>
			<Tabs.List aria-label='Settings'>
				<Tabs.Trigger value='account'>Account</Tabs.Trigger>
				<Tabs.Trigger value='password'>Password</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value='account'>Account panel</Tabs.Content>
			<Tabs.Content value='password'>Password panel</Tabs.Content>
		</Tabs.Root>,
	);
}

describe('Tabs — screen reader semantics', () => {
	it('exposes the tablist with its accessible name', () => {
		renderTabs();
		expectExposedAs('tablist', 'Settings');
	});

	it('announces each tab by name and its selected state', () => {
		renderTabs();
		const account = expectExposedAs('tab', 'Account');
		const password = expectExposedAs('tab', 'Password');
		expect(account).toHaveAttribute('aria-selected', 'true');
		expect(password).toHaveAttribute('aria-selected', 'false');
	});

	it('updates the selected state announcement when a new tab is activated', async () => {
		renderTabs();
		await userEvent.click(screen.getByRole('tab', { name: 'Password' }));
		expect(screen.getByRole('tab', { name: 'Account' })).toHaveAttribute('aria-selected', 'false');
		expect(screen.getByRole('tab', { name: 'Password' })).toHaveAttribute('aria-selected', 'true');
	});

	it('names the active tabpanel after its controlling tab (aria-labelledby)', async () => {
		renderTabs();
		// SR reads the panel's name from the tab that controls it.
		expect(accessibleNameVia(screen.getByRole('tabpanel'))).toBe('Account');
		await userEvent.click(screen.getByRole('tab', { name: 'Password' }));
		expect(accessibleNameVia(screen.getByRole('tabpanel'))).toBe('Password');
	});

	it('exposes the tab→panel relationship via aria-controls', () => {
		renderTabs();
		const account = screen.getByRole('tab', { name: 'Account' });
		const panel = screen.getByRole('tabpanel');
		expect(account.getAttribute('aria-controls')).toBe(panel.id);
	});
});
