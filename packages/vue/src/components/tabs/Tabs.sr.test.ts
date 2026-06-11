/**
 * Screen-reader semantics for Tabs. Verifies what VoiceOver/NVDA/JAWS announce
 * and update as the user moves between tabs — beyond axe's static check.
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { Tabs } from '.';
import { expectExposedAs, accessibleNameVia } from '@/test/sr';

const { Root: TabsRoot, List: TabsList, Trigger: TabsTrigger, Content: TabsContent } = Tabs;

function renderTabs() {
	return render({
		template: `
			<TabsRoot defaultValue="account">
				<TabsList aria-label="Settings">
					<TabsTrigger value="account">Account</TabsTrigger>
					<TabsTrigger value="password">Password</TabsTrigger>
				</TabsList>
				<TabsContent value="account">Account panel</TabsContent>
				<TabsContent value="password">Password panel</TabsContent>
			</TabsRoot>
		`,
		components: { TabsRoot, TabsList, TabsTrigger, TabsContent },
	});
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
