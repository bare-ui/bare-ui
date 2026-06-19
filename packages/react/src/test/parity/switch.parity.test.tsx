import { render } from '@testing-library/react'
import { runParitySuite, switchSuite } from '@wire-ui/parity-tests'
import { Switch } from '../../components'

runParitySuite('react', switchSuite, {
	default: () =>
		render(
			<Switch.Root>
				<Switch.Thumb />
			</Switch.Root>,
		),
	defaultOn: () =>
		render(
			<Switch.Root defaultChecked>
				<Switch.Thumb />
			</Switch.Root>,
		),
	disabled: () =>
		render(
			<Switch.Root disabled>
				<Switch.Thumb />
			</Switch.Root>,
		),
})
