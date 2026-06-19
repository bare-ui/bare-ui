import { render } from '@solidjs/testing-library'
import { runParitySuite, TABS, tabsSuite } from '@wire-ui/parity-tests'
import { Tabs } from '../../components'

// Static one-shot fixtures, so plain `.map` in a helper is fine here (kept out
// of JSX to satisfy solid/prefer-for, which targets reactive lists).
const triggers = () =>
	TABS.tabs.map((t) => (
		<Tabs.Trigger value={t.value} disabled={t.disabled}>
			{t.label}
		</Tabs.Trigger>
	))

const panels = () => TABS.tabs.map((t) => <Tabs.Content value={t.value}>{t.panel}</Tabs.Content>)

runParitySuite('solid', tabsSuite, {
	default: () =>
		render(() => (
			<Tabs.Root defaultValue={TABS.defaultValue}>
				<Tabs.List>{triggers()}</Tabs.List>
				{panels()}
			</Tabs.Root>
		)),
})
