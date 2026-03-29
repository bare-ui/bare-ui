import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Accordion } from './Accordion';

function renderSingle(rootProps: Omit<React.ComponentProps<typeof Accordion.Root>, 'type' | 'children'> = {}) {
	return render(
		<Accordion.Root
			type='single'
			{...rootProps}>
			<Accordion.Item value='item-1'>
				<Accordion.Trigger>Section 1</Accordion.Trigger>
				<Accordion.Content>Content 1</Accordion.Content>
			</Accordion.Item>
			<Accordion.Item value='item-2'>
				<Accordion.Trigger>Section 2</Accordion.Trigger>
				<Accordion.Content>Content 2</Accordion.Content>
			</Accordion.Item>
		</Accordion.Root>,
	);
}

function renderMultiple(rootProps: Omit<React.ComponentProps<typeof Accordion.Root>, 'type' | 'children'> = {}) {
	return render(
		<Accordion.Root
			type='multiple'
			{...rootProps}>
			<Accordion.Item value='item-1'>
				<Accordion.Trigger>Section 1</Accordion.Trigger>
				<Accordion.Content>Content 1</Accordion.Content>
			</Accordion.Item>
			<Accordion.Item value='item-2'>
				<Accordion.Trigger>Section 2</Accordion.Trigger>
				<Accordion.Content>Content 2</Accordion.Content>
			</Accordion.Item>
		</Accordion.Root>,
	);
}

describe('Accordion (single)', () => {
	it('renders triggers', () => {
		renderSingle();
		expect(screen.getByText('Section 1')).toBeInTheDocument();
		expect(screen.getByText('Section 2')).toBeInTheDocument();
	});

	it('content is not shown by default', () => {
		renderSingle();
		expect(screen.queryByText('Content 1')).toBeNull();
		expect(screen.queryByText('Content 2')).toBeNull();
	});

	it('clicking trigger opens the item and shows content', async () => {
		renderSingle();
		await userEvent.click(screen.getByText('Section 1'));
		expect(screen.getByText('Content 1')).toBeInTheDocument();
	});

	it('trigger has aria-expanded=true when open', async () => {
		renderSingle();
		const trigger = screen.getByText('Section 1');
		expect(trigger).toHaveAttribute('aria-expanded', 'false');
		await userEvent.click(trigger);
		expect(trigger).toHaveAttribute('aria-expanded', 'true');
	});

	it('opening a second item closes the first (single mode)', async () => {
		renderSingle();
		await userEvent.click(screen.getByText('Section 1'));
		expect(screen.getByText('Content 1')).toBeInTheDocument();
		await userEvent.click(screen.getByText('Section 2'));
		expect(screen.queryByText('Content 1')).toBeNull();
		expect(screen.getByText('Content 2')).toBeInTheDocument();
	});

	it('collapsible: clicking open item closes it', async () => {
		renderSingle({ collapsible: true } as never);
		await userEvent.click(screen.getByText('Section 1'));
		expect(screen.getByText('Content 1')).toBeInTheDocument();
		await userEvent.click(screen.getByText('Section 1'));
		expect(screen.queryByText('Content 1')).toBeNull();
	});

	it('non-collapsible: clicking open item keeps it open', async () => {
		renderSingle();
		await userEvent.click(screen.getByText('Section 1'));
		await userEvent.click(screen.getByText('Section 1'));
		expect(screen.getByText('Content 1')).toBeInTheDocument();
	});

	it('defaultValue opens the item initially', () => {
		renderSingle({ defaultValue: 'item-2' } as never);
		expect(screen.getByText('Content 2')).toBeInTheDocument();
		expect(screen.queryByText('Content 1')).toBeNull();
	});

	it('onChange fires with the new value', async () => {
		const handleChange = vi.fn();
		renderSingle({ onChange: handleChange } as never);
		await userEvent.click(screen.getByText('Section 1'));
		expect(handleChange).toHaveBeenCalledWith('item-1');
	});

	it('disabled root prevents all items from toggling', async () => {
		renderSingle({ disabled: true });
		await userEvent.click(screen.getByText('Section 1'));
		expect(screen.queryByText('Content 1')).toBeNull();
	});

	it('item data-state reflects open/closed', async () => {
		renderSingle();
		const item1 = screen.getByText('Section 1').closest('[data-state]')!;
		expect(item1).toHaveAttribute('data-state', 'closed');
		await userEvent.click(screen.getByText('Section 1'));
		expect(item1).toHaveAttribute('data-state', 'open');
	});
});

describe('Accordion (multiple)', () => {
	it('multiple items can be open simultaneously', async () => {
		renderMultiple();
		await userEvent.click(screen.getByText('Section 1'));
		await userEvent.click(screen.getByText('Section 2'));
		expect(screen.getByText('Content 1')).toBeInTheDocument();
		expect(screen.getByText('Content 2')).toBeInTheDocument();
	});

	it('clicking an open item closes only that item', async () => {
		renderMultiple();
		await userEvent.click(screen.getByText('Section 1'));
		await userEvent.click(screen.getByText('Section 2'));
		await userEvent.click(screen.getByText('Section 1'));
		expect(screen.queryByText('Content 1')).toBeNull();
		expect(screen.getByText('Content 2')).toBeInTheDocument();
	});

	it('defaultValue (array) opens multiple items initially', () => {
		renderMultiple({ defaultValue: ['item-1', 'item-2'] } as never);
		expect(screen.getByText('Content 1')).toBeInTheDocument();
		expect(screen.getByText('Content 2')).toBeInTheDocument();
	});
});
