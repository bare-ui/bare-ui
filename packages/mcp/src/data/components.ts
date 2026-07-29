import type { ComponentData } from "./types.js";

// ────────────────────────────────────────────────────────────────────
// Wire UI 0.5 component catalog — React, Solid, Vue
//
// The three libraries are kept at full parity: every component here ships in
// all three packages with the same parts, props, and data-* contract. Only the
// authoring syntax differs:
//   - Solid: signals (createSignal), call signal as function in JSX (value())
//   - Vue: SFC template syntax, kebab-case props (:default-value), ref() values
//
// Every entry must list all three framework snippets. If you find yourself
// writing "React only", the catalog is out of date — check the library first.
// ────────────────────────────────────────────────────────────────────

export const components: ComponentData[] = [
	// ─── Form ───────────────────────────────────────────────────────────

	{
		name: "Button",
		category: "form",
		description:
			"Unstyled button primitive with interactive data attributes and asChild polymorphism.",
		isCompound: false,
		parts: [],
		props: {
			Button: [
				{
					name: "asChild",
					type: "boolean",
					required: false,
					description:
						"Merge behaviour onto a child element instead of rendering a <button>.",
				},
				{
					name: "disabled",
					type: "boolean",
					required: false,
					description: "Disables the button and sets data-disabled.",
				},
				{
					name: "autoFocus",
					type: "boolean",
					required: false,
					description: "Auto-focus the button on mount.",
				},
			],
		},
		dataAttributes: [
			{
				name: "data-hover",
				description: "Present when the mouse is over the button.",
			},
			{
				name: "data-focus-visible",
				description: "Present on keyboard focus.",
			},
			{
				name: "data-active",
				description: "Present while the button is pressed.",
			},
			{
				name: "data-disabled",
				description: "Present when the button is disabled.",
			},
			{
				name: "data-autofocus",
				description: "Present when autoFocus is set.",
			},
		],
		frameworks: {
			react: {
				importStatement: "import { Button } from '@wire-ui/react'",
				basicExample: `<Button>Click me</Button>`,
			},
			solid: {
				importStatement: "import { Button } from '@wire-ui/solid'",
				basicExample: `<Button>Click me</Button>`,
			},
			vue: {
				importStatement: "import { Button } from '@wire-ui/vue'",
				basicExample: `<template>
  <Button>Click me</Button>
</template>`,
			},
		},
		notes: [
			'Button defaults to type="button" to prevent accidental form submission. Do not expect type="submit" behaviour without explicitly setting it.',
		],
	},

	{
		name: "Input",
		category: "form",
		description:
			"Compound text input with label, field, and error parts. Validation is consumer-controlled.",
		isCompound: true,
		parts: ["Root", "Label", "Field", "Error"],
		props: {
			Root: [
				{
					name: "value",
					type: "string",
					required: false,
					description: "Controlled input value.",
				},
				{
					name: "defaultValue",
					type: "string",
					required: false,
					description: "Initial input value (uncontrolled).",
				},
				{
					name: "onChange",
					type: "(value: string) => void",
					required: false,
					description: "Called with the new value on every change.",
				},
				{
					name: "onFocus",
					type: "() => void",
					required: false,
					description: "Called when the field gains focus.",
				},
				{
					name: "onBlur",
					type: "() => void",
					required: false,
					description: "Called when the field loses focus.",
				},
				{
					name: "invalidType",
					type: "string",
					required: false,
					description:
						"Set by the consumer to show an error state; use the matching key in errorMessage to display the message (also sets data-invalid on the field).",
				},
				{
					name: "errorMessage",
					type: "Record<string, string>",
					required: false,
					description:
						"Map of invalidType keys to the error message shown for each (rendered by Input.Error).",
				},
				{
					name: "isRequired",
					type: "boolean",
					required: false,
					description: "Mark the field as required.",
				},
				{
					name: "isSuccess",
					type: "boolean",
					required: false,
					description:
						"Show a success (valid) state; sets data-success on the field.",
				},
				{
					name: "id",
					type: "string",
					required: false,
					description:
						"Id applied to the input; auto-generated when omitted.",
				},
			],
		},
		dataAttributes: [
			{
				name: "data-active",
				description:
					"Present while the field is being interacted with.",
				appliesTo: "Field",
			},
			{
				name: "data-invalid",
				description: "Present when invalidType is set.",
				appliesTo: "Field",
			},
			{
				name: "data-success",
				description: "Present when isSuccess is true.",
				appliesTo: "Field",
			},
		],
		frameworks: {
			react: {
				importStatement: "import { Input } from '@wire-ui/react'",
				basicExample: `<Input.Root value={value} onChange={setValue}>
  <Input.Label>Email</Input.Label>
  <Input.Field type="email" placeholder="you@example.com" />
  <Input.Error />
</Input.Root>`,
			},
			solid: {
				importStatement: "import { Input } from '@wire-ui/solid'",
				basicExample: `<Input.Root value={value()} onChange={setValue}>
  <Input.Label>Email</Input.Label>
  <Input.Field type="email" placeholder="you@example.com" />
  <Input.Error />
</Input.Root>`,
			},
			vue: {
				importStatement: "import { Input } from '@wire-ui/vue'",
				basicExample: `<template>
  <Input.Root :value="value" @change="value = $event">
    <Input.Label>Email</Input.Label>
    <Input.Field type="email" placeholder="you@example.com" />
    <Input.Error />
  </Input.Root>
</template>`,
			},
		},
		notes: [
			"Validation is consumer-controlled. Do not expect the component to validate internally; set invalidType from your own validation logic.",
		],
	},

	{
		name: "Textarea",
		category: "form",
		description:
			"Compound textarea with the same API as Input but renders a <textarea> element.",
		isCompound: true,
		parts: ["Root", "Label", "Field", "Error"],
		props: {
			Root: [
				{
					name: "value",
					type: "string",
					required: false,
					description: "Controlled textarea value.",
				},
				{
					name: "defaultValue",
					type: "string",
					required: false,
					description: "Initial textarea value (uncontrolled).",
				},
				{
					name: "onChange",
					type: "(value: string) => void",
					required: false,
					description: "Called with the new value on every change.",
				},
				{
					name: "onFocus",
					type: "() => void",
					required: false,
					description: "Called when the field gains focus.",
				},
				{
					name: "onBlur",
					type: "() => void",
					required: false,
					description: "Called when the field loses focus.",
				},
				{
					name: "invalidType",
					type: "string",
					required: false,
					description:
						"Set by the consumer to show an error state; use the matching key in errorMessage to display the message (also sets data-invalid on the field).",
				},
				{
					name: "errorMessage",
					type: "Record<string, string>",
					required: false,
					description:
						"Map of invalidType keys to the error message shown for each (rendered by Textarea.Error).",
				},
				{
					name: "isRequired",
					type: "boolean",
					required: false,
					description: "Mark the field as required.",
				},
				{
					name: "isSuccess",
					type: "boolean",
					required: false,
					description:
						"Show a success (valid) state; sets data-success on the field.",
				},
				{
					name: "id",
					type: "string",
					required: false,
					description:
						"Id applied to the textarea; auto-generated when omitted.",
				},
			],
		},
		dataAttributes: [
			{
				name: "data-active",
				description:
					"Present while the field is being interacted with.",
				appliesTo: "Field",
			},
			{
				name: "data-invalid",
				description: "Present when invalidType is set.",
				appliesTo: "Field",
			},
			{
				name: "data-success",
				description: "Present when isSuccess is true.",
				appliesTo: "Field",
			},
		],
		frameworks: {
			react: {
				importStatement: "import { Textarea } from '@wire-ui/react'",
				basicExample: `<Textarea.Root>
  <Textarea.Label>Message</Textarea.Label>
  <Textarea.Field rows={4} placeholder="Write something..." />
  <Textarea.Error />
</Textarea.Root>`,
			},
			solid: {
				importStatement: "import { Textarea } from '@wire-ui/solid'",
				basicExample: `<Textarea.Root>
  <Textarea.Label>Message</Textarea.Label>
  <Textarea.Field rows={4} placeholder="Write something..." />
  <Textarea.Error />
</Textarea.Root>`,
			},
			vue: {
				importStatement: "import { Textarea } from '@wire-ui/vue'",
				basicExample: `<template>
  <Textarea.Root>
    <Textarea.Label>Message</Textarea.Label>
    <Textarea.Field :rows="4" placeholder="Write something..." />
    <Textarea.Error />
  </Textarea.Root>
</template>`,
			},
		},
		notes: ["Validation is consumer-controlled, same as Input."],
	},

	{
		name: "Password",
		category: "form",
		description:
			"Compound password input with a visibility toggle and error display.",
		isCompound: true,
		parts: ["Root", "Label", "Field", "Toggle", "Error"],
		props: {
			Root: [
				{
					name: "value",
					type: "string",
					required: false,
					description: "Controlled value.",
				},
				{
					name: "defaultValue",
					type: "string",
					required: false,
					description: "Uncontrolled default value.",
				},
				{
					name: "onChange",
					type: "(value: string) => void",
					required: false,
					description: "Called when the value changes.",
				},
				{
					name: "invalidType",
					type: "string",
					required: false,
					description: "Consumer-controlled error key.",
				},
				{
					name: "errorMessage",
					type: "Record<string, string>",
					required: false,
					description: "Map of invalidType keys to error messages.",
				},
				{
					name: "isRequired",
					type: "boolean",
					required: false,
					description: "Marks the field as required.",
				},
				{
					name: "onFocus",
					type: "() => void",
					required: false,
					description: "Called when the field gains focus.",
				},
				{
					name: "onBlur",
					type: "() => void",
					required: false,
					description: "Called when the field loses focus.",
				},
			],
		},
		dataAttributes: [
			{
				name: "data-visible",
				description: "Present on Toggle when the password is shown.",
				appliesTo: "Toggle",
			},
			{
				name: "data-invalid",
				description: "Present when invalidType is set.",
				appliesTo: "Field",
			},
		],
		frameworks: {
			react: {
				importStatement: "import { Password } from '@wire-ui/react'",
				basicExample: `<Password.Root>
  <Password.Label>Password</Password.Label>
  <Password.Field placeholder="••••••••" />
  <Password.Toggle />
  <Password.Error />
</Password.Root>`,
			},
			solid: {
				importStatement: "import { Password } from '@wire-ui/solid'",
				basicExample: `<Password.Root>
  <Password.Label>Password</Password.Label>
  <Password.Field placeholder="••••••••" />
  <Password.Toggle />
  <Password.Error />
</Password.Root>`,
			},
			vue: {
				importStatement: "import { Password } from '@wire-ui/vue'",
				basicExample: `<template>
  <Password.Root>
    <Password.Label>Password</Password.Label>
    <Password.Field placeholder="••••••••" />
    <Password.Toggle />
    <Password.Error />
  </Password.Root>
</template>`,
			},
		},
		notes: ["Validation is consumer-controlled, same as Input."],
	},

	{
		name: "Checkbox",
		category: "form",
		description:
			"Compound checkbox group supporting multi-select with indicator and label parts.",
		isCompound: true,
		parts: ["Root", "Item", "Indicator", "Label"],
		props: {
			Root: [
				{
					name: "value",
					type: "(string | number)[]",
					required: false,
					description: "Controlled list of checked item values.",
				},
				{
					name: "defaultValue",
					type: "(string | number)[]",
					required: false,
					description:
						"Initially checked item values (uncontrolled).",
				},
				{
					name: "onChange",
					type: "(value: (string | number)[]) => void",
					required: false,
					description:
						"Called with the new list of checked values whenever the selection changes.",
				},
				{
					name: "name",
					type: "string",
					required: false,
					description:
						"Form field name shared by every checkbox in the group.",
				},
			],
			Item: [
				{
					name: "value",
					type: "string | number",
					required: true,
					description:
						"This item's value; added to the group's value array while checked.",
				},
				{
					name: "disabled",
					type: "boolean",
					required: false,
					description: "Disable this checkbox item.",
				},
				{
					name: "indeterminate",
					type: "boolean",
					required: false,
					description:
						'Show the mixed/partial state (e.g. a "select all" that is only partly checked). Sets the native input\'s indeterminate property so assistive tech announces aria-checked="mixed".',
				},
			],
		},
		dataAttributes: [
			{
				name: "data-checked",
				description:
					"Present when the item is checked. Indicator only renders while checked, so it always carries this.",
				appliesTo: "Item, Indicator",
			},
			{
				name: "data-indeterminate",
				description: "Present when the item is in the indeterminate state.",
				appliesTo: "Item",
			},
			{
				name: "data-hover",
				description: "Present when the pointer is over the item.",
				appliesTo: "Item",
			},
			{
				name: "data-focus-visible",
				description: "Present on keyboard focus.",
				appliesTo: "Item",
			},
			{
				name: "data-active",
				description: "Present while the item is pressed.",
				appliesTo: "Item",
			},
			{
				name: "data-disabled",
				description: "Present when the item is disabled.",
				appliesTo: "Item, Label",
			},
		],
		frameworks: {
			react: {
				importStatement: "import { Checkbox } from '@wire-ui/react'",
				basicExample: `<Checkbox.Root value={selected} onChange={setSelected}>
  <Checkbox.Item value="a">
    <Checkbox.Indicator>✓</Checkbox.Indicator>
    <Checkbox.Label>Option A</Checkbox.Label>
  </Checkbox.Item>
</Checkbox.Root>`,
			},
			solid: {
				importStatement: "import { Checkbox } from '@wire-ui/solid'",
				basicExample: `<Checkbox.Root value={selected()} onChange={setSelected}>
  <Checkbox.Item value="a">
    <Checkbox.Indicator>✓</Checkbox.Indicator>
    <Checkbox.Label>Option A</Checkbox.Label>
  </Checkbox.Item>
</Checkbox.Root>`,
			},
			vue: {
				importStatement: "import { Checkbox } from '@wire-ui/vue'",
				basicExample: `<template>
  <Checkbox.Root :value="selected" @change="selected = $event">
    <Checkbox.Item value="a">
      <Checkbox.Indicator>✓</Checkbox.Indicator>
      <Checkbox.Label>Option A</Checkbox.Label>
    </Checkbox.Item>
  </Checkbox.Root>
</template>`,
			},
		},
	},

	{
		name: "Radio",
		category: "form",
		description:
			"Compound radio group for single selection with indicator and label parts.",
		isCompound: true,
		parts: ["Root", "Item", "Indicator", "Label"],
		props: {
			Root: [
				{
					name: "value",
					type: "string | number",
					required: false,
					description: "Controlled selected value.",
				},
				{
					name: "defaultValue",
					type: "string | number",
					required: false,
					description: "Initially selected value (uncontrolled).",
				},
				{
					name: "onChange",
					type: "(value: string | number) => void",
					required: false,
					description: "Called with the newly selected value.",
				},
				{
					name: "name",
					type: "string",
					required: false,
					description:
						"Form field name shared by every radio in the group.",
				},
			],
			Item: [
				{
					name: "value",
					type: "string | number",
					required: true,
					description:
						"This item's value; becomes the group's value when selected.",
				},
				{
					name: "disabled",
					type: "boolean",
					required: false,
					description: "Disable this radio item.",
				},
			],
		},
		dataAttributes: [
			{
				name: "data-checked",
				description:
					"Present when the item is selected. Indicator only renders while selected, so it always carries this.",
				appliesTo: "Item, Indicator",
			},
			{
				name: "data-hover",
				description: "Present when the pointer is over the item.",
				appliesTo: "Item",
			},
			{
				name: "data-focus-visible",
				description: "Present on keyboard focus.",
				appliesTo: "Item",
			},
			{
				name: "data-active",
				description: "Present while the item is pressed.",
				appliesTo: "Item",
			},
			{
				name: "data-disabled",
				description: "Present when the item is disabled.",
				appliesTo: "Item, Label",
			},
		],
		frameworks: {
			react: {
				importStatement: "import { Radio } from '@wire-ui/react'",
				basicExample: `<Radio.Root value={selected} onChange={setSelected} name="options">
  <Radio.Item value="a">
    <Radio.Indicator />
    <Radio.Label>Option A</Radio.Label>
  </Radio.Item>
</Radio.Root>`,
			},
			solid: {
				importStatement: "import { Radio } from '@wire-ui/solid'",
				basicExample: `<Radio.Root value={selected()} onChange={setSelected} name="options">
  <Radio.Item value="a">
    <Radio.Indicator />
    <Radio.Label>Option A</Radio.Label>
  </Radio.Item>
</Radio.Root>`,
			},
			vue: {
				importStatement: "import { Radio } from '@wire-ui/vue'",
				basicExample: `<template>
  <Radio.Root :value="selected" @change="selected = $event" name="options">
    <Radio.Item value="a">
      <Radio.Indicator />
      <Radio.Label>Option A</Radio.Label>
    </Radio.Item>
  </Radio.Root>
</template>`,
			},
		},
	},

	{
		name: "Switch",
		category: "form",
		description:
			"Compound toggle switch with a thumb indicator for on/off state.",
		isCompound: true,
		parts: ["Root", "Thumb"],
		props: {
			Root: [
				{
					name: "checked",
					type: "boolean",
					required: false,
					description: "Controlled checked state.",
				},
				{
					name: "defaultChecked",
					type: "boolean",
					required: false,
					description: "Initial checked state (uncontrolled).",
				},
				{
					name: "onChange",
					type: "(checked: boolean) => void",
					required: false,
					description: "Called when the switch is toggled.",
				},
				{
					name: "disabled",
					type: "boolean",
					required: false,
					description: "Disables the switch.",
				},
			],
		},
		dataAttributes: [
			{
				name: "data-checked",
				description: "Present when the switch is on.",
				appliesTo: "Root, Thumb",
			},
			{
				name: "data-hover",
				description: "Present when the pointer is over the switch.",
				appliesTo: "Root",
			},
			{
				name: "data-focus-visible",
				description: "Present on keyboard focus.",
				appliesTo: "Root",
			},
			{
				name: "data-active",
				description: "Present while the switch is pressed.",
				appliesTo: "Root",
			},
			{
				name: "data-disabled",
				description: "Present when the switch is disabled.",
				appliesTo: "Root, Thumb",
			},
		],
		frameworks: {
			react: {
				importStatement: "import { Switch } from '@wire-ui/react'",
				basicExample: `<Switch.Root checked={on} onChange={setOn}>
  <Switch.Thumb />
</Switch.Root>`,
			},
			solid: {
				importStatement: "import { Switch } from '@wire-ui/solid'",
				basicExample: `<Switch.Root checked={on()} onChange={setOn}>
  <Switch.Thumb />
</Switch.Root>`,
			},
			vue: {
				importStatement: "import { Switch } from '@wire-ui/vue'",
				basicExample: `<template>
  <Switch.Root :checked="on" @checked-change="on = $event">
    <Switch.Thumb />
  </Switch.Root>
</template>`,
			},
		},
	},

	{
		name: "Select",
		category: "form",
		description:
			"Compound dropdown select with trigger, content, and item parts.",
		isCompound: true,
		parts: [
			"Root",
			"Trigger",
			"Value",
			"Content",
			"Item",
			"Group",
			"GroupLabel",
			"Separator",
		],
		props: {
			Root: [
				{
					name: "value",
					type: "string",
					required: false,
					description: "Controlled selected value.",
				},
				{
					name: "defaultValue",
					type: "string",
					required: false,
					description: "Initial selected value (uncontrolled).",
				},
				{
					name: "onChange",
					type: "(value: string) => void",
					required: false,
					description: "Called when the selection changes.",
				},
			],
			Value: [
				{
					name: "placeholder",
					type: "string",
					required: false,
					description: "Placeholder text when no value is selected.",
				},
			],
			Item: [
				{
					name: "value",
					type: "string",
					required: true,
					description: "The value for this item.",
				},
				{
					name: "disabled",
					type: "boolean",
					required: false,
					description: "Disables the item.",
				},
				{
					name: "textValue",
					type: "string",
					required: false,
					description:
						"Override the display label used in the trigger and for typeahead. Defaults to the item's string children.",
				},
			],
		},
		dataAttributes: [
			{
				name: "data-state",
				description:
					"Open/closed state. Content only renders while open, so it always reads \"open\".",
				values: '"open" | "closed"',
				appliesTo: "Trigger, Content",
			},
			{
				name: "data-open",
				description: "Present on the root while the dropdown is open.",
				appliesTo: "Root",
			},
			{
				name: "data-placeholder",
				description: "Present while no option is selected.",
				appliesTo: "Value",
			},
			{
				name: "data-selected",
				description: "Present on the currently selected item.",
				appliesTo: "Item",
			},
			{
				name: "data-highlighted",
				description:
					"Present on the item referenced by aria-activedescendant — the keyboard-highlighted option. Distinct from data-active, which is the pressed state.",
				appliesTo: "Item",
			},
			{
				name: "data-hover",
				description: "Present when the pointer is over the element.",
				appliesTo: "Trigger, Item",
			},
			{
				name: "data-focus-visible",
				description: "Present on keyboard focus.",
				appliesTo: "Trigger, Item",
			},
			{
				name: "data-active",
				description: "Present while the element is pressed.",
				appliesTo: "Trigger, Item",
			},
			{
				name: "data-disabled",
				description: "Present when the element is disabled.",
				appliesTo: "Root, Trigger, Item",
			},
		],
		frameworks: {
			react: {
				importStatement: "import { Select } from '@wire-ui/react'",
				basicExample: `<Select.Root value={value} onChange={setValue}>
  <Select.Trigger>
    <Select.Value placeholder="Pick one" />
  </Select.Trigger>
  <Select.Content>
    <Select.Item value="a">Option A</Select.Item>
    <Select.Item value="b">Option B</Select.Item>
  </Select.Content>
</Select.Root>`,
			},
			solid: {
				importStatement: "import { Select } from '@wire-ui/solid'",
				basicExample: `<Select.Root value={value()} onChange={setValue}>
  <Select.Trigger>
    <Select.Value placeholder="Pick one" />
  </Select.Trigger>
  <Select.Content>
    <Select.Item value="a">Option A</Select.Item>
    <Select.Item value="b">Option B</Select.Item>
  </Select.Content>
</Select.Root>`,
			},
			vue: {
				importStatement: "import { Select } from '@wire-ui/vue'",
				basicExample: `<template>
  <Select.Root :value="value" @change="value = $event">
    <Select.Trigger>
      <Select.Value placeholder="Pick one" />
    </Select.Trigger>
    <Select.Content>
      <Select.Item value="a">Option A</Select.Item>
      <Select.Item value="b">Option B</Select.Item>
    </Select.Content>
  </Select.Root>
</template>`,
			},
		},
	},

	{
		name: "Search",
		category: "form",
		description:
			"Compound search input with async results list, keyboard navigation, and empty state.",
		isCompound: true,
		parts: ["Root", "Input", "Content", "Item", "Empty"],
		props: {
			Root: [
				{
					name: "open",
					type: "boolean",
					required: false,
					description:
						"Controlled open state of the results popover.",
				},
				{
					name: "defaultOpen",
					type: "boolean",
					required: false,
					description:
						"Initial open state of the results popover (uncontrolled).",
				},
				{
					name: "onOpenChange",
					type: "(open: boolean) => void",
					required: false,
					description:
						"Called when the results popover opens or closes.",
				},
				{
					name: "value",
					type: "string",
					required: false,
					description: "Controlled search input value.",
				},
				{
					name: "defaultSearchValue",
					type: "string",
					required: false,
					description: "Initial search input value (uncontrolled).",
				},
				{
					name: "onSearchChange",
					type: "(value: string) => void",
					required: false,
					description:
						"Called when the search text changes, debounced by searchDelay.",
				},
				{
					name: "onSelect",
					type: "(option: SearchOption) => void",
					required: false,
					description:
						"Called with the option the user chooses from the results.",
				},
				{
					name: "onSubmitSearch",
					type: "() => void",
					required: false,
					description:
						"Called when the user submits the search (Enter with no result highlighted).",
				},
				{
					name: "loading",
					type: "boolean",
					required: false,
					description:
						"Show a loading state while results are being fetched.",
				},
				{
					name: "searchDelay",
					type: "number",
					required: false,
					description:
						"Debounce delay in milliseconds before onSearchChange fires.",
				},
			],
			Item: [
				{
					name: "option",
					type: "SearchOption",
					required: true,
					description:
						"The option (id, title, optional subtitle) this result row represents.",
				},
				{
					name: "onClick",
					type: "(event: MouseEvent) => void",
					required: false,
					description:
						"Optional click handler; the item click already calls onSelect internally.",
				},
			],
		},
		dataAttributes: [
			{
				name: "data-highlighted",
				description: "Present on the keyboard-highlighted item.",
				appliesTo: "Item",
			},
			{
				name: "data-loading",
				description: "Present while results are loading.",
				appliesTo: "Root",
			},
			{
				name: "data-state",
				description:
					"Open/closed state of the results panel. Content only renders while open.",
				values: '"open" | "closed"',
				appliesTo: "Content",
			},
			{
				name: "data-hover",
				description: "Present when the pointer is over the item.",
				appliesTo: "Item",
			},
			{
				name: "data-focus-visible",
				description: "Present on keyboard focus.",
				appliesTo: "Item",
			},
			{
				name: "data-active",
				description: "Present while the item is pressed.",
				appliesTo: "Item",
			},
		],
		frameworks: {
			react: {
				importStatement: "import { Search } from '@wire-ui/react'",
				basicExample: `<Search.Root onSearchChange={setQuery} onSelect={(opt) => console.log(opt)}>
  <Search.Input placeholder="Search..." />
  <Search.Content>
    {results.map(r => (
      <Search.Item key={r.id} option={r}>{r.title}</Search.Item>
    ))}
    <Search.Empty>No results</Search.Empty>
  </Search.Content>
</Search.Root>`,
			},
			solid: {
				importStatement: "import { Search } from '@wire-ui/solid'",
				basicExample: `<Search.Root onSearchChange={setQuery} onSelect={(opt) => console.log(opt)}>
  <Search.Input placeholder="Search..." />
  <Search.Content>
    <For each={results()}>{(r) => (
      <Search.Item option={r}>{r.title}</Search.Item>
    )}</For>
    <Search.Empty>No results</Search.Empty>
  </Search.Content>
</Search.Root>`,
			},
			vue: {
				importStatement: "import { Search } from '@wire-ui/vue'",
				basicExample: `<template>
  <Search.Root @search-change="setQuery" @select="onSelect">
    <Search.Input placeholder="Search..." />
    <Search.Content>
      <Search.Item v-for="r in results" :key="r.id" :option="r">{{ r.title }}</Search.Item>
      <Search.Empty>No results</Search.Empty>
    </Search.Content>
  </Search.Root>
</template>`,
			},
		},
	},

	{
		name: "Combobox",
		category: "form",
		description:
			"Compound autocomplete combining an input with a filterable listbox. Supports async filtering.",
		isCompound: true,
		parts: ["Root", "Input", "Trigger", "Content", "Items", "Empty"],
		props: {
			Root: [
				{
					name: "options",
					type: "ComboboxOption[]",
					required: true,
					description:
						"Available options. ComboboxOption is { value: string; label: string; subtitle?: string; disabled?: boolean }.",
				},
				{
					name: "value",
					type: "string | null",
					required: false,
					description: "Controlled selected value. Use null for empty.",
				},
				{
					name: "defaultValue",
					type: "string | null",
					required: false,
					description: "Initial selected value (uncontrolled).",
				},
				{
					name: "onChange",
					type: "(value: string | null, option: ComboboxOption | null) => void",
					required: false,
					description:
						"Called when the selection changes. Receives both the value and the full option.",
				},
				{
					name: "inputValue",
					type: "string",
					required: false,
					description: "Controlled input text.",
				},
				{
					name: "defaultInputValue",
					type: "string",
					required: false,
					description: "Initial input text (uncontrolled).",
				},
				{
					name: "onInputChange",
					type: "(value: string) => void",
					required: false,
					description: "Called when the user types.",
				},
				{
					name: "filter",
					type: "(option: ComboboxOption, inputValue: string) => boolean",
					required: false,
					description:
						"Custom filter predicate. Defaults to a case-insensitive label match.",
				},
				{
					name: "open",
					type: "boolean",
					required: false,
					description: "Controlled open state.",
				},
				{
					name: "defaultOpen",
					type: "boolean",
					required: false,
					description: "Initial open state.",
				},
				{
					name: "onOpenChange",
					type: "(open: boolean) => void",
					required: false,
					description: "Called when the open state changes.",
				},
				{
					name: "disabled",
					type: "boolean",
					required: false,
					description: "Disable the entire combobox.",
				},
			],
			Items: [
				{
					name: "children",
					type: "(props: { option: ComboboxOption; highlighted: boolean; selected: boolean }) => ReactNode",
					required: true,
					description:
						"Render prop called once per filtered option. Wire UI renders the row element and its data attributes; you render the inner content.",
				},
			],
		},
		dataAttributes: [
			{
				name: "data-state",
				description: "Open/closed state.",
				values: '"open" | "closed"',
				appliesTo: "Root, Content, Empty",
			},
			{
				name: "data-highlighted",
				description: "Present on the keyboard-highlighted row.",
				appliesTo: "Items row",
			},
			{
				name: "data-selected",
				description: "Present on the currently selected row.",
				appliesTo: "Items row",
			},
			{
				name: "data-disabled",
				description:
					"Present on the root when disabled, and on any row whose option is disabled.",
				appliesTo: "Root, Items row",
			},
		],
		frameworks: {
			react: {
				importStatement: "import { Combobox } from '@wire-ui/react'",
				basicExample: `<Combobox.Root options={options} value={value} onChange={setValue}>
  <Combobox.Input placeholder="Type to filter..." />
  <Combobox.Trigger>▾</Combobox.Trigger>
  <Combobox.Content>
    <Combobox.Items>
      {({ option }) => <div>{option.label}</div>}
    </Combobox.Items>
    <Combobox.Empty>No matches</Combobox.Empty>
  </Combobox.Content>
</Combobox.Root>`,
			},
			solid: {
				importStatement: "import { Combobox } from '@wire-ui/solid'",
				basicExample: `<Combobox.Root options={options()} value={value()} onChange={setValue}>
  <Combobox.Input placeholder="Type to filter..." />
  <Combobox.Trigger>▾</Combobox.Trigger>
  <Combobox.Content>
    <Combobox.Items>
      {({ option }) => <div>{option.label}</div>}
    </Combobox.Items>
    <Combobox.Empty>No matches</Combobox.Empty>
  </Combobox.Content>
</Combobox.Root>`,
			},
			vue: {
				importStatement: "import { Combobox } from '@wire-ui/vue'",
				basicExample: `<template>
  <Combobox.Root :options="options" :value="value" @change="value = $event">
    <Combobox.Input placeholder="Type to filter..." />
    <Combobox.Trigger>▾</Combobox.Trigger>
    <Combobox.Content>
      <Combobox.Items v-slot="{ option }">
        <div>{{ option.label }}</div>
      </Combobox.Items>
      <Combobox.Empty>No matches</Combobox.Empty>
    </Combobox.Content>
  </Combobox.Root>
</template>`,
			},
		},
	},

	{
		name: "NumberInput",
		category: "form",
		description:
			"Compound numeric input with increment and decrement controls.",
		isCompound: true,
		parts: ["Root", "Field", "Increment", "Decrement"],
		props: {
			Root: [
				{
					name: "value",
					type: "number",
					required: false,
					description: "Controlled numeric value.",
				},
				{
					name: "defaultValue",
					type: "number",
					required: false,
					description: "Uncontrolled default value.",
				},
				{
					name: "onChange",
					type: "(value: number) => void",
					required: false,
					description: "Called when the value changes.",
				},
				{
					name: "min",
					type: "number",
					required: false,
					description: "Minimum value.",
				},
				{
					name: "max",
					type: "number",
					required: false,
					description: "Maximum value.",
				},
				{
					name: "step",
					type: "number",
					required: false,
					description: "Step amount for increment/decrement.",
					defaultValue: "1",
				},
				{
					name: "readOnly",
					type: "boolean",
					required: false,
					description:
						"Disables the field for direct input but still allows the buttons.",
				},
				{
					name: "disabled",
					type: "boolean",
					required: false,
					description: "Disable the field and both stepper buttons.",
				},
				{
					name: "precision",
					type: "number",
					required: false,
					description:
						"Decimal precision. Defaults to the step's decimal count.",
				},
				{
					name: "locale",
					type: "string",
					required: false,
					description:
						"BCP 47 locale for number formatting. Falls back to the nearest WireUIProvider, then en-US. Only affects display/parsing when formatOptions is also set.",
				},
				{
					name: "formatOptions",
					type: "Intl.NumberFormatOptions",
					required: false,
					description:
						"Intl.NumberFormat options. When provided, the committed value is displayed via Intl.NumberFormat(locale, formatOptions) and input is parsed using the locale's separators. When omitted, the raw numeric string is shown.",
				},
			],
		},
		dataAttributes: [
			{
				name: "data-readonly",
				description: "Present when readOnly is true.",
				appliesTo: "Field",
			},
			{
				name: "data-disabled",
				description:
					"Present when the increment/decrement button is at the min/max bound.",
				appliesTo: "Increment, Decrement",
			},
		],
		frameworks: {
			react: {
				importStatement: "import { NumberInput } from '@wire-ui/react'",
				basicExample: `<NumberInput.Root value={n} onChange={setN} min={0} max={10}>
  <NumberInput.Decrement>−</NumberInput.Decrement>
  <NumberInput.Field />
  <NumberInput.Increment>+</NumberInput.Increment>
</NumberInput.Root>`,
			},
			solid: {
				importStatement: "import { NumberInput } from '@wire-ui/solid'",
				basicExample: `<NumberInput.Root value={n()} onChange={setN} min={0} max={10}>
  <NumberInput.Decrement>−</NumberInput.Decrement>
  <NumberInput.Field />
  <NumberInput.Increment>+</NumberInput.Increment>
</NumberInput.Root>`,
			},
			vue: {
				importStatement: "import { NumberInput } from '@wire-ui/vue'",
				basicExample: `<template>
  <NumberInput.Root :value="n" @change="n = $event" :min="0" :max="10">
    <NumberInput.Decrement>−</NumberInput.Decrement>
    <NumberInput.Field />
    <NumberInput.Increment>+</NumberInput.Increment>
  </NumberInput.Root>
</template>`,
			},
		},
	},

	{
		name: "OTP",
		category: "form",
		description:
			"Compound one-time password input with individual slot fields and separator.",
		isCompound: true,
		parts: ["Root", "Slot", "Separator"],
		props: {
			Root: [
				{
					name: "length",
					type: "number",
					required: true,
					description: "Number of OTP digits.",
				},
				{
					name: "value",
					type: "string",
					required: false,
					description: "Controlled value.",
				},
				{
					name: "onChange",
					type: "(value: string) => void",
					required: false,
					description: "Called when the value changes.",
				},
				{
					name: "onComplete",
					type: "(code: string) => void",
					required: false,
					description: "Called when all slots are filled.",
				},
				{
					name: "disabled",
					type: "boolean",
					required: false,
					description: "Disables the input.",
				},
				{
					name: "pattern",
					type: '"numeric" | "alphanumeric"',
					required: false,
					description:
						"Which characters the slots accept. Use \"alphanumeric\" to allow letters as well as digits.",
					defaultValue: '"numeric"',
				},
				{
					name: "defaultValue",
					type: "string",
					required: false,
					description: "Initial value (uncontrolled).",
				},
			],
			Slot: [
				{
					name: "index",
					type: "number",
					required: true,
					description: "Zero-based slot index.",
				},
			],
		},
		dataAttributes: [
			{
				name: "data-complete",
				description: "Present when all slots are filled.",
				appliesTo: "Root, Slot",
			},
			{
				name: "data-active",
				description: "Present on the currently focused slot.",
				appliesTo: "Slot",
			},
			{
				name: "data-filled",
				description: "Present when the slot has a value.",
				appliesTo: "Slot",
			},
			{
				name: "data-disabled",
				description: "Present when the input is disabled.",
				appliesTo: "Root, Slot",
			},
		],
		frameworks: {
			react: {
				importStatement: "import { OTP } from '@wire-ui/react'",
				basicExample: `<OTP.Root length={6} onComplete={(code) => verify(code)}>
  <OTP.Slot index={0} />
  <OTP.Slot index={1} />
  <OTP.Slot index={2} />
  <OTP.Separator />
  <OTP.Slot index={3} />
  <OTP.Slot index={4} />
  <OTP.Slot index={5} />
</OTP.Root>`,
			},
			solid: {
				importStatement: "import { OTP } from '@wire-ui/solid'",
				basicExample: `<OTP.Root length={6} onComplete={(code) => verify(code)}>
  <OTP.Slot index={0} />
  <OTP.Slot index={1} />
  <OTP.Slot index={2} />
  <OTP.Separator />
  <OTP.Slot index={3} />
  <OTP.Slot index={4} />
  <OTP.Slot index={5} />
</OTP.Root>`,
			},
			vue: {
				importStatement: "import { OTP } from '@wire-ui/vue'",
				basicExample: `<template>
  <OTP.Root :length="6" @complete="verify">
    <OTP.Slot :index="0" />
    <OTP.Slot :index="1" />
    <OTP.Slot :index="2" />
    <OTP.Separator />
    <OTP.Slot :index="3" />
    <OTP.Slot :index="4" />
    <OTP.Slot :index="5" />
  </OTP.Root>
</template>`,
			},
		},
	},

	{
		name: "Rating",
		category: "form",
		description:
			"Star rating input with controlled/uncontrolled value and read-only mode.",
		isCompound: false,
		parts: [],
		props: {
			Rating: [
				{
					name: "value",
					type: "number",
					required: false,
					description: "Controlled rating value.",
				},
				{
					name: "defaultValue",
					type: "number",
					required: false,
					description: "Uncontrolled default value.",
				},
				{
					name: "onChange",
					type: "(value: number) => void",
					required: false,
					description: "Called when the rating changes.",
				},
				{
					name: "max",
					type: "number",
					required: false,
					description: "Maximum number of stars.",
					defaultValue: "5",
				},
				{
					name: "readOnly",
					type: "boolean",
					required: false,
					description: "Prevents user interaction.",
				},
				{
					name: "starClassName",
					type: "string",
					required: false,
					description:
						"Class applied to each individual star button. Named starClass in @wire-ui/solid, which follows Solid's class convention.",
				},
				{
					name: "disabled",
					type: "boolean",
					required: false,
					description: "Disables the rating.",
				},
			],
		},
		dataAttributes: [
			{
				name: "data-filled",
				description:
					"Present on stars at or below the selected value. Style with starClassName plus a [data-filled] variant.",
				appliesTo: "star button",
			},
			{
				name: "data-highlighted",
				description:
					"Present on stars at or below the current hover value (falls back to the selected value when not hovering).",
				appliesTo: "star button",
			},
			{
				name: "data-disabled",
				description: "Present when the rating is disabled.",
				appliesTo: "root, star button",
			},
			{
				name: "data-readonly",
				description:
					'Present when the rating is read-only. The root also switches to role="img" in this mode.',
				appliesTo: "root",
			},
		],
		frameworks: {
			react: {
				importStatement: "import { Rating } from '@wire-ui/react'",
				basicExample: `<Rating defaultValue={3} onChange={(v) => console.log(v)} />`,
			},
			solid: {
				importStatement: "import { Rating } from '@wire-ui/solid'",
				basicExample: `<Rating defaultValue={3} onChange={(v) => console.log(v)} />`,
			},
			vue: {
				importStatement: "import { Rating } from '@wire-ui/vue'",
				basicExample: `<template>
  <Rating :default-value="3" @change="(v) => console.log(v)" />
</template>`,
			},
		},
	},

	{
		name: "Slider",
		category: "form",
		description:
			"Single-value or two-thumb range slider with drag plus full keyboard support (arrows, Home/End, PageUp/PageDown). Not compound — a single <Slider /> element.",
		isCompound: false,
		parts: [],
		props: {
			Slider: [
				{
					name: "value",
					type: "number | [number, number]",
					required: false,
					description:
						"Controlled value — a number in single mode, [start, end] in range mode.",
				},
				{
					name: "defaultValue",
					type: "number | [number, number]",
					required: false,
					description:
						"Initial value (uncontrolled) — a number in single mode, [start, end] in range mode.",
				},
				{
					name: "onChange",
					type: "(value: number | [number, number]) => void",
					required: false,
					description: "Called when the value changes.",
				},
				{
					name: "range",
					type: "boolean",
					required: false,
					description:
						"Enable two-thumb range mode; value/defaultValue then become [start, end].",
				},
				{
					name: "min",
					type: "number",
					required: false,
					description: "Minimum value.",
					defaultValue: "0",
				},
				{
					name: "max",
					type: "number",
					required: false,
					description: "Maximum value.",
					defaultValue: "100",
				},
				{
					name: "step",
					type: "number",
					required: false,
					description: "Step increment.",
					defaultValue: "1",
				},
				{
					name: "orientation",
					type: '"horizontal" | "vertical"',
					required: false,
					description: "Layout orientation.",
					defaultValue: "horizontal",
				},
				{
					name: "disabled",
					type: "boolean",
					required: false,
					description: "Disable the slider.",
				},
				{
					name: "inverted",
					type: "boolean",
					required: false,
					description:
						"Invert the direction (right-to-left or top-to-bottom).",
				},
				{
					name: "aria-label",
					type: "string",
					required: false,
					description: "Accessible label for the slider thumb(s).",
				},
			],
		},
		dataAttributes: [
			{
				name: "data-orientation",
				description: "Reflects the orientation prop.",
				values: '"horizontal" | "vertical"',
				appliesTo: "root",
			},
			{
				name: "data-disabled",
				description: "Present when the slider is disabled.",
				appliesTo: "root, thumb",
			},
			{
				name: "data-part",
				description:
					"Identifies the internal elements the Slider renders for you. Since Slider ships no CSS, these are the hooks you style against — [data-part=track], [data-part=fill], [data-part=thumb].",
				values: '"track" | "fill" | "thumb"',
				appliesTo: "track, fill, thumb",
			},
			{
				name: "data-thumb-index",
				description:
					"Zero-based index of the thumb. In range mode, 0 is the minimum and 1 the maximum.",
				appliesTo: "thumb",
			},
		],
		frameworks: {
			react: {
				importStatement: "import { Slider } from '@wire-ui/react'",
				basicExample: `<Slider defaultValue={50} min={0} max={100} step={1} aria-label="Volume" />`,
			},
			solid: {
				importStatement: "import { Slider } from '@wire-ui/solid'",
				basicExample: `<Slider value={value()} onChange={setValue} min={0} max={100} aria-label="Volume" />`,
			},
			vue: {
				importStatement: "import { Slider } from '@wire-ui/vue'",
				basicExample: `<template>
  <Slider :value="value" @change="value = $event" :min="0" :max="100" aria-label="Volume" />
</template>`,
			},
		},
		notes: [
			"Pass `range` together with a [start, end] value/defaultValue for two-thumb range mode; omit it for a single numeric value.",
			"Available in all three frameworks (@wire-ui/react, @wire-ui/solid, @wire-ui/vue).",
		],
	},

	{
		name: "TagInput",
		category: "form",
		description:
			"Compound token-style input. Enter/comma adds a tag; Backspace removes the last tag.",
		isCompound: true,
		parts: ["Root", "List", "Items", "Tag", "Field"],
		props: {
			Root: [
				{
					name: "value",
					type: "string[]",
					required: false,
					description: "Controlled list of tags.",
				},
				{
					name: "defaultValue",
					type: "string[]",
					required: false,
					description: "Initial list (uncontrolled).",
				},
				{
					name: "onChange",
					type: "(value: string[]) => void",
					required: false,
					description: "Called when tags are added or removed.",
				},
				{
					name: "maxTags",
					type: "number",
					required: false,
					description: "Maximum number of tags allowed.",
				},
				{
					name: "allowDuplicates",
					type: "boolean",
					required: false,
					description: "Reject duplicate values (case-sensitive) when false.",
					defaultValue: "true",
				},
				{
					name: "commitKeys",
					type: "string[]",
					required: false,
					description: "Keys that commit the current input as a tag.",
					defaultValue: "['Enter', ',']",
				},
				{
					name: "validate",
					type: "(tag: string, current: string[]) => boolean",
					required: false,
					description: "Optional validator — return false to reject the tag.",
				},
				{
					name: "disabled",
					type: "boolean",
					required: false,
					description: "Disable the field and all remove buttons.",
				},
			],
			Items: [
				{
					name: "children",
					type: "(tag: string, index: number, remove: () => void) => ReactNode",
					required: true,
					description:
						"Render prop called once per tag. Wire the provided remove callback to your chip's dismiss control.",
				},
			],
			Tag: [
				{
					name: "label",
					type: "string",
					required: true,
					description:
						"The tag's text — used for the remove button's accessible name.",
				},
				{
					name: "onRemove",
					type: "() => void",
					required: true,
					description: "Remove this tag. Wire to the remove argument from Items.",
				},
				{
					name: "removeLabel",
					type: "string",
					required: false,
					description:
						"Override the remove button's accessible name.",
					defaultValue: '"Remove {label}"',
				},
				{
					name: "removeContent",
					type: "ReactNode",
					required: false,
					description: "Content of the remove button.",
					defaultValue: '"×"',
				},
				{
					name: "removeClassName",
					type: "string",
					required: false,
					description: "Class applied to the built-in remove button.",
				},
			],
		},
		dataAttributes: [
			{
				name: "data-disabled",
				description: "Present when the input is disabled.",
				appliesTo: "Root",
			},
			{
				name: "data-taginput-tag",
				description:
					"Marks a rendered chip. Used internally to move focus to an adjacent remove button before the current one unmounts.",
				appliesTo: "Tag",
			},
			{
				name: "data-taginput-remove",
				description: "Marks the built-in remove button inside a Tag.",
				appliesTo: "Tag",
			},
		],
		frameworks: {
			react: {
				importStatement: "import { TagInput } from '@wire-ui/react'",
				basicExample: `<TagInput.Root value={tags} onChange={setTags}>
  <TagInput.List>
    <TagInput.Items>
      {(tag, i, remove) => <TagInput.Tag key={i} label={tag} onRemove={remove} />}
    </TagInput.Items>
  </TagInput.List>
  <TagInput.Field placeholder="Add tag..." />
</TagInput.Root>`,
			},
			solid: {
				importStatement: "import { TagInput } from '@wire-ui/solid'",
				basicExample: `<TagInput.Root value={tags()} onChange={setTags}>
  <TagInput.List>
    <TagInput.Items>
      {(tag, i, remove) => <TagInput.Tag label={tag} onRemove={remove} />}
    </TagInput.Items>
  </TagInput.List>
  <TagInput.Field placeholder="Add tag..." />
</TagInput.Root>`,
			},
			vue: {
				importStatement: "import { TagInput } from '@wire-ui/vue'",
				basicExample: `<template>
  <TagInput.Root :value="tags" @change="tags = $event">
    <TagInput.List>
      <TagInput.Items v-slot="{ tag, remove }">
        <TagInput.Tag :label="tag" :on-remove="remove" />
      </TagInput.Items>
    </TagInput.List>
    <TagInput.Field placeholder="Add tag..." />
  </TagInput.Root>
</template>`,
			},
		},
	},

	{
		name: "FileUpload",
		category: "form",
		description:
			"Compound drag-and-drop file uploader with file list and clear control.",
		isCompound: true,
		parts: ["Root", "Input", "Trigger", "Dropzone", "Items"],
		props: {
			Root: [
				{
					name: "value",
					type: "File[]",
					required: false,
					description: "Controlled list of files.",
				},
				{
					name: "defaultValue",
					type: "File[]",
					required: false,
					description: "Initial file list (uncontrolled).",
				},
				{
					name: "accept",
					type: "string",
					required: false,
					description:
						'MIME types or extensions to accept (e.g. "image/*" or ".pdf,.doc").',
				},
				{
					name: "multiple",
					type: "boolean",
					required: false,
					description: "Allow selecting multiple files.",
				},
				{
					name: "maxFiles",
					type: "number",
					required: false,
					description: "Maximum number of files.",
				},
				{
					name: "maxSize",
					type: "number",
					required: false,
					description: "Maximum size per file in bytes.",
				},
				{
					name: "onChange",
					type: "(files: File[]) => void",
					required: false,
					description: "Called whenever the file list changes.",
				},
				{
					name: "onReject",
					type: "(rejected: { file: File; reason: 'maxFiles' | 'maxSize' | 'accept' }[]) => void",
					required: false,
					description:
						"Called when files are rejected — too many, too large, or the wrong type.",
				},
				{
					name: "disabled",
					type: "boolean",
					required: false,
					description: "Disable the dropzone and trigger.",
				},
			],
			Items: [
				{
					name: "children",
					type: "(file: File, index: number, remove: () => void) => ReactNode",
					required: true,
					description:
						"Render prop called once per selected file. Wire the provided remove callback to your own remove control.",
				},
			],
		},
		dataAttributes: [
			{
				name: "data-dragging",
				description:
					"Present on Dropzone while a file is being dragged over.",
				appliesTo: "Dropzone",
			},
			{
				name: "data-disabled",
				description: "Present when disabled.",
				appliesTo: "Root, Dropzone",
			},
		],
		frameworks: {
			react: {
				importStatement: "import { FileUpload } from '@wire-ui/react'",
				basicExample: `<FileUpload.Root accept="image/*" multiple onChange={setFiles}>
  <FileUpload.Dropzone>
    Drop files here or <FileUpload.Trigger>browse</FileUpload.Trigger>
  </FileUpload.Dropzone>
  <FileUpload.Input />
  <FileUpload.Items>
    {(file, i, remove) => (
      <div key={i}>{file.name} <button onClick={remove}>Remove</button></div>
    )}
  </FileUpload.Items>
</FileUpload.Root>`,
			},
			solid: {
				importStatement: "import { FileUpload } from '@wire-ui/solid'",
				basicExample: `<FileUpload.Root accept="image/*" multiple onChange={setFiles}>
  <FileUpload.Dropzone>
    Drop files here or <FileUpload.Trigger>browse</FileUpload.Trigger>
  </FileUpload.Dropzone>
  <FileUpload.Input />
  <FileUpload.Items>
    {(file, i, remove) => (
      <div>{file.name} <button onClick={remove}>Remove</button></div>
    )}
  </FileUpload.Items>
</FileUpload.Root>`,
			},
			vue: {
				importStatement: "import { FileUpload } from '@wire-ui/vue'",
				basicExample: `<template>
  <FileUpload.Root accept="image/*" multiple @change="onChange">
    <FileUpload.Dropzone>
      Drop files here or <FileUpload.Trigger>browse</FileUpload.Trigger>
    </FileUpload.Dropzone>
    <FileUpload.Input />
    <FileUpload.Items v-slot="{ file, remove }">
      <div>{{ file.name }} <button @click="remove">Remove</button></div>
    </FileUpload.Items>
  </FileUpload.Root>
</template>`,
			},
		},
	},

	{
		name: "DatePicker",
		category: "form",
		description:
			"Compound date picker — a trigger that displays the selected value plus a popover Calendar.",
		isCompound: true,
		parts: ["Root", "Trigger", "Value", "Content", "Calendar"],
		props: {
			Root: [
				{
					name: "value",
					type: "Date | null",
					required: false,
					description:
						"Controlled selected date (null when cleared).",
				},
				{
					name: "defaultValue",
					type: "Date | null",
					required: false,
					description: "Initially selected date (uncontrolled).",
				},
				{
					name: "onChange",
					type: "(date: Date | null) => void",
					required: false,
					description:
						"Called with the newly selected date, or null when cleared.",
				},
				{
					name: "open",
					type: "boolean",
					required: false,
					description:
						"Controlled open state of the calendar popover.",
				},
				{
					name: "defaultOpen",
					type: "boolean",
					required: false,
					description:
						"Initial open state of the calendar popover (uncontrolled).",
				},
				{
					name: "onOpenChange",
					type: "(open: boolean) => void",
					required: false,
					description:
						"Called when the calendar popover opens or closes.",
				},
				{
					name: "disabled",
					type: "boolean",
					required: false,
					description:
						"Disable the trigger and prevent opening the calendar.",
				},
				{
					name: "closeOnSelect",
					type: "boolean",
					required: false,
					description:
						"Close the popover automatically once a date is selected.",
				},
				{
					name: "locale",
					type: "string",
					required: false,
					description: "Locale for the formatted display value.",
				},
				{
					name: "formatOptions",
					type: "Intl.DateTimeFormatOptions",
					required: false,
					description: "Format options for the displayed date.",
				},
			],
			Value: [
				{
					name: "placeholder",
					type: "React.ReactNode",
					required: false,
					description: "Content shown when no date is selected.",
				},
				{
					name: "children",
					type: "(date: Date | null, formatted: string) => React.ReactNode",
					required: false,
					description:
						"Render-prop for custom formatting of the selected date.",
				},
			],
		},
		dataAttributes: [
			{
				name: "data-state",
				description:
					"Open/closed state of the popover. Content only renders while open, so it always reads \"open\".",
				values: '"open" | "closed"',
				appliesTo: "Root, Trigger, Content",
			},
			{
				name: "data-placeholder",
				description: "Present while no date is selected.",
				appliesTo: "Value",
			},
			{
				name: "data-hover",
				description: "Present when the pointer is over the trigger.",
				appliesTo: "Trigger",
			},
			{
				name: "data-focus-visible",
				description: "Present on keyboard focus.",
				appliesTo: "Trigger",
			},
			{
				name: "data-active",
				description: "Present while the trigger is pressed.",
				appliesTo: "Trigger",
			},
			{
				name: "data-disabled",
				description: "Present when the date picker is disabled.",
				appliesTo: "Root, Trigger",
			},
		],
		frameworks: {
			react: {
				importStatement: "import { DatePicker } from '@wire-ui/react'",
				basicExample: `<DatePicker.Root value={date} onChange={setDate}>
  <DatePicker.Trigger>
    <DatePicker.Value placeholder="Pick a date" />
  </DatePicker.Trigger>
  <DatePicker.Content>
    <DatePicker.Calendar />
  </DatePicker.Content>
</DatePicker.Root>`,
			},
			solid: {
				importStatement: "import { DatePicker } from '@wire-ui/solid'",
				basicExample: `<DatePicker.Root value={date()} onChange={setDate}>
  <DatePicker.Trigger>
    <DatePicker.Value placeholder="Pick a date" />
  </DatePicker.Trigger>
  <DatePicker.Content>
    <DatePicker.Calendar />
  </DatePicker.Content>
</DatePicker.Root>`,
			},
			vue: {
				importStatement: "import { DatePicker } from '@wire-ui/vue'",
				basicExample: `<template>
  <DatePicker.Root :value="date" @change="date = $event">
    <DatePicker.Trigger>
      <DatePicker.Value placeholder="Pick a date" />
    </DatePicker.Trigger>
    <DatePicker.Content>
      <DatePicker.Calendar />
    </DatePicker.Content>
  </DatePicker.Root>
</template>`,
			},
		},
	},

	{
		name: "Form",
		category: "form",
		description:
			"Compound form container wiring label, control, description, and error together with the right ids and aria-*.",
		isCompound: true,
		parts: ["Root", "Field", "Label", "Control", "Description", "Error"],
		props: {
			Root: [],
			Field: [
				{
					name: "name",
					type: "string",
					required: false,
					description:
						"Used as the id prefix, and set on the name attribute if Control wraps a native field.",
				},
				{
					name: "invalid",
					type: "boolean",
					required: false,
					description:
						"Marks the whole field as invalid; toggles aria-invalid and data-invalid on the control.",
				},
				{
					name: "required",
					type: "boolean",
					required: false,
					description:
						"Marks the field as required; toggles aria-required and data-required.",
				},
				{
					name: "disabled",
					type: "boolean",
					required: false,
					description:
						"Marks the field as disabled; toggles disabled and data-disabled on the control.",
				},
			],
			Label: [
				{
					name: "asChild",
					type: "boolean",
					required: false,
					description: "Render a different element instead of <label>.",
				},
			],
			Control: [
				{
					name: "children",
					type: "ReactElement",
					required: true,
					description:
						"A single form control. The Field's id, aria-* and disabled props are merged into it.",
				},
			],
			Error: [
				{
					name: "forceMount",
					type: "boolean",
					required: false,
					description:
						"Render even when the surrounding Field is not invalid.",
				},
			],
		},
		dataAttributes: [
			{
				name: "data-invalid",
				description: "Present when the field is invalid.",
				appliesTo: "Field, Label, Control",
			},
			{
				name: "data-required",
				description: "Present when the field is required.",
				appliesTo: "Field, Label, Control",
			},
			{
				name: "data-disabled",
				description: "Present when the field is disabled.",
				appliesTo: "Field, Label, Control",
			},
		],
		frameworks: {
			react: {
				importStatement: "import { Form } from '@wire-ui/react'",
				basicExample: `<Form.Root onSubmit={onSubmit}>
  <Form.Field name="email" required invalid={hasError}>
    <Form.Label>Email</Form.Label>
    <Form.Control>
      <input type="email" />
    </Form.Control>
    <Form.Description>We never share this.</Form.Description>
    <Form.Error>Invalid email</Form.Error>
  </Form.Field>
  <button type="submit">Send</button>
</Form.Root>`,
			},
			solid: {
				importStatement: "import { Form } from '@wire-ui/solid'",
				basicExample: `<Form.Root onSubmit={onSubmit}>
  <Form.Field name="email" required invalid={hasError()}>
    <Form.Label>Email</Form.Label>
    <Form.Control>
      <input type="email" />
    </Form.Control>
    <Form.Description>We never share this.</Form.Description>
    <Form.Error>Invalid email</Form.Error>
  </Form.Field>
  <button type="submit">Send</button>
</Form.Root>`,
			},
			vue: {
				importStatement: "import { Form } from '@wire-ui/vue'",
				basicExample: `<template>
  <Form.Root @submit="onSubmit">
    <Form.Field name="email" required :invalid="hasError">
      <Form.Label>Email</Form.Label>
      <Form.Control>
        <input type="email" />
      </Form.Control>
      <Form.Description>We never share this.</Form.Description>
      <Form.Error>Invalid email</Form.Error>
    </Form.Field>
    <button type="submit">Send</button>
  </Form.Root>
</template>`,
			},
		},
		notes: [
			"There is no Form.Submit part — use a plain <button type=\"submit\">.",
			"Root is a bare <form>; submission is handled with the native onSubmit event, not a values callback.",
			"Error renders only when the surrounding Field is invalid, unless forceMount is set.",
		],
	},

	// ─── Overlay ────────────────────────────────────────────────────────

	{
		name: "Modal",
		category: "overlay",
		description:
			"Compound modal dialog with portal, overlay, content, and close parts.",
		isCompound: true,
		parts: ["Root", "Portal", "Overlay", "Content", "Close"],
		contextOnlyParts: ["Root", "Portal"],
		props: {
			Root: [
				{
					name: "open",
					type: "boolean",
					required: false,
					description: "Controlled open state.",
				},
				{
					name: "defaultOpen",
					type: "boolean",
					required: false,
					description: "Initial open state (uncontrolled).",
				},
				{
					name: "onOpenChange",
					type: "(open: boolean) => void",
					required: false,
					description:
						"Called when the open state changes (overlay click, Escape, or a close trigger).",
				},
			],
			Portal: [
				{
					name: "container",
					type: "HTMLElement",
					required: false,
					description:
						"DOM node to render into. Defaults to document.body.",
				},
			],
		},
		dataAttributes: [
			{
				name: "data-state",
				description: "Open/closed state.",
				values: '"open" | "closed"',
				appliesTo: "Overlay, Content",
			},
		],
		frameworks: {
			react: {
				importStatement: "import { Modal } from '@wire-ui/react'",
				basicExample: `<Modal.Root open={open} onOpenChange={setOpen}>
  <Modal.Portal>
    <Modal.Overlay>
      <Modal.Content>
        <h2>Title</h2>
        <p>Body</p>
        <Modal.Close>Close</Modal.Close>
      </Modal.Content>
    </Modal.Overlay>
  </Modal.Portal>
</Modal.Root>`,
			},
			solid: {
				importStatement: "import { Modal } from '@wire-ui/solid'",
				basicExample: `<Modal.Root open={open()} onOpenChange={setOpen}>
  <Modal.Portal>
    <Modal.Overlay>
      <Modal.Content>
        <h2>Title</h2>
        <p>Body</p>
        <Modal.Close>Close</Modal.Close>
      </Modal.Content>
    </Modal.Overlay>
  </Modal.Portal>
</Modal.Root>`,
			},
			vue: {
				importStatement: "import { Modal } from '@wire-ui/vue'",
				basicExample: `<template>
  <Modal.Root :open="open" @open-change="open = $event">
    <Modal.Portal>
      <Modal.Overlay>
        <Modal.Content>
          <h2>Title</h2>
          <p>Body</p>
          <Modal.Close>Close</Modal.Close>
        </Modal.Content>
      </Modal.Overlay>
    </Modal.Portal>
  </Modal.Root>
</template>`,
			},
		},
		notes: [
			"Do not forget Modal.Portal. Modal content must be wrapped in Portal for correct rendering.",
			"Closes on Escape key and overlay click.",
		],
	},

	{
		name: "Drawer",
		category: "overlay",
		description: "Compound side-panel overlay with the same API as Modal.",
		isCompound: true,
		parts: ["Root", "Portal", "Overlay", "Content", "Header", "Close"],
		contextOnlyParts: ["Root", "Portal"],
		props: {
			Root: [
				{
					name: "open",
					type: "boolean",
					required: false,
					description: "Controlled open state.",
				},
				{
					name: "defaultOpen",
					type: "boolean",
					required: false,
					description: "Initial open state (uncontrolled).",
				},
				{
					name: "onOpenChange",
					type: "(open: boolean) => void",
					required: false,
					description:
						"Called when the open state changes (overlay click, Escape, or a close trigger).",
				},
			],
			Portal: [
				{
					name: "container",
					type: "HTMLElement",
					required: false,
					description:
						"DOM node to render into. Defaults to document.body.",
				},
			],
		},
		dataAttributes: [
			{
				name: "data-state",
				description: "Open/closed state.",
				values: '"open" | "closed"',
				appliesTo: "Overlay, Content",
			},
		],
		frameworks: {
			react: {
				importStatement: "import { Drawer } from '@wire-ui/react'",
				basicExample: `<Drawer.Root open={open} onOpenChange={setOpen}>
  <Drawer.Portal>
    <Drawer.Overlay>
      <Drawer.Content>
        <Drawer.Header>
          <h2>Title</h2>
          <Drawer.Close>×</Drawer.Close>
        </Drawer.Header>
        <p>Body</p>
      </Drawer.Content>
    </Drawer.Overlay>
  </Drawer.Portal>
</Drawer.Root>`,
			},
			solid: {
				importStatement: "import { Drawer } from '@wire-ui/solid'",
				basicExample: `<Drawer.Root open={open()} onOpenChange={setOpen}>
  <Drawer.Portal>
    <Drawer.Overlay>
      <Drawer.Content>
        <Drawer.Header>
          <h2>Title</h2>
          <Drawer.Close>×</Drawer.Close>
        </Drawer.Header>
        <p>Body</p>
      </Drawer.Content>
    </Drawer.Overlay>
  </Drawer.Portal>
</Drawer.Root>`,
			},
			vue: {
				importStatement: "import { Drawer } from '@wire-ui/vue'",
				basicExample: `<template>
  <Drawer.Root :open="open" @open-change="open = $event">
    <Drawer.Portal>
      <Drawer.Overlay>
        <Drawer.Content>
          <Drawer.Header>
            <h2>Title</h2>
            <Drawer.Close>×</Drawer.Close>
          </Drawer.Header>
          <p>Body</p>
        </Drawer.Content>
      </Drawer.Overlay>
    </Drawer.Portal>
  </Drawer.Root>
</template>`,
			},
		},
		notes: [
			"Same portal requirement as Modal. Wrap content in Drawer.Portal.",
		],
	},

	{
		name: "Dropdown",
		category: "overlay",
		description:
			"Compound dropdown menu triggered by a button with open/closed state.",
		isCompound: true,
		parts: ["Root", "Trigger", "Menu"],
		props: {
			Root: [
				{
					name: "open",
					type: "boolean",
					required: false,
					description: "Controlled open state.",
				},
				{
					name: "defaultOpen",
					type: "boolean",
					required: false,
					description: "Initial open state (uncontrolled).",
				},
				{
					name: "onOpenChange",
					type: "(open: boolean) => void",
					required: false,
					description:
						"Called when the open state changes (trigger click, outside click, or Escape).",
				},
			],
			Trigger: [
				{
					name: "asChild",
					type: "boolean",
					required: false,
					description:
						"Render the trigger onto the child element instead of a <button>, merging props.",
				},
			],
			Menu: [
				{
					name: "position",
					type: '"left" | "right"',
					required: false,
					description:
						"Horizontal alignment of the menu relative to the trigger.",
				},
			],
		},
		dataAttributes: [
			{
				name: "data-state",
				description: "Open/closed state of the menu.",
				values: '"open" | "closed"',
				appliesTo: "Trigger, Menu",
			},
			{
				name: "data-position",
				description: "Reflects the Menu's position prop.",
				appliesTo: "Menu",
			},
		],
		frameworks: {
			react: {
				importStatement: "import { Dropdown } from '@wire-ui/react'",
				basicExample: `<Dropdown.Root>
  <Dropdown.Trigger>Options</Dropdown.Trigger>
  <Dropdown.Menu>
    <button>Edit</button>
    <button>Delete</button>
  </Dropdown.Menu>
</Dropdown.Root>`,
			},
			solid: {
				importStatement: "import { Dropdown } from '@wire-ui/solid'",
				basicExample: `<Dropdown.Root>
  <Dropdown.Trigger>Options</Dropdown.Trigger>
  <Dropdown.Menu>
    <button>Edit</button>
    <button>Delete</button>
  </Dropdown.Menu>
</Dropdown.Root>`,
			},
			vue: {
				importStatement: "import { Dropdown } from '@wire-ui/vue'",
				basicExample: `<template>
  <Dropdown.Root>
    <Dropdown.Trigger>Options</Dropdown.Trigger>
    <Dropdown.Menu>
      <button>Edit</button>
      <button>Delete</button>
    </Dropdown.Menu>
  </Dropdown.Root>
</template>`,
			},
		},
		notes: [
			'Use data-state="open"/"closed" to show/hide the menu. Use className="data-[state=closed]:hidden" to hide when closed.',
			"Do not use data-open/data-closed; use data-state instead.",
		],
	},

	{
		name: "ContextMenu",
		category: "overlay",
		description:
			"Compound right-click context menu. Trigger element opens a menu portaled to the pointer position.",
		isCompound: true,
		parts: ["Root", "Trigger", "Content", "Item", "Separator"],
		props: {
			Root: [
				{
					name: "open",
					type: "boolean",
					required: false,
					description: "Controlled open state.",
				},
				{
					name: "defaultOpen",
					type: "boolean",
					required: false,
					description: "Initial open state (uncontrolled).",
				},
				{
					name: "onOpenChange",
					type: "(open: boolean) => void",
					required: false,
					description:
						"Called when the open state changes (right-click to open, outside click or Escape to close).",
				},
				{
					name: "disabled",
					type: "boolean",
					required: false,
					description:
						"Disable the context menu so right-click falls back to the native menu.",
				},
			],
			Item: [
				{
					name: "onSelect",
					type: "() => void",
					required: false,
					description:
						"Called when the item is selected (and closes the menu).",
				},
				{
					name: "disabled",
					type: "boolean",
					required: false,
					description: "Disable this menu item.",
				},
			],
		},
		dataAttributes: [
			{
				name: "data-state",
				description:
					"Open/closed state. Content only renders while open, so it always reads \"open\".",
				values: '"open" | "closed"',
				appliesTo: "Root, Trigger, Content",
			},
			{
				name: "data-highlighted",
				description: "Present on the keyboard-highlighted item.",
				appliesTo: "Item",
			},
			{
				name: "data-disabled",
				description: "Present on a disabled item.",
				appliesTo: "Item",
			},
		],
		frameworks: {
			react: {
				importStatement: "import { ContextMenu } from '@wire-ui/react'",
				basicExample: `<ContextMenu.Root>
  <ContextMenu.Trigger>Right-click here</ContextMenu.Trigger>
  <ContextMenu.Content>
    <ContextMenu.Item onSelect={() => copy()}>Copy</ContextMenu.Item>
    <ContextMenu.Separator />
    <ContextMenu.Item onSelect={() => del()}>Delete</ContextMenu.Item>
  </ContextMenu.Content>
</ContextMenu.Root>`,
			},
			solid: {
				importStatement: "import { ContextMenu } from '@wire-ui/solid'",
				basicExample: `<ContextMenu.Root>
  <ContextMenu.Trigger>Right-click here</ContextMenu.Trigger>
  <ContextMenu.Content>
    <ContextMenu.Item onSelect={() => copy()}>Copy</ContextMenu.Item>
    <ContextMenu.Separator />
    <ContextMenu.Item onSelect={() => del()}>Delete</ContextMenu.Item>
  </ContextMenu.Content>
</ContextMenu.Root>`,
			},
			vue: {
				importStatement: "import { ContextMenu } from '@wire-ui/vue'",
				basicExample: `<template>
  <ContextMenu.Root>
    <ContextMenu.Trigger>Right-click here</ContextMenu.Trigger>
    <ContextMenu.Content>
      <ContextMenu.Item @select="copy">Copy</ContextMenu.Item>
      <ContextMenu.Separator />
      <ContextMenu.Item @select="del">Delete</ContextMenu.Item>
    </ContextMenu.Content>
  </ContextMenu.Root>
</template>`,
			},
		},
		notes: [
			"Outside-click and Escape dismissal use [[event-listener]] (useEventListener / createEventListener) internally — no behavior change.",
		],
	},

	{
		name: "Popover",
		category: "overlay",
		description:
			"Compound floating popover anchored to a trigger with configurable side/align.",
		isCompound: true,
		parts: ["Root", "Trigger", "Content", "Close"],
		props: {
			Root: [
				{
					name: "open",
					type: "boolean",
					required: false,
					description: "Controlled open state.",
				},
				{
					name: "defaultOpen",
					type: "boolean",
					required: false,
					description: "Initial open state (uncontrolled).",
				},
				{
					name: "onOpenChange",
					type: "(open: boolean) => void",
					required: false,
					description: "Called when open state changes.",
				},
				{
					name: "closeOnOutsideClick",
					type: "boolean",
					required: false,
					description: "Close the popover when clicking outside the content.",
					defaultValue: "true",
				},
				{
					name: "closeOnEscape",
					type: "boolean",
					required: false,
					description: "Close the popover when Escape is pressed.",
					defaultValue: "true",
				},
			],
			Content: [
				{
					name: "side",
					type: '"top" | "right" | "bottom" | "left"',
					required: false,
					description: "Preferred side relative to the trigger.",
					defaultValue: '"bottom"',
				},
				{
					name: "align",
					type: '"start" | "center" | "end"',
					required: false,
					description: "Alignment along the side axis.",
					defaultValue: '"center"',
				},
				{
					name: "forceMount",
					type: "boolean",
					required: false,
					description:
						"Keep the content mounted while closed and toggle visibility via data-state and hidden.",
					defaultValue: "false",
				},
			],
		},
		dataAttributes: [
			{
				name: "data-state",
				description: "Open/closed state.",
				values: '"open" | "closed"',
				appliesTo: "Root, Trigger, Content",
			},
			{
				name: "data-side",
				description: "Side the content is anchored to.",
				appliesTo: "Content",
			},
			{
				name: "data-align",
				description: "Alignment along the side axis.",
				appliesTo: "Content",
			},
			{
				name: "data-hover",
				description: "Present when the pointer is over the element.",
				appliesTo: "Trigger, Close",
			},
			{
				name: "data-focus-visible",
				description: "Present on keyboard focus.",
				appliesTo: "Trigger, Close",
			},
			{
				name: "data-active",
				description: "Present while the element is pressed.",
				appliesTo: "Trigger, Close",
			},
		],
		frameworks: {
			react: {
				importStatement: "import { Popover } from '@wire-ui/react'",
				basicExample: `<Popover.Root>
  <Popover.Trigger>Open</Popover.Trigger>
  <Popover.Content side="bottom" align="start">
    <p>Hello from a popover</p>
    <Popover.Close>Dismiss</Popover.Close>
  </Popover.Content>
</Popover.Root>`,
			},
			solid: {
				importStatement: "import { Popover } from '@wire-ui/solid'",
				basicExample: `<Popover.Root>
  <Popover.Trigger>Open</Popover.Trigger>
  <Popover.Content side="bottom" align="start">
    <p>Hello from a popover</p>
    <Popover.Close>Dismiss</Popover.Close>
  </Popover.Content>
</Popover.Root>`,
			},
			vue: {
				importStatement: "import { Popover } from '@wire-ui/vue'",
				basicExample: `<template>
  <Popover.Root>
    <Popover.Trigger>Open</Popover.Trigger>
    <Popover.Content side="bottom" align="start">
      <p>Hello from a popover</p>
      <Popover.Close>Dismiss</Popover.Close>
    </Popover.Content>
  </Popover.Root>
</template>`,
			},
		},
		notes: [
			"There is no Popover.Portal part — Content renders in place. Position it with your own CSS.",
		],
	},

	{
		name: "Tooltip",
		category: "overlay",
		description:
			"Compound tooltip that appears on hover/focus with configurable side placement.",
		isCompound: true,
		parts: ["Root", "Trigger", "Content"],
		props: {
			Root: [
				{
					name: "open",
					type: "boolean",
					required: false,
					description: "Controlled open state.",
				},
				{
					name: "defaultOpen",
					type: "boolean",
					required: false,
					description: "Initial open state (uncontrolled).",
				},
				{
					name: "onOpenChange",
					type: "(open: boolean) => void",
					required: false,
					description: "Called when the open state changes.",
				},
				{
					name: "delayDuration",
					type: "number",
					required: false,
					description: "Delay in ms before showing the tooltip.",
				},
			],
			Content: [
				{
					name: "side",
					type: '"top" | "bottom" | "left" | "right"',
					required: false,
					description: "Preferred side for placement.",
					defaultValue: '"top"',
				},
			],
		},
		dataAttributes: [
			{
				name: "data-state",
				description: "Open/closed state.",
				values: '"open" | "closed"',
				appliesTo: "Content",
			},
			{
				name: "data-side",
				description: "The rendered side of the tooltip.",
				values: '"top" | "bottom" | "left" | "right"',
				appliesTo: "Content",
			},
		],
		frameworks: {
			react: {
				importStatement: "import { Tooltip } from '@wire-ui/react'",
				basicExample: `<Tooltip.Root delayDuration={300}>
  <Tooltip.Trigger><button>Hover me</button></Tooltip.Trigger>
  <Tooltip.Content side="top">Tooltip text</Tooltip.Content>
</Tooltip.Root>`,
			},
			solid: {
				importStatement: "import { Tooltip } from '@wire-ui/solid'",
				basicExample: `<Tooltip.Root delayDuration={300}>
  <Tooltip.Trigger><button>Hover me</button></Tooltip.Trigger>
  <Tooltip.Content side="top">Tooltip text</Tooltip.Content>
</Tooltip.Root>`,
			},
			vue: {
				importStatement: "import { Tooltip } from '@wire-ui/vue'",
				basicExample: `<template>
  <Tooltip.Root :delay-duration="300">
    <Tooltip.Trigger><button>Hover me</button></Tooltip.Trigger>
    <Tooltip.Content side="top">Tooltip text</Tooltip.Content>
  </Tooltip.Root>
</template>`,
			},
		},
		notes: [
			"Show/hide delay timers use [[timeout]] (useTimeout / createTimeout) internally — no behavior change.",
		],
	},

	{
		name: "Accordion",
		category: "layout",
		description:
			"Compound collapsible sections supporting single or multiple open items.",
		isCompound: true,
		parts: ["Root", "Item", "Trigger", "Content"],
		props: {
			Root: [
				{
					name: "type",
					type: '"single" | "multiple"',
					required: true,
					description: "Whether one or many items can be open.",
				},
				{
					name: "collapsible",
					type: "boolean",
					required: false,
					description:
						"Allow all items to be collapsed (single mode).",
				},
				{
					name: "defaultValue",
					type: "string | string[]",
					required: false,
					description: "Initially open item value(s).",
				},
				{
					name: "disabled",
					type: "boolean",
					required: false,
					description: "Disables all items.",
				},
			],
			Item: [
				{
					name: "value",
					type: "string",
					required: true,
					description: "Unique value identifying this item.",
				},
				{
					name: "disabled",
					type: "boolean",
					required: false,
					description: "Disables this item only.",
				},
			],
			Content: [
				{
					name: "forceMount",
					type: "boolean",
					required: false,
					description:
						"Keep content mounted in the DOM even when closed (useful for CSS animations).",
				},
			],
		},
		dataAttributes: [
			{
				name: "data-state",
				description: "Open/closed state.",
				values: '"open" | "closed"',
				appliesTo: "Item, Trigger, Content",
			},
			{
				name: "data-disabled",
				description:
					"Present when the item is disabled, either via Item.disabled or the Root's disabled set.",
				appliesTo: "Item, Trigger",
			},
		],
		frameworks: {
			react: {
				importStatement: "import { Accordion } from '@wire-ui/react'",
				basicExample: `<Accordion.Root type="single" collapsible defaultValue="item-1">
  <Accordion.Item value="item-1">
    <Accordion.Trigger>Section 1</Accordion.Trigger>
    <Accordion.Content>Content here</Accordion.Content>
  </Accordion.Item>
</Accordion.Root>`,
			},
			solid: {
				importStatement: "import { Accordion } from '@wire-ui/solid'",
				basicExample: `<Accordion.Root type="single" collapsible defaultValue="item-1">
  <Accordion.Item value="item-1">
    <Accordion.Trigger>Section 1</Accordion.Trigger>
    <Accordion.Content>Content here</Accordion.Content>
  </Accordion.Item>
</Accordion.Root>`,
			},
			vue: {
				importStatement: "import { Accordion } from '@wire-ui/vue'",
				basicExample: `<template>
  <Accordion.Root type="single" :collapsible="true" default-value="item-1">
    <Accordion.Item value="item-1">
      <Accordion.Trigger>Section 1</Accordion.Trigger>
      <Accordion.Content>Content here</Accordion.Content>
    </Accordion.Item>
  </Accordion.Root>
</template>`,
			},
		},
	},

	// ─── Navigation ─────────────────────────────────────────────────────

	{
		name: "Breadcrumb",
		category: "navigation",
		description:
			"Compound hierarchical navigation trail. Items mark themselves as data-current when active.",
		isCompound: true,
		parts: ["Root", "List", "Item", "Link", "Separator"],
		props: {
			Root: [
				{
					name: "aria-label",
					type: "string",
					required: false,
					description: "Accessible label for the navigation landmark.",
					defaultValue: '"Breadcrumb"',
				},
			],
			Item: [
				{
					name: "current",
					type: "boolean",
					required: false,
					description:
						'Marks this item as the current page (sets aria-current="page" and data-current).',
				},
			],
			Link: [
				{
					name: "asChild",
					type: "boolean",
					required: false,
					description: "Render a different element instead of <a>.",
				},
			],
		},
		dataAttributes: [
			{
				name: "data-current",
				description:
					"Present on the item representing the current page.",
				appliesTo: "Item",
			},
		],
		frameworks: {
			react: {
				importStatement: "import { Breadcrumb } from '@wire-ui/react'",
				basicExample: `<Breadcrumb.Root>
  <Breadcrumb.List>
    <Breadcrumb.Item><Breadcrumb.Link href="/">Home</Breadcrumb.Link></Breadcrumb.Item>
    <Breadcrumb.Separator>/</Breadcrumb.Separator>
    <Breadcrumb.Item><Breadcrumb.Link href="/docs">Docs</Breadcrumb.Link></Breadcrumb.Item>
    <Breadcrumb.Separator>/</Breadcrumb.Separator>
    <Breadcrumb.Item current>Components</Breadcrumb.Item>
  </Breadcrumb.List>
</Breadcrumb.Root>`,
			},
			solid: {
				importStatement: "import { Breadcrumb } from '@wire-ui/solid'",
				basicExample: `<Breadcrumb.Root>
  <Breadcrumb.List>
    <Breadcrumb.Item><Breadcrumb.Link href="/">Home</Breadcrumb.Link></Breadcrumb.Item>
    <Breadcrumb.Separator>/</Breadcrumb.Separator>
    <Breadcrumb.Item current>Components</Breadcrumb.Item>
  </Breadcrumb.List>
</Breadcrumb.Root>`,
			},
			vue: {
				importStatement: "import { Breadcrumb } from '@wire-ui/vue'",
				basicExample: `<template>
  <Breadcrumb.Root>
    <Breadcrumb.List>
      <Breadcrumb.Item><Breadcrumb.Link href="/">Home</Breadcrumb.Link></Breadcrumb.Item>
      <Breadcrumb.Separator>/</Breadcrumb.Separator>
      <Breadcrumb.Item current>Components</Breadcrumb.Item>
    </Breadcrumb.List>
  </Breadcrumb.Root>
</template>`,
			},
		},
	},

	{
		name: "Pagination",
		category: "navigation",
		description:
			"Compound page navigation. The Root computes the page/ellipsis sequence; Items emits it via a render prop.",
		isCompound: true,
		parts: [
			"Root",
			"List",
			"Items",
			"Item",
			"Previous",
			"Next",
			"Ellipsis",
		],
		props: {
			Root: [
				{
					name: "totalPages",
					type: "number",
					required: true,
					description: "Total number of pages (>= 1).",
				},
				{
					name: "page",
					type: "number",
					required: false,
					description: "Controlled current page (1-based).",
				},
				{
					name: "defaultPage",
					type: "number",
					required: false,
					description: "Initial page (1-based, uncontrolled).",
				},
				{
					name: "onChange",
					type: "(page: number) => void",
					required: false,
					description: "Called when the page changes.",
				},
				{
					name: "siblingCount",
					type: "number",
					required: false,
					description:
						"How many sibling pages to show on each side of the current page.",
					defaultValue: "1",
				},
				{
					name: "boundaryCount",
					type: "number",
					required: false,
					description:
						"How many pages to always show at the start and end.",
					defaultValue: "1",
				},
			],
			Items: [
				{
					name: "children",
					type: "(item: number | 'ellipsis', index: number) => ReactNode",
					required: true,
					description:
						"Render prop called once per computed entry. Branch on the 'ellipsis' literal to render a gap.",
				},
			],
			Item: [
				{
					name: "page",
					type: "number",
					required: true,
					description: "Page number (1-based).",
				},
				{
					name: "disabled",
					type: "boolean",
					required: false,
					description: "Disable the button.",
				},
			],
		},
		dataAttributes: [
			{
				name: "data-active",
				description: "Present on the currently selected page item.",
				appliesTo: "Item",
			},
		],
		frameworks: {
			react: {
				importStatement: "import { Pagination } from '@wire-ui/react'",
				basicExample: `<Pagination.Root totalPages={20} page={page} onChange={setPage}>
  <Pagination.List>
    <li><Pagination.Previous>‹</Pagination.Previous></li>
    <Pagination.Items>
      {(item, i) =>
        item === 'ellipsis' ? (
          <Pagination.Ellipsis key={\`e-\${i}\`} />
        ) : (
          <Pagination.Item key={item} page={item}>{item}</Pagination.Item>
        )
      }
    </Pagination.Items>
    <li><Pagination.Next>›</Pagination.Next></li>
  </Pagination.List>
</Pagination.Root>`,
			},
			solid: {
				importStatement: "import { Pagination } from '@wire-ui/solid'",
				basicExample: `<Pagination.Root totalPages={20} page={page()} onChange={setPage}>
  <Pagination.List>
    <li><Pagination.Previous>‹</Pagination.Previous></li>
    <Pagination.Items>
      {(item) =>
        item === 'ellipsis' ? (
          <Pagination.Ellipsis />
        ) : (
          <Pagination.Item page={item}>{item}</Pagination.Item>
        )
      }
    </Pagination.Items>
    <li><Pagination.Next>›</Pagination.Next></li>
  </Pagination.List>
</Pagination.Root>`,
			},
			vue: {
				importStatement: "import { Pagination } from '@wire-ui/vue'",
				basicExample: `<template>
  <Pagination.Root :total-pages="20" :page="page" @change="page = $event">
    <Pagination.List>
      <li><Pagination.Previous>‹</Pagination.Previous></li>
      <Pagination.Items v-slot="{ item }">
        <Pagination.Ellipsis v-if="item === 'ellipsis'" />
        <Pagination.Item
          v-else
          :page="item">
          {{ item }}
        </Pagination.Item>
      </Pagination.Items>
      <li><Pagination.Next>›</Pagination.Next></li>
    </Pagination.List>
  </Pagination.Root>
</template>`,
			},
		},
		notes: [
			"Previous/Next/Ellipsis render inline — wrap them in your own <li> inside List, which renders a <ul>.",
			"Item takes page, not value. The page-change callback is onChange, not onPageChange.",
		],
	},

	{
		name: "Tabs",
		category: "navigation",
		description:
			"Compound tab list with roving-tabindex keyboard arrow navigation.",
		isCompound: true,
		parts: ["Root", "List", "Trigger", "Content"],
		props: {
			Root: [
				{
					name: "value",
					type: "string",
					required: false,
					description: "Controlled active tab value.",
				},
				{
					name: "defaultValue",
					type: "string",
					required: false,
					description: "Initial active tab value (uncontrolled).",
				},
				{
					name: "onChange",
					type: "(value: string) => void",
					required: false,
					description: "Called when the active tab changes.",
				},
				{
					name: "orientation",
					type: '"horizontal" | "vertical"',
					required: false,
					description:
						"Layout orientation; controls which arrow keys move between tabs.",
					defaultValue: '"horizontal"',
				},
				{
					name: "activationMode",
					type: '"automatic" | "manual"',
					required: false,
					description:
						'"automatic" activates a trigger on focus; "manual" requires Enter/Space.',
					defaultValue: '"automatic"',
				},
			],
			Trigger: [
				{
					name: "value",
					type: "string",
					required: true,
					description: "Identifier matching the Content.value.",
				},
				{
					name: "disabled",
					type: "boolean",
					required: false,
					description: "Disable this tab.",
				},
			],
			Content: [
				{
					name: "value",
					type: "string",
					required: true,
					description: "Identifier matching the Trigger.value.",
				},
				{
					name: "forceMount",
					type: "boolean",
					required: false,
					description:
						"Keep the panel mounted while inactive and toggle visibility via data-state and hidden.",
					defaultValue: "false",
				},
			],
		},
		dataAttributes: [
			{
				name: "data-state",
				description: "Active/inactive state.",
				values: '"active" | "inactive"',
				appliesTo: "Trigger, Content",
			},
			{
				name: "data-orientation",
				description: "Reflects the orientation prop.",
				appliesTo: "Root, List, Trigger, Content",
			},
			{
				name: "data-disabled",
				description: "Present when the trigger is disabled.",
				appliesTo: "Trigger",
			},
			{
				name: "data-hover",
				description: "Present when the pointer is over the trigger.",
				appliesTo: "Trigger",
			},
			{
				name: "data-focus-visible",
				description: "Present on keyboard focus.",
				appliesTo: "Trigger",
			},
			{
				name: "data-active",
				description: "Present while the trigger is pressed.",
				appliesTo: "Trigger",
			},
		],
		frameworks: {
			react: {
				importStatement: "import { Tabs } from '@wire-ui/react'",
				basicExample: `<Tabs.Root defaultValue="a">
  <Tabs.List>
    <Tabs.Trigger value="a">Tab A</Tabs.Trigger>
    <Tabs.Trigger value="b">Tab B</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="a">Panel A</Tabs.Content>
  <Tabs.Content value="b">Panel B</Tabs.Content>
</Tabs.Root>`,
			},
			solid: {
				importStatement: "import { Tabs } from '@wire-ui/solid'",
				basicExample: `<Tabs.Root defaultValue="a">
  <Tabs.List>
    <Tabs.Trigger value="a">Tab A</Tabs.Trigger>
    <Tabs.Trigger value="b">Tab B</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="a">Panel A</Tabs.Content>
  <Tabs.Content value="b">Panel B</Tabs.Content>
</Tabs.Root>`,
			},
			vue: {
				importStatement: "import { Tabs } from '@wire-ui/vue'",
				basicExample: `<template>
  <Tabs.Root default-value="a">
    <Tabs.List>
      <Tabs.Trigger value="a">Tab A</Tabs.Trigger>
      <Tabs.Trigger value="b">Tab B</Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content value="a">Panel A</Tabs.Content>
    <Tabs.Content value="b">Panel B</Tabs.Content>
  </Tabs.Root>
</template>`,
			},
		},
		notes: [
			"The change callback is named onChange, not onValueChange.",
			"Content unmounts when inactive unless forceMount is set.",
		],
	},

	{
		name: "NavigationMenu",
		category: "navigation",
		description:
			"Compound top-level navigation with hover-intent menus and link parts.",
		isCompound: true,
		parts: ["Root", "List", "Item", "Trigger", "Content", "Link"],
		props: {
			Root: [
				{
					name: "value",
					type: "string | null",
					required: false,
					description: "Controlled open item value.",
				},
				{
					name: "defaultValue",
					type: "string | null",
					required: false,
					description: "Initial open item (uncontrolled).",
				},
				{
					name: "onValueChange",
					type: "(value: string | null) => void",
					required: false,
					description: "Called when the open item changes.",
				},
				{
					name: "delayDuration",
					type: "number",
					required: false,
					description: "Delay in ms before opening on hover.",
				},
				{
					name: "skipDelayDuration",
					type: "number",
					required: false,
					description:
						"Time in ms the user has to move from trigger to content before it closes.",
					defaultValue: "300",
				},
			],
			Item: [
				{
					name: "value",
					type: "string",
					required: false,
					description:
						"Unique identifier for this item. Required only if it has Trigger/Content children.",
				},
			],
			Trigger: [
				{
					name: "disabled",
					type: "boolean",
					required: false,
					description: "Disables the trigger.",
				},
			],
			Link: [
				{
					name: "active",
					type: "boolean",
					required: false,
					description: "Marks the link as the current location.",
				},
			],
		},
		dataAttributes: [
			{
				name: "data-state",
				description: "Open/closed state.",
				values: '"open" | "closed"',
				appliesTo: "Trigger, Content",
			},
			{
				name: "data-active",
				description: "Present on the active Link.",
				appliesTo: "Link",
			},
		],
		frameworks: {
			react: {
				importStatement:
					"import { NavigationMenu } from '@wire-ui/react'",
				basicExample: `<NavigationMenu.Root>
  <NavigationMenu.List>
    <NavigationMenu.Item>
      <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
      <NavigationMenu.Content>
        <NavigationMenu.Link href="/components">Components</NavigationMenu.Link>
        <NavigationMenu.Link href="/hooks">Hooks</NavigationMenu.Link>
      </NavigationMenu.Content>
    </NavigationMenu.Item>
  </NavigationMenu.List>
</NavigationMenu.Root>`,
			},
			solid: {
				importStatement:
					"import { NavigationMenu } from '@wire-ui/solid'",
				basicExample: `<NavigationMenu.Root>
  <NavigationMenu.List>
    <NavigationMenu.Item>
      <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
      <NavigationMenu.Content>
        <NavigationMenu.Link href="/components">Components</NavigationMenu.Link>
      </NavigationMenu.Content>
    </NavigationMenu.Item>
  </NavigationMenu.List>
</NavigationMenu.Root>`,
			},
			vue: {
				importStatement:
					"import { NavigationMenu } from '@wire-ui/vue'",
				basicExample: `<template>
  <NavigationMenu.Root>
    <NavigationMenu.List>
      <NavigationMenu.Item>
        <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
        <NavigationMenu.Content>
          <NavigationMenu.Link href="/components">Components</NavigationMenu.Link>
        </NavigationMenu.Content>
      </NavigationMenu.Item>
    </NavigationMenu.List>
  </NavigationMenu.Root>
</template>`,
			},
		},
		notes: [
			"Cursor movement from Trigger to Content does not close the menu; hover-intent is timed on Root, not per-component.",
			"The hover-intent open/close timers use [[timeout]] (useTimeout / createTimeout) internally — no behavior change.",
		],
	},

	{
		name: "MenuBar",
		category: "navigation",
		description:
			"Compound horizontal application menu with cascading submenus and arrow-key navigation.",
		isCompound: true,
		parts: ["Root", "Menu", "Trigger", "Content", "Item", "Separator"],
		props: {
			Root: [
				{
					name: "value",
					type: "string | null",
					required: false,
					description: "Controlled id of the open menu.",
				},
				{
					name: "defaultValue",
					type: "string | null",
					required: false,
					description: "Initial open menu (uncontrolled).",
				},
				{
					name: "onValueChange",
					type: "(value: string | null) => void",
					required: false,
					description: "Called when the open menu changes.",
				},
			],
			Menu: [
				{
					name: "value",
					type: "string",
					required: true,
					description: "Unique id for this menu, matched against Root's value.",
				},
			],
			Trigger: [
				{
					name: "disabled",
					type: "boolean",
					required: false,
					description: "Disables the trigger.",
				},
			],
			Item: [
				{
					name: "onSelect",
					type: "() => void",
					required: false,
					description: "Called when the item is activated.",
				},
				{
					name: "disabled",
					type: "boolean",
					required: false,
					description: "Disables the item.",
				},
			],
		},
		dataAttributes: [
			{
				name: "data-state",
				description: "Open/closed state.",
				values: '"open" | "closed"',
				appliesTo: "Trigger, Content",
			},
			{
				name: "data-menu-value",
				description: "The owning menu's value, mirrored onto the trigger.",
				appliesTo: "Trigger",
			},
			{
				name: "data-disabled",
				description: "Present when the item is disabled.",
				appliesTo: "Item",
			},
		],
		frameworks: {
			react: {
				importStatement: "import { MenuBar } from '@wire-ui/react'",
				basicExample: `<MenuBar.Root>
  <MenuBar.Menu value="file">
    <MenuBar.Trigger>File</MenuBar.Trigger>
    <MenuBar.Content>
      <MenuBar.Item onSelect={newDoc}>New</MenuBar.Item>
      <MenuBar.Item onSelect={openDoc}>Open</MenuBar.Item>
      <MenuBar.Separator />
      <MenuBar.Item disabled>Revert</MenuBar.Item>
    </MenuBar.Content>
  </MenuBar.Menu>
</MenuBar.Root>`,
			},
			solid: {
				importStatement: "import { MenuBar } from '@wire-ui/solid'",
				basicExample: `<MenuBar.Root>
  <MenuBar.Menu value="file">
    <MenuBar.Trigger>File</MenuBar.Trigger>
    <MenuBar.Content>
      <MenuBar.Item onSelect={newDoc}>New</MenuBar.Item>
      <MenuBar.Separator />
      <MenuBar.Item onSelect={openDoc}>Open</MenuBar.Item>
    </MenuBar.Content>
  </MenuBar.Menu>
</MenuBar.Root>`,
			},
			vue: {
				importStatement: "import { MenuBar } from '@wire-ui/vue'",
				basicExample: `<template>
  <MenuBar.Root>
    <MenuBar.Menu value="file">
      <MenuBar.Trigger>File</MenuBar.Trigger>
      <MenuBar.Content>
        <MenuBar.Item @select="newDoc">New</MenuBar.Item>
        <MenuBar.Separator />
        <MenuBar.Item @select="openDoc">Open</MenuBar.Item>
      </MenuBar.Content>
    </MenuBar.Menu>
  </MenuBar.Root>
</template>`,
			},
		},
		notes: [
			"There are no Sub/SubTrigger/SubContent parts — MenuBar is a single level of menus. Nest a Dropdown inside Content for cascading menus.",
			"Menu.value is required and identifies the menu to Root's controlled value.",
		],
	},

	// ─── Display ────────────────────────────────────────────────────────

	{
		name: "Toolbar",
		category: "navigation",
		description:
			"Container that groups related controls (buttons, two-state toggles, links) with roving tabindex and arrow-key navigation.",
		isCompound: true,
		parts: ["Root", "Button", "Toggle", "Link", "Separator"],
		props: {
			Root: [
				{
					name: "orientation",
					type: '"horizontal" | "vertical"',
					required: false,
					description: "Layout and arrow-key axis.",
					defaultValue: "horizontal",
				},
				{
					name: "loop",
					type: "boolean",
					required: false,
					description:
						"Wrap focus from the last item to the first and vice versa.",
					defaultValue: "true",
				},
			],
			Toggle: [
				{
					name: "pressed",
					type: "boolean",
					required: false,
					description: "Controlled pressed state.",
				},
				{
					name: "defaultPressed",
					type: "boolean",
					required: false,
					description: "Initial pressed state (uncontrolled).",
					defaultValue: "false",
				},
				{
					name: "onPressedChange",
					type: "(pressed: boolean) => void",
					required: false,
					description: "Called when the pressed state changes.",
				},
			],
			Separator: [
				{
					name: "orientation",
					type: '"horizontal" | "vertical"',
					required: false,
					description:
						"Override the separator orientation (defaults to perpendicular to the toolbar's axis).",
				},
			],
		},
		dataAttributes: [
			{
				name: "data-orientation",
				description: "Reflects the toolbar/separator orientation.",
				values: '"horizontal" | "vertical"',
				appliesTo: "Root, Separator",
			},
			{
				name: "data-state",
				description: "Pressed state of a Toggle.",
				values: '"on" | "off"',
				appliesTo: "Toggle",
			},
			{
				name: "data-toolbar-item",
				description:
					"Marks every focusable toolbar item. Style all items uniformly with a single [data-toolbar-item] rule.",
				appliesTo: "Button, Toggle, Link",
			},
		],
		frameworks: {
			react: {
				importStatement: "import { Toolbar } from '@wire-ui/react'",
				basicExample: `<Toolbar.Root aria-label="Formatting">
  <Toolbar.Toggle defaultPressed onPressedChange={setBold}>Bold</Toolbar.Toggle>
  <Toolbar.Separator />
  <Toolbar.Button>Reset</Toolbar.Button>
  <Toolbar.Link href="/help">Help</Toolbar.Link>
</Toolbar.Root>`,
			},
			solid: {
				importStatement: "import { Toolbar } from '@wire-ui/solid'",
				basicExample: `<Toolbar.Root aria-label="Formatting">
  <Toolbar.Toggle defaultPressed onPressedChange={setBold}>Bold</Toolbar.Toggle>
  <Toolbar.Separator />
  <Toolbar.Button>Reset</Toolbar.Button>
  <Toolbar.Link href="/help">Help</Toolbar.Link>
</Toolbar.Root>`,
			},
			vue: {
				importStatement: "import { Toolbar } from '@wire-ui/vue'",
				basicExample: `<template>
  <Toolbar.Root aria-label="Formatting">
    <Toolbar.Toggle :default-pressed="true" @pressed-change="bold = $event">Bold</Toolbar.Toggle>
    <Toolbar.Separator />
    <Toolbar.Button>Reset</Toolbar.Button>
    <Toolbar.Link href="/help">Help</Toolbar.Link>
  </Toolbar.Root>
</template>`,
			},
		},
		notes: [
			"Roving tabindex: only one item is tabbable at a time; arrow keys plus Home/End move focus between enabled items (loop controls wrap-around).",
			'Toolbar.Toggle is a pressable two-state button — it exposes aria-pressed and data-state="on"/"off" and is controllable via pressed / defaultPressed / onPressedChange.',
		],
	},

	{
		name: "Alert",
		category: "display",
		description:
			"Compound alert banner with title, description, and dismissible behaviour.",
		isCompound: true,
		parts: ["Root", "Title", "Description", "Dismiss"],
		props: {
			Root: [
				{
					name: "status",
					type: "string",
					required: false,
					description:
						'Alert status type (e.g. "warning", "error", "success", "info").',
				},
				{
					name: "onDismiss",
					type: "() => void",
					required: false,
					description: "Called when the alert is dismissed.",
				},
				{
					name: "isAutoDismissable",
					type: "boolean",
					required: false,
					description:
						"Automatically dismiss the alert after a duration.",
				},
				{
					name: "dismissCountdown",
					type: "number",
					required: false,
					description:
						"Milliseconds before auto-dismiss fires (only used when isAutoDismissable is set).",
					defaultValue: "3000",
				},
			],
		},
		dataAttributes: [
			{
				name: "data-part",
				description:
					"Identifies the Title and Description elements — [data-part=title], [data-part=description].",
				values: '"title" | "description"',
				appliesTo: "Title, Description",
			},
			{
				name: "data-status",
				description: "Reflects the status prop.",
				appliesTo: "Root",
			},
		],
		frameworks: {
			react: {
				importStatement: "import { Alert } from '@wire-ui/react'",
				basicExample: `<Alert.Root status="warning" onDismiss={() => setVisible(false)}>
  <Alert.Title>Warning</Alert.Title>
  <Alert.Description>Check your input.</Alert.Description>
  <Alert.Dismiss>×</Alert.Dismiss>
</Alert.Root>`,
			},
			solid: {
				importStatement: "import { Alert } from '@wire-ui/solid'",
				basicExample: `<Alert.Root status="warning" onDismiss={() => setVisible(false)}>
  <Alert.Title>Warning</Alert.Title>
  <Alert.Description>Check your input.</Alert.Description>
  <Alert.Dismiss>×</Alert.Dismiss>
</Alert.Root>`,
			},
			vue: {
				importStatement: "import { Alert } from '@wire-ui/vue'",
				basicExample: `<template>
  <Alert.Root status="warning" @dismiss="visible = false">
    <Alert.Title>Warning</Alert.Title>
    <Alert.Description>Check your input.</Alert.Description>
    <Alert.Dismiss>×</Alert.Dismiss>
  </Alert.Root>
</template>`,
			},
		},
		notes: [
			"The auto-dismiss timer uses [[timeout]] (useTimeout / createTimeout) internally — no behavior change.",
		],
	},

	{
		name: "Avatar",
		category: "display",
		description:
			"Compound avatar with image and fallback that renders when the image fails to load.",
		isCompound: true,
		parts: ["Root", "Image", "Fallback"],
		props: {
			Image: [
				{
					name: "src",
					type: "string",
					required: true,
					description: "Image source URL.",
				},
				{
					name: "alt",
					type: "string",
					required: true,
					description: "Alt text for the image.",
				},
			],
			Fallback: [
				{
					name: "delayMs",
					type: "number",
					required: false,
					description:
						"Delay in ms before the fallback becomes visible. Avoids a flash of the fallback during fast image loads.",
					defaultValue: "0",
				},
			],
		},
		dataAttributes: [
			{
				name: "data-status",
				description: "Image load status.",
				values: '"loading" | "loaded" | "error"',
				appliesTo: "Image",
			},
		],
		frameworks: {
			react: {
				importStatement: "import { Avatar } from '@wire-ui/react'",
				basicExample: `<Avatar.Root>
  <Avatar.Image src="/avatar.jpg" alt="User" />
  <Avatar.Fallback>JD</Avatar.Fallback>
</Avatar.Root>`,
			},
			solid: {
				importStatement: "import { Avatar } from '@wire-ui/solid'",
				basicExample: `<Avatar.Root>
  <Avatar.Image src="/avatar.jpg" alt="User" />
  <Avatar.Fallback>JD</Avatar.Fallback>
</Avatar.Root>`,
			},
			vue: {
				importStatement: "import { Avatar } from '@wire-ui/vue'",
				basicExample: `<template>
  <Avatar.Root>
    <Avatar.Image src="/avatar.jpg" alt="User" />
    <Avatar.Fallback>JD</Avatar.Fallback>
  </Avatar.Root>
</template>`,
			},
		},
		notes: [
			"AvatarFallback's show-delay timer uses [[timeout]] (useTimeout / createTimeout) internally — no behavior change.",
		],
	},

	{
		name: "Badge",
		category: "display",
		description:
			"Numeric badge that renders a count, capping at 9+ and hiding at zero.",
		isCompound: false,
		parts: [],
		props: {
			Badge: [
				{
					name: "count",
					type: "number",
					required: true,
					description:
						'The count to display. Renders "9+" for values > 9, renders nothing for 0.',
				},
			],
		},
		dataAttributes: [
			{
				name: "data-count",
				description: "Reflects the count value.",
			},
		],
		frameworks: {
			react: {
				importStatement: "import { Badge } from '@wire-ui/react'",
				basicExample: `<Badge count={3} />`,
			},
			solid: {
				importStatement: "import { Badge } from '@wire-ui/solid'",
				basicExample: `<Badge count={3} />`,
			},
			vue: {
				importStatement: "import { Badge } from '@wire-ui/vue'",
				basicExample: `<template>
  <Badge :count="3" />
</template>`,
			},
		},
	},

	{
		name: "Card",
		category: "display",
		description:
			"Simple container component styled via data-color and data-size attributes.",
		isCompound: false,
		parts: [],
		props: {
			Card: [
				{
					name: "color",
					type: "string",
					required: false,
					description: "Sets data-color attribute for styling.",
				},
				{
					name: "size",
					type: "string",
					required: false,
					description: "Sets data-size attribute for styling.",
				},
			],
		},
		dataAttributes: [
			{
				name: "data-color",
				description: "Reflects the color prop value.",
			},
			{ name: "data-size", description: "Reflects the size prop value." },
		],
		frameworks: {
			react: {
				importStatement: "import { Card } from '@wire-ui/react'",
				basicExample: `<Card color="primary" size="large">Content</Card>`,
			},
			solid: {
				importStatement: "import { Card } from '@wire-ui/solid'",
				basicExample: `<Card color="primary" size="large">Content</Card>`,
			},
			vue: {
				importStatement: "import { Card } from '@wire-ui/vue'",
				basicExample: `<template>
  <Card color="primary" size="large">Content</Card>
</template>`,
			},
		},
	},

	{
		name: "Calendar",
		category: "display",
		description:
			"Compound date grid with month/year navigation and day cells annotated by data attributes.",
		isCompound: true,
		parts: ["Root", "Nav", "Title", "Grid", "PrevButton", "NextButton"],
		props: {
			Root: [
				{
					name: "value",
					type: "Date",
					required: false,
					description: "Controlled selected date.",
				},
				{
					name: "defaultValue",
					type: "Date",
					required: false,
					description: "Uncontrolled default date.",
				},
				{
					name: "onChange",
					type: "(date: Date | null) => void",
					required: false,
					description: "Called when the selected date changes.",
				},
				{
					name: "minDate",
					type: "Date",
					required: false,
					description: "Earliest selectable date.",
				},
				{
					name: "maxDate",
					type: "Date",
					required: false,
					description: "Latest selectable date.",
				},
				{
					name: "defaultMonth",
					type: "Date",
					required: false,
					description:
						"Initial month displayed (uncontrolled). Defaults to today.",
				},
				{
					name: "month",
					type: "Date",
					required: false,
					description: "Controlled month displayed.",
				},
				{
					name: "onMonthChange",
					type: "(month: Date) => void",
					required: false,
					description: "Called when the visible month changes.",
				},
				{
					name: "isDateDisabled",
					type: "(date: Date) => boolean",
					required: false,
					description: "Custom predicate to disable specific dates.",
				},
				{
					name: "weekStartsOn",
					type: "WeekStart",
					required: false,
					description: "First day of the week. 0 = Sunday, 1 = Monday, …",
					defaultValue: "0",
				},
				{
					name: "locale",
					type: "string",
					required: false,
					description: "Locale for month and weekday names.",
					defaultValue: '"en-US"',
				},
			],
			Grid: [
				{
					name: "renderDay",
					type: "(day: CalendarDay) => ReactNode",
					required: false,
					description:
						"Render prop for each day cell. Receives the date and its render-state.",
				},
				{
					name: "renderWeekday",
					type: "(weekday: CalendarWeekday) => ReactNode",
					required: false,
					description: "Render prop for the weekday header row.",
				},
			],
		},
		dataAttributes: [
			{
				name: "data-date",
				description:
					"The day's date as an ISO yyyy-mm-dd string. Also the hook the Grid uses to move focus between days, so keep it intact if you re-render cells.",
				appliesTo: "day",
			},
			{
				name: "data-selected",
				description: "Present on the selected day.",
				appliesTo: "day",
			},
			{
				name: "data-today",
				description: "Present on today's day.",
				appliesTo: "day",
			},
			{
				name: "data-outside-month",
				description:
					"Present on days that fall outside the visible month.",
				appliesTo: "day",
			},
			{
				name: "data-weekend",
				description: "Present on Saturday/Sunday cells.",
				appliesTo: "day",
			},
			{
				name: "data-disabled",
				description: "Present on out-of-range days.",
				appliesTo: "day",
			},
		],
		frameworks: {
			react: {
				importStatement: "import { Calendar } from '@wire-ui/react'",
				basicExample: `<Calendar.Root value={date} onChange={setDate}>
  <Calendar.Nav>
    <Calendar.PrevButton>‹</Calendar.PrevButton>
    <Calendar.Title />
    <Calendar.NextButton>›</Calendar.NextButton>
  </Calendar.Nav>
  <Calendar.Grid />
</Calendar.Root>`,
			},
			solid: {
				importStatement: "import { Calendar } from '@wire-ui/solid'",
				basicExample: `<Calendar.Root value={date()} onChange={setDate}>
  <Calendar.Nav>
    <Calendar.PrevButton>‹</Calendar.PrevButton>
    <Calendar.Title />
    <Calendar.NextButton>›</Calendar.NextButton>
  </Calendar.Nav>
  <Calendar.Grid />
</Calendar.Root>`,
			},
			vue: {
				importStatement: "import { Calendar } from '@wire-ui/vue'",
				basicExample: `<template>
  <Calendar :value="date" @change="date = $event" />
</template>`,
			},
		},
	},

	{
		name: "TreeView",
		category: "display",
		description:
			"Data-driven hierarchical tree with keyboard navigation, roving tabindex, and single/multi-select. Rows come from a nodes array plus a renderItem render prop.",
		isCompound: false,
		parts: ["Root"],
		props: {
			Root: [
				{
					name: "nodes",
					type: "TreeNode[]",
					required: true,
					description:
						"Tree data. TreeNode is { id: string; label?: ReactNode; children?: TreeNode[]; disabled?: boolean; data?: T }.",
				},
				{
					name: "renderItem",
					type: "(node: TreeNode, state: TreeItemState) => ReactNode",
					required: true,
					description:
						"Render prop for each visible row. TreeItemState is { level, expanded, selected, hasChildren, disabled, toggle, select }. Wire UI renders the treeitem wrapper and its data attributes.",
				},
				{
					name: "expanded",
					type: "string[]",
					required: false,
					description: "Controlled expanded node ids.",
				},
				{
					name: "defaultExpanded",
					type: "string[]",
					required: false,
					description: "Initial expanded ids (uncontrolled).",
				},
				{
					name: "onExpandedChange",
					type: "(expanded: string[]) => void",
					required: false,
					description: "Called when the expanded set changes.",
				},
				{
					name: "selectionMode",
					type: '"none" | "single" | "multiple"',
					required: false,
					description: "Selection behaviour.",
					defaultValue: '"none"',
				},
				{
					name: "selected",
					type: "string[]",
					required: false,
					description: "Controlled selection.",
				},
				{
					name: "defaultSelected",
					type: "string[]",
					required: false,
					description: "Initial selection (uncontrolled).",
				},
				{
					name: "onSelectionChange",
					type: "(selected: string[]) => void",
					required: false,
					description: "Called when selection changes.",
				},
			],
		},
		dataAttributes: [
			{
				name: "data-state",
				description: "Expanded/collapsed state.",
				values: '"open" | "closed"',
				appliesTo: "treeitem row",
			},
			{
				name: "data-selected",
				description: "Present on a selected row.",
				appliesTo: "treeitem row",
			},
			{
				name: "data-disabled",
				description: "Present on a disabled row.",
				appliesTo: "treeitem row",
			},
			{
				name: "data-level",
				description: "Numeric nesting level, starting at 1.",
				appliesTo: "treeitem row",
			},
			{
				name: "data-has-children",
				description: "Present on rows that have children.",
				appliesTo: "treeitem row",
			},
			{
				name: "data-id",
				description: "The node's id, used for focus management.",
				appliesTo: "treeitem row",
			},
			{
				name: "data-tree-toggle",
				description:
					"Put this on your own expand/collapse control inside renderItem. Clicks on it are excluded from row selection.",
				appliesTo: "consumer-rendered toggle",
			},
		],
		frameworks: {
			react: {
				importStatement: "import { TreeView } from '@wire-ui/react'",
				basicExample: `const nodes = [
  { id: 'src', label: 'src', children: [{ id: 'src/index.ts', label: 'index.ts' }] },
];

<TreeView.Root
  nodes={nodes}
  defaultExpanded={['src']}
  selectionMode="single"
  renderItem={(node, state) => (
    <div style={{ paddingLeft: (state.level - 1) * 16 }}>
      {state.hasChildren && (
        <button data-tree-toggle onClick={(e) => { e.stopPropagation(); state.toggle(); }}>
          {state.expanded ? '▾' : '▸'}
        </button>
      )}
      <span>{node.label}</span>
    </div>
  )}
/>`,
			},
			solid: {
				importStatement: "import { TreeView } from '@wire-ui/solid'",
				basicExample: `<TreeView.Root
  nodes={nodes}
  defaultExpanded={['src']}
  selectionMode="single"
  renderItem={(node, state) => (
    <div style={{ 'padding-left': \`\${(state.level - 1) * 16}px\` }}>
      {state.hasChildren && (
        <button data-tree-toggle onClick={(e) => { e.stopPropagation(); state.toggle(); }}>
          {state.expanded ? '▾' : '▸'}
        </button>
      )}
      <span>{node.label}</span>
    </div>
  )}
/>`,
			},
			vue: {
				importStatement: "import { TreeView } from '@wire-ui/vue'",
				basicExample: `<template>
  <TreeView.Root
    :nodes="nodes"
    :default-expanded="['src']"
    selection-mode="single"
    v-slot="{ node, state }">
    <div :style="{ paddingLeft: \`\${(state.level - 1) * 16}px\` }">
      <button
        v-if="state.hasChildren"
        data-tree-toggle
        @click.stop="state.toggle()">
        {{ state.expanded ? '▾' : '▸' }}
      </button>
      <span>{{ node.label }}</span>
    </div>
  </TreeView.Root>
</template>`,
			},
		},
		notes: [
			"TreeView is not a compound component — the only part is Root. There are no Item/Trigger/Content/Label parts.",
			"Rows are driven by the nodes array; you render each row's contents via renderItem (Vue: the default slot).",
			"data-level starts at 1 for top-level nodes.",
			"Put data-tree-toggle on your expand control so its clicks don't also select the row.",
		],
	},

	{
		name: "Tag",
		category: "display",
		description:
			"Compound pill element with label and optional dismiss button.",
		isCompound: true,
		parts: ["Root", "Label", "Remove"],
		props: {
			Root: [
				{
					name: "disabled",
					type: "boolean",
					required: false,
					description:
						"Disabled state: removes interaction and applies data-disabled.",
				},
			],
			Remove: [
				{
					name: "aria-label",
					type: "string",
					required: false,
					description: "Accessible label for the remove button.",
					defaultValue: '"Remove"',
				},
			],
		},
		dataAttributes: [
			{
				name: "data-disabled",
				description: "Present when the tag is disabled.",
				appliesTo: "Root",
			},
			{
				name: "data-hover",
				description: "Present when the pointer is over the remove button.",
				appliesTo: "Remove",
			},
			{
				name: "data-focus-visible",
				description: "Present on keyboard focus.",
				appliesTo: "Remove",
			},
			{
				name: "data-active",
				description: "Present while the remove button is pressed.",
				appliesTo: "Remove",
			},
		],
		frameworks: {
			react: {
				importStatement: "import { Tag } from '@wire-ui/react'",
				basicExample: `<Tag.Root>
  <Tag.Label>Frontend</Tag.Label>
  <Tag.Remove onClick={onRemove}>×</Tag.Remove>
</Tag.Root>`,
			},
			solid: {
				importStatement: "import { Tag } from '@wire-ui/solid'",
				basicExample: `<Tag.Root>
  <Tag.Label>Frontend</Tag.Label>
  <Tag.Remove onClick={onRemove}>×</Tag.Remove>
</Tag.Root>`,
			},
			vue: {
				importStatement: "import { Tag } from '@wire-ui/vue'",
				basicExample: `<template>
  <Tag.Root>
    <Tag.Label>Frontend</Tag.Label>
    <Tag.Remove @click="onRemove">×</Tag.Remove>
  </Tag.Root>
</template>`,
			},
		},
	},

	{
		name: "ProgressBar",
		category: "feedback",
		description:
			"Accessible progress bar with ARIA attributes for value, min, and max.",
		isCompound: false,
		parts: [],
		props: {
			ProgressBar: [
				{
					name: "percentage",
					type: "number",
					required: false,
					description: "Current progress percentage.",
				},
				{
					name: "size",
					type: "string",
					required: false,
					description: "Size of the progress bar; reflected as data-size.",
					defaultValue: '"medium"',
				},
			],
		},
		dataAttributes: [
			{ name: "data-size", description: "Reflects the size prop." },
			{
				name: "data-part",
				description:
					"Identifies the fill element the ProgressBar renders for you. Style the filled portion with [data-part=fill].",
				values: '"fill"',
				appliesTo: "fill",
			},
		],
		frameworks: {
			react: {
				importStatement: "import { ProgressBar } from '@wire-ui/react'",
				basicExample: `<ProgressBar percentage={65} />`,
			},
			solid: {
				importStatement: "import { ProgressBar } from '@wire-ui/solid'",
				basicExample: `<ProgressBar percentage={65} />`,
			},
			vue: {
				importStatement: "import { ProgressBar } from '@wire-ui/vue'",
				basicExample: `<template>
  <ProgressBar :percentage="65" />
</template>`,
			},
		},
	},

	{
		name: "Spinner",
		category: "feedback",
		description:
			'Accessible loading-status wrapper. Announces via role="status" and aria-live="polite"; you supply the visual indicator as children.',
		isCompound: false,
		parts: [],
		props: {
			Spinner: [
				{
					name: "label",
					type: "string",
					required: false,
					description:
						"Accessible label announced to screen readers. Also rendered in a visually-hidden span.",
					defaultValue: '"Loading"',
				},
				{
					name: "decorative",
					type: "boolean",
					required: false,
					description:
						"Hides the visual children from screen readers (the label is still announced).",
					defaultValue: "true",
				},
			],
		},
		dataAttributes: [],
		frameworks: {
			react: {
				importStatement: "import { Spinner } from '@wire-ui/react'",
				basicExample: `<Spinner label="Loading results">
  <MySpinnerGraphic />
</Spinner>`,
			},
			solid: {
				importStatement: "import { Spinner } from '@wire-ui/solid'",
				basicExample: `<Spinner label="Loading results">
  <MySpinnerGraphic />
</Spinner>`,
			},
			vue: {
				importStatement: "import { Spinner } from '@wire-ui/vue'",
				basicExample: `<template>
  <Spinner label="Loading results">
    <MySpinnerGraphic />
  </Spinner>
</template>`,
			},
		},
		notes: [
			"Spinner ships no animation, no dots, and no CSS — it is an accessibility wrapper. Render your own visual indicator as children.",
			"There are no size or color props and no data-* attributes; style the children directly.",
		],
	},

	{
		name: "Skeleton",
		category: "feedback",
		description: "Animated placeholder shown while content is loading.",
		isCompound: false,
		parts: [],
		props: {
			Skeleton: [
				{
					name: "loading",
					type: "boolean",
					required: false,
					description:
						"Sets data-loading; render children when false.",
					defaultValue: "true",
				},
			],
		},
		dataAttributes: [
			{ name: "data-loading", description: "Present while loading." },
		],
		frameworks: {
			react: {
				importStatement: "import { Skeleton } from '@wire-ui/react'",
				basicExample: `<Skeleton loading={loading}>
  <p>{data}</p>
</Skeleton>`,
			},
			solid: {
				importStatement: "import { Skeleton } from '@wire-ui/solid'",
				basicExample: `<Skeleton loading={loading()}>
  <p>{data()}</p>
</Skeleton>`,
			},
			vue: {
				importStatement: "import { Skeleton } from '@wire-ui/vue'",
				basicExample: `<template>
  <Skeleton :is-loading="loading">
    <p>{{ data }}</p>
  </Skeleton>
</template>`,
			},
		},
	},

	{
		name: "Toast",
		category: "feedback",
		description:
			"Compound notification system with provider, viewport, and imperative toast() API.",
		isCompound: true,
		parts: ["Provider", "Viewport", "Root", "Title", "Description", "Close"],
		contextOnlyParts: ["Provider"],
		props: {
			Provider: [
				{
					name: "defaultDuration",
					type: "number",
					required: false,
					description:
						"Default auto-dismiss duration in ms, applied to toasts that don't specify one.",
					defaultValue: "5000",
				},
			],
			Viewport: [
				{
					name: "children",
					type: "(toast: ToastData, dismiss: () => void) => ReactNode",
					required: true,
					description:
						"Render prop called once per queued toast. You render the toast body; Wire UI owns the queue and timers.",
				},
			],
		},
		dataAttributes: [
			{
				name: "data-status",
				description: "Reflects the toast's status.",
				values: '"default" | "success" | "warning" | "danger" | "info"',
				appliesTo: "Root",
			},
		],
		frameworks: {
			react: {
				importStatement:
					"import { Toast, useToast } from '@wire-ui/react'",
				basicExample: `// Wrap your app
<Toast.Provider defaultDuration={5000}>
  <App />
  <Toast.Viewport>
    {(t, dismiss) => (
      <Toast.Root key={t.id}>
        <Toast.Title>{t.title}</Toast.Title>
        <Toast.Description>{t.description}</Toast.Description>
        <Toast.Close onClick={dismiss}>×</Toast.Close>
      </Toast.Root>
    )}
  </Toast.Viewport>
</Toast.Provider>

// In a component
const { toast } = useToast();
toast({ title: 'Saved', status: 'success' });`,
			},
			solid: {
				importStatement:
					"import { Toast, useToast } from '@wire-ui/solid'",
				basicExample: `<Toast.Provider defaultDuration={5000}>
  <App />
  <Toast.Viewport>
    {(t, dismiss) => (
      <Toast.Root>
        <Toast.Title>{t.title}</Toast.Title>
        <Toast.Close onClick={dismiss}>×</Toast.Close>
      </Toast.Root>
    )}
  </Toast.Viewport>
</Toast.Provider>

const { toast } = useToast();
toast({ title: 'Saved', status: 'success' });`,
			},
			vue: {
				importStatement:
					"import { Toast, useToast } from '@wire-ui/vue'",
				basicExample: `<template>
  <Toast.Provider :default-duration="5000">
    <App />
    <Toast.Viewport v-slot="{ toast: t, dismiss }">
      <Toast.Root>
        <Toast.Title>{{ t.title }}</Toast.Title>
        <Toast.Close @click="dismiss">×</Toast.Close>
      </Toast.Root>
    </Toast.Viewport>
  </Toast.Provider>
</template>

<script setup>
const { toast } = useToast();
toast({ title: 'Saved', status: 'success' });
</script>`,
			},
		},
		notes: [
			"Toast.Provider must wrap any component that calls useToast.",
			"There is no Toast.Action part — render your own action button inside the Viewport render prop.",
			"Viewport takes a required render prop, not children elements: (toast, dismiss) => ReactNode.",
			"useToast() returns { toast, dismiss, toasts }. toast() accepts { title, description, status, duration, pauseOnHover, data } and returns the new toast's id.",
			"A toast with duration <= 0 is persistent. Each toast's auto-dismiss timer uses [[timeout]] internally.",
		],
	},

	{
		name: "Image",
		category: "display",
		description:
			"Image component with position control and loaded state data attribute.",
		isCompound: false,
		parts: [],
		props: {
			Image: [
				{
					name: "src",
					type: "string",
					required: true,
					description: "Image source URL.",
				},
				{
					name: "alt",
					type: "string",
					required: true,
					description: "Alt text for the image.",
				},
				{
					name: "position",
					type: "string",
					required: false,
					description: "Object-position value for the image.",
				},
				{
					name: "onImageLoaded",
					type: "() => void",
					required: false,
					description: "Called when the image finishes loading.",
				},
			],
		},
		dataAttributes: [
			{
				name: "data-part",
				description:
					"Identifies the elements Image renders for you — [data-part=loader] for the placeholder shown before load, [data-part=image] for the <img>.",
				values: '"loader" | "image"',
				appliesTo: "loader, img",
			},
			{
				name: "data-position",
				description: "Reflects the position prop value.",
				appliesTo: "wrapper",
			},
			{
				name: "data-loaded",
				description: "Present on the <img> after the image loads.",
				appliesTo: "img",
			},
		],
		frameworks: {
			react: {
				importStatement: "import { Image } from '@wire-ui/react'",
				basicExample: `<Image src="/photo.jpg" alt="Photo" position="center" />`,
			},
			solid: {
				importStatement: "import { Image } from '@wire-ui/solid'",
				basicExample: `<Image src="/photo.jpg" alt="Photo" position="center" />`,
			},
			vue: {
				importStatement: "import { Image } from '@wire-ui/vue'",
				basicExample: `<template>
  <Image src="/photo.jpg" alt="Photo" position="center" />
</template>`,
			},
		},
	},

	{
		name: "Icon",
		category: "display",
		description:
			"Renders consumer-supplied SVG strings by name. Ships no SVG assets.",
		isCompound: false,
		parts: [],
		props: {
			Icon: [
				{
					name: "type",
					type: "IconName",
					required: true,
					description:
						"The icon name that matches an SVG asset. This is the selector prop — it is named type, not name.",
				},
				{
					name: "icons",
					type: "Partial<Record<IconName, string>>",
					required: false,
					description: "Map of icon names to SVG markup strings.",
				},
				{
					name: "size",
					type: "IconSize",
					required: false,
					description: "Icon size preset; reflected as data-size.",
				},
				{
					name: "label",
					type: "string",
					required: false,
					description: "Accessible label for the icon.",
				},
			],
		},
		dataAttributes: [
			{ name: "data-size", description: "Reflects the size prop." },
			{
				name: "data-name",
				description: "Reflects the icon's type prop — the icon's name.",
			},
		],
		frameworks: {
			react: {
				importStatement: "import { Icon } from '@wire-ui/react'",
				basicExample: `<Icon name="check" icons={{ check: '<svg>...</svg>' }} size="medium" />`,
			},
			solid: {
				importStatement: "import { Icon } from '@wire-ui/solid'",
				basicExample: `<Icon name="check" icons={{ check: '<svg>...</svg>' }} size="medium" />`,
			},
			vue: {
				importStatement: "import { Icon } from '@wire-ui/vue'",
				basicExample: `<template>
  <Icon name="check" :icons="{ check: '<svg>...</svg>' }" size="medium" />
</template>`,
			},
		},
	},

	{
		name: "Timeago",
		category: "display",
		description:
			'Renders a relative time string (e.g. "5 minutes ago") from a datetime value.',
		isCompound: false,
		parts: [],
		props: {
			Timeago: [
				{
					name: "datetime",
					type: "Date | string",
					required: true,
					description: "The datetime to display relative to now.",
				},
				{
					name: "isDuration",
					type: "boolean",
					required: false,
					description:
						"Render as a duration instead of relative time.",
				},
				{
					name: "timeOnly",
					type: "boolean",
					required: false,
					description: "Show only the time portion.",
				},
				{
					name: "isLive",
					type: "boolean",
					required: false,
					description: "Enable live updates on an interval.",
				},
				{
					name: "locale",
					type: "string",
					required: false,
					description:
						"BCP 47 locale for relative-time and date-name formatting via Intl. Falls back to the nearest WireUIProvider, then en-US. Ignored when an explicit format override is supplied.",
				},
				{
					name: "format",
					type: "TimeagoFormatConfig",
					required: false,
					description:
						"Custom format configuration. When supplied, it fully overrides the locale-aware Intl formatting (legacy template behaviour).",
				},
				{
					name: "pluralize",
					type: "(n: number) => TimeagoPlural",
					required: false,
					description:
						"Determines the pluralisation form. Only used together with format.",
				},
			],
		},
		dataAttributes: [],
		frameworks: {
			react: {
				importStatement: "import { Timeago } from '@wire-ui/react'",
				basicExample: `<Timeago datetime={new Date()} />`,
			},
			solid: {
				importStatement: "import { Timeago } from '@wire-ui/solid'",
				basicExample: `<Timeago datetime={new Date()} />`,
			},
			vue: {
				importStatement: "import { Timeago } from '@wire-ui/vue'",
				basicExample: `<template>
  <Timeago :datetime="new Date()" />
</template>`,
			},
		},
		notes: [
			"The periodic re-render uses [[interval]] (useInterval / createInterval) internally — no behavior change.",
			"@wire-ui/vue sets a data-tick attribute on the <time> element to force the re-render on each tick. It is a Vue implementation detail, not part of the contract — do not style or assert against it.",
		],
	},

	// ─── Layout ─────────────────────────────────────────────────────────

	{
		name: "Divider",
		category: "layout",
		description:
			"Horizontal or vertical divider line with optional decorative mode.",
		isCompound: false,
		parts: [],
		props: {
			Divider: [
				{
					name: "orientation",
					type: '"horizontal" | "vertical"',
					required: false,
					description: "Divider orientation.",
					defaultValue: '"horizontal"',
				},
				{
					name: "decorative",
					type: "boolean",
					required: false,
					description:
						"When true, the divider is purely visual and hidden from assistive technology.",
					defaultValue: "true",
				},
			],
		},
		dataAttributes: [
			{
				name: "data-orientation",
				description:
					"Reflects the orientation prop. Divider ships no CSS, so this is the hook you size against — e.g. [data-orientation=horizontal] { width: 100%; height: 1px }.",
				values: '"horizontal" | "vertical"',
			},
		],
		frameworks: {
			react: {
				importStatement: "import { Divider } from '@wire-ui/react'",
				basicExample: `<Divider />`,
			},
			solid: {
				importStatement: "import { Divider } from '@wire-ui/solid'",
				basicExample: `<Divider />`,
			},
			vue: {
				importStatement: "import { Divider } from '@wire-ui/vue'",
				basicExample: `<template>
  <Divider />
</template>`,
			},
		},
	},

	{
		name: "List",
		category: "layout",
		description: "Renders an unordered or ordered list element.",
		isCompound: false,
		parts: [],
		props: {
			List: [
				{
					name: "isOrdered",
					type: "boolean",
					required: false,
					description: "Render as <ol> instead of <ul>.",
					defaultValue: "false",
				},
				{
					name: "type",
					type: "string",
					required: false,
					description: "Visual style type of the list.",
				},
				{
					name: "size",
					type: "string",
					required: false,
					description: "Size of the list items.",
				},
			],
		},
		dataAttributes: [
			{ name: "data-type", description: "Reflects list type." },
			{ name: "data-striped", description: "Present when striped." },
			{ name: "data-divider", description: "Present with dividers." },
			{ name: "data-size", description: "Reflects size." },
		],
		frameworks: {
			react: {
				importStatement: "import { List } from '@wire-ui/react'",
				basicExample: `<List>
  <li>Item 1</li>
  <li>Item 2</li>
</List>`,
			},
			solid: {
				importStatement: "import { List } from '@wire-ui/solid'",
				basicExample: `<List>
  <li>Item 1</li>
  <li>Item 2</li>
</List>`,
			},
			vue: {
				importStatement: "import { List } from '@wire-ui/vue'",
				basicExample: `<template>
  <List>
    <li>Item 1</li>
    <li>Item 2</li>
  </List>
</template>`,
			},
		},
	},

	{
		name: "AspectRatio",
		category: "layout",
		description:
			"Container that locks its content to a specific aspect ratio via padding-bottom spacer.",
		isCompound: false,
		parts: [],
		props: {
			AspectRatio: [
				{
					name: "ratio",
					type: "number",
					required: false,
					description:
						"Width / height ratio (e.g. 16/9 for widescreen).",
					defaultValue: "1",
				},
			],
		},
		dataAttributes: [
			{
				name: "data-ratio",
				description: "Reflects the numeric ratio prop.",
			},
		],
		frameworks: {
			react: {
				importStatement: "import { AspectRatio } from '@wire-ui/react'",
				basicExample: `<AspectRatio ratio={16 / 9}>
  <img src="/photo.jpg" alt="Photo" />
</AspectRatio>`,
			},
			solid: {
				importStatement: "import { AspectRatio } from '@wire-ui/solid'",
				basicExample: `<AspectRatio ratio={16 / 9}>
  <img src="/photo.jpg" alt="Photo" />
</AspectRatio>`,
			},
			vue: {
				importStatement: "import { AspectRatio } from '@wire-ui/vue'",
				basicExample: `<template>
  <AspectRatio :ratio="16 / 9">
    <img src="/photo.jpg" alt="Photo" />
  </AspectRatio>
</template>`,
			},
		},
	},

	{
		name: "ResizablePanels",
		category: "layout",
		description:
			"Compound split-pane layout with resizable panels separated by draggable handles.",
		isCompound: true,
		parts: ["Group", "Panel", "Handle"],
		props: {
			Group: [
				{
					name: "orientation",
					type: '"horizontal" | "vertical"',
					required: false,
					description: "Axis the panels split along.",
					defaultValue: '"horizontal"',
				},
				{
					name: "sizes",
					type: "number[]",
					required: false,
					description:
						"Controlled sizes as percentages summing to ~100. One per Panel.",
				},
				{
					name: "defaultSizes",
					type: "number[]",
					required: false,
					description: "Initial sizes (uncontrolled).",
				},
				{
					name: "onSizesChange",
					type: "(sizes: number[]) => void",
					required: false,
					description: "Called whenever sizes change.",
				},
			],
			Panel: [
				{
					name: "defaultSize",
					type: "number",
					required: false,
					description: "Default size in percent of the group.",
				},
				{
					name: "minSize",
					type: "number",
					required: false,
					description: "Minimum size in percent.",
				},
				{
					name: "maxSize",
					type: "number",
					required: false,
					description: "Maximum size in percent.",
				},
			],
			Handle: [
				{
					name: "disabled",
					type: "boolean",
					required: false,
					description: "Disable resizing on this handle.",
				},
			],
		},
		dataAttributes: [
			{
				name: "data-orientation",
				description: "Reflects the group's orientation.",
				appliesTo: "Group, Panel, Handle",
			},
			{
				name: "data-panel",
				description: "Marks a panel element.",
				appliesTo: "Panel",
			},
			{
				name: "data-handle",
				description: "Marks a drag handle element.",
				appliesTo: "Handle",
			},
			{
				name: "data-disabled",
				description: "Present when the handle cannot be dragged.",
				appliesTo: "Handle",
			},
		],
		frameworks: {
			react: {
				importStatement:
					"import { ResizablePanels } from '@wire-ui/react'",
				basicExample: `<ResizablePanels.Group orientation="horizontal">
  <ResizablePanels.Panel defaultSize={30} minSize={20}>
    Sidebar
  </ResizablePanels.Panel>
  <ResizablePanels.Handle />
  <ResizablePanels.Panel defaultSize={70}>
    Content
  </ResizablePanels.Panel>
</ResizablePanels.Group>`,
			},
			solid: {
				importStatement:
					"import { ResizablePanels } from '@wire-ui/solid'",
				basicExample: `<ResizablePanels.Group orientation="horizontal">
  <ResizablePanels.Panel defaultSize={30} minSize={20}>
    Sidebar
  </ResizablePanels.Panel>
  <ResizablePanels.Handle />
  <ResizablePanels.Panel defaultSize={70}>
    Content
  </ResizablePanels.Panel>
</ResizablePanels.Group>`,
			},
			vue: {
				importStatement:
					"import { ResizablePanels } from '@wire-ui/vue'",
				basicExample: `<template>
  <ResizablePanels.Group orientation="horizontal">
    <ResizablePanels.Panel :default-size="30" :min-size="20">
      Sidebar
    </ResizablePanels.Panel>
    <ResizablePanels.Handle />
    <ResizablePanels.Panel :default-size="70">
      Content
    </ResizablePanels.Panel>
  </ResizablePanels.Group>
</template>`,
			},
		},
		notes: [
			"The container part is Group, not Root, and the axis prop is orientation, not direction.",
		],
	},

	// ─── 0.4.0 components ───────────────────────────────────────────────

	{
		name: "Carousel",
		category: "display",
		description:
			"A headless, scroll-snap carousel (Embla-style) that tracks the active slide from scroll position, with Prev/Next controls, indicators, keyboard arrows, and optional looping.",
		isCompound: true,
		parts: [
			"Root",
			"Viewport",
			"Content",
			"Slide",
			"Previous",
			"Next",
			"Indicators",
		],
		props: {
			Root: [
				{
					name: "orientation",
					type: '"horizontal" | "vertical"',
					required: false,
					description: "Scroll axis.",
					defaultValue: "horizontal",
				},
				{
					name: "loop",
					type: "boolean",
					required: false,
					description: "Wrap from last to first slide.",
					defaultValue: "false",
				},
				{
					name: "defaultIndex",
					type: "number",
					required: false,
					description: "Initial slide index.",
					defaultValue: "0",
				},
				{
					name: "onIndexChange",
					type: "(index: number) => void",
					required: false,
					description: "Called when the selected slide changes.",
				},
			],
			Indicators: [
				{
					name: "children",
					type: "(props: { index: number; selected: boolean; scrollTo: () => void }) => React.ReactNode",
					required: true,
					description:
						"Render-prop invoked once per slide; receives index, selected (whether this is the active slide), and scrollTo (jump to this slide).",
				},
			],
		},
		dataAttributes: [
			{
				name: "data-orientation",
				description: "Reflects the carousel scroll axis.",
				values: '"horizontal" | "vertical"',
				appliesTo: "Root",
			},
			{
				name: "data-carousel-viewport",
				description: "Marks the scrollable viewport element.",
				appliesTo: "Viewport",
			},
			{
				name: "data-carousel-content",
				description: "Marks the track element that holds the slides.",
				appliesTo: "Content",
			},
			{
				name: "data-carousel-slide",
				description: "Marks an individual slide.",
				appliesTo: "Slide",
			},
		],
		frameworks: {
			react: {
				importStatement: "import { Carousel } from '@wire-ui/react'",
				basicExample:
					"<Carousel.Root>\n  <Carousel.Viewport tabIndex={0}>\n    <Carousel.Content>\n      {slides.map((c) => (\n        <Carousel.Slide key={c}>{c}</Carousel.Slide>\n      ))}\n    </Carousel.Content>\n  </Carousel.Viewport>\n  <Carousel.Previous>‹</Carousel.Previous>\n  <Carousel.Next>›</Carousel.Next>\n  <Carousel.Indicators>\n    {({ index, selected, scrollTo }) => (\n      <button key={index} onClick={scrollTo} data-selected={selected} />\n    )}\n  </Carousel.Indicators>\n</Carousel.Root>",
			},
			solid: {
				importStatement: "import { Carousel } from '@wire-ui/solid'",
				basicExample:
					"<Carousel.Root>\n  <Carousel.Viewport tabIndex={0}>\n    <Carousel.Content>\n      <For each={slides()}>{(c) => <Carousel.Slide>{c}</Carousel.Slide>}</For>\n    </Carousel.Content>\n  </Carousel.Viewport>\n  <Carousel.Previous>‹</Carousel.Previous>\n  <Carousel.Next>›</Carousel.Next>\n  <Carousel.Indicators>\n    {({ selected, scrollTo }) => (\n      <button onClick={scrollTo} data-selected={selected()} />\n    )}\n  </Carousel.Indicators>\n</Carousel.Root>",
			},
			vue: {
				importStatement: "import { Carousel } from '@wire-ui/vue'",
				basicExample:
					'<template>\n  <Carousel.Root :on-index-change="onIndexChange">\n    <Carousel.Viewport :tabindex="0">\n      <Carousel.Content>\n        <Carousel.Slide v-for="c in slides" :key="c">{{ c }}</Carousel.Slide>\n      </Carousel.Content>\n    </Carousel.Viewport>\n    <Carousel.Previous>‹</Carousel.Previous>\n    <Carousel.Next>›</Carousel.Next>\n    <Carousel.Indicators v-slot="{ selected, scrollTo }">\n      <button :data-selected="selected" @click="scrollTo" />\n    </Carousel.Indicators>\n  </Carousel.Root>\n</template>',
			},
		},
		notes: [
			"Carousel.Indicators requires a render-prop child that is invoked once per slide.",
			"Slide tracking is derived from the Viewport's scroll position; make the Viewport focusable (tabIndex={0}) to enable arrow-key navigation.",
			"@wire-ui/vue wraps Indicators in a <div data-carousel-indicators style=\"display: contents\"> because the render-prop needs a host element; React and Solid emit a bare fragment. Do not style against data-carousel-indicators — it is not part of the cross-framework contract.",
		],
	},

	{
		name: "Chat",
		category: "display",
		description:
			"A headless, streaming-aware chat surface with a virtualized message list that pins to the bottom as new tokens arrive, plus a composer (textarea + send) wired to shared submit state.",
		isCompound: true,
		parts: ["Root", "List", "Message", "Composer", "Input", "Send"],
		props: {
			Root: [
				{
					name: "value",
					type: "string",
					required: false,
					description: "Controlled composer value.",
				},
				{
					name: "defaultValue",
					type: "string",
					required: false,
					description: "Initial composer value (uncontrolled).",
				},
				{
					name: "onValueChange",
					type: "(value: string) => void",
					required: false,
					description: "Called when the composer text changes.",
				},
				{
					name: "onSubmit",
					type: "(value: string) => void",
					required: false,
					description:
						"Called on submit with the current value; the composer clears afterwards.",
				},
				{
					name: "isStreaming",
					type: "boolean",
					required: false,
					description:
						"When true, the assistant is responding and submission is blocked.",
				},
				{
					name: "disabled",
					type: "boolean",
					required: false,
					description: "Disable the composer.",
				},
			],
			List: [
				{
					name: "count",
					type: "number",
					required: true,
					description: "Total number of messages.",
				},
				{
					name: "estimateItemHeight",
					type: "number",
					required: false,
					description:
						"Estimated row height in px before measurement.",
					defaultValue: "72",
				},
				{
					name: "overscan",
					type: "number",
					required: false,
					description:
						"Extra rows rendered above/below the viewport.",
					defaultValue: "6",
				},
				{
					name: "stickToBottom",
					type: "boolean",
					required: false,
					description:
						"Keep the view pinned to the newest message (great for streaming).",
					defaultValue: "true",
				},
				{
					name: "children",
					type: "(props: { index: number }) => React.ReactNode",
					required: true,
					description:
						"Render-prop that renders a single message by index.",
				},
			],
			Message: [
				{
					name: "role",
					type: '"user" | "assistant" | "system" | (string & {})',
					required: false,
					description: "Who sent the message; surfaced as data-role.",
				},
				{
					name: "streaming",
					type: "boolean",
					required: false,
					description:
						"Mark the message as actively streaming; surfaced as data-streaming.",
				},
			],
			Input: [
				{
					name: "submitOnEnter",
					type: "boolean",
					required: false,
					description:
						"Submit on Enter (Shift+Enter inserts a newline).",
					defaultValue: "true",
				},
				{
					name: "autoResize",
					type: "boolean",
					required: false,
					description: "Auto-grow the textarea to fit its content.",
					defaultValue: "true",
				},
			],
		},
		dataAttributes: [
			{
				name: "data-chat-item",
				description:
					"Marks each virtualised row wrapper the List renders around your message.",
				appliesTo: "List row",
			},
			{
				name: "data-chat-list-sizer",
				description:
					"Marks the spacer element that gives the virtualised List its total scroll height.",
				appliesTo: "List",
			},
			{
				name: "data-role",
				description: "Identifies the message sender.",
				values: '"user" | "assistant" | "system" | string',
				appliesTo: "Message",
			},
			{
				name: "data-streaming",
				description:
					"Present while the message or composer is actively streaming.",
				appliesTo: "Message, Root, Send",
			},
			{
				name: "data-index",
				description: "Zero-based index of the rendered row.",
				appliesTo: "List",
			},
		],
		frameworks: {
			react: {
				importStatement: "import { Chat } from '@wire-ui/react'",
				basicExample:
					'<Chat.Root onSubmit={send} isStreaming={streaming}>\n  <Chat.List count={messages.length}>\n    {({ index }) => (\n      <Chat.Message role={messages[index].role}>\n        {messages[index].text}\n      </Chat.Message>\n    )}\n  </Chat.List>\n  <Chat.Composer>\n    <Chat.Input placeholder="Send a message…" />\n    <Chat.Send>Send</Chat.Send>\n  </Chat.Composer>\n</Chat.Root>',
			},
			solid: {
				importStatement: "import { Chat } from '@wire-ui/solid'",
				basicExample:
					'<Chat.Root onSubmit={send} isStreaming={streaming()}>\n  <Chat.List count={messages().length}>\n    {({ index }) => (\n      <Chat.Message role={messages()[index()].role}>\n        {messages()[index()].text}\n      </Chat.Message>\n    )}\n  </Chat.List>\n  <Chat.Composer>\n    <Chat.Input placeholder="Send a message…" />\n    <Chat.Send>Send</Chat.Send>\n  </Chat.Composer>\n</Chat.Root>',
			},
			vue: {
				importStatement: "import { Chat } from '@wire-ui/vue'",
				basicExample:
					'<template>\n  <Chat.Root :on-submit="send" :is-streaming="streaming">\n    <Chat.List :count="messages.length" v-slot="{ index }">\n      <Chat.Message :role="messages[index].role">\n        {{ messages[index].text }}\n      </Chat.Message>\n    </Chat.List>\n    <Chat.Composer>\n      <Chat.Input placeholder="Send a message…" />\n      <Chat.Send>Send</Chat.Send>\n    </Chat.Composer>\n  </Chat.Root>\n</template>',
			},
		},
		notes: [
			"Chat.List is virtualized: pass the total `count` and a render-prop that resolves each message by index rather than mapping children directly.",
			"The composer value, submit, and streaming/disabled state are shared via context between Root, Input, and Send.",
			"Submission is blocked while isStreaming is true.",
		],
	},

	{
		name: "Citation",
		category: "display",
		description:
			"A headless citation system that numbers a shared list of sources in array order, renders inline reference markers (Citation.Ref) linked to a footnote list (Citation.List).",
		isCompound: true,
		parts: ["Root", "Ref", "List"],
		props: {
			Root: [
				{
					name: "sources",
					type: "CitationSource[]",
					required: true,
					description:
						"Ordered list of sources; numbering follows array order. Each source: { id: string; label?: string; title?: string; url?: string; excerpt?: string }.",
				},
			],
			Ref: [
				{
					name: "for",
					type: "string",
					required: true,
					description: "Id of the source this reference points to.",
				},
				{
					name: "children",
					type: "React.ReactNode | ((props: { source: CitationSource; index: number }) => React.ReactNode)",
					required: false,
					description:
						"Static content or a render function (receives the resolved source and its 1-based index). Defaults to a <sup> marker.",
				},
			],
			List: [
				{
					name: "children",
					type: "(props: { source: CitationSource; index: number }) => React.ReactNode",
					required: false,
					description:
						"Render-prop for a single footnote, receiving the source and its 1-based index. Defaults to a title + link row.",
				},
			],
		},
		dataAttributes: [
			{
				name: "data-citation",
				description: "Marks an inline reference marker.",
				appliesTo: "Ref",
			},
			{
				name: "data-citation-source",
				description: "Marks a footnote entry in the list.",
				appliesTo: "List",
			},
			{
				name: "data-index",
				description:
					"1-based position of the source in the sources array.",
				appliesTo: "Ref, List",
			},
		],
		frameworks: {
			react: {
				importStatement: "import { Citation } from '@wire-ui/react'",
				basicExample:
					'<Citation.Root sources={sources}>\n  <p>The request succeeded<Citation.Ref for="rfc" />.</p>\n  <Citation.List>\n    {({ index, source }) => (\n      <a href={source.url}>{index}. {source.title}</a>\n    )}\n  </Citation.List>\n</Citation.Root>',
			},
			solid: {
				importStatement: "import { Citation } from '@wire-ui/solid'",
				basicExample:
					'<Citation.Root sources={sources()}>\n  <p>The request succeeded<Citation.Ref for="rfc" />.</p>\n  <Citation.List>\n    {({ index, source }) => (\n      <a href={source.url}>{index}. {source.title}</a>\n    )}\n  </Citation.List>\n</Citation.Root>',
			},
			vue: {
				importStatement: "import { Citation } from '@wire-ui/vue'",
				basicExample:
					'<template>\n  <Citation.Root :sources="sources">\n    <p>The request succeeded<Citation.Ref for="rfc" />.</p>\n    <Citation.List v-slot="{ index, source }">\n      <a :href="source.url">{{ index }}. {{ source.title }}</a>\n    </Citation.List>\n  </Citation.Root>\n</template>',
			},
		},
		notes: [
			"Source numbering is derived from array order in `sources`; Citation.Ref resolves its number by matching `for` to a source `id` (unknown ids resolve to index 0).",
			"Citation.Ref and Citation.List children may be either static nodes or a render function receiving { source, index }.",
		],
	},

	{
		name: "CodeBlock",
		category: "display",
		description:
			"Code display with a copy button, line numbers and diff regions. Syntax highlighting is bring-your-own — render `line.content` through Shiki/Prism/etc. inside CodeBlock.Lines.",
		isCompound: true,
		parts: ["Root", "Code", "Lines", "CopyButton"],
		props: {
			Root: [
				{
					name: "code",
					type: "string",
					required: true,
					description: "The source code to display.",
				},
				{
					name: "language",
					type: "string",
					required: false,
					description:
						"Language label, surfaced as data-language and on the context.",
				},
				{
					name: "diff",
					type: 'Record<number, "add" | "remove">',
					required: false,
					description:
						"Diff markers keyed by 1-based line number to 'add' or 'remove'. e.g. { 2: 'remove', 3: 'add' }.",
				},
				{
					name: "highlightLines",
					type: "number[]",
					required: false,
					description: "1-based line numbers to mark as highlighted.",
				},
				{
					name: "startLine",
					type: "number",
					required: false,
					description: "Number the first line starts at.",
					defaultValue: "1",
				},
				{
					name: "copyResetAfter",
					type: "number",
					required: false,
					description: "ms before the copied state resets.",
					defaultValue: "2000",
				},
			],
			Lines: [
				{
					name: "children",
					type: '(props: { line: { number: number; content: string; diff?: "add" | "remove"; highlighted: boolean } }) => React.ReactNode',
					required: true,
					description:
						"Render a single line. The wrapping element (with data-* attributes) is provided for you — bring your own syntax highlighting for line.content. line provides: number (1-based), content (raw text), diff (marker if any), highlighted (whether in highlightLines).",
				},
			],
			CopyButton: [
				{
					name: "children",
					type: "React.ReactNode | ((props: { copied: boolean }) => React.ReactNode)",
					required: false,
					description:
						"Static content, or a render function receiving the copied state.",
				},
			],
		},
		dataAttributes: [
			{
				name: "data-language",
				description: "The language label, when provided.",
				appliesTo: "Root, Code",
			},
			{
				name: "data-line",
				description: "Marks each rendered line element.",
				appliesTo: "Lines",
			},
			{
				name: "data-line-number",
				description: "The 1-based line number of the line.",
				appliesTo: "Lines",
			},
			{
				name: "data-diff",
				description: "Diff marker for the line, when present.",
				values: '"add" | "remove"',
				appliesTo: "Lines",
			},
			{
				name: "data-highlighted",
				description: "Present when the line is highlighted.",
				appliesTo: "Lines",
			},
			{
				name: "data-copied",
				description: "Present while the copied state is active.",
				appliesTo: "CopyButton",
			},
		],
		frameworks: {
			react: {
				importStatement: "import { CodeBlock } from '@wire-ui/react'",
				basicExample:
					"<CodeBlock.Root code={source} language=\"js\">\n  <CodeBlock.CopyButton>\n    {({ copied }) => (copied ? 'Copied!' : 'Copy')}\n  </CodeBlock.CopyButton>\n  <CodeBlock.Code>\n    <CodeBlock.Lines>\n      {({ line }) => (\n        <>\n          <span>{line.number}</span>\n          {line.content}\n        </>\n      )}\n    </CodeBlock.Lines>\n  </CodeBlock.Code>\n</CodeBlock.Root>",
			},
			solid: {
				importStatement: "import { CodeBlock } from '@wire-ui/solid'",
				basicExample:
					"<CodeBlock.Root code={source} language=\"js\">\n  <CodeBlock.CopyButton>\n    {({ copied }) => (copied() ? 'Copied!' : 'Copy')}\n  </CodeBlock.CopyButton>\n  <CodeBlock.Code>\n    <CodeBlock.Lines>\n      {({ line }) => (\n        <>\n          <span>{line().number}</span>\n          {line().content}\n        </>\n      )}\n    </CodeBlock.Lines>\n  </CodeBlock.Code>\n</CodeBlock.Root>",
			},
			vue: {
				importStatement: "import { CodeBlock } from '@wire-ui/vue'",
				basicExample:
					'<template>\n  <CodeBlock.Root :code="source" language="js">\n    <CodeBlock.CopyButton>\n      <template #default="{ copied }">{{ copied ? \'Copied!\' : \'Copy\' }}</template>\n    </CodeBlock.CopyButton>\n    <CodeBlock.Code>\n      <CodeBlock.Lines>\n        <template #default="{ line }">\n          <span>{{ line.number }}</span>{{ line.content }}\n        </template>\n      </CodeBlock.Lines>\n    </CodeBlock.Code>\n  </CodeBlock.Root>\n</template>',
			},
		},
		notes: [
			"Headless: no syntax highlighting is applied. Render line.content through Shiki/Prism/etc. yourself inside CodeBlock.Lines.",
			"A single trailing empty line is dropped so code ending in a newline doesn't render a phantom blank row.",
		],
	},

	{
		name: "ColorPicker",
		category: "form",
		description:
			"A headless HSVA color picker: a saturation/value area, hue and alpha sliders, a swatch and a hex input. Pointer-draggable and keyboard-accessible; emits hex strings.",
		isCompound: true,
		parts: [
			"Root",
			"Area",
			"AreaThumb",
			"Hue",
			"HueThumb",
			"Alpha",
			"AlphaThumb",
			"Swatch",
			"Input",
		],
		props: {
			Root: [
				{
					name: "value",
					type: "string",
					required: false,
					description:
						"Controlled value as a hex string (#rgb, #rrggbb, or #rrggbbaa).",
				},
				{
					name: "defaultValue",
					type: "string",
					required: false,
					description: "Initial value (uncontrolled).",
					defaultValue: "#000000",
				},
				{
					name: "onChange",
					type: "(hex: string) => void",
					required: false,
					description:
						"Called with the hex string whenever the color changes.",
				},
				{
					name: "alpha",
					type: "boolean",
					required: false,
					description: "Enable the alpha channel.",
					defaultValue: "true",
				},
			],
		},
		dataAttributes: [
			{
				name: "data-color-picker-area",
				description: "Marks the saturation/value area element.",
				appliesTo: "Area",
			},
			{
				name: "data-color-picker-hue",
				description: "Marks the hue slider element.",
				appliesTo: "Hue",
			},
			{
				name: "data-color-picker-alpha",
				description: "Marks the alpha slider element.",
				appliesTo: "Alpha",
			},
			{
				name: "data-color-picker-swatch",
				description: "Marks the swatch element.",
				appliesTo: "Swatch",
			},
			{
				name: "data-color-picker-area-thumb",
				description: "Marks the saturation/value thumb element.",
				appliesTo: "AreaThumb",
			},
			{
				name: "data-color-picker-hue-thumb",
				description: "Marks the hue thumb element.",
				appliesTo: "HueThumb",
			},
			{
				name: "data-color-picker-alpha-thumb",
				description: "Marks the alpha thumb element.",
				appliesTo: "AlphaThumb",
			},
		],
		frameworks: {
			react: {
				importStatement: "import { ColorPicker } from '@wire-ui/react'",
				basicExample:
					"<ColorPicker.Root value={color} onChange={setColor}>\n  <ColorPicker.Area>\n    <ColorPicker.AreaThumb />\n  </ColorPicker.Area>\n  <ColorPicker.Hue>\n    <ColorPicker.HueThumb />\n  </ColorPicker.Hue>\n  <ColorPicker.Alpha>\n    <ColorPicker.AlphaThumb />\n  </ColorPicker.Alpha>\n  <ColorPicker.Swatch />\n  <ColorPicker.Input />\n</ColorPicker.Root>",
			},
			solid: {
				importStatement: "import { ColorPicker } from '@wire-ui/solid'",
				basicExample:
					"<ColorPicker.Root value={color()} onChange={setColor}>\n  <ColorPicker.Area>\n    <ColorPicker.AreaThumb />\n  </ColorPicker.Area>\n  <ColorPicker.Hue>\n    <ColorPicker.HueThumb />\n  </ColorPicker.Hue>\n  <ColorPicker.Swatch />\n  <ColorPicker.Input />\n</ColorPicker.Root>",
			},
			vue: {
				importStatement: "import { ColorPicker } from '@wire-ui/vue'",
				basicExample:
					'<template>\n  <ColorPicker.Root :value="color" @change="color = $event">\n    <ColorPicker.Area>\n      <ColorPicker.AreaThumb />\n    </ColorPicker.Area>\n    <ColorPicker.Hue>\n      <ColorPicker.HueThumb />\n    </ColorPicker.Hue>\n    <ColorPicker.Swatch />\n    <ColorPicker.Input />\n  </ColorPicker.Root>\n</template>',
			},
		},
		notes: [
			"Headless and unstyled — bring your own layout; gradients are applied inline by Area/Hue/Alpha.",
			"Area, Hue and Alpha are role=slider, focusable, and respond to arrow keys.",
			"The Input is a hex text field synced to the current color; setting alpha=false strips the alpha channel from emitted hex.",
		],
	},

	{
		name: "Command",
		category: "overlay",
		description:
			"A command palette (cmdk/kbar-style): grouped, filterable actions with keyboard navigation and an optional global hotkey. Distinct from Combobox — it selects actions, not form values.",
		isCompound: true,
		parts: ["Root", "Input", "List", "Group", "Item", "Separator", "Empty"],
		props: {
			Root: [
				{
					name: "searchValue",
					type: "string",
					required: false,
					description: "Controlled search query.",
				},
				{
					name: "defaultSearchValue",
					type: "string",
					required: false,
					description: "Initial search query (uncontrolled).",
				},
				{
					name: "onSearchChange",
					type: "(value: string) => void",
					required: false,
					description: "Called when the query changes.",
				},
				{
					name: "filter",
					type: "(value: string, search: string, keywords: string[]) => boolean",
					required: false,
					description:
						"Custom matcher. Defaults to a case-insensitive substring search.",
				},
				{
					name: "onSelect",
					type: "(value: string) => void",
					required: false,
					description:
						"Called when any item is selected, with its value.",
				},
				{
					name: "loop",
					type: "boolean",
					required: false,
					description: "Wrap active-item navigation.",
					defaultValue: "true",
				},
				{
					name: "open",
					type: "boolean",
					required: false,
					description:
						"Controlled open state (when used as a toggleable palette).",
				},
				{
					name: "defaultOpen",
					type: "boolean",
					required: false,
					description: "Initial open state.",
				},
				{
					name: "onOpenChange",
					type: "(open: boolean) => void",
					required: false,
					description: "Called when the open state changes.",
				},
				{
					name: "shortcut",
					type: "string",
					required: false,
					description:
						"Global hotkey (e.g. 'mod+k') that toggles open.",
				},
			],
			Group: [
				{
					name: "heading",
					type: "React.ReactNode",
					required: false,
					description:
						"Optional heading rendered above the group's items.",
				},
			],
			Item: [
				{
					name: "value",
					type: "string",
					required: true,
					description:
						"Unique value — used as the item's identity and default search text.",
				},
				{
					name: "keywords",
					type: "string[]",
					required: false,
					description: "Extra terms to match against.",
				},
				{
					name: "disabled",
					type: "boolean",
					required: false,
					description: "Disable the item.",
					defaultValue: "false",
				},
				{
					name: "onSelect",
					type: "(value: string) => void",
					required: false,
					description: "Called when this item is chosen.",
				},
			],
		},
		dataAttributes: [
			{
				name: "data-command-root",
				description:
					"Marks the Command root element. A stable styling/testing hook, since Command ships no classes of its own.",
				appliesTo: "Root",
			},
			{
				name: "data-command-group-heading",
				description: "Marks the group's heading element.",
				appliesTo: "Group",
			},
			{
				name: "data-active",
				description:
					"Present on the currently active (highlighted) item.",
				appliesTo: "Item",
			},
			{
				name: "data-disabled",
				description: "Present on a disabled item.",
				appliesTo: "Item",
			},
		],
		frameworks: {
			react: {
				importStatement: "import { Command } from '@wire-ui/react'",
				basicExample:
					'<Command.Root onSelect={(v) => console.log(v)}>\n  <Command.Input placeholder="Type a command…" />\n  <Command.List>\n    <Command.Empty>No results found.</Command.Empty>\n    <Command.Item value="New File" keywords={[\'create\']}>New File</Command.Item>\n    <Command.Item value="Open Settings">Open Settings</Command.Item>\n  </Command.List>\n</Command.Root>',
			},
			solid: {
				importStatement: "import { Command } from '@wire-ui/solid'",
				basicExample:
					'<Command.Root onSelect={(v) => console.log(v)}>\n  <Command.Input placeholder="Type a command…" />\n  <Command.List>\n    <Command.Empty>No results found.</Command.Empty>\n    <Command.Item value="New File" keywords={[\'create\']}>New File</Command.Item>\n    <Command.Item value="Open Settings">Open Settings</Command.Item>\n  </Command.List>\n</Command.Root>',
			},
			vue: {
				importStatement: "import { Command } from '@wire-ui/vue'",
				basicExample:
					'<template>\n  <Command.Root @select="onSelect">\n    <Command.Input placeholder="Type a command…" />\n    <Command.List>\n      <Command.Empty>No results found.</Command.Empty>\n      <Command.Item value="New File" :keywords="[\'create\']">New File</Command.Item>\n      <Command.Item value="Open Settings">Open Settings</Command.Item>\n    </Command.List>\n  </Command.Root>\n</template>',
			},
		},
		notes: [
			"Items self-register; filtered-out items unmount and an active item that gets filtered out never stays active.",
			"Provide a `shortcut` (e.g. 'mod+k') to make Root a toggleable palette — it then renders nothing while closed.",
			"Separators are hidden while a search query is active; an empty Group is auto-hidden.",
		],
	},

	{
		name: "Diff",
		category: "display",
		description:
			"Line-level diff viewer with both unified and side-by-side (split) layouts. The diff is computed with a built-in dependency-free LCS algorithm and exposed as render parts you style yourself.",
		isCompound: true,
		parts: ["Root", "Unified", "Split", "Stats"],
		contextOnlyParts: ["Stats"],
		props: {
			Root: [
				{
					name: "oldValue",
					type: "string",
					required: true,
					description: "The original (before) text.",
				},
				{
					name: "newValue",
					type: "string",
					required: true,
					description: "The updated (after) text.",
				},
			],
			Unified: [
				{
					name: "children",
					type: "(props: { line: DiffLine }) => React.ReactNode",
					required: true,
					description:
						"Render-prop for a single unified line. Receives line ({ type: 'equal' | 'insert' | 'delete'; content: string; oldLine?: number; newLine?: number }).",
				},
			],
			Split: [
				{
					name: "children",
					type: "(props: { left?: DiffLine; right?: DiffLine }) => React.ReactNode",
					required: true,
					description:
						"Render-prop for a single side-by-side row. A modified line pairs a delete (left) with an insert (right).",
				},
			],
			Stats: [
				{
					name: "children",
					type: "(props: { additions: number; deletions: number }) => React.ReactNode",
					required: true,
					description:
						"Render-prop for the additions/deletions summary.",
				},
			],
		},
		dataAttributes: [
			{
				name: "data-diff-view",
				description: "Identifies the view layout wrapper.",
				values: '"unified" | "split"',
				appliesTo: "Unified, Split",
			},
			{
				name: "data-diff-line",
				description: "Marks a single line row in unified view.",
				appliesTo: "Unified",
			},
			{
				name: "data-diff-row",
				description: "Marks a paired old/new row in split view.",
				appliesTo: "Split",
			},
			{
				name: "data-type",
				description: "The diff type of the unified line.",
				values: '"equal" | "insert" | "delete"',
				appliesTo: "Unified",
			},
			{
				name: "data-left",
				description:
					"The diff type of the left (old) cell, if present.",
				values: '"equal" | "insert" | "delete"',
				appliesTo: "Split",
			},
			{
				name: "data-right",
				description:
					"The diff type of the right (new) cell, if present.",
				values: '"equal" | "insert" | "delete"',
				appliesTo: "Split",
			},
		],
		frameworks: {
			react: {
				importStatement: "import { Diff } from '@wire-ui/react'",
				basicExample:
					"<Diff.Root oldValue={before} newValue={after}>\n  <Diff.Unified>\n    {({ line }) => (\n      <div data-type={line.type}>\n        {line.oldLine ?? ''} {line.newLine ?? ''} {line.content}\n      </div>\n    )}\n  </Diff.Unified>\n</Diff.Root>",
			},
			solid: {
				importStatement: "import { Diff } from '@wire-ui/solid'",
				basicExample:
					"<Diff.Root oldValue={before()} newValue={after()}>\n  <Diff.Unified>\n    {({ line }) => (\n      <div data-type={line.type}>\n        {line.oldLine ?? ''} {line.newLine ?? ''} {line.content}\n      </div>\n    )}\n  </Diff.Unified>\n</Diff.Root>",
			},
			vue: {
				importStatement: "import { Diff } from '@wire-ui/vue'",
				basicExample:
					'<template>\n  <Diff.Root :old-value="before" :new-value="after">\n    <Diff.Unified>\n      <template #default="{ line }">\n        <div :data-type="line.type">{{ line.content }}</div>\n      </template>\n    </Diff.Unified>\n  </Diff.Root>\n</template>',
			},
		},
		notes: [
			"Diff is computed with a dependency-free LCS algorithm at line granularity; Unified, Split and Stats are render-prop parts you style yourself.",
			"A modified line is represented as a delete (left) paired with an insert (right) in the split view.",
		],
	},

	{
		name: "Editable",
		category: "form",
		description:
			"Inline text editing: click the preview to edit, Enter/blur to commit, Escape to discard. Pair with Editable.Area for multiline.",
		isCompound: true,
		parts: [
			"Root",
			"Preview",
			"Input",
			"Area",
			"EditTrigger",
			"SubmitTrigger",
			"CancelTrigger",
		],
		props: {
			Root: [
				{
					name: "value",
					type: "string",
					required: false,
					description: "Controlled committed value.",
				},
				{
					name: "defaultValue",
					type: "string",
					required: false,
					description: "Initial committed value (uncontrolled).",
				},
				{
					name: "onChange",
					type: "(value: string) => void",
					required: false,
					description:
						"Called when the committed value changes (on submit).",
				},
				{
					name: "editing",
					type: "boolean",
					required: false,
					description: "Controlled editing state.",
				},
				{
					name: "defaultEditing",
					type: "boolean",
					required: false,
					description: "Initial editing state (uncontrolled).",
					defaultValue: "false",
				},
				{
					name: "onEditingChange",
					type: "(editing: boolean) => void",
					required: false,
					description: "Called when editing starts or stops.",
				},
				{
					name: "onSubmit",
					type: "(value: string) => void",
					required: false,
					description:
						"Called with the new value when an edit is committed.",
				},
				{
					name: "onCancel",
					type: "() => void",
					required: false,
					description: "Called when an edit is discarded.",
				},
				{
					name: "onEdit",
					type: "() => void",
					required: false,
					description: "Called when editing begins.",
				},
				{
					name: "submitOnBlur",
					type: "boolean",
					required: false,
					description: "Commit when the field loses focus.",
					defaultValue: "true",
				},
				{
					name: "disabled",
					type: "boolean",
					required: false,
					description: "Prevent editing.",
					defaultValue: "false",
				},
				{
					name: "placeholder",
					type: "string",
					required: false,
					description: "Shown by Preview when the value is empty.",
				},
			],
		},
		dataAttributes: [
			{
				name: "data-editing",
				description: "Present on Root while editing is active.",
				appliesTo: "Root",
			},
			{
				name: "data-disabled",
				description: "Present on Root when editing is disabled.",
				appliesTo: "Root",
			},
			{
				name: "data-empty",
				description:
					"Present on Preview when the committed value is empty.",
				appliesTo: "Preview",
			},
		],
		frameworks: {
			react: {
				importStatement: "import { Editable } from '@wire-ui/react'",
				basicExample:
					'<Editable.Root defaultValue="Click to edit me" placeholder="Enter some text…">\n  <Editable.Preview />\n  <Editable.Input />\n</Editable.Root>',
			},
			solid: {
				importStatement: "import { Editable } from '@wire-ui/solid'",
				basicExample:
					'<Editable.Root defaultValue="Click to edit me" placeholder="Enter some text…">\n  <Editable.Preview />\n  <Editable.Input />\n</Editable.Root>',
			},
			vue: {
				importStatement: "import { Editable } from '@wire-ui/vue'",
				basicExample:
					'<template>\n  <Editable.Root default-value="Click to edit me" placeholder="Enter some text…" @submit="onSubmit">\n    <Editable.Preview />\n    <Editable.Input />\n  </Editable.Root>\n</template>',
			},
		},
		notes: [
			"Preview and EditTrigger render only when not editing; Input, Area, SubmitTrigger and CancelTrigger render only while editing.",
			"Input commits on Enter; Area (multiline) commits on Cmd/Ctrl+Enter. Escape cancels in both.",
			"Input and Area auto-focus and select their text when editing begins.",
		],
	},

	{
		name: "EmptyState",
		category: "display",
		description:
			'A composable empty / zero-data placeholder with media, title, description and action slots. Root carries role="status".',
		isCompound: true,
		parts: ["Root", "Media", "Title", "Description", "Actions"],
		props: {},
		dataAttributes: [],
		frameworks: {
			react: {
				importStatement: "import { EmptyState } from '@wire-ui/react'",
				basicExample:
					"<EmptyState.Root>\n  <EmptyState.Media>📭</EmptyState.Media>\n  <EmptyState.Title>No messages yet</EmptyState.Title>\n  <EmptyState.Description>When you start a conversation, it will show up here.</EmptyState.Description>\n  <EmptyState.Actions>\n    <button>New message</button>\n  </EmptyState.Actions>\n</EmptyState.Root>",
			},
			solid: {
				importStatement: "import { EmptyState } from '@wire-ui/solid'",
				basicExample:
					"<EmptyState.Root>\n  <EmptyState.Media>📭</EmptyState.Media>\n  <EmptyState.Title>No messages yet</EmptyState.Title>\n  <EmptyState.Description>When you start a conversation, it will show up here.</EmptyState.Description>\n  <EmptyState.Actions>\n    <button>New message</button>\n  </EmptyState.Actions>\n</EmptyState.Root>",
			},
			vue: {
				importStatement: "import { EmptyState } from '@wire-ui/vue'",
				basicExample:
					"<template>\n  <EmptyState.Root>\n    <EmptyState.Media>📭</EmptyState.Media>\n    <EmptyState.Title>No messages yet</EmptyState.Title>\n    <EmptyState.Description>When you start a conversation, it will show up here.</EmptyState.Description>\n    <EmptyState.Actions>\n      <button>New message</button>\n    </EmptyState.Actions>\n  </EmptyState.Root>\n</template>",
			},
		},
		notes: [
			'Root renders with role="status" so screen readers announce the empty state.',
			'Media is marked aria-hidden="true" (decorative icon/illustration slot). Title renders an <h3>; Description renders a <p>.',
			"All sub-parts are presentational; no part has component-specific props beyond standard HTML attributes.",
		],
	},

	{
		name: "HoverCard",
		category: "overlay",
		description:
			"A richer, interactive alternative to Tooltip — opens on hover/focus after a delay and stays open while you move into the card. Content is fully interactive (links, buttons).",
		isCompound: true,
		parts: ["Root", "Trigger", "Content"],
		props: {
			Root: [
				{
					name: "open",
					type: "boolean",
					required: false,
					description: "Controlled open state.",
				},
				{
					name: "defaultOpen",
					type: "boolean",
					required: false,
					description: "Initial open state (uncontrolled).",
					defaultValue: "false",
				},
				{
					name: "onOpenChange",
					type: "(open: boolean) => void",
					required: false,
					description: "Called when the open state changes.",
				},
				{
					name: "openDelay",
					type: "number",
					required: false,
					description: "ms to wait before opening on hover.",
					defaultValue: "300",
				},
				{
					name: "closeDelay",
					type: "number",
					required: false,
					description: "ms to wait before closing after leaving.",
					defaultValue: "200",
				},
			],
			Content: [
				{
					name: "side",
					type: '"top" | "right" | "bottom" | "left"',
					required: false,
					description: "Side of the trigger to render on.",
					defaultValue: "bottom",
				},
				{
					name: "sideOffset",
					type: "number",
					required: false,
					description: "Gap in px between trigger and card.",
					defaultValue: "8",
				},
				{
					name: "forceMount",
					type: "boolean",
					required: false,
					description:
						"Keep the card mounted while closed (for CSS exit animations).",
					defaultValue: "false",
				},
			],
		},
		dataAttributes: [
			{
				name: "data-state",
				description:
					"Reflects whether the hover card is open or closed.",
				values: '"open" | "closed"',
				appliesTo: "Trigger, Content",
			},
			{
				name: "data-side",
				description: "Reflects the side the content renders on.",
				values: '"top" | "right" | "bottom" | "left"',
				appliesTo: "Content",
			},
		],
		frameworks: {
			react: {
				importStatement: "import { HoverCard } from '@wire-ui/react'",
				basicExample:
					'<HoverCard.Root>\n  <HoverCard.Trigger>@wire-ui</HoverCard.Trigger>\n  <HoverCard.Content side="bottom">\n    Headless component primitives.\n  </HoverCard.Content>\n</HoverCard.Root>',
			},
			solid: {
				importStatement: "import { HoverCard } from '@wire-ui/solid'",
				basicExample:
					'<HoverCard.Root>\n  <HoverCard.Trigger>@wire-ui</HoverCard.Trigger>\n  <HoverCard.Content side="bottom">\n    Headless component primitives.\n  </HoverCard.Content>\n</HoverCard.Root>',
			},
			vue: {
				importStatement: "import { HoverCard } from '@wire-ui/vue'",
				basicExample:
					'<template>\n  <HoverCard.Root>\n    <HoverCard.Trigger>@wire-ui</HoverCard.Trigger>\n    <HoverCard.Content side="bottom">\n      Headless component primitives.\n    </HoverCard.Content>\n  </HoverCard.Root>\n</template>',
			},
		},
		notes: [
			"Opens on hover after openDelay and on focus immediately; stays open while the pointer moves into the content.",
			'Content is rendered with role="dialog".',
		],
	},

	{
		name: "InfiniteScroll",
		category: "layout",
		description:
			"A sentinel-based load-more primitive built on useIntersectionObserver. Render your list, then drop a Sentinel at the end — it calls onLoadMore as it scrolls into view (gated by hasMore / loading).",
		isCompound: true,
		parts: ["Root", "Sentinel", "Loader", "EndMessage"],
		props: {
			Root: [
				{
					name: "onLoadMore",
					type: "() => void",
					required: true,
					description:
						"Called when the sentinel scrolls into view and more data can be loaded.",
				},
				{
					name: "hasMore",
					type: "boolean",
					required: false,
					description: "Whether there are more items to load.",
					defaultValue: "true",
				},
				{
					name: "loading",
					type: "boolean",
					required: false,
					description:
						"Whether a load is in flight (suppresses further triggers).",
					defaultValue: "false",
				},
				{
					name: "rootMargin",
					type: "string",
					required: false,
					description:
						"Margin around the root used to pre-fetch before the sentinel is fully visible.",
					defaultValue: "0px",
				},
				{
					name: "disabled",
					type: "boolean",
					required: false,
					description: "Disable triggering entirely.",
					defaultValue: "false",
				},
			],
		},
		dataAttributes: [
			{
				name: "data-loading",
				description: "Present on Root while a load is in flight.",
				appliesTo: "Root",
			},
			{
				name: "data-has-more",
				description: "Present on Root while more items can be loaded.",
				appliesTo: "Root",
			},
			{
				name: "data-infinite-scroll-sentinel",
				description: "Marks the observed sentinel element.",
				appliesTo: "Sentinel",
			},
		],
		frameworks: {
			react: {
				importStatement:
					"import { InfiniteScroll } from '@wire-ui/react'",
				basicExample:
					"<InfiniteScroll.Root onLoadMore={loadMore} hasMore={hasMore} loading={loading}>\n  <ul>{items.map((i) => <li key={i}>Item {i}</li>)}</ul>\n  <InfiniteScroll.Loader>Loading…</InfiniteScroll.Loader>\n  <InfiniteScroll.EndMessage>No more items</InfiniteScroll.EndMessage>\n  <InfiniteScroll.Sentinel />\n</InfiniteScroll.Root>",
			},
			solid: {
				importStatement:
					"import { InfiniteScroll } from '@wire-ui/solid'",
				basicExample:
					"<InfiniteScroll.Root onLoadMore={loadMore} hasMore={hasMore()} loading={loading()}>\n  <ul><For each={items()}>{(i) => <li>Item {i}</li>}</For></ul>\n  <InfiniteScroll.Loader>Loading…</InfiniteScroll.Loader>\n  <InfiniteScroll.EndMessage>No more items</InfiniteScroll.EndMessage>\n  <InfiniteScroll.Sentinel />\n</InfiniteScroll.Root>",
			},
			vue: {
				importStatement:
					"import { InfiniteScroll } from '@wire-ui/vue'",
				basicExample:
					'<template>\n  <InfiniteScroll.Root :has-more="hasMore" :loading="loading" @load-more="loadMore">\n    <ul><li v-for="i in items" :key="i">Item {{ i }}</li></ul>\n    <InfiniteScroll.Loader>Loading…</InfiniteScroll.Loader>\n    <InfiniteScroll.EndMessage>No more items</InfiniteScroll.EndMessage>\n    <InfiniteScroll.Sentinel />\n  </InfiniteScroll.Root>\n</template>',
			},
		},
		notes: [
			"Loader only renders while loading is true; EndMessage only renders when hasMore is false.",
			"Place the Sentinel after your list content so it is observed at the scroll boundary.",
		],
	},

	{
		name: "Markdown",
		category: "display",
		description:
			"Headless Markdown renderer. Bring your own parser (remark/marked) — Wire UI exposes the render parts via the components map so you control every element.",
		isCompound: false,
		parts: [],
		props: {
			Markdown: [
				{
					name: "nodes",
					type: "MarkdownNode[]",
					required: false,
					description:
						"Pre-parsed node tree. Provide this, or content + parse.",
				},
				{
					name: "content",
					type: "string",
					required: false,
					description:
						"Raw Markdown source. Parsed with parse when provided.",
				},
				{
					name: "parse",
					type: "(content: string) => MarkdownNode[]",
					required: false,
					description:
						"Turns content into normalized nodes — wrap remark/marked here.",
				},
				{
					name: "components",
					type: "Partial<Record<string, MarkdownComponent>>",
					required: false,
					description:
						"Override the renderer used for one or more node types. Overrides merge over the built-in renderers.",
				},
			],
		},
		dataAttributes: [
			{
				name: "data-inline",
				description:
					"Present on the code element rendered for inline code.",
				appliesTo: "Markdown (inline code)",
			},
			{
				name: "data-language",
				description: "Language hint on fenced code blocks.",
				appliesTo: "Markdown (code block)",
			},
			{
				name: "data-task",
				description: "Present on a task-list checkbox list item.",
				appliesTo: "Markdown (list item)",
			},
			{
				name: "data-checked",
				description: "Present on a task list item when it is checked.",
				appliesTo: "Markdown (list item)",
			},
		],
		frameworks: {
			react: {
				importStatement: "import { Markdown } from '@wire-ui/react'",
				basicExample:
					"const nodes = [\n  { type: 'heading', depth: 2, children: [{ type: 'text', value: 'Wire UI' }] },\n  { type: 'paragraph', children: [{ type: 'text', value: 'Headless rendering.' }] },\n];\n\n<Markdown nodes={nodes} />",
			},
			solid: {
				importStatement: "import { Markdown } from '@wire-ui/solid'",
				basicExample:
					"const nodes = [\n  { type: 'heading', depth: 2, children: [{ type: 'text', value: 'Wire UI' }] },\n  { type: 'paragraph', children: [{ type: 'text', value: 'Headless rendering.' }] },\n];\n\n<Markdown nodes={nodes} />",
			},
			vue: {
				importStatement: "import { Markdown } from '@wire-ui/vue'",
				basicExample:
					'<template>\n  <Markdown :nodes="nodes" />\n</template>',
			},
		},
		notes: [
			"Provide either nodes (pre-parsed) or content; when content is given without parse, it renders as a single paragraph.",
			"Node shape mirrors mdast (remark's AST); unknown node types fall back to rendering their children.",
			"Default renderers emit semantic HTML with zero styling; pass a components map to override per node type.",
			"@wire-ui/vue wraps plain text nodes in <span data-text> because its renderer needs a keyed element; React and Solid emit bare text. Do not style against data-text — it is not part of the cross-framework contract.",
		],
	},

	{
		name: "Mention",
		category: "form",
		description:
			"Inline @-mention primitive: a combobox that tracks the caret inside a textarea, filters options as you type, and inserts the chosen token. The trigger character, options and filtering are all configurable.",
		isCompound: true,
		parts: ["Root", "Input", "Content", "Items", "Empty"],
		props: {
			Root: [
				{
					name: "options",
					type: "MentionOption[]",
					required: true,
					description: "Options shown when the trigger is active.",
				},
				{
					name: "value",
					type: "string",
					required: false,
					description: "Controlled text value.",
				},
				{
					name: "defaultValue",
					type: "string",
					required: false,
					description: "Initial text value (uncontrolled).",
				},
				{
					name: "onChange",
					type: "(value: string) => void",
					required: false,
					description: "Called whenever the text changes.",
				},
				{
					name: "trigger",
					type: "string",
					required: false,
					description: "Character that opens the menu.",
					defaultValue: "@",
				},
				{
					name: "filter",
					type: "(option: MentionOption, query: string) => boolean",
					required: false,
					description:
						"Predicate used to filter options against the current query. Defaults to a case-insensitive label match.",
				},
				{
					name: "onSelect",
					type: "(option: MentionOption) => void",
					required: false,
					description: "Called when an option is chosen.",
				},
				{
					name: "appendSpace",
					type: "boolean",
					required: false,
					description: "Append a space after the inserted mention.",
					defaultValue: "true",
				},
				{
					name: "disabled",
					type: "boolean",
					required: false,
					description: "Disable the whole control.",
					defaultValue: "false",
				},
			],
			Items: [
				{
					name: "children",
					type: "(props: { option: MentionOption; active: boolean; index: number }) => React.ReactNode",
					required: true,
					description:
						"Render-prop called once per filtered option. Receives the option, whether it is the active (highlighted) item, and its index.",
				},
			],
		},
		dataAttributes: [
			{
				name: "data-disabled",
				description: "Present when the control is disabled.",
				appliesTo: "Root",
			},
			{
				name: "data-state",
				description: 'Set to "open" while the listbox is visible.',
				values: '"open"',
				appliesTo: "Content",
			},
			{
				name: "data-active",
				description: "Present on the currently highlighted option.",
				appliesTo: "Items",
			},
		],
		frameworks: {
			react: {
				importStatement: "import { Mention } from '@wire-ui/react'",
				basicExample:
					'<Mention.Root options={people} className="relative">\n  <Mention.Input placeholder="Type @ to mention…" />\n  <Mention.Content>\n    <Mention.Items>\n      {({ option }) => <div>{option.label}</div>}\n    </Mention.Items>\n    <Mention.Empty>No matches</Mention.Empty>\n  </Mention.Content>\n</Mention.Root>',
			},
			solid: {
				importStatement: "import { Mention } from '@wire-ui/solid'",
				basicExample:
					'<Mention.Root options={people} class="relative">\n  <Mention.Input placeholder="Type @ to mention…" />\n  <Mention.Content>\n    <Mention.Items>\n      {({ option }) => <div>{option.label}</div>}\n    </Mention.Items>\n    <Mention.Empty>No matches</Mention.Empty>\n  </Mention.Content>\n</Mention.Root>',
			},
			vue: {
				importStatement: "import { Mention } from '@wire-ui/vue'",
				basicExample:
					'<template>\n  <Mention.Root :options="people" class="relative" @change="onChange">\n    <Mention.Input placeholder="Type @ to mention…" />\n    <Mention.Content>\n      <Mention.Items v-slot="{ option }">\n        <div>{{ option.label }}</div>\n      </Mention.Items>\n      <Mention.Empty>No matches</Mention.Empty>\n    </Mention.Content>\n  </Mention.Root>\n</template>',
			},
		},
		notes: [
			"MentionOption shape: { id: string | number; label: string; value?: string; disabled?: boolean }. label is the display text and the inserted token unless value is provided.",
			"The trigger must sit at the start of the text or follow whitespace, and the query must contain no whitespace.",
			"Keyboard: ArrowUp/ArrowDown move the active option, Enter/Tab select it, Escape dismisses the menu. Items and Empty must be placed inside Content.",
		],
	},

	{
		name: "RichText",
		category: "form",
		description:
			"A slot-based Markdown editor scaffold built on top of Markdown. Provides a toolbar with selection-wrapping actions, an editor textarea and a live preview, with edit / preview / split modes.",
		isCompound: true,
		parts: ["Root", "Toolbar", "Action", "Editor", "Preview"],
		props: {
			Root: [
				{
					name: "value",
					type: "string",
					required: false,
					description: "Controlled Markdown source.",
				},
				{
					name: "defaultValue",
					type: "string",
					required: false,
					description: "Initial Markdown source (uncontrolled).",
				},
				{
					name: "onChange",
					type: "(value: string) => void",
					required: false,
					description: "Called when the source changes.",
				},
				{
					name: "mode",
					type: '"edit" | "preview" | "split"',
					required: false,
					description: "Controlled view mode.",
				},
				{
					name: "defaultMode",
					type: '"edit" | "preview" | "split"',
					required: false,
					description: "Initial view mode (uncontrolled).",
					defaultValue: "edit",
				},
				{
					name: "onModeChange",
					type: '(mode: "edit" | "preview" | "split") => void',
					required: false,
					description: "Called when the view mode changes.",
				},
				{
					name: "parse",
					type: "(content: string) => MarkdownNode[]",
					required: false,
					description: "Parser used by Preview (wrap remark/marked).",
				},
				{
					name: "components",
					type: "MarkdownComponents",
					required: false,
					description:
						"Render-part overrides forwarded to the Markdown preview.",
				},
			],
			Action: [
				{
					name: "wrap",
					type: "string | [string, string]",
					required: false,
					description:
						"Wrap the selection. Pass a single string (used for both sides) or [before, after].",
				},
				{
					name: "insert",
					type: "string",
					required: false,
					description: "Insert text at the caret.",
				},
			],
		},
		dataAttributes: [
			{
				name: "data-mode",
				description: "Reflects the current view mode.",
				values: '"edit" | "preview" | "split"',
				appliesTo: "Root, Editor, Preview",
			},
		],
		frameworks: {
			react: {
				importStatement: "import { RichText } from '@wire-ui/react'",
				basicExample:
					'<RichText.Root defaultMode="split" parse={miniParse}>\n  <RichText.Toolbar>\n    <RichText.Action wrap="**">B</RichText.Action>\n  </RichText.Toolbar>\n  <RichText.Editor placeholder="Write markdown…" />\n  <RichText.Preview />\n</RichText.Root>',
			},
			solid: {
				importStatement: "import { RichText } from '@wire-ui/solid'",
				basicExample:
					'<RichText.Root defaultMode="split" parse={miniParse}>\n  <RichText.Toolbar>\n    <RichText.Action wrap="**">B</RichText.Action>\n  </RichText.Toolbar>\n  <RichText.Editor placeholder="Write markdown…" />\n  <RichText.Preview />\n</RichText.Root>',
			},
			vue: {
				importStatement: "import { RichText } from '@wire-ui/vue'",
				basicExample:
					'<template>\n  <RichText.Root default-mode="split" :parse="miniParse" @change="onChange">\n    <RichText.Toolbar>\n      <RichText.Action wrap="**">B</RichText.Action>\n    </RichText.Toolbar>\n    <RichText.Editor placeholder="Write markdown…" />\n    <RichText.Preview />\n  </RichText.Root>\n</template>',
			},
		},
		notes: [
			"Action wraps the current selection or inserts text at the caret; pass wrap as a single string for symmetric markers or a [before, after] tuple (e.g. ['[', '](url)']).",
			"Editor renders nothing in 'preview' mode; Preview renders nothing in 'edit' mode; in 'split' mode both are shown.",
			"Provide a parse function (wrap remark/marked) and optional components overrides for the Preview, which is rendered via the Markdown component.",
			"Preview delegates rendering to Markdown, so the markdown node attributes (data-inline, data-language, data-checked, data-task) appear inside Preview too — see the Markdown entry.",
		],
	},

	{
		name: "ScrollArea",
		category: "layout",
		description:
			"A scroll container with a custom, stylable scrollbar. The native scrollbar is hidden; Scrollbar + Thumb reflect the scroll position and support drag.",
		isCompound: true,
		parts: ["Root", "Viewport", "Scrollbar", "Thumb"],
		props: {
			Scrollbar: [
				{
					name: "orientation",
					type: '"vertical" | "horizontal"',
					required: false,
					description: "Which axis this scrollbar controls.",
					defaultValue: "vertical",
				},
				{
					name: "forceMount",
					type: "boolean",
					required: false,
					description:
						"Render even when the content doesn't overflow.",
					defaultValue: "false",
				},
			],
		},
		dataAttributes: [
			{
				name: "data-scroll-area-scrollbar",
				description: "Marks a scrollbar track element.",
				appliesTo: "Scrollbar",
			},
			{
				name: "data-scroll-area-thumb",
				description: "Marks a scrollbar thumb element.",
				appliesTo: "Thumb",
			},
			{
				name: "data-scroll-area-viewport",
				description: "Marks the scrollable viewport element.",
				appliesTo: "Viewport",
			},
			{
				name: "data-orientation",
				description: "Reflects the scrollbar/thumb axis.",
				values: '"vertical" | "horizontal"',
				appliesTo: "Scrollbar, Thumb",
			},
			{
				name: "data-state",
				description:
					"Whether the content currently overflows along this axis.",
				values: '"visible" | "hidden"',
				appliesTo: "Scrollbar",
			},
		],
		frameworks: {
			react: {
				importStatement: "import { ScrollArea } from '@wire-ui/react'",
				basicExample:
					'<ScrollArea.Root className="h-72 w-56">\n  <ScrollArea.Viewport className="h-full w-full">\n    {items}\n  </ScrollArea.Viewport>\n  <ScrollArea.Scrollbar orientation="vertical">\n    <ScrollArea.Thumb />\n  </ScrollArea.Scrollbar>\n</ScrollArea.Root>',
			},
			solid: {
				importStatement: "import { ScrollArea } from '@wire-ui/solid'",
				basicExample:
					'<ScrollArea.Root class="h-72 w-56">\n  <ScrollArea.Viewport class="h-full w-full">\n    {items()}\n  </ScrollArea.Viewport>\n  <ScrollArea.Scrollbar orientation="vertical">\n    <ScrollArea.Thumb />\n  </ScrollArea.Scrollbar>\n</ScrollArea.Root>',
			},
			vue: {
				importStatement: "import { ScrollArea } from '@wire-ui/vue'",
				basicExample:
					'<template>\n  <ScrollArea.Root class="h-72 w-56">\n    <ScrollArea.Viewport class="h-full w-full">\n      <div v-for="t in items" :key="t">{{ t }}</div>\n    </ScrollArea.Viewport>\n    <ScrollArea.Scrollbar orientation="vertical">\n      <ScrollArea.Thumb />\n    </ScrollArea.Scrollbar>\n  </ScrollArea.Root>\n</template>',
			},
		},
		notes: [
			"Add a Scrollbar per axis (orientation 'vertical' and/or 'horizontal') to support both directions.",
			"By default a Scrollbar only mounts when its axis overflows; set forceMount to always render it.",
			"Thumb is sized and positioned automatically from the viewport's scroll metrics and supports pointer drag to scroll.",
		],
	},

	{
		name: "Sheet",
		category: "overlay",
		description:
			"A Drawer-adjacent panel that slides from the top or bottom edge, with iOS-style snap points: drag the handle to rest at configured heights, or past the smallest snap to dismiss. Modal by default (focus trap + scroll lock).",
		isCompound: true,
		parts: [
			"Root",
			"Trigger",
			"Portal",
			"Overlay",
			"Content",
			"Handle",
			"Title",
			"Description",
			"Close",
		],
		contextOnlyParts: ["Root", "Portal"],
		props: {
			Root: [
				{
					name: "open",
					type: "boolean",
					required: false,
					description: "Controlled open state.",
				},
				{
					name: "defaultOpen",
					type: "boolean",
					required: false,
					description: "Initial open state (uncontrolled).",
				},
				{
					name: "onOpenChange",
					type: "(open: boolean) => void",
					required: false,
					description: "Called when the open state changes.",
				},
				{
					name: "side",
					type: '"top" | "bottom"',
					required: false,
					description: "Edge the sheet slides from.",
					defaultValue: "bottom",
				},
				{
					name: "snapPoints",
					type: "number[]",
					required: false,
					description:
						"Rest positions. Values <= 1 are a fraction of the viewport; values > 1 are px. Order them smallest to largest.",
					defaultValue: "[1]",
				},
				{
					name: "activeSnapPoint",
					type: "number",
					required: false,
					description: "Controlled active snap index.",
				},
				{
					name: "defaultActiveSnapPoint",
					type: "number",
					required: false,
					description:
						"Initial active snap index. Defaults to the largest snap.",
				},
				{
					name: "onActiveSnapPointChange",
					type: "(index: number) => void",
					required: false,
					description: "Called when the active snap index changes.",
				},
				{
					name: "modal",
					type: "boolean",
					required: false,
					description:
						"Render a focus-trapping, scroll-locking modal.",
					defaultValue: "true",
				},
				{
					name: "dismissible",
					type: "boolean",
					required: false,
					description:
						"Allow closing by dragging past the smallest snap, Escape, or overlay click.",
					defaultValue: "true",
				},
			],
			Portal: [
				{
					name: "container",
					type: "Element | null",
					required: false,
					description:
						"DOM node the sheet is portaled into. Defaults to document.body.",
				},
			],
		},
		dataAttributes: [
			{
				name: "data-state",
				description: "Reflects whether the sheet is open or closed.",
				values: '"open" | "closed"',
				appliesTo: "Overlay, Content",
			},
			{
				name: "data-side",
				description: "Reflects the edge the sheet slides from.",
				values: '"top" | "bottom"',
				appliesTo: "Content",
			},
			{
				name: "data-dragging",
				description:
					"Present while the sheet is being dragged; useful to disable transitions mid-drag.",
				appliesTo: "Content",
			},
			{
				name: "data-sheet-handle",
				description:
					"Marks the drag handle element — the grab target for swipe-to-dismiss and snap-point dragging.",
				appliesTo: "Handle",
			},
		],
		frameworks: {
			react: {
				importStatement: "import { Sheet } from '@wire-ui/react'",
				basicExample:
					"<Sheet.Root snapPoints={[0.4]}>\n  <Sheet.Trigger>Open sheet</Sheet.Trigger>\n  <Sheet.Portal>\n    <Sheet.Overlay />\n    <Sheet.Content>\n      <Sheet.Handle />\n      <Sheet.Title>Bottom sheet</Sheet.Title>\n      <Sheet.Description>Drag the handle to dismiss.</Sheet.Description>\n      <Sheet.Close>Done</Sheet.Close>\n    </Sheet.Content>\n  </Sheet.Portal>\n</Sheet.Root>",
			},
			solid: {
				importStatement: "import { Sheet } from '@wire-ui/solid'",
				basicExample:
					"<Sheet.Root snapPoints={[0.4]}>\n  <Sheet.Trigger>Open sheet</Sheet.Trigger>\n  <Sheet.Portal>\n    <Sheet.Overlay />\n    <Sheet.Content>\n      <Sheet.Handle />\n      <Sheet.Title>Bottom sheet</Sheet.Title>\n      <Sheet.Close>Done</Sheet.Close>\n    </Sheet.Content>\n  </Sheet.Portal>\n</Sheet.Root>",
			},
			vue: {
				importStatement: "import { Sheet } from '@wire-ui/vue'",
				basicExample:
					'<template>\n  <Sheet.Root :snap-points="[0.4]">\n    <Sheet.Trigger>Open sheet</Sheet.Trigger>\n    <Sheet.Portal>\n      <Sheet.Overlay />\n      <Sheet.Content>\n        <Sheet.Handle />\n        <Sheet.Title>Bottom sheet</Sheet.Title>\n        <Sheet.Close>Done</Sheet.Close>\n      </Sheet.Content>\n    </Sheet.Portal>\n  </Sheet.Root>\n</template>',
			},
		},
		notes: [
			"Modal by default: focus trap + scroll lock. Set modal={false} for a non-modal sheet.",
			"Drag the Handle to snap between the configured snapPoints; flicking past the smallest snap dismisses when dismissible.",
		],
	},

	{
		name: "Stat",
		category: "display",
		description:
			"A KPI / metric display: label, value, a delta that exposes data-direction (increase / decrease / neutral), help text, and a built-in inline Sparkline.",
		isCompound: true,
		parts: ["Root", "Label", "Value", "Delta", "HelpText", "Sparkline"],
		props: {
			Delta: [
				{
					name: "value",
					type: "number",
					required: false,
					description:
						"Numeric change — its sign derives direction when direction is omitted, and renders when there are no children.",
				},
				{
					name: "direction",
					type: '"increase" | "decrease" | "neutral"',
					required: false,
					description:
						"Force the direction; otherwise inferred from value.",
				},
			],
			Sparkline: [
				{
					name: "data",
					type: "number[]",
					required: true,
					description: "Series of values to plot.",
				},
				{
					name: "width",
					type: "number",
					required: false,
					description: "Viewport width in px.",
					defaultValue: "100",
				},
				{
					name: "height",
					type: "number",
					required: false,
					description: "Viewport height in px.",
					defaultValue: "24",
				},
				{
					name: "strokeWidth",
					type: "number",
					required: false,
					description: "Stroke width of the line.",
					defaultValue: "1.5",
				},
			],
		},
		dataAttributes: [
			{
				name: "data-direction",
				description:
					"Reflects the delta direction, resolved from direction or the sign of value.",
				values: '"increase" | "decrease" | "neutral"',
				appliesTo: "Delta",
			},
		],
		frameworks: {
			react: {
				importStatement: "import { Stat } from '@wire-ui/react'",
				basicExample:
					"<Stat.Root>\n  <Stat.Label>Monthly revenue</Stat.Label>\n  <Stat.Value>$48,250</Stat.Value>\n  <Stat.Delta value={12.5}>▲ 12.5%</Stat.Delta>\n  <Stat.HelpText>vs. previous month</Stat.HelpText>\n</Stat.Root>",
			},
			solid: {
				importStatement: "import { Stat } from '@wire-ui/solid'",
				basicExample:
					"<Stat.Root>\n  <Stat.Label>Monthly revenue</Stat.Label>\n  <Stat.Value>$48,250</Stat.Value>\n  <Stat.Delta value={12.5}>▲ 12.5%</Stat.Delta>\n  <Stat.HelpText>vs. previous month</Stat.HelpText>\n</Stat.Root>",
			},
			vue: {
				importStatement: "import { Stat } from '@wire-ui/vue'",
				basicExample:
					'<template>\n  <Stat.Root>\n    <Stat.Label>Monthly revenue</Stat.Label>\n    <Stat.Value>$48,250</Stat.Value>\n    <Stat.Delta :value="12.5">▲ 12.5%</Stat.Delta>\n    <Stat.HelpText>vs. previous month</Stat.HelpText>\n  </Stat.Root>\n</template>',
			},
		},
		notes: [
			"Delta renders its value as text automatically when no children are provided.",
		],
	},

	{
		name: "Stepper",
		category: "navigation",
		description:
			"Multi-step / wizard flow. Steps expose data-state (active / completed / inactive); navigate with triggers or the built-in Prev/Next buttons. Set linear to prevent skipping ahead.",
		isCompound: true,
		parts: [
			"Root",
			"List",
			"Item",
			"Trigger",
			"Separator",
			"Content",
			"PrevTrigger",
			"NextTrigger",
		],
		props: {
			Root: [
				{
					name: "count",
					type: "number",
					required: true,
					description:
						"Total number of steps (used to clamp next/prev).",
				},
				{
					name: "value",
					type: "number",
					required: false,
					description: "Controlled current step (0-based).",
				},
				{
					name: "defaultValue",
					type: "number",
					required: false,
					description: "Initial current step (uncontrolled).",
					defaultValue: "0",
				},
				{
					name: "onChange",
					type: "(index: number) => void",
					required: false,
					description: "Called when the current step changes.",
				},
				{
					name: "orientation",
					type: '"horizontal" | "vertical"',
					required: false,
					description: "Layout orientation.",
					defaultValue: "horizontal",
				},
				{
					name: "linear",
					type: "boolean",
					required: false,
					description:
						"Prevent jumping to steps ahead of the current one.",
					defaultValue: "false",
				},
			],
			Item: [
				{
					name: "index",
					type: "number",
					required: true,
					description: "0-based position of this step.",
				},
			],
			Content: [
				{
					name: "index",
					type: "number",
					required: true,
					description: "Step index this panel belongs to.",
				},
				{
					name: "forceMount",
					type: "boolean",
					required: false,
					description: "Keep mounted when inactive.",
					defaultValue: "false",
				},
			],
		},
		dataAttributes: [
			{
				name: "data-state",
				description:
					"Reflects the step's status relative to the current step.",
				values: '"active" | "completed" | "inactive"',
				appliesTo: "Item, Trigger, Separator, Content",
			},
			{
				name: "data-index",
				description: "The 0-based index of the step.",
				appliesTo: "Item, Content",
			},
			{
				name: "data-orientation",
				description: "Reflects the layout orientation.",
				values: '"horizontal" | "vertical"',
				appliesTo: "Root, List, Separator",
			},
		],
		frameworks: {
			react: {
				importStatement: "import { Stepper } from '@wire-ui/react'",
				basicExample:
					"<Stepper.Root count={3} value={step} onChange={setStep}>\n  <Stepper.List>\n    {['Account', 'Profile', 'Review'].map((title, i) => (\n      <Stepper.Item key={title} index={i}>\n        <Stepper.Trigger>{title}</Stepper.Trigger>\n        {i < 2 && <Stepper.Separator />}\n      </Stepper.Item>\n    ))}\n  </Stepper.List>\n  <Stepper.PrevTrigger>Back</Stepper.PrevTrigger>\n  <Stepper.NextTrigger>Next</Stepper.NextTrigger>\n</Stepper.Root>",
			},
			solid: {
				importStatement: "import { Stepper } from '@wire-ui/solid'",
				basicExample:
					"<Stepper.Root count={3} value={step()} onChange={setStep}>\n  <Stepper.List>\n    <For each={['Account', 'Profile', 'Review']}>\n      {(title, i) => (\n        <Stepper.Item index={i()}>\n          <Stepper.Trigger>{title}</Stepper.Trigger>\n          {i() < 2 && <Stepper.Separator />}\n        </Stepper.Item>\n      )}\n    </For>\n  </Stepper.List>\n  <Stepper.PrevTrigger>Back</Stepper.PrevTrigger>\n  <Stepper.NextTrigger>Next</Stepper.NextTrigger>\n</Stepper.Root>",
			},
			vue: {
				importStatement: "import { Stepper } from '@wire-ui/vue'",
				basicExample:
					'<template>\n  <Stepper.Root :count="3" :value="step" @change="step = $event">\n    <Stepper.List>\n      <Stepper.Item v-for="(title, i) in titles" :key="title" :index="i">\n        <Stepper.Trigger>{{ title }}</Stepper.Trigger>\n        <Stepper.Separator v-if="i < 2" />\n      </Stepper.Item>\n    </Stepper.List>\n    <Stepper.PrevTrigger>Back</Stepper.PrevTrigger>\n    <Stepper.NextTrigger>Next</Stepper.NextTrigger>\n  </Stepper.Root>\n</template>',
			},
		},
		notes: [
			"When linear is set, Triggers for steps ahead of the current one are disabled to prevent skipping.",
			"Content panels unmount when inactive unless forceMount is set (then they are hidden via the hidden attribute).",
		],
	},

	{
		name: "Toggle",
		category: "form",
		description:
			'A two-state pressable button (aria-pressed, data-state="on"|"off"). Use it standalone, or drop several inside ToggleGroup.Root (single or multiple selection) for a segmented control / formatting pill bar. Distinct from Switch, which is a settings on/off control.',
		isCompound: true,
		parts: ["Toggle", "ToggleGroup.Root", "ToggleGroup.Item"],
		props: {
			Toggle: [
				{
					name: "pressed",
					type: "boolean",
					required: false,
					description: "Controlled pressed state (standalone use).",
				},
				{
					name: "defaultPressed",
					type: "boolean",
					required: false,
					description:
						"Initial pressed state (uncontrolled, standalone use).",
					defaultValue: "false",
				},
				{
					name: "onPressedChange",
					type: "(pressed: boolean) => void",
					required: false,
					description:
						"Called when the pressed state changes (standalone use).",
				},
				{
					name: "value",
					type: "string",
					required: false,
					description:
						"Identity within a ToggleGroup.Root. When set inside a group, the group owns the pressed state.",
				},
				{
					name: "disabled",
					type: "boolean",
					required: false,
					description: "Disable the toggle.",
					defaultValue: "false",
				},
			],
			ToggleGroup: [
				{
					name: "type",
					type: '"single" | "multiple"',
					required: true,
					description:
						"Selection mode: a single active value, or multiple active values.",
				},
				{
					name: "value",
					type: "string | null | string[]",
					required: false,
					description:
						"Controlled selected value(s). For single, a string or null; for multiple, a string[].",
				},
				{
					name: "defaultValue",
					type: "string | null | string[]",
					required: false,
					description: "Initial selected value(s) (uncontrolled).",
				},
				{
					name: "onChange",
					type: "(value: string | null | string[]) => void",
					required: false,
					description:
						"Called when the selection changes. Receives string | null for single, string[] for multiple.",
				},
				{
					name: "disabled",
					type: "boolean",
					required: false,
					description: "Disable the whole group.",
					defaultValue: "false",
				},
				{
					name: "orientation",
					type: '"horizontal" | "vertical"',
					required: false,
					description: "Layout + arrow-key axis.",
					defaultValue: "horizontal",
				},
				{
					name: "loop",
					type: "boolean",
					required: false,
					description: "Wrap arrow-key focus.",
					defaultValue: "true",
				},
				{
					name: "rovingFocus",
					type: "boolean",
					required: false,
					description:
						"Manage focus as a single tab stop with arrow-key navigation.",
					defaultValue: "true",
				},
			],
		},
		dataAttributes: [
			{
				name: "data-state",
				description: "Pressed state of a Toggle.",
				values: '"on" | "off"',
				appliesTo: "Toggle",
			},
			{
				name: "data-disabled",
				description: "Present when the toggle or group is disabled.",
				appliesTo: "Toggle, ToggleGroup.Root",
			},
			{
				name: "data-orientation",
				description: "Layout/arrow-key axis of the group.",
				values: '"horizontal" | "vertical"',
				appliesTo: "ToggleGroup.Root",
			},
		],
		frameworks: {
			react: {
				importStatement:
					"import { Toggle, ToggleGroup } from '@wire-ui/react'",
				basicExample:
					'<Toggle aria-label="Italic"><i>I</i></Toggle>\n\n<ToggleGroup.Root type="single" defaultValue="center" aria-label="Alignment">\n  <Toggle value="left">⬅</Toggle>\n  <Toggle value="center">↔</Toggle>\n  <Toggle value="right">➡</Toggle>\n</ToggleGroup.Root>',
			},
			solid: {
				importStatement:
					"import { Toggle, ToggleGroup } from '@wire-ui/solid'",
				basicExample:
					'<Toggle aria-label="Italic"><i>I</i></Toggle>\n\n<ToggleGroup.Root type="single" value={align()} onChange={setAlign} aria-label="Alignment">\n  <Toggle value="left">⬅</Toggle>\n  <Toggle value="center">↔</Toggle>\n  <Toggle value="right">➡</Toggle>\n</ToggleGroup.Root>',
			},
			vue: {
				importStatement:
					"import { Toggle, ToggleGroup } from '@wire-ui/vue'",
				basicExample:
					'<template>\n  <Toggle aria-label="Italic"><i>I</i></Toggle>\n\n  <ToggleGroup.Root type="single" :value="align" aria-label="Alignment" @change="align = $event">\n    <Toggle value="left">⬅</Toggle>\n    <Toggle value="center">↔</Toggle>\n    <Toggle value="right">➡</Toggle>\n  </ToggleGroup.Root>\n</template>',
			},
		},
		notes: [
			"Two exports: a standalone Toggle (two-state pressable button) and a compound ToggleGroup (ToggleGroup.Root).",
			"ToggleGroup.Item is not a distinct export — items are plain Toggle components given a `value` and placed inside ToggleGroup.Root; the group then owns their pressed state.",
			"ToggleGroup.Root supports single vs multiple selection via the `type` prop; onChange receives string | null for single and string[] for multiple.",
			"Distinct from Switch: Toggle is a pressable on/off button, Switch is a settings control.",
		],
	},

	{
		name: "Typewriter",
		category: "display",
		description:
			"Token-by-token text reveal with cursor state and configurable cadence. Streaming-aware — grow the text prop as tokens arrive and the reveal continues from where it left off. Respects prefers-reduced-motion.",
		isCompound: true,
		parts: ["Root", "Text", "Cursor"],
		props: {
			Root: [
				{
					name: "text",
					type: "string",
					required: true,
					description:
						"Full text to reveal. Grow this value over time (e.g. from a streamed response) and the reveal continues from where it left off.",
				},
				{
					name: "speed",
					type: "number",
					required: false,
					description:
						"Milliseconds per revealed token (char or word).",
					defaultValue: "30",
				},
				{
					name: "mode",
					type: '"char" | "word"',
					required: false,
					description:
						"Reveal one character or one whole word per tick.",
					defaultValue: "char",
				},
				{
					name: "startDelay",
					type: "number",
					required: false,
					description:
						"Delay in ms before the first token is revealed.",
					defaultValue: "0",
				},
				{
					name: "autoStart",
					type: "boolean",
					required: false,
					description: "Begin revealing automatically on mount.",
					defaultValue: "true",
				},
				{
					name: "resetOnTextChange",
					type: "boolean",
					required: false,
					description:
						"Restart from the beginning whenever text changes instead of continuing. Leave false for streaming.",
					defaultValue: "false",
				},
				{
					name: "loop",
					type: "boolean",
					required: false,
					description: "Clear and retype once complete.",
					defaultValue: "false",
				},
				{
					name: "loopDelay",
					type: "number",
					required: false,
					description: "ms to wait before looping when loop is set.",
					defaultValue: "1000",
				},
				{
					name: "onComplete",
					type: "() => void",
					required: false,
					description: "Called once all text has been revealed.",
				},
				{
					name: "children",
					type: "React.ReactNode | ((state: { displayed: string; isTyping: boolean; isDone: boolean; progress: number }) => React.ReactNode)",
					required: false,
					description:
						"Either standard children (compose with Typewriter.Text / Typewriter.Cursor) or a render function receiving the current reveal state. When omitted, the revealed text is rendered directly.",
				},
			],
			Cursor: [
				{
					name: "keepMounted",
					type: "boolean",
					required: false,
					description:
						"Keep the cursor mounted after typing finishes. When false (default) the cursor unmounts once isDone is true.",
					defaultValue: "false",
				},
			],
		},
		dataAttributes: [
			{
				name: "data-state",
				description:
					"Whether the reveal is still running. Note the values are typing/done, not the usual open/closed pair.",
				values: '"typing" | "done"',
				appliesTo: "Root, Text, Cursor",
			},
		],
		frameworks: {
			react: {
				importStatement: "import { Typewriter } from '@wire-ui/react'",
				basicExample:
					'<Typewriter.Root text="Composing a reply…" speed={35}>\n  <Typewriter.Text />\n  <Typewriter.Cursor keepMounted>▋</Typewriter.Cursor>\n</Typewriter.Root>',
			},
			solid: {
				importStatement: "import { Typewriter } from '@wire-ui/solid'",
				basicExample:
					"<Typewriter.Root text={text()} speed={35}>\n  <Typewriter.Text />\n  <Typewriter.Cursor keepMounted>▋</Typewriter.Cursor>\n</Typewriter.Root>",
			},
			vue: {
				importStatement: "import { Typewriter } from '@wire-ui/vue'",
				basicExample:
					'<template>\n  <Typewriter.Root text="Composing a reply…" :speed="35">\n    <Typewriter.Text />\n    <Typewriter.Cursor keep-mounted>▋</Typewriter.Cursor>\n  </Typewriter.Root>\n</template>',
			},
		},
		notes: [
			"Streaming-aware: append tokens to text over time and the reveal continues from where it left off (keep resetOnTextChange false).",
			"Root.children may also be a render function receiving { displayed, isTyping, isDone, progress } to drive custom UI.",
			"When Root has no children it renders the revealed text directly; otherwise compose Typewriter.Text and Typewriter.Cursor. Cursor unmounts once typing is done unless keepMounted is set.",
		],
	},

	{
		name: "Virtualizer",
		category: "layout",
		description:
			"A windowing primitive: renders only the items in view (plus overscan), measuring real sizes as they appear. Used as Virtualizer.Root with a render-prop child. Supports vertical and horizontal axes.",
		isCompound: true,
		parts: ["Root"],
		props: {
			Root: [
				{
					name: "count",
					type: "number",
					required: true,
					description: "Total number of items.",
				},
				{
					name: "estimateSize",
					type: "number",
					required: false,
					description: "Estimated item size (px) before measurement.",
					defaultValue: "50",
				},
				{
					name: "overscan",
					type: "number",
					required: false,
					description:
						"Extra items rendered beyond the viewport on each side.",
					defaultValue: "4",
				},
				{
					name: "orientation",
					type: '"vertical" | "horizontal"',
					required: false,
					description: "Scroll axis.",
					defaultValue: "vertical",
				},
				{
					name: "getItemKey",
					type: "(index: number) => React.Key",
					required: false,
					description:
						"Stable key per index (helps when the list reorders). Defaults to the index.",
				},
				{
					name: "children",
					type: "(item: { index: number; start: number; size: number }) => React.ReactNode",
					required: true,
					description:
						"Render a single item. Receives a VirtualItem with index, start (offset from the start of the list along the scroll axis, px) and size (measured or estimated size, px).",
				},
			],
		},
		dataAttributes: [
			{
				name: "data-orientation",
				description: "Scroll axis of the virtualized container.",
				values: '"vertical" | "horizontal"',
				appliesTo: "Root",
			},
			{
				name: "data-virtualizer-sizer",
				description:
					"Marks the spacer element that gives the scroll container its full virtual height/width.",
				appliesTo: "Root",
			},
			{
				name: "data-virtual-item",
				description: "Marks each rendered (windowed) item wrapper.",
				appliesTo: "item",
			},
			{
				name: "data-index",
				description: "Index of each rendered (windowed) item.",
				appliesTo: "item",
			},
		],
		frameworks: {
			react: {
				importStatement: "import { Virtualizer } from '@wire-ui/react'",
				basicExample:
					'<Virtualizer.Root count={10000} estimateSize={44} className="h-80 w-72">\n  {({ index }) => <div>Item number {index}</div>}\n</Virtualizer.Root>',
			},
			solid: {
				importStatement: "import { Virtualizer } from '@wire-ui/solid'",
				basicExample:
					'<Virtualizer.Root count={10000} estimateSize={44} class="h-80 w-72">\n  {({ index }) => <div>Item number {index}</div>}\n</Virtualizer.Root>',
			},
			vue: {
				importStatement: "import { Virtualizer } from '@wire-ui/vue'",
				basicExample:
					'<template>\n  <Virtualizer.Root :count="10000" :estimate-size="44" class="h-80 w-72">\n    <template #default="{ index }">\n      <div>Item number {{ index }}</div>\n    </template>\n  </Virtualizer.Root>\n</template>',
			},
		},
		notes: [
			"Children is a function receiving a VirtualItem ({ index, start, size }).",
			"Item sizes are estimated via estimateSize, then measured for real with a ResizeObserver as items scroll into view, so variable heights/widths are supported.",
			'Set orientation="horizontal" for a horizontally scrolling window; overscan controls how many off-screen items are kept rendered on each side.',
		],
	},
];
