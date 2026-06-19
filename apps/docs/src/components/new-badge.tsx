import type { ReactNode } from 'react'

/**
 * Renders a sidebar nav title with a small "New" badge appended.
 *
 * Returns a plain host-element tree (not a custom component element) so the
 * result can live inside Nextra's `_meta` page map and serialize cleanly
 * across the RSC boundary into the client sidebar.
 *
 * Toggle a badge on/off by wrapping (or unwrapping) a title with this helper
 * in the relevant `_meta.tsx` file.
 */
export function newTitle(label: ReactNode): ReactNode {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5em' }}>
      {label}
      <span
        style={{
          fontSize: '0.625rem',
          fontWeight: 600,
          lineHeight: 1,
          padding: '0.3em 0.6em',
          borderRadius: '6px',
          background: '#6366f1',
          color: '#fff',
          textTransform: 'uppercase',
          letterSpacing: '0.03em',
        }}
      >
        New
      </span>
    </span>
  )
}
