import type { ComponentData } from "./types.js";

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
					name: "onFocus",
					type: "() => void",
					required: false,
					description: "Called when the field receives focus.",
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
				{
					name: "id",
					type: "string",
					required: false,
					description: "Custom id for the field.",
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
    <Checkbox.Indicator>\\u2713</Checkbox.Indicator>
    <Checkbox.Label>Option A</Checkbox.Label>
  </Checkbox.Item>
</Checkbox.Root>`,
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
				{
					name: "starClassName",
					type: "string",
					required: false,
					description: "CSS class applied to each star element.",
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
          <Drawer.Close>\\u2715</Drawer.Close>
        </Drawer.Header>
        <p>Body</p>
      </Drawer.Content>
    </Drawer.Overlay>
  </Drawer.Portal>
</Drawer.Root>`,
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
		},
		notes: [
			'Use data-state="open"/"closed" to show/hide the menu. Use className="data-[state=closed]:hidden" to hide when closed.',
			"Do not use data-open/data-closed; use data-state instead.",
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
		dataAttributes: [],
		frameworks: {
			react: {
				importStatement: "import { Alert } from '@wire-ui/react'",
				basicExample: `<Alert.Root status="warning" onDismiss={() => setVisible(false)}>
  <Alert.Title>Warning</Alert.Title>
  <Alert.Description>Check your input.</Alert.Description>
  <Alert.Dismiss>\\u2715</Alert.Dismiss>
</Alert.Root>`,
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
		dataAttributes: [],
		frameworks: {
			react: {
				importStatement: "import { Badge } from '@wire-ui/react'",
				basicExample: `<Badge count={3} />`,
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
		},
	},

	{
		name: "ProgressBar",
		category: "display",
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
		dataAttributes: [],
		frameworks: {
			react: {
				importStatement: "import { ProgressBar } from '@wire-ui/react'",
				basicExample: `<ProgressBar percentage={65} />`,
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
		},
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
		dataAttributes: [],
		frameworks: {
			react: {
				importStatement: "import { Icon } from '@wire-ui/react'",
				basicExample: `<Icon name="check" icons={{ check: '<svg>...</svg>' }} size="medium" />`,
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
		dataAttributes: [],
		frameworks: {
			react: {
				importStatement: "import { List } from '@wire-ui/react'",
				basicExample: `<List>
  <li>Item 1</li>
  <li>Item 2</li>
</List>`,
			},
		},
	},
];
