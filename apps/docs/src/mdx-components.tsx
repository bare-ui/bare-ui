import { useMDXComponents as getDocsMDXComponents } from 'nextra-theme-docs'
import { ComponentPreview } from './components/component-preview'

export function useMDXComponents(components?: Record<string, React.FC>) {
  return getDocsMDXComponents({
    ComponentPreview,
    ...components,
  })
}
