'use client'

import { Accordion } from '@wire-ui/react'

const faqs = [
  { value: 'item-1', question: 'What is wire-ui?', answer: 'A headless component library. Zero styles shipped — you bring your own via className and data-attribute selectors.' },
  { value: 'item-2', question: 'How is it different from Headless UI?', answer: 'wire-ui uses the asChild pattern, exports useInteractiveState publicly, and uses data-focus-visible (keyboard only) instead of data-focus.' },
  { value: 'item-3', question: 'Does it support animations?', answer: 'Yes — pass forceMount to Accordion.Content and use CSS transitions on data-state. The grid-template-rows trick gives smooth height animations.' },
  { value: 'item-4', question: 'Can multiple items be open at once?', answer: 'Yes — use type="multiple" on Accordion.Root. With type="single" only one item is open at a time.' },
]

export function AccordionPreview() {
  return (
    <div className="p-6 flex justify-center">
      <Accordion.Root
        type="single"
        collapsible
        defaultValue="item-1"
        className="w-full max-w-lg divide-y-2 divide-black rounded-[20px] border-[3px] border-black bg-white overflow-hidden"
      >
        {faqs.map((faq) => (
          <Accordion.Item key={faq.value} value={faq.value}>
            <Accordion.Trigger className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium text-black outline-none transition-colors hover:bg-[#f5f5f5] data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50">
              {faq.question}
              <svg
                className="size-4 shrink-0 text-black transition-transform duration-200 data-[state=open]:rotate-180"
                data-state="inherit"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Accordion.Trigger>
            <Accordion.Content className="px-5 pb-4 text-sm leading-relaxed text-[#6b7280]">
              {faq.answer}
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </div>
  )
}
