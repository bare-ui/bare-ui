'use client'

import { Search } from '@wire-ui/react'
import { useState } from 'react'

const mockItems = [
  { id: 1, title: 'React', subtitle: 'A JavaScript library for building user interfaces' },
  { id: 2, title: 'Vue', subtitle: 'The progressive JavaScript framework' },
  { id: 3, title: 'Angular', subtitle: 'Platform for building mobile and desktop apps' },
  { id: 4, title: 'Svelte', subtitle: 'Cybernetically enhanced web apps' },
  { id: 5, title: 'Next.js', subtitle: 'The React framework for production' },
]

export function SearchBasic() {
  const [query, setQuery] = useState('')
  const filtered = mockItems.filter((item) => item.title.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="flex justify-center p-6">
      <Search.Root
        value={query}
        onSearchChange={setQuery}
        onSelect={(option) => alert('Selected: ' + option.title)}
        className="relative w-80">
        <Search.Input
          placeholder="Search frameworks..."
          className="w-full rounded-[8px] border-2 border-black bg-white px-3 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-black focus:ring-offset-1"
        />
        <Search.Content className="absolute left-0 top-full z-10 mt-1 w-full rounded-[20px] border-[3px] border-black bg-white py-1">
          {filtered.map((item) => (
            <Search.Item
              key={item.id}
              option={item}
              className="cursor-pointer px-3 py-2 hover:bg-[#f5f5f5] data-[highlighted]:bg-[#f5f5f5]">
              <div className="text-sm font-medium text-black">{item.title}</div>
            </Search.Item>
          ))}
        </Search.Content>
      </Search.Root>
    </div>
  )
}

export function SearchComposed() {
  const [query, setQuery] = useState('')
  const filtered = mockItems.filter((item) => item.title.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="flex justify-center p-6">
      <Search.Root
        value={query}
        onSearchChange={setQuery}
        onSelect={(option) => alert('Selected: ' + option.title)}
        className="relative w-80">
        <Search.Input
          placeholder="Search frameworks..."
          className="w-full rounded-[8px] border-2 border-black bg-white px-3 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-black focus:ring-offset-1"
        />
        <Search.Content className="absolute left-0 top-full z-10 mt-1 w-full rounded-[20px] border-[3px] border-black bg-white py-1">
          {filtered.map((item) => (
            <Search.Item
              key={item.id}
              option={item}
              className="cursor-pointer px-3 py-2 hover:bg-[#f5f5f5] data-[highlighted]:bg-[#f5f5f5]">
              <div className="text-sm font-medium text-black">{item.title}</div>
              <div className="text-xs text-[#6b7280]">{item.subtitle}</div>
            </Search.Item>
          ))}
        </Search.Content>
      </Search.Root>
    </div>
  )
}

export function SearchComplex() {
  const [query, setQuery] = useState('')
  const filtered = mockItems.filter((item) => item.title.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="flex justify-center p-6">
      <Search.Root
        value={query}
        onSearchChange={setQuery}
        onSelect={(option) => alert('Selected: ' + option.title)}
        className="relative w-80">
        <Search.Input
          placeholder="Search frameworks..."
          className="w-full rounded-[8px] border-2 border-black bg-white px-3 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-black focus:ring-offset-1"
        />
        <Search.Content className="absolute left-0 top-full z-10 mt-1 w-full rounded-[20px] border-[3px] border-black bg-white py-1">
          {filtered.map((item) => (
            <Search.Item
              key={item.id}
              option={item}
              className="cursor-pointer px-3 py-2 hover:bg-[#f5f5f5] data-[highlighted]:bg-[#f5f5f5]">
              <div className="text-sm font-medium text-black">{item.title}</div>
              <div className="text-xs text-[#6b7280]">{item.subtitle}</div>
            </Search.Item>
          ))}
          <Search.Empty className="px-3 py-4 text-center text-sm text-[#6b7280]">No results found</Search.Empty>
        </Search.Content>
      </Search.Root>
    </div>
  )
}
