import type { ComponentData } from "./types.js";

// ────────────────────────────────────────────────────────────────────
// Wire UI 0.2 component catalog — React, Solid, Vue
//
// Solid and Vue ship near-identical APIs to React, with these adaptations:
//   - Solid: signals (createSignal), call signal as function in JSX (value())
//   - Vue: SFC template syntax, kebab-case events (@open-change), ref() values
//
// Components only available in React are noted with a single `react` framework
// snippet. All others list all three frameworks.
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
					description:
						"Consumer-controlled error key. Sets data-invalid on the field.",
				},
				{
					name: "errorMessage",
					type: "Record<string, string>",
					required: false,
					description:
						"Map of invalidType keys to error message strings rendered by Input.Error.",
				},
				{
					name: "isRequired",
					type: "boolean",
					required: false,
					description: "Marks the field as required.",
				},
				{
					name: "isSuccess",
					type: "boolean",
					required: false,
					description: "Sets data-success on the field.",
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
					name: "isSuccess",
					type: "boolean",
					required: false,
					description: "Sets data-success on the field.",
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
					name: "isSuccess",
					type: "boolean",
					required: false,
					description: "Sets data-success on the field.",
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
			{
				name: "data-success",
				description: "Present when isSuccess is true.",
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
					type: "string[]",
					required: false,
					description: "Controlled selected values array.",
				},
				{
					name: "defaultValue",
					type: "string[]",
					required: false,
					description: "Uncontrolled default selected values.",
				},
				{
					name: "onChange",
					type: "(value: string[]) => void",
					required: false,
					description: "Called when the selection changes.",
				},
				{
					name: "disabled",
					type: "boolean",
					required: false,
					description: "Disables all checkbox items.",
				},
			],
			Item: [
				{
					name: "value",
					type: "string",
					required: true,
					description: "The value for this checkbox item.",
				},
			],
		},
		dataAttributes: [
			{
				name: "data-checked",
				description: "Present when the item is checked.",
				appliesTo: "Item",
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
					type: "string",
					required: false,
					description: "Controlled selected value.",
				},
				{
					name: "defaultValue",
					type: "string",
					required: false,
					description: "Uncontrolled default selected value.",
				},
				{
					name: "onChange",
					type: "(value: string) => void",
					required: false,
					description: "Called when the selection changes.",
				},
				{
					name: "name",
					type: "string",
					required: false,
					description: "HTML name attribute for the radio group.",
				},
				{
					name: "disabled",
					type: "boolean",
					required: false,
					description: "Disables all radio items.",
				},
			],
			Item: [
				{
					name: "value",
					type: "string",
					required: true,
					description: "The value for this radio item.",
				},
			],
		},
		dataAttributes: [
			{
				name: "data-checked",
				description: "Present when the item is selected.",
				appliesTo: "Item",
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
					name: "onCheckedChange",
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
				name: "data-state",
				description: "Reflects the switch state.",
				values: '"checked" | "unchecked"',
				appliesTo: "Root",
			},
			{
				name: "data-disabled",
				description: "Present when disabled.",
				appliesTo: "Root",
			},
		],
		frameworks: {
			react: {
				importStatement: "import { Switch } from '@wire-ui/react'",
				basicExample: `<Switch.Root checked={on} onCheckedChange={setOn}>
  <Switch.Thumb />
</Switch.Root>`,
			},
			solid: {
				importStatement: "import { Switch } from '@wire-ui/solid'",
				basicExample: `<Switch.Root checked={on()} onCheckedChange={setOn}>
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
			],
		},
		dataAttributes: [
			{
				name: "data-state",
				description: "Open/closed state of the dropdown.",
				values: '"open" | "closed"',
				appliesTo: "Trigger",
			},
			{
				name: "data-selected",
				description: "Present on the currently selected item.",
				appliesTo: "Item",
			},
			{
				name: "data-hover",
				description: "Present when hovering an item.",
				appliesTo: "Item",
			},
			{
				name: "data-disabled",
				description: "Present when an item is disabled.",
				appliesTo: "Item",
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
					name: "onSearchChange",
					type: "(query: string) => void",
					required: false,
					description: "Called when the search query changes.",
				},
				{
					name: "onSelect",
					type: "(option: any) => void",
					required: false,
					description: "Called when a result item is selected.",
				},
				{
					name: "loading",
					type: "boolean",
					required: false,
					description: "Indicates that results are loading.",
				},
				{
					name: "searchDelay",
					type: "number",
					required: false,
					description: "Debounce delay in milliseconds.",
				},
			],
			Item: [
				{
					name: "option",
					type: "any",
					required: true,
					description: "The option data object for this item.",
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
		parts: ["Root", "Input", "Trigger", "Content", "Item", "Empty"],
		props: {
			Root: [
				{
					name: "value",
					type: "string",
					required: false,
					description: "Controlled selected value.",
				},
				{
					name: "onChange",
					type: "(value: string) => void",
					required: false,
					description: "Called when a selection is made.",
				},
				{
					name: "onInputChange",
					type: "(query: string) => void",
					required: false,
					description: "Called when the input text changes.",
				},
			],
			Item: [
				{
					name: "value",
					type: "string",
					required: true,
					description: "Value for this option.",
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
				name: "data-highlighted",
				description: "Present on the keyboard-highlighted item.",
				appliesTo: "Item",
			},
			{
				name: "data-selected",
				description: "Present on the currently selected item.",
				appliesTo: "Item",
			},
		],
		frameworks: {
			react: {
				importStatement: "import { Combobox } from '@wire-ui/react'",
				basicExample: `<Combobox.Root value={value} onChange={setValue} onInputChange={setQuery}>
  <Combobox.Input placeholder="Type to filter..." />
  <Combobox.Trigger>▾</Combobox.Trigger>
  <Combobox.Content>
    {options.map(o => <Combobox.Item key={o.id} value={o.id}>{o.label}</Combobox.Item>)}
    <Combobox.Empty>No matches</Combobox.Empty>
  </Combobox.Content>
</Combobox.Root>`,
			},
			solid: {
				importStatement: "import { Combobox } from '@wire-ui/solid'",
				basicExample: `<Combobox.Root value={value()} onChange={setValue} onInputChange={setQuery}>
  <Combobox.Input placeholder="Type to filter..." />
  <Combobox.Trigger>▾</Combobox.Trigger>
  <Combobox.Content>
    <For each={options()}>{(o) => <Combobox.Item value={o.id}>{o.label}</Combobox.Item>}</For>
    <Combobox.Empty>No matches</Combobox.Empty>
  </Combobox.Content>
</Combobox.Root>`,
			},
			vue: {
				importStatement: "import { Combobox } from '@wire-ui/vue'",
				basicExample: `<template>
  <Combobox.Root :value="value" @change="value = $event" @input-change="setQuery">
    <Combobox.Input placeholder="Type to filter..." />
    <Combobox.Trigger>▾</Combobox.Trigger>
    <Combobox.Content>
      <Combobox.Item v-for="o in options" :key="o.id" :value="o.id">{{ o.label }}</Combobox.Item>
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
					name: "alphanumeric",
					type: "boolean",
					required: false,
					description: "Allow letters in addition to digits.",
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
				appliesTo: "Root",
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
				description: "Present on stars up to the current value.",
			},
			{
				name: "data-highlighted",
				description: "Present on stars up to the hovered value.",
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
			"Compound range slider with track, range, and one or more thumbs. React only.",
		isCompound: true,
		parts: ["Root", "Track", "Range", "Thumb"],
		props: {
			Root: [
				{
					name: "value",
					type: "number[]",
					required: false,
					description:
						"Controlled value array (one entry per thumb).",
				},
				{
					name: "defaultValue",
					type: "number[]",
					required: false,
					description: "Uncontrolled default value.",
				},
				{
					name: "onValueChange",
					type: "(value: number[]) => void",
					required: false,
					description: "Called when the value changes.",
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
					description: "Step amount.",
					defaultValue: "1",
				},
				{
					name: "orientation",
					type: '"horizontal" | "vertical"',
					required: false,
					description: "Slider orientation.",
					defaultValue: '"horizontal"',
				},
				{
					name: "disabled",
					type: "boolean",
					required: false,
					description: "Disables the slider.",
				},
			],
		},
		dataAttributes: [
			{
				name: "data-orientation",
				description: "Reflects the orientation prop.",
				values: '"horizontal" | "vertical"',
			},
			{
				name: "data-disabled",
				description: "Present when disabled.",
			},
		],
		frameworks: {
			react: {
				importStatement: "import { Slider } from '@wire-ui/react'",
				basicExample: `<Slider.Root defaultValue={[50]} min={0} max={100} step={1}>
  <Slider.Track>
    <Slider.Range />
  </Slider.Track>
  <Slider.Thumb />
</Slider.Root>`,
			},
		},
		notes: [
			"Multi-thumb: pass an array of values (e.g. defaultValue={[20, 80]}) and render multiple Slider.Thumb children.",
			"Slider is only available in @wire-ui/react.",
		],
	},

	{
		name: "TagInput",
		category: "form",
		description:
			"Compound token-style input. Enter/comma adds a tag; Backspace removes the last tag.",
		isCompound: true,
		parts: ["Root", "List", "Item", "Dismiss", "Input"],
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
					description: "Uncontrolled default tags.",
				},
				{
					name: "onChange",
					type: "(tags: string[]) => void",
					required: false,
					description: "Called when the tag list changes.",
				},
				{
					name: "maxTags",
					type: "number",
					required: false,
					description: "Maximum number of tags allowed.",
				},
				{
					name: "disabled",
					type: "boolean",
					required: false,
					description: "Disables tag input.",
				},
			],
		},
		dataAttributes: [
			{
				name: "data-disabled",
				description: "Present when the input is disabled.",
				appliesTo: "Root",
			},
		],
		frameworks: {
			react: {
				importStatement: "import { TagInput } from '@wire-ui/react'",
				basicExample: `<TagInput.Root value={tags} onChange={setTags}>
  <TagInput.List>
    {tags.map(t => (
      <TagInput.Item key={t} value={t}>
        {t} <TagInput.Dismiss value={t}>×</TagInput.Dismiss>
      </TagInput.Item>
    ))}
  </TagInput.List>
  <TagInput.Input placeholder="Add tag..." />
</TagInput.Root>`,
			},
			solid: {
				importStatement: "import { TagInput } from '@wire-ui/solid'",
				basicExample: `<TagInput.Root value={tags()} onChange={setTags}>
  <TagInput.List>
    <For each={tags()}>{(t) => (
      <TagInput.Item value={t}>
        {t} <TagInput.Dismiss value={t}>×</TagInput.Dismiss>
      </TagInput.Item>
    )}</For>
  </TagInput.List>
  <TagInput.Field placeholder="Add tag..." />
</TagInput.Root>`,
			},
			vue: {
				importStatement: "import { TagInput } from '@wire-ui/vue'",
				basicExample: `<template>
  <TagInput.Root :value="tags" @change="tags = $event">
    <TagInput.List>
      <TagInput.Item v-for="t in tags" :key="t" :value="t">
        {{ t }} <TagInput.Dismiss :value="t">×</TagInput.Dismiss>
      </TagInput.Item>
    </TagInput.List>
    <TagInput.Input placeholder="Add tag..." />
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
		parts: [
			"Root",
			"Input",
			"Trigger",
			"Dropzone",
			"List",
			"Item",
			"Clear",
		],
		props: {
			Root: [
				{
					name: "accept",
					type: "string",
					required: false,
					description:
						'MIME types or extensions to accept (e.g. "image/*").',
				},
				{
					name: "multiple",
					type: "boolean",
					required: false,
					description: "Allow multiple files.",
				},
				{
					name: "maxSize",
					type: "number",
					required: false,
					description: "Maximum file size in bytes.",
				},
				{
					name: "onChange",
					type: "(files: File[]) => void",
					required: false,
					description: "Called when the selected files change.",
				},
				{
					name: "disabled",
					type: "boolean",
					required: false,
					description: "Disables the uploader.",
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
  <FileUpload.List>
    {files.map(f => <FileUpload.Item key={f.name} file={f}>{f.name}</FileUpload.Item>)}
  </FileUpload.List>
  <FileUpload.Clear>Clear all</FileUpload.Clear>
</FileUpload.Root>`,
			},
			solid: {
				importStatement: "import { FileUpload } from '@wire-ui/solid'",
				basicExample: `<FileUpload.Root accept="image/*" multiple onChange={setFiles}>
  <FileUpload.Dropzone>
    Drop files here or <FileUpload.Trigger>browse</FileUpload.Trigger>
  </FileUpload.Dropzone>
  <FileUpload.Input />
  <FileUpload.Items />
</FileUpload.Root>`,
			},
			vue: {
				importStatement: "import { FileUpload } from '@wire-ui/vue'",
				basicExample: `<template>
  <FileUpload.Root accept="image/*" multiple @change="onChange">
    <FileUpload.Trigger>Choose files</FileUpload.Trigger>
    <FileUpload.Input />
    <FileUpload.List>
      <FileUpload.Item v-for="f in files" :key="f.name" :file="f">{{ f.name }}</FileUpload.Item>
    </FileUpload.List>
    <FileUpload.Clear>Clear</FileUpload.Clear>
  </FileUpload.Root>
</template>`,
			},
		},
	},

	{
		name: "DatePicker",
		category: "form",
		description:
			"Compound date picker — input/trigger plus a popover Calendar.",
		isCompound: true,
		parts: ["Root", "Trigger", "Input", "Content", "Calendar"],
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
					name: "min",
					type: "Date",
					required: false,
					description: "Minimum selectable date.",
				},
				{
					name: "max",
					type: "Date",
					required: false,
					description: "Maximum selectable date.",
				},
				{
					name: "format",
					type: "string",
					required: false,
					description: "Display format for the input value.",
				},
			],
		},
		dataAttributes: [
			{
				name: "data-state",
				description: "Open/closed state of the popover.",
				values: '"open" | "closed"',
				appliesTo: "Content",
			},
		],
		frameworks: {
			react: {
				importStatement: "import { DatePicker } from '@wire-ui/react'",
				basicExample: `<DatePicker.Root value={date} onChange={setDate}>
  <DatePicker.Trigger>
    <DatePicker.Input placeholder="Pick a date" />
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
      <DatePicker.Input placeholder="Pick a date" />
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
			"Compound form container with field-level validation slots, label/control/message parts.",
		isCompound: true,
		parts: [
			"Root",
			"Field",
			"Label",
			"Control",
			"Message",
			"Submit",
			"Description",
		],
		props: {
			Root: [
				{
					name: "onSubmit",
					type: "(values: Record<string, any>) => void",
					required: false,
					description: "Called when the form is submitted.",
				},
			],
			Field: [
				{
					name: "name",
					type: "string",
					required: true,
					description: "Field name. Used for value mapping.",
				},
				{
					name: "invalidType",
					type: "string",
					required: false,
					description: "Sets data-invalid when truthy.",
				},
				{
					name: "isRequired",
					type: "boolean",
					required: false,
					description: "Marks the field as required.",
				},
			],
		},
		dataAttributes: [
			{
				name: "data-invalid",
				description: "Present when the field has a validation error.",
				appliesTo: "Field",
			},
			{
				name: "data-required",
				description: "Present when the field is required.",
				appliesTo: "Field",
			},
			{
				name: "data-disabled",
				description: "Present when the field is disabled.",
				appliesTo: "Field",
			},
		],
		frameworks: {
			react: {
				importStatement: "import { Form } from '@wire-ui/react'",
				basicExample: `<Form.Root onSubmit={onSubmit}>
  <Form.Field name="email" isRequired>
    <Form.Label>Email</Form.Label>
    <Form.Control asChild>
      <input type="email" />
    </Form.Control>
    <Form.Message>Invalid email</Form.Message>
  </Form.Field>
  <Form.Submit>Send</Form.Submit>
</Form.Root>`,
			},
			solid: {
				importStatement: "import { Form } from '@wire-ui/solid'",
				basicExample: `<Form.Root onSubmit={onSubmit}>
  <Form.Field name="email" isRequired>
    <Form.Label>Email</Form.Label>
    <Form.Control>
      <input type="email" />
    </Form.Control>
    <Form.Error>Invalid email</Form.Error>
  </Form.Field>
</Form.Root>`,
			},
			vue: {
				importStatement: "import { Form } from '@wire-ui/vue'",
				basicExample: `<template>
  <Form.Root @submit="onSubmit">
    <Form.Field name="email" :is-required="true">
      <Form.Label>Email</Form.Label>
      <Form.Control>
        <input type="email" />
      </Form.Control>
      <Form.Message>Invalid email</Form.Message>
    </Form.Field>
    <Form.Submit>Send</Form.Submit>
  </Form.Root>
</template>`,
			},
		},
	},

	// ─── Overlay ────────────────────────────────────────────────────────

	{
		name: "Modal",
		category: "overlay",
		description:
			"Compound modal dialog with portal, overlay, content, and close parts.",
		isCompound: true,
		parts: ["Root", "Portal", "Overlay", "Content", "Close"],
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
					description: "Uncontrolled default open state.",
				},
				{
					name: "onOpenChange",
					type: "(open: boolean) => void",
					required: false,
					description: "Called when open state changes.",
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
					description: "Uncontrolled default open state.",
				},
				{
					name: "onOpenChange",
					type: "(open: boolean) => void",
					required: false,
					description: "Called when open state changes.",
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
			Root: [],
		},
		dataAttributes: [
			{
				name: "data-state",
				description: "Open/closed state of the menu.",
				values: '"open" | "closed"',
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
			Root: [],
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
				appliesTo: "Content",
			},
			{
				name: "data-highlighted",
				description: "Present on the keyboard-highlighted item.",
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
	},

	{
		name: "Popover",
		category: "overlay",
		description:
			"Compound floating popover anchored to a trigger with configurable side/align. React only.",
		isCompound: true,
		parts: ["Root", "Trigger", "Portal", "Content", "Close"],
		props: {
			Root: [
				{
					name: "open",
					type: "boolean",
					required: false,
					description: "Controlled open state.",
				},
				{
					name: "onOpenChange",
					type: "(open: boolean) => void",
					required: false,
					description: "Called when open state changes.",
				},
			],
			Content: [
				{
					name: "side",
					type: '"top" | "bottom" | "left" | "right"',
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
				description: "Resolved side after collision detection.",
				appliesTo: "Content",
			},
			{
				name: "data-align",
				description: "Resolved alignment.",
				appliesTo: "Content",
			},
		],
		frameworks: {
			react: {
				importStatement: "import { Popover } from '@wire-ui/react'",
				basicExample: `<Popover.Root>
  <Popover.Trigger>Open</Popover.Trigger>
  <Popover.Portal>
    <Popover.Content side="bottom" align="start">
      <p>Hello from a popover</p>
      <Popover.Close>Dismiss</Popover.Close>
    </Popover.Content>
  </Popover.Portal>
</Popover.Root>`,
			},
		},
		notes: ["Popover is only available in @wire-ui/react."],
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
	},

	{
		name: "Accordion",
		category: "overlay",
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
			],
			Item: [
				{
					name: "value",
					type: "string",
					required: true,
					description: "Unique value identifying this item.",
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
		parts: ["Root", "List", "Item", "Link", "Separator", "Ellipsis"],
		props: {
			Item: [
				{
					name: "isCurrent",
					type: "boolean",
					required: false,
					description:
						'Marks the item as the current page (aria-current="page").',
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
    <Breadcrumb.Item isCurrent>Components</Breadcrumb.Item>
  </Breadcrumb.List>
</Breadcrumb.Root>`,
			},
			solid: {
				importStatement: "import { Breadcrumb } from '@wire-ui/solid'",
				basicExample: `<Breadcrumb.Root>
  <Breadcrumb.List>
    <Breadcrumb.Item><Breadcrumb.Link href="/">Home</Breadcrumb.Link></Breadcrumb.Item>
    <Breadcrumb.Separator>/</Breadcrumb.Separator>
    <Breadcrumb.Item isCurrent>Components</Breadcrumb.Item>
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
      <Breadcrumb.Item :is-current="true">Components</Breadcrumb.Item>
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
			"Compound page navigation with first/prev/next/last and ellipsis items.",
		isCompound: true,
		parts: [
			"Root",
			"List",
			"Item",
			"Button",
			"Previous",
			"Next",
			"Ellipsis",
		],
		props: {
			Root: [
				{
					name: "page",
					type: "number",
					required: false,
					description: "Controlled current page (1-indexed).",
				},
				{
					name: "defaultPage",
					type: "number",
					required: false,
					description: "Uncontrolled default page.",
				},
				{
					name: "onPageChange",
					type: "(page: number) => void",
					required: false,
					description: "Called when the page changes.",
				},
				{
					name: "total",
					type: "number",
					required: true,
					description: "Total number of pages.",
				},
				{
					name: "siblingCount",
					type: "number",
					required: false,
					description:
						"Number of page buttons to show on either side of the current page.",
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
				basicExample: `<Pagination.Root page={page} onPageChange={setPage} total={20}>
  <Pagination.List>
    <Pagination.Previous>‹</Pagination.Previous>
    <Pagination.Item value={1}>1</Pagination.Item>
    <Pagination.Ellipsis />
    <Pagination.Item value={10}>10</Pagination.Item>
    <Pagination.Next>›</Pagination.Next>
  </Pagination.List>
</Pagination.Root>`,
			},
			solid: {
				importStatement:
					"import { Pagination, getPaginationItems } from '@wire-ui/solid'",
				basicExample: `<Pagination page={page()} onPageChange={setPage} total={20} />`,
			},
			vue: {
				importStatement: "import { Pagination } from '@wire-ui/vue'",
				basicExample: `<template>
  <Pagination :page="page" @page-change="page = $event" :total="20" />
</template>`,
			},
		},
	},

	{
		name: "Tabs",
		category: "navigation",
		description:
			"Compound tab list with keyboard arrow navigation. React only.",
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
					description: "Uncontrolled default value.",
				},
				{
					name: "onValueChange",
					type: "(value: string) => void",
					required: false,
					description: "Called when the active tab changes.",
				},
				{
					name: "orientation",
					type: '"horizontal" | "vertical"',
					required: false,
					description: "Tab list orientation.",
					defaultValue: '"horizontal"',
				},
			],
			Trigger: [
				{
					name: "value",
					type: "string",
					required: true,
					description: "Identifier matching the Content.value.",
				},
			],
			Content: [
				{
					name: "value",
					type: "string",
					required: true,
					description: "Identifier matching the Trigger.value.",
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
		},
		notes: ["Tabs is only available in @wire-ui/react."],
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
					name: "delayDuration",
					type: "number",
					required: false,
					description: "Delay in ms before opening on hover.",
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
		],
	},

	{
		name: "MenuBar",
		category: "navigation",
		description:
			"Compound horizontal application menu with cascading submenus and arrow-key navigation.",
		isCompound: true,
		parts: [
			"Root",
			"Menu",
			"Trigger",
			"Content",
			"Item",
			"Separator",
			"Sub",
			"SubTrigger",
			"SubContent",
		],
		props: {
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
				appliesTo: "Content, SubContent",
			},
		],
		frameworks: {
			react: {
				importStatement: "import { MenuBar } from '@wire-ui/react'",
				basicExample: `<MenuBar.Root>
  <MenuBar.Menu>
    <MenuBar.Trigger>File</MenuBar.Trigger>
    <MenuBar.Content>
      <MenuBar.Item onSelect={newDoc}>New</MenuBar.Item>
      <MenuBar.Item onSelect={openDoc}>Open</MenuBar.Item>
      <MenuBar.Separator />
      <MenuBar.Sub>
        <MenuBar.SubTrigger>Recent</MenuBar.SubTrigger>
        <MenuBar.SubContent>
          <MenuBar.Item>file-a.md</MenuBar.Item>
        </MenuBar.SubContent>
      </MenuBar.Sub>
    </MenuBar.Content>
  </MenuBar.Menu>
</MenuBar.Root>`,
			},
			solid: {
				importStatement: "import { MenuBar } from '@wire-ui/solid'",
				basicExample: `<MenuBar.Root>
  <MenuBar.Menu>
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
    <MenuBar.Menu>
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
	},

	// ─── Display ────────────────────────────────────────────────────────

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
					name: "dismissDuration",
					type: "number",
					required: false,
					description: "Duration in ms before auto-dismiss.",
				},
			],
		},
		dataAttributes: [
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
					name: "min",
					type: "Date",
					required: false,
					description: "Minimum selectable date.",
				},
				{
					name: "max",
					type: "Date",
					required: false,
					description: "Maximum selectable date.",
				},
			],
		},
		dataAttributes: [
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
			"Compound hierarchical disclosure tree with keyboard navigation and single/multi-select.",
		isCompound: true,
		parts: ["Root", "Item", "Trigger", "Content", "Label"],
		props: {
			Root: [
				{
					name: "selectionMode",
					type: '"single" | "multiple"',
					required: false,
					description: "Selection model.",
					defaultValue: '"single"',
				},
				{
					name: "value",
					type: "string | string[]",
					required: false,
					description: "Controlled selected item id(s).",
				},
				{
					name: "expandedValues",
					type: "string[]",
					required: false,
					description: "Controlled expanded item ids.",
				},
			],
			Item: [
				{
					name: "value",
					type: "string",
					required: true,
					description: "Unique identifier for the item.",
				},
			],
		},
		dataAttributes: [
			{
				name: "data-state",
				description: "Expanded/collapsed state.",
				values: '"open" | "closed"',
				appliesTo: "Item",
			},
			{
				name: "data-selected",
				description: "Present on the selected item.",
				appliesTo: "Item",
			},
			{
				name: "data-level",
				description: "Numeric nesting level starting at 0.",
				appliesTo: "Item",
			},
			{
				name: "data-has-children",
				description: "Present on parent nodes.",
				appliesTo: "Item",
			},
		],
		frameworks: {
			react: {
				importStatement: "import { TreeView } from '@wire-ui/react'",
				basicExample: `<TreeView.Root>
  <TreeView.Item value="src">
    <TreeView.Trigger>src</TreeView.Trigger>
    <TreeView.Content>
      <TreeView.Item value="src/index.ts">
        <TreeView.Label>index.ts</TreeView.Label>
      </TreeView.Item>
    </TreeView.Content>
  </TreeView.Item>
</TreeView.Root>`,
			},
			solid: {
				importStatement: "import { TreeView } from '@wire-ui/solid'",
				basicExample: `<TreeView.Root>
  <TreeView.Item value="src" label="src">
    <TreeView.Item value="src/index.ts" label="index.ts" />
  </TreeView.Item>
</TreeView.Root>`,
			},
			vue: {
				importStatement: "import { TreeView } from '@wire-ui/vue'",
				basicExample: `<template>
  <TreeView.Root>
    <TreeView.Item value="src">
      <TreeView.Trigger>src</TreeView.Trigger>
      <TreeView.Content>
        <TreeView.Item value="src/index.ts">
          <TreeView.Label>index.ts</TreeView.Label>
        </TreeView.Item>
      </TreeView.Content>
    </TreeView.Item>
  </TreeView.Root>
</template>`,
			},
		},
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
					name: "color",
					type: "string",
					required: false,
					description: "Sets data-color attribute.",
				},
				{
					name: "size",
					type: "string",
					required: false,
					description: "Sets data-size attribute.",
				},
				{
					name: "onRemove",
					type: "() => void",
					required: false,
					description: "Called when the remove button is clicked.",
				},
			],
		},
		dataAttributes: [
			{ name: "data-color", description: "Reflects the color prop." },
			{ name: "data-size", description: "Reflects the size prop." },
		],
		frameworks: {
			react: {
				importStatement: "import { Tag } from '@wire-ui/react'",
				basicExample: `<Tag.Root color="blue">
  <Tag.Label>Frontend</Tag.Label>
  <Tag.Remove onClick={onRemove}>×</Tag.Remove>
</Tag.Root>`,
			},
			solid: {
				importStatement: "import { Tag } from '@wire-ui/solid'",
				basicExample: `<Tag.Root color="blue">
  <Tag.Label>Frontend</Tag.Label>
  <Tag.Remove onClick={onRemove}>×</Tag.Remove>
</Tag.Root>`,
			},
			vue: {
				importStatement: "import { Tag } from '@wire-ui/vue'",
				basicExample: `<template>
  <Tag color="blue" @remove="onRemove">Frontend</Tag>
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
					name: "value",
					type: "number",
					required: false,
					description: "Current progress value.",
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
			],
		},
		dataAttributes: [
			{ name: "data-size", description: "Reflects size prop." },
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
			'Animated 12-dot loading spinner with role="status" and aria-label="Loading".',
		isCompound: false,
		parts: [],
		props: {
			Spinner: [
				{
					name: "size",
					type: '"small" | "medium" | "large"',
					required: false,
					description: "Spinner size.",
					defaultValue: '"medium"',
				},
				{
					name: "color",
					type: "string",
					required: false,
					description:
						"Color for the spinner dots, exposed as the --spinner-color CSS var.",
				},
			],
		},
		dataAttributes: [
			{ name: "data-size", description: "Reflects size prop." },
		],
		frameworks: {
			react: {
				importStatement: "import { Spinner } from '@wire-ui/react'",
				basicExample: `<Spinner size="medium" />`,
			},
			solid: {
				importStatement: "import { Spinner } from '@wire-ui/solid'",
				basicExample: `<Spinner size="medium" />`,
			},
			vue: {
				importStatement: "import { Spinner } from '@wire-ui/vue'",
				basicExample: `<template>
  <Spinner size="medium" />
</template>`,
			},
		},
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
					name: "isLoading",
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
				basicExample: `<Skeleton isLoading={loading}>
  <p>{data}</p>
</Skeleton>`,
			},
			solid: {
				importStatement: "import { Skeleton } from '@wire-ui/solid'",
				basicExample: `<Skeleton isLoading={loading()}>
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
		parts: [
			"Provider",
			"Viewport",
			"Root",
			"Title",
			"Description",
			"Action",
			"Close",
		],
		props: {
			Provider: [
				{
					name: "duration",
					type: "number",
					required: false,
					description: "Default auto-dismiss duration (ms).",
				},
				{
					name: "position",
					type: '"top-left" | "top-right" | "bottom-left" | "bottom-right"',
					required: false,
					description: "Viewport position.",
				},
			],
		},
		dataAttributes: [
			{
				name: "data-status",
				description:
					'Reflects status (e.g. "success" | "error" | "info").',
				appliesTo: "Root",
			},
		],
		frameworks: {
			react: {
				importStatement:
					"import { Toast, useToast } from '@wire-ui/react'",
				basicExample: `// Root: wrap your app
<Toast.Provider>
  <App />
  <Toast.Viewport />
</Toast.Provider>

// In a component
const { toast } = useToast();
toast({ title: 'Saved', status: 'success' });`,
			},
			solid: {
				importStatement:
					"import { Toast, useToast } from '@wire-ui/solid'",
				basicExample: `<Toast.Provider>
  <App />
  <Toast.Viewport />
</Toast.Provider>

const { toast } = useToast();
toast({ title: 'Saved', status: 'success' });`,
			},
			vue: {
				importStatement:
					"import { Toast, useToast } from '@wire-ui/vue'",
				basicExample: `<template>
  <Toast.Provider>
    <App />
    <Toast.Viewport />
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
			"Use the imperative toast() API for one-shot notifications.",
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
					name: "name",
					type: "string",
					required: true,
					description: "Icon name to look up in the icons map.",
				},
				{
					name: "icons",
					type: "Record<string, string>",
					required: true,
					description: "Map of icon names to SVG markup strings.",
				},
				{
					name: "size",
					type: "string",
					required: false,
					description:
						'Icon size preset (e.g. "small", "medium", "large").',
				},
			],
		},
		dataAttributes: [
			{ name: "data-size", description: "Reflects the size prop." },
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
		dataAttributes: [],
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
		dataAttributes: [],
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
		parts: ["Root", "Panel", "Handle"],
		props: {
			Root: [
				{
					name: "direction",
					type: '"horizontal" | "vertical"',
					required: false,
					description: "Direction the panels split along.",
					defaultValue: '"horizontal"',
				},
				{
					name: "onSizesChange",
					type: "(sizes: number[]) => void",
					required: false,
					description: "Called when panel sizes change.",
				},
			],
			Panel: [
				{
					name: "defaultSize",
					type: "number",
					required: false,
					description: "Initial size in percent.",
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
		},
		dataAttributes: [
			{
				name: "data-orientation",
				description: "Reflects direction.",
				appliesTo: "Root, Handle",
			},
		],
		frameworks: {
			react: {
				importStatement:
					"import { ResizablePanels } from '@wire-ui/react'",
				basicExample: `<ResizablePanels.Root direction="horizontal">
  <ResizablePanels.Panel defaultSize={30} minSize={20}>
    Sidebar
  </ResizablePanels.Panel>
  <ResizablePanels.Handle />
  <ResizablePanels.Panel defaultSize={70}>
    Content
  </ResizablePanels.Panel>
</ResizablePanels.Root>`,
			},
			solid: {
				importStatement:
					"import { ResizablePanels } from '@wire-ui/solid'",
				basicExample: `<ResizablePanels.Group direction="horizontal">
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
  <ResizablePanels.Root direction="horizontal">
    <ResizablePanels.Panel :default-size="30" :min-size="20">
      Sidebar
    </ResizablePanels.Panel>
    <ResizablePanels.Handle />
    <ResizablePanels.Panel :default-size="70">
      Content
    </ResizablePanels.Panel>
  </ResizablePanels.Root>
</template>`,
			},
		},
	},
];
