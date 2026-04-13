import { inject, type InjectionKey } from 'vue'
import type { SearchContextValue } from './Search.types'

export const SearchKey: InjectionKey<SearchContextValue> = Symbol('SearchContext')

export function useSearchContext() {
  const ctx = inject(SearchKey)
  if (!ctx) throw new Error('Search compound components must be used within Search.Root')
  return ctx
}
