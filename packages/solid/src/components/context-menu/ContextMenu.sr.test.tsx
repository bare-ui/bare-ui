import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@solidjs/testing-library';
import { expectExposedAs } from '@/test/sr';
import { ContextMenu } from './ContextMenu';

function renderCM() {
	return render(() => (
		<ContextMenu.Root>
			<ContextMenu.Trigger data-testid='trigger'>Right-click here</ContextMenu.Trigger>
			<ContextMenu.Content>
				<ContextMenu.Item>Cut</ContextMenu.Item>
				<ContextMenu.Item>Copy</ContextMenu.Item>
				<ContextMenu.Separator />
				<ContextMenu.Item disabled>Paste</ContextMenu.Item>
			</ContextMenu.Content>
		</ContextMenu.Root>
	));
}

function openMenu() {
	fireEvent.contextMenu(screen.getByTestId('trigger'), { clientX: 50, clientY: 50 });
}

describe('ContextMenu — screen reader semantics', () => {
	it('exposes no menu before the right-click opens it', () => {
		renderCM();
		expect(screen.queryByRole('menu')).not.toBeInTheDocument();
	});

	it('exposes the cursor-positioned content as a menu once open', () => {
		renderCM();
		openMenu();
		expect(screen.getByRole('menu')).toBeInTheDocument();
	});

	it('exposes each enabled action as a menuitem by its accessible name', () => {
		renderCM();
		openMenu();
		const menu = screen.getByRole('menu');
		expectExposedAs('menuitem', 'Cut', {}, menu);
		expectExposedAs('menuitem', 'Copy', {}, menu);
	});

	it('exposes a disabled item as a disabled menuitem', () => {
		renderCM();
		openMenu();
		const menu = screen.getByRole('menu');
		// A screen reader announces "Paste, dimmed" / "unavailable".
		const paste = expectExposedAs('menuitem', 'Paste', {}, menu);
		expect(paste).toHaveAttribute('aria-disabled', 'true');
	});

	it('exposes a separator between item groups', () => {
		renderCM();
		openMenu();
		expect(within(screen.getByRole('menu')).getByRole('separator')).toBeInTheDocument();
	});
});
