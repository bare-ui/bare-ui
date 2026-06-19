import { render } from '@testing-library/vue'
import { runParitySuite, switchSuite } from '@wire-ui/parity-tests'
import { h } from 'vue'
import { Switch } from '../../components'

runParitySuite('vue', switchSuite, {
	default: () => render({ setup: () => () => h(Switch.Root, null, () => h(Switch.Thumb)) }),
	defaultOn: () =>
		render({ setup: () => () => h(Switch.Root, { defaultChecked: true }, () => h(Switch.Thumb)) }),
	disabled: () =>
		render({ setup: () => () => h(Switch.Root, { disabled: true }, () => h(Switch.Thumb)) }),
})
