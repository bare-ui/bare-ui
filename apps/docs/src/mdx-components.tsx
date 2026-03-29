import { useMDXComponents as getDocsMDXComponents } from 'nextra-theme-docs'
import { ComponentPreviewServer as ComponentPreview } from './components/component-preview-server'

export function useMDXComponents(components?: Record<string, React.FC>) {
  return getDocsMDXComponents({
    ComponentPreview,
    ...components,
  })
}
