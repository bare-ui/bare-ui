/**
 * jscodeshift codemod: Radix UI → Wire UI (mechanical layer).
 *
 * Does the boring, always-safe 80%:
 *   1. Rewrites every `@radix-ui/react-*` import (and the unified `radix-ui`
 *      package) to a single `@wire-ui/react` import.
 *   2. Renames the component namespace where Wire UI uses a different name
 *      (Dialog → Modal, DropdownMenu → Dropdown, Separator → Divider, …) in
 *      both JSX (`<Dialog.Root>`) and plain member expressions (`Dialog.Root`).
 *
 * It deliberately does NOT restructure markup or rename parts/props. Overlays
 * especially (Dialog/AlertDialog → Modal) need hand edits afterward — there's no
 * `Trigger` part, `Content` nests inside `Overlay`, and `Title`/`Description`
 * become plain elements. Run this first, then fix what the compiler flags.
 *
 * Usage:
 *   npx jscodeshift -t scripts/codemods/radix-to-wire-ui.cjs --extensions=tsx,ts,jsx,js src/
 */

// Radix component (canonical PascalCase) → Wire UI component.
const RENAME = {
	Dialog: 'Modal',
	AlertDialog: 'Modal',
	DropdownMenu: 'Dropdown',
	Progress: 'ProgressBar',
	RadioGroup: 'Radio',
	Separator: 'Divider',
	Menubar: 'MenuBar',
	Collapsible: 'Accordion',
}

// Radix components Wire UI ships under the same name (import source changes only).
const SAME = new Set([
	'Accordion',
	'AspectRatio',
	'Avatar',
	'Checkbox',
	'ContextMenu',
	'HoverCard',
	'NavigationMenu',
	'Popover',
	'ScrollArea',
	'Select',
	'Slider',
	'Switch',
	'Tabs',
	'Toast',
	'Toggle',
	'ToggleGroup',
	'Toolbar',
	'Tooltip',
])

const WIRE_PKG = '@wire-ui/react'

/** `react-alert-dialog` → `AlertDialog` */
const toPascal = (kebab) =>
	kebab
		.split('-')
		.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
		.join('')

/** Radix canonical name → Wire UI name, or null if we don't map it. */
function wireNameFor(radixName) {
	if (RENAME[radixName]) return RENAME[radixName]
	if (SAME.has(radixName)) return radixName
	return null
}

module.exports = function transform(file, api) {
	const j = api.jscodeshift
	const root = j(file.source)

	const wireImports = new Set() // Wire UI component names to import
	const renames = new Map() // local namespace name → Wire UI name (for JSX/member rewrites)
	let touched = false

	root.find(j.ImportDeclaration).forEach((path) => {
		const source = path.node.source.value
		const radixMatch = typeof source === 'string' && source.match(/^@radix-ui\/react-(.+)$/)

		// Pattern A: `import * as Dialog from '@radix-ui/react-dialog'`
		if (radixMatch) {
			const radixName = toPascal(radixMatch[1])
			const wire = wireNameFor(radixName)
			if (!wire) return // unmapped Radix primitive — leave for manual review
			const spec = path.node.specifiers.find((s) => s.type === 'ImportNamespaceSpecifier')
			const local = spec ? spec.local.name : radixName
			wireImports.add(wire)
			if (local !== wire) renames.set(local, wire)
			j(path).remove()
			touched = true
			return
		}

		// Pattern B: `import { Dialog, Tabs as T } from 'radix-ui'`
		if (source === 'radix-ui') {
			let removedAll = true
			path.node.specifiers.forEach((s) => {
				if (s.type !== 'ImportSpecifier') {
					removedAll = false
					return
				}
				const wire = wireNameFor(s.imported.name)
				if (!wire) {
					removedAll = false
					return
				}
				wireImports.add(wire)
				if (s.local.name !== wire) renames.set(s.local.name, wire)
			})
			if (removedAll) j(path).remove()
			touched = true
		}
	})

	if (!touched) return file.source

	// Rename `<Local.Part>` (JSX) and `Local.Part` (member expressions).
	renames.forEach((wire, local) => {
		root
			.find(j.JSXIdentifier, { name: local })
			.filter((p) => p.parent.node.type === 'JSXMemberExpression' && p.parent.node.object === p.node)
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

	// Merge into a single `@wire-ui/react` import (reuse one if it exists).
	if (wireImports.size) {
		const existing = root
			.find(j.ImportDeclaration, { source: { value: WIRE_PKG } })
			.paths()[0]
		const have = new Set()
		if (existing) {
			existing.node.specifiers.forEach((s) => s.imported && have.add(s.imported.name))
		}
		const specifiers = [...wireImports]
			.filter((n) => !have.has(n))
			.sort()
			.map((n) => j.importSpecifier(j.identifier(n)))

		if (existing) {
			existing.node.specifiers.push(...specifiers)
		} else {
			const decl = j.importDeclaration(specifiers, j.literal(WIRE_PKG))
			const firstImport = root.find(j.ImportDeclaration).paths()[0]
			if (firstImport) j(firstImport).insertBefore(decl)
			else root.get().node.program.body.unshift(decl)
		}
	}

	return root.toSource({ quote: 'single' })
}
