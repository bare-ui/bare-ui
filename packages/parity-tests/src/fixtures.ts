// Canonical fixture specs. Each framework builds its fixture from these exact
// labels/values so the shared scenarios can query by the same accessible names.
// Exporting them as the single source keeps the three frameworks from drifting.

export const ACCORDION = {
	items: [
		{ value: 'item-1', trigger: 'Section 1', content: 'Content 1' },
		{ value: 'item-2', trigger: 'Section 2', content: 'Content 2' },
		{ value: 'item-3', trigger: 'Section 3', content: 'Content 3' },
	],
} as const

export const TABS = {
	defaultValue: 'one',
	tabs: [
		{ value: 'one', label: 'One', panel: 'Panel One', disabled: false },
		{ value: 'two', label: 'Two', panel: 'Panel Two', disabled: false },
		{ value: 'three', label: 'Three', panel: 'Panel Three', disabled: true },
	],
} as const

export type AccordionFixture = 'single' | 'multiple'
export type TabsFixture = 'default'
export type SwitchFixture = 'default' | 'defaultOn' | 'disabled'
