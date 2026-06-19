/**
 * jscodeshift codemod: Headless UI → Wire UI (mechanical layer).
 *
 * Headless UI exports named components from a single `@headlessui/react`
 * package, so this:
 *   1. Repoints those imports to `@wire-ui/react`.
 *   2. Renames the top-level component where Wire UI uses a different name
 *      (Menu → Dropdown, Dialog → Modal, Listbox → Select, Tab → Tabs, …) in
 *      both JSX and member expressions.
 *   3. Drops imports with no Wire UI equivalent (Transition, Portal helpers) so
 *      they surface as obvious removals rather than silent breakage.
 *
 * Headless UI's PART names differ more than Radix's (`Menu.Items` vs
 * `Dropdown.Menu`, `Dialog.Panel` vs `Modal.Content`), and its render-prop
 * children (`{({ open }) => …}`) become `data-state` styling. So expect more
 * hand cleanup here than the Radix codemod — run this, then let `tsc` guide you.
 *
 * Usage:
 *   npx jscodeshift -t https://wire-ui.com/codemods/headless-ui-to-wire-ui.cjs \
 *     --extensions=tsx,ts,jsx,js --parser=tsx src/
 */

const RENAME = {
	Menu: 'Dropdown',
	Dialog: 'Modal',
	Listbox: 'Select',
	Disclosure: 'Accordion',
	RadioGroup: 'Radio',
	Tab: 'Tabs',
}

const SAME = new Set(['Combobox', 'Popover', 'Switch', 'Button', 'Input', 'Select', 'Textarea', 'Checkbox'])

// No Wire UI equivalent — remove the import and let the dev decide what to do.
const DROP = new Set(['Transition', 'TransitionChild', 'Portal'])

const SOURCE = '@headlessui/react'
const WIRE_PKG = '@wire-ui/react'

function wireNameFor(name) {
	if (RENAME[name]) return RENAME[name]
	if (SAME.has(name)) return name
	return null
}

module.exports = function transform(file, api) {
	const j = api.jscodeshift
	const root = j(file.source)

	const wireImports = new Set()
	const renames = new Map()
	let touched = false

	root.find(j.ImportDeclaration, { source: { value: SOURCE } }).forEach((path) => {
		const keep = []
		path.node.specifiers.forEach((s) => {
			if (s.type !== 'ImportSpecifier') {
				keep.push(s)
				return
			}
			const imported = s.imported.name
			if (DROP.has(imported)) {
				touched = true
				return // remove it
			}
			const wire = wireNameFor(imported)
			if (!wire) {
				keep.push(s) // unmapped — leave it (will error, flagging manual work)
				return
			}
			wireImports.add(wire)
			if (s.local.name !== wire) renames.set(s.local.name, wire)
			touched = true
		})
		// Drop the Headless UI import entirely (mapped specifiers move to Wire UI).
		if (keep.length === 0) {
			j(path).remove()
		} else {
			path.node.specifiers = keep
		}
	})

	if (!touched) return file.source

	renames.forEach((wire, local) => {
		root
			.find(j.JSXIdentifier, { name: local })
			.filter((p) => p.parent.node.type === 'JSXMemberExpression' && p.parent.node.object === p.node)
			.forEach((p) => {
				p.node.name = wire
			})
		root
			.find(j.JSXIdentifier, { name: local })
			.filter((p) => p.parent.node.type === 'JSXOpeningElement' || p.parent.node.type === 'JSXClosingElement')
			.forEach((p) => {
				p.node.name = wire
			})
		root
			.find(j.Identifier, { name: local })
			.filter((p) => p.parent.node.type === 'MemberExpression' && p.parent.node.object === p.node)
			.forEach((p) => {
				p.node.name = wire
			})
	})

	if (wireImports.size) {
		const existing = root.find(j.ImportDeclaration, { source: { value: WIRE_PKG } }).paths()[0]
		const have = new Set()
		if (existing) existing.node.specifiers.forEach((s) => s.imported && have.add(s.imported.name))
		const specifiers = [...wireImports]
			.filter((n) => !have.has(n))
			.sort()
			.map((n) => j.importSpecifier(j.identifier(n)))
		if (existing) {
			existing.node.specifiers.push(...specifiers)
		} else {
			const decl = j.importDeclaration(specifiers, j.literal(WIRE_PKG))
			const first = root.find(j.ImportDeclaration).paths()[0]
			if (first) j(first).insertBefore(decl)
			else root.get().node.program.body.unshift(decl)
		}
	}

	return root.toSource({ quote: 'single' })
}
