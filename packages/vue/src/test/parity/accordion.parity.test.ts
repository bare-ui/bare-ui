import { render } from '@testing-library/vue'
import { ACCORDION, accordionSuite, runParitySuite } from '@wire-ui/parity-tests'
import { h } from 'vue'
import { Accordion } from '../../components'

const items = () =>
	ACCORDION.items.map((item) =>
		h(Accordion.Item, { value: item.value }, () => [
			h(Accordion.Trigger, null, () => item.trigger),
			h(Accordion.Content, null, () => item.content),
		]),
	)

runParitySuite('vue', accordionSuite, {
	single: () =>
		render({
			setup: () => () => h(Accordion.Root, { type: 'single', collapsible: true }, () => items()),
		}),
	multiple: () =>
		render({ setup: () => () => h(Accordion.Root, { type: 'multiple' }, () => items()) }),
})
