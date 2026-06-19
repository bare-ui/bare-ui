import { newTitle } from '@/components/new-badge'

export default {
  '-- overview': {
    type: 'separator',
    title: 'Overview',
  },
  index: 'Introduction',
  'getting-started': 'Getting Started',
  faq: 'FAQ',
  accessibility: 'Accessibility',
  'wcag-compliance': { title: newTitle('WCAG 2.2 AA') },
  'data-attributes': 'Data Attributes',
  'browser-support': 'Browser Support',
  'bundle-size': { title: newTitle('Bundle Size') },
  internationalization: { title: newTitle('Internationalization') },
  'form-integration': { title: newTitle('Form Integration') },
  changelog: {
    title: 'Changelog',
    href: 'https://github.com/wire-ui/wire-ui/blob/main/packages/react/CHANGELOG.md',
  },
  '-- ai': {
    type: 'separator',
    title: 'AI for Agents',
  },
  ai: {
    title: 'AI',
    display: 'children',
  },
  '-- api-reference': {
    type: 'separator',
    title: 'API Reference',
  },
  'api-parity': { title: newTitle('API Parity') },
  components: 'Components',
  hooks: 'Hooks / Composables / Primitives',
  '-- migration': {
    type: 'separator',
    title: newTitle('Migration'),
  },
  'migrating-from-radix': 'From Radix UI',
  'migrating-from-headless-ui': 'From Headless UI',
  'migrating-from-shadcn': 'From shadcn/ui',
  'migrating-from-chakra-mantine-mui': 'From Chakra / Mantine / MUI',
  '-- resources': {
    type: 'separator',
    title: 'Resources',
  },
  security: 'Security',
  author: 'Author',
  license: 'License',
  'code-of-conduct': 'Code of Conduct',
}
