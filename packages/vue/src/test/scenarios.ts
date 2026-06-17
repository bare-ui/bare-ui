/**
 * Shared SSR/hydration scenarios. This module is rendered twice:
 *   - by `vitest.ssr.config.ts` (node, `@vue/server-renderer`) to produce the
 *     server markup, and
 *   - by `vitest.hydrate.config.ts` (jsdom) to hydrate that markup with a real
 *     `createSSRApp(...).mount()`.
 *
 * Keep every scenario deterministic (no `Math.random`, no wall-clock) so the
 * server render and the client hydration agree — that is exactly what the
 * hydration audit verifies. Components whose output legitimately depends on the
 * clock (`Timeago`, and `Calendar` without a fixed month) are covered by the SSR
 * determinism test / documented in `SSR.md`, not here.
 */
import { h, type VNode } from 'vue';
import {
	Accordion,
	Badge,
	Button,
	Card,
	Checkbox,
	ContextMenu,
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
	Sheet,
	Skeleton,
	Spinner,
	Switch,
	Tabs,
	Textarea,
} from '@/components';

export const scenarios: Record<string, () => VNode> = {
	// --- Presentational — static markup, must hydrate as-is.
	Badge: () => h(Badge, { count: 5 }),
	Card: () => h(Card, null, { default: () => 'card body' }),
	Divider: () => h(Divider),
	ProgressBar: () => h(ProgressBar, { percentage: 42 }),
	Skeleton: () => h(Skeleton),
	Spinner: () => h(Spinner),

	// --- Interactive, static first render.
	Button: () => h(Button, null, { default: () => 'click' }),
	Switch: () => h(Switch.Root, null, { default: () => h(Switch.Thumb) }),

	// --- Generated ids (useId): server/client sequences must align.
	Input: () =>
		h(Input.Root, null, {
			default: () => [
				h(Input.Label, null, { default: () => 'Email' }),
				h(Input.Field, { type: 'email' }),
				h(Input.Error),
			],
		}),
	Textarea: () =>
		h(Textarea.Root, null, {
			default: () => [h(Textarea.Label, null, { default: () => 'Bio' }), h(Textarea.Field)],
		}),
	Password: () =>
		h(Password.Root, null, {
			default: () => [
				h(Password.Label, null, { default: () => 'Password' }),
				h(Password.Field),
				h(Password.Toggle),
			],
		}),
	Checkbox: () =>
		h(Checkbox.Root, { defaultValue: ['a'] }, {
			default: () => [
				h(Checkbox.Item, { value: 'a' }, {
					default: () => [h(Checkbox.Indicator), h(Checkbox.Label, null, { default: () => 'A' })],
				}),
				h(Checkbox.Item, { value: 'b' }, {
					default: () => [h(Checkbox.Indicator), h(Checkbox.Label, null, { default: () => 'B' })],
				}),
			],
		}),
	Radio: () =>
		h(Radio.Root, { defaultValue: 'b' }, {
			default: () => [
				h(Radio.Item, { value: 'a' }, {
					default: () => [h(Radio.Indicator), h(Radio.Label, null, { default: () => 'A' })],
				}),
				h(Radio.Item, { value: 'b' }, {
					default: () => [h(Radio.Indicator), h(Radio.Label, null, { default: () => 'B' })],
				}),
			],
		}),

	// --- Context + roving state, open by default (no portal).
	Tabs: () =>
		h(Tabs.Root, { defaultValue: 'one' }, {
			default: () => [
				h(Tabs.List, null, {
					default: () => [
						h(Tabs.Trigger, { value: 'one' }, { default: () => 'One' }),
						h(Tabs.Trigger, { value: 'two' }, { default: () => 'Two' }),
					],
				}),
				h(Tabs.Content, { value: 'one' }, { default: () => 'Panel One' }),
				h(Tabs.Content, { value: 'two' }, { default: () => 'Panel Two' }),
			],
		}),
	'Accordion (open)': () =>
		h(Accordion.Root, { type: 'single', defaultValue: 'item-1', collapsible: true }, {
			default: () =>
				h(Accordion.Item, { value: 'item-1' }, {
					default: () => [
						h(Accordion.Trigger, null, { default: () => 'Section 1' }),
						h(Accordion.Content, null, { default: () => 'Content 1' }),
					],
				}),
		}),
	'Dropdown (open)': () =>
		h(Dropdown.Root, { defaultOpen: true }, {
			default: () => [
				h(Dropdown.Trigger, null, { default: () => 'Open' }),
				h(Dropdown.Menu, null, { default: () => h('div', null, 'Item') }),
			],
		}),
	'Popover (open)': () =>
		h(Popover.Root, { defaultOpen: true }, {
			default: () => [
				h(Popover.Trigger, null, { default: () => 'Open' }),
				h(Popover.Content, null, {
					default: () => ['Body', h(Popover.Close, null, { default: () => 'Close' })],
				}),
			],
		}),
	'Select (open)': () =>
		h(Select.Root, { defaultValue: 'apple' }, {
			default: () => [
				h(Select.Trigger, null, { default: () => h(Select.Value, { placeholder: 'Pick' }) }),
				h(Select.Content, null, {
					default: () => [
						h(Select.Item, { value: 'apple' }, { default: () => 'Apple' }),
						h(Select.Item, { value: 'pear' }, { default: () => 'Pear' }),
					],
				}),
			],
		}),

	// --- Portal-backed overlays rendered OPEN. The `<Teleport>` is gated behind
	// `useIsMounted()`, so the server (and the first client render) emit nothing;
	// this is the exact case that mismatches without that guard.
	'Modal (open)': () =>
		h(Modal.Root, { open: true }, {
			default: () =>
				h(Modal.Portal, null, {
					default: () => [h(Modal.Overlay), h(Modal.Content, null, { default: () => 'Modal body' })],
				}),
		}),
	'Drawer (open)': () =>
		h(Drawer.Root, { open: true }, {
			default: () =>
				h(Drawer.Portal, null, {
					default: () => [h(Drawer.Overlay), h(Drawer.Content, null, { default: () => 'Drawer body' })],
				}),
		}),
	'Sheet (open)': () =>
		h(Sheet.Root, { open: true }, {
			default: () =>
				h(Sheet.Portal, null, {
					default: () => [h(Sheet.Overlay), h(Sheet.Content, null, { default: () => 'Sheet body' })],
				}),
		}),
	'ContextMenu (open)': () =>
		h(ContextMenu.Root, { open: true }, {
			default: () => [
				h(ContextMenu.Trigger, null, { default: () => 'Right click' }),
				h(ContextMenu.Content, null, {
					default: () => h(ContextMenu.Item, null, { default: () => 'Item' }),
				}),
			],
		}),
};
