import { render } from '@testing-library/react'
import { ACCORDION, accordionSuite, runParitySuite } from '@wire-ui/parity-tests'
import { Accordion } from '../../components'

const items = () =>
	ACCORDION.items.map((item) => (
		<Accordion.Item key={item.value} value={item.value}>
			<Accordion.Trigger>{item.trigger}</Accordion.Trigger>
			<Accordion.Content>{item.content}</Accordion.Content>
		</Accordion.Item>
	))

runParitySuite('react', accordionSuite, {
	single: () =>
		render(
			<Accordion.Root type='single' collapsible>
				{items()}
			</Accordion.Root>,
		),
	multiple: () => render(<Accordion.Root type='multiple'>{items()}</Accordion.Root>),
})
