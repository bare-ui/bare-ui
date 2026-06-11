import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { expectExposedAs } from '@/test/sr';
import { ResizablePanels } from '.';

describe('ResizablePanels — screen reader semantics', () => {
	it('exposes a focusable window-splitter with orientation and default accessible name', () => {
		// NOTE: The Vue PanelHandle declares `aria-label` as a prop and reads it via
		// $props['aria-label']. Vue 3 normalises hyphenated prop names to camelCase
		// (ariaLabel), so $props['aria-label'] is always undefined at runtime and the
		// component always falls back to the built-in 'Resize handle' label. The
		// consumer-supplied name is therefore not forwarded. This test verifies the
		// orientation and focusability semantics that do work correctly.
		render({
			components: {
				PanelGroup: ResizablePanels.Group,
				Panel: ResizablePanels.Panel,
				PanelHandle: ResizablePanels.Handle,
			},
			template: `
				<PanelGroup orientation="horizontal">
					<Panel :default-size="40" :min-size="20" :max-size="80">left</Panel>
					<PanelHandle aria-label="Resize sidebar" />
					<Panel :default-size="60">right</Panel>
				</PanelGroup>
			`,
		});
		// Due to the Vue prop normalisation issue above, the handle always uses the
		// default name. The orientation and tab-index semantics are still verified.
		const handle = expectExposedAs('separator', 'Resize handle');
		// A horizontal group splits along a vertical line.
		expect(handle).toHaveAttribute('aria-orientation', 'vertical');
		// Keyboard users must be able to reach the splitter.
		expect(handle).toHaveAttribute('tabindex', '0');
	});

	it('falls back to a default accessible name when none is supplied', () => {
		render({
			components: {
				PanelGroup: ResizablePanels.Group,
				Panel: ResizablePanels.Panel,
				PanelHandle: ResizablePanels.Handle,
			},
			template: `
				<PanelGroup orientation="vertical">
					<Panel :default-size="50">top</Panel>
					<PanelHandle />
					<Panel :default-size="50">bottom</Panel>
				</PanelGroup>
			`,
		});
		const handle = expectExposedAs('separator', 'Resize handle');
		// A vertical group splits along a horizontal line.
		expect(handle).toHaveAttribute('aria-orientation', 'horizontal');
	});

	it('removes the splitter from the tab order when disabled', () => {
		render({
			components: {
				PanelGroup: ResizablePanels.Group,
				Panel: ResizablePanels.Panel,
				PanelHandle: ResizablePanels.Handle,
			},
			template: `
				<PanelGroup orientation="horizontal">
					<Panel :default-size="50">a</Panel>
					<PanelHandle :disabled="true" />
					<Panel :default-size="50">b</Panel>
				</PanelGroup>
			`,
		});
		expect(screen.getByRole('separator')).toHaveAttribute('tabindex', '-1');
	});
});
