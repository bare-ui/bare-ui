/**
 * Equivalent component trees implemented three ways — Wire UI, Kobalte, and
 * Corvu — so the benchmark suites render the *same* scenario across all three
 * libraries. Kobalte is the Radix-style analogue (full compound coverage);
 * Corvu is the leaner overlay/disclosure-focused library (partial coverage,
 * like Headless UI in the React suite). Keep the structure (number of triggers,
 * panels, items) identical between variants so the comparison is apples-to-apples.
 */
import { For, type JSX } from 'solid-js';

// Wire UI
import { Switch, Tabs, Accordion, Modal, Tooltip } from '../src';

// Kobalte
import { Switch as KSwitch } from '@kobalte/core/switch';
import { Tabs as KTabs } from '@kobalte/core/tabs';
import { Accordion as KAccordion } from '@kobalte/core/accordion';
import { Dialog as KDialog } from '@kobalte/core/dialog';
import { Tooltip as KTooltip } from '@kobalte/core/tooltip';

// Corvu (no Switch/Tabs primitives — overlay/disclosure focused)
import CorvuAccordion from 'corvu/accordion';
import CorvuDialog from 'corvu/dialog';
import CorvuTooltip from 'corvu/tooltip';

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
	<Switch.Root checked onChange={noop} aria-label='Notifications'>
		<Switch.Thumb />
	</Switch.Root>
);

export const KobalteSwitchScenario = () => (
	<KSwitch checked onChange={noop} aria-label='Notifications'>
		<KSwitch.Input />
		<KSwitch.Control>
			<KSwitch.Thumb />
		</KSwitch.Control>
	</KSwitch>
);

// ---------------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------------

export const WireTabsScenario = () => (
	<Tabs.Root defaultValue='overview'>
		<Tabs.List>
			<For each={TABS}>{(t) => <Tabs.Trigger value={t.value}>{t.label}</Tabs.Trigger>}</For>
		</Tabs.List>
		<For each={TABS}>{(t) => <Tabs.Content value={t.value}>{t.body}</Tabs.Content>}</For>
	</Tabs.Root>
);

export const KobalteTabsScenario = () => (
	<KTabs defaultValue='overview'>
		<KTabs.List>
			<For each={TABS}>{(t) => <KTabs.Trigger value={t.value}>{t.label}</KTabs.Trigger>}</For>
		</KTabs.List>
		<For each={TABS}>{(t) => <KTabs.Content value={t.value}>{t.body}</KTabs.Content>}</For>
	</KTabs>
);

// ---------------------------------------------------------------------------
// Accordion
// ---------------------------------------------------------------------------

export const WireAccordionScenario = () => (
	<Accordion.Root type='single' defaultValue='shipping' collapsible>
		<For each={FAQS}>
			{(f) => (
				<Accordion.Item value={f.value}>
					<Accordion.Trigger>{f.q}</Accordion.Trigger>
					<Accordion.Content>{f.a}</Accordion.Content>
				</Accordion.Item>
			)}
		</For>
	</Accordion.Root>
);

export const KobalteAccordionScenario = () => (
	<KAccordion defaultValue={['shipping']} collapsible>
		<For each={FAQS}>
			{(f) => (
				<KAccordion.Item value={f.value}>
					<KAccordion.Header>
						<KAccordion.Trigger>{f.q}</KAccordion.Trigger>
					</KAccordion.Header>
					<KAccordion.Content>{f.a}</KAccordion.Content>
				</KAccordion.Item>
			)}
		</For>
	</KAccordion>
);

export const CorvuAccordionScenario = () => (
	<CorvuAccordion collapsible initialValue='shipping'>
		<For each={FAQS}>
			{(f) => (
				<CorvuAccordion.Item value={f.value}>
					<CorvuAccordion.Trigger>{f.q}</CorvuAccordion.Trigger>
					<CorvuAccordion.Content>{f.a}</CorvuAccordion.Content>
				</CorvuAccordion.Item>
			)}
		</For>
	</CorvuAccordion>
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

export const KobalteDialogScenario = () => (
	<KDialog open onOpenChange={noop}>
		<KDialog.Portal>
			<KDialog.Overlay />
			<KDialog.Content>
				<KDialog.Title>Confirm</KDialog.Title>
				<p>Are you sure you want to continue?</p>
				<KDialog.CloseButton>Confirm</KDialog.CloseButton>
			</KDialog.Content>
		</KDialog.Portal>
	</KDialog>
);

export const CorvuDialogScenario = () => (
	<CorvuDialog open onOpenChange={noop}>
		<CorvuDialog.Portal>
			<CorvuDialog.Overlay />
			<CorvuDialog.Content>
				<CorvuDialog.Label>Confirm</CorvuDialog.Label>
				<p>Are you sure you want to continue?</p>
				<CorvuDialog.Close>Confirm</CorvuDialog.Close>
			</CorvuDialog.Content>
		</CorvuDialog.Portal>
	</CorvuDialog>
);

// ---------------------------------------------------------------------------
// Tooltip (open — mount benchmarks only; uses portals).
// ---------------------------------------------------------------------------

export const WireTooltipScenario = () => (
	<Tooltip.Root defaultOpen delayDuration={0}>
		<Tooltip.Trigger>Hover me</Tooltip.Trigger>
		<Tooltip.Content side='top'>Helpful hint</Tooltip.Content>
	</Tooltip.Root>
);

export const KobalteTooltipScenario = () => (
	<KTooltip open openDelay={0}>
		<KTooltip.Trigger>Hover me</KTooltip.Trigger>
		<KTooltip.Portal>
			<KTooltip.Content>Helpful hint</KTooltip.Content>
		</KTooltip.Portal>
	</KTooltip>
);

export const CorvuTooltipScenario = () => (
	<CorvuTooltip open openDelay={0} onOpenChange={noop}>
		<CorvuTooltip.Anchor>
			<CorvuTooltip.Trigger>Hover me</CorvuTooltip.Trigger>
		</CorvuTooltip.Anchor>
		<CorvuTooltip.Portal>
			<CorvuTooltip.Content>Helpful hint</CorvuTooltip.Content>
		</CorvuTooltip.Portal>
	</CorvuTooltip>
);

// ---------------------------------------------------------------------------
// Registries consumed by the benchmark files.
// ---------------------------------------------------------------------------

export type Variant = { lib: string; Component: () => JSX.Element };

/** Inline-rendering scenarios — safe for SSR (no portals). */
export const inlineScenarios: Record<string, Variant[]> = {
	Switch: [
		{ lib: 'wire', Component: WireSwitchScenario },
		{ lib: 'kobalte', Component: KobalteSwitchScenario },
	],
	Tabs: [
		{ lib: 'wire', Component: WireTabsScenario },
		{ lib: 'kobalte', Component: KobalteTabsScenario },
	],
	Accordion: [
		{ lib: 'wire', Component: WireAccordionScenario },
		{ lib: 'kobalte', Component: KobalteAccordionScenario },
		{ lib: 'corvu', Component: CorvuAccordionScenario },
	],
};

/** Portal-rendering scenarios — mount only. */
export const portalScenarios: Record<string, Variant[]> = {
	Dialog: [
		{ lib: 'wire', Component: WireDialogScenario },
		{ lib: 'kobalte', Component: KobalteDialogScenario },
		{ lib: 'corvu', Component: CorvuDialogScenario },
	],
	Tooltip: [
		{ lib: 'wire', Component: WireTooltipScenario },
		{ lib: 'kobalte', Component: KobalteTooltipScenario },
		{ lib: 'corvu', Component: CorvuTooltipScenario },
	],
};
