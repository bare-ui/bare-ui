/**
 * RTL behavior audit. Each interactive component is rendered inside a
 * `dir="rtl"` host; the horizontal axis (arrow keys, pointer math) must mirror.
 * LTR behavior is covered by each component's own test file, so here we only
 * assert the mirrored path.
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Slider } from '@/components/slider/Slider';
import { Tabs } from '@/components/tabs/Tabs';
import { Toolbar } from '@/components/toolbar/Toolbar';
import { Rating } from '@/components/rating/Rating';
import { Calendar } from '@/components/calendar/Calendar';
import { TreeView } from '@/components/tree-view/TreeView';
import { OTP } from '@/components/otp/OTP';
import type { TreeNode } from '@/components/tree-view/TreeView.types';

function rtl(ui: React.ReactNode) {
	return render(<div dir='rtl'>{ui}</div>);
}

describe('RTL — Slider', () => {
	it('ArrowLeft increases and ArrowRight decreases on a horizontal slider', async () => {
		rtl(<Slider defaultValue={50} min={0} max={100} step={5} aria-label='vol' />);
		const thumb = screen.getByRole('slider');
		thumb.focus();
		await userEvent.keyboard('{ArrowLeft}');
		expect(thumb).toHaveAttribute('aria-valuenow', '55');
		await userEvent.keyboard('{ArrowRight}{ArrowRight}');
		expect(thumb).toHaveAttribute('aria-valuenow', '45');
	});

	it('Home/End remain absolute regardless of direction', async () => {
		rtl(<Slider defaultValue={50} min={0} max={100} step={5} aria-label='vol' />);
		const thumb = screen.getByRole('slider');
		thumb.focus();
		await userEvent.keyboard('{Home}');
		expect(thumb).toHaveAttribute('aria-valuenow', '0');
		await userEvent.keyboard('{End}');
		expect(thumb).toHaveAttribute('aria-valuenow', '100');
	});

	it('anchors the thumb from the right edge in RTL', () => {
		rtl(<Slider defaultValue={25} min={0} max={100} aria-label='vol' />);
		const thumb = screen.getByRole('slider');
		expect(thumb.style.right).toBe('25%');
		expect(thumb.style.left).toBe('');
	});
});

describe('RTL — Tabs', () => {
	it('ArrowLeft advances and ArrowRight retreats', async () => {
		rtl(
			<Tabs.Root defaultValue='one'>
				<Tabs.List>
					<Tabs.Trigger value='one'>One</Tabs.Trigger>
					<Tabs.Trigger value='two'>Two</Tabs.Trigger>
				</Tabs.List>
				<Tabs.Content value='one'>P1</Tabs.Content>
				<Tabs.Content value='two'>P2</Tabs.Content>
			</Tabs.Root>,
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
		rtl(
			<Toolbar.Root aria-label='fmt'>
				<Toolbar.Button>Bold</Toolbar.Button>
				<Toolbar.Button>Italic</Toolbar.Button>
			</Toolbar.Root>,
		);
		screen.getByRole('button', { name: 'Bold' }).focus();
		await userEvent.keyboard('{ArrowLeft}');
		expect(screen.getByRole('button', { name: 'Italic' })).toHaveFocus();
		await userEvent.keyboard('{ArrowRight}');
		expect(screen.getByRole('button', { name: 'Bold' })).toHaveFocus();
	});
});

describe('RTL — Rating', () => {
	it('ArrowLeft increases and ArrowRight decreases', async () => {
		rtl(<Rating defaultValue={2} max={5} />);
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
		rtl(
			<Calendar.Root defaultMonth={new Date(2024, 0, 15)}>
				<Calendar.Grid />
			</Calendar.Root>,
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
		return rtl(
			<TreeView.Root
				nodes={nodes}
				renderItem={(node) => <span>{node.label as string}</span>}
			/>,
		);
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
		rtl(
			<OTP.Root length={3}>
				{Array.from({ length: 3 }, (_, i) => (
					<OTP.Slot key={i} index={i} />
				))}
			</OTP.Root>,
		);
		const slot0 = screen.getByLabelText('Digit 1');
		slot0.focus();
		await userEvent.keyboard('{ArrowLeft}');
		expect(screen.getByLabelText('Digit 2')).toHaveFocus();
		await userEvent.keyboard('{ArrowRight}');
		expect(screen.getByLabelText('Digit 1')).toHaveFocus();
	});
});
