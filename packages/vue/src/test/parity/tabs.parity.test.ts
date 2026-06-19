import { render } from '@testing-library/vue'
import { runParitySuite, TABS, tabsSuite } from '@wire-ui/parity-tests'
import { h } from 'vue'
import { Tabs } from '../../components'

runParitySuite('vue', tabsSuite, {
	default: () =>
		render({
			setup: () => () =>
				h(Tabs.Root, { defaultValue: TABS.defaultValue }, () => [
					h(Tabs.List, null, () =>
						TABS.tabs.map((t) =>
							h(Tabs.Trigger, { value: t.value, disabled: t.disabled }, () => t.label),
						),
					),
					...TABS.tabs.map((t) => h(Tabs.Content, { value: t.value }, () => t.panel)),
				]),
		}),
})
