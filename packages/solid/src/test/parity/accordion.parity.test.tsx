import { render } from '@solidjs/testing-library'
import { ACCORDION, accordionSuite, runParitySuite } from '@wire-ui/parity-tests'
import { Accordion } from '../../components'

const items = () =>
	ACCORDION.items.map((item) => (
		<Accordion.Item value={item.value}>
			<Accordion.Trigger>{item.trigger}</Accordion.Trigger>
			<Accordion.Content>{item.content}</Accordion.Content>
		</Accordion.Item>
	))

runParitySuite('solid', accordionSuite, {
	single: () =>
		render(() => (
			<Accordion.Root type='single' collapsible>
				{items()}
			</Accordion.Root>
		)),
	multiple: () => render(() => <Accordion.Root type='multiple'>{items()}</Accordion.Root>),
})
