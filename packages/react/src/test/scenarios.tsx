/**
 * Shared SSR/hydration scenarios. This module is rendered twice:
 *   - by `vitest.ssr.config.ts` (node, `react-dom/server`) to produce the server
 *     markup, and
 *   - by `vitest.hydrate.config.ts` (jsdom) to hydrate that markup with a real
 *     `hydrateRoot()`.
 *
 * Keep every scenario deterministic (no `Math.random`, no wall-clock) so the
 * server render and the client hydration agree — that is exactly what the
 * hydration audit verifies. Components whose output legitimately depends on the
 * clock (`Timeago`, and `Calendar` without a fixed month) are covered by the SSR
 * determinism test / documented in `SSR.md`, not here.
 */
import type { ReactElement } from 'react';
import {
	Accordion,
	Badge,
	Button,
	Card,
	Checkbox,
	Divider,
	Drawer,
	Dropdown,
	Input,
	Modal,
	Password,
	Popover,
	ProgressBar,
	Radio,
	Select,
	Skeleton,
	Spinner,
	Switch,
	Tabs,
	Textarea,
} from '@/components';

export const scenarios: Record<string, () => ReactElement> = {
	// --- Presentational — static markup, must hydrate as-is.
	Badge: () => <Badge count={5} />,
	Card: () => <Card>card body</Card>,
	Divider: () => <Divider />,
	ProgressBar: () => <ProgressBar percentage={42} />,
	Skeleton: () => <Skeleton />,
	Spinner: () => <Spinner />,

	// --- Interactive, static first render.
	Button: () => <Button>click</Button>,
	Switch: () => (
		<Switch.Root>
			<Switch.Thumb />
		</Switch.Root>
	),

	// --- Generated ids (useId): server/client sequences must align.
	Input: () => (
		<Input.Root>
			<Input.Label>Email</Input.Label>
			<Input.Field type='email' />
			<Input.Error />
		</Input.Root>
	),
	Textarea: () => (
		<Textarea.Root>
			<Textarea.Label>Bio</Textarea.Label>
			<Textarea.Field rows={3} />
		</Textarea.Root>
	),
	Password: () => (
		<Password.Root>
			<Password.Label>Password</Password.Label>
			<Password.Field />
			<Password.Toggle />
		</Password.Root>
	),
	Checkbox: () => (
		<Checkbox.Root defaultValue={['a']}>
			<Checkbox.Item value='a'>
				<Checkbox.Indicator />
				<Checkbox.Label>A</Checkbox.Label>
			</Checkbox.Item>
			<Checkbox.Item value='b'>
				<Checkbox.Indicator />
				<Checkbox.Label>B</Checkbox.Label>
			</Checkbox.Item>
		</Checkbox.Root>
	),
	Radio: () => (
		<Radio.Root defaultValue='b'>
			<Radio.Item value='a'>
				<Radio.Indicator />
				<Radio.Label>A</Radio.Label>
			</Radio.Item>
			<Radio.Item value='b'>
				<Radio.Indicator />
				<Radio.Label>B</Radio.Label>
			</Radio.Item>
		</Radio.Root>
	),

	// --- Context + roving state, open by default (no portal).
	Tabs: () => (
		<Tabs.Root defaultValue='one'>
			<Tabs.List>
				<Tabs.Trigger value='one'>One</Tabs.Trigger>
				<Tabs.Trigger value='two'>Two</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value='one'>Panel One</Tabs.Content>
			<Tabs.Content value='two'>Panel Two</Tabs.Content>
		</Tabs.Root>
	),
	'Accordion (open)': () => (
		<Accordion.Root type='single' defaultValue='item-1' collapsible>
			<Accordion.Item value='item-1'>
				<Accordion.Trigger>Section 1</Accordion.Trigger>
				<Accordion.Content>Content 1</Accordion.Content>
			</Accordion.Item>
		</Accordion.Root>
	),
	'Dropdown (open)': () => (
		<Dropdown.Root defaultOpen>
			<Dropdown.Trigger>Open</Dropdown.Trigger>
			<Dropdown.Menu>
				<div>Item</div>
			</Dropdown.Menu>
		</Dropdown.Root>
	),
	'Popover (open)': () => (
		<Popover.Root defaultOpen>
			<Popover.Trigger>Open</Popover.Trigger>
			<Popover.Content>
				Body
				<Popover.Close>Close</Popover.Close>
			</Popover.Content>
		</Popover.Root>
	),
	'Select (open)': () => (
		<Select.Root defaultValue='apple'>
			<Select.Trigger>
				<Select.Value placeholder='Pick' />
			</Select.Trigger>
			<Select.Content>
				<Select.Item value='apple'>Apple</Select.Item>
				<Select.Item value='pear'>Pear</Select.Item>
			</Select.Content>
		</Select.Root>
	),

	// --- Portal-backed overlays, closed (the portal renders nothing on the
	// server, so there is no DOM access during a server render).
	'Modal (closed)': () => (
		<Modal.Root>
			<Modal.Portal>
				<Modal.Overlay>
					<Modal.Content>body</Modal.Content>
				</Modal.Overlay>
			</Modal.Portal>
		</Modal.Root>
	),
	'Drawer (closed)': () => (
		<Drawer.Root>
			<Drawer.Portal>
				<Drawer.Overlay>
					<Drawer.Content>body</Drawer.Content>
				</Drawer.Overlay>
			</Drawer.Portal>
		</Drawer.Root>
	),
};
