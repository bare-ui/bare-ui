import { render } from '@testing-library/react'
import { runParitySuite, TABS, tabsSuite } from '@wire-ui/parity-tests'
import { Tabs } from '../../components'

runParitySuite('react', tabsSuite, {
	default: () =>
		render(
			<Tabs.Root defaultValue={TABS.defaultValue}>
				<Tabs.List>
					{TABS.tabs.map((t) => (
						<Tabs.Trigger key={t.value} value={t.value} disabled={t.disabled}>
							{t.label}
						</Tabs.Trigger>
					))}
				</Tabs.List>
				{TABS.tabs.map((t) => (
					<Tabs.Content key={t.value} value={t.value}>
						{t.panel}
					</Tabs.Content>
				))}
			</Tabs.Root>,
		),
})
