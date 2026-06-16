/**
 * RTL behavior audit. Each interactive component is rendered inside a
 * `dir="rtl"` host; the horizontal axis (arrow keys, pointer math) must mirror.
 * LTR behavior is covered by each component's own test file, so here we only
 * assert the mirrored path.
 *
 * Mirrors `packages/react/src/test/rtl.test.tsx`.
 */
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { h, nextTick, type VNodeChild } from 'vue';
import { Slider } from '@/components/slider';
import { Tabs } from '@/components/tabs';
import { Toolbar } from '@/components/toolbar';
import { Rating } from '@/components/rating';
import { Calendar } from '@/components/calendar';
import { TreeView } from '@/components/tree-view';
import { OTP } from '@/components/otp';
import { Toggle, ToggleGroup } from '@/components/toggle';
import { Carousel } from '@/components/carousel';
import { MenuBar } from '@/components/menu-bar';
import type { TreeNode } from '@/components/tree-view';

/** Render `ui` inside a `dir="rtl"` host. */
function rtl(ui: () => VNodeChild) {
	return render({ setup: () => () => h('div', { dir: 'rtl' }, [ui()]) });
}

describe('RTL — Slider', () => {
	it('ArrowLeft increases and ArrowRight decreases on a horizontal slider', async () => {
		rtl(() => h(Slider, { defaultValue: 50, min: 0, max: 100, step: 5, 'aria-label': 'vol' }));
		const thumb = screen.getByRole('slider');
		thumb.focus();
		await userEvent.keyboard('{ArrowLeft}');
		expect(thumb).toHaveAttribute('aria-valuenow', '55');
		await userEvent.keyboard('{ArrowRight}{ArrowRight}');
		expect(thumb).toHaveAttribute('aria-valuenow', '45');
	});

	it('Home/End remain absolute regardless of direction', async () => {
		rtl(() => h(Slider, { defaultValue: 50, min: 0, max: 100, step: 5, 'aria-label': 'vol' }));
		const thumb = screen.getByRole('slider');
		thumb.focus();
		await userEvent.keyboard('{Home}');
		expect(thumb).toHaveAttribute('aria-valuenow', '0');
		await userEvent.keyboard('{End}');
		expect(thumb).toHaveAttribute('aria-valuenow', '100');
	});

	it('anchors the thumb from the right edge in RTL', async () => {
		rtl(() => h(Slider, { defaultValue: 25, min: 0, max: 100, 'aria-label': 'vol' }));
		await nextTick();
		const thumb = screen.getByRole('slider');
		expect(thumb.style.right).toBe('25%');
		expect(thumb.style.left).toBe('');
	});
});

describe('RTL — Tabs', () => {
	it('ArrowLeft advances and ArrowRight retreats', async () => {
		rtl(() =>
			h(Tabs.Root, { defaultValue: 'one' }, () => [
				h(Tabs.List, null, () => [
					h(Tabs.Trigger, { value: 'one' }, () => 'One'),
					h(Tabs.Trigger, { value: 'two' }, () => 'Two'),
				]),
				h(Tabs.Content, { value: 'one' }, () => 'P1'),
				h(Tabs.Content, { value: 'two' }, () => 'P2'),
			]),
		);
		screen.getByRole('tab', { name: 'One' }).focus();
		await userEvent.keyboard('{ArrowLeft}');
		expect(screen.getByRole('tab', { name: 'Two' })).toHaveFocus();
		await userEvent.keyboard('{ArrowRight}');
		expect(screen.getByRole('tab', { name: 'One' })).toHaveFocus();
	});
});

describe('RTL — Toolbar', () => {
	it('ArrowLeft advances and ArrowRight retreats', async () => {
		rtl(() =>
			h(Toolbar.Root, { 'aria-label': 'fmt' }, () => [
				h(Toolbar.Button, null, () => 'Bold'),
				h(Toolbar.Button, null, () => 'Italic'),
			]),
		);
		await nextTick();
		screen.getByText('Bold').focus();
		await userEvent.keyboard('{ArrowLeft}');
		expect(screen.getByText('Italic')).toHaveFocus();
		await userEvent.keyboard('{ArrowRight}');
		expect(screen.getByText('Bold')).toHaveFocus();
	});
});

describe('RTL — Toggle group', () => {
	it('ArrowLeft advances and ArrowRight retreats with roving focus', async () => {
		rtl(() =>
			h(ToggleGroup.Root, { type: 'single' }, () => [
				h(Toggle, { value: 'left' }, () => 'Left'),
				h(Toggle, { value: 'center' }, () => 'Center'),
			]),
		);
		await nextTick();
		screen.getByText('Left').focus();
		await userEvent.keyboard('{ArrowLeft}');
		expect(screen.getByText('Center')).toHaveFocus();
		await userEvent.keyboard('{ArrowRight}');
		expect(screen.getByText('Left')).toHaveFocus();
	});
});

describe('RTL — Rating', () => {
	it('ArrowLeft increases and ArrowRight decreases', async () => {
		rtl(() => h(Rating, { defaultValue: 2, max: 5 }));
		const star2 = screen.getByRole('button', { name: '2 out of 5 stars' });
		star2.focus();
		await userEvent.keyboard('{ArrowLeft}');
		expect(screen.getByRole('button', { name: '3 out of 5 stars' })).toHaveFocus();
		await userEvent.keyboard('{ArrowRight}{ArrowRight}');
		expect(screen.getByRole('button', { name: '1 out of 5 stars' })).toHaveFocus();
	});
});

describe('RTL — Calendar', () => {
	it('ArrowLeft moves to the next day and ArrowRight to the previous', async () => {
		rtl(() =>
			h(Calendar.Root, { defaultMonth: new Date(2024, 0, 15) }, () => [h(Calendar.Grid)]),
		);
		screen.getByRole('gridcell', { name: '15' }).focus();
		await userEvent.keyboard('{ArrowLeft}');
		expect(screen.getByRole('gridcell', { name: '16' })).toHaveFocus();
		await userEvent.keyboard('{ArrowRight}{ArrowRight}');
		expect(screen.getByRole('gridcell', { name: '14' })).toHaveFocus();
	});
});

describe('RTL — TreeView', () => {
	const nodes: TreeNode[] = [
		{ id: 'src', label: 'src', children: [{ id: 'src/a', label: 'a' }] },
	];

	function renderTree() {
		return render({
			template: `
				<div dir="rtl">
					<TreeViewRoot :nodes="treeNodes">
						<template #default="{ node }">
							<span>{{ node.label }}</span>
						</template>
					</TreeViewRoot>
				</div>
			`,
			components: { TreeViewRoot: TreeView.Root },
			setup() {
				return { treeNodes: nodes };
			},
		});
	}

	it('ArrowLeft expands a collapsed parent; ArrowRight collapses it', async () => {
		renderTree();
		const parent = screen.getByRole('treeitem', { name: /src/ });
		parent.focus();
		expect(parent).toHaveAttribute('aria-expanded', 'false');
		await userEvent.keyboard('{ArrowLeft}');
		expect(screen.getByRole('treeitem', { name: /src/ })).toHaveAttribute('aria-expanded', 'true');
		await userEvent.keyboard('{ArrowRight}');
		expect(screen.getByRole('treeitem', { name: /src/ })).toHaveAttribute('aria-expanded', 'false');
	});
});

describe('RTL — OTP', () => {
	it('ArrowLeft advances to the next slot and ArrowRight retreats', async () => {
		rtl(() =>
			h(OTP.Root, { length: 3 }, () =>
				Array.from({ length: 3 }, (_, i) => h(OTP.Slot, { key: i, index: i })),
			),
		);
		const slot0 = screen.getByLabelText('Digit 1');
		slot0.focus();
		await userEvent.keyboard('{ArrowLeft}');
		expect(screen.getByLabelText('Digit 2')).toHaveFocus();
		await userEvent.keyboard('{ArrowRight}');
		expect(screen.getByLabelText('Digit 1')).toHaveFocus();
	});
});

describe('RTL — Carousel', () => {
	it('ArrowLeft advances and ArrowRight retreats', async () => {
		rtl(() =>
			h(Carousel.Root, null, () => [
				h(Carousel.Viewport, { 'aria-label': 'Gallery' }, () =>
					h(Carousel.Content, null, () =>
						Array.from({ length: 3 }, (_, i) => h(Carousel.Slide, { key: i }, () => `Slide ${i + 1}`)),
					),
				),
				h(Carousel.Indicators, null, {
					default: ({ index, selected }: { index: number; selected: boolean }) =>
						h('button', { 'data-testid': `dot-${index}`, 'data-selected': selected ? '' : undefined }),
				}),
			]),
		);
		await nextTick();
		await nextTick();
		const viewport = screen.getByLabelText('Gallery');
		fireEvent.keyDown(viewport, { key: 'ArrowLeft' });
		await nextTick();
		expect(screen.getByTestId('dot-1')).toHaveAttribute('data-selected', '');
		fireEvent.keyDown(viewport, { key: 'ArrowRight' });
		await nextTick();
		expect(screen.getByTestId('dot-0')).toHaveAttribute('data-selected', '');
	});
});

describe('RTL — MenuBar', () => {
	it('ArrowLeft advances and ArrowRight retreats between menus', async () => {
		rtl(() =>
			h(MenuBar.Root, null, () => [
				h(MenuBar.Menu, { value: 'file' }, () => [h(MenuBar.Trigger, null, () => 'File')]),
				h(MenuBar.Menu, { value: 'edit' }, () => [h(MenuBar.Trigger, null, () => 'Edit')]),
			]),
		);
		const file = screen.getByRole('menuitem', { name: 'File' });
		file.focus();
		await userEvent.keyboard('{ArrowLeft}');
		expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus();
		await userEvent.keyboard('{ArrowRight}');
		expect(screen.getByRole('menuitem', { name: 'File' })).toHaveFocus();
	});
});
