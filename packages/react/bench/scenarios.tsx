/**
 * Equivalent component trees implemented three ways — Wire UI, Radix UI, and
 * Headless UI — so the benchmark suites render the *same* scenario across all
 * three libraries. Keep the structure (number of triggers, panels, items)
 * identical between variants so the comparison is apples-to-apples.
 */
import * as React from 'react';

// Wire UI
import { Switch, Tabs, Accordion, Modal, Tooltip } from '../src';

// Radix UI
import * as RxSwitch from '@radix-ui/react-switch';
import * as RxTabs from '@radix-ui/react-tabs';
import * as RxAccordion from '@radix-ui/react-accordion';
import * as RxDialog from '@radix-ui/react-dialog';
import * as RxTooltip from '@radix-ui/react-tooltip';

// Headless UI
import {
	Switch as HuiSwitch,
	TabGroup,
	TabList,
	Tab,
	TabPanels,
	TabPanel,
	Disclosure,
	DisclosureButton,
	DisclosurePanel,
	Dialog as HuiDialog,
	DialogPanel,
	DialogTitle,
} from '@headlessui/react';

const noop = () => {};

const TABS = [
	{ value: 'overview', label: 'Overview', body: 'A high-level summary of the product.' },
	{ value: 'details', label: 'Details', body: 'Detailed specifications and materials.' },
	{ value: 'reviews', label: 'Reviews', body: 'Customer reviews from verified buyers.' },
];

const FAQS = [
	{ value: 'shipping', q: 'How long does shipping take?', a: 'Two to five business days.' },
	{ value: 'returns', q: 'What is the return policy?', a: 'Thirty days, no questions asked.' },
	{ value: 'warranty', q: 'Is there a warranty?', a: 'One year limited warranty.' },
];

// ---------------------------------------------------------------------------
// Switch
// ---------------------------------------------------------------------------

export const WireSwitchScenario = () => (
	<Switch.Root checked onChange={noop} aria-label="Notifications">
		<Switch.Thumb />
	</Switch.Root>
);

export const RadixSwitchScenario = () => (
	<RxSwitch.Root checked onCheckedChange={noop} aria-label="Notifications">
		<RxSwitch.Thumb />
	</RxSwitch.Root>
);

export const HeadlessSwitchScenario = () => (
	<HuiSwitch checked onChange={noop} aria-label="Notifications">
		<span />
	</HuiSwitch>
);

// ---------------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------------

export const WireTabsScenario = () => (
	<Tabs.Root defaultValue="overview">
		<Tabs.List>
			{TABS.map((t) => (
				<Tabs.Trigger key={t.value} value={t.value}>
					{t.label}
				</Tabs.Trigger>
			))}
		</Tabs.List>
		{TABS.map((t) => (
			<Tabs.Content key={t.value} value={t.value}>
				{t.body}
			</Tabs.Content>
		))}
	</Tabs.Root>
);

export const RadixTabsScenario = () => (
	<RxTabs.Root defaultValue="overview">
		<RxTabs.List>
			{TABS.map((t) => (
				<RxTabs.Trigger key={t.value} value={t.value}>
					{t.label}
				</RxTabs.Trigger>
			))}
		</RxTabs.List>
		{TABS.map((t) => (
			<RxTabs.Content key={t.value} value={t.value}>
				{t.body}
			</RxTabs.Content>
		))}
	</RxTabs.Root>
);

export const HeadlessTabsScenario = () => (
	<TabGroup>
		<TabList>
			{TABS.map((t) => (
				<Tab key={t.value}>{t.label}</Tab>
			))}
		</TabList>
		<TabPanels>
			{TABS.map((t) => (
				<TabPanel key={t.value}>{t.body}</TabPanel>
			))}
		</TabPanels>
	</TabGroup>
);

// ---------------------------------------------------------------------------
// Accordion
// ---------------------------------------------------------------------------

export const WireAccordionScenario = () => (
	<Accordion.Root type="single" defaultValue="shipping" collapsible>
		{FAQS.map((f) => (
			<Accordion.Item key={f.value} value={f.value}>
				<Accordion.Trigger>{f.q}</Accordion.Trigger>
				<Accordion.Content>{f.a}</Accordion.Content>
			</Accordion.Item>
		))}
	</Accordion.Root>
);

export const RadixAccordionScenario = () => (
	<RxAccordion.Root type="single" defaultValue="shipping" collapsible>
		{FAQS.map((f) => (
			<RxAccordion.Item key={f.value} value={f.value}>
				<RxAccordion.Header>
					<RxAccordion.Trigger>{f.q}</RxAccordion.Trigger>
				</RxAccordion.Header>
				<RxAccordion.Content>{f.a}</RxAccordion.Content>
			</RxAccordion.Item>
		))}
	</RxAccordion.Root>
);

// Headless UI has no Accordion primitive; the idiomatic equivalent is a stack
// of Disclosure components.
export const HeadlessAccordionScenario = () => (
	<div>
		{FAQS.map((f) => (
			<Disclosure key={f.value} defaultOpen={f.value === 'shipping'}>
				<DisclosureButton>{f.q}</DisclosureButton>
				<DisclosurePanel>{f.a}</DisclosurePanel>
			</Disclosure>
		))}
	</div>
);

// ---------------------------------------------------------------------------
// Dialog / Modal (open — mount benchmarks only; uses portals)
// ---------------------------------------------------------------------------

export const WireDialogScenario = () => (
	<Modal.Root open onOpenChange={noop}>
		<Modal.Portal>
			<Modal.Overlay>
				<Modal.Content>
					<p>Are you sure you want to continue?</p>
					<Modal.Close>Confirm</Modal.Close>
				</Modal.Content>
			</Modal.Overlay>
		</Modal.Portal>
	</Modal.Root>
);

export const RadixDialogScenario = () => (
	<RxDialog.Root open onOpenChange={noop}>
		<RxDialog.Portal>
			<RxDialog.Overlay />
			<RxDialog.Content>
				<RxDialog.Title>Confirm</RxDialog.Title>
				<p>Are you sure you want to continue?</p>
				<RxDialog.Close>Confirm</RxDialog.Close>
			</RxDialog.Content>
		</RxDialog.Portal>
	</RxDialog.Root>
);

export const HeadlessDialogScenario = () => (
	<HuiDialog open onClose={noop}>
		<DialogPanel>
			<DialogTitle>Confirm</DialogTitle>
			<p>Are you sure you want to continue?</p>
			<button onClick={noop}>Confirm</button>
		</DialogPanel>
	</HuiDialog>
);

// ---------------------------------------------------------------------------
// Tooltip (open — mount benchmarks only; uses portals). Headless UI has no
// tooltip primitive, so only Wire and Radix are compared.
// ---------------------------------------------------------------------------

export const WireTooltipScenario = () => (
	<Tooltip.Root defaultOpen delayDuration={0}>
		<Tooltip.Trigger>Hover me</Tooltip.Trigger>
		<Tooltip.Content side="top">Helpful hint</Tooltip.Content>
	</Tooltip.Root>
);

export const RadixTooltipScenario = () => (
	<RxTooltip.Provider>
		<RxTooltip.Root defaultOpen delayDuration={0}>
			<RxTooltip.Trigger>Hover me</RxTooltip.Trigger>
			<RxTooltip.Portal>
				<RxTooltip.Content side="top">Helpful hint</RxTooltip.Content>
			</RxTooltip.Portal>
		</RxTooltip.Root>
	</RxTooltip.Provider>
);

// ---------------------------------------------------------------------------
// Registries consumed by the benchmark files.
// ---------------------------------------------------------------------------

export type Variant = { lib: string; Component: React.ComponentType };

/** Inline-rendering scenarios — safe for SSR (no portals). */
export const inlineScenarios: Record<string, Variant[]> = {
	Switch: [
		{ lib: 'wire', Component: WireSwitchScenario },
		{ lib: 'radix', Component: RadixSwitchScenario },
		{ lib: 'headless', Component: HeadlessSwitchScenario },
	],
	Tabs: [
		{ lib: 'wire', Component: WireTabsScenario },
		{ lib: 'radix', Component: RadixTabsScenario },
		{ lib: 'headless', Component: HeadlessTabsScenario },
	],
	Accordion: [
		{ lib: 'wire', Component: WireAccordionScenario },
		{ lib: 'radix', Component: RadixAccordionScenario },
		{ lib: 'headless', Component: HeadlessAccordionScenario },
	],
};

/** Portal-rendering scenarios — mount only. */
export const portalScenarios: Record<string, Variant[]> = {
	Dialog: [
		{ lib: 'wire', Component: WireDialogScenario },
		{ lib: 'radix', Component: RadixDialogScenario },
		{ lib: 'headless', Component: HeadlessDialogScenario },
	],
	Tooltip: [
		{ lib: 'wire', Component: WireTooltipScenario },
		{ lib: 'radix', Component: RadixTooltipScenario },
	],
};
