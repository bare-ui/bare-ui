'use client'

import { useFramework, type Framework } from '../context/framework-context'

const FRAMEWORKS: { id: Framework; label: string; available: boolean }[] = [
  { id: 'react', label: 'React', available: true },
  { id: 'vue', label: 'Vue', available: true },
  { id: 'solid', label: 'Solid', available: false },
]

export function FrameworkSwitcher() {
  const { framework, setFramework } = useFramework()

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '2px',
        background: 'color-mix(in srgb, currentColor 6%, transparent)',
        borderRadius: '8px',
        padding: '3px',
        fontSize: '0.75rem',
        fontWeight: 500,
      }}
    >
      {FRAMEWORKS.map(({ id, label, available }) => {
        const isActive = framework === id

        return (
          <button
            key={id}
            disabled={!available}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              if (available) setFramework(id)
            }}
            title={!available ? `${label} — coming soon` : undefined}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 10px',
              borderRadius: '6px',
              border: 'none',
              cursor: available ? 'pointer' : 'not-allowed',
              fontWeight: isActive ? 600 : 400,
              fontSize: 'inherit',
              fontFamily: 'inherit',
              lineHeight: 1.5,
              transition: 'background 0.15s, color 0.15s',
              background: isActive
                ? 'color-mix(in srgb, currentColor 12%, transparent)'
                : 'transparent',
              color: available
                ? 'inherit'
                : 'color-mix(in srgb, currentColor 35%, transparent)',
              opacity: 1,
            }}
          >
            {label}
            {!available && (
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 500,
                  padding: '1px 5px',
                  borderRadius: '4px',
                  background: 'color-mix(in srgb, currentColor 8%, transparent)',
                  color: 'color-mix(in srgb, currentColor 45%, transparent)',
                  letterSpacing: '0.02em',
                  whiteSpace: 'nowrap',
                }}
              >
                Soon
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
