/**
 * Equivalent component trees implemented three ways — Wire UI, Radix Vue, and
 * Headless UI — so the benchmark suites render the *same* scenario across all
 * three libraries. Keep the structure (number of triggers, panels, items)
 * identical between variants so the comparison is apples-to-apples.
 *
 * Components are defined as setup-function components returning render functions
 * so everything lives in a single .ts file (no .vue template syntax needed).
 */
import { defineComponent, h, type Component } from 'vue';

// Wire UI
import { Switch, Tabs, Accordion, Modal, Tooltip } from '../src';

// Radix Vue
import {
	SwitchRoot as RxSwitchRoot,
	SwitchThumb as RxSwitchThumb,
	TabsRoot as RxTabsRoot,
	TabsList as RxTabsList,
	TabsTrigger as RxTabsTrigger,
	TabsContent as RxTabsContent,
	AccordionRoot as RxAccordionRoot,
	AccordionItem as RxAccordionItem,
	AccordionHeader as RxAccordionHeader,
	AccordionTrigger as RxAccordionTrigger,
	AccordionContent as RxAccordionContent,
	DialogRoot as RxDialogRoot,
	DialogPortal as RxDialogPortal,
	DialogOverlay as RxDialogOverlay,
	DialogContent as RxDialogContent,
	DialogTitle as RxDialogTitle,
	DialogClose as RxDialogClose,
	TooltipProvider as RxTooltipProvider,
	TooltipRoot as RxTooltipRoot,
	TooltipTrigger as RxTooltipTrigger,
	TooltipPortal as RxTooltipPortal,
	TooltipContent as RxTooltipContent,
} from 'radix-vue';

// Headless UI
import {
	Switch as HuiSwitch,
	TabGroup as HuiTabGroup,
	TabList as HuiTabList,
	Tab as HuiTab,
	TabPanels as HuiTabPanels,
	TabPanel as HuiTabPanel,
	Disclosure as HuiDisclosure,
	DisclosureButton as HuiDisclosureButton,
	DisclosurePanel as HuiDisclosurePanel,
	Dialog as HuiDialog,
	DialogPanel as HuiDialogPanel,
	DialogTitle as HuiDialogTitle,
} from '@headlessui/vue';

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

export const WireSwitchScenario = defineComponent(() => () =>
	h(Switch.Root, { checked: true, onChange: noop, 'aria-label': 'Notifications' }, {
		default: () => h(Switch.Thumb),
	})
);

export const RadixSwitchScenario = defineComponent(() => () =>
	h(RxSwitchRoot, { checked: true, 'onUpdate:checked': noop, 'aria-label': 'Notifications' }, {
		default: () => h(RxSwitchThumb),
	})
);

// Headless UI Switch uses v-model → modelValue / onUpdate:modelValue.
export const HeadlessSwitchScenario = defineComponent(() => () =>
	h(HuiSwitch, { modelValue: true, 'onUpdate:modelValue': noop, 'aria-label': 'Notifications' }, {
		default: () => h('span'),
	})
);

// ---------------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------------

export const WireTabsScenario = defineComponent(() => () =>
	h(Tabs.Root, { defaultValue: 'overview' }, {
		default: () => [
			h(Tabs.List, {}, {
				default: () => TABS.map((t) =>
					h(Tabs.Trigger, { key: t.value, value: t.value }, { default: () => t.label })
				),
			}),
			...TABS.map((t) =>
				h(Tabs.Content, { key: t.value, value: t.value }, { default: () => t.body })
			),
		],
	})
);

export const RadixTabsScenario = defineComponent(() => () =>
	h(RxTabsRoot, { defaultValue: 'overview' }, {
		default: () => [
			h(RxTabsList, {}, {
				default: () => TABS.map((t) =>
					h(RxTabsTrigger, { key: t.value, value: t.value }, { default: () => t.label })
				),
			}),
			...TABS.map((t) =>
				h(RxTabsContent, { key: t.value, value: t.value }, { default: () => t.body })
			),
		],
	})
);

export const HeadlessTabsScenario = defineComponent(() => () =>
	h(HuiTabGroup, {}, {
		default: () => [
			h(HuiTabList, {}, {
				default: () => TABS.map((t) =>
					h(HuiTab, { key: t.value }, { default: () => t.label })
				),
			}),
			h(HuiTabPanels, {}, {
				default: () => TABS.map((t) =>
					h(HuiTabPanel, { key: t.value }, { default: () => t.body })
				),
			}),
		],
	})
);

// ---------------------------------------------------------------------------
// Accordion
// ---------------------------------------------------------------------------

export const WireAccordionScenario = defineComponent(() => () =>
	h(Accordion.Root, { type: 'single', defaultValue: 'shipping', collapsible: true }, {
		default: () => FAQS.map((f) =>
			h(Accordion.Item, { key: f.value, value: f.value }, {
				default: () => [
					h(Accordion.Trigger, {}, { default: () => f.q }),
					h(Accordion.Content, {}, { default: () => f.a }),
				],
			})
		),
	})
);

export const RadixAccordionScenario = defineComponent(() => () =>
	h(RxAccordionRoot, { type: 'single', defaultValue: 'shipping', collapsible: true }, {
		default: () => FAQS.map((f) =>
			h(RxAccordionItem, { key: f.value, value: f.value }, {
				default: () => [
					h(RxAccordionHeader, {}, {
						default: () => h(RxAccordionTrigger, {}, { default: () => f.q }),
					}),
					h(RxAccordionContent, {}, { default: () => f.a }),
				],
			})
		),
	})
);

// Headless UI has no Accordion primitive; the idiomatic equivalent is a stack
// of Disclosure components.
export const HeadlessAccordionScenario = defineComponent(() => () =>
	h('div', {}, FAQS.map((f) =>
		h(HuiDisclosure, { key: f.value, defaultOpen: f.value === 'shipping' }, {
			default: () => [
				h(HuiDisclosureButton, {}, { default: () => f.q }),
				h(HuiDisclosurePanel, {}, { default: () => f.a }),
			],
		})
	))
);

// ---------------------------------------------------------------------------
// Dialog / Modal (open — mount benchmarks only; uses portals)
// ---------------------------------------------------------------------------

export const WireDialogScenario = defineComponent(() => () =>
	h(Modal.Root, { open: true, onOpenChange: noop }, {
		default: () =>
			h(Modal.Portal, {}, {
				default: () =>
					h(Modal.Overlay, {}, {
						default: () =>
							h(Modal.Content, {}, {
								default: () => [
									h('p', {}, 'Are you sure you want to continue?'),
									h(Modal.Close, {}, { default: () => 'Confirm' }),
								],
							}),
					}),
			}),
	})
);

export const RadixDialogScenario = defineComponent(() => () =>
	h(RxDialogRoot, { open: true, 'onUpdate:open': noop }, {
		default: () =>
			h(RxDialogPortal, {}, {
				default: () => [
					h(RxDialogOverlay),
					h(RxDialogContent, {}, {
						default: () => [
							h(RxDialogTitle, {}, { default: () => 'Confirm' }),
							h('p', {}, 'Are you sure you want to continue?'),
							h(RxDialogClose, {}, { default: () => 'Confirm' }),
						],
					}),
				],
			}),
	})
);

export const HeadlessDialogScenario = defineComponent(() => () =>
	h(HuiDialog, { open: true, onClose: noop }, {
		default: () =>
			h(HuiDialogPanel, {}, {
				default: () => [
					h(HuiDialogTitle, {}, { default: () => 'Confirm' }),
					h('p', {}, 'Are you sure you want to continue?'),
					h('button', { onClick: noop }, 'Confirm'),
				],
			}),
	})
);

// ---------------------------------------------------------------------------
// Tooltip (open — mount benchmarks only; uses portals). Headless UI has no
// tooltip primitive, so only Wire and Radix are compared.
// ---------------------------------------------------------------------------

export const WireTooltipScenario = defineComponent(() => () =>
	h(Tooltip.Root, { defaultOpen: true, delayDuration: 0 }, {
		default: () => [
			h(Tooltip.Trigger, {}, { default: () => 'Hover me' }),
			h(Tooltip.Content, { side: 'top' }, { default: () => 'Helpful hint' }),
		],
	})
);

export const RadixTooltipScenario = defineComponent(() => () =>
	h(RxTooltipProvider, {}, {
		default: () =>
			h(RxTooltipRoot, { defaultOpen: true, delayDuration: 0 }, {
				default: () => [
					h(RxTooltipTrigger, {}, { default: () => 'Hover me' }),
					h(RxTooltipPortal, {}, {
						default: () =>
							h(RxTooltipContent, { side: 'top' }, { default: () => 'Helpful hint' }),
					}),
				],
			}),
	})
);

// ---------------------------------------------------------------------------
// Registries consumed by the benchmark files.
// ---------------------------------------------------------------------------

export type Variant = { lib: string; Component: Component };

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
